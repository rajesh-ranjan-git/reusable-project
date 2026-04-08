import User from "../../models/auth/user.model.js";
import Account from "../../models/auth/account.model.js";
import Profile from "../../models/auth/profile.model.js";
import Address from "../../models/auth/address.model.js";
import ActivityLog from "../../models/auth/activityLog.model.js";
import { sessionService } from "../../services/auth/session.service.js";
import { asyncHandler } from "../../utils/common.utils.js";
import { successResponseHandler } from "../../utils/response.utils.js";
import { emailValidator } from "../../validators/auth.validator.js";
import AppError from "../../errors/app.error.js";

export const getAccountInfo = asyncHandler(async (req, res) => {
  const [account, profile] = await Promise.all([
    Account.findOne({ user: req.data.userId })
      .select("-password -loginAttempts -lockUntil")
      .lean(),
    Profile.findOne({ user: req.data.userId }).lean(),
  ]);

  successResponseHandler(req, res, {
    status: "FETCH ACCOUNT SUCCESS",
    message: "Account details fetched successfully!",
    data: { user: req.data.user, account, profile },
  });
});

export const updateEmail = asyncHandler(async (req, res) => {
  const { email } = req.data.body;

  const {
    isEmailValid,
    message: emailErrorMessage,
    validatedEmail,
  } = emailValidator(email);

  if (!isEmailValid) {
    throw AppError.unprocessable({
      message: emailErrorMessage,
      code: "EMAIL VALIDATION FAILED",
      details: { email },
    });
  }

  const existing = await Account.findOne({ email: validatedEmail });

  if (existing && existing.user.toString() !== req.data.userId) {
    throw AppError.conflict({
      message:
        "This email is associated with another account, please use a different email!",
      code: "EMAIL UPDATE FAILED",
      details: { email: validatedEmail },
    });
  }

  if (existing && existing.user.toString() === req.data.userId) {
    throw AppError.conflict({
      message: "This email is already updated on your account!",
      code: "EMAIL UPDATE FAILED",
      details: { email: validatedEmail },
    });
  }

  await Account.findOneAndUpdate(
    { user: req.data.userId, provider: "local" },
    { $set: { email: validatedEmail } },
  );

  await User.findByIdAndUpdate(req.data.userId, {
    emailVerified: false,
    emailVerifiedAt: null,
  });

  successResponseHandler(req, res, {
    status: "EMAIL UPDATE SUCCESS",
    message: "Email updated successfully!",
  });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.data.userId, {
    status: "deleted",
    deletedAt: new Date(),
  });

  await sessionService.revokeAllUserSessions(req.data.userId);

  res.clearCookie("refreshToken", { path: "/api/v1" });

  await ActivityLog.create({
    user: req.data.userId,
    action: "account_deleted",
    metadata: { selfDeleted: true },
    ipAddress: req.ip,
  }).catch(() => {});

  successResponseHandler(req, res, {
    status: "DELETE ACCOUNT SUCCESS",
    message: "Account deleted successfully!",
  });
});

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const [profile, addressCount, activeSessionCount, recentActivity] =
    await Promise.all([
      Profile.findOne({ user: req.data.userId }).lean(),
      Address.countDocuments({ user: req.data.userId }),
      sessionService.countActiveSessions(req.data.userId),
      ActivityLog.find({ user: req.data.userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

  successResponseHandler(req, res, {
    status: "FETCH DASHBOARD SUMMARY SUCCESS",
    message: "Dashboard summary fetched successfully!",
    data: {
      user: req.data.user,
      profile,
      stats: {
        addressCount,
        activeSessionCount,
      },
      recentActivity,
    },
  });
});
