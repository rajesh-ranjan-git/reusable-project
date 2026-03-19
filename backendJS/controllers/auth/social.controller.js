import { socialPlatforms } from "../../config/common.config.js";
import SocialLink from "../../models/auth/socialLink.model.js";
import AppError from "../../errors/app.error.js";
import { regexPropertiesValidator } from "../../validators/common.validator.js";
import { successResponseHandler } from "../../utils/response.utils.js";
import { asyncHandler } from "../../utils/common.utils.js";

export const getSocialLinks = asyncHandler(async (req, res) => {
  let links = await SocialLink.findOne({ user: req.data.userId }).lean();

  if (!links) {
    links = await SocialLink.create({ user: req.data.userId });
  }

  successResponseHandler(req, res, {
    status: "FETCH SOCIAL LINKS SUCCESS",
    message: "Social links fetched successfully!",
    data: { socialLinks: links },
  });
});

export const getSocialLinksByUser = asyncHandler(async (req, res) => {
  const { userId } = req.data.params;
  const links = await SocialLink.findOne({ user: userId }).lean();
  if (!links) {
    throw AppError.notFound({
      message: "No social links found!",
      code: "SOCIAL LINKS NOT FOUND",
      details: { socialLinks: links },
    });
  }

  successResponseHandler(req, res, {
    status: "FETCH SOCIAL LINKS SUCCESS",
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
      regexPropertiesValidator(value, platform.regex);

    if (!isPropertyValid) {
      errors.push(message);
      continue;
    }

    updates[platform.name] = validatedProperty;
  }

  if (errors.length > 0) {
    throw AppError.unprocessable({
      message: "Failed to update social links!",
      code: "UPDATE SOCIAL LINKS FAILED",
      details: { errors },
    });
  }

  if (Object.keys(updates).length === 0) {
    throw AppError.unprocessable({
      message: "No valid social links provided to update!",
      code: "UPDATE SOCIAL LINKS FAILED",
    });
  }

  const socialLinks = await SocialLink.findOneAndUpdate(
    { user: req.data.userId },
    { $set: updates },
    { new: true, upsert: true, runValidators: true },
  );

  successResponseHandler(req, res, {
    status: "UPDATE SOCIAL LINKS SUCCESS",
    message: "Social links updated successfully!",
    data: { socialLinks },
  });
});

export const deleteSocialLink = asyncHandler(async (req, res) => {
  const { platform } = req.data.params;

  const allowedPlatforms = Object.values(socialPlatforms).map((p) => p.name);

  if (!allowedPlatforms.includes(platform)) {
    throw AppError.badRequest({
      message: `Invalid platform. Must be one of: ${allowedPlatforms.join(", ")}!`,
      code: "DELETE SOCIAL LINKS FAILED",
    });
  }

  const socialLinks = await SocialLink.findOneAndUpdate(
    { user: req.data.userId },
    { $unset: { [platform]: 1 } },
    { new: true },
  );

  if (!socialLinks) {
    throw AppError.notFound({
      message: "Social links record not found!",
      code: "SOCIAL LINKS NOT FOUND",
      details: { socialLinks: links },
    });
  }

  successResponseHandler(req, res, {
    status: "DELETE SOCIAL LINK SUCCESS",
    message: `${platform} link removed successfully!`,
    data: { socialLinks },
  });
});
