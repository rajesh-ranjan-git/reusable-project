import { httpStatusConfig } from "../config/http.config.js";
import AppError from "../services/error/error.service.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../validators/request.validator.js";

export const requestMiddleware = (options = {}) => {
  return (req, res, next) => {
    try {
      const {
        requireBody = false,
        requireParams = false,
        requireQuery = false,
      } = options;

      if (!req) {
        throw new AppError({
          message: "The request contains invalid or missing information!",
          code: "INVALID REQUEST",
          statusCode: httpStatusConfig.notAcceptable.statusCode,
          details: { req },
        });
      }

      const params = validateParams(req, requireParams) || {};
      const query = validateQuery(req, requireQuery) || {};
      const body = validateBody(req, requireBody) || {};

      req.data = { params, query, body };

      next();
    } catch (error) {
      next(error);
    }
  };
};
