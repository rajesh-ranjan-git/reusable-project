import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    timestamp: { type: String, required: true },
    level: {
      type: String,
      enum: ["error", "warn", "info", "debug"],
      required: true,
    },
    mode: { type: String },
    message: { type: String, required: true },
    code: { type: String, default: "LOG" },
    statusCode: { type: Number },
    details: { type: mongoose.Schema.Types.Mixed },
    path: { type: String },
    requestId: { type: String },
    isOperational: { type: Boolean },
    stack: { type: String },
    originalStack: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  {
    collection: "logs",
    versionKey: false,
  },
);

logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const Log = mongoose.model("Log", logSchema);
export default Log;
