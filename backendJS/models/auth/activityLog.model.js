import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    action: {
      type: String,
      required: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },

    ipAddress: String,
  },
  { timestamps: true },
);

export default mongoose.model("ActivityLog", activityLogSchema);
