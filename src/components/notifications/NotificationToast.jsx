import { useEffect, useState } from 'react';

/**
 * Muestra un stack de toasts en la esquina superior derecha.
 * Cada toast tiene icono, título, body y un botón de cierre.
 * Se autodestruye en 5 s (controlado por el hook useNotifications).
 *
 * Props:
 *   toasts        — array de { id, type, icon, title, body, courtName, senderRole }
 *   dismissToast  — fn(id) para eliminar un toast
 *   onOpenChat    — fn({ reservationId, courtName }) abre el chat directamente (opcional)
 *   darkMode      — boolean
 */
const ROLE_COLORS = {
  OWNER:  { bg: 'linear-gradient(135deg,#f59e0b,#d97706)', label: '🏟️ Propietario' },
  PLAYER: { bg: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', label: '⚽ Jugador' },
};

const NotificationToast = ({ toasts = [], dismissToast, onOpenChat, darkMode = false }) => {
  if (toasts.length === 0) return null;

  const bg     = darkMode ? '#1e293b' : '#ffffff';
  const border = darkMode ? '#334155' : '#e2e8f0';
  const text   = darkMode ? '#f8fafc' : '#0f172a';
  const muted  = darkMode ? '#94a3b8' : '#64748b';

  return (
    <div style={{
      position: 'fixed',
      top: 80,
      right: 20,
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
          onOpenChat={onOpenChat}
          bg={bg} border={border} text={text} muted={muted}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onDismiss, onOpenChat, bg, border, text, muted, darkMode }) => {
  const [visible, setVisible] = useState(false);

  // Entrada animada
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const roleInfo = ROLE_COLORS[toast.senderRole] || ROLE_COLORS.PLAYER;
  const isChat   = toast.type === 'chat';

  return (
    <div
      style={{
        pointerEvents: 'all',
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 16,
        padding: '14px 16px',
        width: 320,
        maxWidth: 'calc(100vw - 40px)',
        boxSizing: 'border-box',
        boxShadow: darkMode
          ? '0 8px 32px rgba(0,0,0,0.5)'
          : '0 8px 32px rgba(0,0,0,0.12)',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        transform: visible ? 'translateX(0)' : 'translateX(360px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        borderLeft: `4px solid #2563eb`,
      }}
    >
      {/* Avatar / ícono */}
      <div style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        background: isChat ? roleInfo.bg : 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem', color: '#fff',
      }}>
        <i className={`bi ${toast.icon || 'bi-bell-fill'}`} />
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: text, marginBottom: 2 }}>
          {toast.title}
        </div>
        {isChat && toast.senderRole && (
          <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700, marginBottom: 4 }}>
            {roleInfo.label}
          </div>
        )}
        <div style={{
          fontSize: '0.78rem', color: muted, lineHeight: 1.4,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {toast.body}
        </div>
        {isChat && toast.courtName && (
          <div style={{ fontSize: '0.7rem', color: muted, marginTop: 4 }}>
            🏟️ {toast.courtName}
          </div>
        )}

        {/* Botón "Ver chat" */}
        {isChat && onOpenChat && toast.reservationId && (
          <button
            onClick={() => {
              onOpenChat({ reservationId: toast.reservationId, courtName: toast.courtName });
              onDismiss();
            }}
            style={{
              marginTop: 8,
              padding: '5px 12px',
              borderRadius: 8,
              border: 'none',
              background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
              color: '#0f172a',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <i className="bi bi-chat-dots-fill" /> Ver chat
          </button>
        )}
      </div>

      {/* Cerrar */}
      <button
        onClick={onDismiss}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: muted, fontSize: '0.9rem', padding: 2, flexShrink: 0,
          lineHeight: 1,
        }}
      >
        <i className="bi bi-x-lg" />
      </button>
    </div>
  );
};

export default NotificationToast;
