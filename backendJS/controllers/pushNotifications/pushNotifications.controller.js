import webpush from "web-push";
import {
  VAPID_PRIVATE_KEY,
  VAPID_PUBLIC_KEY,
} from "../../constants/common.constants.js";
import { httpStatusConfig } from "../../config/common.config.js";
import { successResponseHandler } from "../../utils/response.utils.js";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:your@email.com",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY,
  );
}

export const subscribe = async (req, res) => {
  const subscription = req.data.body;

  subscriptions.push(subscription);

  successResponseHandler(req, res, {
    status: "SUBSCRIPTION SUCCESS",
    statusCode: httpStatusConfig.created.statusCode,
    message: "Subscribed to push notifications successfully!",
  });
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
