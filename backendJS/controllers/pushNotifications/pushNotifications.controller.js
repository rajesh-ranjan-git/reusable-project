import webpush from "web-push";
import {
  VAPID_PRIVATE_KEY,
  VAPID_PUBLIC_KEY,
} from "../../constants/env.constants.js";
import { httpStatusConfig } from "../../config/common.config.js";
import { successResponseHandler } from "../../utils/response.utils.js";
import PushNotificationSubscription from "../../models/pushNotificationSubscription/pushNotificationSubscription.model.js";

const vapidEmail = process.env.VAPID_EMAIL || "mailto:admin@example.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(vapidEmail, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export const subscribe = async (req, res, next) => {
  try {
    const subscription = req.data.body;

    await PushNotificationSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      subscription,
      { upsert: true, new: true },
    );

    successResponseHandler(req, res, {
      status: "SUBSCRIPTION SUCCESS",
      statusCode: httpStatusConfig.created.statusCode,
      message: "Subscribed to push notifications successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const sendPushNotification = async (subscription) => {
  await webpush.sendNotification(
    subscription,
    JSON.stringify({
      title: "🔥 New Update",
      body: "Something important happened!",
      url: "/admin",
    }),
  );
};
