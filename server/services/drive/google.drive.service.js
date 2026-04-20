import { google } from "googleapis";
import readline from "readline";
import { Readable } from "stream";
import {
  PROJECT_NAME,
  GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_AVATAR_FOLDER_ID,
  GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_COVER_FOLDER_ID,
  GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_ROOT_FOLDER_ID,
  GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_APP_FOLDER_ID,
  GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_CLIENT_ID,
  GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_CLIENT_SECRET,
  GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_REDIRECT_URI,
  GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_REFRESH_TOKEN,
} from "../../constants/env.constants.js";

class GoogleDriveService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_CLIENT_ID,
      GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_CLIENT_SECRET,
      GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_REDIRECT_URI,
    );

    this.oauth2Client.setCredentials({
      refresh_token: GOOGLE_DRIVE_IMAGE_STORAGE_OAUTH_REFRESH_TOKEN,
    });

    this.drive = google.drive({
      version: "v3",
      auth: this.oauth2Client,
    });
  }

  _findFolder = async (name, parentId) => {
    const res = await this.drive.files.list({
      q: `name='${name}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`,
      fields: "files(id, name)",
    });

    return res.data.files?.[0] || null;
  };

  getFolderId = async (name, parentId) => {
    let folder = await this._findFolder(name, parentId);

    if (!folder) {
      throw AppError.notFound({
        message: `Folder '${name}' does not exist!"`,
        code: "FOLDER NOT FOUND",
      });
    }

    return folder.id;
  };

  getUploadFolderId = async (type) => {
    if (
      type === "avatar" &&
      GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_AVATAR_FOLDER_ID
    ) {
      return GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_AVATAR_FOLDER_ID;
    }

    if (type === "cover" && GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_COVER_FOLDER_ID) {
      return GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_COVER_FOLDER_ID;
    }

    const rootId = GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_ROOT_FOLDER_ID;
    const projectName = PROJECT_NAME;

    const appFolderId = GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_APP_FOLDER_ID
      ? GOOGLE_DRIVE_IMAGE_STORAGE_CLIENT_APP_FOLDER_ID
      : await this.getFolderId(projectName, rootId);

    const folderName = type === "avatar" ? "user-avatars" : "user-covers";

    const folderId = await this.getFolderId(folderName, appFolderId);

    return folderId;
  };

  uploadToDrive = async (file, folderId) => {
    const response = await this.drive.files.create({
      requestBody: {
        name: file.originalname,
        parents: [folderId],
      },
      media: {
        mimeType: file.mimetype,
        body: Readable.from(file.buffer),
      },
      fields: "id",
    });

    const fileId = response.data.id;

    await this.drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const url = `https://lh3.googleusercontent.com/d/${fileId}`;

    return { fileId, url };
  };

  deleteFromDrive = async (fileId) => {
    if (!fileId) return;

    return await this.drive.files.delete({
      fileId,
    });
  };
}

export const googleDriveService = new GoogleDriveService();
