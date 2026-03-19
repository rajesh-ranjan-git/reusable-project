import { httpStatusConfig } from "../../config/common.config.js";
import { authService } from "../../services/auth/auth.service.js";
import AppError from "../../errors/app.error.js";
import {
  validateRegister,
  validateLogin,
  validateResetPassword,
  validateUpdatePassword,
} from "../../validators/auth.validator.js";
import { successResponseHandler } from "../../utils/response.utils.js";
import { asyncHandler } from "../../utils/common.utils.js";

export const register = asyncHandler(async (req, res) => {
  const value = validateRegister(req.data.body);

  const result = await authService.register(value, req.ip);

  successResponseHandler(req, res, {
    status: "REGISTRATION SUCCESS",
    statusCode: httpStatusConfig.created.statusCode,
    message: result.message,
    data: { user: result.userId },
  });
});

export const login = asyncHandler(async (req, res) => {
  const value = validateLogin(req.data.body);

  const { user, tokens } = await authService.login(value, {
    ipAddress: req.ip,
    device: req.headers["user-agent"],
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: tokens.refreshTokenExpiry,
    path: "/api/auth",
  });

  successResponseHandler(req, res, {
    status: "LOGIN SUCCESS",
    message: "Logged in successfully!",
    data: {
      user: {
        id: user._id,
        status: user.status,
        emailVerified: user.emailVerified,
      },
      accessToken: tokens.accessToken,
      expiresIn: tokens.accessTokenExpiresIn,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (refreshToken) {
    await authService.logout(req.data.userId, refreshToken, req.ip);
  }

  res.clearCookie("refreshToken", { path: "/api/auth" });
  successResponseHandler(req, res, {
    status: "LOGOUT SUCCESS",
    message: "Logged out successfully!",
  });
});

export const refreshTokens = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.data.body?.refreshToken;

  if (!refreshToken) {
    throw AppError.badRequest({
      message: "Refresh token is required!",
      code: "TOKEN VALIDATION FAILED",
      details: { token: refreshToken },
    });
  }

  const tokens = await authService.refreshTokens(refreshToken, req.ip);

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: tokens.refreshTokenExpiry,
    path: "/api/auth",
  });

  successResponseHandler(req, res, {
    data: {
      accessToken: tokens.accessToken,
      expiresIn: tokens.accessTokenExpiresIn,
    },
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.data.query;
  if (!token) {
    throw AppError.badRequest({
      message: "Verification token is required.",
      code: "TOKEN VALIDATION FAILED",
      details: { token },
    });
  }

  const result = await authService.verifyEmail(token);

  successResponseHandler(req, res, {
    status: "EMAIL VERIFICATION SUCCESS",
    message: result.message,
  });

  successResponseHandler(res, result);
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.data.body;
  if (!email) {
    throw AppError.badRequest({
      message: "Email is required.",
      code: "EMAIL VALIDATION FAILED",
      details: { email },
    });
  }

  const result = await authService.resendVerificationEmail(email);

  successResponseHandler(req, res, {
    status: "EMAIL VERIFICATION SENT",
    message: result.message,
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.data.body;
  if (!email) {
    throw AppError.badRequest({
      message: "Email is required.",
      code: "EMAIL VALIDATION FAILED",
      details: { email },
    });
  }

  const result = await authService.forgotPassword(email, req.ip);

  successResponseHandler(req, res, {
    status: "PASSWORD RESET LINK SENT",
    message: result.message,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const value = validateResetPassword(req.data.body);

  const result = await authService.resetPassword(value.token, value.password);

  successResponseHandler(req, res, {
    status: "PASSWORD RESET SUCCESS",
    message: result.message,
  });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = validateUpdatePassword(
    req.data.body,
  );

  const result = await authService.updatePassword(
    req.data.userId,
    currentPassword,
    newPassword,
    req.ip,
  );

  successResponseHandler(req, res, {
    status: "UPDATE PASSWORD SUCCESS",
    message: result.message,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  successResponseHandler(req, res, {
    status: "GET ME SUCCESS",
    message: "Your details fetched successfully!",
    data: { user: req.data.user },
  });
});
