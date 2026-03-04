import {
  ALLOWED_SPECIAL_CHARACTERS_REGEX,
  EMAIL_REGEX,
  ERROR_MESSAGES,
  LOWER_CASE_REGEX,
  NAME_REGEX,
  NUMBER_REGEX,
  USER_PROPERTY_CONSTRAINTS,
  UPPER_CASE_REGEX,
  USER_NAME_REGEX,
  USER_PROPERTIES,
  ADDRESS_PROPERTIES,
  COUNTRY_CODE_REGEX,
  PIN_CODE_REGEX,
} from "@/config/constants";
import { sanitizeList } from "../utils/utils";
import { allowedUpdateProfileProperties } from "@/config/config";
import { ProfileUpdateFormStateType } from "@/types/types";

export const userNameValidator = (user_name: string) => {
  const userNameErrors: string[] = [];
  const value = user_name?.trim().toLowerCase();

  if (!value) {
    userNameErrors.push(ERROR_MESSAGES.userNameRequiredError);
  }

  if (value.length < USER_PROPERTY_CONSTRAINTS.minUserNameLength) {
    userNameErrors.push(ERROR_MESSAGES.userNameMinLengthError);
  }

  if (value.length > USER_PROPERTY_CONSTRAINTS.maxUserNameLength) {
    userNameErrors.push(ERROR_MESSAGES.userNameMaxLengthError);
  }

  if (!USER_NAME_REGEX.test(value)) {
    userNameErrors.push(ERROR_MESSAGES.invalidUserNameError);
  }

  if (userNameErrors && userNameErrors?.length > 0) {
    return { userNameErrors };
  }

  return { validatedUserName: value };
};

export const emailValidator = (email: string) => {
  const emailErrors: string[] = [];
  const value = email?.trim().toLowerCase();

  if (!value) {
    emailErrors.push(ERROR_MESSAGES.emailRequiredError);
  }

  if (!EMAIL_REGEX.test(value)) {
    emailErrors.push(ERROR_MESSAGES.invalidEmailError);
  }

  if (emailErrors && emailErrors?.length > 0) {
    return { emailErrors };
  }

  return { validatedEmail: value };
};

export const passwordValidator = (password: string) => {
  const passwordErrors: string[] = [];
  const value = password?.trim();

  if (!value) {
    passwordErrors.push(ERROR_MESSAGES.passwordRequiredError);
  }

  if (value.length < USER_PROPERTY_CONSTRAINTS.minPasswordLength) {
    passwordErrors.push(ERROR_MESSAGES.passwordMinLengthError);
  }

  if (value.length > USER_PROPERTY_CONSTRAINTS.maxPasswordLength) {
    passwordErrors.push(ERROR_MESSAGES.passwordMaxLengthError);
  }

  if (!UPPER_CASE_REGEX.test(value)) {
    passwordErrors.push(ERROR_MESSAGES.passwordUppercaseError);
  }

  if (!LOWER_CASE_REGEX.test(value)) {
    passwordErrors.push(ERROR_MESSAGES.passwordLowercaseError);
  }

  if (!NUMBER_REGEX.test(value)) {
    passwordErrors.push(ERROR_MESSAGES.passwordNumberError);
  }

  if (!ALLOWED_SPECIAL_CHARACTERS_REGEX.test(value)) {
    passwordErrors.push(ERROR_MESSAGES.passwordSpecialCharactersError);
  }

  if (passwordErrors && passwordErrors?.length > 0) {
    return { passwordErrors };
  }

  return { validatedPassword: value };
};

export const firstNameValidator = (firstName: string) => {
  const firstNameErrors: string[] = [];
  const value = firstName?.trim().toLowerCase();

  if (!value) {
    firstNameErrors.push(ERROR_MESSAGES.firstNameRequiredError);
  }

  const { validatedName, nameErrors } = nameValidator(
    value,
    USER_PROPERTIES.firstName,
  );

  if (nameErrors && nameErrors?.length > 0) {
    return { firstNameErrors: [...firstNameErrors, ...nameErrors] };
  }

  return { validatedFirstName: validatedName };
};

