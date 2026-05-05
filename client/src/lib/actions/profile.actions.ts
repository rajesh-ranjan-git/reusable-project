import {
  allowedSkillLevelsConfig,
  propertyConstraintsConfig,
} from "@/config/profile.config";
import { FormStateType, SectionErrorsType } from "@/types/types/actions.types";
import {
  ExperienceType,
  ImageTargetType,
  SkillErrorType,
  SkillType,
} from "@/types/types/profile.types";
import { ApiErrorResponseType, ApiResponseType } from "@/types/types/api.types";
import {
  datePropertyValidator,
  listPropertiesValidator,
  numberRegexPropertiesValidator,
  stringPropertiesValidator,
} from "@/validators/common.validators";
import { api } from "@/lib/api/apiHandler";
import { apiUrls } from "@/lib/api/apiUtils";
import { emailValidator } from "@/validators/auth.validators";
import { PHONE_REGEX } from "@/constants/regex.constants";

export const uploadImage = async (
  image: File,
  type: ImageTargetType,
): Promise<ApiResponseType> => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    return await api.post(
      `${apiUrls.profile.uploadImageToCloudinary}/${type}`,
      formData,
      { requireAuth: true },
    );
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};

export const fetchProfile = async (
  userName?: string,
): Promise<ApiResponseType> => {
  try {
    return await api.get(
      `${userName ? `${apiUrls.profile.actionProfile}/${userName}` : apiUrls.profile.actionProfile}`,
      { requireAuth: true },
    );
  } catch (error) {
    return error as ApiErrorResponseType;
  }
};

export const updateProfile = async (
  prevState: FormStateType,
  formData: FormData,
): Promise<FormStateType> => {
  const bio = formData.get("bio");
  const maritalStatus = formData.get("maritalStatus");
  const interestsRaw = formData.get("interests");

  let interests: string[] = [];

  try {
    interests = JSON.parse(interestsRaw as string);
  } catch {
    interests = [];
  }

  const errors: FormStateType["errors"] = {};

  const { validatedProperty: validatedBio, message: bioErrorMessage } =
    stringPropertiesValidator(
      "bio",
      bio,
      propertyConstraintsConfig.minBioLength,
      propertyConstraintsConfig.maxBioLength,
    );
  errors.bio = bioErrorMessage ?? null;

  if (
    maritalStatus &&
    !["married", "single", "separated", "divorced", "complicated"].includes(
      maritalStatus as string,
    )
  ) {
    errors.maritalStatus = "Please provide a valid relationship status!";
  }

  const {
    validatedProperty: validatedInterests,
    message: interestsErrorMessage,
  } = listPropertiesValidator("interests", interests);
  errors.interests = interestsErrorMessage ?? null;

  if (Object.values(errors).some((error) => error !== null)) {
    return {
      success: false,
      status: "VALIDATION FAILED",
      code: "PROFILE UPDATE FAILED",
      statusCode: 422,
      message: "Please provide valid details to update!",
      details: errors,
      timestamp: new Date().toISOString(),
      metadata: null,
      errors,
      inputs: Object.fromEntries(formData),
    };
  }

  try {
    const response = await api.patch(
      apiUrls.profile.actionProfile,
      {
        bio: validatedBio,
        maritalStatus,
        interests: validatedInterests,
      },
      { requireAuth: true },
    );

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      status: error?.status ?? "VALIDATION FAILED",
      code: error?.code ?? "PROFILE UPDATE FAILED",
      statusCode: error?.statusCode ?? 500,
      message: error?.message ?? "Unable to update profile, please try again!",
      details: error?.details ?? null,
      timestamp: new Date().toISOString(),
      metadata: error?.metadata ?? null,
      inputs: Object.fromEntries(formData),
    };
  }
};

export const updateEmail = async (
  prevState: FormStateType,
  formData: FormData,
): Promise<FormStateType> => {
  const email = formData.get("email");

  const errors: FormStateType["errors"] = {};

  const { validatedEmail, message: emailErrorMessage } = emailValidator(email);
  errors.email = emailErrorMessage ?? null;

  if (Object.values(errors).some((error) => error !== null)) {
    return {
      success: false,
      status: "EMAIL VALIDATION FAILED",
      code: "EMAIL UPDATE FAILED",
      statusCode: 422,
      message: "Please provide valid email address!",
      details: errors,
      timestamp: new Date().toISOString(),
      metadata: null,
      errors,
      inputs: Object.fromEntries(formData),
    };
  }

  try {
    const response = await api.put(
      apiUrls.user.updateEmail,
      { email: validatedEmail },
      { requireAuth: true },
    );

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      status: error?.status ?? "EMAIL VALIDATION FAILED",
      code: error?.code ?? "EMAIL UPDATE FAILED",
      statusCode: error?.statusCode ?? 500,
      message: error?.message ?? "Unable to update email, please try again!",
      details: error?.details ?? null,
      timestamp: new Date().toISOString(),
      metadata: error?.metadata ?? null,
      inputs: Object.fromEntries(formData),
    };
  }
};

