import { PERMISSIONS } from "../constants/permission.constants.js";
import {
  getUserPermissions,
  checkConditions,
  getHighestRoleLevel,
  hasPermission,
  resolveOwnership,
  getUserRoles,
} from "../services/rbac/rbac.service.js";
import AppError from "../services/error/error.service.js";
import { asyncHandler } from "../utils/common.utils.js";

export const authorize = ({
  permissions = [],
  ownership = null,
  enforceOwnership = false,
  enforceHierarchy = false,
  conditions = null,
  allowSuperAdmin = true,
  allowSameLevel = false,
}) =>
  asyncHandler(async (req, res, next) => {
    const userId = req.data.userId;

    let userPermissions = req.data.permissions || [];

    if (!userPermissions?.length) {
      userPermissions = await getUserPermissions(userId);
    } else {
      userPermissions = new Set(userPermissions);
    }

    if (allowSuperAdmin && userPermissions.has(PERMISSIONS.ALL)) {
      return next();
    }

    if (permissions.length) {
      const hasAllPermissions = permissions.every((p, i) =>
        hasPermission([...userPermissions], p),
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
      } else {
        return next();
      }
    }

    if (enforceHierarchy && targetUserId) {
      const targetUserRoles = await getUserRoles(targetUserId);

      const currentLevel = getHighestRoleLevel(req.data.roles);
      const targetLevel = getHighestRoleLevel(targetUserRoles);

      if (
        allowSameLevel
          ? targetLevel > currentLevel
          : targetLevel >= currentLevel
      ) {
        throw AppError.forbidden({
          message: `You cannot perform this action on a user with ${allowSameLevel ? "higher" : "equal or higher"} role!`,
          code: "HIERARCHY VIOLATION",
        });
      }
    }

    checkConditions(conditions, req);

    next();
  });
