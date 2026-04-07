import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SALT_ROUNDS } from "../constants/common.constants.js";
import {
  httpStatusConfig,
  jwtKnownErrorsConfig,
  timelineConfig,
} from "../config/common.config.js";

export const getEncryptedPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (!hashedPassword) {
    throw new AppError({
      message: "We were unable to encrypt your password!",
      code: "PASSWORD ENCRYPTION FAILED",
      statusCode: httpStatusConfig.internalServerError.statusCode,
      details: { password: hashedPassword },
    });
  }

  return hashedPassword;
};

export const getJwtToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  if (!token) {
    throw new AppError({
      message: "We were unable to generate token!",
      code: "TOKEN GENERATION FAILED",
      statusCode: httpStatusConfig.internalServerError.statusCode,
      details: { token },
    });
  }

  return token;
};

export const verifyJwtToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decodedToken) {
      throw AppError.unauthorized({
        message: "You are not authorized to access this resource!",
        details: { token: decodedToken },
      });
    }

    return decodedToken.id;
  } catch (error) {
    if (error.name === jwtKnownErrorsConfig.tokenExpiredError) {
      throw new AppError({
        message: "The provided token is expired!",
        code: "TOKEN EXPIRED",
        statusCode: httpStatusConfig.unauthorized.statusCode,
        details: { token },
      });
    } else if (error.name === jwtKnownErrorsConfig.jwtError) {
      throw new AppError({
        message: "The provided token is invalid!",
        code: "INVALID TOKEN",
        statusCode: httpStatusConfig.unauthorized.statusCode,
        details: { token },
      });
    } else if (error.name === jwtKnownErrorsConfig.notBeforeError) {
      throw new AppError({
        message:
          "We were unable to process token as we got 'Not before token' error!",
        code: "NOT BEFORE ERROR",
        statusCode: httpStatusConfig.internalServerError.statusCode,
        details: { token },
      });
    } else {
      throw new AppError({
        message: "We were unable to verify the token!",
        code: "TOKEN VERIFICATION FAILED",
        statusCode: httpStatusConfig.internalServerError.statusCode,
        details: { token },
      });
    }
  }
};

export const comparePassword = async (incomingPassword, existingPassword) => {
  const isPasswordCorrect = await bcrypt.compare(
    incomingPassword,
    existingPassword,
  );

  if (isPasswordCorrect === undefined || isPasswordCorrect === null) {
    throw new AppError({
      message: "We were unable to verify the credentials!",
      code: "CREDENTIALS VERIFICATION FAILED",
      statusCode: httpStatusConfig.internalServerError.statusCode,
      details: { password: incomingPassword },
    });
  }

  return isPasswordCorrect;
};

export const isPasswordExpired = (passwordLastUpdated) => {
  return (
    Date.now() - new Date(passwordLastUpdated).getTime() >
    timelineConfig.threeMonths
  );
};
