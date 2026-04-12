import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "../env/.env-production")
    : path.join(__dirname, "../env/.env-development");

dotenv.config({ path: envFile });

export const BACKEND_PORT = process.env.BACKEND_PORT;
export const BACKEND_URL = process.env.BACKEND_URL;
export const CLIENT_PORT = process.env.CLIENT_PORT;
export const CLIENT_URL = process.env.CLIENT_URL;

export const MODE = process.env.NODE_ENV;

export const EMAIL_FROM_ADDRESS = process.env.SMTP_FROM;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_SECURE = process.env.SMTP_SECURE;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
export const JWT_ISSUER = process.env.JWT_ISSUER;
export const JWT_AUDIENCE = process.env.JWT_AUDIENCE;
export const JWT_TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY;

export const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
export const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
