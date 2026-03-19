import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema(
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

export default mongoose.model("SocialLink", socialLinkSchema);
