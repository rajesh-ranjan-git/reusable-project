import { MAX_IMAGE_SIZE } from "@/constants/common.constants";
import {
  allowedImageTypesConfig,
  propertyConstraintsConfig,
} from "@/config/profile.config";
import { SectionErrorsType } from "@/types/types/actions.types";
import { ExperienceType } from "@/types/types/profile.types";
import { stringPropertiesValidator } from "@/validators/common.validators";

export const validateBio = (val: string): string => {
  if (!val.trim()) return "";

  const { message } = stringPropertiesValidator(
    "bio",
    val,
    propertyConstraintsConfig.minBioLength,
    propertyConstraintsConfig.maxBioLength,
  );

  return message ?? "";
};

export const validateInterest = (val: string): string => {
  if (!val.trim().toLowerCase()) return "";

  const trimmed = val.trim().toLowerCase();

  const { message } = stringPropertiesValidator(
    "interest",
    trimmed,
    propertyConstraintsConfig.minStringLength,
    propertyConstraintsConfig.maxStringLength,
  );

  return message ?? "";
};

export const validateSkill = (val: string): string => {
  if (!val?.trim()) return "";

  const { message } = stringPropertiesValidator(
    "skill",
    val,
    propertyConstraintsConfig.minStringLength,
    propertyConstraintsConfig.maxStringLength,
  );

  return message ?? "";
};

export const validateExperience = (
  exp: ExperienceType,
): SectionErrorsType<ExperienceType> => {
  const errors: SectionErrorsType<ExperienceType> = {};

  if (!exp.company.trim()) errors.company = "Company name is required!";
  if (!exp.role.trim()) errors.role = "Role / title is required!";
  if (!exp.startDate) errors.startDate = "Start date is required!";
  if (!exp.isCurrent && !exp.endDate) errors.endDate = "End date is required!";
  if (exp.startDate && exp.endDate && exp.endDate < exp.startDate)
    errors.endDate = "End date must be after start date!";

  return errors;
};

export const validateImage = (image: File) => {
  if (!allowedImageTypesConfig.includes(image.type)) {
    throw new Error("Only JPG, PNG, WEBP allowed");
  }

  if (image.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be less than 2MB");
  }
};
