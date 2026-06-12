import express from "express";
import { PERMISSIONS } from "../../../constants/permission.constants.js";
import Profile from "../../../models/user/profile/profile.model.js";
import { requestMiddleware } from "../../../middlewares/request.middleware.js";
import { authenticate } from "../../../middlewares/authenticate.middleware.js";
import { authorize } from "../../../middlewares/authorize.middleware.js";
import { upload } from "../../../middlewares/upload.middleware.js";
import {
  getMyProfile,
  getUserProfile,
  updateProfile,
  updateUsername,
  updateGender,
  uploadProfileImage,
  updateSkills,
  updateExperience,
  updateDob,
  updatePhone,
} from "../../../controllers/user/profile/profile.controller.js";

const profileRouter = express.Router();

profileRouter.get(
  "/profile",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  getMyProfile,
);
profileRouter.get(
  "/profile/:userName",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.PROFILE_READ_ANY],
    ownership: {
      type: "resource",
      source: "params",
      fieldKey: "userName",
      model: Profile,
      ownerIdField: "user",
    },
    enforceHierarchy: true,
    allowSameLevel: true,
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
  "/profile/userName",
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
profileRouter.post(
  "/profile/phone",
  requestMiddleware({ requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_UPDATE_OWN] }),
  updatePhone,
);
profileRouter.post(
  "/profile/dob",
  requestMiddleware({ requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_UPDATE_OWN] }),
  updateDob,
);
profileRouter.post(
  "/profile/:provider/upload/:type",
  upload.single("image"),
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_UPDATE_OWN] }),
  uploadProfileImage,
);
profileRouter.post(
  "/profile/skills",
  requestMiddleware({ requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_UPDATE_OWN] }),
  updateSkills,
);
profileRouter.post(
  "/profile/experience",
  requestMiddleware({ requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_UPDATE_OWN] }),
  updateExperience,
);

export default profileRouter;
