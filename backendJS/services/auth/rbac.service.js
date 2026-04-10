import UserRole from "../../models/auth/userRole.model.js";
import { extractPermissions } from "../../utils/rbac.utils.js";

export const getUserRoles = async (userId) => {
  const roles = await UserRole.find({ user: userId }).populate({
    path: "role",
  });

  return roles;
};

export const getUserPermissions = async (userId) => {
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

  return Array.from(extractPermissions(userRoles));
};
