import User from "../models/user.model.js";
import { tokenService } from "../services/token.service.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── Require Authentication ───────────────────────────────────────────────────
// Attaches req.user and req.userId. Throws 401 if missing or invalid token.

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = tokenService.extractBearerToken(req.headers.authorization);

  if (!token) {
    throw new AppError("Authentication required. Please provide a valid token.", 401);
  }

  const payload = tokenService.verifyAccessToken(token);

  const user = await User.findById(payload.userId).populate("role").lean();

  if (!user) {
    throw new AppError("User not found.", 401);
  }

  if (user.status === "deleted") {
    throw new AppError("This account has been deleted.", 401);
  }

  if (user.status === "suspended") {
    throw new AppError("Your account has been suspended. Please contact support.", 403);
  }

  req.userId = user._id.toString();
  req.user = user;

  next();
});

// ─── Optional Authentication ──────────────────────────────────────────────────
// Attaches req.user if token is present and valid, otherwise continues silently.

export const optionalAuthenticate = asyncHandler(async (req, res, next) => {
  const token = tokenService.extractBearerToken(req.headers.authorization);

  if (!token) return next();

  try {
    const payload = tokenService.verifyAccessToken(token);
    const user = await User.findById(payload.userId).populate("role").lean();
    if (user && user.status === "active") {
      req.userId = user._id.toString();
      req.user = user;
    }
  } catch {
    // Silently ignore invalid tokens for optional routes
  }

  next();
});

// ─── Require Verified Email ───────────────────────────────────────────────────

export const requireVerifiedEmail = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new AppError("Authentication required.", 401);
  }

  if (!req.user.emailVerified) {
    throw new AppError(
      "Email verification required. Please verify your email address to proceed.",
      403,
    );
  }

  next();
});
