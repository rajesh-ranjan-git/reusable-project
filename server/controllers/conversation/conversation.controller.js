import mongoose, { isValidObjectId } from "mongoose";
import User from "../../models/user/auth/user.model.js";
import Conversation from "../../models/conversation/conversation.model.js";
import Message from "../../models/conversation/message.model.js";
import { httpStatusConfig } from "../../config/http.config.js";
import { propertyConstraints } from "../../config/common.config.js";
import { asyncHandler } from "../../utils/common.utils.js";
import { normalizeConversation } from "../../utils/conversation.utils.js";
import { sanitizeMongoData } from "../../db/db.utils.js";
import { stringPropertiesValidator } from "../../validators/common.validator.js";
import { userNameValidator } from "../../validators/auth.validator.js";
import AppError from "../../services/error/error.service.js";
import { responseService } from "../../services/response/response.service.js";

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

  const normalizedConversation = normalizeConversation(
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
  const { groupName, participantIds = [], description } = req.data.body;

  if (!groupName?.trim()) {
    throw AppError.unprocessable({
      message: "Please provide the group name!",
      code: "GROUP CREATE FAILED",
      details: { groupName },
    });
  }

  const {
    isPropertyValid: isGroupNameValid,
    message: groupNameError,
    validatedProperty: validatedGroupName,
  } = stringPropertiesValidator(
    "groupName",
    groupName,
    propertyConstraints.minStringLength,
    propertyConstraints.maxStringLength,
  );

  if (!isGroupNameValid) {
    throw AppError.unprocessable({
      message: groupNameError,
      code: "GROUP CREATE FAILED",
      details: { groupName },
    });
  }

  const {
    isPropertyValid: isDescriptionValid,
    message: descriptionError,
    validatedProperty: validatedDescription,
  } = stringPropertiesValidator(
    "description",
    description,
    propertyConstraints.minStringLength,
    propertyConstraints.maxStringLength,
  );

  if (!isDescriptionValid) {
    throw AppError.unprocessable({
      message: descriptionError,
      code: "GROUP CREATE FAILED",
      details: { description },
    });
  }

  let uniqueIds = [...new Set(participantIds.map(String))];

  const invalidId = uniqueIds.find((id) => !isValidObjectId(id));

  if (invalidId) {
    throw AppError.unprocessable({
      message: "One of the participant's ID is invalid!",
      code: "GROUP CREATE FAILED",
      details: { invalidId, participants: uniqueIds },
    });
  }

  const users = await User.find({ _id: { $in: uniqueIds } })
    .select("status")
    .populate("account", "isLocked")
    .populate("profile", "id");

  const invalidUser = users.find(
    (user) =>
      user.status !== "active" ||
      !user.account ||
      user.account.isLocked ||
      !user.profile,
  );

  if (invalidUser || users.length !== uniqueIds.length) {
    throw AppError.unprocessable({
      message: "One of the participants does not exist!",
      code: "GROUP CREATE FAILED",
    });
  }

  const connections = await Connection.find({
    $or: [
      { sender: currentUserId, receiver: { $in: uniqueIds } },
      { sender: { $in: uniqueIds }, receiver: currentUserId },
    ],
    connectionStatus: "accepted",
  }).select("sender receiver");

  const connectedUserIds = connections.map((connection) =>
    connection.sender.toString() === currentUserId
      ? connection.receiver.toString()
      : connection.sender.toString(),
  );

  const connectedSet = new Set(connectedUserIds);

  if (connectedSet.has(targetUserId)) {
    throw AppError.forbidden({
      message: "You can only create groups with users you are connected with!",
      code: "GROUP CREATE FAILED",
      details: { participants: connectedUserIds },
    });
  }

  uniqueIds = [currentUserId, ...uniqueIds].map(
    (id) => new mongoose.Types.ObjectId(id),
  );

  if (uniqueIds.length < 2) {
    throw AppError.unprocessable({
      message: "A group must have at least 2 participants!",
      code: "GROUP CREATE FAILED",
      details: { participants: uniqueIds },
    });
  }

  const participants = uniqueIds.map((id) => ({
    user: id,
    role: id.toString() === currentUserId ? "owner" : "member",
  }));

  const conversation = await Conversation.create({
    type: "group",
    participants,
    groupSettings: {
      groupName: validatedGroupName,
      description: validatedDescription ?? "",
    },
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

  const normalizedConversation = normalizeConversation(
    sanitizeMongoData(conversation),
  );

  return responseService.successResponseHandler(req, res, {
    statusCode: httpStatusConfig.created.statusCode,
    status: "GROUP CREATE SUCCESS",
    message: "Conversation fetched successfully!",
    data: { conversation: normalizedConversation },
  });
});

export const updateGroupConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.data.params;
  const currentUserId = req.data.userId;
  const { groupName, description, sendPermission, editPermission } =
    req.data.body;

  if (!isValidObjectId(conversationId)) {
    throw AppError.unprocessable({
      message: "Group ID is invalid!",
      code: "GROUP UPDATE FAILED",
      details: { conversationId },
    });
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    type: "group",
    deletedAt: null,
  });

  if (!conversation) {
    throw AppError.notFound({
      message: "Group does not exist!",
      code: "GROUP NOT FOUND",
      details: { conversation },
    });
  }

  const {
    isPropertyValid: isGroupNameValid,
    message: groupNameError,
    validatedProperty: validatedGroupName,
  } = stringPropertiesValidator(
    "groupName",
    groupName,
    propertyConstraints.minStringLength,
    propertyConstraints.maxStringLength,
  );

  if (!isGroupNameValid) {
    throw AppError.unprocessable({
      message: groupNameError,
      code: "GROUP CREATE FAILED",
      details: { groupName },
    });
  }

  const {
    isPropertyValid: isDescriptionValid,
    message: descriptionError,
    validatedProperty: validatedDescription,
  } = stringPropertiesValidator(
    "description",
    description,
    propertyConstraints.minStringLength,
    propertyConstraints.maxStringLength,
  );

  if (!isDescriptionValid) {
    throw AppError.unprocessable({
      message: descriptionError,
      code: "GROUP CREATE FAILED",
      details: { description },
    });
  }

  const participant = conversation.participants.find(
    (p) => p.user.toString() === currentUserId && !p.leftAt,
  );

  if (!participant || !["admin", "owner"].includes(participant.role)) {
    throw AppError.forbidden({
      message: "Only admins can update group settings!",
      code: "GROUP UPDATE FAILED",
    });
  }

  const updates = {};
  if (validatedGroupName)
    updates["groupSettings.groupName"] = validatedGroupName;
  if (validatedDescription)
    updates["groupSettings.description"] = validatedDescription;
  if (sendPermission && ["all", "admins"].includes(sendPermission))
    updates["groupSettings.sendPermission"] = sendPermission;
  if (editPermission && ["all", "admins"].includes(editPermission))
    updates["groupSettings.editPermission"] = editPermission;

  const updated = await Conversation.findByIdAndUpdate(
    conversationId,
    { $set: updates },
    { returnDocument: "after", runValidators: true },
  ).populate({
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

  const normalizedConversation = normalizeConversation(
    sanitizeMongoData(updated),
  );

  return responseService.successResponseHandler(req, res, {
    status: "GROUP UPDATE SUCCESS",
    message: "Conversation fetched successfully!",
    data: { updated: normalizedConversation },
  });
});

