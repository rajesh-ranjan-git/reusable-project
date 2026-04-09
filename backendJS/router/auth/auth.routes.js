import express from "express";
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
} from "../../controllers/auth/auth.controller.js";
import { requestMiddleware } from "../../middlewares/request.middleware.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";

const authRouter = express.Router();

authRouter.get("/me", requestMiddleware({}), authenticate, getMe);
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
  updatePassword,
);

export default authRouter;
