import bcrypt from "bcryptjs";
import {
  LOCK_TIME,
  MAX_LOGIN_ATTEMPTS,
  SALT_ROUNDS,
} from "../../constants/common.constants.js";
import { httpStatusConfig } from "../../config/http.config.js";
import Account from "../../models/user/auth/account.model.js";
import User from "../../models/user/auth/user.model.js";
import Role from "../../models/user/rbac/role.model.js";
import UserRole from "../../models/user/rbac/user.role.model.js";
import Profile from "../../models/user/profile/profile.model.js";
import SocialLink from "../../models/user/profile/social.model.js";
import VerificationToken from "../../models/user/auth/verification.token.model.js";
import { rbacService } from "../../services/rbac/rbac.service.js";
import { tokenService } from "../auth/token.service.js";
import { sessionService } from "../auth/session.service.js";
import { emailService } from "../email/email.service.js";
import { activityService } from "../activity/activity.service.js";
import AppError from "../../services/error/error.service.js";
import { getRemainingTime } from "../../utils/date.utils.js";
import { ROLES } from "../../constants/roles.constants.js";

class AuthService {
  async register(
    { email, password, userName, firstName, lastName },
    ipAddress,
  ) {
    const existingAccount = await Account.findOne({ email, provider: "local" });
    if (existingAccount) {
      throw AppError.conflict({
        message: "This email is already in use, please use a different email!",
        code: "USER ALREADY EXISTS",
        details: { email },
      });
    }

    const existingProfile = await Profile.findOne({
      userName: userName.toLowerCase(),
    });

    if (existingProfile) {
      throw AppError.conflict({
        message:
          "This userName is already in use, please use a different userName!",
        code: "USER ALREADY EXISTS",
        details: { userName },
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      emailVerified: false,
      status: "active",
    });

    await Account.create({
      user: user._id,
      provider: "local",
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const role = await Role.findOne({ name: ROLES.USER });

    await UserRole.create({
      user: user._id,
      role: role._id,
    });

    await Profile.create({
      user: user._id,
      userName: userName.toLowerCase(),
      firstName,
      lastName,
    });

    await SocialLink.create({ user: user._id });

    const verificationToken = await this._createVerificationToken(
      user._id,
      "email_verification",
    );

    await emailService.sendVerificationEmail(email, verificationToken);

    await activityService.logActivity({
      userId: user._id,
      action: "user_registered",
      metadata: { email },
      ipAddress,
    });

    return {
      userId: user._id.toString(),
      message: "User registered successfully!",
    };
  }

  async login({ email, password }, { ipAddress, device, userAgent }) {
    const account = await Account.findOne({
      email: email.toLowerCase(),
      provider: "local",
    });

    if (!account) {
      throw AppError.notFound({
        message: "User account does not exist!",
        code: "ACCOUNT NOT FOUND",
        details: { email },
      });
    }

    if (account.lockUntil && account.lockUntil > Date.now()) {
      const timeLeft = getRemainingTime(account.lockUntil);

      throw new AppError({
        message: `Your account is locked, try again in ${timeLeft}!`,
        code: "ACCOUNT LOCKED",
        statusCode: httpStatusConfig.locked.statusCode,
        details: { email },
      });
    }

    const user = await User.findById(account.user);

    if (!user) {
      throw AppError.notFound({
        message: "User account does not exist!",
        code: "ACCOUNT NOT FOUND",
        details: { user },
      });
    }

    if (user.status === "deleted") {
      throw AppError.unauthorized({
        message: "User account has been deleted!",
        code: "ACCOUNT DELETED",
        details: { user },
      });
    }

    if (user.status === "suspended") {
      throw AppError.unauthorized({
        message: "User account has been suspended!",
        code: "ACCOUNT SUSPENDED",
        details: { user },
      });
    }

    if (user.status !== "active") {
      throw AppError.notFound({
        message: "User account is not active!",
        code: "ACCOUNT NOT ACTIVE",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid) {
      await this._handleFailedLogin(account);

      throw new AppError({
        message: "Your email or password is incorrect!",
        code: "INCORRECT CREDENTIALS",
        statusCode: httpStatusConfig.notAcceptable.statusCode,
      });
    }

    if (account.loginAttempts > 0) {
      await account.resetLoginAttempts();
    }

    await User.findByIdAndUpdate(user._id, { lastSeen: new Date() });

    const roles = await rbacService.getUserRoles(user._id);
    const permissionsSet = await rbacService.getUserPermissions(user._id);
    const permissions = [...permissionsSet];

    const tokens = tokenService.generateAuthTokens(user._id, {
      roles,
      permissions,
    });

    await sessionService.createSession({
      userId: user._id,
      refreshToken: tokens.refreshToken,
      device: device || userAgent || "unknown",
      ipAddress,
      expiresAt: tokens.refreshTokenExpiry,
    });

    await activityService.logActivity({
      userId: user._id,
      action: "user_login",
      metadata: { email },
      ipAddress,
    });

    return { user, tokens };
  }

  async logout(userId, refreshToken, ipAddress) {
    await sessionService.revokeSession(refreshToken);
    await activityService.logActivity({
      userId: userId,
      action: "user_logout",
      ipAddress,
    });
  }

  async verifyEmail(token) {
    const verificationRecord = await VerificationToken.findOne({
      token,
      type: "email_verification",
    });

    if (!verificationRecord) {
      throw AppError.unauthorized({
        message: "The provided token is invalid!",
        code: "INVALID TOKEN",
      });
    }

    if (verificationRecord.expiresAt < new Date()) {
      await verificationRecord.deleteOne();

      throw AppError.unauthorized({
        message: "The provided token is expired!",
        code: "TOKEN EXPIRED",
      });
    }

    await User.findByIdAndUpdate(verificationRecord.user, {
      emailVerified: true,
      emailVerifiedAt: new Date(),
    });

    await verificationRecord.deleteOne();
    await activityService.logActivity({
      userId: verificationRecord.user,
      action: "email_verified",
    });

    return { message: "Your email has been verified successfully!" };
  }

  async resendVerificationEmail(email) {
    const account = await Account.findOne({
      email: email.toLowerCase(),
      provider: "local",
    });

    if (!account) {
      return {
        message: "If that email exists, a verification link has been sent!",
      };
    }

    const user = await User.findById(account.user);

    if (user.emailVerified) {
      throw AppError.forbidden({
        message: "Your email is already verified!",
        code: "EMAIL ALREADY VERIFIED",
      });
    }

    await VerificationToken.deleteMany({
      user: user._id,
      type: "email_verification",
    });

    const token = await this._createVerificationToken(
      user._id,
      "email_verification",
    );

    await emailService.sendVerificationEmail(email, token);

    return {
      message: "If that email exists, a verification link has been sent!",
    };
  }

  async forgotPassword(email, ipAddress) {
    const account = await Account.findOne({
      email: email.toLowerCase(),
      provider: "local",
    });

    if (account) {
      await VerificationToken.deleteMany({
        user: account.user,
        type: "password_reset",
      });

      const token = await this._createVerificationToken(
        account.user,
        "password_reset",
      );

      await emailService.sendPasswordResetEmail(email, token);

      await activityService.logActivity({
        userId: account.user,
        action: "password_reset_requested",
        metadata: { email },
        ipAddress,
      });
    }

    return {
      message:
        "If that email is registered, you will receive a password reset link!",
    };
  }

  async resetPassword(token, newPassword) {
    const record = await VerificationToken.findOne({
      token,
      type: "password_reset",
    });

    if (!record) {
      throw AppError.unauthorized({
        message: "The provided token is invalid!",
        code: "INVALID TOKEN",
      });
    }

    if (record.expiresAt < new Date()) {
      await record.deleteOne();
      throw AppError.unauthorized({
        message: "The provided token is expired!",
        code: "TOKEN EXPIRED",
      });
    }

    const account = await Account.findOne({
      user: record.user,
      provider: "local",
    });

    if (!account) {
      throw new AppError({
        message: "We were unable to reset your password!",
        code: "PASSWORD RESET FAILED",
        statusCode: httpStatusConfig.gone.statusCode,
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, account.password);
    if (isSamePassword) {
      throw AppError.conflict({
        message:
          "You have already used this password before, please use a different password!",
        code: "PASSWORD ALREADY USED",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await Account.findOneAndUpdate(
      { user: record.user, provider: "local" },
      {
        password: hashedPassword,
        passwordLastUpdated: new Date(),
        loginAttempts: 0,
        lockUntil: null,
      },
    );

    await sessionService.revokeAllUserSessions(record.user);
    await record.deleteOne();

    await activityService.logActivity({
      userId: record.user,
      action: "password_reset_completed",
      ipAddress,
    });

    return {
      message: "Password has been reset successfully!",
    };
  }

  async updatePassword(userId, currentPassword, newPassword, ipAddress) {
    const account = await Account.findOne({ user: userId, provider: "local" });
    if (!account) {
      throw AppError.notFound({
        message: "User account does not exist!",
        code: "ACCOUNT NOT FOUND",
        details: { user: userId },
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      account.password,
    );

    if (!isPasswordValid) {
      throw AppError.unprocessable({
        message: "Your current password is incorrect!",
        code: "INCORRECT PASSWORD",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, account.password);
    if (isSamePassword) {
      throw AppError.conflict({
        message:
          "You have already used this password before, please use a different password!",
        code: "PASSWORD ALREADY USED",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await account.updateOne({
      password: hashedPassword,
      passwordLastUpdated: new Date(),
    });

    await activityService.logActivity({
      userId,
      action: "password_changed",
      ipAddress,
    });

    return { message: "Password updated successfully!" };
  }

  async refreshTokens(refreshToken) {
    const payload = tokenService.verifyRefreshToken(refreshToken);
    const session = await sessionService.getSessionByToken(refreshToken);

    if (!session) {
      throw AppError.unauthorized({
        message: "The provided token is expired!",
        code: "TOKEN EXPIRED",
      });
    }

    const user = await User.findById(payload.userId);

    if (!user) {
      throw AppError.notFound({
        message: "User account does not exist!",
        code: "ACCOUNT NOT FOUND",
        details: { user: payload.userId },
      });
    }

    if (user.status === "deleted") {
      throw AppError.unauthorized({
        message: "User account has been deleted!",
        code: "ACCOUNT DELETED",
        details: { user: payload.userId },
      });
    }

    if (user.status === "suspended") {
      throw AppError.unauthorized({
        message: "User account has been suspended!",
        code: "ACCOUNT SUSPENDED",
        details: { user: payload.userId },
      });
    }

    if (user.status !== "active") {
      throw AppError.notFound({
        message: "User account is not active!",
        code: "ACCOUNT NOT ACTIVE",
      });
    }

    const roles = await rbacService.getUserRoles(payload.userId);
    const permissionsSet = await rbacService.getUserPermissions(payload.userId);
    const permissions = [...permissionsSet];

    const tokens = tokenService.generateAuthTokens(
      payload.userId,
      roles,
      permissions,
    );

    await sessionService.rotateSession(
      session._id,
      tokens.refreshToken,
      tokens.refreshTokenExpiry,
    );
    await User.findByIdAndUpdate(payload.userId, { lastSeen: new Date() });

    return tokens;
  }

  async _createVerificationToken(userId, type) {
    const token = crypto.randomUUID();
    const expiresAt = new Date(
      Date.now() +
        (type === "password_reset" ? 1 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000),
    );

    await VerificationToken.create({ user: userId, token, type, expiresAt });
    return token;
  }

  async _handleFailedLogin(account) {
    const updates = { $inc: { loginAttempts: 1 } };

    if (account.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
      updates.$set = { lockUntil: new Date(Date.now() + LOCK_TIME) };
    }

    await account.updateOne(updates);
  }
}

export const authService = new AuthService();
