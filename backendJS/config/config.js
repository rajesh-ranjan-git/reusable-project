export const appConfig = {
  name: "Your App Name",
  description: "Your applications's description",
};

export const bannerFontsConfig = {
  big: { name: "Big", url: "" },
  doom: { name: "Doom", url: "" },
  standard: { name: "Standard", url: "" },
  slant: { name: "Slant", url: "" },
  ghost: { name: "Ghost", url: "" },
  ansiShadow: { name: "ANSI Shadow", url: "" },
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
    name: "Teal Purple",
    gradient: ["#00f5d4", "#7b2cbf"],
    taglineColor: "#00f5d4",
  },
];

export const httpStatusConfig = {
  success: {
    statusCode: 200,
    message: "SUCCESS",
  },
  created: {
    statusCode: 201,
    message: "CREATED",
  },
  badRequest: {
    statusCode: 400,
    message: "BAD REQUEST",
  },
  unauthorized: {
    statusCode: 401,
    message: "UNAUTHORIZED",
  },
  forbidden: {
    statusCode: 403,
    message: "FORBIDDEN",
  },
  notFound: {
    statusCode: 404,
    message: "NOT FOUND",
  },
  timeout: {
    statusCode: 408,
    message: "TIMEOUT",
  },
  conflict: {
    statusCode: 409,
    message: "CONFLICT",
  },
  rateLimit: {
    statusCode: 429,
    message: "RATE LIMIT ERROR",
  },
  internalServerError: {
    statusCode: 500,
    message: "INTERNAL SERVER ERROR",
  },
};

export const errorTypesConfig = {
  networkError: "NETWORK ERROR",
  dbConfigError: "DATABASE CONFIGURATION ERROR",
  dbError: "DATABASE ERROR",
  validationError: "VALIDATION ERROR",
  bcryptError: "BCRYPT ERROR",
  jwtError: "JWT ERROR",
  authenticationError: "AUTHENTICATION ERROR",
  authorizationError: "AUTHORIZATION ERROR",
  tokenExpiredError: "TOKEN EXPIRED ERROR",
  forbiddenError: "FORBIDDEN ERROR",
  conflictError: "CONFLICT ERROR",
  connectionError: "CONNECTION ERROR",
  notificationError: "NOTIFICATION ERROR",
  notFoundError: "NOT FOUND ERROR",
  unknownError: "UNKNOWN ERROR",
  timeoutError: "TIMEOUT ERROR",
  rateLimitError: "RATE LIMIT ERROR",
  internalServerError: "INTERNAL SERVER ERROR",
};

export const jwtKnownErrorsConfig = {
  tokenExpiredError: "TokenExpiredError",
  jwtError: "JsonWebTokenError",
  notBeforeError: "NotBeforeError",
};

