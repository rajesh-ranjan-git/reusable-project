import express from "express";
import { PERMISSIONS } from "../../constants/permission.constants.js";
import User from "../../models/user/auth/user.model.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { discoverProfiles } from "../../controllers/discover/discover.controller.js";

const discoverRouter = express.Router();

discoverRouter.get(
  "/profiles",
  requestMiddleware({ requireQuery: true }),
  authenticate,
  authorize({
    permissions: [PERMISSIONS.PROFILE_READ_ANY],
  }),
  discoverProfiles,
);

export default discoverRouter;
