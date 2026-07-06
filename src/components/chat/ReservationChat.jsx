import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { api } from '../../services/api.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const MAX_CHARS = 500;
const TYPING_TIMEOUT_MS = 2500;

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const QUICK_REPLIES_OWNER = [
  '✅ Listo, la cancha está lista',
  '⚽ Trae tu propio balón',
  '🚿 Los vestuarios están disponibles',
  '🅿️ Hay estacionamiento disponible',
  '⏰ Recuerda llegar 5 min antes',
];

const QUICK_REPLIES_PLAYER = [
  '¿Está disponible el balón?',
  '¿Cómo llego a la cancha?',
  'Voy en camino 🏃',
  '¿Hay vestuarios?',
  '¡Gracias por todo! 👋',
];

// CSS de animaciones inyectado una sola vez
const ANIMATIONS_CSS = `
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(28px) scale(0.96); }
    to   { opacity: 1; transform: translateX(0)    scale(1); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-28px) scale(0.96); }
    to   { opacity: 1; transform: translateX(0)     scale(1); }
  }
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes typingBounce {
    0%,80%,100% { transform: translateY(0); }
    40%          { transform: translateY(-6px); }
  }
  @keyframes shakeWarning {
    0%,100% { transform: translateX(0); }
    15%     { transform: translateX(-6px); }
    30%     { transform: translateX(6px); }
    45%     { transform: translateX(-4px); }
    60%     { transform: translateX(4px); }
    75%     { transform: translateX(-2px); }
    90%     { transform: translateX(2px); }
  }
  @keyframes pulseRed {
    0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
    50%     { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
  }
  @keyframes pulseAmber {
    0%,100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); }
    50%     { box-shadow: 0 0 0 8px rgba(245,158,11,0); }
  }
  @keyframes bannerSlideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes sendPop {
    0%   { transform: scale(1); }
    50%  { transform: scale(0.88); }
    100% { transform: scale(1); }
  }
`;

