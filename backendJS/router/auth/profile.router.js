import express from "express";
import {
  getMyProfile,
  getUserProfile,
  updateProfile,
  updateUsername,
  updateGender,
} from "../../controllers/auth/profile.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const profileRouter = express.Router();

profileRouter.get(
  "/profile",
  requestMiddleware({}),
  authenticate,
  getMyProfile,
);
profileRouter.get(
  "/profile/:username",
  requestMiddleware({ requireParams: true }),
  authenticate,
  getUserProfile,
);
profileRouter.patch(
  "/profile",
  requestMiddleware({ requireBody: true }),
  authenticate,
  updateProfile,
);
profileRouter.put(
  "/profile/username",
  requestMiddleware({ requireBody: true }),
  authenticate,
  updateUsername,
);
profileRouter.post(
  "/profile/gender",
  requestMiddleware({ requireBody: true }),
  authenticate,
  updateGender,
);

export default profileRouter;
