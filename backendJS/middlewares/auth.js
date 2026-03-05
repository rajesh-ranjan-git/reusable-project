import { userProperties, errorsConfig } from "../config/config.js";
import Model from "../models/model.js";
import {
  AuthenticationError,
  DatabaseError,
} from "../lib/errors/CustomError.js";
import { requestValidator } from "../lib/validations/validation.js";
import {
  isPasswordExpired,
  isValidMongoDbObjectId,
  verifyJwtToken,
} from "../lib/utils/authUtils.js";
import { asyncHandler } from "../lib/utils/utils.js";

const auth = asyncHandler(async (req, res, next) => {
  requestValidator(req, res);

  const authHeader = req.headers["authorization"];
  const authToken = authHeader && authHeader.split(" ")[1];

  if (!authToken) {
    throwError(AuthenticationError, {
      status: errorsConfig.unauthorizedUserError.statusCode,
      name: errorsConfig.unauthorizedUserError.title,
      message: errorsConfig.unauthorizedUserError.message,
      apiUrl: req?.url,
      data: { token: authToken },
    });
  }

  const decodedUserId = verifyJwtToken(authToken);

  if (!isValidMongoDbObjectId(decodedUserId)) {
    throwError(DatabaseError, {
      status: errorsConfig.invalidUserIdError.statusCode,
      name: errorsConfig.invalidUserIdError.title,
      message: errorsConfig.invalidUserIdError.message,
      apiUrl: req?.url,
      data: { id: decodedUserId },
    });
  }

  const loggedInUser = await Model.findById(
    decodedUserId,
    Object.values(userProperties),
  );

  if (!loggedInUser) {
    throwError(DatabaseError, {
      status: errorsConfig.userNotFoundError.statusCode,
      name: errorsConfig.userNotFoundError.title,
      message: errorsConfig.userNotFoundError.message,
      apiUrl: req?.url,
      data: { id: loggedInUser?.id },
    });
  }

  if (isPasswordExpired(loggedInUser?.passwordLastUpdated)) {
    throwError(AuthenticationError, {
      status: errorsConfig.passwordExpiredError.statusCode,
      name: errorsConfig.passwordExpiredError.title,
      message: errorsConfig.passwordExpiredError.message,
      apiUrl: req?.url,
      data: { id: loggedInUser?.id },
    });
  }

  req.data = {
    ...req.data,
    data: {
      id: loggedInUser?.id,
      user: loggedInUser,
    },
  };

  next();
});

export default auth;
