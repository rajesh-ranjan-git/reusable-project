import {
  addressTypeProperties,
  propertyConstraints,
} from "../config/common.config.js";
import { PIN_CODE_REGEX } from "../constants/regex.constants.js";
import {
  numberRegexPropertiesValidator,
  stringPropertiesValidator,
} from "./common.validator.js";

export const validateCreateAddress = (data) => {
  const { type, street, city, state, country, pinCode, isDefault } = data;

  const validatedAddressProperties = {};
  const errors = {};

  if (!type || !Object.values(addressTypeProperties).includes(type)) {
    errors["type"] = "Address type must be 'home', 'office' or 'other'!";
  } else {
    validatedAddressProperties["type"] = type;
  }

  const {
    isPropertyValid: isStreetValid,
    message: streetErrorMessage,
    validatedProperty: validatedStreet,
  } = stringPropertiesValidator(
    "street",
    street,
    propertyConstraints.minStringLength,
    propertyConstraints.maxStringLength,
  );

  if (!isStreetValid) {
    errors["street"] = streetErrorMessage;
  } else {
    validatedAddressProperties["street"] = validatedStreet;
  }

  const {
    isPropertyValid: isCityValid,
    message: cityErrorMessage,
    validatedProperty: validatedCity,
  } = stringPropertiesValidator(
    "city",
    city,
    propertyConstraints.minStringLength,
    propertyConstraints.maxStringLength,
  );

  if (!isCityValid) {
    errors["city"] = cityErrorMessage;
  } else {
    validatedAddressProperties["city"] = validatedCity;
  }

  const {
    isPropertyValid: isStateValid,
    message: stateErrorMessage,
    validatedProperty: validatedState,
  } = stringPropertiesValidator(
    "state",
    state,
    propertyConstraints.minStringLength,
    propertyConstraints.maxStringLength,
  );

  if (!isStateValid) {
    errors["state"] = stateErrorMessage;
  } else {
    validatedAddressProperties["state"] = validatedState;
  }

  const {
    isPropertyValid: isCountryValid,
    message: countryErrorMessage,
    validatedProperty: validatedCountry,
  } = stringPropertiesValidator(
    "country",
    country,
    propertyConstraints.minStringLength,
    propertyConstraints.maxStringLength,
  );

  if (!isCountryValid) {
    errors["country"] = countryErrorMessage;
  } else {
    validatedAddressProperties["country"] = validatedCountry;
  }

  const {
    isPropertyValid: isPinCodeValid,
    message: pinCodeErrorMessage,
    validatedProperty: validatedPinCode,
  } = numberRegexPropertiesValidator("pinCode", pinCode, PIN_CODE_REGEX);

  if (!isPinCodeValid) {
    errors["pinCode"] = pinCodeErrorMessage;
  } else {
    validatedAddressProperties["pinCode"] = validatedPinCode;
  }

  if (
    typeof isDefault !== "boolean" &&
    !(
      typeof isDefault === "string" &&
      (isDefault.trim().toLowerCase() === "true" ||
        isDefault.trim().toLowerCase() === "false")
    )
  ) {
    errors["isDefault"] = "Please provide a valid default address flag!";
  } else {
    validatedAddressProperties["isDefault"] =
      typeof isDefault === "string"
        ? isDefault.trim().toLowerCase() === "true"
        : isDefault;
  }

  return { validatedAddressProperties, errors };
};

export const validateUpdateAddress = (data) => {
  const { type, street, city, state, country, pinCode, isDefault } = data;

  const validatedAddressProperties = {};
  const errors = {};

  if (type && !Object.values(addressTypeProperties).includes(type)) {
    errors["type"] = "Address type must be 'home', 'office' or 'other'!";
  } else if (type) {
    validatedAddressProperties["type"] = type;
  }

  const {
    isPropertyValid: isStreetValid,
    message: streetErrorMessage,
    validatedProperty: validatedStreet,
  } = stringPropertiesValidator(
    "street",
    street,
    propertyConstraints.minStringLength,
    propertyConstraints.maxStringLength,
  );

  if (!isStreetValid) {
    errors["street"] = streetErrorMessage;
  } else if (isStreetValid && validatedStreet) {
    validatedAddressProperties["street"] = validatedStreet;
  }

  const {
    isPropertyValid: isCityValid,
    message: cityErrorMessage,
    validatedProperty: validatedCity,
  } = stringPropertiesValidator(
    "city",
    city,
    propertyConstraints.minStringLength,
    propertyConstraints.maxStringLength,
  );

  if (!isCityValid) {
    errors["city"] = cityErrorMessage;
  } else if (isCityValid && validatedCity) {
    validatedAddressProperties["city"] = validatedCity;
  }

  const {
    isPropertyValid: isStateValid,
    message: stateErrorMessage,
    validatedProperty: validatedState,
  } = stringPropertiesValidator(
    "state",
    state,
    propertyConstraints.minStringLength,
    propertyConstraints.maxStringLength,
  );

  if (!isStateValid) {
    errors["state"] = stateErrorMessage;
  } else if (isStateValid && validatedState) {
    validatedAddressProperties["state"] = validatedState;
  }

  const {
    isPropertyValid: isCountryValid,
    message: countryErrorMessage,
    validatedProperty: validatedCountry,
  } = stringPropertiesValidator(
    "country",
    country,
    propertyConstraints.minStringLength,
    propertyConstraints.maxStringLength,
  );

  if (!isCountryValid) {
    errors["country"] = countryErrorMessage;
  } else if (isCountryValid && validatedCountry) {
    validatedAddressProperties["country"] = validatedCountry;
  }

  const {
    isPropertyValid: isPinCodeValid,
    message: pinCodeErrorMessage,
    validatedProperty: validatedPinCode,
  } = numberRegexPropertiesValidator("pinCode", pinCode, PIN_CODE_REGEX);

  if (!isPinCodeValid) {
    errors["pinCode"] = pinCodeErrorMessage;
  } else if (isPinCodeValid && validatedPinCode) {
    validatedAddressProperties["pinCode"] = validatedPinCode;
  }

  if (isDefault !== undefined && isDefault !== null) {
    if (
      typeof isDefault !== "boolean" &&
      !(
        typeof isDefault === "string" &&
        (isDefault.trim().toLowerCase() === "true" ||
          isDefault.trim().toLowerCase() === "false")
      )
    ) {
      errors["isDefault"] = "Please provide a valid default address flag!";
    } else {
      validatedAddressProperties["isDefault"] =
        typeof isDefault === "string"
          ? isDefault.trim().toLowerCase() === "true"
          : isDefault;
    }
  }

  return { validatedAddressProperties, errors };
};
