import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "../lib/logger/logger.js";
import {
  BACKEND_PORT,
  BACKEND_URL,
  CLIENT_URL,
} from "../constants/env.constants.js";
import { httpStatusConfig } from "../config/common.config.js";
import connectDB from "../db/db.connect.js";
import authRouter from "../router/auth/auth.router.js";
import activityRouter from "../router/auth/activity.router.js";
import addressRouter from "../router/auth/address.router.js";
import oauthRouter from "../router/auth/oauth.router.js";
import profileRouter from "../router/auth/profile.router.js";
import sessionRouter from "../router/auth/session.router.js";
import socialRouter from "../router/auth/social.router.js";
import userRouter from "../router/auth/user.router.js";
import adminRouter from "../router/auth/admin.router.js";
import pushNotificationsRouter from "../router/pushNotifications/pushNotifications.router.js";
import Log from "../models/log/log.model.js";
import { initializeSocket } from "../socket/socket.js";
import { showBanner } from "../lib/banner/banner.js";
import { setDbAdapter } from "../lib/logger/logger.js";
import AppError from "../errors/app.error.js";
import { errorResponseHandler } from "../utils/response.utils.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [BACKEND_URL, CLIENT_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/oauth", oauthRouter);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/user", profileRouter);
app.use("/api/v1/user", socialRouter);
app.use("/api/v1/user", addressRouter);
app.use("/api/v1/user", sessionRouter);
app.use("/api/v1/user", activityRouter);

app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/push-notifications", pushNotificationsRouter);

app.use((req, res, next) => {
  next(
    new AppError({
      message: `No defined route found at path: ${req.originalUrl}`,
      code: "ROUTE NOT FOUND",
      statusCode: httpStatusConfig.methodNotAllowed.statusCode,
    }),
  );
});

app.use((err, req, res, next) => {
  errorResponseHandler(err, req, res, next);
});

const server = http.createServer(app);

initializeSocket(server);

app.listen(BACKEND_PORT, async () => {
  await connectDB();
  setDbAdapter(async (entry) => Log.create(entry));
  logger.info(`📢  Server is running at ${BACKEND_URL}`);
  await showBanner(BACKEND_PORT);
});
