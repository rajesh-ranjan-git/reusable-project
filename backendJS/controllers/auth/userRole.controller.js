import { UserRole } from "../models/userRole.model.js";
import { Role } from "../models/role.model.js";

// Assign role
export const assignRoleToUser = async (req, res) => {
  const { userId, roleName } = req.body;

  const role = await Role.findOne({ name: roleName });

  const userRole = await UserRole.create({
    user: userId,
    role: role._id,
    assignedBy: req.data.userId,
  });

  res.json(userRole);
};

// Revoke role
export const revokeRole = async (req, res) => {
  const { userId, roleId } = req.body;

  await UserRole.updateOne(
    { user: userId, role: roleId },
    { status: "REVOKED" },
  );

  res.json({ message: "Role revoked" });
};
