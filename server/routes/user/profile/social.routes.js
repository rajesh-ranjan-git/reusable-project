import express from "express";
import {
  deleteSocialLink,
  getSocialLinks,
  getSocialLinksByUser,
  updateSocialLinks,
} from "../../../controllers/user/profile/social.controller.js";
import { requestMiddleware } from "../../../middlewares/request.middleware.js";
import { authenticate } from "../../../middlewares/authenticate.middleware.js";
import { authorize } from "../../../middlewares/authorize.middleware.js";
import { PERMISSIONS } from "../../../constants/permission.constants.js";

const socialRouter = express.Router();

socialRouter.get(
  "/social",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_OWN] }),
  getSocialLinks,
);
socialRouter.get(
  "/social/:userId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_READ_ANY] }),
  getSocialLinksByUser,
);
socialRouter.patch(
  "/social",
  requestMiddleware({ requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_UPDATE_OWN] }),
  updateSocialLinks,
);
socialRouter.delete(
  "/social/:platform",
  requestMiddleware({ requireParams: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.PROFILE_UPDATE_OWN] }),
  deleteSocialLink,
);

export default socialRouter;
