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
import { responseService } from "../../services/response/response.service.js";

export const discoverProfiles = asyncHandler(async (req, res) => {
  const { page = 1, limit = DEFAULT_PAGE_SIZE, search } = req.data.query;

  const currentUserId = req.data.userId;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;
  const normalizedSearch = typeof search === "string" ? search.trim() : "";
  const hasSearch = normalizedSearch.length > 0;

  const restrictedRoles = await Role.find({
    name: { $in: RESTRICTED_ROLES },
  })
    .select("_id")
    .lean();

  const restrictedRoleIds = restrictedRoles.map((r) => r._id);

  const restrictedUsers = await UserRole.find({
    role: { $in: restrictedRoleIds },
  })
    .select("user")
    .lean();

  const restrictedUserIds = restrictedUsers.map((u) => u.user.toString());

  const connections = await Connection.find({
    $or: [{ sender: currentUserId }, { receiver: currentUserId }],
  })
    .select("sender receiver connectionStatus lastActionedBy")
    .lean();

  const connectedUserIds = connections
    .filter((connection) =>
      ["interested", "accepted", "blocked"].includes(
        connection.connectionStatus,
      ),
    )
    .map((connection) => {
      return connection.sender.toString() === currentUserId.toString()
        ? connection.receiver.toString()
        : connection.sender.toString();
    });

  const blockedUserIds = connections
    .filter((connection) => connection.connectionStatus === "blocked")
    .map((connection) => {
      return connection.sender.toString() === currentUserId.toString()
        ? connection.receiver.toString()
        : connection.sender.toString();
    });

  const connectionByUserId = new Map();

  connections.forEach((connection) => {
    const otherUserId =
      connection.sender.toString() === currentUserId.toString()
        ? connection.receiver.toString()
        : connection.sender.toString();
    const lastActionedBy = connection.lastActionedBy?.toString();

    connectionByUserId.set(otherUserId, {
      connectionStatus: connection.connectionStatus,
      connectionDirection:
        lastActionedBy && lastActionedBy !== currentUserId.toString()
          ? "incoming"
          : "outgoing",
    });
  });

  const excludedConnectionUserIds = hasSearch
    ? blockedUserIds
    : connectedUserIds;

  const excludedUserIds = [
    ...restrictedUserIds,
    ...excludedConnectionUserIds,
    currentUserId,
  ];

  const filter = {
    user: {
      $nin: excludedUserIds,
    },
  };

  if (hasSearch) {
    const tokens = normalizedSearch.split(/\s+/).filter(Boolean);

    filter.$and = tokens.map((token) => ({
      $or: [
        { userName: { $regex: token, $options: "i" } },
        { firstName: { $regex: token, $options: "i" } },
        { lastName: { $regex: token, $options: "i" } },
        { nickName: { $regex: token, $options: "i" } },
        { bio: { $regex: token, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ["$firstName", " ", "$lastName"] },
              regex: token,
              options: "i",
            },
          },
        },
      ],
    }));
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

  const normalizedUsers = sanitizeMongoData(users).map((user) => {
    const connection = connectionByUserId.get(user.user.id);

    return {
      userId: user.user.id,
      location: user.address?.location ?? null,
      lastSeen: user.user.lastSeen,
      connectionStatus: connection?.connectionStatus ?? "none",
      connectionDirection: connection?.connectionDirection ?? null,
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
    };
  });

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
