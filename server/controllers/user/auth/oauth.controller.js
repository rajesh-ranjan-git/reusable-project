import { CLIENT_URL } from "../../../constants/env.constants.js";
import User from "../../../models/user/auth/user.model.js";
import Account from "../../../models/user/auth/account.model.js";
import AuthProvider from "../../../models/user/auth/auth.provider.model.js";
import Profile from "../../../models/user/profile/profile.model.js";
import SocialLink from "../../../models/user/profile/social.model.js";
import { sessionService } from "../../../services/auth/session.service.js";
import AppError from "../../../services/error/error.service.js";
import { responseService } from "../../../services/response/response.service.js";
import { asyncHandler } from "../../../utils/common.utils.js";
import { activityService } from "../../../services/activity/activity.service.js";
import { rbacService } from "../../../services/rbac/rbac.service.js";

export const oauthCallback = (provider) =>
  asyncHandler(async (req, res) => {
    const oauthProfile = req.data.oauthProfile;

    if (!oauthProfile || !oauthProfile.id || !oauthProfile.email) {
      throw AppError.badRequest({
        message: "OAuth profile is incomplete, missing email or provider ID!",
        code: "INCOMPLETE OAUTH",
        details: { oauthProfile: req.data.oauthProfile },
      });
    }

    const {
      id: providerUserId,
      email,
      displayName,
      avatarUrl,
      accessToken,
      refreshToken: oauthRefreshToken,
    } = oauthProfile;

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
        email: email.toLowerCase(),
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
        userId = user._id;

        await Account.create({
          user: userId,
          provider,
          email: email.toLowerCase(),
        });

        await AuthProvider.create({
          user: userId,
          provider,
          providerUserId,
          accessToken,
          refreshToken: oauthRefreshToken,
        });

        const baseUsername = (displayName || email.split("@")[0])
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "_")
          .slice(0, 20);
        const uniqueUsername = await _uniqueUsername(baseUsername);

        await Profile.create({
          user: userId,
          userName: uniqueUsername,
          userName: oauthProfile.userName || null,
          lastName: oauthProfile.lastName || null,
          avatarUrl: avatarUrl || null,
        });

        await SocialLink.create({ user: userId });
      }
    }

    const user = await User.findById(userId);

    if (!user || user.status !== "active") {
      throw AppError.forbidden({
        message:
          "Your account is suspended or inactive, please contact administrator!",
      });
    }

    const roles = await rbacService.getUserRoles(userId);
    const permissionsSet = await rbacService.getUserPermissions(userId);
    const permissions = [...permissionsSet];

    const tokens = tokenService.generateAuthTokens(userId, roles, permissions);

    await sessionService.createSession({
      userId,
      refreshToken: tokens.refreshToken,
      device: req.headers["user-agent"] || "oauth",
      ipAddress: req.ip,
      expiresAt: tokens.refreshTokenExpiry,
    });

    await User.findByIdAndUpdate(userId, { lastSeen: new Date() });

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

    const redirectUrl = `${CLIENT_URL}/auth/oauth/callback?accessToken=${tokens.accessToken}`;
    res.redirect(redirectUrl);
  });

export const getLinkedProviders = asyncHandler(async (req, res) => {
  const providers = await AuthProvider.find({ user: req.data.userId })
    .select("provider createdAt -_id")
    .lean();

  responseService.successResponseHandler(req, res, {
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

  responseService.successResponseHandler(req, res, {
    status: "PROVIDER UNLINK SUCCESS",
    message: `${provider} unlinked successfully!`,
  });
});
