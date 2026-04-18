import { DATE_REGEX } from "../constants/regex.constants.js";
import { toTitleCase } from "../utils/common.utils.js";

export const numberPropertiesValidator = ({
  propertyName,
  propertyValue,
  minValue,
  maxValue,
}) => {
  if (!propertyValue && propertyValue !== 0 && propertyValue !== "0") {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  propertyName = toTitleCase(propertyName);

  propertyValue =
    typeof propertyValue === "string"
      ? propertyValue?.trim().toLowerCase()
      : propertyValue;

  const isPropertyValid =
    (typeof propertyValue === "number" || typeof propertyValue === "string") &&
    !isNaN(propertyValue);

  if (!isPropertyValid) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} is invalid!`,
    };
  }

  if (Number(propertyValue) < minValue) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} must be more than ${minValue}!`,
    };
  }

  if (Number(propertyValue) > maxValue) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} must be less than ${maxValue}!`,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: Number(propertyValue),
  };
};

export const numberRegexPropertiesValidator = (
  propertyName,
  propertyValue,
  regex,
) => {
  if (!propertyValue) {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  propertyValue =
    typeof propertyValue === "string" ? propertyValue.trim() : propertyValue;

  if (!regex.test(propertyValue) || isNaN(Number(propertyValue))) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} is invalid!`,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: propertyValue,
  };
};

export const regexPropertiesValidator = (
  propertyName,
  propertyValue,
  regex,
) => {
  if (!propertyValue) {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
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

  return {
    isPropertyValid: true,
    validatedProperty: propertyValue,
  };
};

export const stringPropertiesValidator = (
  propertyName,
  propertyValue,
  minLength,
  maxLength,
) => {
  if (!propertyValue) {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  if (typeof propertyValue !== "string") {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} is invalid!`,
    };
  }

  const trimmedProperty = propertyValue.trim();

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

  const normalized = trimmedProperty.toLowerCase();

  if (normalized.length < minLength) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} must be at least ${minLength} characters long!`,
    };
  }

  if (normalized.length > maxLength) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} must not exceed ${maxLength} characters!`,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: normalized,
  };
};

export const listPropertiesValidator = (propertyName, propertyValue) => {
  if (!propertyValue) {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  if (typeof propertyValue !== "string" && !Array.isArray(propertyValue)) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} is must be a list of strings!`,
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

  return {
    isPropertyValid: true,
    validatedProperty: propertyValue,
  };
};

export const datePropertyValidator = (
  propertyName,
  propertyValue,
  options = { noFuture: true, minDate: "1900-01-01" },
) => {
  if (!propertyValue) {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  if (typeof propertyValue !== "string") {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} must be a string date!`,
    };
  }

  if (!DATE_REGEX.test(propertyValue)) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} must be in YYYY-MM-DD format!`,
    };
  }

  const date = new Date(propertyValue);

  if (isNaN(date.getTime())) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} is not a valid date!`,
    };
  }

  const [year, month, day] = propertyValue.split("-").map(Number);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} is not a real calendar date!`,
    };
  }

  const now = new Date();

  if (options?.noFuture && date > now) {
    return {
      isPropertyValid: false,
      message: `${toTitleCase(propertyName)} cannot be a future date!`,
    };
  }

  if (options?.minDate) {
    const min = new Date(options.minDate);
    if (date < min) {
      return {
        isPropertyValid: false,
        message: `${toTitleCase(propertyName)} cannot be before ${options.minDate}!`,
      };
    }
  }

  if (options?.maxDate) {
    const max = new Date(options.maxDate);
    if (date > max) {
      return {
        isPropertyValid: false,
        message: `${toTitleCase(propertyName)} cannot be after ${options.maxDate}!`,
      };
    }
  }

  return {
    isPropertyValid: true,
    validatedProperty: propertyValue,
  };
};
