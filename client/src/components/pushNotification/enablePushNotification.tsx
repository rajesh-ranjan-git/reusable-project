"use client";

import { subscribeToPush } from "@/utils/pushNotifications.utils";

const EnablePushNotification = () => {
  const enable = async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      await subscribeToPush();
      alert("Notifications enabled 🚀");
    }
  };

  return <button onClick={enable}>Enable Notifications</button>;
};

export default EnablePushNotification;
