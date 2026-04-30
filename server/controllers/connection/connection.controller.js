import { httpStatusConfig } from "../../config/http.config.js";
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "../../constants/common.constants.js";
import Connection from "../../models/connection/connection.model.js";
import Notification from "../../models/notification/notification.model.js";
import Profile from "../../models/user/profile/profile.model.js";
import { getNotificationBody } from "../../utils/notification.utils.js";
import { sanitizeMongoData } from "../../db/db.utils.js";
import {
  asyncHandler,
  selectObjectProperties,
} from "../../utils/common.utils.js";
import { validateConnectionStatus } from "../../validators/connection.validator.js";
import AppError from "../../services/error/error.service.js";
import { responseService } from "../../services/response/response.service.js";

export const connect = asyncHandler(async (req, res) => {
  const userId = await req.data.userId;
  const { userId: otherUserId } = await req.data.params;
  const { status: connectionStatus } = await req.data.body;

  if (userId === otherUserId) {
    throw AppError.forbidden({
      message: "You cannot send connection request to yourself!",
      code: "CONNECTION REQUEST FAILED",
    });
  }

  const validatedConnectionStatus = validateConnectionStatus(connectionStatus);

  const existingConnection = await Connection.findOne({
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId },
    ],
  }).lean();

  let connectionToCreate = { lastActionedBy: userId };
  let connectionToUpdate = { lastActionedBy: userId };
  let notificationObject = {};

  switch (validatedConnectionStatus) {
    case "interested":
      if (!existingConnection) {
        connectionToCreate = {
          sender: userId,
          receiver: otherUserId,
          connectionStatus: validatedConnectionStatus,
          ...connectionToCreate,
        };

        notificationObject = {
          type: "connection",
          title: "You have a new connection request!",
          to: otherUserId,
          from: userId,
          connectionStatus: validatedConnectionStatus,
        };
        break;
      }

      if (
        existingConnection.connectionStatus !== "not-interested" &&
        existingConnection.connectionStatus !== "rejected"
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              sender: existingConnection.sender.toString(),
              receiver: existingConnection.receiver.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      if (
        existingConnection.connectionStatus === "rejected" &&
        (existingConnection.rejectedBySenderCount >= 5 ||
          existingConnection.rejectedByReceiverCount >= 5)
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              sender: existingConnection.sender.toString(),
              receiver: existingConnection.receiver.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      connectionToUpdate = {
        connectionStatus: validatedConnectionStatus,
        rejectedBySenderCount:
          existingConnection.sender.toString() === userId
            ? 0
            : existingConnection.rejectedBySenderCount,
        rejectedByReceiverCount:
          existingConnection.receiver.toString() === userId
            ? 0
            : existingConnection.rejectedByReceiverCount,
        ...connectionToUpdate,
      };

      break;

    case "not-interested":
      if (!existingConnection) {
        connectionToCreate = {
          sender: userId,
          receiver: otherUserId,
          connectionStatus: validatedConnectionStatus,
          ...connectionToCreate,
        };

        break;
      }

      if (existingConnection.connectionStatus === "accepted") {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              sender: existingConnection.sender.toString(),
              receiver: existingConnection.receiver.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      if (
        existingConnection.connectionStatus === "interested" &&
        existingConnection.lastActionedBy.toString() === userId
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              sender: existingConnection.sender.toString(),
              receiver: existingConnection.receiver.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      if (
        existingConnection.connectionStatus === "rejected" &&
        (existingConnection.rejectedBySenderCount >= 5 ||
          existingConnection.rejectedByReceiverCount >= 5)
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              sender: existingConnection.sender.toString(),
              receiver: existingConnection.receiver.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      if (
        existingConnection.connectionStatus === "blocked" &&
        existingConnection.lastActionedBy.toString() !== userId
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              sender: existingConnection.sender.toString(),
              receiver: existingConnection.receiver.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      connectionToUpdate = {
        connectionStatus: validatedConnectionStatus,
        ...connectionToUpdate,
      };

      break;

    case "accepted":
      if (!existingConnection) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection,
          },
        });
      }

      if (
        existingConnection.connectionStatus !== "interested" ||
        existingConnection.lastActionedBy.toString() === userId
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              sender: existingConnection.sender.toString(),
              receiver: existingConnection.receiver.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      connectionToUpdate = {
        connectionStatus: validatedConnectionStatus,
        ...connectionToUpdate,
      };

      notificationObject = {
        type: "connection",
        title: "You have a new connection request!",
        to: otherUserId,
        from: userId,
        connectionStatus: validatedConnectionStatus,
      };

      break;

    case "rejected":
      if (!existingConnection) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection,
          },
        });
      }

      if (
        existingConnection.connectionStatus !== "interested" &&
        existingConnection.connectionStatus !== "accepted"
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              sender: existingConnection.sender.toString(),
              receiver: existingConnection.receiver.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      if (
        existingConnection.connectionStatus === "interested" &&
        existingConnection.lastActionedBy.toString() === userId
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              sender: existingConnection.sender.toString(),
              receiver: existingConnection.receiver.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      let rejectedBySenderCount = 0;
      let rejectedByReceiverCount = 0;
      let newConnectionStatus = "rejected";

      if (existingConnection.sender.toString() === userId) {
        rejectedBySenderCount = existingConnection.rejectedBySenderCount + 1;

        if (rejectedBySenderCount >= 5) {
          newConnectionStatus = "blocked";
          rejectedBySenderCount = 0;
        }
      } else if (existingConnection.receiver.toString() === userId) {
        rejectedByReceiverCount =
          existingConnection.rejectedByReceiverCount + 1;

        if (rejectedByReceiverCount >= 5) {
          newConnectionStatus = "blocked";
          rejectedByReceiverCount = 0;
        }
      }

      connectionToUpdate = {
        connectionStatus: newConnectionStatus,
        rejectedBySenderCount,
        rejectedByReceiverCount,
        ...connectionToUpdate,
      };

      break;

    case "blocked":
      if (!existingConnection) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection,
          },
        });
      }

      if (
        existingConnection.connectionStatus !== "accepted" &&
        existingConnection.connectionStatus !== "interested"
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              sender: existingConnection.sender.toString(),
              receiver: existingConnection.receiver.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      if (
        existingConnection.connectionStatus === "interested" &&
        existingConnection.lastActionedBy.toString() === userId
      ) {
        throw AppError.badRequest({
          message: "Invalid connection request!",
          code: "CONNECTION REQUEST FAILED",
          details: {
            status: validatedConnectionStatus,
            existingConnection: {
              sender: existingConnection.sender.toString(),
              receiver: existingConnection.receiver.toString(),
              connectionStatus: existingConnection.connectionStatus,
            },
          },
        });
      }

      connectionToUpdate = {
        connectionStatus: validatedConnectionStatus,
        ...connectionToUpdate,
      };

      break;

    default:
      throw AppError.badRequest({
        message: "Invalid connection request!",
        code: "CONNECTION REQUEST FAILED",
        details: {
          status: validatedConnectionStatus,
          existingConnection: {
            sender: existingConnection.sender.toString(),
            receiver: existingConnection.receiver.toString(),
            connectionStatus: existingConnection.connectionStatus,
          },
        },
      });
  }

  const connection = connectionToCreate.sender
    ? await Connection.create(connectionToCreate)
    : await Connection.findOneAndUpdate(
        {
          $or: [
            { sender: userId, receiver: otherUserId },
            { sender: otherUserId, receiver: userId },
          ],
        },
        { $set: connectionToUpdate },
        { returnDocument: "after", upsert: false, runValidators: true },
      );

  if (!connection) {
    throw AppError.internal({
      message: "Unable to send connection request!",
      code: "CONNECTION REQUEST FAILED",
      details: { connection },
    });
  }

  if (notificationObject && Object.values(notificationObject).length > 0) {
    const { firstName } = await Profile.findOne({
      user: connection.sender,
    })
      .select("-_id firstName")
      .lean();

    notificationObject.body = getNotificationBody(
      firstName,
      notificationObject.type,
      notificationObject.connectionStatus,
    );

    const notifications = await Notification.create(notificationObject);

    if (!notifications) {
      logger.warn(
        "🚨 [NOTIFICATION FAILED] Failed to send connection notification!",
        notifications,
      );
    }
  }

  return responseService.successResponseHandler(req, res, {
    status: "CONNECTION REQUEST SUCCESS",
    message: "Connection request sent successfully!",
    data: { connection },
  });
});

