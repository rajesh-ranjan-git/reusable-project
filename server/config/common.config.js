export const appConfig = {
  name: "App Server",
  description: "App Server's description",
};

export const jwtKnownErrorsConfig = {
  tokenExpiredError: "TokenExpiredError",
  jwtError: "JsonWebTokenError",
  notBeforeError: "NotBeforeError",
};

export const userStatusProperties = {
  active: "active",
  suspended: "suspended",
  deleted: "deleted",
  locked: "locked",
};

export const genderProperties = {
  male: "male",
  female: "female",
  other: "other",
};

export const maritalStatusProperties = {
  married: "married",
  single: "single",
  separated: "separated",
  divorced: "divorced",
  complicated: "complicated",
};

export const socialPlatforms = {
  facebook: {
    name: "facebook",
    regex:
      /(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]+)(?:\/)?/im,
  },
  instagram: {
    name: "instagram",
    regex:
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/i,
  },
  twitter: {
    name: "twitter",
    regex:
      /https?:\/\/(?:www\.|m\.)?(?:twitter|x)\.com\/@?([a-zA-Z0-9_]{1,15})(?:\/?|\?[^\s\/]*|\/[^\s\/]*)$/i,
  },
  github: {
    name: "github",
    regex: /^(https?:\/\/)?(www\.)?github\.com\/([a-zA-Z0-9_-]+)\/?$/,
  },
  linkedin: {
    name: "linkedin",
    regex:
      /^(https?:\/\/)?([\w]+\.)?linkedin\.com\/(mwlite\/|m\/)?in\/([a-zA-Z0-9À-ž_.-]+)\/?$/,
  },
  youtube: {
    name: "youtube",
    regex:
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:channel\/|user\/|c\/|@)?([\w-]+)/,
  },
  website: {
    name: "website",
    regex:
      /^https?:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:\d+)?(\/[^\s]*)?$/,
  },
};

export const addressProperties = {
  street: "street",
  landmark: "landmark",
  city: "city",
  state: "state",
  countryCode: "countryCode",
  country: "country",
  pinCode: "pinCode",
};

export const addressTypeProperties = {
  home: "home",
  office: "office",
  other: "other",
};

export const propertyConstraints = {
  minUserNameLength: 6,
  maxUserNameLength: 100,
  minNameLength: 2,
  maxNameLength: 100,
  minPasswordLength: 6,
  maxPasswordLength: 100,
  minStringLength: 2,
  maxBioLength: 300,
  minBioLength: 2,
  maxStringLength: 100,
  phoneLength: 10,
  pinCodeLength: 6,
};

export const timelineConfig = {
  oneHour: 1000 * 60 * 60,
  twoHours: 1000 * 60 * 60 * 2,
  threeHours: 1000 * 60 * 60 * 3,
  sixHours: 1000 * 60 * 60 * 6,
  halfDay: 1000 * 60 * 60 * 12,
  oneDay: 1000 * 60 * 60 * 24,
  twoDays: 1000 * 60 * 60 * 24 * 2,
  threeDays: 1000 * 60 * 60 * 24 * 3,
  oneWeek: 1000 * 60 * 60 * 24 * 7,
  twoWeeks: 1000 * 60 * 60 * 24 * 7 * 2,
  threeWeeks: 1000 * 60 * 60 * 24 * 7 * 3,
  oneMonth: 1000 * 60 * 60 * 24 * 30,
  twoMonths: 1000 * 60 * 60 * 24 * 30 * 2,
  threeMonths: 1000 * 60 * 60 * 24 * 30 * 3,
  sixMonths: 1000 * 60 * 60 * 24 * 30 * 6,
  oneYear: 1000 * 60 * 60 * 24 * 30 * 12,
  twoYears: 1000 * 60 * 60 * 24 * 30 * 12 * 2,
  fourYears: 1000 * 60 * 60 * 24 * 30 * 12 * 3,
};
