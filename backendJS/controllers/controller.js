import {
  userProperties,
  errorsConfig,
  successConfig,
} from "../config/config.js";
import Model from "../models/model.js";
import { throwError, DatabaseError } from "../lib/errors/CustomError.js";
import {
  asyncHandler,
  sanitizeMongoData,
  successResponseHandler,
} from "../lib/utils/utils.js";
import { isValidMongoDbObjectId } from "../lib/utils/authUtils.js";

export const controller = asyncHandler(async (req, res) => {
  const { id } = await req?.data?.data;
  const params = await req?.data?.params;

  if (params?.id && !isValidMongoDbObjectId(params?.id)) {
    throwError(DatabaseError, {
      status: errorsConfig.invalidUserIdError.statusCode,
      name: errorsConfig.invalidUserIdError.title,
      message: errorsConfig.invalidUserIdError.message,
      apiUrl: req?.url,
      data: { id: params?.id },
    });
  }

  const user = await Model.findById(
    params?.id ? params?.id : id,
    !params?.id
      ? Object.values(userProperties)
      : params?.id === id
        ? Object.values(userProperties)
        : Object.values(userProperties),
  );

  if (!user) {
    throwError(DatabaseError, {
      status: errorsConfig.userNotFoundError.statusCode,
      name: errorsConfig.userNotFoundError.title,
      message: errorsConfig.userNotFoundError.message,
      apiUrl: req?.url,
      data: { user },
    });
  }

  const sanitizedUser = sanitizeMongoData(user);

  successResponseHandler(res, {
    status: successConfig.profileFetchSuccess.type,
    statusCode: successConfig.profileFetchSuccess.statusCode,
    title: successConfig.profileFetchSuccess.title,
    message: successConfig.profileFetchSuccess.message,
    data: { user: sanitizedUser },
  });
});
