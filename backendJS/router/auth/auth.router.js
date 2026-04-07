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

const authRouter = express.Router();

authRouter.get("/get-me", requestMiddleware({}), getMe);
authRouter.post(
  "/register",
  requestMiddleware({ requireBody: true }),
  register,
);
authRouter.post("/login", requestMiddleware({ requireBody: true }), login);
authRouter.post("/logout", requestMiddleware({}), logout);
authRouter.post("/refresh-tokens", requestMiddleware({}), refreshTokens);
authRouter.post(
  "/verify-email",
  requestMiddleware({ requireQuery: true }),
  verifyEmail,
);
authRouter.post(
  "/resend-verification",
  requestMiddleware({ requireBody: true }),
  resendVerification,
);
authRouter.post(
  "/forgot-password",
  requestMiddleware({ requireBody: true }),
  forgotPassword,
);
authRouter.post(
  "/reset-password",
  requestMiddleware({ requireBody: true }),
  resetPassword,
);
authRouter.put(
  "/update-password",
  requestMiddleware({ requireBody: true }),
  updatePassword,
);

export default authRouter;
