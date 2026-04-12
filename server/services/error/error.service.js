import { getDateToStore } from "../../utils/date.utils.js";
import { httpStatusConfig } from "../../config/http.config.js";

class AppError extends Error {
  constructor({
    message = "Internal Server Error",
    code = "INTERNAL SERVER ERROR",
    statusCode = 500,
    details = {},
    metadata = { path: null, requestId: null, isOperational: true },
  } = {}) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = "API Error";
    this.message = message;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = getDateToStore(new Date());
    this.metadata = {
      path: metadata.path,
      requestId: metadata.requestId,
      isOperational: metadata.isOperational,
    };

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static from(err, context = {}) {
    if (err instanceof AppError) {
      Object.assign(err, context);
      return err;
    }

    const wrapped = new AppError({
      message: err?.message ?? "An unexpected error occurred",
      code: context.code ?? "UNEXPECTED ERROR",
      statusCode:
        context.statusCode ?? httpStatusConfig.internalServerError.statusCode,
      details: context.details ?? {},
      metadata: {
        path: context.path ?? null,
        requestId: context.requestId ?? null,
        isOperational: context.isOperational ?? false,
      },
    });

    if (err?.stack) {
      wrapped.originalStack = err.stack;
    }

    return wrapped;
  }

  static badRequest({
    message,
    code = httpStatusConfig.badRequest.message,
    details = {},
    ...context
  } = {}) {
    return new AppError({
      message,
      code,
      statusCode: httpStatusConfig.badRequest.statusCode,
      details,
      metadata: {
        ...context,
        isOperational: true,
      },
    });
  }

  static unauthorized({
    message = "Unauthorized Access",
    code = httpStatusConfig.unauthorized.message,
    details = {},
    ...context
  } = {}) {
    return new AppError({
      message,
      code,
      statusCode: httpStatusConfig.unauthorized.statusCode,
      details,
      metadata: {
        ...context,
        isOperational: true,
      },
    });
  }

  static forbidden({
    message = "Forbidden",
    code = httpStatusConfig.forbidden.message,
    details = {},
    ...context
  } = {}) {
    return new AppError({
      message,
      code,
      statusCode: httpStatusConfig.forbidden.statusCode,
      details,
      metadata: {
        ...context,
        isOperational: true,
      },
    });
  }

  static notFound({
    message = "Resource not found",
    code = httpStatusConfig.notFound.message,
    details = {},
    ...context
  } = {}) {
    return new AppError({
      message,
      code,
      statusCode: httpStatusConfig.notFound.statusCode,
      details,
      metadata: {
        ...context,
        isOperational: true,
      },
    });
  }

  static conflict({
    message,
    code = httpStatusConfig.conflict.message,
    details = {},
    ...context
  } = {}) {
    return new AppError({
      message,
      code,
      statusCode: httpStatusConfig.conflict.statusCode,
      details,
      metadata: {
        ...context,
        isOperational: true,
      },
    });
  }

  static unprocessable({
    message,
    code = httpStatusConfig.unprocessableEntity.message,
    details = {},
    ...context
  } = {}) {
    return new AppError({
      message,
      code,
      statusCode: httpStatusConfig.unprocessableEntity.statusCode,
      details,
      metadata: {
        ...context,
        isOperational: true,
      },
    });
  }

  static tooManyRequests({
    message = "Too many requests",
    code = httpStatusConfig.tooManyRequests.message,
    details = {},
    ...context
  } = {}) {
    return new AppError({
      message,
      code,
      statusCode: httpStatusConfig.tooManyRequests.statusCode,
      details,
      metadata: {
        ...context,
        isOperational: true,
      },
    });
  }

  static internal({
    message = "Internal server error",
    code = httpStatusConfig.internalServerError.message,
    details = {},
    ...context
  } = {}) {
    return new AppError({
      message,
      code,
      statusCode: httpStatusConfig.internalServerError.statusCode,
      details,
      metadata: {
        ...context,
        isOperational: false,
      },
    });
  }

  static serviceUnavailable({
    message = "Service unavailable",
    code = httpStatusConfig.serviceUnavailable.message,
    details = {},
    ...context
  } = {}) {
    return new AppError({
      message,
      code,
      statusCode: httpStatusConfig.serviceUnavailable.statusCode,
      details,
      metadata: {
        ...context,
        isOperational: false,
      },
    });
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
        statusCode: this.statusCode,
        details: this.details,
        timestamp: this.timestamp,
        path: this.metadata.path,
        requestId: this.metadata.requestId,
      },
    };
  }
}

export default AppError;
