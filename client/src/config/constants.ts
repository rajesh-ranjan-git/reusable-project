export const HOST_PORT = process.env.PORT || 5000;
export const HOST_URL = process.env.HOST_URL || "http://localhost:5000";
export const CLIENT_PORT = process.env.PORT || 5000;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

export const NAME_REGEX = /^[A-Za-z]+$/;
export const USER_NAME_REGEX = /^[A-Za-z0-9!@#$%&_]{4,}$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&]).{6,}$/;
export const UPPER_CASE_REGEX = /[A-Z]/;
export const LOWER_CASE_REGEX = /[a-z]/;
export const NUMBER_REGEX = /\d/;
export const ALLOWED_SPECIAL_CHARACTERS_REGEX = /[@#$%&]/;
export const PHONE_REGEX = /^\d{10}$/;
export const PHOTO_URL_REGEX =
  /^(https?:\/\/)([a-zA-Z0-9\-._~%]+@)?([a-zA-Z0-9\-._~%]+\.)+[a-zA-Z]{2,}(\/[^\s?#]*)*(\.(jpg|jpeg|png|gif|webp|svg))?(\?[^\s]*)?$/i;
export const FACEBOOK_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]+)(?:\/)?/im;
export const INSTAGRAM_REGEX =
  /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/i;
export const TWITTER_REGEX =
  /https?:\/\/(?:www\.|m\.)?(?:twitter|x)\.com\/@?([a-zA-Z0-9_]{1,15})(?:\/?|\?[^\s\/]*|\/[^\s\/]*)$/i;
export const GITHUB_REGEX =
  /^(https?:\/\/)?(www\.)?github\.com\/([a-zA-Z0-9_-]+)\/?$/;
export const LINKEDIN_REGEX =
  /^(https?:\/\/)?([\w]+\.)?linkedin\.com\/(mwlite\/|m\/)?in\/([a-zA-Z0-9À-ž_.-]+)\/?$/;
export const YOUTUBE_REGEX =
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:channel\/|user\/|c\/|@)?([\w-]+)/;
export const WEBSITE_REGEX =
  /^https?:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:\d+)?(\/[^\s]*)?$/;
export const COUNTRY_CODE_REGEX = /^\d{1,3}$/;
export const PIN_CODE_REGEX = /^\d{6}$/;
