import Conversation from "../../models/conversation/conversation.model.js";
import Message from "../../models/conversation/message.model.js";
import { asyncHandler } from "../../utils/common.utils.js";
import AppError from "../../services/error/error.service.js";

const MESSAGE_POPULATE = [
  { path: "sender", select: "name username avatarUrl" },
  { path: "replyTo", select: "content contentType sender createdAt" },
];

const PAGE_SIZE = 30;

const assertParticipant = async (conversationId, userId) => {
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

  return conversation;
};

const updateConversationAfterSend = async (
  conversationId,
  message,
  senderId,
) => {
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
          sentBy: senderId,
          sentAt: message.createdAt,
        },
      },

      $inc: { "participants.$[other].unreadCount": 1 },
    },
    {
      arrayFilters: [{ "other.user": { $ne: senderId } }],
    },
  );
};

export const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.data.userId;
  const {
    conversationId,
    contentType = "text",
    content = "",
    attachments = [],
    location,
    replyTo,
    forwardedFrom,
  } = req.body;

  const conversation = await assertParticipant(conversationId, senderId);

  if (
    conversation.type === "group" &&
    conversation.groupSettings?.sendPermission === "admins"
  ) {
    const participant = conversation.participants.find(
      (p) => p.user.toString() === senderId.toString() && !p.leftAt,
    );
    if (!["admin", "owner"].includes(participant?.role)) {
      throw AppError.forbidden({
        message: "Only admins can send messages in this group.",
      });
    }
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    contentType,
    content: contentType === "text" ? content.trim() : "",
    attachments: contentType !== "text" ? attachments : [],
    location: contentType === "location" ? location : null,
    replyTo: replyTo ?? null,
    forwardedFrom: forwardedFrom ?? null,
    receipts: conversation.participants
      .filter((p) => !p.leftAt && p.user.toString() !== senderId.toString())
      .map((p) => ({ user: p.user })),
  });

  await message.populate(MESSAGE_POPULATE);
  await updateConversationAfterSend(conversationId, message, senderId);

  res.status(201).json({ success: true, data: message });
});

export const getMessages = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { conversationId } = req.data.params;
  const { cursor, limit = PAGE_SIZE } = req.data.query;

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

  res.status(200).json({
    success: true,
    data: messages.reverse(),
    nextCursor,
  });
});

export const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.data.params;
  const currentUserId = req.data.userId.toString();
  const { content } = req.body;

  if (!content?.trim()) {
    throw AppError.badRequest({ message: "Edited content cannot be empty." });
  }

  const message = await Message.findById(messageId);

  if (!message) throw AppError.notFound({ message: "Message not found." });
  if (message.sender.toString() !== currentUserId) {
    throw AppError.forbidden({
      message: "You can only edit your own messages.",
    });
  }
  if (message.contentType !== "text") {
    throw AppError.badRequest({ message: "Only text messages can be edited." });
  }
  if (message.contentType === "deleted") {
    throw AppError.badRequest({ message: "Cannot edit a deleted message." });
  }

  message.editHistory.push({ content: message.content, editedAt: new Date() });
  message.content = content.trim();

  await message.save();
  await message.populate(MESSAGE_POPULATE);

  res.status(200).json({ success: true, data: message });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.data.params;
  const currentUserId = req.data.userId.toString();

  const message = await Message.findById(messageId);

  if (!message) throw AppError.notFound({ message: "Message not found." });

  const isSender = message.sender.toString() === currentUserId;

  if (!isSender) {
    throw AppError.forbidden({
      message: "You can only delete your own messages.",
    });
  }

  message.content = "";
  message.attachments = [];
  message.location = null;
  message.contentType = "deleted";
  message.deletedAt = new Date();

  await message.save();

  res.status(200).json({ success: true, message: "Message deleted." });
});

export const markDelivered = asyncHandler(async (req, res) => {
  const { messageId } = req.data.params;
  const currentUserId = req.data.userId;

  await Message.updateOne(
    {
      _id: messageId,
      "receipts.user": currentUserId,
      "receipts.deliveredAt": null,
    },
    { $set: { "receipts.$.deliveredAt": new Date() } },
  );

  res.status(200).json({ success: true });
});

export const markSeen = asyncHandler(async (req, res) => {
  const { messageId } = req.data.params;
  const currentUserId = req.data.userId;

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

  res.status(200).json({ success: true });
});

export const toggleReaction = asyncHandler(async (req, res) => {
  const { messageId } = req.data.params;
  const currentUserId = req.data.userId;
  const { emoji } = req.body;

  if (!emoji?.trim()) {
    throw AppError.badRequest({ message: "Emoji is required." });
  }

  const message = await Message.findById(messageId);
  if (!message) throw AppError.notFound({ message: "Message not found." });

  const existingIndex = message.reactions.findIndex(
    (r) => r.user.toString() === currentUserId.toString() && r.emoji === emoji,
  );

  if (existingIndex !== -1) {
    message.reactions.splice(existingIndex, 1);
  } else {
    message.reactions.push({
      user: currentUserId,
      emoji,
      reactedAt: new Date(),
    });
  }

  await message.save();

  res.status(200).json({ success: true, data: message.reactions });
});

export const pinMessage = asyncHandler(async (req, res) => {
  const { conversationId, messageId } = req.data.params;
  const currentUserId = req.data.userId.toString();

  const conversation = await assertParticipant(conversationId, currentUserId);

  if (conversation.type === "group") {
    const participant = conversation.participants.find(
      (p) => p.user.toString() === currentUserId && !p.leftAt,
    );
    if (!["admin", "owner"].includes(participant?.role)) {
      throw AppError.forbidden({ message: "Only admins can pin messages." });
    }
  }

  await Conversation.updateOne(
    { _id: conversationId },
    { $addToSet: { pinnedMessages: messageId } },
  );

  res.status(200).json({ success: true });
});

export const unpinMessage = asyncHandler(async (req, res) => {
  const { conversationId, messageId } = req.data.params;

  await assertParticipant(conversationId, req.data.userId);

  await Conversation.updateOne(
    { _id: conversationId },
    { $pull: { pinnedMessages: messageId } },
  );

  res.status(200).json({ success: true });
});

export const searchMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.data.params;
  const { q, limit = 20 } = req.data.query;

  await assertParticipant(conversationId, req.data.userId);

  if (!q?.trim()) {
    throw AppError.badRequest({ message: "Search query is required." });
  }

  const messages = await Message.find({
    conversation: conversationId,
    contentType: "text",
    $text: { $search: q.trim() },
  })
    .select({ score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .limit(Math.min(Number(limit), 50))
    .populate(MESSAGE_POPULATE)
    .lean();

  res.status(200).json({ success: true, data: messages });
});
