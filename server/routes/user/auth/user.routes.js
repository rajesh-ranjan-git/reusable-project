import express from "express";
import {
  getAccountInfo,
  updateEmail,
  deleteAccount,
  getDashboardSummary,
} from "../../../controllers/user/auth/user.controller.js";
import { requestMiddleware } from "../../../middlewares/request.middleware.js";
import { authenticate } from "../../../middlewares/authenticate.middleware.js";
import { authorize } from "../../../middlewares/authorize.middleware.js";
import { PERMISSIONS } from "../../../constants/permission.constants.js";

const userRouter = express.Router();

userRouter.get(
  "/account",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.USER_READ_OWN] }),
  getAccountInfo,
);
userRouter.get(
  "/dashboard/summary",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.USER_READ_OWN] }),
  getDashboardSummary,
);
userRouter.put(
  "/email",
  requestMiddleware({ requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.USER_UPDATE_OWN] }),
  updateEmail,
);
userRouter.delete(
  "/account",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.USER_DELETE_OWN] }),
  deleteAccount,
);

export default userRouter;
