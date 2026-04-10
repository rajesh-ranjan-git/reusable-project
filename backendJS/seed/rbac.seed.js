import "../lib/logger/logger.js";
import { setDbAdapter } from "../lib/logger/logger.js";
import connectDB from "../db/db.connect.js";
import Permission from "../models/auth/permission.model.js";
import Role from "../models/auth/role.model.js";
import Log from "../models/log/log.model.js";
import { PERMISSIONS } from "../constants/permission.constants.js";
import { ROLE_PERMISSIONS_MAP } from "../config/permission.config.js";

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

      await Role.findOneAndUpdate(
        { name: roleName },
        {
          name: roleName,
          permissions,
        },
        {
          upsert: true,
          returnDocument: "after",
          setDefaultsOnInsert: true,
        },
      );
    }

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
