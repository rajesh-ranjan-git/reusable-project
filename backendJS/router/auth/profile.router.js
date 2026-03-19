import express from "express";
import {
  getMyProfile,
  getUserProfile,
  updateProfile,
  updateUsername,
} from "../../controllers/auth/profile.controller.js";
import { validateRequest } from "../../validators/request.validator.js";

const profileRouter = express.Router();

profileRouter.get("/get-my-profile", validateRequest, getMyProfile);
profileRouter.get(
  "/get-user-profile",
  validateRequest({ requireParams: true }),
  getUserProfile,
);
profileRouter.patch(
  "/update-profile",
  validateRequest({ requireBody: true }),
  updateProfile,
);
profileRouter.put(
  "/update-username",
  validateRequest({ requireBody: true }),
  updateUsername,
);

export default profileRouter;
