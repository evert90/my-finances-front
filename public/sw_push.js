self.addEventListener('push', (event) => {
    console.log("PUSH", event)
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Default Title';
    const options = {
      body: data.body || 'Default body content',
      icon: data.icon || 'icons/icon-192x192.png',
      badge: data.badge || 'icons/badge.png',
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('http://localhost:3000') // Change to your Next.js app URL
    );
  });