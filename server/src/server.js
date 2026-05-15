import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "../services/logger/logger.service.js";
import { setDbAdapter } from "../services/logger/logger.service.js";
import {
  CLIENT_URL,
  HOST_PORT,
  HOST_URL,
  MODE,
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
import discoverRouter from "../routes/discover/discover.routes.js";
import connectionRouter from "../routes/connection/connection.routes.js";
import conversationRouter from "../routes/conversation/conversation.routes.js";
import messageRouter from "../routes/conversation/message.routes.js";
import pushNotificationRouter from "../routes/push/push.notification.routes.js";
import Log from "../models/log/log.model.js";
import { initializeSocket } from "../services/socket/socket.service.js";
import { bannerService } from "../services/banner/banner.service.js";
import AppError from "../services/error/error.service.js";
import { responseService } from "../services/response/response.service.js";
import { defaultResponse } from "../lib/templates/default.response.js";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [HOST_URL, CLIENT_URL]
  .flatMap((url) => (url ? url.split(",") : []))
  .map((url) => url.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options(/.*/, cors());

app.use(express.json());

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

app.use("/api/v1/discover", discoverRouter);

app.use("/api/v1/connection", connectionRouter);

app.use("/api/v1/conversation", conversationRouter);
app.use("/api/v1/conversation", messageRouter);

app.use("/api/v1/push-notifications", pushNotificationRouter);

app.get(
  ["/", "/api", "/api/v1", "/health", "/api/health", "/api/v1/health"],
  (req, res) => {
    res
      .status(httpStatusConfig.success.statusCode)
      .type("html")
      .send(
        defaultResponse({
          apiBaseUrl: `${HOST_URL}/api/v1`,
          clientUrl: CLIENT_URL,
          healthPath: `${HOST_URL}/health`,
          hostUrl: HOST_URL,
          mode: MODE,
          requestPath: req.originalUrl,
          socketPath: "/brainbox/socket.io",
        }),
      );
  },
);

app.get("/favicon.ico", (req, res) =>
  responseService.successResponseHandler(req, res, {
    statusCode: httpStatusConfig.noContent.statusCode,
  }),
);

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
  responseService.errorResponseHandler(err, req, res, next);
});

const server = http.createServer(app);

initializeSocket(server);

server.listen(HOST_PORT, async () => {
  setDbAdapter(async (entry) => await Log.create(entry));
  await connectDB();
  logger.info(`📢  Server is running at ${HOST_URL}`);
  await bannerService.showBanner(HOST_PORT);
});
