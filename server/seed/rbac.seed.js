import "../services/logger/logger.service.js";
import { setDbAdapter } from "../services/logger/logger.service.js";
import connectDB from "../db/db.connect.js";
import Permission from "../models/user/rbac/permission.model.js";
import Role from "../models/user/rbac/role.model.js";
import Log from "../models/log/log.model.js";
import { PERMISSIONS } from "../constants/permission.constants.js";
import { ROLE_PERMISSIONS_MAP } from "../config/role.permission.map.config.js";
import { ROLE_HIERARCHY, ROLES } from "../constants/roles.constants.js";
import { authService } from "../services/auth/auth.service.js";
import UserRole from "../models/user/rbac/user.role.model.js";

const seedRBAC = async () => {
  try {
    await connectDB();
    setDbAdapter(async (entry) => Log.create(entry));

    logger.info("📢 [ RBAC ] Initial roles and permissions seeding started!");

    const allPermissionKeys = Object.values(PERMISSIONS).filter(
      (key) => key !== PERMISSIONS.ALL,
    );

    const permissionDocs = await Promise.all(
      allPermissionKeys.map((key) =>
        Permission.findOneAndUpdate(
          { key },
          { key },
          {
            upsert: true,
            returnDocument: "after",
            setDefaultsOnInsert: true,
          },
        ),
      ),
    );

    const permissionMap = new Map(permissionDocs.map((p) => [p.key, p._id]));

    for (const [roleName, permissionKeys] of Object.entries(
      ROLE_PERMISSIONS_MAP,
    )) {
      let permissions = [];

      if (permissionKeys.includes(PERMISSIONS.ALL)) {
        permissions = permissionDocs.map((p) => p._id);
      } else {
        permissions = permissionKeys
          .map((key) => permissionMap.get(key))
          .filter(Boolean);
      }

      const priority = ROLE_HIERARCHY[roleName];

      await Role.findOneAndUpdate(
        { name: roleName },
        {
          name: roleName,
          permissions,
          priority,
        },
        {
          upsert: true,
          returnDocument: "after",
          setDefaultsOnInsert: true,
        },
      );
    }

    const { userId: superAdminUserId } = await authService.register({
      email: "super.admin@server.com",
      password: "SuperAdmin@0",
      userName: "super_admin",
    });

    const superAdminRole = await Role.findOne({ name: ROLES.SUPER_ADMIN });

    await UserRole.findOneAndUpdate(
      { user: superAdminUserId },
      { $set: { role: superAdminRole._id } },
    );

    const { userId: adminUserId } = await authService.register({
      email: "admin@server.com",
      password: "Admin@01",
      userName: "admin",
    });

    const adminRole = await Role.findOne({ name: ROLES.ADMIN });

    await UserRole.findOneAndUpdate(
      { user: adminUserId },
      { $set: { role: adminRole._id } },
    );

    logger.success(
      "✅ [ RBAC ] Initial roles and permission seeded Successfully!",
    );
    process.exit(0);
  } catch (error) {
    logger.error(
      "❌ [ RBAC ] Initial roles and permission seeding Failed:",
      error,
    );

    process.exit(1);
  }
};

seedRBAC();
