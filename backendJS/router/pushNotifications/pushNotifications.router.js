import express from "express";
import { validateRequest } from "../../validators/request.validator.js";
import { subscribe } from "../../controllers/pushNotifications/pushNotifications.controller.js";

const pushNotificationsRouter = express.Router();

pushNotificationsRouter.post("/subscribe", validateRequest(), subscribe);

export default pushNotificationsRouter;
