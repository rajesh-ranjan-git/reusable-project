import { CLIENT_URL } from "../../../constants/env.constants.js";
import { ROLES } from "../../../constants/roles.constants.js";
import User from "../../../models/user/auth/user.model.js";
import Account from "../../../models/user/auth/account.model.js";
import AuthProvider from "../../../models/user/auth/auth.provider.model.js";
import Profile from "../../../models/user/profile/profile.model.js";
import SocialLink from "../../../models/user/profile/social.model.js";
import Role from "../../../models/user/rbac/role.model.js";
import UserRole from "../../../models/user/rbac/user.role.model.js";
import {
  asyncHandler,
  omitObjectProperties,
} from "../../../utils/common.utils.js";
import { sanitizeMongoData } from "../../../db/db.utils.js";
import { emailValidator } from "../../../validators/auth.validator.js";
import { sessionService } from "../../../services/auth/session.service.js";
import { activityService } from "../../../services/activity/activity.service.js";
import { rbacService } from "../../../services/rbac/rbac.service.js";
import { tokenService } from "../../../services/auth/token.service.js";
import { authService } from "../../../services/auth/auth.service.js";
import { responseService } from "../../../services/response/response.service.js";
import AppError from "../../../services/error/error.service.js";

export const oauthCallback = asyncHandler(async (req, res) => {
  const { provider } = req.data.params;
  const oauthProfile = req.data.oauthProfile;

  if (!oauthProfile || !oauthProfile.id || !oauthProfile.email) {
    throw AppError.unprocessable({
      message: "OAuth profile is incomplete, missing email or provider ID!",
      code: "OAUTH VALIDATION FAILED",
      details: { oauthProfile },
    });
  }

  const {
    id: providerUserId,
    email,
    displayName,
    avatar,
    accessToken,
    refreshToken: oauthRefreshToken,
  } = oauthProfile;

  if (!email) {
    throw AppError.badRequest({
      message: `${provider} did not return email!`,
    });
  }

  const {
    isEmailValid,
    message: emailErrorMessage,
    validatedEmail,
  } = emailValidator(email);

  if (!isEmailValid) {
    throw AppError.unprocessable({
      message: emailErrorMessage,
      code: "OAUTH VALIDATION FAILED",
      details: { email },
    });
  }

  let authProvider = await AuthProvider.findOne({ provider, providerUserId });
  let userId;

  if (authProvider) {
    await authProvider.updateOne({
      accessToken,
      refreshToken: oauthRefreshToken,
    });
    userId = authProvider.user;
  } else {
    const existingAccount = await Account.findOne({
      email: validatedEmail,
    });

    if (existingAccount) {
      userId = existingAccount.user;

      await AuthProvider.create({
        user: userId,
        provider,
        providerUserId,
        accessToken,
        refreshToken: oauthRefreshToken,
      });
    } else {
      const user = await User.create({
        emailVerified: true,
        emailVerifiedAt: new Date(),
        status: "active",
      });
      userId = user.id;

      await Account.create({
        user: userId,
        provider,
        email: validatedEmail,
      });

      await AuthProvider.create({
        user: userId,
        provider,
        providerUserId,
        accessToken,
        refreshToken: oauthRefreshToken,
      });

      const role = await Role.findOne({ name: ROLES.USER });

      await UserRole.create({
        user: user.id,
        role: role.id,
      });

      const firstName = displayName.split(" ")[0];
      const lastName = displayName.split(" ").slice(1)[0];

      const uniqueUsername = await authService.generateUniqueUsername({
        email: validatedEmail,
        firstName,
        lastName,
      });

      await Profile.create({
        user: userId,
        userName: uniqueUsername,
        firstName,
        lastName,
        avatar: avatar || null,
      });

      await SocialLink.create({ user: userId });
    }
  }

  const user = await User.findById(userId);

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

  const userRoles = await rbacService.getUserRoles(userId);
  const permissionsSet = await rbacService.getUserPermissions(userId);
  const permissions = [...permissionsSet];

  const tokens = tokenService.generateAuthTokens(
    userId,
    userRoles,
    permissions,
  );

  await sessionService.createSession({
    userId,
    refreshToken: tokens.refreshToken,
    device: req.headers["user-agent"] || "oauth",
    ipAddress: req.ip,
    expiresAt: tokens.refreshTokenExpiry,
  });

  await User.findByIdAndUpdate(userId, { lastSeen: new Date() });

  const profile = await Profile.findOne({
    user: userId,
  }).select("-_id userName firstName lastName avatar cover");

  const userRoleLevel = await rbacService.getHighestRoleLevel(userRoles);
  const userRoleName = userRoles.reduce(
    (acc, curr) => (curr.priority === userRoleLevel ? curr.name : acc),
    null,
  );

  const userFields = {
    userId: user.id,
    status: user.status,
    email: validatedEmail,
    role: userRoleName,
    ...omitObjectProperties(sanitizeMongoData(profile), [
      "id",
      "cover",
      "age",
      "totalExperience",
      "currentJobRole",
      "topSkills",
    ]),
  };

  await activityService.logActivity({
    user: userId,
    action: "oauth_login",
    metadata: { provider },
    ipAddress: req.ip,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: tokens.refreshTokenExpiry,
    path: "/",
  });

  if (provider === "github" || provider === "linkedin") {
    return responseService.redirectResponseHandler(req, res, {
      status: "LOGIN SUCCESS",
      message: "Logged in successfully!",
      data: {
        user: userFields,
        accessToken: tokens.accessToken,
        expiresIn: tokens.accessTokenExpiresIn,
      },
    });
  }

  return responseService.successResponseHandler(req, res, {
    status: "LOGIN SUCCESS",
    message: "Logged in successfully!",
    data: {
      user: userFields,
      accessToken: tokens.accessToken,
      expiresIn: tokens.accessTokenExpiresIn,
    },
  });
});

export const getLinkedProviders = asyncHandler(async (req, res) => {
  const providers = await AuthProvider.find({ user: req.data.userId })
    .select("provider createdAt -_id")
    .lean();

  return responseService.successResponseHandler(req, res, {
    status: "PROVIDER FETCH SUCCESS",
    message: "Providers fetched successfully!",
    data: { providers },
  });
});

export const unlinkProvider = asyncHandler(async (req, res) => {
  const { provider } = req.data.params;
  const validProviders = ["google", "github", "facebook"];

  if (!validProviders.includes(provider)) {
    throw AppError.badRequest({
      message: `Invalid provider ${provider}!`,
      code: "PROVIDER UNLINK FAILED",
      details: { provider },
    });
  }

  const localAccount = await Account.findOne({
    user: req.data.userId,
    provider: "local",
  });
  const providerCount = await AuthProvider.countDocuments({
    user: req.data.userId,
  });

  if (!localAccount && providerCount <= 1) {
    throw AppError.forbidden({
      message:
        "Cannot unlink the only authentication method. Please add a password first!",
      code: "PROVIDER UNLINK FAILED",
    });
  }

  const result = await AuthProvider.findOneAndDelete({
    user: req.data.userId,
    provider,
  });
  if (!result) {
    throw AppError.notFound({
      message: `Provider '${provider}' is not linked to this account!`,
      code: "PROVIDER UNLINK FAILED",
    });
  }

  return responseService.successResponseHandler(req, res, {
    status: "PROVIDER UNLINK SUCCESS",
    message: `${provider} unlinked successfully!`,
  });
});
