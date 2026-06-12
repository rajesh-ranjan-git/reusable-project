import { google } from "googleapis";
import readline from "readline";
import {
  GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_CLIENT_ID,
  GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_CLIENT_SECRET,
  GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_REDIRECT_URI,
} from "../../constants/env.constants.js";

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_CLIENT_ID,
  GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_CLIENT_SECRET,
  GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_REDIRECT_URI,
);

// const scopes = ["https://www.googleapis.com/auth/drive"];

// const url = oauth2Client.generateAuthUrl({
//   access_type: "offline",
//   scope: scopes,
//   prompt: "consent",
// });

// console.log("Authorize this app:", url);

const code = "GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_REFRESH_TOKEN";

async function getToken() {
  const { tokens } = await oauth2Client.getToken(code);
  console.log(tokens);
}

getToken();
