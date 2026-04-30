import express from "express";
import { PERMISSIONS } from "../../constants/permission.constants.js";
import Profile from "../../models/user/profile/profile.model.js";
import User from "../../models/user/auth/user.model.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { isConnected } from "../../middlewares/conversation.middleware.js";
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
  isConnected,
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
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_ANY] }),
  addGroupMembers,
);

conversationRouter.delete(
  "/group/:conversationId/members/:memberId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.PROFILE_READ_ANY],
    ownership: {
      type: "resource",
      source: "params",
      idKey: "memberId",
      model: User,
      ownerIdField: "_id",
    },
    enforceHierarchy: true,
    allowSameLevel: true,
  }),
  removeGroupMember,
);

conversationRouter.patch(
  "/group/:conversationId/members/:memberId/role",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.PROFILE_READ_ANY],
    ownership: {
      type: "resource",
      source: "params",
      idKey: "memberId",
      model: User,
      ownerIdField: "_id",
    },
    enforceHierarchy: true,
    allowSameLevel: true,
  }),
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

export default conversationRouter;
