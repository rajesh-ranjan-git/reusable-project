import express from "express";
import {
  deleteSocialLink,
  getSocialLinks,
  getSocialLinksByUser,
  updateSocialLinks,
} from "../../controllers/auth/social.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";

const socialRouter = express.Router();

socialRouter.get("/get-social-links", requestMiddleware({}), getSocialLinks);
socialRouter.get(
  "/get-social-links-by-user",
  requestMiddleware({ requireParams: true }),
  getSocialLinksByUser,
);
socialRouter.patch(
  "/update-social-links",
  requestMiddleware({ requireBody: true }),
  updateSocialLinks,
);
socialRouter.delete(
  "/revoke-session",
  requestMiddleware({ requireParams: true }),
  deleteSocialLink,
);

export default socialRouter;
