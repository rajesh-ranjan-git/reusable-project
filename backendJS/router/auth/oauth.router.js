import express from "express";
import {
  getLinkedProviders,
  unlinkProvider,
} from "../../controllers/auth/oauth.controller.js";
import { validateRequest } from "../../validators/request.validator.js";

const oauthRouter = express.Router();

oauthRouter.get("/get-linked-provider", validateRequest, getLinkedProviders);
oauthRouter.delete(
  "/unlink-provider",
  validateRequest({ requireParams: true }),
  unlinkProvider,
);

export default oauthRouter;
