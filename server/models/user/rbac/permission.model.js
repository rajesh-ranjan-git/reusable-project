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
      enum: ["create", "read", "update", "delete", "manage"],
      required: true,
      index: true,
    },

    scope: {
      type: String,
      enum: ["own", "any"],
      default: "any",
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

permissionSchema.index({ resource: 1, action: 1, scope: 1 }, { unique: true });

permissionSchema.pre("validate", function (next) {
  if (!this.key) return next();

  if (this.key) {
    const [resource, action, scope] = this.key.split(":");

    this.resource = resource;
    this.action = action;
    this.scope = scope || "any";
  }
  next();
});

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;
