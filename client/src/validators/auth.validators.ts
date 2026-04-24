import { propertyConstraintsConfig } from "@/config/profile.config";
import {
  ALLOWED_SPECIAL_CHARACTERS_REGEX,
  EMAIL_REGEX,
  LOWER_CASE_REGEX,
  NAME_REGEX,
  NUMBER_REGEX,
  UPPER_CASE_REGEX,
  USERNAME_REGEX,
} from "@/constants/regex.constants";
import {
  EmailValidatorResultType,
  NameValidatorResultType,
  PasswordValidatorResultType,
  UserNameValidatorResultType,
} from "@/types/types/auth.types";
import { toTitleCase } from "@/utils/common.utils";

export const validateLoginIdentifier = (val: string): string => {
  if (!val) return "Please provide email or username to login!";

  const { message: emailError } = emailValidator(val);

  const { message: userNameError } = userNameValidator(val);

  if (!emailError || !userNameError) return "";

  return "Please provide email or username to login!";
};

export const userNameValidator = (
  userName: unknown,
): UserNameValidatorResultType => {
  if (!userName) {
    return { isUserNameValid: false, message: "Please provide your userName!" };
  }

  if (typeof userName !== "string") {
    return { isUserNameValid: false, message: "Username must be a string!" };
  }

  const incomingUserName = userName.trim().toLowerCase();

  if (incomingUserName.length < propertyConstraintsConfig.minUserNameLength) {
    return {
      isUserNameValid: false,
      message: `Username must be at least ${propertyConstraintsConfig.minUserNameLength} character long!`,
    };
  }

  if (incomingUserName.length > propertyConstraintsConfig.maxUserNameLength) {
    return {
      isUserNameValid: false,
      message: `User name must not be longer than ${propertyConstraintsConfig.maxUserNameLength} characters!`,
    };
  }

  if (!USERNAME_REGEX.test(incomingUserName)) {
    return {
      isUserNameValid: false,
      message:
        "Username must only contain alphabets (a-z or A-Z) and special characters (!,@,#,$,%,&,_)!",
    };
  }

  return { isUserNameValid: true, validatedUserName: incomingUserName };
};

export const nameValidator = (
  name: unknown,
  type: string,
): NameValidatorResultType => {
  if (!name) return { isNameValid: true, validatedName: null };

  if (typeof name !== "string") {
    return {
      isNameValid: false,
      message:
        type === "firstName"
          ? `First name must be a string!`
          : type === "lastName"
            ? `Last name must be a string!`
            : `Nick name must be a string!`,
    };
  }

  const trimmedName = name.trim().toLowerCase();

  if (trimmedName.length < propertyConstraintsConfig.minNameLength) {
    return {
      isNameValid: false,
      message: `${type === "firstName" ? "First name" : type === "lastName" ? "Last name" : "Nick name"} must be at least ${propertyConstraintsConfig.minNameLength} character long!`,
    };
  }

  if (trimmedName.length > propertyConstraintsConfig.maxNameLength) {
    return {
      isNameValid: false,
      message: `${type === "firstName" ? "First name" : type === "lastName" ? "Last name" : "Nick name"} must not be longer than ${propertyConstraintsConfig.maxNameLength} characters!`,
    };
  }

  if (!NAME_REGEX.test(trimmedName)) {
    return {
      isNameValid: false,
      message: `${type === "firstName" ? "First name" : type === "lastName" ? "Last name" : "Nick name"} must only contain alphabets (a-z or A-Z)!`,
    };
  }

  return { isNameValid: true, validatedName: trimmedName };
};

export const emailValidator = (email: unknown): EmailValidatorResultType => {
  if (!email) {
    return { isEmailValid: false, message: "Please provide your email!" };
  }

  if (typeof email !== "string") {
    return { isEmailValid: false, message: "Email must be a string!" };
  }

  const incomingEmail = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(incomingEmail)) {
    return {
      isEmailValid: false,
      message: "Please provide a valid emai addressl",
    };
  }

  return { isEmailValid: true, validatedEmail: incomingEmail };
};

export const passwordValidator = (
  password: unknown,
  type: string = "",
): PasswordValidatorResultType => {
  if (!password) {
    return {
      isPasswordValid: false,
      message:
        type === ""
          ? "Please provide your password!"
          : `Please provide your ${type} password!`,
    };
  }

  if (typeof password !== "string") {
    return {
      isPasswordValid: false,
      message: "Password must be a string!",
    };
  }

  const incomingPassword = password.trim();

  if (!incomingPassword) {
    return {
      isPasswordValid: false,
      message:
        type === ""
          ? "Please provide your password!"
          : `Please provide your ${type} password!`,
    };
  }

  if (incomingPassword.length < propertyConstraintsConfig.minPasswordLength) {
    return {
      isPasswordValid: false,
      message:
        type === ""
          ? `Password must be at least ${propertyConstraintsConfig.minPasswordLength} characters long!`
          : `${toTitleCase(type)} must be at least ${propertyConstraintsConfig.minPasswordLength} characters long!`,
    };
  }

  if (incomingPassword.length > propertyConstraintsConfig.maxPasswordLength) {
    return {
      isPasswordValid: false,
      message:
        type === ""
          ? `Password must not be more than ${propertyConstraintsConfig.maxPasswordLength} characters long!`
          : `${toTitleCase(type)} password must not be more than ${propertyConstraintsConfig.maxPasswordLength} characters long!`,
    };
  }

  if (
    !UPPER_CASE_REGEX.test(incomingPassword) ||
    !LOWER_CASE_REGEX.test(incomingPassword) ||
    !NUMBER_REGEX.test(incomingPassword) ||
    !ALLOWED_SPECIAL_CHARACTERS_REGEX.test(incomingPassword)
  ) {
    return {
      isPasswordValid: false,
      message:
        type === ""
          ? "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (!,@,#,$,%,&,_)!"
          : `${toTitleCase(type)}  password must contain at least one uppercase letter, one lowercase letter, one number and one special character (!,@,#,$,%,&,_)!`,
    };
  }

  return {
    isPasswordValid: true,
    validatedPassword: incomingPassword,
  };
};
