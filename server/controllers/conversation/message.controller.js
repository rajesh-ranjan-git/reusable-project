import { isValidObjectId } from "mongoose";
import { DEFAULT_PAGE_SIZE } from "../../constants/common.constants.js";
import { httpStatusConfig } from "../../config/http.config.js";
import Conversation from "../../models/conversation/conversation.model.js";
import Message from "../../models/conversation/message.model.js";
import { asyncHandler } from "../../utils/common.utils.js";
import {
  assertParticipant,
  updateConversationAfterSend,
} from "../../utils/conversation.utils.js";
import AppError from "../../services/error/error.service.js";
import { responseService } from "../../services/response/response.service.js";

const MESSAGE_POPULATE = [
  {
    path: "sender",
    populate: [
      {
        path: "account",
        select: "email",
      },
      {
        path: "profile",
        select: "username firstName lastName fullName avatar",
      },
    ],
  },
  { path: "replyTo", select: "content contentType sender createdAt" },
];

export const sendMessage = asyncHandler(async (req, res) => {
  const sender = req.data.userId;
  const {
    conversationId,
    contentType = "text",
    content = "",
    attachments = [],
    location,
    replyTo,
    forwardedFrom,
  } = req.data.body;

  const conversation = await assertParticipant(conversationId, sender);

  if (
    conversation.type === "group" &&
    conversation.groupSettings?.sendPermission === "admins"
  ) {
    const participant = conversation.participants.find(
      (p) => p.user.toString() === sender && !p.leftAt,
    );
    if (!["admin", "owner"].includes(participant?.role)) {
      throw AppError.forbidden({
        message: "Only admins can send messages in this group.",
        code: "MESSAGE SEND FAILED",
      });
    }
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: sender,
    contentType,
    content: contentType === "text" ? content.trim() : "",
    attachments: contentType !== "text" ? attachments : [],
    location: contentType === "location" ? location : null,
    replyTo: replyTo ?? null,
    forwardedFrom: forwardedFrom ?? null,
    receipts: conversation.participants
      .filter((p) => !p.leftAt && p.user.toString() !== sender)
      .map((p) => ({ user: p.user })),
  });

  await message.populate(MESSAGE_POPULATE);
  await updateConversationAfterSend(conversationId, message, sender);

  return responseService.successResponseHandler(req, res, {
    statusCode: httpStatusConfig.created.statusCode,
    status: "MESSAGE SEND SUCCESS",
    message: "Message sent successfully!",
    data: { message },
  });
});

export const getMessages = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { conversationId } = req.data.params;
  const { cursor, limit = DEFAULT_PAGE_SIZE } = req.data.query;

  await assertParticipant(conversationId, currentUserId);

  const clampedLimit = Math.min(Number(limit), 100);

  const query = {
    conversation: conversationId,
  };

  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) };
  }

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(clampedLimit)
    .populate(MESSAGE_POPULATE)
    .lean();

  const nextCursor =
    messages.length === clampedLimit
      ? messages[messages.length - 1].createdAt
      : null;

  return responseService.successResponseHandler(req, res, {
    status: "MESSAGES FETCH SUCCESS",
    message: "Messages fetched successfully!",
    data: { messages: messages.reverse(), nextCursor },
  });
});

export const editMessage = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { messageId } = req.data.params;
  const { content } = req.data.body;

  if (!content?.trim()) {
    throw AppError.unprocessable({
      message: "Edited content cannot be empty!",
      code: "MESSAGE EDIT FAILED",
      details: { content },
    });
  }

  if (!isValidObjectId(messageId)) {
    throw AppError.unprocessable({
      message: "Message ID is invalid!",
      code: "MESSAGE EDIT FAILED",
      details: { messageId },
    });
  }

  const message = await Message.findById(messageId);

  if (!message) {
    throw AppError.notFound({
      message: "Message does not exist!",
      code: "MESSAGE NOT FOUND",
      details: { message },
    });
  }

  if (message.sender.toString() !== currentUserId) {
    throw AppError.forbidden({
      message: "You can only edit your own messages!",
      code: "MESSAGE EDIT FAILED",
    });
  }

  if (message.contentType !== "text") {
    throw AppError.badRequest({
      message: "Only text messages can be edited!",
      code: "MESSAGE EDIT FAILED",
    });
  }

  if (message.contentType === "deleted") {
    throw AppError.badRequest({
      message: "Cannot edit a deleted message!",
      code: "MESSAGE EDIT FAILED",
    });
  }

  const editedMessage = await Message.findByIdAndUpdate(
    messageId,
    {
      $push: {
        editHistory: {
          content: message.content,
          editedAt: new Date(),
        },
      },
      $set: {
        content: content.trim(),
      },
    },
    { returnDocument: "after", runValidators: true },
  ).populate(MESSAGE_POPULATE);

  return responseService.successResponseHandler(req, res, {
    status: "MESSAGE EDIT SUCCESS",
    message: "Message edited successfully!",
    data: { message: editedMessage },
  });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { messageId } = req.data.params;

  if (!isValidObjectId(messageId)) {
    throw AppError.unprocessable({
      message: "Message ID is invalid!",
      code: "MESSAGE DELETE FAILED",
      details: { messageId },
    });
  }

  const message = await Message.findById(messageId);

  if (!message) {
    throw AppError.notFound({
      message: "Message does not exist!",
      code: "MESSAGE NOT FOUND",
      details: { message },
    });
  }

  if (message.sender.toString() !== currentUserId) {
    throw AppError.forbidden({
      message: "You can only delete your own messages!",
      code: "MESSAGE DELETE FAILED",
    });
  }

  await Message.updateOne(
    { _id: messageId },
    {
      $set: {
        content: "",
        attachments: [],
        location: null,
        contentType: "deleted",
        deletedAt: new Date(),
      },
    },
  );

  return responseService.successResponseHandler(req, res, {
    status: "MESSAGE DELETE SUCCESS",
    message: "Message deleted successfully!",
  });
});

