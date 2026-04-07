import express from "express";
import {
  deleteSocialLink,
  getSocialLinks,
  getSocialLinksByUser,
  updateSocialLinks,
} from "../../controllers/auth/social.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const socialRouter = express.Router();

socialRouter.get(
  "/social",
  requestMiddleware({}),
  authenticate,
  getSocialLinks,
);
socialRouter.get(
  "/social/:userId",
  requestMiddleware({ requireParams: true }),
  authenticate,
  getSocialLinksByUser,
);
socialRouter.patch(
  "/social",
  requestMiddleware({ requireBody: true }),
  authenticate,
  updateSocialLinks,
);
socialRouter.delete(
  "/social/:platform",
  requestMiddleware({ requireParams: true }),
  authenticate,
  deleteSocialLink,
);

export default socialRouter;