export const addGroupMembers = asyncHandler(async (req, res) => {
  const { conversationId } = req.data.params;
  const currentUserId = req.data.userId;
  const { userIds = [] } = req.data.body;

  if (!isValidObjectId(conversationId)) {
    throw AppError.unprocessable({
      message: "Group ID is invalid!",
      code: "MEMBER ADD FAILED",
      details: { conversationId },
    });
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    type: "group",
    deletedAt: null,
  });

  if (!conversation) {
    throw AppError.notFound({
      message: "Group does not exist!",
      code: "GROUP NOT FOUND",
      details: { conversation },
    });
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
      message: "You do not have permission to add members!",
      code: "MEMBER ADD FAILED",
    });
  }

  let uniqueIds = [...new Set(userIds)];

  const invalidId = uniqueIds.find((id) => !isValidObjectId(id));

  if (invalidId) {
    throw AppError.unprocessable({
      message: "One of the participant's ID is invalid!",
      code: "MEMBER ADD FAILED",
      details: { invalidId, participants: uniqueIds },
    });
  }

  const users = await User.find({ _id: { $in: uniqueIds } })
    .select("status")
    .populate("account", "isLocked")
    .populate("profile", "id");

  const invalidUser = users.find(
    (user) =>
      user.status !== "active" ||
      !user.account ||
      user.account.isLocked ||
      !user.profile,
  );

  if (invalidUser || users.length !== uniqueIds.length) {
    throw AppError.unprocessable({
      message: "One of the participants does not exist!",
      code: "GROUP CREATE FAILED",
    });
  }

  const existingIds = new Set(
    conversation.participants.map((p) => p.user.toString()),
  );
  const newParticipants = uniqueIds
    .map(String)
    .filter((id) => !existingIds.has(id))
    .map((id) => ({ user: new mongoose.Types.ObjectId(id), role: "member" }));

  if (newParticipants.length === 0) {
    return responseService.successResponseHandler(req, res, {
      status: "MEMBER ADD SUCCESS",
      message: "All users are already members!",
      data: { participants: newParticipants },
    });
  }

  await Conversation.findByIdAndUpdate(
    conversationId,
    { $push: { participants: { $each: newParticipants } } },
    { returnDocument: "after", runValidators: true },
  ).populate({
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

  const normalizedConversation = normalizeConversation(
    sanitizeMongoData(updated),
  );

  return responseService.successResponseHandler(req, res, {
    status: "MEMBER ADD SUCCESS",
    message: "New members added successfully!",
    data: { updated: normalizedConversation },
  });
});

