import express from "express";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { subscribe } from "../../controllers/pushNotifications/pushNotifications.controller.js";

const pushNotificationsRouter = express.Router();

pushNotificationsRouter.post(
  "/subscribe",
  requestMiddleware({ requireBody: true }),
  subscribe,
);

export default pushNotificationsRouter;
