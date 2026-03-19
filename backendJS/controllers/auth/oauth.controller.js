import { CLIENT_URL } from "../../constants/common.constants.js";
import User from "../../models/auth/user.model.js";
import Account from "../../models/auth/account.model.js";
import AuthProvider from "../../models/auth/authProvider.model.js";
import Profile from "../../models/auth/profile.model.js";
import SocialLink from "../../models/auth/socialLink.model.js";
import ActivityLog from "../../models/auth/activityLog.model.js";
import { tokenService } from "../../services/auth/token.service.js";
import { sessionService } from "../../services/auth/session.service.js";
import AppError from "../../errors/app.error.js";
import { successResponseHandler } from "../../utils/response.utils.js";
import { asyncHandler } from "../../utils/common.utils.js";

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
          firstName: oauthProfile.firstName || null,
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

    const tokens = tokenService.generateAuthTokens(userId);
    await sessionService.createSession({
      userId,
      refreshToken: tokens.refreshToken,
      device: req.headers["user-agent"] || "oauth",
      ipAddress: req.ip,
      expiresAt: tokens.refreshTokenExpiry,
    });

    await User.findByIdAndUpdate(userId, { lastSeen: new Date() });

    try {
      await ActivityLog.create({
        user: userId,
        action: "oauth_login",
        metadata: { provider },
        ipAddress: req.ip,
      });
    } catch {}

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: tokens.refreshTokenExpiry,
      path: "/api/auth",
    });

    const redirectUrl = `${CLIENT_URL}/auth/oauth/callback?accessToken=${tokens.accessToken}`;
    res.redirect(redirectUrl);
  });

export const getLinkedProviders = asyncHandler(async (req, res) => {
  const providers = await AuthProvider.find({ user: req.data.userId })
    .select("provider createdAt -_id")
    .lean();

  successResponseHandler(req, res, {
    status: "FETCH PROVIDER SUCCESS",
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
      code: "UNLINK PROVIDER FAILED",
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
        "Cannot unlink the only authentication method. Please add a password first.",
      code: "UNLINK PROVIDER FAILED",
    });
  }

  const result = await AuthProvider.findOneAndDelete({
    user: req.data.userId,
    provider,
  });
  if (!result) {
    throw AppError.notFound({
      message: `Provider '${provider}' is not linked to this account!`,
      code: "UNLINK PROVIDER FAILED",
    });
  }

  successResponseHandler(req, res, {
    status: "UNLINK PROVIDER SUCCESS",
    message: `${provider} unlinked successfully!`,
  });
});
