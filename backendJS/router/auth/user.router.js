import express from "express";
import {
  getAccountInfo,
  updateEmail,
  deleteAccount,
  getDashboardSummary,
} from "../../controllers/auth/user.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";

const userRouter = express.Router();

userRouter.get("/get-social-links", requestMiddleware({}), getAccountInfo);
userRouter.get(
  "/get-dashboard-summary",
  requestMiddleware({}),
  getDashboardSummary,
);
userRouter.put(
  "/update-email",
  requestMiddleware({ requireBody: true }),
  updateEmail,
);
userRouter.delete("/delete-account", requestMiddleware({}), deleteAccount);

export default userRouter;
