import {
  numberRegexPropertiesValidator,
  stringPropertiesValidator,
} from "./common.validator.js";

export const validateAddress = (data) => {
  const { type, street, city, state, country, pinCode } = data;

  const validatedAddressProperties = {};
  const errors = {};

  if (!type || !["home", "office"].includes(type)) {
    errors["type"] = "Address type must be 'home' or 'office'.";
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

  return { validatedProperties, errors };
};
