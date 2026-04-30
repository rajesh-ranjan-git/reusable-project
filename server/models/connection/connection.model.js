import mongoose from "mongoose";

const connectionSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    connectionStatus: {
      type: String,
      enum: ["interested", "not-interested", "accepted", "rejected", "blocked"],
      required: true,
      default: "interested",
      set: (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
    },
    rejectedBySenderCount: {
      type: Number,
      required: true,
      default: 0,
      max: 5,
    },
    rejectedByReceiverCount: {
      type: Number,
      required: true,
      default: 0,
      max: 5,
    },
    lastActionedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;
