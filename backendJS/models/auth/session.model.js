import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },

    device: String,

    ipAddress: String,

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Session", sessionSchema);
