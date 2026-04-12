import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["email_verification", "password_reset"],
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

const VerificationToken = mongoose.model(
  "VerificationToken",
  verificationTokenSchema,
);

export default VerificationToken;
