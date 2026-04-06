import { saveRequest } from "@/utils/indexedDb.utils";

export const subscribeToPush = async () => {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    ),
  });

  await fetch("/api/push-notifications/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export const sendWithSync = async (url: string, options: RequestInit) => {
  try {
    await fetch(url, options);
  } catch (err) {
    const registration = await navigator.serviceWorker.ready;

    if ("sync" in registration) {
      try {
        await (registration as any).sync.register("sync-data");
      } catch (err) {
        console.error("Sync registration failed", err);
      }
    } else {
      console.warn("Background Sync not supported in this browser");
    }
  }
};
