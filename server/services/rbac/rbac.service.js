import UserRole from "../../models/user/rbac/user.role.model.js";
import { ROLE_PERMISSIONS_MAP } from "../../config/role.permission.map.config.js";
import { PERMISSIONS } from "../../constants/permission.constants.js";
import { ROLE_HIERARCHY } from "../../constants/roles.constants.js";
import { sanitizeMongoData } from "../../db/db.utils.js";
import AppError from "../../services/error/error.service.js";
import { isValidObjectId } from "mongoose";

class RBACService {
  async getUserRoles(userId) {
    const roles = await UserRole.find({ user: userId })
      .select("role")
      .populate({
        path: "role",
        select: "name priority",
      });

    return roles.map((r) => r.role);
  }

  async getUserPermissions(userId) {
    const userRoles = await UserRole.find({
      user: userId,
      status: "ACTIVE",
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    }).populate({
      path: "role",
      populate: [
        { path: "permissions" },
        { path: "inherits", populate: { path: "permissions" } },
      ],
    });

    return this.extractPermissions(userRoles);
  }

  extractPermissions(roles) {
    const permissions = new Set();

    const traverse = (role, visited = new Set()) => {
      if (!role || visited.has(role._id.toString())) return;

      visited.add(role._id.toString());

      role.permissions?.forEach((p) => permissions.add(p.key));
      role.inherits?.forEach((r) => traverse(r, visited));
    };

    if (Array.isArray(roles)) {
      roles.forEach((ur) => traverse(ur.role));
    } else {
      traverse(roles);
    }

    return permissions;
  }

  getPermissionsByRoles(roles = []) {
    const permissions = new Set();

    roles.forEach((role) => {
      const rolePermissions = ROLE_PERMISSIONS_MAP[role] || [];

      rolePermissions.forEach((permission) => permissions.add(permission));
    });

    return Array.from(permissions);
  }

  hasPermission(userPermissions, requiredPermission) {
    if (!userPermissions || !requiredPermission) return false;

    if (userPermissions.includes(PERMISSIONS.ALL)) return true;

    const [resource, action, scope] = requiredPermission.split(":");

    return userPermissions.some((permission) => {
      const [userResource, userAction, userScope] = permission.split(":");

      return (
        (userResource === resource || userResource === "*") &&
        (userAction === action || userAction === "*") &&
        (userScope === "any" || userScope === scope)
      );
    });
  }

  getHighestRoleLevel(roles = []) {
    return roles.reduce((max, role) => {
      const level = ROLE_HIERARCHY[role.name] || 0;
      return Math.max(max, level);
    }, 0);
  }

  async resolveOwnership(req, ownership) {
    if (!ownership) return null;

    switch (ownership.type) {
      case "resource": {
        const { source, idKey, fieldKey, model, ownerIdField } = ownership;

        const sourceData = req.data[source] || {};

        const resourceId = idKey ? sourceData[idKey] : null;
        const fieldValue = fieldKey ? sourceData[fieldKey] : null;

        if (!resourceId && !fieldValue) {
          throw AppError.unprocessable({
            message: `Please provide appropriate resource identifier for ownership check!`,
            code: "OWNERSHIP VALIDATION FAILED",
            details: { resourceId, fieldValue },
          });
        }

        let resource;

        if (resourceId) {
          const isResourceIdValid = isValidObjectId(resourceId);

          if (!isResourceIdValid) {
            throw AppError.unprocessable({
              message: `Please provide a valid ${model.modelName.toLowerCase()} ID!`,
              code: `${model.modelName.toUpperCase()} ID VALIDATION FAILED`,
              details: { resourceId },
            });
          }

          resource = await model.findById(resourceId).lean();
        } else {
          resource = await model.findOne({ [fieldKey]: fieldValue }).lean();
        }

        if (!resource) {
          throw AppError.notFound({
            message: `No ${model.modelName.toLowerCase()} found with the provided ${resourceId ? `${model.modelName.toLowerCase()} ID` : fieldKey}!`,
            code: `${model.modelName.toUpperCase()} NOT FOUND`,
            details: { resource },
          });
        }

        req.data["resource"] = {
          [model.modelName.toLowerCase()]: sanitizeMongoData(resource),
        };

        return resource[ownerIdField].toString();
      }

      case "custom":
        if (typeof ownership.handler === "function") {
          return await ownership.handler(req);
        }
        return null;

      default:
        throw AppError.forbidden({
          message: "Invalid ownership configuration!",
          code: "OWNERSHIP VALIDATION FAILED",
        });
    }
  }

  checkConditions(conditions, req) {
    if (!conditions) return;

    if (conditions.requireVerifiedEmail && !req.data.user.emailVerified) {
      throw AppError.forbidden({
        message: "Email verification required!",
      });
    }

    if (conditions.timeRange) {
      const hour = new Date().getHours();
      if (
        hour < conditions.timeRange.start ||
        hour > conditions.timeRange.end
      ) {
        throw AppError.forbidden({
          message: "Access denied due to time restrictions!",
        });
      }
    }
  }
}

export const rbacService = new RBACService();
