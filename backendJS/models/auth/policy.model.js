import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    effect: {
      type: String,
      enum: ["ALLOW", "DENY"],
      required: true,
    },

    actions: [{ type: String }],

    resources: [{ type: String }],

    conditions: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      /*
        Example:
        {
          "ownerOnly": true,
          "ip": "127.0.0.1"
        }
      */
    },

    priority: {
      type: Number,
      default: 0,
    },

    isSystem: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Policy", policySchema);
