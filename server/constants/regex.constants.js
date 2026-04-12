export const NAME_REGEX = /^[A-Za-z]+$/;
export const USERNAME_REGEX = /^[A-Za-z0-9!@#$%&_]{4,}$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&_]).{6,}$/;
export const UPPER_CASE_REGEX = /[A-Z]/;
export const LOWER_CASE_REGEX = /[a-z]/;
export const NUMBER_REGEX = /\d/;
export const ALLOWED_SPECIAL_CHARACTERS_REGEX = /[@#$%&]/;
export const PHONE_REGEX = /^\d{10}$/;
export const PHOTO_URL_REGEX =
  /^(https?:\/\/)([a-zA-Z0-9\-._~%]+@)?([a-zA-Z0-9\-._~%]+\.)+[a-zA-Z]{2,}(\/[^\s?#]*)*(\.(jpg|jpeg|png|gif|webp|svg))?(\?[^\s]*)?$/i;

export const COUNTRY_CODE_REGEX = /^\d{1,3}$/;
export const PIN_CODE_REGEX = /^\d{6}$/;
