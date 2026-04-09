import { Role } from "../models/role.model.js";
import { Permission } from "../models/permission.model.js";

// Create role
export const createRole = async (req, res) => {
  const { name, description } = req.body;

  const role = await Role.create({ name, description });

  res.json(role);
};

// Assign permission to role
export const addPermissionsToRole = async (req, res) => {
  const { roleId, permissionKeys } = req.body;

  const permissions = await Permission.find({
    key: { $in: permissionKeys },
  });

  const role = await Role.findById(roleId);

  role.permissions.addToSet(...permissions.map((p) => p._id));
  await role.save();

  res.json({ message: "Permissions added" });
};

// Inherit role
export const inheritRole = async (req, res) => {
  const { roleId, parentRoleId } = req.body;

  const role = await Role.findById(roleId);

  role.inherits.addToSet(parentRoleId);
  await role.save();

  res.json({ message: "Role inheritance added" });
};
