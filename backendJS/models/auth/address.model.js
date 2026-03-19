import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    type: {
      type: String,
      enum: ["home", "office"],
    },

    street: String,
    city: String,
    state: String,
    country: String,
    pinCode: String,

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Address", addressSchema);