export const nameValidator = (name: string, type: string) => {
  if (!name) return { validatedName: name === "" ? null : name };

  const nameErrors: string[] = [];
  const nameValue = name.trim().toLowerCase();

  if (nameValue.length < USER_PROPERTY_CONSTRAINTS.minNameLength) {
    if (type === USER_PROPERTIES.firstName) {
      nameErrors.push(ERROR_MESSAGES.firstNameMinLengthError);
    } else if (type === USER_PROPERTIES.middleName) {
      nameErrors.push(ERROR_MESSAGES.middleNameMinLengthError);
    } else if (type === USER_PROPERTIES.lastName) {
      nameErrors.push(ERROR_MESSAGES.lastNameMinLengthError);
    } else {
      nameErrors.push(ERROR_MESSAGES.nickNameMinLengthError);
    }
  }

  if (nameValue.length > USER_PROPERTY_CONSTRAINTS.maxNameLength) {
    if (type === USER_PROPERTIES.firstName) {
      nameErrors.push(ERROR_MESSAGES.firstNameMaxLengthError);
    } else if (type === USER_PROPERTIES.middleName) {
      nameErrors.push(ERROR_MESSAGES.middleNameMaxLengthError);
    } else if (type === USER_PROPERTIES.lastName) {
      nameErrors.push(ERROR_MESSAGES.lastNameMaxLengthError);
    } else {
      nameErrors.push(ERROR_MESSAGES.nickNameMaxLengthError);
    }
  }

  if (!NAME_REGEX.test(nameValue)) {
    if (type === USER_PROPERTIES.firstName) {
      nameErrors.push(ERROR_MESSAGES.invalidFirstNameError);
    } else if (type === USER_PROPERTIES.middleName) {
      nameErrors.push(ERROR_MESSAGES.invalidMiddleNameError);
    } else if (type === USER_PROPERTIES.lastName) {
      nameErrors.push(ERROR_MESSAGES.invalidLastNameError);
    } else {
      nameErrors.push(ERROR_MESSAGES.invalidNickNameError);
    }
  }

  if (nameErrors && nameErrors?.length > 0) {
    return { nameErrors };
  }

  return { validatedName: nameValue };
};

export const nameFieldValidator = (
  value: string,
  fieldKey: keyof typeof allowedUpdateProfileProperties,
  errors: ProfileUpdateFormStateType["errors"],
) => {
  const { validatedName, nameErrors } = nameValidator(
    value,
    allowedUpdateProfileProperties[fieldKey],
  );
  errors[fieldKey] = [...(nameErrors ?? [])];
  return validatedName;
};

export const allowedStringValidator = (
  property: string,
  ALLOWED_PROPERTIES: string[],
  errors: {
    invalidError: string;
  },
) => {
  if (!property) return { validatedProperty: property };

  const propertyErrors: string[] = [];
  const propertyValue = property?.trim()?.toLowerCase();

  let validatedProperty;

  Object.values(ALLOWED_PROPERTIES).forEach((value) => {
    if (value === propertyValue) {
      validatedProperty = propertyValue;
    }
  });

  if (!validatedProperty) {
    propertyErrors.push(errors.invalidError);
  }

  if (propertyErrors && propertyErrors?.length > 0) {
    return { propertyErrors };
  }

  return { validatedProperty };
};

export const numberPropertiesValidator = (
  property: string | number,
  minValue: number,
  maxValue: number,
  errors: {
    invalidError: string;
    decimalError: string;
    minLengthError: string;
    maxLengthError: string;
  },
) => {
  if (!property) return { validatedProperty: property };

  const propertyErrors: string[] = [];
  const value =
    typeof property === "string" ? property?.trim().toLowerCase() : property;

  const isPropertyValid =
    (typeof value === "number" || typeof value === "string") &&
    !isNaN(Number(value)) &&
    value !== "";

  if (!isPropertyValid) {
    propertyErrors.push(errors.invalidError);
  }

  if (!Number.isInteger(Number(value))) {
    propertyErrors.push(errors.decimalError);
  }

  if (Number(value) < minValue) {
    propertyErrors.push(errors.minLengthError);
  }

  if (Number(value) > maxValue) {
    propertyErrors.push(errors.maxLengthError);
  }

  if (propertyErrors && propertyErrors?.length > 0) {
    return { propertyErrors };
  }

  return {
    validatedProperty: Number(value),
  };
};

