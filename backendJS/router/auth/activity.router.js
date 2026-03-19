import express from "express";
import {
  clearMyActivity,
  getActivityTypes,
  getMyActivity,
} from "../../controllers/auth/activity.controller.js";
import { validateRequest } from "../../validators/request.validator.js";

const activityRouter = express.Router();

activityRouter.get(
  "/get-my-activity",
  validateRequest({ requireQuery: true }),
  getMyActivity,
);
activityRouter.get("/get-activity-types", validateRequest, getActivityTypes);
activityRouter.delete("/clear-my-activity", validateRequest, clearMyActivity);

export default activityRouter;
