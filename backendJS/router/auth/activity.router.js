import express from "express";
import {
  clearMyActivity,
  getActivityTypes,
  getMyActivity,
} from "../../controllers/auth/activity.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";

const activityRouter = express.Router();

activityRouter.get(
  "/get-my-activity",
  requestMiddleware({ requireQuery: true }),
  getMyActivity,
);
activityRouter.get(
  "/get-activity-types",
  requestMiddleware({}),
  getActivityTypes,
);
activityRouter.delete(
  "/clear-my-activity",
  requestMiddleware({}),
  clearMyActivity,
);

export default activityRouter;