export const stringPropertiesValidator = (
  property: string,
  minLength: number,
  maxLength: number,
  errors: {
    invalidError: string;
    minLengthError: string;
    maxLengthError: string;
  },
) => {
  if (!property) return { validatedProperty: property };

  const propertyErrors: string[] = [];

  if (typeof property !== "string") {
    propertyErrors.push(errors.invalidError);
  }

  if (property?.trim().length < minLength) {
    propertyErrors.push(errors.minLengthError);
  }

  if (property?.trim().length > maxLength) {
    propertyErrors.push(errors.maxLengthError);
  }

  if (propertyErrors && propertyErrors?.length > 0) {
    return { propertyErrors };
  }

  return {
    validatedProperty: property?.trim(),
  };
};

export const stringFieldValidator = (
  value: string,
  fieldKey: keyof ProfileUpdateFormStateType["errors"],
  errorMessages: {
    invalidError: string;
    minLengthError: string;
    maxLengthError: string;
  },
  errors: ProfileUpdateFormStateType["errors"],
) => {
  const { validatedProperty, propertyErrors } = stringPropertiesValidator(
    value,
    USER_PROPERTY_CONSTRAINTS.minStringLength,
    USER_PROPERTY_CONSTRAINTS.maxStringLength,
    errorMessages,
  );
  errors[fieldKey] = propertyErrors ?? [];
  return validatedProperty;
};

export const regexPropertiesValidator = (
  property: string | number,
  regex: RegExp,
  error: string,
) => {
  if (!property) return { validatedProperty: property };

  const value =
    typeof property === "string" ? property?.trim().toLowerCase() : property;

  if (!regex.test(String(value))) {
    return {
      propertyErrors: [error],
    };
  }

  return {
    validatedProperty: value,
  };
};

export const numberRegexPropertiesValidator = (
  property: string | number,
  regex: RegExp,
  error: string,
) => {
  if (!property) return { validatedProperty: property };

  const value =
    typeof property === "string" ? property?.trim().toLowerCase() : property;

  if (!regex.test(String(value)) || isNaN(Number(value))) {
    return {
      propertyErrors: [error],
    };
  }

  return {
    validatedProperty: Number(value),
  };
};

export const regexFieldValidator = (
  value: string,
  regex: RegExp,
  errorMessage: string,
  fieldKey: keyof ProfileUpdateFormStateType["errors"],
  errors: ProfileUpdateFormStateType["errors"],
) => {
  const { validatedProperty, propertyErrors } = regexPropertiesValidator(
    value,
    regex,
    errorMessage,
  );
  errors[fieldKey] = propertyErrors ?? [];
  return validatedProperty;
};

export const listPropertiesValidator = (
  property: string | string[] | null,
  error: string,
) => {
  if (!property) return { validatedProperty: property };

  const propertyErrors: string[] = [];

  if (typeof property !== "string" && !Array.isArray(property)) {
    propertyErrors.push(error);
  }

  if (propertyErrors && propertyErrors?.length > 0) {
    return { propertyErrors };
  }
  return {
    validatedProperty:
      Array.isArray(property) && sanitizeList(property).length > 0
        ? property.map((s) => s.trim().toLowerCase())
        : typeof property === "string" && property !== ""
          ? [property?.trim().toLowerCase()]
          : [],
  };
};

