import cloudinary from "../config/cloudinary.config.js";
import { sanitizeMongoData } from "../db/db.utils.js";
import Profile from "../models/user/profile/profile.model.js";
import { googleDriveService } from "../services/drive/google.drive.service.js";
import AppError from "../services/error/error.service.js";
import { selectObjectProperties } from "./common.utils.js";

export const uploadToGoogleDrive = async (userId, profile, type, file) => {
  const folderId = await googleDriveService.getUploadFolderId(type);

  const { url, fileId } = await googleDriveService.uploadToDrive(
    file,
    folderId,
  );

  if (!url || !fileId) {
    throw AppError.internal({
      message: `Failed to update ${type}, please try again!`,
      code: `${type.toUpperCase()} UPDATE FAILED`,
    });
  }

  let updateField = {};
  if (type === "avatar") {
    updateField = {
      avatar: url,
      avatarFileId: fileId,
    };
  } else {
    updateField = {
      cover: url,
      coverFileId: fileId,
    };
  }

  const updatedProfile = await Profile.findOneAndUpdate(
    { user: userId },
    { $set: updateField },
    {
      returnDocument: "after",
      runValidators: true,
      select: type,
    },
  );

  if (type === "avatar" && profile.avatarFileId) {
    const deleteAvatarResponse = await googleDriveService.deleteFromDrive(
      profile.avatarFileId,
    );

    if (!deleteAvatarResponse) {
      logger.warn(
        `🚨 [${type.toUpperCase()} DELETE FAILED] Failed to delete old ${type} image!`,
      );
    }
  }

  if (type === "cover" && profile.coverFileId) {
    const deleteCoverResponse = await googleDriveService.deleteFromDrive(
      profile.coverFileId,
    );

    if (!deleteCoverResponse) {
      logger.warn(
        `🚨 [${type.toUpperCase()} DELETE FAILED] Failed to delete old ${type} image!`,
      );
    }
  }

  return selectObjectProperties(sanitizeMongoData(updatedProfile), [
    "id",
    type,
  ]);
};

export const uploadToCloudinary = async (userId, profile, type, file) => {
  const folder =
    type === "avatar"
      ? `app/users/${userId}/avatar`
      : `app/users/${userId}/cover`;

  const avatarConfig = {
    width: 500,
    height: 500,
    crop: "fill",
    gravity: "auto",
  };
  const coverConfig = {
    width: 1200,
    height: 500,
    crop: "fill",
    gravity: "auto",
  };

  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          type === "avatar" ? avatarConfig : coverConfig,
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(file.buffer);
  });

  const { secure_url, public_id } = await uploadResult;

  if (!secure_url || !public_id) {
    throw AppError.internal({
      message: `Failed to update ${type}, please try again!`,
      code: `${type.toUpperCase()} UPDATE FAILED`,
    });
  }

  let updateField = {};
  if (type === "avatar") {
    updateField = {
      avatar: secure_url,
      avatarFileId: public_id,
    };
  } else {
    updateField = {
      cover: secure_url,
      coverFileId: public_id,
    };
  }

  const updatedProfile = await Profile.findOneAndUpdate(
    { user: userId },
    { $set: updateField },
    {
      returnDocument: "after",
      runValidators: true,
      select: type,
    },
  );

  if (type === "avatar" && profile.avatarFileId) {
    const deleteAvatarResponse = await cloudinary.uploader.destroy(
      profile.avatarFileId,
    );

    if (!deleteAvatarResponse) {
      logger.warn(
        `🚨 [${type.toUpperCase()} DELETE FAILED] Failed to delete old ${type} image!`,
      );
    }
  }

  if (type === "cover" && profile.coverFileId) {
    const deleteCoverResponse = await cloudinary.uploader.destroy(
      profile.coverFileId,
    );

    if (!deleteCoverResponse) {
      logger.warn(
        `🚨 [${type.toUpperCase()} DELETE FAILED] Failed to delete old ${type} image!`,
      );
    }
  }

  return selectObjectProperties(sanitizeMongoData(updatedProfile), [
    "id",
    type,
  ]);
};
