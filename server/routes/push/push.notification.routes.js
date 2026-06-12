import express from "express";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { subscribe } from "../../controllers/push/push.notification.controller.js";

const pushNotificationRouter = express.Router();

pushNotificationRouter.post(
  "/subscribe",
  requestMiddleware({ requireBody: true }),
  subscribe,
);

export default pushNotificationRouter;
