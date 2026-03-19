import express from "express";
import {
  getActiveSessions,
  getSessionCount,
  revokeOtherSessions,
  revokeSession,
} from "../../controllers/auth/session.controller.js";
import { validateRequest } from "../../validators/request.validator.js";

const sessionRouter = express.Router();

sessionRouter.get("/get-active-sessions", validateRequest, getActiveSessions);
sessionRouter.get(
  "/get-session-count",
  validateRequest({ requireBody: true }),
  getSessionCount,
);
sessionRouter.delete(
  "/revoke-session",
  validateRequest({ requireParams: true }),
  revokeSession,
);
sessionRouter.delete(
  "/revoke-other-sessions",
  validateRequest,
  revokeOtherSessions,
);

export default sessionRouter;
