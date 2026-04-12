import express from "express";
import { PERMISSIONS } from "../../../constants/permission.constants.js";
import {
  register,
  login,
  logout,
  refreshTokens,
  verifyEmail,
  updatePassword,
  forgotPassword,
  getMe,
  resetPassword,
  resendVerification,
} from "../../../controllers/user/auth/auth.controller.js";
import { requestMiddleware } from "../../../middlewares/request.middleware.js";
import { authenticate } from "../../../middlewares/authenticate.middleware.js";
import { authorize } from "../../../middlewares/authorize.middleware.js";

const authRouter = express.Router();

authRouter.get(
  "/me",
  requestMiddleware({}),
  authenticate,
  authorize({ permissions: [PERMISSIONS.USER_READ_OWN] }),
  getMe,
);
authRouter.post(
  "/register",
  requestMiddleware({ requireBody: true }),
  register,
);
authRouter.post("/login", requestMiddleware({ requireBody: true }), login);
authRouter.post("/logout", requestMiddleware({}), logout);
authRouter.post("/refresh", requestMiddleware({}), refreshTokens);
authRouter.post(
  "/email/verify",
  requestMiddleware({ requireBody: true }),
  verifyEmail,
);
authRouter.post(
  "/email/verification/resend",
  requestMiddleware({ requireBody: true }),
  resendVerification,
);
authRouter.post(
  "/password/forgot",
  requestMiddleware({ requireBody: true }),
  forgotPassword,
);
authRouter.post(
  "/password/reset",
  requestMiddleware({ requireBody: true }),
  resetPassword,
);
authRouter.put(
  "/password",
  requestMiddleware({ requireBody: true }),
  authenticate,
  authorize({ permissions: [PERMISSIONS.USER_UPDATE_OWN] }),
  updatePassword,
);

export default authRouter;
