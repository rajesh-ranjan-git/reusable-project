import Profile from "../../../models/user/profile/profile.model.js";
import AppError from "../../../services/error/error.service.js";
import {
  userNameValidator,
  validateUpdateProfile,
} from "../../../validators/auth.validator.js";
import { responseService } from "../../../services/response/response.service.js";
import {
  asyncHandler,
  isPlainObject,
  toTitleCase,
} from "../../../utils/common.utils.js";
import { httpStatusConfig } from "../../../config/http.config.js";
import {
  genderProperties,
  propertyConstraints,
} from "../../../config/common.config.js";
import { googleDriveService } from "../../../services/drive/google.drive.service.js";
import { isValidObjectId } from "mongoose";
import {
  datePropertyValidator,
  stringPropertiesValidator,
} from "../../../validators/common.validator.js";
import { validateExperience } from "../../../validators/profile.validator.js";
import {
  uploadToCloudinary,
  uploadToGoogleDrive,
} from "../../../utils/upload.utils.js";
import { rbacService } from "../../../services/rbac/rbac.service.js";
import Account from "../../../models/user/auth/account.model.js";
import User from "../../../models/user/auth/user.model.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  const userId = req.data.userId;

  const account = await Account.findOne({ user: userId }).select("-_id email");

  if (!account) {
    throw AppError.notFound({
      message: "User account not found!",
      code: "ACCOUNT NOT FOUND",
    });
  }

  const user = await User.findById(userId).select(
    "-_id emailVerified phoneVerified",
  );

  if (!user) {
    throw AppError.notFound({
      message: "User details not found!",
      code: "USER NOT FOUND",
    });
  }

  const userRoles = await rbacService.getUserRoles(userId);
  const userHighestRole = await rbacService.getHighestRoleLevel(userRoles);
  const userRole = userRoles.reduce(
    (acc, curr) => (curr.priority === userHighestRole ? curr.name : acc),
    null,
  );

  const profile = await Profile.findOne({ user: userId })
    .lean()
    .select("-_id -user -__v");

  if (!profile) {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  const userFields = {
    id: userId,
    email: account.email,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    role: userRole,
    ...profile,
  };

  return responseService.successResponseHandler(req, res, {
    status: "PROFILE FETCH SUCCESS",
    message: "Profile fetched successfully!",
    data: { user: userFields },
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
    .select("-createdAt -updatedAt")
    .populate("user", "status lastSeen")
    .lean();

  if (!profile || profile.user?.status !== "active") {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  const userId = profile.user._id;

  const account = await Account.findOne({ user: userId }).select("-_id email");

  if (!account) {
    throw AppError.notFound({
      message: "User account not found!",
      code: "ACCOUNT NOT FOUND",
    });
  }

  const { _id, user, __v, ...safeProfile } = profile;

  const userFields = {
    id: userId,
    email: account.email,
    ...safeProfile,
  };

  return responseService.successResponseHandler(req, res, {
    status: "PROFILE FETCH SUCCESS",
    message: "Profile fetched successfully!",
    data: { user: userFields },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "nickName",
    "bio",
    "maritalStatus",
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

  return responseService.successResponseHandler(req, res, {
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

  return responseService.successResponseHandler(req, res, {
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

  return responseService.successResponseHandler(req, res, {
    status: "PROFILE UPDATE SUCCESS",
    statusCode: httpStatusConfig.created.statusCode,
    message: "Gender updated successfully!",
    data: { gender: gender.trim().toLowerCase() },
  });
});

export const updateDob = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.data.userId });

  if (profile.dob)
    throw AppError.forbidden({
      message: "Date of birth can only be updated once!",
      code: "PROFILE UPDATE FAILED",
    });

  const { dob } = req.data.body;

  if (!dob) {
    throw AppError.unprocessable({
      message: "Please provide date of birth to update!",
      code: "DOB VALIDATION FAILED",
      details: { dob },
    });
  }

  const {
    isPropertyValid: isDobValid,
    message: dobErrorMessage,
    validatedProperty: validatedDob,
  } = datePropertyValidator("date of birth", dob);

  if (!isDobValid) {
    throw AppError.unprocessable({
      message: dobErrorMessage,
      code: "PROFILE UPDATE FAILED",
      details: { dob },
    });
  }

  const updatedProfile = await Profile.findOneAndUpdate(
    { user: req.data.userId },
    { $set: { dob } },
    { returnDocument: "after", runValidators: true },
  );

  if (!updatedProfile) {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  return responseService.successResponseHandler(req, res, {
    status: "PROFILE UPDATE SUCCESS",
    statusCode: httpStatusConfig.created.statusCode,
    message: "Date of birth updated successfully!",
    data: { dob },
  });
});

export const uploadProfileImage = async (req, res) => {
  const userId = req.data.userId;
  const file = req.file;
  const { provider: incomingProvider, type: incomingType } = req.data.params;

  if (
    typeof incomingProvider !== "string" ||
    !["drive", "cloudinary"].includes(incomingProvider.toLowerCase())
  ) {
    throw AppError.unprocessable({
      message:
        "Image upload service provider can only be 'drive' for google drive or 'cloudinary'!",
      code: "IMAGE UPLOAD FAILED",
      details: { provider: incomingProvider },
    });
  }

  if (
    typeof incomingType !== "string" ||
    !["avatar", "cover"].includes(incomingType.toLowerCase())
  ) {
    throw AppError.unprocessable({
      message: "Image type can be either 'avatar' or 'cover'!",
      code: "IMAGE UPLOAD FAILED",
      details: { type: incomingType },
    });
  }

  const provider = incomingProvider.toLowerCase();
  const type = incomingType.toLowerCase();

  if (!file) {
    throw AppError.unprocessable({
      message: `Please provide ${type} image to update!`,
      code: `${type.toUpperCase()} UPDATE FAILED`,
      details: { file },
    });
  }

  const profile = await Profile.findOne({ user: userId }).select(
    "avatarFileId coverFileId",
  );

  if (!profile) {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  const updatedProfile =
    provider === "drive"
      ? await uploadToGoogleDrive(userId, profile, type, file)
      : await uploadToCloudinary(userId, profile, type, file);

  return responseService.successResponseHandler(req, res, {
    status: `${type.toUpperCase()} UPDATE SUCCESS`,
    statusCode: httpStatusConfig.created.statusCode,
    message: `${toTitleCase(type)} updated successfully!`,
    data: updatedProfile,
  });
};

export const updateSkills = async (req, res) => {
  const userId = req.data.userId;
  let { skills } = req.data.body;

  if (!skills || !Array.isArray(skills)) {
    throw AppError.unprocessable({
      message: "Skills must be a list!",
      code: "SKILLS UPDATE FAILED",
      details: { skills },
    });
  }

  let normalizedSkills = skills.map((skill) => {
    const {
      isPropertyValid: isSkillValid,
      message: skillErrorMessage,
      validatedProperty: validatedSkill,
    } = stringPropertiesValidator(
      "skill",
      skill,
      propertyConstraints.minStringLength,
      propertyConstraints.maxStringLength,
    );

    if (!isSkillValid && !isPlainObject(skill)) {
      throw AppError.unprocessable({
        message: skillErrorMessage,
        code: "SKILLS UPDATE FAILED",
        details: { skills },
      });
    }

    if (isSkillValid) {
      return {
        name: validatedSkill,
        level: "beginner",
      };
    }

    if (!skill.name || !skill.level) {
      throw AppError.unprocessable({
        message: "Skill name and level are required to update skills",
        code: "SKILLS UPDATE FAILED",
        details: { skills },
      });
    }

    const validateSkillEntry = (key, value) => {
      if (key === "name") {
        const { isPropertyValid, message, validatedProperty } =
          stringPropertiesValidator(
            "skill names",
            value,
            propertyConstraints.minStringLength,
            propertyConstraints.maxStringLength,
          );

        if (!isPropertyValid) {
          throw AppError.unprocessable({
            message,
            code: "SKILLS UPDATE FAILED",
            details: { skills },
          });
        }

        return validatedProperty;
      }

      if (key === "level") {
        if (!["beginner", "intermediate", "pro"].includes(value)) {
          throw AppError.unprocessable({
            message: "Please provide valid skill level to update!",
            code: "SKILLS UPDATE FAILED",
            details: { skills },
          });
        }
      }

      return value;
    };

    const validatedSkills = Object.fromEntries(
      Object.entries(skill).map(([key, value]) => [
        key,
        validateSkillEntry(key, value),
      ]),
    );

    return {
      name: validatedSkills.name?.trim().toLowerCase(),
      level: ["beginner", "intermediate", "pro"].includes(validatedSkills.level)
        ? validatedSkills.level
        : "beginner",
    };
  });

  normalizedSkills = normalizedSkills.filter((s) => s.name);

  const levelPriority = {
    beginner: 1,
    intermediate: 2,
    pro: 3,
  };

  const incomingSkillsMap = new Map();

  normalizedSkills.forEach((skill) => {
    const existing = incomingSkillsMap.get(skill.name);

    if (!existing) {
      incomingSkillsMap.set(skill.name, skill);
    } else {
      if (levelPriority[skill.level] > levelPriority[existing.level]) {
        incomingSkillsMap.set(skill.name, skill);
      }
    }
  });

  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  const existingSkills = profile.skills || [];

  const existingSkillsMap = new Map();

  existingSkills.forEach((skill) => {
    existingSkillsMap.set(skill.name, skill);
  });

  const finalSkillsMap = new Map();

  incomingSkillsMap.forEach((incomingSkill, name) => {
    const existingSkill = existingSkillsMap.get(name);

    if (!existingSkill) {
      finalSkillsMap.set(name, incomingSkill);
    } else {
      const betterSkill =
        levelPriority[incomingSkill.level] > levelPriority[existingSkill.level]
          ? incomingSkill
          : existingSkill;

      finalSkillsMap.set(name, betterSkill);
    }
  });

  const finalSkills = Array.from(finalSkillsMap.values());

  const updatedProfile = await Profile.findOneAndUpdate(
    { user: userId },
    { skills: finalSkills },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return responseService.successResponseHandler(req, res, {
    status: "SKILLS UPDATE SUCCESS",
    message: "Skills updated successfully!",
    data: updatedProfile.skills,
  });
};

export const updateExperience = async (req, res) => {
  const userId = req.data.userId;
  const { action, experience, experienceId, experiences } = req.data.body;

  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw AppError.notFound({
      message: "Profile details not found!",
      code: "PROFILE NOT FOUND",
    });
  }

  if (action === "add") {
    const newExperience = validateExperience(experience);

    let updateQuery;

    if (newExperience.isCurrent) {
      updateQuery = {
        $set: { "experiences.$[elem].isCurrent": false },
        $push: { experiences: newExperience },
      };
    } else {
      updateQuery = {
        $push: { experiences: newExperience },
      };
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      updateQuery,
      {
        arrayFilters: newExperience.isCurrent
          ? [{ "elem.isCurrent": true }]
          : undefined,
        new: true,
        runValidators: true,
      },
    );

    return responseService.successResponseHandler(req, res, {
      status: "EXPERIENCE UPDATE SUCCESS",
      message: "New experience added successfully!",
      data: updatedProfile.experiences,
    });
  }

  if (action === "update") {
    if (!experienceId || !isValidObjectId(experienceId)) {
      throw AppError.unprocessable({
        message: "Please provide a valid experienceId!",
        code: "EXPERIENCE UPDATE FAILED",
        details: { experienceId },
      });
    }

    const experienceToUpdate = profile.experiences?.filter(
      (experience) => experience.id === experienceId,
    );

    if (!experienceToUpdate.length) {
      throw AppError.unprocessable({
        message: "Experience with the provided experienceId does not exist!",
        code: "EXPERIENCE NOT FOUND",
        details: { experienceId },
      });
    }

    const updatedExperience = validateExperience(experience);

    const updateFields = {};

    if (updatedExperience.company)
      updateFields["experiences.$.company"] = updatedExperience.company;
    if (updatedExperience.role)
      updateFields["experiences.$.role"] = experience.role;
    if (updatedExperience.startDate)
      updateFields["experiences.$.startDate"] = new Date(
        updatedExperience.startDate,
      );
    if ("endDate" in updatedExperience)
      updateFields["experiences.$.endDate"] = updatedExperience.endDate
        ? new Date(updatedExperience.endDate)
        : null;
    if ("description" in updatedExperience)
      updateFields["experiences.$.description"] = updatedExperience.description;

    let updateQuery = { $set: updateFields };

    if (updatedExperience.isCurrent) {
      updateQuery = {
        $set: {
          ...updateFields,
          "experiences.$.isCurrent": true,
        },
      };

      await Profile.updateOne(
        { user: userId },
        { $set: { "experiences.$[elem].isCurrent": false } },
        { arrayFilters: [{ "elem.isCurrent": true }] },
      );
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId, "experiences._id": experienceId },
      updateQuery,
      { returnDocument: "after", runValidators: true },
    );

    return responseService.successResponseHandler(req, res, {
      status: "EXPERIENCE UPDATE SUCCESS",
      message: "Experience updated successfully!",
      data: updatedProfile.experiences,
    });
  }

  if (action === "delete") {
    if (!experienceId || !isValidObjectId(experienceId)) {
      throw AppError.unprocessable({
        message: "Please provide a valid experienceId!",
        code: "EXPERIENCE UPDATE FAILED",
        details: { experienceId },
      });
    }

    const experienceToDelete = profile.experiences?.filter(
      (experience) => experience._id === experienceId,
    );

    if (!experienceToDelete) {
      throw AppError.unprocessable({
        message: "Experience with the provided experienceId does not exist!",
        code: "EXPERIENCE NOT FOUND",
        details: { experienceId },
      });
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        $pull: { experiences: { _id: experienceId } },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    return responseService.successResponseHandler(req, res, {
      status: "EXPERIENCE DELETE SUCCESS",
      message: "Experience deleted successfully!",
      data: updatedProfile.experiences,
    });
  }

  if (action === "replace") {
    if (!Array.isArray(experiences)) {
      throw AppError.unprocessable({
        message: "Experiences must be a list!",
        code: "EXPERIENCE UPDATE FAILED",
        details: { experiences },
      });
    }

    const formattedExperiences = experiences.map((experience) => {
      const validatedExperience = validateExperience(experience);

      return {
        company: validatedExperience.company?.trim(),
        role: validatedExperience.role?.trim(),
        startDate: new Date(validatedExperience.startDate),
        endDate: validatedExperience.endDate
          ? new Date(validatedExperience.endDate)
          : null,
        isCurrent: validatedExperience.isCurrent || false,
        description: validatedExperience.description || "",
      };
    });

    let foundCurrent = false;
    formattedExperiences.forEach((experience) => {
      if (experience.isCurrent) {
        if (foundCurrent) experience.isCurrent = false;
        foundCurrent = true;
      }
    });

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { experiences: formattedExperiences },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    return responseService.successResponseHandler(req, res, {
      status: "EXPERIENCE UPDATE SUCCESS",
      message: "Experiences replaced successfully!",
      data: updatedProfile.experiences,
    });
  }

  throw AppError.unprocessable({
    message: "Please provide a valid action for experience update!",
    code: "EXPERIENCE UPDATE FAILED",
    details: { action },
  });
};