export const updatePhone = async (
  prevState: FormStateType,
  formData: FormData,
): Promise<FormStateType> => {
  const phone = formData.get("phone");

  const errors: FormStateType["errors"] = {};

  const { validatedProperty: validatedPhone, message: phoneErrorMessage } =
    numberRegexPropertiesValidator("phone", phone, PHONE_REGEX);
  errors.phone = phoneErrorMessage ?? null;

  if (Object.values(errors).some((error) => error !== null)) {
    return {
      success: false,
      status: "PHONE VALIDATION FAILED",
      code: "PHONE UPDATE FAILED",
      statusCode: 422,
      message: errors.phone ?? "Please provide valid phone number!",
      details: errors,
      timestamp: new Date().toISOString(),
      metadata: null,
      errors,
      inputs: Object.fromEntries(formData),
    };
  }

  try {
    const response = await api.post(
      apiUrls.profile.updatePhone,
      { phone: validatedPhone },
      { requireAuth: true },
    );

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      status: error?.status ?? "PHONE VALIDATION FAILED",
      code: error?.code ?? "PHONE UPDATE FAILED",
      statusCode: error?.statusCode ?? 500,
      message:
        error?.message ?? "Unable to update phone number, please try again!",
      details: error?.details ?? null,
      timestamp: new Date().toISOString(),
      metadata: error?.metadata ?? null,
      inputs: Object.fromEntries(formData),
    };
  }
};

export const updateGender = async (
  prevState: FormStateType,
  formData: FormData,
): Promise<FormStateType> => {
  const gender = formData.get("gender");

  const errors: FormStateType["errors"] = {};

  if (gender && !["male", "female", "other"].includes(gender as string)) {
    errors.gender = "Please provide a valid gender!";
  }

  if (Object.values(errors).some((error) => error !== null)) {
    return {
      success: false,
      status: "GENDER VALIDATION FAILED",
      code: "GENDER UPDATE FAILED",
      statusCode: 422,
      message: errors.gender ?? "Please provide valid gender!",
      details: errors,
      timestamp: new Date().toISOString(),
      metadata: null,
      errors,
      inputs: Object.fromEntries(formData),
    };
  }

  try {
    const response = await api.post(
      apiUrls.profile.updateGender,
      { gender },
      { requireAuth: true },
    );

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      status: error?.status ?? "GENDER VALIDATION FAILED",
      code: error?.code ?? "GENDER UPDATE FAILED",
      statusCode: error?.statusCode ?? 500,
      message: error?.message ?? "Unable to update gender, please try again!",
      details: error?.details ?? null,
      timestamp: new Date().toISOString(),
      metadata: error?.metadata ?? null,
      inputs: Object.fromEntries(formData),
    };
  }
};

export const updateDob = async (
  prevState: FormStateType,
  formData: FormData,
): Promise<FormStateType> => {
  const dob = formData.get("dob");

  const errors: FormStateType["errors"] = {};

  const { message, validatedProperty: validatedDob } = datePropertyValidator(
    "date of birth",
    dob as string,
  );
  errors.dob = message ?? null;

  if (Object.values(errors).some((error) => error !== null)) {
    return {
      success: false,
      status: "DOB VALIDATION FAILED",
      code: "DOB UPDATE FAILED",
      statusCode: 422,
      message: errors.dob ?? "Please provide valid date of birth!",
      details: errors,
      timestamp: new Date().toISOString(),
      metadata: null,
      errors,
      inputs: Object.fromEntries(formData),
    };
  }

  try {
    const response = await api.post(
      apiUrls.profile.updateDob,
      { dob: validatedDob },
      { requireAuth: true },
    );

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      status: error?.status ?? "DOB VALIDATION FAILED",
      code: error?.code ?? "DOB UPDATE FAILED",
      statusCode: error?.statusCode ?? 500,
      message:
        error?.message ?? "Unable to update date of birth, please try again!",
      details: error?.details ?? null,
      timestamp: new Date().toISOString(),
      metadata: error?.metadata ?? null,
      inputs: Object.fromEntries(formData),
    };
  }
};

