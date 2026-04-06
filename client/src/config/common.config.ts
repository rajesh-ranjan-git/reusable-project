import { Alkatra, Arima, Inter, Poppins, Tourney } from "next/font/google";
import { StaticImageType } from "@/types/types";

export const staticImages: StaticImageType = {
  navLogo: {
    src: "/assets/logo/app-logo-transparent.webp",
    alt: "app-logo",
  },
  mainLogo: {
    src: "/assets/logo/app-logo.webp",
    alt: "app-logo",
  },
  notFoundError: {
    src: "/assets/error/404-error.webp",
    alt: "404-error",
  },
  unexpectedError: {
    src: "/assets/error/something-went-wrong.webp",
    alt: "unexpected-error",
  },
  avatarPlaceholder: {
    src: "/assets/avatar/user.webp",
    alt: "avatar-icon",
  },
  profilePlaceholder: {
    src: "/assets/avatar/user.webp",
    alt: "profile-pic",
  },
};

export const appConfig = {
  name: "App Name",
  description: "App's description.",
};

export const alkatra = Alkatra({
  subsets: ["latin"],
  variable: "--font-alkatra",
  display: "swap",
});

export const arima = Arima({
  subsets: ["latin"],
  variable: "--font-arima",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const tourney = Tourney({
  subsets: ["latin"],
  variable: "--font-tourney",
  display: "swap",
});

export const themeConfig = {
  dark: "dark",
  light: "light",
} as const;

export const storageConfig = {
  local: "local",
  session: "session",
} as const;

export const bannerFontsConfig = {
  big: { name: "Big", url: "" },
  doom: { name: "Doom", url: "" },
  standard: { name: "Standard", url: "" },
  slant: { name: "Slant", url: "" },
  ghost: { name: "Ghost", url: "" },
  ansiShadow: { name: "ANSI Shadow", url: "/assets/fonts/ansi_shadow.flf" },
  epic: { name: "Epic", url: "" },
  bloody: { name: "Bloody", url: "" },
  cuberLarge: { name: "Cyberlarge", url: "" },
};

export const ansiConfig = {
  blue: "\x1b[38;2;56;248;248m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[38;2;255;150;255m",
};

export const bannerThemesConfig = [
  {
    name: "Cyber Blue",
    gradient: ["#00eaff", "#0077ff"],
    taglineColor: "#00eaff",
  },
  {
    name: "Neon Purple",
    gradient: ["#9d4edd", "#7b2cbf", "#5a189a"],
    taglineColor: "#9d4edd",
  },
  {
    name: "Sunset Pink-Blue",
    gradient: ["#ff5f8f", "#ff99c8", "#00bbf9", "#00f5d4"],
    taglineColor: "#ff5f8f",
  },
  {
    name: "Retro 80s Neon",
    gradient: ["#ff00ff", "#ff0099", "#00e5ff"],
    taglineColor: "#ff00ff",
  },
  {
    name: "Vercel Monochrome",
    gradient: ["#ffffff", "#8d8d8d", "#333333"],
    taglineColor: "#ffffff",
  },
  {
    name: "Matrix Green",
    gradient: ["#00ff41", "#00b300"],
    taglineColor: "#00ff41",
  },
  {
    name: "Gold Luxury",
    gradient: ["#fff3b0", "#ffd60a", "#fca311", "#e85d04"],
    taglineColor: "#fca311",
  },
  {
    name: "Fire Lava",
    gradient: ["#ff0000", "#ff7b00", "#ffb100"],
    taglineColor: "#ff7b00",
  },
  {
    name: "Ice Blue",
    gradient: ["#caf0f8", "#90e0ef", "#00b4d8", "#0077b6"],
    taglineColor: "#00b4d8",
  },
  {
    name: "DevMatch Teal-Purple (Default)",
    gradient: ["#00f5d4", "#7b2cbf"],
    taglineColor: "#00f5d4",
  },
];

export const httpStatusConfig = {
  continue: {
    statusCode: 100,
    message: "CONTINUE",
  },
  connectionSwitched: {
    statusCode: 101,
    message: "CONNECTION SWITCHED",
  },
  processing: {
    statusCode: 102,
    message: "PROCESSING",
  },
  earlyHints: {
    statusCode: 103,
    message: "EARLY HINTS",
  },
  success: {
    statusCode: 200,
    message: "SUCCESS",
  },
  created: {
    statusCode: 201,
    message: "CREATED",
  },
  accepted: {
    statusCode: 202,
    message: "ACCEPTED",
  },
  nonAuthoritativeInformation: {
    statusCode: 203,
    message: "NON AUTHORITATIVE INFORMATION",
  },
  noContent: {
    statusCode: 204,
    message: "NO CONTENT",
  },
  resetContent: {
    statusCode: 205,
    message: "RESET CONTENT",
  },
  partialContent: {
    statusCode: 206,
    message: "PARTIAL CONTENT",
  },
  multiStatus: {
    statusCode: 207,
    message: "MULTI STATUS",
  },
  alreadyReported: {
    statusCode: 208,
    message: "ALREADY REPORTED",
  },
  imUsed: {
    statusCode: 226,
    message: "IM USED",
  },
  multipleChoices: {
    statusCode: 300,
    message: "MULTIPLE CHOICES",
  },
  movedPermanently: {
    statusCode: 301,
    message: "MOVED PERMANENTLY",
  },
  found: {
    statusCode: 302,
    message: "FOUND",
  },
  seeOther: {
    statusCode: 303,
    message: "SEE OTHER",
  },
  notModified: {
    statusCode: 304,
    message: "NOT MODIFIED",
  },
  temporaryRedirect: {
    statusCode: 307,
    message: "TEMPORARY REDIRECT",
  },
  permanentRedirect: {
    statusCode: 308,
    message: "PERMANENT REDIRECT",
  },
  badRequest: {
    statusCode: 400,
    message: "BAD REQUEST",
  },
  unauthorized: {
    statusCode: 401,
    message: "UNAUTHORIZED",
  },
  paymentRequired: {
    statusCode: 402,
    message: "PAYMENT REQUIRED",
  },
  forbidden: {
    statusCode: 403,
    message: "FORBIDDEN",
  },
  notFound: {
    statusCode: 404,
    message: "NOT FOUND",
  },
  methodNotAllowed: {
    statusCode: 405,
    message: "METHOD NOT ALLOWED",
  },
  notAcceptable: {
    statusCode: 406,
    message: "NOT ACCEPTABLE",
  },
  proxyAuthenticationRequired: {
    statusCode: 407,
    message: "PROXY AUTHENTICATION REQUIRED",
  },
  requestTimeout: {
    statusCode: 408,
    message: "REQUEST TIMEOUT",
  },
  conflict: {
    statusCode: 409,
    message: "CONFLICT",
  },
  gone: {
    statusCode: 410,
    message: "GONE",
  },
  lengthRequired: {
    statusCode: 411,
    message: "LENGTH REQUIRED",
  },
  preconditionFailed: {
    statusCode: 412,
    message: "PRECONDITION FAILED",
  },
  payloadTooLarge: {
    statusCode: 413,
    message: "PAYLOAD TOO LARGE",
  },
  uriTooLong: {
    statusCode: 414,
    message: "URI TOO LONG",
  },
  unsupportedMediaType: {
    statusCode: 415,
    message: "UNSUPPORTED MEDIA TYPE",
  },
  rangeNotSatisfiable: {
    statusCode: 416,
    message: "RANG NOT SATISFIABLE",
  },
  expectationFailed: {
    statusCode: 417,
    message: "EXPECTATION FAILED",
  },
  imaTeapot: {
    statusCode: 418,
    message: "I'M A TEAPOT",
  },
  misdirectedRequest: {
    statusCode: 421,
    message: "MISDIRECTED REQUEST",
  },
  unprocessableEntity: {
    statusCode: 422,
    message: "UNPROCESSABLE ENTITY",
  },
  locked: {
    statusCode: 423,
    message: "LOCKED",
  },
  failedDependency: {
    statusCode: 424,
    message: "FAILED DEPENDENCY",
  },
  tooEarly: {
    statusCode: 425,
    message: "TOO EARLY",
  },
  upgradeRequired: {
    statusCode: 426,
    message: "UPGRADE REQUIRED",
  },
  preconditionRequired: {
    statusCode: 428,
    message: "PRECONDITION REQUIRED",
  },
  tooManyRequests: {
    statusCode: 429,
    message: "TOO MANY REQUESTS",
  },
  requestHeaderFieldsTooLarge: {
    statusCode: 431,
    message: "REQUEST HEADER FIELDS TOO LARGE",
  },
  unavailableForLegalReasons: {
    statusCode: 451,
    message: "UNABLE FOR LEGAL REASONS",
  },
  internalServerError: {
    statusCode: 500,
    message: "INTERNAL SERVER ERROR",
  },
  notImplemented: {
    statusCode: 501,
    message: "NOT IMPLEMENTED",
  },
  badGateway: {
    statusCode: 502,
    message: "BAD GATEWAY",
  },
  serviceUnavailable: {
    statusCode: 503,
    message: "SERVICE UNAVAILABLE",
  },
  gatewayTimeout: {
    statusCode: 504,
    message: "GATEWAY TIMEOUT",
  },
  httpVersionNotSupported: {
    statusCode: 505,
    message: "HTTP VERSION NOT SUPPORTED",
  },
  variantAlsoNegotiates: {
    statusCode: 506,
    message: "VARIANT ALSO NEGOTIATES",
  },
  insufficientStorage: {
    statusCode: 507,
    message: "INSUFFICIENT STORAGE",
  },
  loopDetected: {
    statusCode: 508,
    message: "LOOP DETECTED",
  },
  notExtended: {
    statusCode: 510,
    message: "NOT EXTENDED",
  },
  networkAuthenticationRequired: {
    statusCode: 510,
    message: "NETWORK AUTHENTICATION REQUIRED",
  },
};

export const jwtKnownErrorsConfig = {
  tokenExpiredError: "TokenExpiredError",
  jwtError: "JsonWebTokenError",
  notBeforeError: "NotBeforeError",
};

export const userProperties = {
  id: "_id",
  email: "email",
  userName: "userName",
  password: "password",
  previousPassword: "previousPassword",
  passwordLastUpdated: "passwordLastUpdated",
  firstName: "firstName",
  lastName: "lastName",
  nickName: "nickName",
  age: "age",
  phone: "phone",
  gender: "gender",
  avatarUrl: "avatarUrl",
  coverPhotoUrl: "coverPhotoUrl",
  bio: "bio",
  maritalStatus: "maritalStatus",
  jobProfile: "jobProfile",
  experience: "experience",
  socialMedia: "socialMedia",
  company: "company",
  skills: "skills",
  interests: "interests",
  address: "address",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
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

export const propertyConstraints = {
  minUserNameLength: 1,
  maxUserNameLength: 100,
  minNameLength: 1,
  maxNameLength: 100,
  minPasswordLength: 6,
  maxPasswordLength: 100,
  minAge: 18,
  maxAge: 100,
  minExperience: 0,
  maxExperience: 70,
  minStringLength: 2,
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
