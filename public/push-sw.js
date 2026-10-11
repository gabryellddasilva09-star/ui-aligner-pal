// Messaging-only service worker for VivaLeve reminders. Does not cache the app.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  event.waitUntil((async () => {
    let msg = { title: "VivaLeve", body: "Você tem um lembrete." };
    try {
      const sub = await self.registration.pushManager.getSubscription();
      if (sub) {
        const res = await fetch("/api/public/push/next", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint }) });
        if (res.ok) msg = await res.json();
      }
    } catch (e) { /* show generic message */ }
    await self.registration.showNotification(msg.title, { body: msg.body, icon: "/icon-192.png", badge: "/icon-192.png", lang: "pt-BR" });
  })());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    if (all[0]) return all[0].focus();
    return self.clients.openWindow("/");
  })());
});