export const updateSkills = async (
  prevState: FormStateType,
  formData: FormData,
): Promise<FormStateType> => {
  const skillsRaw = formData.get("skills");

  let skills: SkillType[] = [];

  try {
    skills = JSON.parse(skillsRaw as string);
  } catch {
    skills = [];
  }

  const errors: FormStateType["errors"] = {};
  const skillErrors: SkillErrorType[] = [];

  const seen = new Set<string>();

  skills.forEach((skill, index) => {
    const currentError: SkillErrorType = {
      index,
    };

    const { validatedProperty, message } = stringPropertiesValidator(
      "skill",
      skill?.name,
      propertyConstraintsConfig.minStringLength,
      propertyConstraintsConfig.maxStringLength,
    );

    if (message) {
      currentError.name = message;
    }

    const normalized = skill?.name?.trim().toLowerCase();
    if (seen.has(normalized)) {
      currentError.name = `${skill.name} is already added!`;
    } else {
      seen.add(normalized);
    }

    if (!allowedSkillLevelsConfig.includes(skill?.level)) {
      currentError.level = "Invalid skill level!";
    }

    if (currentError.name || currentError.level) {
      skillErrors.push(currentError);
    }

    skill.name = validatedProperty ?? skill.name;
  });

  if (skillErrors.length > 0) {
    errors.skills = "Some skills are invalid!";

    return {
      success: false,
      status: "VALIDATION FAILED",
      code: "PROFILE UPDATE FAILED",
      statusCode: 422,
      message: errors.skills,
      details: { errors: skillErrors },
      timestamp: new Date().toISOString(),
      metadata: null,
      errors,
      inputs: Object.fromEntries(formData),
    };
  }

  try {
    const response = await api.post(
      apiUrls.profile.updateSkills,
      { skills },
      { requireAuth: true },
    );

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      status: error?.status ?? "VALIDATION FAILED",
      code: error?.code ?? "PROFILE UPDATE FAILED",
      statusCode: error?.statusCode ?? 500,
      message: error?.message ?? "Unable to update profile, please try again!",
      details: error?.details ?? null,
      timestamp: new Date().toISOString(),
      metadata: error?.metadata ?? null,
      inputs: Object.fromEntries(formData),
    };
  }
};

export const updateExperience = async (
  prevState: FormStateType,
  formData: FormData,
): Promise<FormStateType> => {
  const experiencesRaw = formData.get("experiences");

  let experiences: ExperienceType[] = [];

  try {
    experiences = JSON.parse(experiencesRaw as string);
  } catch {
    experiences = [];
  }

  const errors: FormStateType["errors"] = {};
  const experienceErrors: SectionErrorsType<ExperienceType>[] = [];

  let foundCurrent = false;

  experiences.forEach((exp, index) => {
    const currentError: SectionErrorsType<ExperienceType> = {};

    const companyValidation = stringPropertiesValidator(
      "company",
      exp?.company,
      propertyConstraintsConfig.minStringLength,
      propertyConstraintsConfig.maxStringLength,
    );

    if (companyValidation.message) {
      currentError.company = companyValidation.message;
    }

    const roleValidation = stringPropertiesValidator(
      "role",
      exp?.role,
      propertyConstraintsConfig.minStringLength,
      propertyConstraintsConfig.maxStringLength,
    );

    if (roleValidation.message) {
      currentError.role = roleValidation.message;
    }

    const startDateValidation = datePropertyValidator(
      "start date",
      exp.startDate || "",
    );

    if (startDateValidation.message) {
      currentError.startDate = startDateValidation.message;
    }

    if (!exp?.isCurrent) {
      const endDateValidation = datePropertyValidator(
        "end date",
        exp?.endDate || "",
      );

      if (endDateValidation.message) {
        currentError.endDate = endDateValidation.message;
      }
    }

    if (exp?.isCurrent) {
      if (foundCurrent) {
        exp.isCurrent = false;
      }
      foundCurrent = true;
    }

    if (exp?.description) {
      const descValidation = stringPropertiesValidator(
        "description",
        exp.description,
        propertyConstraintsConfig.minStringLength,
        propertyConstraintsConfig.maxStringLength,
      );

      if (descValidation.message) {
        currentError.description = descValidation.message;
      }
    }

    if (Object.keys(currentError).length > 0) {
      experienceErrors[index] = currentError;
    }

    exp.company = companyValidation.validatedProperty ?? exp.company;
    exp.role = roleValidation.validatedProperty ?? exp.role;
    exp.description = exp.description?.trim() ?? "";
  });

  if (experienceErrors.some(Boolean)) {
    errors.experiences = experienceErrors;

    return {
      success: false,
      status: "VALIDATION FAILED",
      code: "PROFILE UPDATE FAILED",
      statusCode: 422,
      message: "Some experiences are invalid!",
      details: { errors: experienceErrors },
      timestamp: new Date().toISOString(),
      metadata: null,
      errors,
      inputs: Object.fromEntries(formData),
    };
  }

  try {
    const response = await api.post(
      apiUrls.profile.updateExperience,
      {
        action: "replace",
        experiences,
      },
      { requireAuth: true },
    );

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      status: error?.status ?? "EXPERIENCE UPDATE FAILED",
      code: error?.code ?? "PROFILE UPDATE FAILED",
      statusCode: error?.statusCode ?? 500,
      message:
        error?.message ?? "Unable to update experience, please try again!",
      details: error?.details ?? null,
      timestamp: new Date().toISOString(),
      metadata: error?.metadata ?? null,
      inputs: Object.fromEntries(formData),
    };
  }
};
