import mongoose from "mongoose";

const userRoleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      index: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "REVOKED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

userRoleSchema.index({ user: 1, role: 1 }, { unique: true });

export default mongoose.model("UserRole", userRoleSchema);
