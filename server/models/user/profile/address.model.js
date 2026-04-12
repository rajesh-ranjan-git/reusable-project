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
      enum: ["home", "office", "other"],
      set: (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
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

const Address = mongoose.model("Address", addressSchema);

export default Address;
