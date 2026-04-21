import { isValidObjectId } from "mongoose";
import { socialPlatforms } from "../../../config/common.config.js";
import Social from "../../../models/user/profile/social.model.js";
import { regexPropertiesValidator } from "../../../validators/common.validator.js";
import { asyncHandler, toTitleCase } from "../../../utils/common.utils.js";
import AppError from "../../../services/error/error.service.js";
import { responseService } from "../../../services/response/response.service.js";

export const getSocialLinks = asyncHandler(async (req, res) => {
  let links = await Social.findOne({ user: req.data.userId }).lean();

  if (!links) {
    links = await Social.create({ user: req.data.userId });
  }

  return responseService.successResponseHandler(req, res, {
    status: "SOCIAL LINKS FETCH SUCCESS",
    message: "Social links fetched successfully!",
    data: { socialLinks: links },
  });
});

export const getSocialLinksByUser = asyncHandler(async (req, res) => {
  const { userId } = req.data.params;

  const isValidId = isValidObjectId(userId);

  if (!isValidId) {
    throw AppError.unprocessable({
      message: "Please provide a valid user id!",
      code: "USER ID VALIDATION FAILED",
      details: { userId },
    });
  }

  const links = await Social.findOne({ user: userId }).lean();
  if (!links) {
    throw AppError.notFound({
      message: "No social links found!",
      code: "SOCIAL LINKS NOT FOUND",
      details: { socialLinks: links },
    });
  }

  return responseService.successResponseHandler(req, res, {
    status: "SOCIAL LINKS FETCH SUCCESS",
    message: "Social links fetched successfully!",
    data: { socialLinks: links },
  });
});

export const updateSocialLinks = asyncHandler(async (req, res) => {
  const updates = {};
  const errors = [];

  for (const platform of Object.values(socialPlatforms)) {
    if (req.data.body[platform.name] === undefined) continue;

    const value = req.data.body[platform.name];

    const { isPropertyValid, message, validatedProperty } =
      regexPropertiesValidator(platform.name, value, platform.regex);

    if (!isPropertyValid) {
      errors.push(message);
      continue;
    }

    updates[platform.name] = validatedProperty;
  }

  if (errors.length > 0) {
    throw AppError.unprocessable({
      message: "Failed to update social links!",
      code: "SOCIAL LINKS UPDATE FAILED",
      details: { errors },
    });
  }

  if (Object.keys(updates).length === 0) {
    throw AppError.unprocessable({
      message: "No valid social links provided to update!",
      code: "SOCIAL LINKS UPDATE FAILED",
    });
  }

  const socialLinks = await Social.findOneAndUpdate(
    { user: req.data.userId },
    { $set: updates },
    { returnDocument: "after", upsert: true, runValidators: true },
  );

  if (!socialLinks) {
    throw AppError.internal({
      message: "Failed to update social links!",
      code: "SOCIAL LINKS UPDATE FAILED",
    });
  }

  return responseService.successResponseHandler(req, res, {
    status: "SOCIAL LINKS UPDATE SUCCESS",
    message: "Social links updated successfully!",
    data: { socialLinks },
  });
});

export const deleteSocialLink = asyncHandler(async (req, res) => {
  const { platform } = req.data.params;

  const allowedPlatforms = Object.values(socialPlatforms).map((p) => p.name);

  if (!allowedPlatforms.includes(platform)) {
    throw AppError.badRequest({
      message: `Invalid platform. Must be one of: ${toTitleCase(allowedPlatforms.join(", "))}!`,
      code: "SOCIAL LINK DELETE FAILED",
    });
  }

  const socialLinks = await Social.findOne({ user: req.data.userId });

  if (!socialLinks[platform]) {
    throw AppError.badRequest({
      message: `${toTitleCase(platform)} link not available to delete!`,
      code: "SOCIAL LINK DELETE FAILED",
    });
  }

  const updatedSocialLinks = await Social.findOneAndUpdate(
    { user: req.data.userId },
    { $unset: { [platform]: 1 } },
    { returnDocument: "after", runValidators: true },
  );

  if (!socialLinks) {
    throw AppError.internal({
      message: "Failed to delete social links!",
      code: "SOCIAL LINK DELETE FAILED",
    });
  }

  return responseService.successResponseHandler(req, res, {
    status: "SOCIAL LINK DELETE SUCCESS",
    message: `${toTitleCase(platform)} link removed successfully!`,
    data: { socialLinks: updatedSocialLinks },
  });
});
