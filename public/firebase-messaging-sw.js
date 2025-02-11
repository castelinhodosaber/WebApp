/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

// Use importScripts para importar os SDKs do Firebase
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js"
);

// Não inicializar o Firebase aqui! O Firebase será inicializado diretamente no Context, e o SW apenas usará a configuração.

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Este código manipula mensagens recebidas em segundo plano
self.addEventListener("push", (event) => {
  const payload = event.data.json();
  const notificationTitle = payload.notification?.title || "";
  const notificationOptions = {
    body: payload.notification?.body || {},
    icon: "/assets/icons/icon-192x192.png",
    badge: "/assets/icons/icon-192x192.png",
    data: { clickAction: "https://app.castelinhodosaber.com/teacher/meal" },
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// Lidar com cliques na notificação
self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notificação clicada:", event.notification);
  event.notification.close();
  if (event.notification.data && event.notification.data.clickAction) {
    event.waitUntil(clients.openWindow(event.notification.data.clickAction));
  }
});
