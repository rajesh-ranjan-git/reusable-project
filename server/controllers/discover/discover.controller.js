import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "../../constants/common.constants.js";
import { RESTRICTED_ROLES } from "../../constants/roles.constants.js";
import Profile from "../../models/user/profile/profile.model.js";
import Role from "../../models/user/rbac/role.model.js";
import UserRole from "../../models/user/rbac/user.role.model.js";
import Connection from "../../models/connection/connection.model.js";
import {
  asyncHandler,
  omitObjectProperties,
} from "../../utils/common.utils.js";
import { sanitizeMongoData } from "../../db/db.utils.js";
import AppError from "../../services/error/error.service.js";
import { responseService } from "../../services/response/response.service.js";

export const discoverProfiles = asyncHandler(async (req, res) => {
  const { page = 1, limit = DEFAULT_PAGE_SIZE, search } = req.data.query;

  const currentUserId = req.data.userId;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const restrictedRoles = await Role.find({
    name: { $in: RESTRICTED_ROLES },
  })
    .select("_id")
    .lean();

  const restrictedRoleIds = restrictedRoles.map((r) => r.id);

  const restrictedUsers = await UserRole.find({
    role: { $in: restrictedRoleIds },
  })
    .select("user")
    .lean();

  const restrictedUserIds = restrictedUsers.map((u) => u.user.toString());

  const connections = await Connection.find({
    connectionStatus: { $in: ["interested", "accepted", "blocked"] },
    $or: [{ sender: currentUserId }, { receiver: currentUserId }],
  })
    .select("sender receiver")
    .lean();

  const connectedUserIds = connections.map((connection) => {
    return connection.sender.toString() === currentUserId.toString()
      ? connection.receiver.toString()
      : connection.sender.toString();
  });

  const excludedUserIds = [
    ...restrictedUserIds,
    ...connectedUserIds,
    currentUserId,
  ];

  const filter = {
    user: {
      $nin: excludedUserIds,
    },
  };

  if (search) {
    filter.$or = [
      { userName: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { headline: { $regex: search, $options: "i" } },
    ];
  }

  const [profiles, total] = await Promise.all([
    Profile.find(filter)
      .populate("user", "status lastSeen")
      .populate({
        path: "address",
        select: "city state country location",
      })
      .select("-_id -updatedAt -avatarFileId -coverFileId -interests")
      .skip(skip)
      .limit(limitNum),
    Profile.countDocuments(filter),
  ]);

  const users = profiles.filter((profile) => profile.user?.status === "active");

  const normalizedUsers = sanitizeMongoData(users).map((user) => ({
    userId: user.user.id,
    location: user.address?.location ?? null,
    ...omitObjectProperties(user, [
      "id",
      "user",
      "createdAt",
      "dob",
      "gender",
      "maritalStatus",
      "phone",
      "experiences",
      "skills",
      "address",
    ]),
  }));

  return responseService.successResponseHandler(req, res, {
    status: "DISCOVER FETCH SUCCESS",
    message: "Profiles fetched successfully!",
    data: {
      users: normalizedUsers,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  });
});
