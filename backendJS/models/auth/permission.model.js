import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    resource: {
      type: String,
      required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
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

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

permissionSchema.index({ resource: 1, action: 1 }, { unique: true });

export default mongoose.model("Permission", permissionSchema);
