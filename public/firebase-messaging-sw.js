importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDogZURSiE7m-E0mBnO43r6woLg8y_-aTM",
  authDomain: "playstop-33029.firebaseapp.com",
  projectId: "playstop-33029",
  storageBucket: "playstop-33029.firebasestorage.app",
  messagingSenderId: "415357422724",
  appId: "1:415357422724:web:33e1444a6ab7e42f3e86d1",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notif = payload.notification || {};
  self.registration.showNotification(notif.title || 'PlayStop', {
    body: notif.body || '',
    icon: notif.icon || '/favicon.svg',
    badge: '/favicon.svg',
    tag: payload.data?.tag || 'playstop',
    data: { url: payload.data?.url || '/' },
  });
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/'));
});
