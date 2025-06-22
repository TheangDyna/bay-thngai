// public/service-worker.js
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const { title, message, icon, badge, data } = event.data.json();

  const options = {
    body: message,
    icon: "/bay-thngai-logo.svg",
    data // Store URL for click handling
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if a client is already open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // Open new window/tab to the specific discount page
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
