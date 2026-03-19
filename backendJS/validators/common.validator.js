import { sanitizeList } from "../utils/common.utils.js";

export const regexPropertiesValidator = (property, regex) => {
  if (!property || property === null || property === "") {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  if (typeof property !== "string") {
    return {
      isPropertyValid: false,
      message: `${platform} must be a string URL!`,
    };
  }

  incomingProperty = property.trim();

  if (!regex.test(incomingProperty)) {
    return {
      isPropertyValid: false,
      message: `Invalid ${incomingProperty} URL!`,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: incomingProperty,
  };
};

export const numberRegexPropertiesValidator = (property, regex, error) => {
  if (!property) {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  property = typeof property === "string" ? property?.trim() : property;

  if (!regex.test(property) || isNaN(Number(property))) {
    return {
      isPropertyValid: false,
      message: error,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: property,
  };
};

export const numberPropertiesValidator = (
  property,
  minValue,
  maxValue,
  errors,
) => {
  if (!property && property !== 0 && property !== "0") {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  property =
    typeof property === "string" ? property?.trim().toLowerCase() : property;

  const isPropertyValid =
    (typeof property === "number" || typeof property === "string") &&
    !isNaN(property);

  if (!isPropertyValid) {
    return {
      isPropertyValid: false,
      message: errors.INVALID_ERROR,
    };
  }

  if (!Number.isInteger(Number(property))) {
    return {
      isPropertyValid: false,
      message: errors.DECIMAL_ERROR,
    };
  }

  if (Number(property) < minValue) {
    return {
      isPropertyValid: false,
      message: errors.MIN_LENGTH_ERROR,
    };
  }

  if (Number(property) > maxValue) {
    return {
      isPropertyValid: false,
      message: errors.MAX_LENGTH_ERROR,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: Number(property),
  };
};

export const stringPropertiesValidator = (
  property,
  minLength,
  maxLength,
  errors,
) => {
  if (!property) {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  const trimmedProperty =
    typeof property === "string" ? property?.trim().toLowerCase() : property;

  if (typeof property !== "string") {
    return {
      isPropertyValid: false,
      message: errors.INVALID_ERROR,
    };
  }

  if (trimmedProperty.length < minLength) {
    return {
      isPropertyValid: false,
      message: errors.MIN_LENGTH_ERROR,
    };
  }

  if (trimmedProperty.length > maxLength) {
    return {
      isPropertyValid: false,
      message: errors.MAX_LENGTH_ERROR,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty: trimmedProperty,
  };
};

export const listPropertiesValidator = (property, error) => {
  if (!property) {
    return {
      isPropertyValid: true,
      validatedProperty: null,
    };
  }

  if (typeof property !== "string" && !Array.isArray(property)) {
    return {
      isPropertyValid: false,
      message: error,
    };
  }

  return {
    isPropertyValid: true,
    validatedProperty:
      Array.isArray(property) && sanitizeList(property).length > 0
        ? property.map((s) => s.trim().toLowerCase())
        : typeof property === "string"
          ? [property?.trim().toLowerCase()]
          : [],
  };
};
