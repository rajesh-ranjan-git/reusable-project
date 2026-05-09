import { isValidObjectId } from "mongoose";
import Conversation from "../models/conversation/conversation.model.js";
import Connection from "../models/connection/connection.model.js";
import { sanitizeMongoData } from "../db/db.utils.js";
import { omitObjectProperties } from "./common.utils.js";
import AppError from "../services/error/error.service.js";

export const normalizeConversation = (conversation) => {
  conversation.participants = conversation.participants.map((participant) => {
    const user = participant.user || {};
    const account = user.account || {};
    const profile = user.profile || {};

    return {
      ...participant,
      user: {
        userId: user.id,
        status: user.status,
        lastSeen: user.lastSeen,
        email: account.email,
        userName: profile.userName,
        firstName: profile.firstName,
        lastName: profile.lastName,
        fullName: profile.fullName,
        avatar: profile.avatar,
        currentJobRole: profile.currentJobRole,
      },
    };
  });

  return conversation;
};

export const normalizeMessage = (message) => {
  const normalizedMessage = {
    ...message,
    sender: {
      userId: message.sender.id,
      status: message.sender.status,
      lastSeen: message.sender.lastSeen,
      email: message.sender.account.email,
      userName: message.sender.profile.userName,
      firstName: message.sender.profile.firstName,
      lastName: message.sender.profile.lastName,
      fullName: message.sender.profile.fullName,
      avatar: message.sender.profile.avatar,
    },
  };

  return normalizedMessage;
};

export const getAcceptedConnectionUserIds = async (userId) => {
  const connections = await Connection.find({
    $or: [{ sender: userId }, { receiver: userId }],
    connectionStatus: "accepted",
  }).select("sender receiver");

  return connections.map((connection) =>
    connection.sender.toString() === userId
      ? connection.receiver
      : connection.sender,
  );
};

export const assertDirectConversationConnected = async (
  conversation,
  userId,
) => {
  if (conversation.type !== "direct") return;

  const targetParticipant = conversation.participants.find((participant) => {
    const participantUserId = (
      participant.user?._id ?? participant.user
    ).toString();

    return participantUserId !== userId && !participant.leftAt;
  });

  if (!targetParticipant) {
    throw AppError.forbidden({
      message: "You can only chat with users you are connected with!",
      code: "CONVERSATION ACCESS DENIED",
    });
  }

  const targetUserId = targetParticipant.user?._id ?? targetParticipant.user;

  const connection = await Connection.findOne({
    $or: [
      { sender: userId, receiver: targetUserId },
      { sender: targetUserId, receiver: userId },
    ],
    connectionStatus: "accepted",
  }).select("_id");

  if (!connection) {
    throw AppError.forbidden({
      message: "You can only chat with users you are connected with!",
      code: "CONVERSATION ACCESS DENIED",
    });
  }
};

export const assertParticipant = async (conversationId, userId) => {
  if (!isValidObjectId(conversationId)) {
    throw AppError.unprocessable({
      message: "Conversation ID is invalid!",
      code: "INVALID CONVERSATION ID",
      details: { conversationId },
    });
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    deletedAt: null,
    participants: {
      $elemMatch: { user: userId, leftAt: null },
    },
  });

  if (!conversation) {
    throw AppError.notFound({
      message: "Conversation not found or you are not a participant!",
      code: "CONVERSATION NOT FOUND",
      details: { conversation },
    });
  }

  await assertDirectConversationConnected(conversation, userId);

  return conversation;
};

export const updateConversationAfterSend = async (
  conversationId,
  message,
  sender,
) => {
  if (!isValidObjectId(conversationId)) {
    throw AppError.unprocessable({
      message: "Conversation ID is invalid!",
      code: "INVALID CONVERSATION ID",
      details: { conversationId },
    });
  }

  await Conversation.updateOne(
    { _id: conversationId },
    {
      $set: {
        lastMessage: {
          messageId: message.id,
          content:
            message.contentType === "text"
              ? message.content
              : `[${message.contentType}]`,
          contentType: message.contentType,
          sentBy: sender,
          sentAt: message.createdAt,
        },
        lastActivityAt: message.createdAt,
      },

      $inc: { "participants.$[other].unreadCount": 1 },
    },
    {
      arrayFilters: [{ "other.user": { $ne: sender } }],
    },
  );
};
