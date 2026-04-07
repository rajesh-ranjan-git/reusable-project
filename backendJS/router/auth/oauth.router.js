import express from "express";
import {
  getLinkedProviders,
  unlinkProvider,
} from "../../controllers/auth/oauth.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";

const oauthRouter = express.Router();

oauthRouter.get(
  "/get-linked-provider",
  requestMiddleware({}),
  getLinkedProviders,
);
oauthRouter.delete(
  "/unlink-provider",
  requestMiddleware({ requireParams: true }),
  unlinkProvider,
);

export default oauthRouter;
