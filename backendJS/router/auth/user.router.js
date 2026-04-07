import express from "express";
import {
  getAccountInfo,
  updateEmail,
  deleteAccount,
  getDashboardSummary,
} from "../../controllers/auth/user.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/account", requestMiddleware({}), authenticate, getAccountInfo);
userRouter.get(
  "/dashboard/summary",
  requestMiddleware({}),
  authenticate,
  getDashboardSummary,
);
userRouter.put(
  "/email",
  requestMiddleware({ requireBody: true }),
  authenticate,
  updateEmail,
);
userRouter.delete(
  "/account",
  requestMiddleware({}),
  authenticate,
  deleteAccount,
);

export default userRouter;
