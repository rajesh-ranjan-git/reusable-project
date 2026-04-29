import mongoose from "mongoose";
import Account from "../../models/user/auth/account.model.js";
import Profile from "../../models/user/profile/profile.model.js";
import Conversation from "../../models/conversation/conversation.model.js";
import Message from "../../models/conversation/message.model.js";
import { asyncHandler } from "../../utils/common.utils.js";
import { userNameValidator } from "../../validators/auth.validator.js";
import AppError from "../../services/error/error.service.js";
import { responseService } from "../../services/response/response.service.js";
import { normalizeConversationParticipants } from "../../utils/conversation.utils.js";
import { sanitizeMongoData } from "../../db/db.utils.js";

const PARTICIPANT_FIELDS =
  "username firstName lastName fullName avatarUrl lastSeen";

export const getOrCreateDirectConversation = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const targetUserId = req.data.targetUserId;

  let conversation = await Conversation.findDirectConversation(
    currentUserId,
    targetUserId,
  )
    .populate({
      path: "participants.user",
      select: "status lastSeen",
      populate: [
        {
          path: "account",
          select: "email",
        },
        {
          path: "profile",
          select: "username firstName lastName fullName avatar experiences",
        },
      ],
    })
    .populate({
      path: "lastMessage.messageId",
      select: "content contentType createdAt",
    });

  if (!conversation) {
    conversation = await Conversation.create({
      type: "direct",
      participants: [
        { user: currentUserId, role: "member" },
        { user: targetUserId, role: "member" },
      ],
    });

    await conversation.populate({
      path: "participants.user",
      select: "status lastSeen",
      populate: [
        {
          path: "account",
          select: "email",
        },
        {
          path: "profile",
          select: "username firstName lastName fullName avatar experiences",
        },
      ],
    });
  }

  const normalizedConversation = normalizeConversationParticipants(
    sanitizeMongoData(conversation),
  );

  return responseService.successResponseHandler(req, res, {
    status: "CONVERSATION FETCH SUCCESS",
    message: "Conversation fetched successfully!",
    data: { conversation: normalizedConversation },
  });
});

export const createGroupConversation = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { name, participantIds = [], description, avatarUrl } = req.data.body;

  if (!name?.trim()) {
    throw AppError.badRequest({ message: "Group name is required." });
  }

  const uniqueIds = [
    ...new Set([currentUserId.toString(), ...participantIds.map(String)]),
  ].map((id) => new mongoose.Types.ObjectId(id));

  if (uniqueIds.length < 2) {
    throw AppError.badRequest({
      message: "A group must have at least 2 participants.",
    });
  }

  const participants = uniqueIds.map((id) => ({
    user: id,
    role: id.toString() === currentUserId.toString() ? "owner" : "member",
  }));

  const conversation = await Conversation.create({
    type: "group",
    participants,
    groupSettings: {
      name: name.trim(),
      description: description?.trim() ?? "",
      avatarUrl: avatarUrl ?? null,
    },
  });

  await conversation.populate("participants.user", PARTICIPANT_FIELDS);

  res.status(201).json({ success: true, data: conversation });
});

export const updateGroupConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.data.params;
  const currentUserId = req.data.userId.toString();
  const { name, description, avatarUrl, sendPermission, editPermission } =
    req.data.body;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    type: "group",
    deletedAt: null,
  });

  if (!conversation) {
    throw AppError.notFound({ message: "Group conversation not found." });
  }

  const participant = conversation.participants.find(
    (p) => p.user.toString() === currentUserId && !p.leftAt,
  );

  if (!participant || !["admin", "owner"].includes(participant.role)) {
    throw AppError.forbidden({
      message: "Only admins can update group settings.",
    });
  }

  const updates = {};
  if (name !== undefined) updates["groupSettings.name"] = name.trim();
  if (description !== undefined)
    updates["groupSettings.description"] = description.trim();
  if (avatarUrl !== undefined) updates["groupSettings.avatarUrl"] = avatarUrl;
  if (sendPermission !== undefined)
    updates["groupSettings.sendPermission"] = sendPermission;
  if (editPermission !== undefined)
    updates["groupSettings.editPermission"] = editPermission;

  const updated = await Conversation.findByIdAndUpdate(
    conversationId,
    { $set: updates },
    { new: true, runValidators: true },
  ).populate("participants.user", PARTICIPANT_FIELDS);

  res.status(200).json({ success: true, data: updated });
});

