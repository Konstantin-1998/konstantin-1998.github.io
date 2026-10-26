// Service Worker: устанавливаемость PWA + приём push-уведомлений
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Сеть напрямую (приложение всегда свежее), обработчик нужен для устанавливаемости
self.addEventListener('fetch', () => {});

self.addEventListener('push', (event) => {
  let data = { title: 'Корпоративный мессенджер', body: 'У вас новое событие' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (_) {
    if (event.data) data.body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.svg',
      badge: '/icon.svg',
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      if (clients.length) return clients[0].focus();
      return self.clients.openWindow('/');
    }),
  );
});
