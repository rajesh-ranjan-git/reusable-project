import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
      index: true,
      set: (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("account", {
  ref: "Account",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

userSchema.virtual("profile", {
  ref: "Profile",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

const User = mongoose.model("User", userSchema);

export default User;
