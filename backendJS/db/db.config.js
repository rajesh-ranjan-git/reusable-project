import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import AppError from "../errors/app.error.js";
import { MODE } from "../constants/common.constants.js";
import { httpStatusConfig } from "../config/common.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile =
  MODE === "production"
    ? path.join(__dirname, "../env/.env-production")
    : path.join(__dirname, "../env/.env-development");

dotenv.config({ path: envFile });

const DB_LOCAL_URI = process.env.DB_LOCAL_URI;
const DB_LOCAL_NAME = process.env.DB_LOCAL_NAME;
const DB_BASE_URI = process.env.DB_BASE_URI;
const DB_CLUSTER = process.env.DB_CLUSTER;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

let DB_URI = "";

try {
  if (!DB_BASE_URI || !DB_CLUSTER || !DB_NAME || !DB_USER || !DB_PASSWORD) {
    throw new AppError({
      message:
        "Database connection failed due to missing database configurations!",
      code: "DATABASE CONFIGURATION ERROR",
      statusCode: httpStatusConfig.serviceUnavailable.statusCode,
      details: {
        DB_BASE_URI,
        DB_CLUSTER,
        DB_NAME,
        DB_USER,
        DB_PASSWORD,
      },
    });
  }

  DB_URI = `${DB_BASE_URI}://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}`;
} catch (error) {
  DB_URI =
    DB_LOCAL_URI && DB_LOCAL_NAME
      ? `${DB_LOCAL_URI}/${DB_LOCAL_NAME}`
      : "mongodb://localhost:27017/database-local";
}

export const DB_URL = DB_URI;
