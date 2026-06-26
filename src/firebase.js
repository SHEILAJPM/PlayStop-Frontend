import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDogZURSiE7m-E0mBnO43r6woLg8y_-aTM",
  authDomain: "playstop-33029.firebaseapp.com",
  projectId: "playstop-33029",
  storageBucket: "playstop-33029.firebasestorage.app",
  messagingSenderId: "415357422724",
  appId: "1:415357422724:web:33e1444a6ab7e42f3e86d1",
  measurementId: "G-TB81SE1WZB",
};

const app = initializeApp(firebaseConfig);

let messaging;
try {
  messaging = getMessaging(app);
} catch {
  messaging = null;
}
export { messaging };

export async function requestFCMToken() {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  try {
    const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });
    return token || null;
  } catch {
    return null;
  }
}

export { onMessage };
