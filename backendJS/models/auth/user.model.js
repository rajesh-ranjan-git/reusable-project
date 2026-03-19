import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
      index: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      index: true,
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
