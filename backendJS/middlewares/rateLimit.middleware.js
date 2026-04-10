import rateLimit from "express-rate-limit";
import { AppError } from "../errors/app.error.js";

// ─── Response handler ─────────────────────────────────────────────────────────

const rateLimitHandler = (req, res, next, options) => {
  next(
    new AppError(
      options.message || "Too many requests. Please try again later!",
      429,
    ),
  );
};

// ─── Key generators ───────────────────────────────────────────────────────────

const ipKey = (req) => req.ip;
const userOrIpKey = (req) => req.data.userId || req.ip;

// ─── Presets ──────────────────────────────────────────────────────────────────

/**
 * Strict limiter for auth endpoints (login, register, forgot-password).
 * 10 requests per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: ipKey,
  handler: rateLimitHandler,
  message: "Too many authentication attempts. Please try again in 15 minutes!",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Login-specific limiter — tighter window.
 * 5 requests per 10 minutes per IP.
 */
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  keyGenerator: ipKey,
  handler: rateLimitHandler,
  message:
    "Too many login attempts. Please wait 10 minutes before trying again!",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts
});

/**
 * Password reset / email resend limiter.
 * 3 requests per 60 minutes per IP.
 */
export const sensitiveActionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: ipKey,
  handler: rateLimitHandler,
  message: "Too many requests for this action. Please try again in 1 hour!",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API limiter — applied globally.
 * 100 requests per 1 minute per user (or IP if unauthenticated).
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: userOrIpKey,
  handler: rateLimitHandler,
  message: "Too many requests. Please slow down!",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.data.user?.role?.name === "admin", // Admins bypass API limits
});

/**
 * Upload / mutation limiter.
 * 20 requests per 10 minutes per user or IP.
 */
export const mutationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  keyGenerator: userOrIpKey,
  handler: rateLimitHandler,
  message: "Too many write operations. Please wait a few minutes!",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Create a custom rate limiter with configurable options.
 */
export const createLimiter = ({
  windowMs,
  max,
  message,
  skipSuccessful = false,
}) =>
  rateLimit({
    windowMs,
    max,
    keyGenerator: userOrIpKey,
    handler: rateLimitHandler,
    message,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: skipSuccessful,
  });
