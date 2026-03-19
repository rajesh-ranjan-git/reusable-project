import http from "http";
import express from "express";
import * as dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import "../lib/logger/logger.js";
import {
  BACKEND_PORT,
  BACKEND_URL,
  CLIENT_URL,
  MODE,
} from "../constants/common.constants.js";
import connectDB from "../db/db.connect.js";
import authRouter from "../router/auth/auth.router.js";
import activityRouter from "../router/auth/activity.router.js";
import addressRouter from "../router/auth/address.router.js";
import oauthRouter from "../router/auth/oauth.router.js";
import profileRouter from "../router/auth/profile.router.js";
import sessionRouter from "../router/auth/session.router.js";
import socialRouter from "../router/auth/social.router.js";
import userRouter from "../router/auth/user.router.js";
import Log from "../models/log/log.model.js";
import { initializeSocket } from "../socket/socket.js";
import { showBanner } from "../lib/banner/banner.js";
import { setDbAdapter } from "../lib/logger/logger.js";
import AppError from "../errors/app.error.js";
import { errorResponseHandler } from "../utils/response.utils.js";

const envFile =
  MODE === "production" ? "env/env-production" : "env/env-development";

dotenv.config({ path: path.resolve(process.cwd(), "env", envFile) });

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

app.use("/api/auth", authRouter);
app.use("/api/auth/activity", activityRouter);
app.use("/api/auth/address", addressRouter);
app.use("/api/auth/oauth", oauthRouter);
app.use("/api/auth/profile", profileRouter);
app.use("/api/auth/session", sessionRouter);
app.use("/api/auth/social", socialRouter);
app.use("/api/auth/user", userRouter);

app.use((req, res, next) => {
  next(
    AppError.internal({
      message: `No defined route found at path: ${req.originalUrl}`,
      code: "ROUTE NOT FOUND",
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
