import express from "express";
import {
  deleteSocialLink,
  getSocialLinks,
  getSocialLinksByUser,
  updateSocialLinks,
} from "../../controllers/auth/social.controller.js";
import { validateRequest } from "../../validators/request.validator.js";

const socialRouter = express.Router();

socialRouter.get("/get-social-links", validateRequest, getSocialLinks);
socialRouter.get(
  "/get-social-links-by-user",
  validateRequest({ requireParams: true }),
  getSocialLinksByUser,
);
socialRouter.patch(
  "/update-social-links",
  validateRequest({ requireBody: true }),
  updateSocialLinks,
);
socialRouter.delete(
  "/revoke-session",
  validateRequest({ requireParams: true }),
  deleteSocialLink,
);

export default socialRouter;
