import { sessionService } from "../../services/auth/session.service.js";
import { successResponseHandler } from "../../utils/response.utils.js";
import { asyncHandler } from "../../utils/common.utils.js";

export const getActiveSessions = asyncHandler(async (req, res) => {
  const sessions = await sessionService.getUserSessions(req.data.userId);

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
    status: "FETCH SESSION SUCCESS",
    message: "Sessions fetched successfully!",
    data: { sessions: mapped, count: mapped.length },
  });
});

export const revokeSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.data.params;

  await sessionService.revokeSessionById(sessionId, req.data.userId);

  successResponseHandler(req, res, {
    status: "REVOKE SESSION SUCCESS",
    message: "Sessions revoked successfully!",
  });
});

export const revokeOtherSessions = asyncHandler(async (req, res) => {
  const currentRefreshToken =
    req.cookies?.refreshToken || req.data.body?.refreshToken;

  const result = await sessionService.revokeAllUserSessions(
    req.data.userId,
    currentRefreshToken || null,
  );

  successResponseHandler(req, res, {
    status: "REVOKE OTHER SESSIONS SUCCESS",
    message: "Except current session, all other sessions revoked successfully!",
    data: { revoked: result.deletedCount },
  });
});

export const getSessionCount = asyncHandler(async (req, res) => {
  const count = await sessionService.countActiveSessions(req.data.userId);

  successResponseHandler(req, res, {
    status: "FETCH SESSION SUCCESS",
    message: "Sessions fetched successfully!",
    data: { activeSessions: count },
  });
});
