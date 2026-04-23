import { toTitleCase } from "@/utils/common.utils";

type ValidatorResult<T> = {
  isPropertyValid: boolean;
  message?: string;
  validatedProperty?: T | null;
};

export const numberPropertiesValidator = ({
  propertyName,
  propertyValue,
  minValue,
  maxValue,
}: {
  propertyName: string;
  propertyValue: any;
  minValue: number;
  maxValue: number;
}): ValidatorResult<number> => {
  if (!propertyValue && propertyValue !== 0 && propertyValue !== "0") {
    return { isPropertyValid: true, validatedProperty: null };
  }

  propertyName = toTitleCase(propertyName);

  propertyValue =
    typeof propertyValue === "string"
      ? propertyValue.trim().toLowerCase()
      : propertyValue;

  const isPropertyValid =
    (typeof propertyValue === "number" || typeof propertyValue === "string") &&
    !isNaN(Number(propertyValue));

  if (!isPropertyValid) {
    return { isPropertyValid: false, message: `${propertyName} is invalid!` };
  }

  if (Number(propertyValue) < minValue) {
    return {
      isPropertyValid: false,
      message: `${propertyName} must be more than ${minValue}!`,
    };
  }

  if (Number(propertyValue) > maxValue) {
    return {
      isPropertyValid: false,
      message: `${propertyName} must be less than ${maxValue}!`,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: Number(propertyValue),
  };
};

export const numberRegexPropertiesValidator = (
  propertyName: string,
  propertyValue: any,
  regex: RegExp,
): ValidatorResult<string> => {
  if (!propertyValue) {
    return { isPropertyValid: true, validatedProperty: null };
  }

  propertyValue =
    typeof propertyValue === "string" ? propertyValue.trim() : propertyValue;

  if (!regex.test(propertyValue) || isNaN(Number(propertyValue))) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} is invalid!`,
    };
  }

  return { isPropertyValid: true, validatedProperty: propertyValue };
};

export const regexPropertiesValidator = (
  propertyName: string,
  propertyValue: any,
  regex: RegExp,
): ValidatorResult<string> => {
  if (!propertyValue) {
    return { isPropertyValid: true, validatedProperty: null };
  }

  propertyValue =
    typeof propertyValue === "string"
      ? propertyValue.trim().toLowerCase()
      : propertyValue;

  if (!regex.test(propertyValue)) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} is invalid!`,
    };
  }

  return { isPropertyValid: true, validatedProperty: propertyValue };
};

export const stringPropertiesValidator = (
  propertyName: string,
  propertyValue: any,
  minLength: number,
  maxLength: number,
): ValidatorResult<string> => {
  if (!propertyValue) {
    return { isPropertyValid: true, validatedProperty: null };
  }

  if (typeof propertyValue !== "string") {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} is invalid!`,
    };
  }

  const trimmedProperty = propertyValue.trim().toLowerCase();

  if (/^\d+(\.\d+)?$/.test(trimmedProperty)) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} must be a valid text, not a number!`,
    };
  }

  if (/^(true|false)$/i.test(trimmedProperty)) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} must be a valid text, not boolean!`,
    };
  }

  if (/^[\[{].*[\]}]$/.test(trimmedProperty)) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} must be plain text, not an object!`,
    };
  }

  if (/^function\s*\(|^\(\)\s*=>/.test(trimmedProperty)) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} must not be a function!`,
    };
  }

  if (trimmedProperty.length < minLength) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} must be at least ${minLength} characters long!`,
    };
  }

  if (trimmedProperty.length > maxLength) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} must not less than ${maxLength} characters long!`,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: trimmedProperty,
  };
};

export const listPropertiesValidator = (
  propertyName: string,
  propertyValue: any,
): ValidatorResult<string[]> => {
  if (!propertyValue) {
    return { isPropertyValid: true, validatedProperty: null };
  }

  if (typeof propertyValue !== "string" && !Array.isArray(propertyValue)) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} must be a list of strings!`,
    };
  }

  if (typeof propertyValue === "string") {
    propertyValue = [propertyValue.trim().toLowerCase()];
  }

  if (Array.isArray(propertyValue)) {
    propertyValue = propertyValue
      .filter((value) => typeof value === "string")
      .map((value) => value.trim().toLowerCase());

    if (propertyValue.length < 1) {
      return {
        isPropertyValid: false,
        message: `${toTitleCase(propertyName)} must be a list of strings!`,
      };
    }
  }

  return { isPropertyValid: true, validatedProperty: propertyValue };
};
