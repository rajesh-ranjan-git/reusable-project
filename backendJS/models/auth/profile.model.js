import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      index: true,
    },

    userName: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true,
    },

    firstName: String,
    lastName: String,

    bio: String,

    avatarUrl: String,
    coverPhotoUrl: String,

    company: String,
    jobProfile: String,

    skills: [String],
    interests: [String],
  },
  { timestamps: true },
);

export default mongoose.model("Profile", profileSchema);
