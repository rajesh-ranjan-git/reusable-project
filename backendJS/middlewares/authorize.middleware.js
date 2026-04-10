import { PERMISSIONS } from "../constants/permission.constants.js";
import User from "../models/auth/user.model.js";
import {
  checkConditions,
  getHighestRoleLevel,
  getUserPermissions,
  hasPermission,
  resolveOwnership,
} from "../utils/rbac.utils.js";
import AppError from "../errors/app.error.js";
import { asyncHandler } from "../utils/common.utils.js";

export const authorize = ({
  permissions = [],
  ownership = null,
  enforceOwnership = false,
  enforceHierarchy = false,
  conditions = null,
  allowSuperAdmin = true,
}) =>
  asyncHandler(async (req, res, next) => {
    const user = req.data.user;
    const userId = req.data.userId;

    let userPermissions = user.permissions || [];

    if (!userPermissions) {
      userPermissions = await getUserPermissions(userId);
    } else {
      userPermissions = new Set(userPermissions);
    }

    if (allowSuperAdmin && userPermissions.has(PERMISSIONS.ALL)) {
      return next();
    }

    if (permissions.length) {
      const hasAllPermissions = permissions.every((p) =>
        hasPermission(userPermissions, p),
      );

      if (!hasAllPermissions) {
        throw AppError.forbidden({
          message:
            "You do not have sufficient permission to perform this activity!",
          code: "AUTHORIZATION FAILED",
        });
      }
    }

    let targetUserId = null;

    if (ownership) {
      targetUserId = await resolveOwnership(req, ownership);
    }

    if (enforceOwnership) {
      if (!targetUserId || targetUserId !== userId) {
        throw AppError.forbidden({
          message: "You do not have permission to perform this activity!",
          code: "AUTHORIZATION FAILED",
        });
      }
    }

    if (enforceHierarchy && targetUserId) {
      const targetUser = await User.findById(targetUserId).populate("roles");

      if (!targetUser) {
        throw AppError.notFound({
          message: "Target user not found!",
          code: "USER NOT FOUND",
        });
      }

      const currentUserRoles = user.roles?.map((r) => r.name) || [];

      const targetUserRoles = targetUser.roles?.map((r) => r.name) || [];

      const currentLevel = getHighestRoleLevel(currentUserRoles);
      const targetLevel = getHighestRoleLevel(targetUserRoles);

      if (targetLevel >= currentLevel) {
        throw AppError.forbidden({
          message:
            "You cannot perform this action on a user with equal or higher role!",
          code: "HIERARCHY VIOLATION",
        });
      }
    }

    checkConditions(conditions, req);

    next();
  });
