import UserRole from "../../models/auth/userRole.model.js";

export const getUserRoles = async (userId) => {
  const roles = await UserRole.find({ user: userId }).populate({
    path: "role",
  });

  return roles;
};

export const getUserPermissions = async (userId) => {
  const roles = await UserRole.find({ user: userId }).populate({
    path: "role",
    populate: { path: "permissions" },
  });

  const permissions = new Set();

  roles.forEach((r) => {
    r.role.permissions.forEach((p) => {
      permissions.add(p.name);
    });
  });

  return permissions;
};
