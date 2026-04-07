import express from "express";
import {
  getMyProfile,
  getUserProfile,
  updateProfile,
  updateUsername,
} from "../../controllers/auth/profile.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";

const profileRouter = express.Router();

profileRouter.get("/get-my-profile", requestMiddleware({}), getMyProfile);
profileRouter.get(
  "/get-user-profile",
  requestMiddleware({ requireParams: true }),
  getUserProfile,
);
profileRouter.patch(
  "/update-profile",
  requestMiddleware({ requireBody: true }),
  updateProfile,
);
profileRouter.put(
  "/update-username",
  requestMiddleware({ requireBody: true }),
  updateUsername,
);

export default profileRouter;
