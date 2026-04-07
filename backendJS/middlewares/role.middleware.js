import Role from "../models/role.model.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── Require Role ─────────────────────────────────────────────────────────────
// Usage: requireRole("admin")  or  requireRole("admin", "moderator")
// Matches against the role name stored in the Role document.

export const requireRole = (...allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AppError("Authentication required.", 401);
    }

    if (!req.user.role) {
      throw new AppError("Access denied. No role assigned to this account.", 403);
    }

    // role is populated by authenticate middleware
    const roleName =
      typeof req.user.role === "object" ? req.user.role.name : null;

    if (!roleName || !allowedRoles.includes(roleName)) {
      throw new AppError(
        `Access denied. Requires one of: [${allowedRoles.join(", ")}].`,
        403,
      );
    }

    next();
  });

// ─── Require Permission ───────────────────────────────────────────────────────
// Usage: requirePermission("users:delete")
// Checks against the permissions array on the user's Role document.

export const requirePermission = (...requiredPermissions) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AppError("Authentication required.", 401);
    }

    if (!req.user.role) {
      throw new AppError("Access denied. No role assigned to this account.", 403);
    }

    // Fetch fresh role with permissions if not already populated
    let role = req.user.role;
    if (!role.permissions) {
      role = await Role.findById(role).lean();
    }

    if (!role || !role.permissions) {
      throw new AppError("Access denied. Role has no permissions.", 403);
    }

    const hasAllPermissions = requiredPermissions.every((perm) =>
      role.permissions.includes(perm),
    );

    if (!hasAllPermissions) {
      throw new AppError(
        `Access denied. Missing required permission(s): [${requiredPermissions.join(", ")}].`,
        403,
      );
    }

    next();
  });

// ─── Require Any Permission ───────────────────────────────────────────────────
// Passes if user has AT LEAST ONE of the listed permissions.

export const requireAnyPermission = (...permissions) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AppError("Authentication required.", 401);
    }

    let role = req.user.role;
    if (role && !role.permissions) {
      role = await Role.findById(role).lean();
    }

    const userPermissions = role?.permissions || [];
    const hasAny = permissions.some((perm) => userPermissions.includes(perm));

    if (!hasAny) {
      throw new AppError("Access denied. Insufficient permissions.", 403);
    }

    next();
  });

// ─── Require Self or Admin ────────────────────────────────────────────────────
// Allows the user to access their own resource OR an admin to access any.
// Usage: requireSelfOrAdmin("userId" [param name]) — defaults to "id".

export const requireSelfOrAdmin = (paramName = "id") =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AppError("Authentication required.", 401);
    }

    const targetId = req.params[paramName];
    const isAdmin = req.user.role && req.user.role.name === "admin";
    const isSelf = req.userId === targetId;

    if (!isSelf && !isAdmin) {
      throw new AppError("Access denied. You can only access your own resources.", 403);
    }

    next();
  });
