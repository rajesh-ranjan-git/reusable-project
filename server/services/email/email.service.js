import nodemailer from "nodemailer";
import {
  CLIENT_URL,
  EMAIL_FROM_ADDRESS,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
} from "../../constants/env.constants.js";
import { appConfig } from "../../config/common.config.js";
import { httpStatusConfig } from "../../config/http.config.js";
import AppError from "../../services/error/error.service.js";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: SMTP_SECURE === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  async send({ to, subject, html, text }) {
    try {
      throw new AppError({
        message: "Email Service is not activated right now!",
        code: "EMAIL SERVICE FAILED",
        statusCode: httpStatusConfig.continue.statusCode,
      });

      const info = await this.transporter.sendMail({
        from: EMAIL_FROM_ADDRESS,
        to,
        subject,
        text,
        html,
      });

      return info;
    } catch (error) {
      logger.error("[EmailService] Failed to send email:", error);
    }
  }

  async sendVerificationEmail(to, token) {
    const verificationUrl = `${CLIENT_URL}/auth/verify-email?token=${token}`;

    await this.send({
      to,
      subject: `Verify your email – ${appConfig.name}`,
      text: `Please verify your email by visiting: ${verificationUrl}\n\nThis link expires in 24 hours.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email</h2>
          <p>Thanks for signing up for <strong>${appConfig.name}</strong>. Click the button below to verify your email address.</p>
          <a href="${verificationUrl}"
             style="display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0;">
            Verify Email
          </a>
          <p style="color:#6B7280;font-size:14px;">This link expires in <strong>24 hours</strong>. If you didn't create an account, you can ignore this email.</p>
          <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0;" />
          <p style="color:#9CA3AF;font-size:12px;">If the button doesn't work, copy and paste this URL: ${verificationUrl}</p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(to, token) {
    const resetUrl = `${CLIENT_URL}/auth/reset-password?token=${token}`;

    await this.send({
      to,
      subject: `Reset your password – ${appConfig.name}`,
      text: `Reset your password by visiting: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>We received a request to reset the password for your <strong>${appConfig.name}</strong> account.</p>
          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 24px;background:#DC2626;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0;">
            Reset Password
          </a>
          <p style="color:#6B7280;font-size:14px;">This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email — your password will not change.</p>
          <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0;" />
          <p style="color:#9CA3AF;font-size:12px;">If the button doesn't work, copy and paste this URL: ${resetUrl}</p>
        </div>
      `,
    });
  }

  async sendWelcomeEmail(to, userName) {
    await this.send({
      to,
      subject: `Welcome to ${appConfig.name}! 🎉`,
      text: `Hi ${userName || "there"},\n\nWelcome to ${appConfig.name}! We're excited to have you on board.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to ${appConfig.name}! 🎉</h2>
          <p>Hi <strong>${userName || "there"}</strong>,</p>
          <p>We're thrilled to have you on board. Your account is all set up and ready to go.</p>
          <a href="${CLIENT_URL}/dashboard"
             style="display:inline-block;padding:12px 24px;background:#10B981;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0;">
            Go to Dashboard
          </a>
          <p style="color:#6B7280;font-size:14px;">If you have any questions, feel free to reach out to our support team.</p>
        </div>
      `,
    });
  }

  async sendAccountLockedEmail(to) {
    await this.send({
      to,
      subject: `Your account has been temporarily locked – ${appConfig.name}`,
      text: `Your account has been temporarily locked due to multiple failed login attempts. It will be automatically unlocked after 2 hours.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Account Temporarily Locked</h2>
          <p>Your <strong>${appConfig.name}</strong> account has been temporarily locked due to multiple failed login attempts.</p>
          <p>Your account will be automatically unlocked after <strong>2 hours</strong>.</p>
          <p>If this wasn't you, please reset your password immediately.</p>
          <a href="${CLIENT_URL}/auth/forgot-password"
             style="display:inline-block;padding:12px 24px;background:#DC2626;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0;">
            Reset Password
          </a>
        </div>
      `,
    });
  }
}

export const emailService = new EmailService();
