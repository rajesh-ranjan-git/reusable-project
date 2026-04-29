import express from "express";
import { PERMISSIONS } from "../../constants/permission.constants.js";
import Profile from "../../models/user/profile/profile.model.js";
import User from "../../models/user/auth/user.model.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
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

const messageRouter = express.Router();

messageRouter.post(
  "/message/:conversationId/messages",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  sendMessage,
);

messageRouter.get(
  "/message/:conversationId/messages",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  getMessages,
);

messageRouter.get(
  "/message/:conversationId/messages/search",
  requestMiddleware({ requireParams: true, requireQuery: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  searchMessages,
);

messageRouter.patch(
  "/message/:conversationId/messages/:messageId",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  editMessage,
);

messageRouter.delete(
  "/message/:conversationId/messages/:messageId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  deleteMessage,
);

messageRouter.patch(
  "/message/:conversationId/messages/:messageId/delivered",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  markDelivered,
);

messageRouter.patch(
  "/message/:conversationId/messages/:messageId/seen",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  markSeen,
);

messageRouter.post(
  "/message/:conversationId/messages/:messageId/reactions",
  requestMiddleware({ requireParams: true, requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  toggleReaction,
);

messageRouter.post(
  "/message/:conversationId/pinned/:messageId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  pinMessage,
);

messageRouter.delete(
  "/message/:conversationId/pinned/:messageId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  unpinMessage,
);

export default messageRouter;
