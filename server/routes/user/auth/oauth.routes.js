import express from "express";
import {
  getLinkedProviders,
  unlinkProvider,
} from "../../../controllers/user/auth/oauth.controller.js";
import { requestMiddleware } from "../../../middlewares/request.middleware.js";

const oauthRouter = express.Router();

oauthRouter.get("/provider", requestMiddleware({}), getLinkedProviders);
oauthRouter.delete(
  "/provider/unlink",
  requestMiddleware({ requireParams: true }),
  unlinkProvider,
);

export default oauthRouter;
