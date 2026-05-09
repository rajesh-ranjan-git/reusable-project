import { render } from "@react-email/render";
import { Resend } from "resend";
import {
  CLIENT_URL,
  EMAIL_FROM_ADDRESS,
  EMAIL_TO_ADDRESS,
  RESEND_API_KEY,
} from "../../constants/env.constants.js";
import { appConfig } from "../../config/common.config.js";
import { httpStatusConfig } from "../../config/http.config.js";
import AppError from "../../services/error/error.service.js";
import logger from "../../services/logger/logger.service.js";
import {
  accountLockedEmail,
  passwordResetEmail,
  verificationEmail,
  welcomeEmail,
} from "./email.templates.js";

class EmailService {
  constructor() {
    this.resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
  }

  async send({ to, subject, template }) {
    try {
      if (to.endsWith("@server.com")) {
        throw new AppError({
          message: "Email Service is not available for local accounts!",
          code: "EMAIL SERVICE FAILED",
          statusCode: httpStatusConfig.serviceUnavailable.statusCode,
        });
      }

      if (!this.resend || !EMAIL_FROM_ADDRESS) {
        throw new AppError({
          message: "Email Service is not configured!",
          code: "EMAIL SERVICE FAILED",
          statusCode: httpStatusConfig.serviceUnavailable.statusCode,
        });
      }

      const html = await render(template);

      const text = await render(template, { plainText: true });

      const { data, error } = await this.resend.emails.send({
        from: EMAIL_FROM_ADDRESS,
        to: EMAIL_TO_ADDRESS,
        subject,
        html,
        text,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error("[EmailService] Failed to send email:", error);
      return null;
    }
  }

  async sendVerificationEmail(to, token) {
    try {
      if (to.endsWith("@server.com")) {
        throw new AppError({
          message: "Email Service is not available for local accounts!",
          code: "EMAIL SERVICE FAILED",
          statusCode: httpStatusConfig.serviceUnavailable.statusCode,
        });
      }

      const verificationUrl = `${CLIENT_URL}/verify-email?token=${token}`;

      await this.send({
        to: EMAIL_TO_ADDRESS,
        subject: `Verify your email - ${appConfig.name}`,
        template: verificationEmail({
          appName: appConfig.name,
          verificationUrl,
        }),
      });
    } catch (error) {
      logger.error("[EmailService] Failed to send email:", error);
      return null;
    }
  }

  async sendPasswordResetEmail(to, token) {
    try {
      if (to.endsWith("@server.com")) {
        throw new AppError({
          message: "Email Service is not available for local accounts!",
          code: "EMAIL SERVICE FAILED",
          statusCode: httpStatusConfig.serviceUnavailable.statusCode,
        });
      }

      const resetUrl = `${CLIENT_URL}/reset-password?token=${token}`;

      await this.send({
        to: EMAIL_TO_ADDRESS,
        subject: `Reset your password - ${appConfig.name}`,
        template: passwordResetEmail({
          appName: appConfig.name,
          resetUrl,
        }),
      });
    } catch (error) {
      logger.error("[EmailService] Failed to send email:", error);
      return null;
    }
  }

  async sendWelcomeEmail(to, userName) {
    try {
      if (to.endsWith("@server.com")) {
        throw new AppError({
          message: "Email Service is not available for local accounts!",
          code: "EMAIL SERVICE FAILED",
          statusCode: httpStatusConfig.serviceUnavailable.statusCode,
        });
      }

      await this.send({
        to: EMAIL_TO_ADDRESS,
        subject: `Welcome to ${appConfig.name}!`,
        template: welcomeEmail({
          appName: appConfig.name,
          profileUrl: `${CLIENT_URL}/profile`,
          userName,
        }),
      });
    } catch (error) {
      logger.error("[EmailService] Failed to send email:", error);
      return null;
    }
  }

  async sendAccountLockedEmail(to) {
    try {
      if (to.endsWith("@server.com")) {
        throw new AppError({
          message: "Email Service is not available for local accounts!",
          code: "EMAIL SERVICE FAILED",
          statusCode: httpStatusConfig.serviceUnavailable.statusCode,
        });
      }

      await this.send({
        to: EMAIL_TO_ADDRESS,
        subject: `Your account has been temporarily locked - ${appConfig.name}`,
        template: accountLockedEmail({
          appName: appConfig.name,
          resetPasswordUrl: `${CLIENT_URL}/forgot-password`,
        }),
      });
    } catch (error) {
      logger.error("[EmailService] Failed to send email:", error);
      return null;
    }
  }
}

export const emailService = new EmailService();
