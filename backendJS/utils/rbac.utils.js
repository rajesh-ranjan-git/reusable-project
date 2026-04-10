import { ROLE_PERMISSIONS_MAP } from "../config/permission.config.js";
import { PERMISSIONS } from "../constants/permission.constants.js";
import { ROLE_HIERARCHY } from "../constants/roles.constants.js";
import { sanitizeMongoData } from "../db/db.utils.js";
import { toTitleCase } from "./common.utils.js";

export const extractPermissions = (roles) => {
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
};

export const getPermissionsByRoles = (roles = []) => {
  const permissions = new Set();

  roles.forEach((role) => {
    const rolePermissions = ROLE_PERMISSIONS_MAP[role] || [];

    rolePermissions.forEach((permission) => permissions.add(permission));
  });

  return Array.from(permissions);
};

export const hasPermission = ({ userPermissions, requiredPermission }) => {
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
};

export const getHighestRoleLevel = (roles = []) => {
  return roles.reduce((max, role) => {
    const level = ROLE_HIERARCHY[role] || 0;
    return Math.max(max, level);
  }, 0);
};

export const resolveOwnership = async (req, ownership) => {
  if (!ownership) return null;

  switch (ownership.type) {
    case "params":
      return req.data.params?.[ownership.key];

    case "body":
      return req.data.body?.[ownership.key];

    case "query":
      return req.data.query?.[ownership.key];

    case "resource": {
      const { model, idParam, ownerField } = ownership;

      const resourceId = req.data.params?.[idParam];

      if (!resourceId) {
        throw AppError.unprocessable({
          message: `Please provide ${model.toLowerCase()} ID for ownership check!`,
          code: "OWNERSHIP VALIDATION FAILED",
          details: { resourceId },
        });
      }

      const isResourceIdValid = isValidObjectId(resourceId);

      if (!isResourceIdValid) {
        throw AppError.unprocessable({
          message: `Please provide a valid ${model.toLowerCase()} ID!`,
          code: `${model.toUpperCase()} ID VALIDATION FAILED`,
          details: { resourceId },
        });
      }

      const resource = await model.findById(resourceId).lean();

      if (!resource) {
        throw AppError.notFound({
          message: `No ${model.toLowerCase()} found with the provided ${model.toLowerCase()} ID!`,
          code: `${model.toUpperCase()} NOT FOUND`,
          details: { resource },
        });
      }

      req.data.user[resource] = sanitizeMongoData(resource);

      return req.data[resource][ownerField];
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
};

export const checkConditions = (conditions, req) => {
  if (!conditions) return;

  if (conditions.requireVerifiedEmail && !req.data.user.emailVerified) {
    throw AppError.forbidden({
      message: "Email verification required!",
    });
  }

  if (conditions.timeRange) {
    const hour = new Date().getHours();
    if (hour < conditions.timeRange.start || hour > conditions.timeRange.end) {
      throw AppError.forbidden({
        message: "Access denied due to time restrictions!",
      });
    }
  }
};
