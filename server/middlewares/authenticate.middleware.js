import Account from "../models/user/auth/account.model.js";
import User from "../models/user/auth/user.model.js";
import { asyncHandler, deepEquals } from "../utils/common.utils.js";
import { tokenService } from "../services/auth/token.service.js";
import AppError from "../services/error/error.service.js";
import { rbacService } from "../services/rbac/rbac.service.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = tokenService.extractBearerToken(req.headers.authorization);

  if (!token) {
    throw AppError.unauthorized({
      message: "Authentication required. Please provide a valid token!",
      code: "TOKEN VALIDATION FAILED",
      details: { token },
    });
  }

  const payload = tokenService.verifyAccessToken(token);
  const account = await Account.findOne({ user: payload.userId });

  if (!account) {
    throw AppError.notFound({
      message: "User account does not exist!",
      code: "ACCOUNT NOT FOUND",
      details: { user: payload.userId },
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

  const userRoles = await rbacService.getUserRoles(payload.userId);
  const areRolesValid = deepEquals(payload.roles, userRoles);

  const userPermissionsSet = await rbacService.getUserPermissions(
    payload.userId,
  );
  const userPermissions = [...userPermissionsSet];
  const arePermissionsValid = deepEquals(payload.permissions, userPermissions);

  if (!areRolesValid || !arePermissionsValid) {
    throw AppError.unauthorized({
      message: "Inconsistent roles/permissions found!",
    });
  }

  req.data = {
    ...req.data,
    userId: user.id,
    user,
    roles: userRoles,
    permissions: userPermissions,
  };

  next();
});

export const optionalAuthenticate = asyncHandler(async (req, res, next) => {
  const token = tokenService.extractBearerToken(req.headers.authorization);

  if (!token) return next();

  try {
    const payload = tokenService.verifyAccessToken(token);

    const account = await Account.findOne({ user: payload.userId });

    const user = await User.findById(account.user);

    if (user && user.status === "active") {
      req.data = { ...req.data, userId: user.id, user };
    }
  } catch {}

  next();
});

export const requireVerifiedEmail = asyncHandler(async (req, res, next) => {
  if (!req.data.user) {
    throw AppError.unauthorized({
      message: "Authentication is required for this request!",
      details: { user: req.data.user },
    });
  }

  if (!req.data.user.emailVerified) {
    throw AppError.unauthorized({
      message: "Email verification is required to process this request!",
      code: "VERIFIED EMAIL REQUIRED",
      details: { user: payload.userId },
    });
  }

  next();
});
