import express from "express";
import {
  getAccountInfo,
  updateEmail,
  deleteAccount,
  getDashboardSummary,
} from "../../controllers/auth/user.controller.js";
import { validateRequest } from "../../validators/request.validator.js";

const userRouter = express.Router();

userRouter.get("/get-social-links", validateRequest, getAccountInfo);
userRouter.get("/get-dashboard-summary", validateRequest, getDashboardSummary);
userRouter.put(
  "/update-email",
  validateRequest({ requireBody: true }),
  updateEmail,
);
userRouter.delete("/delete-account", validateRequest, deleteAccount);

export default userRouter;
