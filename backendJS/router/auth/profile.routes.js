import express from "express";
import {
  getMyProfile,
  getUserProfile,
  updateProfile,
  updateUsername,
  updateGender,
} from "../../controllers/auth/profile.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { PERMISSIONS } from "../../constants/permission.constants.js";
import Profile from "../../models/auth/profile.model.js";

const profileRouter = express.Router();

profileRouter.get(
  "/profile",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  getMyProfile,
);
profileRouter.get(
  "/profile/:username",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.PROFILE_READ_ANY],
    ownership: {
      type: "resource",
      source: "params",
      fieldKey: "username",
      model: Profile,
      ownerIdField: "user",
    },
    enforceOwnership: true,
  }),
  getUserProfile,
);
profileRouter.patch(
  "/profile",
  requestMiddleware({ requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_UPDATE_OWN] }),
  updateProfile,
);
profileRouter.put(
  "/profile/username",
  requestMiddleware({ requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_UPDATE_OWN] }),
  updateUsername,
);
profileRouter.post(
  "/profile/gender",
  requestMiddleware({ requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_UPDATE_OWN] }),
  updateGender,
);

export default profileRouter;
