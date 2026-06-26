import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'playstop-reminders';

function fireNotification({ title, body, url }) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const notif = new Notification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: url,
    requireInteraction: false,
  });
  notif.onclick = () => {
    window.focus();
    window.location.href = url;
    notif.close();
  };
}

function loadReminders() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function saveReminders(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useLocalReminders() {
  const [permission, setPermission] = useState(
    () => ('Notification' in window ? Notification.permission : 'denied')
  );

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'denied';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  // Schedule a reminder — persisted to localStorage and fired via setTimeout if within 24h
  const scheduleReminder = useCallback(({ id, title, body, fireAt, url = '/dashboard' }) => {
    const reminders = loadReminders();
    const entry = { id, title, body, fireAt: fireAt instanceof Date ? fireAt.getTime() : fireAt, url };
    saveReminders([...reminders.filter(r => r.id !== id), entry]);

    const msUntil = entry.fireAt - Date.now();
    if (msUntil > 0 && msUntil <= 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        fireNotification(entry);
        // remove after firing
        saveReminders(loadReminders().filter(r => r.id !== id));
      }, msUntil);
    }
  }, []);

  const cancelReminder = useCallback((id) => {
    saveReminders(loadReminders().filter(r => r.id !== id));
  }, []);

  // On mount: pick up any reminders that fall within the next 24h
  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = Date.now();
    const reminders = loadReminders();
    const stillActive = [];

    reminders.forEach(r => {
      const msUntil = r.fireAt - now;
      if (msUntil <= 0) return; // already past
      stillActive.push(r);
      if (msUntil <= 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          fireNotification(r);
          saveReminders(loadReminders().filter(x => x.id !== r.id));
        }, msUntil);
      }
    });

    saveReminders(stillActive);
  }, []);

  return { permission, requestPermission, scheduleReminder, cancelReminder };
}
