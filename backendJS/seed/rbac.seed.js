import { Permission } from "../models/auth/permission.model.js";
import { Role } from "../models/auth/role.model.js";
import { PERMISSIONS } from "../constants/permission.constants.js";

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

  await Role.findOneAndUpdate(
    { name: "SUPER_ADMIN" },
    {
      name: "SUPER_ADMIN",
      permissions: permissionDocs,
    },
    { upsert: true },
  );

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
