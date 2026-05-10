import { httpStatusConfig } from "../../config/http.config.js";
import { CLIENT_URL, MODE } from "../../constants/env.constants.js";
import { sanitizeMongoData } from "../../db/db.utils.js";
import { getDateToStore } from "../../utils/date.utils.js";
import AppError from "../error/error.service.js";

class ResponseService {
  successResponseHandler(
    req,
    res,
    {
      status = httpStatusConfig.success.message,
      statusCode = httpStatusConfig.success.statusCode,
      message = null,
      data = null,
    } = {},
  ) {
    return res.status(statusCode).json({
      success: true,
      status,
      statusCode,
      message,
      data: sanitizeMongoData(data),
      timestamp: getDateToStore(new Date()),
      metadata:
        MODE === "development"
          ? {
              requestId: req.headers["x-request-id"],
              path: req.originalUrl || req.url,
              method: req.method,
            }
          : null,
    });
  }

  redirectResponseHandler(
    req,
    res,
    {
      status = httpStatusConfig.success.message,
      statusCode = httpStatusConfig.success.statusCode,
      message = null,
      data = null,
    } = {},
  ) {
    const payload = {
      success: true,
      status,
      statusCode,
      message,
      data: sanitizeMongoData(data),
      timestamp: getDateToStore(new Date()),
      metadata:
        MODE === "development"
          ? {
              requestId: req.headers["x-request-id"],
              path: req.originalUrl || req.url,
              method: req.method,
            }
          : null,
    };

    const encoded = encodeURIComponent(JSON.stringify(payload));

    return res.redirect(`${CLIENT_URL}/oauth?data=${encoded}`);
  }

  errorResponseHandler(err, req, res, next) {
    let response;

    const errMessage = err?.message ?? "";

    const logMetadata = {
      path: err?.metadata?.path || req.originalUrl || req.url,
      requestId: err?.requestId || req.headers["x-request-id"],
      isOperational:
        errMessage.startsWith("Unexpected token") ||
        errMessage.startsWith("Expected")
          ? true
          : err?.isOperational || false,
      method: req.method,
    };

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
                path: err?.metadata?.path || req.originalUrl || req.url,
                requestId: err?.requestId || req.headers["x-request-id"],
                isOperational: err?.isOperational || false,
                method: req.method,
              }
            : null,
      };

      logger.logAppError(err, {
        ...response,
        metadata: logMetadata,
      });

      return res.status(err.statusCode).json(response);
    }

    response = {
      success: false,
      status: err.name || httpStatusConfig.internalServerError.statusCode,
      code: err.code || "UNEXPECTED ERROR",
      statusCode:
        err.statusCode || httpStatusConfig.internalServerError.statusCode,
      message:
        errMessage.startsWith("Unexpected token") ||
        errMessage.startsWith("Expected")
          ? "Please provide a valid input!"
          : errMessage || "An unexpected error has occurred!",
      details: null,
      timestamp: getDateToStore(new Date()),
      metadata: MODE === "development" ? logMetadata : null,
    };

    logger.error({ err, extra: response });

    return res
      .status(httpStatusConfig.internalServerError.statusCode)
      .json(response);
  }
}

export const responseService = new ResponseService();
