import { Permission } from "../models/permission.model.js";
import { Role } from "../models/role.model.js";
import { PERMISSIONS } from "../constants/permissions.js";

export const seedRBAC = async () => {
  const permissionNames = Object.values(PERMISSIONS);

  const permissionDocs = await Promise.all(
    permissionNames.map((name) =>
      Permission.findOneAndUpdate(
        { name },
        { name },
        { upsert: true, new: true },
      ),
    ),
  );

  const getPermissions = (names) =>
    permissionDocs.filter((p) => names.includes(p.name));

  // SUPER ADMIN
  await Role.findOneAndUpdate(
    { name: "SUPER_ADMIN" },
    {
      name: "SUPER_ADMIN",
      permissions: permissionDocs,
    },
    { upsert: true },
  );

  // ADMIN
  await Role.findOneAndUpdate(
    { name: "ADMIN" },
    {
      name: "ADMIN",
      permissions: getPermissions([
        PERMISSIONS.USER_READ,
        PERMISSIONS.USER_UPDATE,
        PERMISSIONS.ADMIN_ACCESS,
      ]),
    },
    { upsert: true },
  );

  // USER
  await Role.findOneAndUpdate(
    { name: "USER" },
    {
      name: "USER",
      permissions: getPermissions([PERMISSIONS.PROFILE_UPDATE]),
    },
    { upsert: true },
  );

  console.log("RBAC Seeded");
};
