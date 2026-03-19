import Profile from "../../models/auth/profile.model.js";
import AppError from "../../errors/app.error.js";
import { userNameValidator } from "../../validators/auth.validator.js";
import { successResponseHandler } from "../../utils/response.utils.js";
import { asyncHandler } from "../../utils/common.utils.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.data.userId }).lean();
  if (!profile) {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  successResponseHandler(req, res, {
    status: "FETCH PROFILE SUCCESS",
    message: "Profile fetched successfully!",
    data: { profile },
  });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  const profile = await Profile.findOne({ userName: userName.toLowerCase() })
    .populate("user", "status emailVerified lastSeen")
    .lean();

  if (!profile || profile.user?.status !== "active") {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  successResponseHandler(req, res, {
    status: "FETCH PROFILE SUCCESS",
    message: "Profile fetched successfully!",
    data: { profile },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "bio",
    "avatarUrl",
    "coverPhotoUrl",
    "company",
    "jobProfile",
    "skills",
    "interests",
  ];

  const updates = {};
  for (const key of allowedFields) {
    if (req.data.body[key] !== undefined) {
      updates[key] = req.data.body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw AppError.badRequest({
      message: "No valid fields provided to update!",
      code: "PROFILE UPDATE FAILED",
    });
  }

  if (updates.skills && !Array.isArray(updates.skills)) {
    throw AppError.unprocessable({
      message: "Skills must be a list!",
      code: "PROFILE UPDATE FAILED",
    });
  }
  if (updates.interests && !Array.isArray(updates.interests)) {
    throw AppError.unprocessable({
      message: "Interests must be a list!",
      code: "PROFILE UPDATE FAILED",
    });
  }

  const profile = await Profile.findOneAndUpdate(
    { user: req.data.userId },
    { $set: updates },
    { new: true, runValidators: true },
  );

  if (!profile) {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  successResponseHandler(req, res, {
    status: "UPDATE PROFILE SUCCESS",
    message: "Profile updated successfully!",
    data: { profile },
  });
});

export const updateUsername = asyncHandler(async (req, res) => {
  const { userName } = req.data.body;

  const {
    isUserNameValid,
    message: userNameErrorMessage,
    validatedUserName,
  } = userNameValidator(userName);

  if (!isUserNameValid) {
    throw AppError.unprocessable({
      message: userNameErrorMessage,
      code: "USERNAME VALIDATION FAILED",
      details: { userName: data.userName },
    });
  }

  const existing = await Profile.findOne({ userName: validatedUserName });
  if (existing && existing.user.toString() !== req.data.userId) {
    throw AppError.conflict({
      message: "This username is not available, please use a different one!",
      code: "USERNAME UPDATE FAILED",
      details: { userName: data.userName },
    });
  }

  const profile = await Profile.findOneAndUpdate(
    { user: req.data.userId },
    { $set: { userName: validatedUserName } },
    { new: true },
  );

  if (!profile) {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  successResponseHandler(req, res, {
    status: "UPDATE USERNAME SUCCESS",
    message: "Username updated successfully!",
    data: { userName },
  });
});
