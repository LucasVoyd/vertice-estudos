// Service Worker Oficial — Vértice Gestão & Ciclo de Estudos
// Garante funcionamento como PWA instalado no Android/iOS/Desktop e gerencia notificações de cronômetro em segundo plano.

const CACHE_NAME = 'vertice-pwa-v4';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Escuta mensagens da aplicação para exibir ou fechar notificações nativas da barra do Android
self.addEventListener('message', event => {
  const data = event.data || {};

  if (data.type === 'SHOW_TIMER_NOTIFICATION') {
    const title = data.title || '⏱️ Cronômetro Vértice em andamento';
    const options = {
      body: data.body || 'Sua sessão de estudos continua sendo contabilizada em segundo plano.',
      tag: data.tag || 'vertice-active-timer',
      renotify: !!data.renotify,
      silent: data.silent !== false,
      requireInteraction: !!data.requireInteraction,
      icon: './favicon.svg',
      badge: './favicon.svg',
      data: { url: './' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
  }

  if (data.type === 'CLEAR_TIMER_NOTIFICATION') {
    const tag = data.tag || 'vertice-active-timer';
    event.waitUntil(
      self.registration.getNotifications({ tag }).then(list => {
        list.forEach(n => n.close());
      })
    );
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('./');
      }
    })
  );
});