export const errorsConfig = {
  networkError: {
    type: errorTypesConfig.networkError,
    title: "Network Connection Failed",
    message:
      "We are currently experiencing network difficulties. Please try again later.",
    statusCode: httpStatusConfig.internalServerError,
  },
  dbConfigError: {
    type: errorTypesConfig.dbConfigError,
    title: "Database Configuration Failed",
    message:
      "A Database configuration error has occurred, Please check env file.",
    statusCode: httpStatusConfig.internalServerError,
  },
  databaseConnectionFailedError: {
    type: errorTypesConfig.dbConfigError,
    title: "Database Connection Failed",
    message:
      "We are currently experiencing technical difficulties. Please try again later.",
    statusCode: httpStatusConfig.internalServerError,
  },
  invalidRequestError: {
    type: errorTypesConfig.validationError,
    title: "Invalid Request",
    message: "The request contains invalid or missing information.",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidRequestParamsError: {
    type: errorTypesConfig.validationError,
    title: "Invalid Request Params",
    message: "The request contains invalid or missing parameters.",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidRequestQueryError: {
    type: errorTypesConfig.validationError,
    title: "Invalid Request Query",
    message: "The request contains invalid or missing query parameters.",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidRequestBodyError: {
    type: errorTypesConfig.validationError,
    title: "Invalid Request Body",
    message: "The request body contains invalid or missing information.",
    statusCode: httpStatusConfig.badRequest,
  },
  rateLimitExceededError: {
    type: errorTypesConfig.rateLimitError,
    title: "Too Many Requests",
    message:
      "You have exceeded the allowed request limit. Please wait and try again.",
    statusCode: httpStatusConfig.rateLimit,
  },
  timeoutError: {
    type: errorTypesConfig.timeoutError,
    title: "Request Timed Out",
    message: "The request took too long to process. Please try again.",
    statusCode: httpStatusConfig.timeout,
  },
  internalServerError: {
    type: errorTypesConfig.internalServerError,
    title: "Internal Server Error",
    message: "Something went wrong on our end. Please try again later.",
    statusCode: httpStatusConfig.internalServerError,
  },
  bannerError: {
    type: errorTypesConfig.internalServerError,
    title: "Banner Failed",
    message: "Unable to show banner.",
    statusCode: httpStatusConfig.internalServerError,
  },
  invalidPaginationError: {
    type: errorTypesConfig.validationError,
    title: "Invalid Pagination Parameters",
    message: "Page and limit must be valid positive numbers.",
    statusCode: httpStatusConfig.badRequest,
  },
  authenticationError: {
    type: errorTypesConfig.authenticationError,
    title: "Authentication Failed",
    message: "We couldn't verify your credentials. Please try again.",
    statusCode: httpStatusConfig.unauthorized,
  },
  unauthorizedUserError: {
    type: errorTypesConfig.authorizationError,
    title: "Unauthorized Access",
    message: "You are not authorized to access this resource.",
    statusCode: httpStatusConfig.unauthorized,
  },
  forbiddenActionError: {
    type: errorTypesConfig.forbiddenError,
    title: "Action Not Allowed",
    message: "You do not have permission to perform this action.",
    statusCode: httpStatusConfig.forbidden,
  },
  userNotFoundError: {
    type: errorTypesConfig.notFoundError,
    title: "User Not Found",
    message: "The requested user does not exist.",
    statusCode: httpStatusConfig.notFound,
  },
  userAlreadyExistsError: {
    type: errorTypesConfig.conflictError,
    title: "User Already Exists",
    message: "An account with this email or username already exists.",
    statusCode: httpStatusConfig.conflict,
  },
  registrationFailedError: {
    type: errorTypesConfig.dbError,
    title: "Registration Failed",
    message: "We were unable to complete your registration.",
    statusCode: httpStatusConfig.internalServerError,
  },
  profileUpdateFailedError: {
    type: errorTypesConfig.dbError,
    title: "Profile Update Failed",
    message: "Unable to update profile at the moment. Please try again later.",
    statusCode: httpStatusConfig.internalServerError,
  },
  invalidUserIdError: {
    type: errorTypesConfig.validationError,
    title: "User ID Validation Failed",
    message: "The provided user ID format is invalid.",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidEmailError: {
    type: errorTypesConfig.validationError,
    title: "Email Validation Failed",
    message: "Please enter a valid email address.",
    statusCode: httpStatusConfig.badRequest,
  },
  weakPasswordError: {
    type: errorTypesConfig.validationError,
    title: "Weak Password",
    message:
      "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.",
    statusCode: httpStatusConfig.badRequest,
  },
  userNameRequiredError: {
    type: errorTypesConfig.validationError,
    title: "Username Required",
    message: "Please enter your username.",
    statusCode: httpStatusConfig.badRequest,
  },
  firstNameRequiredError: {
    type: errorTypesConfig.validationError,
    title: "First Name Required",
    message: "Please enter your first name.",
    statusCode: httpStatusConfig.badRequest,
  },
  emailRequiredError: {
    type: errorTypesConfig.validationError,
    title: "Email Required",
    message: "Please enter your email.",
    statusCode: httpStatusConfig.badRequest,
  },
  userNameEmailRequiredError: {
    type: errorTypesConfig.validationError,
    title: "Username/Email Required",
    message: "Please enter your username or email.",
    statusCode: httpStatusConfig.badRequest,
  },
  passwordRequiredError: {
    type: errorTypesConfig.validationError,
    title: "Password Required",
    message: "Please enter your password.",
    statusCode: httpStatusConfig.badRequest,
  },
  oldPasswordRequiredError: {
    type: errorTypesConfig.validationError,
    title: "Old Password Required",
    message: "Please enter your old password.",
    statusCode: httpStatusConfig.badRequest,
  },
  newPasswordRequiredError: {
    type: errorTypesConfig.validationError,
    title: "New Password Required",
    message: "Please enter your new password.",
    statusCode: httpStatusConfig.badRequest,
  },
  confirmPasswordRequiredError: {
    type: errorTypesConfig.validationError,
    title: "Confirm Password Required",
    message: "Please confirm your password.",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidUserNameError: {
    type: errorTypesConfig.validationError,
    title: "Username Validation Failed",
    message:
      "Username must only contain alphabets (a-z or A-Z) and special characters (,@,#,$,%,&,_).",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidFirstNameError: {
    type: errorTypesConfig.validationError,
    title: "Name Validation Failed",
    message: "First name must only contain alphabets (a-z or A-Z).",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidMiddleNameError: {
    type: errorTypesConfig.validationError,
    title: "Name Validation Failed",
    message: "Middle name must only contain alphabets (a-z or A-Z).",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidLastNameError: {
    type: errorTypesConfig.validationError,
    title: "Name Validation Failed",
    message: "Last name must only contain alphabets (a-z or A-Z).",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidNicknameError: {
    type: errorTypesConfig.validationError,
    title: "Name Validation Failed",
    message: "Nick name must only contain alphabets (a-z or A-Z).",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidPasswordCombinationError: {
    type: errorTypesConfig.validationError,
    title: "Password Validation Failed",
    message: "Invalid password combination.",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidOldPasswordCombinationError: {
    type: errorTypesConfig.validationError,
    title: "Password Validation Failed",
    message: "Invalid old password combination.",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidNewPasswordCombinationError: {
    type: errorTypesConfig.validationError,
    title: "Password Validation Failed",
    message: "Invalid new password combination.",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidConfirmPasswordCombinationError: {
    type: errorTypesConfig.validationError,
    title: "Password Validation Failed",
    message: "Invalid confirm password combination.",
    statusCode: httpStatusConfig.badRequest,
  },
  passwordMismatchError: {
    type: errorTypesConfig.validationError,
    title: "Password Mismatch",
    message: "Password and confirm password must match.",
    statusCode: httpStatusConfig.badRequest,
  },
  newPasswordConfirmPasswordMismatchError: {
    type: errorTypesConfig.validationError,
    title: "Password Mismatch",
    message: "New password and confirm password must match.",
    statusCode: httpStatusConfig.badRequest,
  },
  userNameMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Username Validation Failed",
    message: "User name must be at least 1 character long.",
    statusCode: httpStatusConfig.badRequest,
  },
  userNameMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Username Validation Failed",
    message: "User name must not be longer than 100 characters.",
    statusCode: httpStatusConfig.badRequest,
  },
  firstNameMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Name Validation Failed",
    message: "First name must be at least 1 character long.",
    statusCode: httpStatusConfig.badRequest,
  },
  firstNameMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Name Validation Failed",
    message: "First name must not be longer than 100 characters.",
    statusCode: httpStatusConfig.badRequest,
  },
  middleNameMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Name Validation Failed",
    message: "Middle name must be at least 1 character long.",
    statusCode: httpStatusConfig.badRequest,
  },
  middleNameMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Name Validation Failed",
    message: "Middle name must not be longer than 100 characters.",
    statusCode: httpStatusConfig.badRequest,
  },
  lastNameMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Name Validation Failed",
    message: "Last name must be at least 1 character long.",
    statusCode: httpStatusConfig.badRequest,
  },
  lastNameMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Name Validation Failed",
    message: "Last name must not be longer than 100 characters.",
    statusCode: httpStatusConfig.badRequest,
  },
  nickNameMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Name Validation Failed",
    message: "Nick name must be at least 1 character long.",
    statusCode: httpStatusConfig.badRequest,
  },
  nickNameMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Name Validation Failed",
    message: "Nick name must not be longer than 100 characters.",
    statusCode: httpStatusConfig.badRequest,
  },
  passwordMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Password Validation Failed",
    message: "Password must be at least 6 characters long.",
    statusCode: httpStatusConfig.badRequest,
  },
  passwordMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Password Validation Failed",
    message: "Password must not be longer than 100 characters.",
    statusCode: httpStatusConfig.badRequest,
  },
  passwordUpperCaseError: {
    type: errorTypesConfig.validationError,
    title: "Password Validation Failed",
    message: "Password must contain at least one uppercase letter (A-Z).",
    statusCode: httpStatusConfig.badRequest,
  },
  passwordLowerCaseError: {
    type: errorTypesConfig.validationError,
    title: "Password Validation Failed",
    message: "Password must contain at least one lowercase letter (a-z).",
    statusCode: httpStatusConfig.badRequest,
  },
  passwordNumberError: {
    type: errorTypesConfig.validationError,
    title: "Password Validation Failed",
    message: "Password must contain at least one digit (0-9).",
    statusCode: httpStatusConfig.badRequest,
  },
  passwordSpecialCharactersError: {
    type: errorTypesConfig.validationError,
    title: "Password Validation Failed",
    message:
      "Password must contain at least one special character (@, #, $, %, &).",
    statusCode: httpStatusConfig.badRequest,
  },
  passwordUpdateFailedError: {
    type: errorTypesConfig.dbError,
    title: "Password Update Failed",
    message: "We were unable to update password.",
    statusCode: httpStatusConfig.internalServerError,
  },
  passwordAlreadyUsedError: {
    type: errorTypesConfig.forbiddenError,
    title: "Password Update Failed",
    message: "New password and previous password must be different.",
    statusCode: httpStatusConfig.forbidden,
  },
  passwordExpiredError: {
    type: errorTypesConfig.authorizationError,
    title: "Password Expired",
    message: "Your password is expired, Please reset your password.",
    statusCode: httpStatusConfig.unauthorized,
  },
  bcryptError: {
    type: errorTypesConfig.bcryptError,
    title: "Password Encryption Failed",
    message: "We were unable to encrypt your password.",
    statusCode: httpStatusConfig.internalServerError,
  },
  jwtError: {
    type: errorTypesConfig.jwtError,
    title: "Token Generation Failed",
    message: "We were unable to generate token.",
    statusCode: httpStatusConfig.internalServerError,
  },
  jwtNotBeforeError: {
    type: errorTypesConfig.jwtError,
    title: "Token Validation Failed",
    message:
      "We were unable to process token as we got 'Not before token' error.",
    statusCode: httpStatusConfig.internalServerError,
  },
  tokenExpiredError: {
    type: errorTypesConfig.tokenExpiredError,
    title: "Session Expired",
    message: "Your session has expired. Please log in again.",
    statusCode: httpStatusConfig.unauthorized,
  },
  invalidTokenError: {
    type: errorTypesConfig.validationError,
    title: "Token Validation Failed",
    message: "The provided token is invalid. Please authenticate again.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidAgeError: {
    type: errorTypesConfig.validationError,
    title: "Age Validation Failed",
    message: "Please enter a valid age.",
    statusCode: httpStatusConfig.forbidden,
  },
  decimalAgeError: {
    type: errorTypesConfig.validationError,
    title: "Age Validation Failed",
    message: "Age must not be in decimals.",
    statusCode: httpStatusConfig.forbidden,
  },
  minAgeError: {
    type: errorTypesConfig.validationError,
    title: "Age Validation Failed",
    message: "You must be older than 18 years.",
    statusCode: httpStatusConfig.forbidden,
  },
  maxAgeError: {
    type: errorTypesConfig.validationError,
    title: "Age Validation Failed",
    message: "You must be younger than 80 years.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidPhoneError: {
    type: errorTypesConfig.validationError,
    title: "Phone Validation Failed",
    message: "Please enter a valid phone number.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidGenderError: {
    type: errorTypesConfig.validationError,
    title: "Gender Validation Failed",
    message: "Please choose correct gender.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidMaritalStatusError: {
    type: errorTypesConfig.validationError,
    title: "Marital Status Validation Failed",
    message: "Please choose correct marital status.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidPhotoUrlError: {
    type: errorTypesConfig.validationError,
    title: "Photo Validation Failed",
    message: "Please enter a valid photo url.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidBioError: {
    type: errorTypesConfig.validationError,
    title: "Bio Validation Failed",
    message: "Please enter a valid bio.",
    statusCode: httpStatusConfig.forbidden,
  },
  bioMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Bio Validation Failed",
    message: "Bio must be at least 2 characters long.",
    statusCode: httpStatusConfig.forbidden,
  },
  bioMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Bio Validation Failed",
    message: "Bio must not be longer than 100 characters.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidExperienceError: {
    type: errorTypesConfig.validationError,
    title: "Experience Validation Failed",
    message: "Please enter valid experience.",
    statusCode: httpStatusConfig.forbidden,
  },
  decimalExperienceError: {
    type: errorTypesConfig.validationError,
    title: "Experience Validation Failed",
    message: "Experience must not be in decimals.",
    statusCode: httpStatusConfig.forbidden,
  },
  minExperienceError: {
    type: errorTypesConfig.validationError,
    title: "Experience Validation Failed",
    message: "Experience must be more than 0 years.",
    statusCode: httpStatusConfig.forbidden,
  },
  maxExperienceError: {
    type: errorTypesConfig.validationError,
    title: "Experience Validation Failed",
    message: "Experience must be less than 70 years.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidJobProfileError: {
    type: errorTypesConfig.validationError,
    title: "Job Profile Validation Failed",
    message: "Please enter a valid job profile.",
    statusCode: httpStatusConfig.forbidden,
  },
  jobProfileMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Job Profile Validation Failed",
    message: "Job profile must be at least 2 characters long.",
    statusCode: httpStatusConfig.forbidden,
  },
  jobProfileMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Job Profile Validation Failed",
    message: "Job profile must not be longer than 100 characters.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidFacebookUrlError: {
    type: errorTypesConfig.validationError,
    title: "Social Media Validation Failed",
    message: "Please enter a valid facebook url.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidInstagramUrlError: {
    type: errorTypesConfig.validationError,
    title: "Social Media Validation Failed",
    message: "Please enter a valid instagram url.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidTwitterUrlError: {
    type: errorTypesConfig.validationError,
    title: "Social Media Validation Failed",
    message: "Please enter a valid twitter url.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidGithubUrlError: {
    type: errorTypesConfig.validationError,
    title: "Social Media Validation Failed",
    message: "Please enter a valid github url.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidLinkedinUrlError: {
    type: errorTypesConfig.validationError,
    title: "Social Media Validation Failed",
    message: "Please enter a valid linkedin url.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidYoutubeUrlError: {
    type: errorTypesConfig.validationError,
    title: "Social Media Validation Failed",
    message: "Please enter a valid youtube url.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidWebsiteUrlError: {
    type: errorTypesConfig.validationError,
    title: "Social Media Validation Failed",
    message: "Please enter a valid website url.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidCompanyError: {
    type: errorTypesConfig.validationError,
    title: "Company Validation Failed",
    message: "Please enter a valid company.",
    statusCode: httpStatusConfig.forbidden,
  },
  companyMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Company Validation Failed",
    message: "Company must be at least 2 characters long.",
    statusCode: httpStatusConfig.forbidden,
  },
  companyMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Company Validation Failed",
    message: "Company must not be longer than 100 characters.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidOrganizationError: {
    type: errorTypesConfig.validationError,
    title: "Organization Validation Failed",
    message: "Please enter a valid organization.",
    statusCode: httpStatusConfig.forbidden,
  },
  organizationMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Organization Validation Failed",
    message: "Organization must be at least 2 characters long.",
    statusCode: httpStatusConfig.forbidden,
  },
  organizationMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Organization Validation Failed",
    message: "Organization must not be longer than 100 characters.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidSkillsError: {
    type: errorTypesConfig.validationError,
    title: "Skills Validation Failed",
    message: "Please add valid skills.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidInterestsError: {
    type: errorTypesConfig.validationError,
    title: "Interests Validation Failed",
    message: "Please add valid interests.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidAddressError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "Please provide a valid address.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidStreetError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "Please enter a valid street.",
    statusCode: httpStatusConfig.forbidden,
  },
  streetMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "Street must be at least 2 characters long.",
    statusCode: httpStatusConfig.forbidden,
  },
  streetMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "Street must not be longer than 100 characters.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidLandmarkError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "Please enter a valid landmark.",
    statusCode: httpStatusConfig.forbidden,
  },
  landmarkMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "Landmark must be at least 2 characters long.",
    statusCode: httpStatusConfig.forbidden,
  },
  landmarkMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "Landmark must not be longer than 100 characters.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidCityError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "Please enter a valid city.",
    statusCode: httpStatusConfig.forbidden,
  },
  cityMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "City must be at least 2 characters long.",
    statusCode: httpStatusConfig.forbidden,
  },
  cityMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "City must not be longer than 100 characters.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidStateError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "Please enter a valid state.",
    statusCode: httpStatusConfig.forbidden,
  },
  stateMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "State must be at least 2 characters long.",
    statusCode: httpStatusConfig.forbidden,
  },
  stateMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "State must not be longer than 100 characters.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidCountryError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "Please enter a valid country.",
    statusCode: httpStatusConfig.forbidden,
  },
  countryMinLengthError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "Country must be at least 2 characters long.",
    statusCode: httpStatusConfig.forbidden,
  },
  countryMaxLengthError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "Country must not be longer than 100 characters.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidCountryCodeError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "Please enter a valid country code.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidPinCodeError: {
    type: errorTypesConfig.validationError,
    title: "Address Validation Failed",
    message: "Please enter a valid pin code.",
    statusCode: httpStatusConfig.forbidden,
  },
  connectionRequestFailedError: {
    type: errorTypesConfig.dbError,
    title: "Connection Request Failed",
    message: "Unable to send connection request, Please try again.",
    statusCode: httpStatusConfig.internalServerError,
  },
  selfConnectionError: {
    type: errorTypesConfig.validationError,
    title: "Connection Request Failed",
    message: "Logged in user and other user must be different.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidConnectionRequestError: {
    type: errorTypesConfig.validationError,
    title: "Connection Request Failed",
    message: "Your connection request is invalid, Please try again.",
    statusCode: httpStatusConfig.forbidden,
  },
  viewConnectionRequestError: {
    type: errorTypesConfig.dbError,
    title: "Connection Request Failed",
    message:
      "We were unable to get connections requests, Please try again later.",
    statusCode: httpStatusConfig.internalServerError,
  },
  invalidNotificationRequestError: {
    type: errorTypesConfig.notificationError,
    title: "Notification Validation Request",
    message: "Notification ID or type or status is invalid.",
    statusCode: httpStatusConfig.badRequest,
  },
  notificationFailedError: {
    type: errorTypesConfig.notificationError,
    title: "Notification Failed",
    message:
      "We were unable to process the notification request, Please try again later.",
    statusCode: httpStatusConfig.internalServerError,
  },
  accountDeletionFailed: {
    type: errorTypesConfig.dbError,
    title: "Account Deletion Failed",
    message:
      "We were unable to process your account deletion request, Please try again later.",
    statusCode: httpStatusConfig.internalServerError,
  },
  messageNotFound: {
    type: errorTypesConfig.notFoundError,
    title: "Message Not Found",
    message: "The requested message could not be found.",
    statusCode: httpStatusConfig.notFound,
  },
  invalidMessageOperationError: {
    type: errorTypesConfig.validationError,
    title: "Invalid Message Operation",
    message: "The requested message operation is invalid.",
    statusCode: httpStatusConfig.badRequest,
  },
  userNotConnectedError: {
    type: errorTypesConfig.authorizationError,
    title: "Users Not Connected",
    message: "You can only send messages to connected users.",
    statusCode: httpStatusConfig.forbidden,
  },
  invalidConversationIdError: {
    type: errorTypesConfig.validationError,
    title: "Conversation Validation Failed",
    message:
      "The provided conversation ID format is invalid, Please try again.",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidMessageIdError: {
    type: errorTypesConfig.validationError,
    title: "Message Validation Failed",
    message: "The provided message ID format is invalid, Please try again.",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidMessageError: {
    type: errorTypesConfig.validationError,
    title: "Message Validation Failed",
    message: "Invalid message received, Please try again.",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidGroupError: {
    type: errorTypesConfig.validationError,
    title: "Group Validation Failed",
    message: "The provided group is invalid, Please try again.",
    statusCode: httpStatusConfig.badRequest,
  },
  invalidTargetIdError: {
    type: errorTypesConfig.validationError,
    title: "Group Validation Failed",
    message: "The provided set of target IDs are invalid, Please try again.",
    statusCode: httpStatusConfig.badRequest,
  },
};

export const successConfig = {
  dbConnectionSuccess: {
    type: "DB CONNECTION SUCCESS",
    title: "Database connected",
    message: "Database connected successfully.",
    statusCode: httpStatusConfig.success,
  },
  authenticationSuccess: {
    type: "AUTHENTICATION SUCCESS",
    title: "Authentication Successful",
    message: "You have been successfully authenticated.",
    statusCode: httpStatusConfig.success,
  },
  registrationSuccess: {
    type: "REGISTRATION SUCCESS",
    title: "Registration Successful",
    message: "Your account has been created successfully.",
    statusCode: httpStatusConfig.created,
  },
  loginSuccess: {
    type: "LOGIN SUCCESS",
    title: "Login Successful",
    message: "Welcome back! You have logged in successfully.",
    statusCode: httpStatusConfig.success,
  },
  logoutSuccess: {
    type: "LOGOUT SUCCESS",
    title: "Logout Successful",
    message: "You have been logged out successfully.",
    statusCode: httpStatusConfig.success,
  },
  passwordUpdateSuccess: {
    type: "PASSWORD UPDATE SUCCESS",
    title: "Password Updated",
    message: "Your password has been updated successfully.",
    statusCode: httpStatusConfig.success,
  },
  profileFetchSuccess: {
    type: "FETCH PROFILE SUCCESS",
    title: "Profile Loaded",
    message: "Your profile has been retrieved successfully.",
    statusCode: httpStatusConfig.success,
  },
  profileUpdateSuccess: {
    type: "PROFILE UPDATE SUCCESS",
    title: "Profile Updated",
    message: "Your profile has been updated successfully.",
    statusCode: httpStatusConfig.success,
  },
  accountDeleteSuccess: {
    type: "ACCOUNT DELETION SUCCESS",
    title: "Account Deleted",
    message: "Your account has been deleted successfully.",
    statusCode: httpStatusConfig.success,
  },
  exploreFetchSuccess: {
    type: "EXPLORE_FETCH_SUCCESS",
    title: "Explore Loaded",
    message: "Explore data fetched successfully.",
    statusCode: httpStatusConfig.success,
  },
  connectionRequestSuccess: {
    type: "CONNECTION REQUEST SUCCESS",
    title: "Connection Request Sent",
    message: "Your connection request has been sent successfully.",
    statusCode: httpStatusConfig.created,
  },
  notificationsFetchSuccess: {
    type: "NOTIFICATION FETCH SUCCESS",
    title: "Notifications Loaded",
    message: "Your notifications have been retrieved successfully.",
    statusCode: httpStatusConfig.success,
  },
  notificationsReadSuccess: {
    type: "NOTIFICATION READ SUCCESS",
    title: "Notifications Read",
    message: "Your notifications have been marked read successfully.",
    statusCode: httpStatusConfig.success,
  },
  chatsFetchSuccess: {
    type: "CHATS FETCH SUCCESS",
    title: "Chats Loaded",
    message: "All chats loaded successfully.",
    statusCode: httpStatusConfig.created,
  },
  groupChatsFetchSuccess: {
    type: "GROUP CHATS FETCH SUCCESS",
    title: "Group Chats Loaded",
    message: "All group chats loaded successfully.",
    statusCode: httpStatusConfig.created,
  },
  chatMessagesFetchSuccess: {
    type: "CHAT MESSAGES FETCH SUCCESS",
    title: "Chat Messages Loaded",
    message: "All chat messages loaded successfully.",
    statusCode: httpStatusConfig.created,
  },
  groupChatMessagesFetchSuccess: {
    type: "GROUP CHAT MESSAGES FETCH SUCCESS",
    title: "Group Chat Messages Loaded",
    message: "All group chat messages loaded successfully.",
    statusCode: httpStatusConfig.created,
  },
  editMessageSuccess: {
    type: "EDIT MESSAGE SUCCESS",
    title: "Message Edited",
    message: "Messages edited successfully.",
    statusCode: httpStatusConfig.created,
  },
  deleteMessageSuccess: {
    type: "DELETE MESSAGE SUCCESS",
    title: "Message Deleted",
    message: "Message deleted successfully.",
    statusCode: httpStatusConfig.created,
  },
  sendChatMessageSuccess: {
    type: "SEND CHAT MESSAGE SUCCESS",
    title: "Chat Message Sent",
    message: "Chat message sent successfully.",
    statusCode: httpStatusConfig.created,
  },
  sendGroupChatMessageSuccess: {
    type: "SEND GROUP CHAT MESSAGE SUCCESS",
    title: "Group Chat Message Sent",
    message: "Group chat message sent successfully.",
    statusCode: httpStatusConfig.created,
  },
  forwardMessageSuccess: {
    type: "FORWARD MESSAGE SUCCESS",
    title: "Message Forwarded",
    message: "Message(s) forwarded successfully.",
    statusCode: httpStatusConfig.created,
  },
  messageDeliverySuccess: {
    type: "MESSAGE DELIVERY SUCCESS",
    title: "Message Delivered",
    message: "Message(s) delivered successfully.",
    statusCode: httpStatusConfig.created,
  },
  messageSeenSuccess: {
    type: "MESSAGE SEEN SUCCESS",
    title: "Message Seen",
    message: "Message seen successfully.",
    statusCode: httpStatusConfig.created,
  },
  messageInfoFetchSuccess: {
    type: "MESSAGE INFO FETCH SUCCESS",
    title: "Message Info Loaded",
    message: "Message info loaded successfully.",
    statusCode: httpStatusConfig.created,
  },
};

export const userProperties = {
  id: "_id",
  email: "email",
  userName: "userName",
  password: "password",
  previousPassword: "previousPassword",
  passwordLastUpdated: "passwordLastUpdated",
  firstName: "firstName",
  middleName: "middleName",
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
  organization: "organization",
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

export const socialMediaProperties = {
  facebook: "facebook",
  instagram: "instagram",
  twitter: "twitter",
  github: "github",
  linkedin: "linkedin",
  youtube: "youtube",
  website: "website",
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

export const connectionProperties = {
  senderId: "senderId",
  receiverId: "receiverId",
  connectionStatus: "connectionStatus",
  rejectedBySenderCount: "rejectedBySenderCount",
  rejectedByReceiverCount: "rejectedByReceiverCount",
  lastActionedBy: "lastActionedBy",
  updatedAt: "updatedAt",
  createdAt: "createdAt",
};

export const connectionStatusProperties = {
  interested: "interested",
  notInterested: "notInterested",
  accepted: "accepted",
  rejected: "rejected",
  blocked: "blocked",
};

export const notificationProperties = {
  type: "type",
  to: "to",
  from: "from",
  title: "title",
  body: "body",
  status: "status",
};

export const notificationTypes = {
  connection: "connection",
  chat: "chat",
};

export const notificationStatusProperties = {
  read: "read",
  unread: "unread",
  delete: "delete",
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
