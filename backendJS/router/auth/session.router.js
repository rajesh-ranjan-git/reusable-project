import express from "express";
import {
  getActiveSessions,
  getSessionCount,
  revokeOtherSessions,
  revokeSession,
} from "../../controllers/auth/session.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const sessionRouter = express.Router();

sessionRouter.get(
  "/session",
  requestMiddleware({}),
  authenticate,
  getActiveSessions,
);
sessionRouter.get(
  "/session/count",
  requestMiddleware({}),
  authenticate,
  getSessionCount,
);
sessionRouter.delete(
  "/session/revoke/other",
  requestMiddleware({}),
  authenticate,
  revokeOtherSessions,
);
sessionRouter.delete(
  "/session/revoke/:sessionId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  revokeSession,
);

export default sessionRouter;
