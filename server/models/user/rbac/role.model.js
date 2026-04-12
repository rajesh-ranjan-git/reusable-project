import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    description: String,

    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],

    inherits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],

    isSystem: {
      type: Boolean,
      default: true,
    },

    priority: {
      type: Number,
      default: 0,
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

roleSchema.pre("save", function (next) {
  this.permissions = [...new Set(this.permissions.map(String))];
  next();
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