export const addGroupMembers = asyncHandler(async (req, res) => {
  const { conversationId } = req.data.params;
  const currentUserId = req.data.userId.toString();
  const { userIds = [] } = req.data.body;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    type: "group",
    deletedAt: null,
  });

  if (!conversation) {
    throw AppError.notFound({ message: "Group conversation not found." });
  }

  const actor = conversation.participants.find(
    (p) => p.user.toString() === currentUserId && !p.leftAt,
  );

  const canEdit =
    conversation.groupSettings.editPermission === "all"
      ? !!actor
      : actor && ["admin", "owner"].includes(actor.role);

  if (!canEdit) {
    throw AppError.forbidden({
      message: "You do not have permission to add members.",
    });
  }

  const existingIds = new Set(
    conversation.participants.map((p) => p.user.toString()),
  );
  const newParticipants = userIds
    .map(String)
    .filter((id) => !existingIds.has(id))
    .map((id) => ({ user: new mongoose.Types.ObjectId(id), role: "member" }));

  if (newParticipants.length === 0) {
    return res
      .status(200)
      .json({ success: true, message: "All users are already members." });
  }

  await Conversation.findByIdAndUpdate(conversationId, {
    $push: { participants: { $each: newParticipants } },
  });

  const updated = await Conversation.findById(conversationId).populate(
    "participants.user",
    PARTICIPANT_FIELDS,
  );

  res.status(200).json({ success: true, data: updated });
});

export const removeGroupMember = asyncHandler(async (req, res) => {
  const { conversationId, memberId } = req.data.params;
  const currentUserId = req.data.userId.toString();

  const conversation = await Conversation.findOne({
    _id: conversationId,
    type: "group",
    deletedAt: null,
  });

  if (!conversation) {
    throw AppError.notFound({ message: "Group conversation not found." });
  }

  const actor = conversation.participants.find(
    (p) => p.user.toString() === currentUserId && !p.leftAt,
  );

  const isSelf = currentUserId === memberId.toString();
  const canRemoveOther = actor && ["admin", "owner"].includes(actor.role);

  if (!isSelf && !canRemoveOther) {
    throw AppError.forbidden({
      message: "You do not have permission to remove this member.",
    });
  }

  await Conversation.updateOne(
    { _id: conversationId, "participants.user": memberId },
    { $set: { "participants.$.leftAt": new Date() } },
  );

  res.status(200).json({
    success: true,
    message: isSelf ? "You have left the group." : "Member removed.",
  });
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  const { conversationId, memberId } = req.data.params;
  const currentUserId = req.data.userId.toString();
  const { role } = req.data.body;

  if (!["member", "admin"].includes(role)) {
    throw AppError.badRequest({ message: "Role must be 'member' or 'admin'." });
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    type: "group",
    deletedAt: null,
  });

  if (!conversation) throw AppError.notFound({ message: "Group not found." });

  const actor = conversation.participants.find(
    (p) => p.user.toString() === currentUserId && !p.leftAt,
  );

  if (!actor || actor.role !== "owner") {
    throw AppError.forbidden({
      message: "Only the group owner can change member roles.",
    });
  }

  await Conversation.updateOne(
    { _id: conversationId, "participants.user": memberId },
    { $set: { "participants.$.role": role } },
  );

  res
    .status(200)
    .json({ success: true, message: `Member role updated to '${role}'.` });
});

export const listConversations = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;

  const conversations = await Conversation.find({
    "participants.user": currentUserId,
    "participants.leftAt": null,
    deletedAt: null,
  })
    .sort({ updatedAt: -1 })
    .populate("participants.user", PARTICIPANT_FIELDS)
    .populate({
      path: "lastMessage.messageId",
      select: "content contentType createdAt sender",
    })
    .lean();

  res.status(200).json({ success: true, data: conversations });
});

export const getConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.data.params;
  const currentUserId = req.data.userId.toString();

  const conversation = await Conversation.findOne({
    _id: conversationId,
    "participants.user": currentUserId,
    deletedAt: null,
  })
    .populate("participants.user", PARTICIPANT_FIELDS)
    .populate({
      path: "lastMessage.messageId",
      select: "content contentType createdAt sender",
    })
    .populate("pinnedMessages");

  if (!conversation) {
    throw AppError.notFound({ message: "Conversation not found." });
  }

  res.status(200).json({ success: true, data: conversation });
});

export const deleteConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.data.params;
  const currentUserId = req.data.userId.toString();

  const conversation = await Conversation.findOne({
    _id: conversationId,
    type: "direct",
    "participants.user": currentUserId,
    deletedAt: null,
  });

  if (!conversation) {
    throw AppError.notFound({ message: "Conversation not found." });
  }

  await conversation.updateOne({ deletedAt: new Date() });

  res.status(200).json({ success: true, message: "Conversation deleted." });
});

export const markConversationAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.data.params;
  const currentUserId = req.data.userId.toString();

  await Conversation.updateOne(
    { _id: conversationId, "participants.user": currentUserId },
    { $set: { "participants.$.unreadCount": 0 } },
  );

  res.status(200).json({ success: true });
});