export const markDelivered = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { messageId } = req.data.params;

  if (!isValidObjectId(messageId)) {
    throw AppError.unprocessable({
      message: "Message ID is invalid!",
      code: "MESSAGE DELIVERY FAILED",
      details: { messageId },
    });
  }

  await Message.updateOne(
    {
      _id: messageId,
      "receipts.user": currentUserId,
      "receipts.deliveredAt": null,
    },
    { $set: { "receipts.$.deliveredAt": new Date() } },
  );

  return responseService.successResponseHandler(req, res, {
    status: "MESSAGE DELIVERY SUCCESS",
    message: "Message marked delivered successfully!",
  });
});

export const markSeen = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { messageId } = req.data.params;

  if (!isValidObjectId(messageId)) {
    throw AppError.unprocessable({
      message: "Message ID is invalid!",
      code: "MESSAGE SEEN FAILED",
      details: { messageId },
    });
  }

  const now = new Date();

  await Message.updateOne(
    { _id: messageId, "receipts.user": currentUserId },
    {
      $set: {
        "receipts.$.seenAt": now,
        "receipts.$.deliveredAt": now,
      },
    },
  );

  return responseService.successResponseHandler(req, res, {
    status: "MESSAGE SEEN SUCCESS",
    message: "Message marked seen successfully!",
  });
});

export const toggleReaction = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { messageId } = req.data.params;
  const { emoji } = req.data.body;

  if (!isValidObjectId(messageId)) {
    throw AppError.unprocessable({
      message: "Message ID is invalid!",
      code: "MESSAGE REACTION FAILED",
      details: { messageId },
    });
  }

  if (!emoji?.trim()) {
    throw AppError.badRequest({
      message: "Emoji is required!",
      code: "MESSAGE REACTION FAILED",
    });
  }

  const message = await Message.findById(messageId).select("reactions");

  if (!message) {
    throw AppError.notFound({
      message: "Message does not exist!",
      code: "MESSAGE NOT FOUND",
      details: { messageId },
    });
  }

  const exists = message.reactions.some(
    (r) => r.user.toString() === currentUserId && r.emoji === emoji,
  );

  const update = exists
    ? {
        $pull: {
          reactions: {
            user: currentUserId,
            emoji,
          },
        },
      }
    : {
        $push: {
          reactions: {
            user: currentUserId,
            emoji,
            reactedAt: new Date(),
          },
        },
      };

  const updatedMessage = await Message.findByIdAndUpdate(messageId, update, {
    new: true,
    select: "reactions",
  });

  return responseService.successResponseHandler(req, res, {
    status: "MESSAGE REACTION SUCCESS",
    message: "Reacted to message successfully!",
    data: { reactions: updatedMessage.reactions },
  });
});

export const pinMessage = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { conversationId, messageId } = req.data.params;

  if (!isValidObjectId(messageId)) {
    throw AppError.unprocessable({
      message: "Message ID is invalid!",
      code: "MESSAGE PIN FAILED",
      details: { messageId },
    });
  }

  const message = await Message.findById(messageId);

  if (!message) {
    throw AppError.notFound({
      message: "Message does not exist!",
      code: "MESSAGE NOT FOUND",
      details: { message },
    });
  }

  const conversation = await assertParticipant(conversationId, currentUserId);

  if (conversation.type === "group") {
    const participant = conversation.participants.find(
      (p) => p.user.toString() === currentUserId && !p.leftAt,
    );
    if (!["admin", "owner"].includes(participant?.role)) {
      throw AppError.forbidden({
        message: "Only admins can pin messages!",
        code: "MESSAGE PIN FAILED",
      });
    }
  }

  await Conversation.updateOne(
    { _id: conversationId },
    { $addToSet: { pinnedMessages: messageId } },
  );

  return responseService.successResponseHandler(req, res, {
    status: "MESSAGE PIN SUCCESS",
    message: "Message pinned successfully!",
  });
});

export const unpinMessage = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { conversationId, messageId } = req.data.params;

  if (!isValidObjectId(messageId)) {
    throw AppError.unprocessable({
      message: "Message ID is invalid!",
      code: "MESSAGE PIN FAILED",
      details: { messageId },
    });
  }

  const message = await Message.findById(messageId);

  if (!message) {
    throw AppError.notFound({
      message: "Message does not exist!",
      code: "MESSAGE NOT FOUND",
      details: { message },
    });
  }

  await assertParticipant(conversationId, currentUserId);

  await Conversation.updateOne(
    { _id: conversationId },
    { $pull: { pinnedMessages: messageId } },
  );

  return responseService.successResponseHandler(req, res, {
    status: "MESSAGE UNPIN SUCCESS",
    message: "Message unpinned successfully!",
  });
});

export const searchMessages = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { conversationId } = req.data.params;
  const { q, limit = 20 } = req.data.query;

  await assertParticipant(conversationId, currentUserId);

  if (!q?.trim()) {
    throw AppError.badRequest({
      message: "Search query is required!",
      code: "MESSAGE SEARCH FAILED",
    });
  }

  const messages = await Message.find({
    conversation: conversationId,
    contentType: "text",
    $text: { $search: q.trim() },
  })
    .select({ score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .limit(Math.min(Number(limit), 50))
    .populate(MESSAGE_POPULATE);

  return responseService.successResponseHandler(req, res, {
    status: "MESSAGE SEARCH SUCCESS",
    message: "Messages searched successfully!",
    data: { messages },
  });
});
