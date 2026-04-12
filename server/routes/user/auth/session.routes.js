import express from "express";
import {
  getActiveSessions,
  getSessionCount,
  revokeOtherSessions,
  revokeSession,
} from "../../../controllers/user/auth/session.controller.js";
import { requestMiddleware } from "../../../middlewares/request.middleware.js";
import { authenticate } from "../../../middlewares/authenticate.middleware.js";
import { authorize } from "../../../middlewares/authorize.middleware.js";
import { PERMISSIONS } from "../../../constants/permission.constants.js";
import Session from "../../../models/user/auth/session.model.js";

const sessionRouter = express.Router();

sessionRouter.get(
  "/session",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.SESSION_READ_OWN] }),
  getActiveSessions,
);
sessionRouter.get(
  "/session/count",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.SESSION_READ_OWN] }),
  getSessionCount,
);
sessionRouter.delete(
  "/session/revoke/other",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.SESSION_REVOKE_OWN] }),
  revokeOtherSessions,
);
sessionRouter.delete(
  "/session/revoke/:sessionId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.SESSION_REVOKE_OWN],
    ownership: {
      type: "resource",
      source: "params",
      idKey: "sessionId",
      model: Session,
      ownerIdField: "user",
    },
    enforceOwnership: true,
  }),
  revokeSession,
);

export default sessionRouter;
