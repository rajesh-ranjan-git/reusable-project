import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  JWT_AUDIENCE,
  JWT_ISSUER,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../../constants/common.constants.js";
import { jwtKnownErrorsConfig } from "../../config/common.config.js";
import AppError from "../../errors/app.error.js";

const parseDurationMs = (duration) => {
  const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  const match = String(duration).match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 86400000;
  return parseInt(match[1]) * units[match[2]];
};

class TokenService {
  generateAccessToken(userId, extra = {}) {
    if (!ACCESS_TOKEN_SECRET) {
      logger.error(
        "[Token Service Failed] Access Token Secret key is not set, please set it in .env file!",
        err,
      );

      throw AppError.serviceUnavailable({
        message: "Something went wrong on our end!",
      });
    }

    return jwt.sign(
      { userId: userId.toString(), ...extra },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRY,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
    );
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });
    } catch (err) {
      if (err.name === jwtKnownErrorsConfig.tokenExpiredError) {
        throw AppError.unauthorized({
          message: "Session has expired, please login again!",
          code: "SESSION EXPIRED",
        });
      }

      if (err.name === jwtKnownErrorsConfig.jwtError) {
        throw AppError.unauthorized({
          message: "The provided token is invalid!",
          code: "INVALID TOKEN",
        });
      }

      if (err.name === jwtKnownErrorsConfig.notBeforeError) {
        logger.error(
          "[Token Service Failed] JWT Not Before Error has occurred!",
          err,
        );

        throw AppError.serviceUnavailable({
          message: "Something went wrong on our end!",
        });
      }

      throw AppError.badRequest({
        message: "We were unable to verify your token!",
        code: "TOKEN VERIFICATION FAILED",
      });
    }
  }

  generateRefreshToken(userId) {
    if (!REFRESH_TOKEN_SECRET) {
      logger.error(
        "[Token Service Failed] Refresh Token Secret key is not set, please set it in .env file!",
        err,
      );

      throw AppError.serviceUnavailable({
        message: "Something went wrong on our end!",
      });
    }

    return jwt.sign({ userId: userId.toString() }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });
    } catch (err) {
      if (err.name === jwtKnownErrorsConfig.tokenExpiredError) {
        throw AppError.unauthorized({
          message: "Session has expired, please login again!",
          code: "SESSION EXPIRED",
        });
      }

      if (err.name === jwtKnownErrorsConfig.jwtError) {
        throw AppError.unauthorized({
          message: "The provided token is invalid!",
          code: "INVALID TOKEN",
        });
      }

      if (err.name === jwtKnownErrorsConfig.notBeforeError) {
        logger.error(
          "[Token Service Failed] JWT Not Before Error has occurred!",
          err,
        );

        throw AppError.serviceUnavailable({
          message: "Something went wrong on our end!",
        });
      }

      throw AppError.badRequest({
        message: "We were unable to verify your token!",
        code: "TOKEN VERIFICATION FAILED",
      });
    }
  }

  generateAuthTokens(userId) {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);
    const refreshTokenExpiry = new Date(
      Date.now() + parseDurationMs(REFRESH_TOKEN_EXPIRY),
    );

    return {
      accessToken,
      refreshToken,
      refreshTokenExpiry,
      accessTokenExpiresIn: ACCESS_TOKEN_EXPIRY,
    };
  }

  extractBearerToken(authorizationHeader) {
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return null;
    }
    return authorizationHeader.slice(7);
  }

  decodeToken(token) {
    return jwt.decode(token);
  }
}

export const tokenService = new TokenService();
