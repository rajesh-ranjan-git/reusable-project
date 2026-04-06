self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};

  self.registration.showNotification(data.title || "New Notification", {
    body: data.body || "You have a message",
    icon: "/assets/logo/app-log.webp",
    badge: "/assets/logo/app-logo.webp",
    data: {
      url: data.url || "/",
    },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data.url));
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  const requests = await getStoredRequests();

  for (const req of requests) {
    await fetch(req.url, req.options);
  }

  await clearStoredRequests();
}