export const removeGroupMember = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { conversationId, memberId } = req.data.params;

  if (!isValidObjectId(conversationId)) {
    throw AppError.unprocessable({
      message: "Group ID is invalid!",
      code: "MEMBER REMOVE FAILED",
      details: { conversationId },
    });
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    type: "group",
    deletedAt: null,
  });

  if (!conversation) {
    throw AppError.notFound({
      message: "Group does not exist!",
      code: "GROUP NOT FOUND",
      details: { conversation },
    });
  }

  const actor = conversation.participants.find(
    (p) => p.user.toString() === currentUserId && !p.leftAt,
  );

  const isSelf = currentUserId === memberId;
  const canRemoveOther = actor && ["admin", "owner"].includes(actor.role);

  if (!isSelf && !canRemoveOther) {
    throw AppError.forbidden({
      message: "You do not have permission to remove this member!",
      code: "MEMBER REMOVE FAILED",
    });
  }

  await Conversation.updateOne(
    { _id: conversationId, "participants.user": memberId },
    { $set: { "participants.$.leftAt": new Date() } },
  );

  return responseService.successResponseHandler(req, res, {
    status: "MEMBER REMOVE SUCCESS",
    message: isSelf
      ? "You have left the group successfully!"
      : "Member removed successfully!",
  });
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { conversationId, memberId } = req.data.params;
  const { role } = req.data.body;

  if (!isValidObjectId(conversationId)) {
    throw AppError.unprocessable({
      message: "Group ID is invalid!",
      code: "ROLE UPDATE FAILED",
      details: { conversationId },
    });
  }

  if (!["member", "admin"].includes(role)) {
    throw AppError.unprocessable({
      message: "Role must be 'member' or 'admin'!",
      code: "ROLE UPDATE FAILED",
      details: { conversationId },
    });
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    type: "group",
    deletedAt: null,
  });

  if (!conversation) {
    throw AppError.notFound({
      message: "Group does not exist!",
      code: "GROUP NOT FOUND",
      details: { conversation },
    });
  }

  const actor = conversation.participants.find(
    (p) => p.user.toString() === currentUserId && !p.leftAt,
  );

  if (!actor || actor.role !== "owner") {
    throw AppError.forbidden({
      message: "Only the group owner can change member roles!",
      code: "ROLE UPDATE FAILED",
    });
  }

  await Conversation.updateOne(
    { _id: conversationId, "participants.user": memberId },
    { $set: { "participants.$.role": role } },
  );

  return responseService.successResponseHandler(req, res, {
    status: "ROLE UPDATE SUCCESS",
    message: `Member role updated to '${role}'!"`,
  });
});

