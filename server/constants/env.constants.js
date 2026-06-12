import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "../env/.env.production")
    : path.join(__dirname, "../env/.env.development");

dotenv.config({ path: envFile });

export const MODE = process.env.NODE_ENV;

export const PROJECT_NAME = process.env.PROJECT_NAME;

export const HOST_PORT = process.env.HOST_PORT;
export const HOST_URL = process.env.HOST_URL;
export const CLIENT_PORT = process.env.CLIENT_PORT;
export const CLIENT_URL = process.env.CLIENT_URL;

export const LOG_LEVEL = process.env.LOG_LEVEL;
export const LOG_TARGET = process.env.LOG_TARGET;

export const AWS_SES_REGION = process.env.AWS_SES_REGION;
export const AWS_EMAIL_FROM = process.env.AWS_EMAIL_FROM;
export const AWS_EMAIL_TO = process.env.AWS_EMAIL_TO;
export const AWS_DEV_EMAIL_OVERRIDE = process.env.AWS_DEV_EMAIL_OVERRIDE;
export const AWS_SES_ACCESS_KEY_ID = process.env.AWS_SES_ACCESS_KEY_ID;
export const AWS_SES_SECRET_ACCESS_KEY = process.env.AWS_SES_SECRET_ACCESS_KEY;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
export const JWT_ISSUER = process.env.JWT_ISSUER;
export const JWT_AUDIENCE = process.env.JWT_AUDIENCE;
export const JWT_TOKEN_EXPIRY = process.env.JWT_TOKEN_EXPIRY;

export const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
export const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

export const GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_ACCOUNT_NAME =
  process.env.GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_ACCOUNT_NAME;
export const GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_ACCOUNT_ID =
  process.env.GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_ACCOUNT_ID;
export const GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_CLIENT_ID =
  process.env.GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_CLIENT_ID;
export const GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_CLIENT_SECRET =
  process.env.GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_CLIENT_SECRET;
export const GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_ROOT_FOLDER_ID =
  process.env.GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_ROOT_FOLDER_ID;
export const GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_APP_FOLDER_ID =
  process.env.GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_APP_FOLDER_ID;
export const GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_AVATAR_FOLDER_ID =
  process.env.GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_AVATAR_FOLDER_ID;
export const GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_COVER_FOLDER_ID =
  process.env.GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_COVER_FOLDER_ID;
export const GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_REDIRECT_URI =
  process.env.GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_REDIRECT_URI;
export const GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_REFRESH_TOKEN =
  process.env.GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_REFRESH_TOKEN;

export const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
export const GOOGLE_OAUTH_CLIENT_SECRET =
  process.env.GOOGLE_OAUTH_CLIENT_SECRET;

export const GITHUB_OAUTH_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID;
export const GITHUB_OAUTH_CLIENT_SECRET =
  process.env.GITHUB_OAUTH_CLIENT_SECRET;

export const FACEBOOK_OAUTH_CLIENT_ID = process.env.FACEBOOK_OAUTH_CLIENT_ID;
export const FACEBOOK_OAUTH_CLIENT_SECRET =
  process.env.FACEBOOK_OAUTH_CLIENT_SECRET;

export const LINKEDIN_OAUTH_CLIENT_ID = process.env.LINKEDIN_OAUTH_CLIENT_ID;
export const LINKEDIN_OAUTH_CLIENT_SECRET =
  process.env.LINKEDIN_OAUTH_CLIENT_SECRET;

export const CLOUDINARY_API_CLOUD_NAME = process.env.CLOUDINARY_API_CLOUD_NAME;
export const CLOUDINARY_API_KEY_NAME = process.env.CLOUDINARY_API_KEY_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
