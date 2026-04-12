import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "../services/logger/logger.service.js";
import { setDbAdapter } from "../services/logger/logger.service.js";
import {
  BACKEND_PORT,
  BACKEND_URL,
  CLIENT_URL,
} from "../constants/env.constants.js";
import { httpStatusConfig } from "../config/http.config.js";
import connectDB from "../db/db.connect.js";
import authRouter from "../routes/user/auth/auth.routes.js";
import userRouter from "../routes/user/auth/user.routes.js";
import oauthRouter from "../routes/user/auth/oauth.routes.js";
import sessionRouter from "../routes/user/auth/session.routes.js";
import activityRouter from "../routes/user/auth/activity.routes.js";
import profileRouter from "../routes/user/profile/profile.routes.js";
import socialRouter from "../routes/user/profile/social.routes.js";
import addressRouter from "../routes/user/profile/address.routes.js";
import adminRouter from "../routes/admin/admin.routes.js";
import pushNotificationRouter from "../routes/push/push.notification.routes.js";
import Log from "../models/log/log.model.js";
import { initializeSocket } from "../services/socket/socket.service.js";
import { showBanner } from "../services/banner/banner.service.js";
import AppError from "../services/error/error.service.js";
import { errorResponseHandler } from "../services/response/response.service.js";

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
app.use("/api/v1/user", sessionRouter);
app.use("/api/v1/user", activityRouter);
app.use("/api/v1/user", profileRouter);
app.use("/api/v1/user", socialRouter);
app.use("/api/v1/user", addressRouter);

app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/push-notifications", pushNotificationRouter);

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
