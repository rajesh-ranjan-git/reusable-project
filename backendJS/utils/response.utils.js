import { httpStatusConfig } from "../config/common.config.js";
import { MODE } from "../constants/common.constants.js";
import AppError from "../errors/app.error.js";
import { getDateToStore } from "../utils/date.utils.js";

export const successResponseHandler = (
  req,
  res,
  {
    status = httpStatusConfig.success.message,
    statusCode = httpStatusConfig.success.statusCode,
    message = null,
    data = null,
  } = {},
) => {
  return res.status(statusCode).json({
    success: true,
    status,
    statusCode,
    message,
    data,
    timestamp: getDateToStore(new Date()),
    metadata:
      MODE === "development"
        ? {
            requestId: req.headers["x-request-id"],
            path: req.url || req.originalUrl,
            method: req.method,
          }
        : null,
  });
};

export const errorResponseHandler = (err, req, res, next) => {
  let response;

  if (err instanceof AppError) {
    response = {
      success: false,
      status: err.name,
      code: err.code,
      statusCode: err.statusCode,
      message: err.message,
      details: err.details,
      timestamp: err.timestamp,
      metadata:
        MODE === "development"
          ? {
              path: err.metadata.path || req.url || req.originalUrl,
              requestId: err?.requestId || req.headers["x-request-id"],
              isOperational: err?.isOperational || false,
              method: req.method,
            }
          : null,
    };

    logger.logAppError(err, response);

    return res.status(err.statusCode).json(response);
  }

  response = {
    success: false,
    status: err.name || httpStatusConfig.internalServerError.statusCode,
    code: err.code || "UNEXPECTED ERROR",
    statusCode:
      err.statusCode || httpStatusConfig.internalServerError.statusCode,
    message: err.message || "An unexpected error has occurred!",
    details: null,
    timestamp: getDateToStore(new Date()),
    metadata:
      MODE === "development"
        ? {
            path: err.metadata.path || req.url || req.originalUrl,
            requestId: err?.requestId || req.headers["x-request-id"],
            isOperational: err?.isOperational || false,
            method: req.method,
          }
        : null,
  };

  logger.error({ err, extra: response });

  return res
    .status(httpStatusConfig.internalServerError.statusCode)
    .json(response);
};
