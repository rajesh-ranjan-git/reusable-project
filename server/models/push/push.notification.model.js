import mongoose from "mongoose";

const pushNotificationSchema = new mongoose.Schema(
  {
    endpoint: {
      type: String,
      required: true,
      unique: true,
    },

    keys: {
      p256dh: {
        type: String,
        required: true,
      },
      auth: {
        type: String,
        required: true,
      },
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    expirationTime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const PushNotification = mongoose.model(
  "PushNotification",
  pushNotificationSchema,
);

export default PushNotification;
