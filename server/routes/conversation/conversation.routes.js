import express from "express";
import { PERMISSIONS } from "../../constants/permission.constants.js";
import Profile from "../../models/user/profile/profile.model.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import {
  getOrCreateDirectConversation,
  createGroupConversation,
  updateGroupConversation,
  addGroupMembers,
  removeGroupMember,
  updateMemberRole,
  listConversations,
  getConversation,
  deleteConversation,
  markConversationAsRead,
} from "../../controllers/conversation/conversation.controller.js";
import {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  markDelivered,
  markSeen,
  toggleReaction,
  pinMessage,
  unpinMessage,
  searchMessages,
} from "../../controllers/conversation/message.controller.js";

const conversationRouter = express.Router();

conversationRouter.post(
  "/direct/:userName",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.PROFILE_READ_ANY],
    ownership: {
      type: "resource",
      source: "params",
      fieldKey: "userName",
      model: Profile,
      ownerIdField: "user",
    },
    enforceHierarchy: true,
    allowSameLevel: true,
  }),
  getOrCreateDirectConversation,
);

conversationRouter.post(
  "/group",
  requestMiddleware({ requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  createGroupConversation,
);

conversationRouter.patch(
  "/group/:conversationId",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  updateGroupConversation,
);

conversationRouter.post(
  "/group/:conversationId/members",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  addGroupMembers,
);

conversationRouter.delete(
  "/group/:conversationId/members/:memberId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  removeGroupMember,
);

conversationRouter.patch(
  "/group/:conversationId/members/:memberId/role",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  updateMemberRole,
);

conversationRouter.get(
  "/",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  listConversations,
);

conversationRouter.get(
  "/:conversationId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  getConversation,
);

conversationRouter.delete(
  "/:conversationId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  deleteConversation,
);

conversationRouter.patch(
  "/:conversationId/read",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  markConversationAsRead,
);

conversationRouter.post(
  "/:conversationId/messages",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  sendMessage,
);

conversationRouter.get(
  "/:conversationId/messages",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  getMessages,
);

conversationRouter.get(
  "/:conversationId/messages/search",
  requestMiddleware({ requireParams: true, requireQuery: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  searchMessages,
);

conversationRouter.patch(
  "/:conversationId/messages/:messageId",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  editMessage,
);

conversationRouter.delete(
  "/:conversationId/messages/:messageId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  deleteMessage,
);

conversationRouter.patch(
  "/:conversationId/messages/:messageId/delivered",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  markDelivered,
);

conversationRouter.patch(
  "/:conversationId/messages/:messageId/seen",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  markSeen,
);

conversationRouter.post(
  "/:conversationId/messages/:messageId/reactions",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  toggleReaction,
);

conversationRouter.post(
  "/:conversationId/pinned/:messageId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  pinMessage,
);

conversationRouter.delete(
  "/:conversationId/pinned/:messageId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  unpinMessage,
);

export default conversationRouter;
