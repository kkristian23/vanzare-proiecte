importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCQn5VtFAHKNQy9OxLLD2wi6Q_Jb2y7l1g",
  authDomain: "dateevent.firebaseapp.com",
  databaseURL: "https://dateevent-default-rtdb.firebaseio.com",
  projectId: "dateevent",
  storageBucket: "dateevent.appspot.com",
  messagingSenderId: "566790015312",
  appId: "1:566790015312:web:7d47b5dd6e222582c94455"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);
  const title = payload.notification?.title || payload.data?.title || 'Eveniment';
  const body = payload.notification?.body || payload.data?.body || '';
  const options = {
    body,
    icon: '/iqcalendar/icon-192x192.png'
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (allClients.length > 0) {
      allClients[0].focus();
    } else {
      await self.clients.openWindow('/');
    }
  })());
});
