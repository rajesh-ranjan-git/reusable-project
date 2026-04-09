import express from "express";
import {
  clearMyActivity,
  getActivityTypes,
  getMyActivity,
} from "../../controllers/auth/activity.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";

const activityRouter = express.Router();

activityRouter.get(
  "/activity",
  requestMiddleware({}),
  authenticate,
  getMyActivity,
);
activityRouter.get(
  "/activity/types",
  requestMiddleware({}),
  authenticate,
  getActivityTypes,
);
activityRouter.delete(
  "/activity/clear",
  requestMiddleware({}),
  authenticate,
  clearMyActivity,
);

export default activityRouter;
