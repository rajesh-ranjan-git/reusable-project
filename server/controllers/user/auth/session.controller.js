import { isValidObjectId } from "mongoose";
import { sessionService } from "../../../services/auth/session.service.js";
import { successResponseHandler } from "../../../services/response/response.service.js";
import { asyncHandler } from "../../../utils/common.utils.js";
import AppError from "../../../services/error/error.service.js";

export const getActiveSessions = asyncHandler(async (req, res) => {
  const sessions = await sessionService.getUserSessions(req.data.userId);

  if (!sessions) {
    throw AppError.internal({
      message: "Failed to get user sessions!",
      code: "SESSION FETCH FAILED",
    });
  }

  const currentRefreshToken =
    req.cookies?.refreshToken || req.data.body?.refreshToken;

  const mapped = sessions.map((s) => ({
    id: s._id,
    device: s.device,
    ipAddress: s.ipAddress,
    createdAt: s.createdAt,
    expiresAt: s.expiresAt,
    isCurrent: currentRefreshToken
      ? s.refreshToken === currentRefreshToken
      : false,
  }));

  successResponseHandler(req, res, {
    status: "SESSION FETCH SUCCESS",
    message: "Sessions fetched successfully!",
    data: { sessions: mapped, count: mapped.length },
  });
});

export const revokeSession = asyncHandler(async (req, res) => {
  await sessionService.revokeSessionById(
    req.data.resource.session.id,
    req.data.userId,
  );

  successResponseHandler(req, res, {
    status: "SESSION REVOKE SUCCESS",
    message: "Sessions revoked successfully!",
  });
});

export const revokeOtherSessions = asyncHandler(async (req, res) => {
  const currentRefreshToken = req.cookies?.refreshToken;

  if (!currentRefreshToken) {
    throw AppError.unprocessable({
      message: "You must be logged in to revoke other sessions!",
      code: "SESSION ID VALIDATION FAILED",
      details: { currentRefreshToken },
    });
  }

  const result = await sessionService.revokeAllUserSessions(
    req.data.userId,
    currentRefreshToken,
  );

  if (!result) {
    throw AppError.internal({
      message: "Failed to revoke user sessions!",
      code: "SESSIONS REVOKE FAILED",
    });
  }

  successResponseHandler(req, res, {
    status: "SESSIONS REVOKE SUCCESS",
    message: "Except current session, all other sessions revoked successfully!",
    data: { revoked: result.deletedCount },
  });
});

export const getSessionCount = asyncHandler(async (req, res) => {
  const count = await sessionService.countActiveSessions(req.data.userId);

  if (!count) {
    throw AppError.internal({
      message: "Failed to get user sessions count!",
      code: "SESSION FETCH FAILED",
    });
  }

  successResponseHandler(req, res, {
    status: "SESSION FETCH SUCCESS",
    message: "Sessions fetched successfully!",
    data: { activeSessions: count },
  });
});