const ReservationChat = ({ reservationId, reservationInfo, currentUser, onClose, darkMode = false }) => {
  const [messages, setMessages]             = useState([]);
  const [input, setInput]                   = useState('');
  const [loading, setLoading]               = useState(true);
  const [connected, setConnected]           = useState(false);
  const [sendError, setSendError]           = useState('');
  const [blockedWarning, setBlockedWarning] = useState(false);
  const [typingUser, setTypingUser]         = useState(null);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  // Estado de moderación
  const [moderationBanner, setModerationBanner] = useState(null); // { type, until }
  const [sendingAnim, setSendingAnim]           = useState(false);

  const stompRef    = useRef(null);
  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const typingTimer = useRef(null);
  const bannerTimer = useRef(null);

  const C = {
    bg:          darkMode ? '#0f172a' : '#ffffff',
    overlay:     'rgba(0,0,0,0.6)',
    header:      darkMode ? '#1e293b' : '#f8fafc',
    border:      darkMode ? '#1e293b' : '#e2e8f0',
    textPrimary: darkMode ? '#f8fafc' : '#0f172a',
    textMuted:   darkMode ? '#64748b' : '#94a3b8',
    inputBg:     darkMode ? '#020617' : '#f1f5f9',
    myBubble:    'linear-gradient(135deg,#2563eb,#1d4ed8)',
    theirBubble: darkMode ? '#1e293b' : '#f1f5f9',
    theirText:   darkMode ? '#f8fafc' : '#0f172a',
    quickBg:     darkMode ? '#1e293b' : '#f8fafc',
    quickBorder: darkMode ? '#334155' : '#e2e8f0',
  };

  const scrollBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
  }, []);

  // Cargar historial
  useEffect(() => {
    if (!reservationId) return;
    api.getChatMessages(reservationId)
      .then(data => { setMessages(Array.isArray(data) ? data : []); setLoading(false); scrollBottom(); })
      .catch(() => setLoading(false));
  }, [reservationId, scrollBottom]);

  // Mostrar banner de moderación con auto-dismiss
  const showModerationBanner = useCallback((type, until = null) => {
    clearTimeout(bannerTimer.current);
    setModerationBanner({ type, until });
    if (type === 'WARNING') {
      bannerTimer.current = setTimeout(() => setModerationBanner(null), 6000);
    }
    // Para suspensiones y ban el banner permanece
  }, []);

  // Conectar WebSocket STOMP
  useEffect(() => {
    if (!reservationId) return;
    const token = localStorage.getItem('token') || '';

    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);

        // Mensajes del chat (todos los participantes)
        client.subscribe(`/topic/chat/${reservationId}`, frame => {
          try {
            const msg = JSON.parse(frame.body);
            setMessages(prev => [...prev, msg]);
            scrollBottom();

            // Si el propio usuario recibe un moderationAction en su mensaje
            if (msg.senderId === currentUser?.id?.toString() && msg.moderationAction) {
              showModerationBanner(msg.moderationAction, msg.suspendedUntil);
            }
          } catch { /* ignore */ }
        });

        // Canal privado: mensajes de moderación solo para este usuario
        if (currentUser?.id) {
          client.subscribe(
            `/topic/chat/${reservationId}/user/${currentUser.id}`, frame => {
              try {
                const sys = JSON.parse(frame.body);
                // Mostrar como mensaje de sistema en el chat
                setMessages(prev => [...prev, { ...sys, id: Date.now() }]);
                scrollBottom();
                // Si es suspensión/ban personal, activar banner bloqueante
                if (sys.moderationAction === 'CURRENTLY_SUSPENDED') {
                  showModerationBanner('CURRENTLY_SUSPENDED', sys.suspendedUntil);
                } else if (sys.moderationAction === 'CURRENTLY_BANNED' || sys.content?.includes('bloqueada permanentemente')) {
                  showModerationBanner('BANNED');
                } else if (sys.content?.includes('suspendida hasta')) {
                  showModerationBanner('CURRENTLY_SUSPENDED', sys.suspendedUntil);
                }
              } catch { /* ignore */ }
            }
          );
        }

        // Typing indicator
        client.subscribe(`/topic/chat/${reservationId}/typing`, frame => {
          try {
            const data = JSON.parse(frame.body);
            if (data.senderId === currentUser?.id?.toString()) return;
            setTypingUser({ senderName: data.senderName });
            clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(() => setTypingUser(null), TYPING_TIMEOUT_MS);
          } catch { /* ignore */ }
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError:  () => setConnected(false),
    });

    client.activate();
    stompRef.current = client;

    return () => {
      clearTimeout(typingTimer.current);
      clearTimeout(bannerTimer.current);
      client.deactivate();
    };
  }, [reservationId, scrollBottom, currentUser?.id, showModerationBanner]);

  // Detectar si el usuario ya está suspendido/baneado al abrir el chat
  useEffect(() => {
    if (currentUser?.chatPermanentlyBanned) {
      showModerationBanner('BANNED');
    } else if (currentUser?.chatSuspendedUntil) {
      const until = new Date(currentUser.chatSuspendedUntil);
      if (until > new Date()) showModerationBanner('CURRENTLY_SUSPENDED', currentUser.chatSuspendedUntil);
    }
  }, [currentUser, showModerationBanner]);

  const publishTyping = useCallback(() => {
    stompRef.current?.publish({ destination: `/app/chat/${reservationId}/typing`, body: '{}' });
  }, [reservationId]);

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value.slice(0, MAX_CHARS));
    if (connected) publishTyping();
  }, [connected, publishTyping]);

  const handleSend = useCallback((text) => {
    const content = (text ?? input).trim();
    if (!content || !connected) return;
    setSendError('');
    setBlockedWarning(false);
    setShowQuickReplies(false);
    setSendingAnim(true);
    setTimeout(() => setSendingAnim(false), 350);

    stompRef.current?.publish({
      destination: `/app/chat/${reservationId}/send`,
      body: JSON.stringify({ content }),
    });
    if (!text) setInput('');
    inputRef.current?.focus();
  }, [input, connected, reservationId]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Detectar mensaje censurado propio
  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.senderId === currentUser?.id && last.blocked) {
      setBlockedWarning(true);
      setTimeout(() => setBlockedWarning(false), 4000);
    }
  }, [messages, currentUser?.id]);

  const isMyMessage = (msg) => msg.senderId?.toString() === currentUser?.id?.toString();

  const quickReplies = currentUser?.role === 'OWNER' ? QUICK_REPLIES_OWNER : QUICK_REPLIES_PLAYER;

  // ── Render del banner de moderación ──────────────────────────────────────
  const renderModerationOverlay = () => {
    if (!moderationBanner) return null;
    const { type, until } = moderationBanner;

    let icon, title, body, color, bg, canDismiss;
    if (type === 'WARNING') {
      icon = '⚠️'; color = '#d97706';
      bg = darkMode ? 'rgba(245,158,11,0.12)' : '#fffbeb';
      title = '¡Advertencia!';
      body = 'Has acumulado 5 palabras inapropiadas. Si continúas, tu cuenta será suspendida.';
      canDismiss = true;
    } else if (type === 'SUSPENDED_1D') {
      icon = '🚫'; color = '#ef4444';
      bg = darkMode ? 'rgba(239,68,68,0.12)' : '#fef2f2';
      title = 'Cuenta suspendida por 1 día';
      body = `Tu cuenta ha sido suspendida hasta el ${until ? formatDate(until) : ''}. Respeta las normas de la comunidad.`;
      canDismiss = false;
    } else if (type === 'SUSPENDED_5D') {
      icon = '🚫'; color = '#ef4444';
      bg = darkMode ? 'rgba(239,68,68,0.12)' : '#fef2f2';
      title = 'Cuenta suspendida por 5 días';
      body = `Reincidencia grave. Tu cuenta está suspendida hasta el ${until ? formatDate(until) : ''}.`;
      canDismiss = false;
    } else if (type === 'CURRENTLY_SUSPENDED') {
      icon = '🚫'; color = '#ef4444';
      bg = darkMode ? 'rgba(239,68,68,0.12)' : '#fef2f2';
      title = 'No puedes enviar mensajes';
      body = `Tu cuenta está suspendida${until ? ' hasta el ' + formatDate(until) : ''}. Espera a que termine la suspensión.`;
      canDismiss = false;
    } else {
      icon = '⛔'; color = '#7f1d1d';
      bg = darkMode ? 'rgba(127,29,29,0.15)' : '#fef2f2';
      title = 'Cuenta bloqueada permanentemente';
      body = 'Tu cuenta ha sido bloqueada del chat por incumplimiento grave de las normas de convivencia.';
      canDismiss = false;
    }

    return (
      <div style={{
        margin: '0 12px 8px',
        padding: '12px 16px',
        borderRadius: 14,
        background: bg,
        border: `1.5px solid ${color}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        animation: 'bannerSlideDown 0.35s ease, shakeWarning 0.5s ease 0.1s',
        ...(type === 'WARNING' ? { animation: 'bannerSlideDown 0.35s ease, shakeWarning 0.55s ease 0.1s, pulseAmber 1.5s ease 0.6s 2' } : {}),
      }}>
        <span style={{ fontSize: '1.3rem', lineHeight: 1.2, flexShrink: 0 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: '0.88rem', color, marginBottom: 3 }}>{title}</div>
          <div style={{ fontSize: '0.78rem', color: darkMode ? '#fca5a5' : '#7f1d1d', lineHeight: 1.4 }}>{body}</div>
        </div>
        {canDismiss && (
          <button onClick={() => setModerationBanner(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color, fontSize: '1rem', padding: 2, lineHeight: 1, flexShrink: 0 }}>
            <i className="bi bi-x-lg" />
          </button>
        )}
      </div>
    );
  };

  // ── Render de un mensaje de sistema ──────────────────────────────────────
  const renderSystemMessage = (msg) => (
    <div key={msg.id} style={{ textAlign: 'center', margin: '6px 0', animation: 'fadeInScale 0.35s ease' }}>
      <span style={{
        display: 'inline-block',
        padding: '5px 14px',
        borderRadius: 99,
        background: darkMode ? 'rgba(239,68,68,0.12)' : '#fee2e2',
        color: darkMode ? '#fca5a5' : '#b91c1c',
        fontSize: '0.73rem',
        fontWeight: 700,
        maxWidth: '85%',
        lineHeight: 1.4,
      }}>
        {msg.content}
      </span>
    </div>
  );

  // ── Render de un mensaje normal ───────────────────────────────────────────
  const renderMessage = (msg) => {
    const mine = isMyMessage(msg);
    return (
      <div key={msg.id}
        style={{
          display: 'flex',
          flexDirection: mine ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          gap: 8,
          animation: mine ? 'slideInRight 0.28s ease' : 'slideInLeft 0.28s ease',
        }}>
        {!mine && (
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: msg.senderRole === 'OWNER'
              ? 'linear-gradient(135deg,#f59e0b,#d97706)'
              : 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', color: '#fff', fontWeight: 800,
            boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
          }}>
            {msg.senderName?.charAt(0).toUpperCase()}
          </div>
        )}
        <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start' }}>
          {!mine && (
            <span style={{ fontSize: '0.7rem', color: C.textMuted, marginBottom: 3, fontWeight: 700 }}>
              {msg.senderName} · {msg.senderRole === 'OWNER' ? '🏟️ Propietario' : '⚽ Jugador'}
            </span>
          )}
          <div style={{
            padding: '9px 14px',
            borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            background: mine ? C.myBubble : C.theirBubble,
            color: mine ? '#0f172a' : C.theirText,
            fontSize: '0.88rem',
            lineHeight: '1.45',
            wordBreak: 'break-word',
            boxShadow: mine ? '0 3px 10px rgba(37, 99, 235, 0.28)' : darkMode ? '0 2px 6px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.07)',
            transition: 'box-shadow 0.2s',
          }}>
            {msg.content}
            {msg.blocked && (
              <span style={{
                display: 'inline-block', marginLeft: 6, fontSize: '0.66rem',
                background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                borderRadius: 4, padding: '1px 5px', fontWeight: 700,
              }}>
                ⚠ censurado
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.63rem', color: C.textMuted, marginTop: 3 }}>
            {formatTime(msg.sentAt)}
          </span>
        </div>
      </div>
    );
  };

  const isSuspendedOrBanned = moderationBanner &&
    (moderationBanner.type === 'CURRENTLY_SUSPENDED' || moderationBanner.type === 'BANNED' ||
     moderationBanner.type === 'SUSPENDED_1D' || moderationBanner.type === 'SUSPENDED_5D');

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: C.overlay,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(4px)',
      }}
    >
      <style>{ANIMATIONS_CSS}</style>

      <div style={{
        background: C.bg,
        borderRadius: '22px',
        width: '100%', maxWidth: '490px',
        height: '88vh', maxHeight: '720px',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 30px 70px rgba(0,0,0,0.45)',
        overflow: 'hidden',
        border: `1px solid ${C.border}`,
        animation: 'fadeInScale 0.28s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

        {/* ── Header ── */}
        <div style={{
          background: C.header,
          borderBottom: `1px solid ${C.border}`,
          padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#2563eb,#3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.15rem',
            boxShadow: '0 3px 10px rgba(37, 99, 235, 0.3)',
          }}>
            <i className="bi bi-chat-dots-fill" style={{ color: '#fff' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, color: C.textPrimary, fontSize: '0.96rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {reservationInfo?.court || 'Chat de reserva'}
            </div>
            <div style={{ fontSize: '0.73rem', color: C.textMuted }}>
              {reservationInfo?.date} · {reservationInfo?.slot}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              width: 9, height: 9, borderRadius: '50%',
              background: connected ? '#2563eb' : '#ef4444',
              display: 'inline-block',
              boxShadow: connected ? '0 0 6px rgba(37, 99, 235, 0.6)' : 'none',
              transition: 'background 0.3s',
            }} />
            <span style={{ fontSize: '0.7rem', color: C.textMuted }}>
              {connected ? 'En línea' : 'Reconectando...'}
            </span>
          </div>
          <button onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: C.textMuted, fontSize: '1.1rem', padding: '5px',
              lineHeight: 1, borderRadius: '50%',
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseOver={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
            onMouseOut={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = 'none'; }}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* ── Banner seguridad ── */}
        <div style={{
          background: darkMode ? 'rgba(59,130,246,0.08)' : '#eff6ff',
          borderBottom: `1px solid ${C.border}`,
          padding: '6px 18px',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <i className="bi bi-shield-lock-fill" style={{ color: '#3b82f6', fontSize: '0.78rem' }} />
          <span style={{ fontSize: '0.7rem', color: darkMode ? '#60a5fa' : '#3b82f6' }}>
            Chat privado · solo tú y el propietario pueden leerlo · palabras inapropiadas son censuradas automáticamente
          </span>
        </div>

        {/* ── Mensajes ── */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '16px',
          display: 'flex', flexDirection: 'column', gap: '10px',
        }}>
          {loading && (
            <div style={{ textAlign: 'center', color: C.textMuted, paddingTop: 40 }}>
              <div style={{ fontSize: '1.8rem', animation: 'typingBounce 1s ease infinite' }}>
                <i className="bi bi-hourglass-split" />
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: 8 }}>Cargando mensajes...</div>
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div style={{ textAlign: 'center', color: C.textMuted, paddingTop: 40 }}>
              <div style={{ fontSize: '2.8rem', color: '#2563eb', animation: 'fadeInScale 0.5s ease' }}>
                <i className="bi bi-chat-heart" />
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.96rem', marginTop: 12, color: C.textPrimary }}>
                Inicia la conversación
              </div>
              <div style={{ fontSize: '0.8rem', marginTop: 6, maxWidth: 260, margin: '8px auto 0', lineHeight: 1.5 }}>
                Puedes preguntarle al propietario sobre la cancha, equipamiento o cualquier duda de tu reserva.
              </div>
            </div>
          )}

          {messages.map(msg =>
            msg.senderRole === 'SYSTEM'
              ? renderSystemMessage(msg)
              : renderMessage(msg)
          )}

          {/* Typing indicator */}
          {typingUser && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, animation: 'slideInLeft 0.25s ease' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#64748b,#475569)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', color: '#fff', fontWeight: 800,
              }}>
                {typingUser.senderName?.charAt(0).toUpperCase()}
              </div>
              <div style={{
                padding: '10px 14px',
                borderRadius: '18px 18px 18px 4px',
                background: C.theirBubble,
                display: 'flex', alignItems: 'center', gap: 5,
                boxShadow: darkMode ? '0 2px 6px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.07)',
              }}>
                {[0, 160, 320].map(delay => (
                  <span key={delay} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: darkMode ? '#64748b' : '#94a3b8',
                    display: 'inline-block',
                    animation: `typingBounce 1s ease ${delay}ms infinite`,
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '0.67rem', color: C.textMuted, marginBottom: 4 }}>
                {typingUser.senderName} escribe...
              </span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Banner de moderación ── */}
        {renderModerationOverlay()}

        {/* ── Quick replies ── */}
        {showQuickReplies && (
          <div style={{
            padding: '8px 14px',
            borderTop: `1px solid ${C.border}`,
            display: 'flex', gap: 6, flexWrap: 'wrap',
            background: C.quickBg,
            animation: 'bannerSlideDown 0.2s ease',
          }}>
            {quickReplies.map((reply, i) => (
              <button key={i} onClick={() => handleSend(reply)}
                style={{
                  padding: '5px 11px',
                  borderRadius: 99,
                  border: `1.5px solid ${C.quickBorder}`,
                  background: 'transparent',
                  color: C.textPrimary,
                  fontSize: '0.76rem', fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.background = 'rgba(37, 99, 235, 0.06)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = C.quickBorder; e.currentTarget.style.color = C.textPrimary; e.currentTarget.style.background = 'transparent'; }}>
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* ── Aviso censura ── */}
        {blockedWarning && (
          <div style={{
            padding: '8px 18px',
            background: darkMode ? 'rgba(239,68,68,0.1)' : '#fee2e2',
            borderTop: `1px solid ${darkMode ? 'rgba(239,68,68,0.2)' : '#fecaca'}`,
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: '0.77rem',
            color: darkMode ? '#fca5a5' : '#b91c1c',
            fontWeight: 600,
            animation: 'bannerSlideDown 0.25s ease',
          }}>
            <i className="bi bi-exclamation-triangle-fill" />
            Tu mensaje contenía palabras inapropiadas y fue censurado automáticamente.
          </div>
        )}

        {/* ── Error de envío ── */}
        {sendError && (
          <div style={{
            padding: '8px 18px',
            background: darkMode ? 'rgba(239,68,68,0.1)' : '#fee2e2',
            fontSize: '0.77rem',
            color: darkMode ? '#fca5a5' : '#b91c1c',
            fontWeight: 600,
          }}>
            {sendError}
          </div>
        )}

        {/* ── Input ── */}
        <div style={{
          padding: '12px 14px',
          borderTop: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'flex-end', gap: 8,
          background: C.bg,
          opacity: isSuspendedOrBanned ? 0.45 : 1,
          transition: 'opacity 0.3s',
        }}>
          {/* Botón quick replies */}
          <button
            onClick={() => setShowQuickReplies(v => !v)}
            disabled={!!isSuspendedOrBanned}
            title="Respuestas rápidas"
            style={{
              width: 38, height: 38, borderRadius: '50%',
              border: `1.5px solid ${showQuickReplies ? '#2563eb' : C.border}`,
              background: showQuickReplies ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              color: showQuickReplies ? '#2563eb' : C.textMuted,
              cursor: isSuspendedOrBanned ? 'not-allowed' : 'pointer',
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem',
              transition: 'all 0.18s',
            }}>
            <i className="bi bi-lightning-charge-fill" />
          </button>

          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={!!isSuspendedOrBanned}
              placeholder={isSuspendedOrBanned
                ? (moderationBanner?.type === 'BANNED' ? 'Cuenta bloqueada permanentemente' : 'Cuenta suspendida temporalmente')
                : 'Escribe un mensaje... (Enter para enviar)'}
              rows={1}
              style={{
                width: '100%', resize: 'none',
                padding: '10px 14px',
                borderRadius: '14px',
                border: `1.5px solid ${C.border}`,
                background: C.inputBg,
                color: C.textPrimary,
                fontSize: '0.88rem',
                outline: 'none',
                lineHeight: '1.4',
                maxHeight: '100px',
                overflowY: 'auto',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                cursor: isSuspendedOrBanned ? 'not-allowed' : 'text',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { if (!isSuspendedOrBanned) e.target.style.borderColor = '#2563eb'; }}
              onBlur={e => { e.target.style.borderColor = C.border; }}
            />
            {input.length > MAX_CHARS * 0.8 && (
              <span style={{
                position: 'absolute', bottom: 6, right: 10,
                fontSize: '0.63rem',
                color: input.length >= MAX_CHARS ? '#ef4444' : C.textMuted,
              }}>
                {input.length}/{MAX_CHARS}
              </span>
            )}
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || !connected || !!isSuspendedOrBanned}
            style={{
              width: 42, height: 42, borderRadius: '50%',
              border: 'none', flexShrink: 0,
              background: input.trim() && connected && !isSuspendedOrBanned
                ? 'linear-gradient(135deg,#2563eb,#1d4ed8)'
                : (darkMode ? '#1e293b' : '#e2e8f0'),
              color: input.trim() && connected && !isSuspendedOrBanned
                ? '#0f172a' : C.textMuted,
              cursor: input.trim() && connected && !isSuspendedOrBanned ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem',
              transition: 'all 0.18s',
              boxShadow: input.trim() && connected && !isSuspendedOrBanned
                ? '0 4px 14px rgba(37, 99, 235, 0.35)' : 'none',
              animation: sendingAnim ? 'sendPop 0.3s ease' : 'none',
              transform: 'translateZ(0)',
            }}>
            <i className="bi bi-send-fill" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationChat;
