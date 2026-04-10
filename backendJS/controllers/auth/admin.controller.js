import { httpStatusConfig } from "../../config/http.config.js";
import User from "../../models/auth/user.model.js";
import Account from "../../models/auth/account.model.js";
import Profile from "../../models/auth/profile.model.js";
import Role from "../../models/auth/role.model.js";
import ActivityLog from "../../models/auth/activityLog.model.js";
import Session from "../../models/auth/session.model.js";
import { sessionService } from "../../services/auth/session.service.js";
import { successResponseHandler } from "../../utils/response.utils.js";
import { asyncHandler } from "../../utils/common.utils.js";
import AppError from "../../errors/app.error.js";
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "../../constants/common.constants.js";

export const listUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
    status,
    role,
    search,
    sortBy = "createdAt",
    order = "desc",
  } = req.data.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (status) filter.status = status;
  if (role) filter.role = role;

  const sortOrder = order === "asc" ? 1 : -1;
  const sortObj = { [sortBy]: sortOrder };

  let userIds = null;
  if (search) {
    const profiles = await Profile.find({
      $or: [
        { userName: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ],
    })
      .select("user")
      .lean();

    const accounts = await Account.find({
      email: { $regex: search, $options: "i" },
    })
      .select("user")
      .lean();

    userIds = [
      ...new Set([
        ...profiles.map((p) => p.user.toString()),
        ...accounts.map((a) => a.user.toString()),
      ]),
    ];
    filter._id = { $in: userIds };
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .populate("role", "name permissions")
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(filter),
  ]);

  const userAccounts = await Account.find({
    user: { $in: users.map((u) => u._id) },
  })
    .select("user email provider")
    .lean();

  const accountMap = userAccounts.reduce((acc, a) => {
    if (!acc[a.user.toString()]) acc[a.user.toString()] = [];
    acc[a.user.toString()].push({ email: a.email, provider: a.provider });
    return acc;
  }, {});

  const enriched = users.map((u) => ({
    ...u,
    accounts: accountMap[u._id.toString()] || [],
  }));

  successResponseHandler(req, res, {
    status: "USERS LIST FETCH SUCCESS",
    message: "Users list fetched successfully!",
    data: {
      users: enriched,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  });
});

export const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.data.params;

  const [user, profile, accounts, sessions] = await Promise.all([
    User.findById(userId).populate("role", "name permissions").lean(),
    Profile.findOne({ user: userId }).lean(),
    Account.find({ user: userId }).select("-password").lean(),
    Session.find({ user: userId, expiresAt: { $gt: new Date() } }).lean(),
  ]);

  if (!user) {
    throw AppError.notFound({
      message: "No user found with provided userId!",
      code: "USER NOT FOUND",
      details: { userId },
    });
  }

  successResponseHandler(req, res, {
    status: "USER DETAILS FETCH SUCCESS",
    message: "User details fetched successfully!",
    data: {
      user,
      profile,
      accounts,
      activeSessions: sessions.length,
    },
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.data.params;
  const { status } = req.body;

  if (!["active", "suspended", "deleted"].includes(status)) {
    throw AppError.unprocessable({
      message: "User status must be 'active', 'suspended', or 'deleted'!",
      code: "INVALID USER STATUS",
      details: { status },
    });
  }

  if (userId === req.data.userId) {
    throw AppError.badRequest({
      message: "Admins cannot change their own status!",
      code: "USER STATUS UPDATE FAILED",
      details: { status },
    });
  }

  const updates = { status };
  if (status === "deleted") updates.deletedAt = new Date();
  if (status === "active") updates.deletedAt = null;

  const user = await User.findByIdAndUpdate(userId, updates, {
    returnDocument: "after",
  });
  if (!user) {
    throw AppError.notFound({
      message: "No user found with provided userId!",
      code: "USER NOT FOUND",
      details: { userId },
    });
  }

  if (status !== "active") {
    await sessionService.revokeAllUserSessions(userId);
  }

  await ActivityLog.create({
    user: req.data.userId,
    action: "admin_user_status_changed",
    metadata: { targetUserId: userId, newStatus: status },
    ipAddress: req.ip,
  }).catch(() => {});

  successResponseHandler(req, res, {
    status: "USER STATUS UPDATE SUCCESS",
    message: `User status updated to '${status}' successfully!`,
    data: { user },
  });
});

export const forceLogoutUser = asyncHandler(async (req, res) => {
  const { userId } = req.data.params;

  const result = await sessionService.revokeAllUserSessions(userId);

  await ActivityLog.create({
    user: req.data.userId,
    action: "admin_force_logout",
    metadata: { targetUserId: userId, sessionsRevoked: result.deletedCount },
    ipAddress: req.ip,
  }).catch(() => {});

  successResponseHandler(req, res, {
    status: "LOGOUT USER SUCCESS",
    message: "All sessions revoked for user!",
    data: { revoked: result.deletedCount },
  });
});

