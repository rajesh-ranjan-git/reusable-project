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
import { validateRequest } from "../../validators/request.validator.js";

const authRouter = express.Router();

authRouter.get("/get-me", validateRequest, getMe);
authRouter.post("/register", validateRequest({ requireBody: true }), register);
authRouter.post("/login", validateRequest({ requireBody: true }), login);
authRouter.post("/logout", validateRequest({ requireBody: true }), logout);
authRouter.post("/refresh-tokens", validateRequest, refreshTokens);
authRouter.post(
  "/verify-email",
  validateRequest({ requireQuery: true }),
  verifyEmail,
);
authRouter.post(
  "/resend-verification",
  validateRequest({ requireBody: true }),
  resendVerification,
);
authRouter.post(
  "/forgot-password",
  validateRequest({ requireBody: true }),
  forgotPassword,
);
authRouter.post(
  "/reset-password",
  validateRequest({ requireBody: true }),
  resetPassword,
);
authRouter.put(
  "/update-password",
  validateRequest({ requireBody: true }),
  updatePassword,
);

export default authRouter;