export const connections = asyncHandler(async (req, res) => {
  const { page = 1, limit = DEFAULT_PAGE_SIZE, search } = req.data.query;

  const userId = req.data.userId;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const connections = await Connection.find({
    $or: [{ sender: userId }, { receiver: userId }],
    connectionStatus: "accepted",
  })
    .sort({ updatedAt: -1 })
    .lean();

  const connectedUserIds = connections.map((connection) => {
    return connection.sender.toString() === userId
      ? connection.receiver.toString()
      : connection.sender.toString();
  });

  const filter = {
    user: {
      $in: connectedUserIds,
    },
  };

  const [profiles, total] = await Promise.all([
    Profile.find(filter)
      .populate("user", "status lastSeen")
      .select("userName firstName lastName avatar bio experiences")
      .skip(skip)
      .limit(limitNum),
    Profile.countDocuments(filter),
  ]);

  const users = profiles.filter((profile) => profile.user?.status === "active");

  const normalizedUsers = sanitizeMongoData(users).map((user) => ({
    userId: user.user.id,
    lastSeen: user.user.lastSeen,
    ...selectObjectProperties(user, [
      "userName",
      "firstName",
      "lastName",
      "fullName",
      "avatar",
      "currentJobRole",
      "bio",
    ]),
  }));

  return responseService.successResponseHandler(req, res, {
    status: "CONNECTIONS FETCH SUCCESS",
    message: "Connections fetched successfully!",
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

export const requests = asyncHandler(async (req, res) => {
  const { page = 1, limit = DEFAULT_PAGE_SIZE, search } = req.data.query;

  const userId = req.data.userId;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const connections = await Connection.find({
    receiver: userId,
    connectionStatus: "interested",
  })
    .sort({ updatedAt: -1 })
    .lean();

  const connectedUserIds = connections.map((connection) =>
    connection.sender.toString(),
  );

  const filter = {
    user: {
      $in: connectedUserIds,
    },
  };

  const [profiles, total] = await Promise.all([
    Profile.find(filter)
      .populate("user", "status")
      .select("userName firstName lastName avatar bio experiences")
      .skip(skip)
      .limit(limitNum),
    Profile.countDocuments(filter),
  ]);

  const users = profiles.filter((profile) => profile.user?.status === "active");

  const normalizedUsers = sanitizeMongoData(users).map((user) => ({
    userId: user.user.id,
    ...selectObjectProperties(user, [
      "userName",
      "firstName",
      "lastName",
      "fullName",
      "avatar",
      "currentJobRole",
      "bio",
    ]),
  }));

  return responseService.successResponseHandler(req, res, {
    status: "REQUESTS FETCH SUCCESS",
    message: "Connection requests fetched successfully!",
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
