import { isValidObjectId } from "mongoose";
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
      message: "Conversation not found or you are not a participant.",
    });
  }

  if (!conversation) {
    throw AppError.notFound({
      message: "Conversation not found or you are not a participant!",
      code: "CONVERSATION NOT FOUND",
      details: { conversation },
    });
  }

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
      },

      $inc: { "participants.$[other].unreadCount": 1 },
    },
    {
      arrayFilters: [{ "other.user": { $ne: sender } }],
    },
  );
};