export const listConversations = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;

  const conversations = await Conversation.find({
    "participants.user": currentUserId,
    "participants.leftAt": null,
    deletedAt: null,
  })
    .sort({ updatedAt: -1 })
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
      select: "content contentType createdAt sender",
    });

  const normalizedConversations = sanitizeMongoData(conversations).map(
    (conversation) => normalizeConversation(conversation),
  );

  return responseService.successResponseHandler(req, res, {
    status: "CONVERSATIONS FETCH SUCCESS",
    message: "Conversations fetched successfully!",
    data: { conversation: normalizedConversations },
  });
});

export const getConversation = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { conversationId } = req.data.params;

  if (!isValidObjectId(conversationId)) {
    throw AppError.unprocessable({
      message: "Group ID is invalid!",
      code: "ROLE UPDATE FAILED",
      details: { conversationId },
    });
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    "participants.user": currentUserId,
    deletedAt: null,
  })
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
      select: "content contentType createdAt sender",
    })
    .populate({
      path: "pinnedMessages",
    });

  if (!conversation) {
    throw AppError.notFound({
      message: "Conversation does not exist!",
      code: "CONVERSATION NOT FOUND",
      details: { conversation },
    });
  }

  const normalizedConversation = normalizeConversation(
    sanitizeMongoData(updated),
  );

  return responseService.successResponseHandler(req, res, {
    status: "CONVERSATION FETCH SUCCESS",
    message: "Conversation fetched successfully!",
    data: { updated: normalizedConversation },
  });
});

export const deleteConversation = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { conversationId } = req.data.params;

  if (!isValidObjectId(conversationId)) {
    throw AppError.unprocessable({
      message: "Group ID is invalid!",
      code: "ROLE UPDATE FAILED",
      details: { conversationId },
    });
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    type: "direct",
    "participants.user": currentUserId,
    deletedAt: null,
  });

  if (!conversation) {
    throw AppError.notFound({
      message: "Conversation does not exist!",
      code: "CONVERSATION NOT FOUND",
      details: { conversation },
    });
  }

  await conversation.updateOne({ deletedAt: new Date() });

  return responseService.successResponseHandler(req, res, {
    status: "CONVERSATION DELETE SUCCESS",
    message: "Conversation deleted successfully!",
  });
});

export const markConversationAsRead = asyncHandler(async (req, res) => {
  const currentUserId = req.data.userId;
  const { conversationId } = req.data.params;

  if (!isValidObjectId(conversationId)) {
    throw AppError.unprocessable({
      message: "Group ID is invalid!",
      code: "ROLE UPDATE FAILED",
      details: { conversationId },
    });
  }

  await Conversation.updateOne(
    { _id: conversationId, "participants.user": currentUserId },
    { $set: { "participants.$.unreadCount": 0 } },
  );

  return responseService.successResponseHandler(req, res, {
    status: "CONVERSATION MARK READ SUCCESS",
    message: "Conversation marked as read successfully!",
  });
});
