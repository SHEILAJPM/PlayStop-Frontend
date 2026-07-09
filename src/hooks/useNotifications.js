import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { messaging, requestFCMToken, onMessage } from '../firebase';
import { getCsrfHeader } from '../services/api.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

let idSeq = 0;

export function useNotifications(userId = null) {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const esRef = useRef(null);
  const stompRef = useRef(null);

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

    let es;
    try {
      // La sesión viaja por cookie httpOnly; withCredentials hace que el
      // navegador la adjunte también en la conexión SSE.
      es = new EventSource('/api/notifications/stream', { withCredentials: true });
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

  // FCM: push notifications (foreground)
  useEffect(() => {
    if (!userId) return;

    // Solicitar permiso y registrar FCM token en el backend
    requestFCMToken().then(async (fcmToken) => {
      if (!fcmToken) return;
      const saved = localStorage.getItem('fcm_token');
      if (saved === fcmToken) return;
      fetch(`${BASE_URL}/api/notifications/fcm-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await getCsrfHeader()) },
        credentials: 'include',
        body: JSON.stringify({ token: fcmToken }),
      }).then(() => localStorage.setItem('fcm_token', fcmToken)).catch(() => {});
    });

    // Mensajes en primer plano
    if (!messaging) return;
    const unsub = onMessage(messaging, (payload) => {
      const notif = payload.notification || {};
      addNotification({
        type: payload.data?.type || 'info',
        icon: payload.data?.icon || 'bi-bell-fill',
        title: notif.title || 'PlayStop',
        body: notif.body || '',
        url: payload.data?.url,
      });
    });

    return () => unsub();
  }, [addNotification, userId]);

  // WebSocket: notificaciones de chat en tiempo real
  useEffect(() => {
    if (!userId) return;

    // El handshake se autentica con la cookie httpOnly (SockJS la adjunta
    // sola en sus peticiones XHR), no hace falta ningún header.
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      reconnectDelay: 8000,
      onConnect: () => {
        client.subscribe(`/topic/notifications/${userId}`, frame => {
          try {
            const data = JSON.parse(frame.body);
            if (data.type === 'CHAT_MESSAGE') {
              addNotification({
                type: 'chat',
                icon: 'bi-chat-dots-fill',
                title: data.title,
                body: data.preview,
                courtName: data.courtName,
                reservationId: data.reservationId,
                senderName: data.senderName,
                senderRole: data.senderRole,
              });
            }
          } catch { /* ignore */ }
        });
      },
    });

    client.activate();
    stompRef.current = client;
    return () => { client.deactivate(); };
  }, [userId, addNotification]);

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
