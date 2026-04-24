import { subscribeToPush } from "@/utils/push.notifications.utils";

const PushNotification = () => {
  const enable = async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      await subscribeToPush();
      alert("Notifications enabled 🚀");
    }
  };

  return <button onClick={enable}>Enable Notifications</button>;
};

export default PushNotification;
