// public/service-worker.js

// Listen for incoming push messages
self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  // The payload was sent as JSON { title, message }
  const { title, message } = event.data.json();

  const options = {
    body: message,
    icon: "/icons/icon-192x192.png", // adjust path if needed
    badge: "/icons/badge-72x72.png" // adjust path if needed
    // you can add other options here: actions, vibrate, data, etc.
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click (e.g. focus/open the app)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If there’s already an open window/tab, focus it
        for (const client of clientList) {
          if (client.url === "/" && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window/tab to the homepage
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      })
  );
});
