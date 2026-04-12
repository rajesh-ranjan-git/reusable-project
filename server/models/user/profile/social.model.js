import mongoose from "mongoose";

const socialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      index: true,
    },

    facebook: String,
    instagram: String,
    twitter: String,
    github: String,
    linkedin: String,
    youtube: String,
    website: String,
  },
  { timestamps: true },
);

const Social = mongoose.model("Social", socialSchema);

export default Social;
