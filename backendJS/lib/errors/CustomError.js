import { errorsConfig, errorTypesConfig } from "../../config/config.js";

class ErrorHandlerManager {
  constructor() {
    if (ErrorHandlerManager.instance) {
      return ErrorHandlerManager.instance;
    }

    this.config = {
      logToConsole: true,
      logLevel: "error",
      onError: null,
    };

    this.errorLog = [];

    ErrorHandlerManager.instance = this;
  }

  configure(options = {}) {
    this.config = { ...this.config, ...options };
  }

  logError(errorObject) {
    this.errorLog.push(errorObject);

    if (this.config.logToConsole) {
      this._logToConsole(errorObject);
    }

    if (typeof this.config.onError === "function") {
      try {
        this.config.onError(errorObject);
      } catch (callbackError) {
        logger.error("❌ onError callback failed:", callbackError);
      }
    }
  }

  _logToConsole(errorObject) {
    const logMessage = `(${errorObject.status}) [${errorObject.type}] ${errorObject.name} - ${errorObject.message}`;

    switch (this.config.logLevel) {
      case "error":
        logger.error(logMessage);
        break;
      case "warn":
        logger.warn(logMessage);
        break;
      case "info":
        logger.info(logMessage);
        break;
      case "debug":
        logger.debug(logMessage);
        break;
      default:
        logger.log(logMessage);
    }
  }

  getErrors() {
    return [...this.errorLog];
  }

  getErrorsByType(type) {
    return this.errorLog.filter((err) => err.type === type);
  }

  getLastError() {
    return this.errorLog.at(-1) || null;
  }

  getErrorCount() {
    return this.errorLog.length;
  }

  clearErrors() {
    this.errorLog = [];
  }
}

const errorManager = new ErrorHandlerManager();

class CustomError extends Error {
  constructor({
    status = errorsConfig.internalServerError.statusCode,
    type = errorsConfig.internalServerError.type,
    name = errorsConfig.internalServerError.title,
    message = errorsConfig.internalServerError.message,
    apiUrl = "",
    data = null,
  }) {
    super(message);

    this.status = status;
    this.type = type;
    this.name = name;
    this.apiUrl = apiUrl;
    this.data = data;
    this.isOperational = true;
    this.timestamp = new Date().toISOString();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    errorManager.logError(this.toJSON());

    Object.freeze(this);
  }

  toJSON() {
    return {
      status: this.status,
      type: this.type,
      name: this.name,
      message: this.message,
      apiUrl: this.apiUrl,
      data: this.data,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

const throwError = (ErrorClass, options) => {
  throw new ErrorClass(options);
};

class NetworkError extends CustomError {
  constructor(options) {
    super({
      ...options,
      status: errorsConfig.networkError.statusCode,
      type: errorsConfig.networkError.type,
      name: errorsConfig.networkError.title,
      message: errorsConfig.networkError.message,
    });
  }
}

class DatabaseConfigError extends CustomError {
  constructor(options) {
    super({
      ...options,
      status: errorsConfig.dbConfigError.statusCode,
      type: errorsConfig.dbConfigError.type,
      name: errorsConfig.dbConfigError.title,
      message: errorsConfig.dbConfigError.message,
    });
  }
}

class DatabaseError extends CustomError {
  constructor(options) {
    super({ ...options, type: errorTypesConfig.dbError });
  }
}

class ValidationError extends CustomError {
  constructor(options) {
    super({ ...options, type: errorTypesConfig.validationError });
  }
}

class BcryptError extends CustomError {
  constructor(options) {
    super({ ...options, type: errorTypesConfig.bcryptError });
  }
}

class JwtError extends CustomError {
  constructor(options) {
    super({ ...options, type: errorTypesConfig.jwtError });
  }
}

class AuthenticationError extends CustomError {
  constructor(options) {
    super({ ...options, type: errorTypesConfig.authenticationError });
  }
}

class AuthorizationError extends CustomError {
  constructor(options) {
    super({ ...options, type: errorTypesConfig.authorizationError });
  }
}

class ForbiddenError extends CustomError {
  constructor(options) {
    super({ ...options, type: errorTypesConfig.forbiddenError });
  }
}

class ConnectionError extends CustomError {
  constructor(options) {
    super({ ...options, type: errorTypesConfig.connectionError });
  }
}

class NotificationError extends CustomError {
  constructor(options) {
    super({ ...options, type: errorTypesConfig.notificationError });
  }
}

errorManager.configure({
  logToConsole: true,
  logLevel: "error",
  onError: (error) => {
    if (process.env.MODE_ENV === "development") {
      console.error("❌ ERROR LOG\n", {
        statusCode: error?.status,
        type: error?.type,
        status: error?.name,
        message: error?.message,
        url: error?.apiUrl || "",
        data: error?.data,
        timestamp: error?.timestamp,
      });

      console.error("❌ STACK TRACE |", error?.stack);
    }
  },
});

export {
  CustomError,
  NetworkError,
  DatabaseConfigError,
  ValidationError,
  DatabaseError,
  BcryptError,
  JwtError,
  AuthenticationError,
  AuthorizationError,
  ForbiddenError,
  ConnectionError,
  NotificationError,
  errorManager,
  throwError,
};

export default CustomError;
