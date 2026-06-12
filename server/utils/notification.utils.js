import { toTitleCase } from "./common.utils.js";

export const getNotificationBody = (name, type) => {
  if (type === "chat") {
    return `${toTitleCase(name)} sent you a message.`;
  }

  return "You have a new notification.";
};
