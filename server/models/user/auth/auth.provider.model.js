import mongoose from "mongoose";

const authProviderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    provider: {
      type: String,
      enum: ["google", "github", "facebook"],
    },

    providerUserId: {
      type: String,
      required: true,
    },

    accessToken: String,
    refreshToken: String,
  },
  { timestamps: true },
);

authProviderSchema.index({ provider: 1, providerUserId: 1 }, { unique: true });

const AuthProvider = mongoose.model("AuthProvider", authProviderSchema);

export default AuthProvider;
