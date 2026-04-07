import express from "express";
import {
  getActiveSessions,
  getSessionCount,
  revokeOtherSessions,
  revokeSession,
} from "../../controllers/auth/session.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";

const sessionRouter = express.Router();

sessionRouter.get(
  "/get-active-sessions",
  requestMiddleware({}),
  getActiveSessions,
);
sessionRouter.get(
  "/get-session-count",
  requestMiddleware({ requireBody: true }),
  getSessionCount,
);
sessionRouter.delete(
  "/revoke-session",
  requestMiddleware({ requireParams: true }),
  revokeSession,
);
sessionRouter.delete(
  "/revoke-other-sessions",
  requestMiddleware({}),
  revokeOtherSessions,
);

export default sessionRouter;
