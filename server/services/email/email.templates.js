import React from "react";

const e = React.createElement;

const styles = {
  body: {
    backgroundColor: "#f6f7fb",
    color: "#111827",
    fontFamily:
      "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    margin: 0,
    padding: "32px 16px",
  },
  container: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    margin: "0 auto",
    maxWidth: "600px",
    padding: "32px",
  },
  eyebrow: {
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0",
    margin: "0 0 12px",
    textTransform: "uppercase",
  },
  heading: {
    color: "#111827",
    fontSize: "24px",
    lineHeight: "32px",
    margin: "0 0 16px",
  },
  paragraph: {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 16px",
  },
  muted: {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "22px",
    margin: "0 0 16px",
  },
  button: {
    backgroundColor: "#4f46e5",
    borderRadius: "6px",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "16px",
    fontWeight: "700",
    margin: "8px 0 24px",
    padding: "12px 20px",
    textDecoration: "none",
  },
  dangerButton: {
    backgroundColor: "#dc2626",
  },
  successButton: {
    backgroundColor: "#059669",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "24px 0",
  },
  link: {
    color: "#4f46e5",
    wordBreak: "break-all",
  },
};

const emailLayout = ({ appName, children, preview }) => {
  return e(
    "html",
    null,
    e("head", null, e("title", null, preview)),
    e(
      "body",
      { style: styles.body },
      e(
        "div",
        { style: styles.container },
        e("p", { style: styles.eyebrow }, appName),
        children,
      ),
    ),
  );
};

const actionLink = ({ href, label, variant }) => {
  const variantStyle =
    variant === "danger"
      ? styles.dangerButton
      : variant === "success"
        ? styles.successButton
        : null;

  return e(
    "a",
    {
      href,
      style: {
        ...styles.button,
        ...variantStyle,
      },
    },
    label,
  );
};

const fallbackUrl = ({ url }) => {
  return e(
    React.Fragment,
    null,
    e("hr", { style: styles.divider }),
    e(
      "p",
      { style: styles.muted },
      "If the button does not work, copy and paste this URL into your browser:",
    ),
    e("a", { href: url, style: styles.link }, url),
  );
};

export const verificationEmail = ({ appName, verificationUrl }) => {
  return e(
    emailLayout,
    {
      appName,
      preview: `Verify your ${appName} email address`,
    },
    e("h1", { style: styles.heading }, "Verify your email"),
    e(
      "p",
      { style: styles.paragraph },
      "Thanks for signing up for ",
      e("strong", null, appName),
      ". Confirm your email address to finish setting up your account.",
    ),
    e(actionLink, { href: verificationUrl, label: "Verify email" }),
    e(
      "p",
      { style: styles.muted },
      "This link expires in 24 hours. If you did not create an account, you can ignore this email.",
    ),
    e(fallbackUrl, { url: verificationUrl }),
  );
};

export const passwordResetEmail = ({ appName, resetUrl }) => {
  return e(
    emailLayout,
    {
      appName,
      preview: `Reset your ${appName} password`,
    },
    e("h1", { style: styles.heading }, "Reset your password"),
    e(
      "p",
      { style: styles.paragraph },
      "We received a request to reset the password for your ",
      e("strong", null, appName),
      " account.",
    ),
    e(actionLink, {
      href: resetUrl,
      label: "Reset password",
      variant: "danger",
    }),
    e(
      "p",
      { style: styles.muted },
      "This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.",
    ),
    e(fallbackUrl, { url: resetUrl }),
  );
};

export const welcomeEmail = ({ appName, profileUrl, userName }) => {
  return e(
    emailLayout,
    {
      appName,
      preview: `Welcome to ${appName}`,
    },
    e("h1", { style: styles.heading }, `Welcome to ${appName}`),
    e(
      "p",
      { style: styles.paragraph },
      "Hi ",
      e("strong", null, userName || "there"),
      ",",
    ),
    e(
      "p",
      { style: styles.paragraph },
      "Your account is all set up and ready to go.",
    ),
    e(actionLink, {
      href: profileUrl,
      label: "Go to your profile",
      variant: "success",
    }),
    e(
      "p",
      { style: styles.muted },
      "If you have any questions, feel free to reach out to support.",
    ),
  );
};

export const accountLockedEmail = ({ appName, resetPasswordUrl }) => {
  return e(
    emailLayout,
    {
      appName,
      preview: `Your ${appName} account is temporarily locked`,
    },
    e("h1", { style: styles.heading }, "Account temporarily locked"),
    e(
      "p",
      { style: styles.paragraph },
      "Your ",
      e("strong", null, appName),
      " account has been temporarily locked due to multiple failed login attempts.",
    ),
    e(
      "p",
      { style: styles.paragraph },
      "Your account will be automatically unlocked after ",
      e("strong", null, "2 hours"),
      ".",
    ),
    e(
      "p",
      { style: styles.muted },
      "If this was not you, reset your password immediately.",
    ),
    e(actionLink, {
      href: resetPasswordUrl,
      label: "Reset password",
      variant: "danger",
    }),
  );
};
