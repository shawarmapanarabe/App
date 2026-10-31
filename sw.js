importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(fetch(e.request));
});

/* REAPERTURA Y ACTUALIZACIÓN AL TOCAR NOTIFICACIÓN */
self.addEventListener('notificationclick', function(e) {
  var notif = e.notification;
  var targetUrl = (notif.data && notif.data.url) ? notif.data.url : (notif.launchUrl || '/App/');
  notif.close();

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if ('focus' in client) {
          if ('navigate' in client && targetUrl) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow && targetUrl) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
