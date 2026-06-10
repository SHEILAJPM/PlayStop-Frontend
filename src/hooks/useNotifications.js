import { useState, useEffect, useRef, useCallback } from 'react';

let idSeq = 0;

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const esRef = useRef(null);

  const addNotification = useCallback((notif) => {
    const id = ++idSeq;
    const full = { ...notif, id, read: false, time: new Date() };
    setNotifications((prev) => [full, ...prev.slice(0, 49)]);
    setToasts((prev) => [...prev, full]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  useEffect(() => {
    // SSE desactivado hasta que el backend implemente el endpoint.
    // Activar con VITE_SSE_ENABLED=true en .env cuando esté listo.
    if (import.meta.env.VITE_SSE_ENABLED !== 'true') return;

    const token = localStorage.getItem('token');
    if (!token) return;

    let es;
    try {
      es = new EventSource(`/api/notifications/stream?token=${encodeURIComponent(token)}`);
      esRef.current = es;

      const handle = (type, icon, title) => (e) => {
        try {
          const data = JSON.parse(e.data);
          addNotification({ type, icon, title, body: data.message || title });
        } catch {
          addNotification({ type, icon, title, body: title });
        }
      };

      es.addEventListener('new_reservation',       handle('success', 'bi-stars',            'Nueva reserva recibida'));
      es.addEventListener('reservation_confirmed', handle('success', 'bi-check-circle-fill', 'Reserva confirmada'));
      es.addEventListener('reservation_cancelled', handle('warning', 'bi-x-circle-fill',     'Reserva cancelada'));
      es.addEventListener('payment_received',      handle('success', 'bi-cash-coin',          'Pago recibido'));
      es.addEventListener('reservation_attended',  handle('info',    'bi-award-fill',         'Asistencia confirmada'));

      es.onerror = () => es.close();
    } catch { /* SSE no disponible */ }

    return () => { try { esRef.current?.close(); } catch {} };
  }, [addNotification]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, toasts, unreadCount, addNotification, markAllRead, dismissToast, clearAll };
}
