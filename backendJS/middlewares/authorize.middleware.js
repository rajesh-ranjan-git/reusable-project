import AppError from "../errors/app.error.js";
import { getUserPermissions } from "../services/auth/rbac.service.js";

export const authorize = ({
  permissions = [],
  ownershipCheck = null,
  allowSuperAdmin = true,
}) =>
  asyncHandler(async (req, res, next) => {
    const userId = req.data.userId;

    let userPermissions = req.data.user.permissions;

    if (!userPermissions) {
      userPermissions = await getUserPermissions(userId);
    } else {
      userPermissions = new Set(userPermissions);
    }

    if (allowSuperAdmin && userPermissions.has("*")) {
      return next();
    }

    const hasAccess = permissions.every((p) => userPermissions.has(p));

    if (!hasAccess) {
      throw AppError.forbidden({
        message:
          "You do not have sufficient permission to perform this activity!",
        code: "AUTHORIZATION FAILED",
      });
    }

    if (ownershipCheck) {
      const ownerId = await ownershipCheck(req);

      if (!ownerId || ownerId.toString() !== userId.toString()) {
        throw AppError.forbidden({
          message: "You do not have permission to perform this activity!",
          code: "AUTHORIZATION FAILED",
        });
      }
    }

    next();
  });
