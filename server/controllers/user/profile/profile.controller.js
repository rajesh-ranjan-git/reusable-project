import Profile from "../../../models/user/profile/profile.model.js";
import AppError from "../../../services/error/error.service.js";
import {
  userNameValidator,
  validateUpdateProfile,
} from "../../../validators/auth.validator.js";
import { responseService } from "../../../services/response/response.service.js";
import { asyncHandler } from "../../../utils/common.utils.js";
import { httpStatusConfig } from "../../../config/http.config.js";
import { genderProperties } from "../../../config/common.config.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.data.userId }).lean();

  if (!profile) {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  responseService.successResponseHandler(req, res, {
    status: "PROFILE FETCH SUCCESS",
    message: "Profile fetched successfully!",
    data: { profile },
  });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const { userName } = req.data.params;

  const {
    isUserNameValid,
    message: userNameErrorMessage,
    validatedUserName,
  } = userNameValidator(userName);

  if (!isUserNameValid) {
    throw AppError.unprocessable({
      message: userNameErrorMessage,
      code: "USERNAME VALIDATION FAILED",
      details: { userName: userName },
    });
  }

  const profile = await Profile.findOne({ userName: validatedUserName })
    .populate("user", "status emailVerified lastSeen")
    .lean();

  if (!profile || profile.user?.status !== "active") {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  responseService.successResponseHandler(req, res, {
    status: "PROFILE FETCH SUCCESS",
    message: "Profile fetched successfully!",
    data: { profile },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "nickName",
    "bio",
    "maritalStatus",
    "jobProfile",
    "company",
    "experience",
    "skills",
    "interests",
  ];

  const updates = {};
  for (const key of allowedFields) {
    if (req.data.body[key] !== undefined) {
      updates[key] = req.data.body[key];
    }
  }

  const { validatedProperties, errors } = validateUpdateProfile(updates);

  if (errors && Object.values(errors).length > 0) {
    throw new AppError({
      message: "Invalid profile details found while update!",
      code: "PROFILE UPDATE FAILED",
      statusCode: httpStatusConfig.notAcceptable.statusCode,
      details: { validProperties: validatedProperties, errors },
    });
  }

  if (!Object.values(validatedProperties).length) {
    throw new AppError({
      message: "No valid properties to update!",
      code: "PROFILE UPDATE FAILED",
      statusCode: httpStatusConfig.notAcceptable.statusCode,
      details: { validProperties: validatedProperties, errors },
    });
  }

  const profile = await Profile.findOneAndUpdate(
    { user: req.data.userId },
    { $set: validatedProperties },
    { returnDocument: "after", runValidators: true },
  );

  if (!profile) {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  responseService.successResponseHandler(req, res, {
    status: "PROFILE UPDATE SUCCESS",
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
      details: { userName: userName },
    });
  }

  const existing = await Profile.findOne({ userName: validatedUserName });
  if (existing && existing.user.toString() !== req.data.userId) {
    throw AppError.conflict({
      message: "This userName is not available, please use a different one!",
      code: "USERNAME UPDATE FAILED",
      details: { userName: validatedUserName },
    });
  }

  if (existing && existing.user.toString() === req.data.userId) {
    throw AppError.conflict({
      message: "This userName is already updated on your account!",
      code: "USERNAME UPDATE FAILED",
      details: { email: validatedUserName },
    });
  }

  const profile = await Profile.findOneAndUpdate(
    { user: req.data.userId },
    { $set: { userName: validatedUserName } },
    { returnDocument: "after", runValidators: true },
  );

  if (!profile) {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  responseService.successResponseHandler(req, res, {
    status: "USERNAME UPDATE SUCCESS",
    message: "Username updated successfully!",
    data: { userName: validatedUserName },
  });
});

export const updateGender = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.data.userId });

  if (profile.gender)
    throw AppError.forbidden({
      message: "Gender can only be updated once!",
      code: "PROFILE UPDATE FAILED",
    });

  const { gender } = req.data.body;

  if (!gender) {
    throw AppError.unprocessable({
      message: "Please provide gender to update!",
      code: "GENDER VALIDATION FAILED",
      details: { gender },
    });
  }

  if (
    typeof gender !== "string" ||
    Object.values(genderProperties).filter(
      (g) => g === gender.trim().toLowerCase(),
    ).length === 0
  ) {
    throw AppError.unprocessable({
      message: "Gender must be either 'male', 'female' or 'other'!",
      code: "GENDER VALIDATION FAILED",
      details: { gender },
    });
  }

  const updatedProfile = await Profile.findOneAndUpdate(
    { user: req.data.userId },
    { $set: { gender: gender.trim().toLowerCase() } },
    { returnDocument: "after", runValidators: true },
  );

  if (!updatedProfile) {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  responseService.successResponseHandler(req, res, {
    status: "PROFILE UPDATE SUCCESS",
    statusCode: httpStatusConfig.created.statusCode,
    message: "Gender updated successfully!",
    data: { gender: gender.trim().toLowerCase() },
  });
});