export const addressValidator = (address: Record<string, any> | null) => {
  if (!address) return { validatedAddress: address };

  const addressErrors: string[] = [];

  if (
    typeof address !== "object" ||
    address === null ||
    Array.isArray(address)
  ) {
    addressErrors.push(ERROR_MESSAGES.invalidAddressError);
    return { addressErrors };
  }

  const validatedAddress: Record<string, any> = {};

  for (let addressField in address) {
    switch (addressField) {
      case ADDRESS_PROPERTIES.street:
        const {
          propertyErrors: streetErrors,
          validatedProperty: validatedStreet,
        } = stringPropertiesValidator(
          address[addressField],
          USER_PROPERTY_CONSTRAINTS.minStringLength,
          USER_PROPERTY_CONSTRAINTS.maxStringLength,
          {
            invalidError: ERROR_MESSAGES.invalidStreetError,
            minLengthError: ERROR_MESSAGES.streetMinLengthError,
            maxLengthError: ERROR_MESSAGES.streetMaxLengthError,
          },
        );

        if (streetErrors && streetErrors?.length > 0) {
          addressErrors.push(...streetErrors);
        } else {
          validatedAddress[addressField] = validatedStreet;
        }
        break;

      case ADDRESS_PROPERTIES.landmark:
        const {
          propertyErrors: landmarkErrors,
          validatedProperty: validatedLandmark,
        } = stringPropertiesValidator(
          address[addressField],
          USER_PROPERTY_CONSTRAINTS.minStringLength,
          USER_PROPERTY_CONSTRAINTS.maxStringLength,
          {
            invalidError: ERROR_MESSAGES.invalidLandmarkError,
            minLengthError: ERROR_MESSAGES.landmarkMinLengthError,
            maxLengthError: ERROR_MESSAGES.landmarkMaxLengthError,
          },
        );

        if (landmarkErrors && landmarkErrors?.length > 0) {
          addressErrors.push(...landmarkErrors);
        } else {
          validatedAddress[addressField] = validatedLandmark;
        }
        break;

      case ADDRESS_PROPERTIES.city:
        const { propertyErrors: cityErrors, validatedProperty: validatedCity } =
          stringPropertiesValidator(
            address[addressField],
            USER_PROPERTY_CONSTRAINTS.minStringLength,
            USER_PROPERTY_CONSTRAINTS.maxStringLength,
            {
              invalidError: ERROR_MESSAGES.invalidCityError,
              minLengthError: ERROR_MESSAGES.cityMinLengthError,
              maxLengthError: ERROR_MESSAGES.cityMaxLengthError,
            },
          );

        if (cityErrors && cityErrors?.length > 0) {
          addressErrors.push(...cityErrors);
        } else {
          validatedAddress[addressField] = validatedCity;
        }
        break;

      case ADDRESS_PROPERTIES.state:
        const {
          propertyErrors: stateErrors,
          validatedProperty: validatedState,
        } = stringPropertiesValidator(
          address[addressField],
          USER_PROPERTY_CONSTRAINTS.minStringLength,
          USER_PROPERTY_CONSTRAINTS.maxStringLength,
          {
            invalidError: ERROR_MESSAGES.invalidStateError,
            minLengthError: ERROR_MESSAGES.stateMinLengthError,
            maxLengthError: ERROR_MESSAGES.stateMaxLengthError,
          },
        );

        if (stateErrors && stateErrors?.length > 0) {
          addressErrors.push(...stateErrors);
        } else {
          validatedAddress[addressField] = validatedState;
        }
        break;

      case ADDRESS_PROPERTIES.countryCode:
        const {
          propertyErrors: countryCodeErrors,
          validatedProperty: validatedCountryCode,
        } = numberRegexPropertiesValidator(
          address[addressField],
          COUNTRY_CODE_REGEX,
          ERROR_MESSAGES.invalidCountryCodeError,
        );

        if (countryCodeErrors && countryCodeErrors?.length > 0) {
          addressErrors.push(...countryCodeErrors);
        } else {
          validatedAddress[addressField] = validatedCountryCode;
        }
        break;

      case ADDRESS_PROPERTIES.country:
        const {
          propertyErrors: countryErrors,
          validatedProperty: validatedCountry,
        } = stringPropertiesValidator(
          address[addressField],
          USER_PROPERTY_CONSTRAINTS.minStringLength,
          USER_PROPERTY_CONSTRAINTS.maxStringLength,
          {
            invalidError: ERROR_MESSAGES.invalidCountryError,
            minLengthError: ERROR_MESSAGES.countryMinLengthError,
            maxLengthError: ERROR_MESSAGES.countryMaxLengthError,
          },
        );

        if (countryErrors && countryErrors?.length > 0) {
          addressErrors.push(...countryErrors);
        } else {
          validatedAddress[addressField] = validatedCountry;
        }
        break;

      case ADDRESS_PROPERTIES.pinCode:
        const {
          propertyErrors: pinCodeErrors,
          validatedProperty: validatedPinCode,
        } = numberRegexPropertiesValidator(
          address[addressField],
          PIN_CODE_REGEX,
          ERROR_MESSAGES.invalidPinCodeError,
        );

        if (pinCodeErrors && pinCodeErrors?.length > 0) {
          addressErrors.push(...pinCodeErrors);
        } else {
          validatedAddress[addressField] = validatedPinCode;
        }
        break;
    }
  }

  if (addressErrors && addressErrors?.length > 0) {
    return { addressErrors };
  }

  return { validatedAddress };
};
