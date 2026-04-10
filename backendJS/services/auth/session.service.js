import Session from "../../models/auth/session.model.js";
import AppError from "../../errors/app.error.js";

class SessionService {
  async createSession({ userId, refreshToken, device, ipAddress, expiresAt }) {
    return Session.create({
      user: userId,
      refreshToken,
      device,
      ipAddress,
      expiresAt,
    });
  }

  async getSessionByToken(refreshToken) {
    return Session.findOne({ refreshToken, expiresAt: { $gt: new Date() } });
  }

  async getUserSessions(userId) {
    return Session.find({ user: userId, expiresAt: { $gt: new Date() } })
      .sort({ createdAt: -1 })
      .lean();
  }

  async getSessionById(sessionId, userId) {
    const session = await Session.findOne({ _id: sessionId, user: userId });

    if (!session) {
      throw AppError.notFound({
        message: "No session found to revoke!",
        code: "SESSION NOT FOUND",
      });
    }

    return session;
  }

  async revokeSession(refreshToken) {
    return Session.findOneAndDelete({ refreshToken });
  }

  async revokeSessionById(sessionId, userId) {
    const result = await Session.findOneAndDelete({
      _id: sessionId,
      user: userId,
    });

    if (!result) {
      throw AppError.notFound({
        message: "No session found to revoke!",
        code: "SESSION NOT FOUND",
      });
    }

    return result;
  }

  async revokeAllUserSessions(userId, exceptRefreshToken = null) {
    const query = { user: userId };
    if (exceptRefreshToken) {
      query.refreshToken = { $ne: exceptRefreshToken };
    }
    return Session.deleteMany(query);
  }

  async rotateSession(sessionId, newRefreshToken, newExpiresAt) {
    return Session.findByIdAndUpdate(
      sessionId,
      { refreshToken: newRefreshToken, expiresAt: newExpiresAt },
      { returnDocument: "after" },
    );
  }

  async countActiveSessions(userId) {
    return Session.countDocuments({
      user: userId,
      expiresAt: { $gt: new Date() },
    });
  }
}

export const sessionService = new SessionService();