export const hardDeleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.data.params;

  if (userId === req.data.userId) {
    throw AppError.badRequest({
      message: "Admins cannot delete their own account this way!",
      code: "ACCOUNT DELETE FAILED",
      details: { userId },
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    throw AppError.notFound({
      message: "No user found with provided userId!",
      code: "USER NOT FOUND",
      details: { userId },
    });
  }

  await Promise.all([
    Account.deleteMany({ user: userId }),
    Profile.findOneAndDelete({ user: userId }),
    Session.deleteMany({ user: userId }),
    ActivityLog.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId),
  ]);

  successResponseHandler(req, res, {
    status: "USER DELETE SUCCESS",
    message: "User and all associated data permanently deleted!",
  });
});

export const listRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find().lean();

  successResponseHandler(req, res, {
    status: "ROLES FETCH SUCCESS",
    message: "Roles list fetched successfully!",
    data: { roles },
  });
});

export const createRole = asyncHandler(async (req, res) => {
  const { name, permissions } = req.body;

  if (!name) {
    throw AppError.badRequest({
      message: "Role name is required to create role!",
      code: "ROLE CREATE FAILED",
    });
  }

  const existing = await Role.findOne({ name: name.toLowerCase() });
  if (existing) {
    throw AppError.conflict({
      message: "Role with this name already exists.",
      code: "ROLE ALREADY EXISTS",
    });
  }

  const role = await Role.create({
    name: name.toLowerCase(),
    permissions: permissions || [],
  });

  successResponseHandler(req, res, {
    status: "ROLE CREATE SUCCESS",
    statusCode: httpStatusConfig.created.statusCode,
    message: "New role created successfully!",
    data: { role },
  });
});

export const assignRole = asyncHandler(async (req, res) => {
  const { userId } = req.data.params;
  const { roleId } = req.body;

  if (!roleId) {
    throw AppError.unprocessable({
      message: "roleId is required to assign roles!",
      code: "ROLE ASSIGN FAILED",
      details: { roleId },
    });
  }

  const [user, role] = await Promise.all([
    User.findById(userId),
    Role.findById(roleId),
  ]);

  if (!user) {
    throw AppError.notFound({
      message: "No user found with provided userId!",
      code: "USER NOT FOUND",
      details: { userId },
    });
  }

  if (!role) {
    throw AppError.notFound({
      message: "No role found with provided roleId!",
      code: "ROLE NOT FOUND",
      details: { roleId },
    });
  }

  await user.updateOne({ role: role._id });

  await ActivityLog.create({
    user: req.data.userId,
    action: "admin_role_assigned",
    metadata: { targetUserId: userId, roleId, roleName: role.name },
    ipAddress: req.ip,
  }).catch(() => {});

  successResponseHandler(req, res, {
    status: "USER ROLE ASSIGN SUCCESS",
    message: `Role '${role.name}' assigned to user successfully!`,
  });
});

export const updateRole = asyncHandler(async (req, res) => {
  const { roleId } = req.data.params;
  const { name, permissions } = req.body;

  const role = await Role.findById(roleId);
  if (!role) {
    throw AppError.notFound({
      message: "No role found with provided roleId!",
      code: "ROLE NOT FOUND",
      details: { roleId },
    });
  }

  if (name) role.name = name.toLowerCase();
  if (permissions) role.permissions = permissions;

  await role.save();

  successResponseHandler(req, res, {
    status: "ROLE UPDATE SUCCESS",
    message: "Role updated successfully!",
    data: { role },
  });
});

export const deleteRole = asyncHandler(async (req, res) => {
  const { roleId } = req.data.params;

  const usersWithRole = await User.countDocuments({ role: roleId });
  if (usersWithRole > 0) {
    throw AppError.badRequest({
      message: `Cannot delete role. ${usersWithRole} user(s) are assigned to it.`,
      code: "ROLE DELETE FAILED",
    });
  }

  const role = await Role.findByIdAndDelete(roleId);
  if (!role) {
    throw AppError.notFound({
      message: "No role found with provided roleId!",
      code: "ROLE NOT FOUND",
      details: { roleId },
    });
  }

  successResponseHandler(req, res, {
    status: "ROLE DELETE SUCCESS",
    message: "Role deleted successfully!",
  });
});

export const getActivityLogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
    userId,
    action,
    from,
    to,
  } = req.data.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (userId) filter.user = userId;
  if (action) filter.action = action;

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate("user", "status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    ActivityLog.countDocuments(filter),
  ]);

  successResponseHandler(req, res, {
    status: "ACTIVITY LOGS FETCH SUCCESS",
    message: "Activity logs fetched successfully!",
    data: {
      logs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  });
});

export const getStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    suspendedUsers,
    deletedUsers,
    totalRoles,
    activeSessions,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: "active" }),
    User.countDocuments({ status: "suspended" }),
    User.countDocuments({ status: "deleted" }),
    Role.countDocuments(),
    Session.countDocuments({ expiresAt: { $gt: new Date() } }),
  ]);

  successResponseHandler(req, res, {
    status: "STATS FETCH SUCCESS",
    message: "Stats fetched successfully!",
    data: {
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers,
        deleted: deletedUsers,
      },
      roles: totalRoles,
      activeSessions,
    },
  });
});
