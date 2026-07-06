import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../hooks/useNotifications.js';

/* ─── Chatbot data ──────────────────────────────────────── */
const BOT_REPLIES = [
  { keywords: ['hola','hi','hello','buenas','buen'], reply: '¡Hola! Soy el asistente de PlaySpot. ¿En qué te puedo ayudar hoy?' },
  { keywords: ['reserva','reservar','reservacion','reservación','booking'], reply: 'Para gestionar tus reservas, ve a la sección "Mis Reservas" en el menú lateral. ¿Tienes algún problema específico con una reserva?' },
  { keywords: ['pago','cobro','factura','tarjeta','culqi','precio'], reply: 'Los pagos se procesan de forma segura a través de Culqi. Si tuviste un problema, contáctanos en soporte@playspot.pe con tu número de reserva.' },
  { keywords: ['cancha','campo','pista','court','buscar'], reply: 'Puedes buscar canchas en "Buscar Canchas". Filtra por deporte, ciudad, precio y más.' },
  { keywords: ['cancelar','devolucion','devolución','reembolso','refund'], reply: 'Para cancelar una reserva, ve a "Mis Reservas" y haz clic en "Cancelar". Las cancelaciones con más de 24h de anticipación son gratuitas.' },
  { keywords: ['problema','error','falla','fallo','bug','reporte','reportar','incidencia'], reply: 'Lamentamos el inconveniente. Descríbenos el problema aquí o escríbenos a soporte@playspot.pe. ¿Qué ocurrió exactamente?' },
  { keywords: ['propietario','owner','local','tienda','negocio'], reply: 'Los propietarios pueden gestionar canchas, productos y reservas desde su dashboard. ¿Necesitas ayuda con alguna función específica?' },
  { keywords: ['horario','hora','slot','turno','disponible'], reply: 'Los horarios disponibles aparecen al seleccionar una cancha y elegir fecha. Cada bloque es de 1 hora.' },
  { keywords: ['perfil','cuenta','contraseña','password','datos'], reply: 'Actualiza tu perfil y contraseña en la sección "Mi Perfil" del menú lateral.' },
  { keywords: ['qr','código','codigo','entrada','acceso'], reply: 'Tu código QR se genera al confirmar la reserva. Encuéntralo en "Mis Reservas" → Ver QR.' },
  { keywords: ['gracias','thanks','ok','perfecto','listo','genial','excelente'], reply: '¡De nada! Si necesitas algo más, aquí estaré. ¡Que disfrutes tu partido!' },
  { keywords: ['soporte','ayuda','help','contacto','contact'], reply: 'Puedes contactarnos por: soporte@playspot.pe | +51 1 234-5678 (Lun-Vie 9am-6pm).' },
  { keywords: ['como funciona','funcionamiento','como','cómo'], reply: 'PlaySpot es la plataforma líder para reservar canchas deportivas en Perú. Busca, filtra y reserva en segundos.' },
];

const QUICK_REPLIES = [
  { icon: 'bi-bug-fill',        label: 'Reportar problema',  text: 'Quiero reportar un problema' },
  { icon: 'bi-calendar-check',  label: 'Problema con reserva', text: 'Tengo un problema con mi reserva' },
  { icon: 'bi-credit-card',     label: 'Problema de pago',   text: 'Tuve un problema con mi pago' },
  { icon: 'bi-question-circle', label: '¿Cómo funciona?',   text: '¿Cómo funciona PlaySpot?' },
];

const getBotReply = (msg) => {
  const lower = msg.toLowerCase();
  for (const { keywords, reply } of BOT_REPLIES) {
    if (keywords.some(k => lower.includes(k))) return reply;
  }
  return 'Entiendo. Para atención personalizada escríbenos a soporte@playspot.pe o llama al +51 1 234-5678 (Lun-Vie, 9am-6pm). ¿Hay algo más en que te pueda ayudar?';
};

/* ─── ChatbotWidget ─────────────────────────────────────── */
const ChatbotWidget = ({ isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: '¡Hola! Soy el asistente de PlaySpot. ¿En qué te puedo ayudar hoy?', id: 0 },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: text.trim(), id: nextId.current++ }]);
    setInput('');
    setShowQuick(false);
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: getBotReply(text), id: nextId.current++ }]);
      setTyping(false);
    }, 700 + Math.random() * 700);
  };

  const chatBg      = isDark ? 'rgba(9,9,11,0.97)'         : '#fff';
  const botBubbleBg = isDark ? 'rgba(255,255,255,0.08)'    : '#f1f5f9';
  const botBubbleColor = isDark ? '#f8fafc'                : '#0f172a';
  const inputBg     = isDark ? 'rgba(0,0,0,0.5)'           : '#f8fafc';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)'     : '#e2e8f0';
  const inputColor  = isDark ? '#f8fafc'                   : '#0f172a';

  return (
    <>
      <style>{`
        @keyframes chatSlideUp { from{opacity:0;transform:translateY(16px) scale(.96);}to{opacity:1;transform:translateY(0) scale(1);} }
        @keyframes chatPop { from{transform:scale(0) rotate(-20deg);}to{transform:scale(1) rotate(0);} }
        @keyframes chatDot { 0%,80%,100%{transform:scale(0);opacity:.4;}40%{transform:scale(1);opacity:1;} }
        .chat-send-btn:hover:not(:disabled){filter:brightness(1.15);transform:scale(1.06);}
        .chat-quick-btn{padding:6px 13px;border-radius:20px;border:1.5px solid ${isDark?'rgba(255,255,255,0.1)':'#e2e8f0'};background:${isDark?'rgba(255,255,255,0.06)':'#fff'};color:${isDark?'#94a3b8':'#475569'};font-size:.77rem;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .18s;font-family:inherit;}
        .chat-quick-btn:hover{border-color:#2563eb;color:#2563eb;background:${isDark?'rgba(37, 99, 235, .08)':'rgba(37, 99, 235, .05)'};}
      `}</style>

      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          position:'fixed', bottom:24, right:24, zIndex:9990,
          width:56, height:56, borderRadius:'50%',
          background: isOpen ? '#ef4444' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
          border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow: isOpen ? '0 4px 20px rgba(239,68,68,0.4)' : '0 4px 24px rgba(37, 99, 235, 0.45)',
          transition:'all .3s cubic-bezier(.16,1,.3,1)',
          fontSize:'1.4rem', animation:'chatPop 0.5s cubic-bezier(.34,1.56,.64,1)',
        }}
        title={isOpen ? 'Cerrar chat' : 'Abrir asistente'}
      >
        {isOpen ? <i className="bi bi-x-lg" style={{ color: '#fff', fontSize: '1.1rem' }} /> : <i className="bi bi-chat-dots-fill" style={{ color: '#fff', fontSize: '1.3rem' }} />}
      </button>

      {isOpen && (
        <div style={{
          position:'fixed', bottom:92, right:24, zIndex:9989,
          width:360, maxWidth:'calc(100vw - 48px)',
          borderRadius:24, overflow:'hidden',
          boxShadow: isDark
            ? '0 20px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,0.08)'
            : '0 20px 60px rgba(0,0,0,.25)',
          animation:'chatSlideUp 0.3s cubic-bezier(.16,1,.3,1)',
          display:'flex', flexDirection:'column', maxHeight:'72vh',
          backdropFilter:'blur(20px)',
        }}>
          <div style={{ background:'linear-gradient(135deg,rgba(0,0,0,0.9),rgba(0,40,30,0.95))', padding:'16px 20px', display:'flex', alignItems:'center', gap:12, flexShrink:0, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(37, 99, 235, .15)', border:'1px solid rgba(37, 99, 235, 0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0, color:'#2563eb' }}><i className="bi bi-robot" /></div>
            <div style={{ flex:1 }}>
              <p style={{ margin:0, color:'#fff', fontWeight:800, fontSize:'.95rem', letterSpacing:'-.2px' }}>Asistente PlaySpot</p>
              <p style={{ margin:0, color:'rgba(255,255,255,.5)', fontSize:'.73rem', display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#2563eb', display:'inline-block', boxShadow:'0 0 6px rgba(37, 99, 235, 0.8)' }} /> En línea ahora
              </p>
            </div>
            <button onClick={() => setMessages([{ from:'bot', text:'¡Hola! ¿En qué te puedo ayudar?', id:nextId.current++ }]) || setShowQuick(true)}
              style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,.6)', fontSize:'.75rem', fontWeight:700, padding:'4px 10px', borderRadius:8, cursor:'pointer' }}>
              Nueva chat
            </button>
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:16, background:chatBg, display:'flex', flexDirection:'column', gap:10 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display:'flex', justifyContent:msg.from==='user'?'flex-end':'flex-start', gap:8, alignItems:'flex-end' }}>
                {msg.from === 'bot' && (
                  <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(37, 99, 235, .12)', border:'1px solid rgba(37, 99, 235, 0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.85rem', flexShrink:0, color:'#2563eb' }}><i className="bi bi-robot" /></div>
                )}
                <div style={{
                  maxWidth:'78%', padding:'10px 14px',
                  borderRadius: msg.from==='user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.from==='user' ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : botBubbleBg,
                  color: msg.from==='user' ? '#0f172a' : botBubbleColor,
                  fontSize:'.88rem', fontWeight:500, lineHeight:1.55,
                  boxShadow: msg.from==='user' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : '0 2px 8px rgba(0,0,0,.07)',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(37, 99, 235, .12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.85rem', flexShrink:0, color:'#2563eb' }}><i className="bi bi-robot" /></div>
                <div style={{ padding:'12px 16px', background:botBubbleBg, borderRadius:'18px 18px 18px 4px', display:'flex', gap:4, alignItems:'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#94a3b8', animation:`chatDot 1.4s ease infinite`, animationDelay:`${i*0.16}s` }} />
                  ))}
                </div>
              </div>
            )}

            {showQuick && !typing && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginTop:4 }}>
                {QUICK_REPLIES.map(qr => (
                  <button key={qr.label} className="chat-quick-btn" onClick={() => sendMessage(qr.text)}><i className={`bi ${qr.icon}`} style={{ marginRight:5 }} />{qr.label}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding:'10px 12px', background:chatBg, borderTop:`1px solid ${inputBorder}`, display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
            <input
              type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Escribe tu mensaje..."
              style={{ flex:1, padding:'9px 14px', borderRadius:12, border:`1.5px solid ${inputBorder}`, background:inputBg, color:inputColor, fontSize:'.87rem', outline:'none', fontFamily:'inherit', transition:'border-color .2s' }}
              onFocus={e => e.target.style.borderColor='#2563eb'}
              onBlur={e => e.target.style.borderColor=inputBorder}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="chat-send-btn"
              style={{
                width:38, height:38, borderRadius:'50%', border:'none',
                background: input.trim() ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : (isDark?'rgba(255,255,255,.06)':'#e2e8f0'),
                color: input.trim() ? '#0f172a' : '#94a3b8',
                cursor: input.trim() ? 'pointer' : 'default',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, transition:'all .18s', fontSize:'1rem',
                boxShadow: input.trim() ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
              }}
            ><i className="bi bi-send-fill" style={{ fontSize:'.85rem' }} /></button>
          </div>
        </div>
      )}
    </>
  );
};

/* ─── Toast Notifications ───────────────────────────────── */
const TOAST_COLORS = {
  success: { bg: 'rgba(37, 99, 235, 0.12)', border: 'rgba(37, 99, 235, 0.3)', color: '#2563eb' },
  warning: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', color: '#f59e0b' },
  info:    { bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)',  color: '#3b82f6' },
  error:   { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   color: '#ef4444' },
};

const ToastStack = ({ toasts, onDismiss, onOpenChat }) => (
  <div style={{ position:'fixed', bottom:96, right:24, zIndex:9988, display:'flex', flexDirection:'column', gap:10, pointerEvents:'none', maxWidth:340 }}>
    <AnimatePresence>
      {toasts.map(t => {
        const isChat = t.type === 'chat';
        const c = TOAST_COLORS[isChat ? 'success' : t.type] || TOAST_COLORS.info;
        return (
          <motion.div
            key={t.id}
            initial={{ opacity:0, x:60, scale:.92 }}
            animate={{ opacity:1, x:0, scale:1 }}
            exit={{ opacity:0, x:60, scale:.92 }}
            transition={{ duration:.3, ease:[.16,1,.3,1] }}
            style={{
              background:'rgba(9,9,11,0.95)', backdropFilter:'blur(20px)',
              border:`1px solid ${c.border}`,
              borderLeft:`3px solid ${c.color}`,
              borderRadius:14, padding:'12px 16px',
              display:'flex', alignItems:'flex-start', gap:10,
              boxShadow:'0 8px 32px rgba(0,0,0,.4)',
              pointerEvents:'auto', cursor: isChat ? 'default' : 'pointer',
            }}
            onClick={() => !isChat && onDismiss(t.id)}
          >
            <i className={`bi ${t.icon}`} style={{ fontSize:'1.3rem', flexShrink:0, color:c.color, marginTop:2 }} />
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ margin:0, color:'#f8fafc', fontWeight:800, fontSize:'.85rem' }}>{t.title}</p>
              {t.body && t.body !== t.title && (
                <p style={{ margin:'2px 0 0', color:'#94a3b8', fontSize:'.78rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.body}</p>
              )}
              {t.courtName && (
                <p style={{ margin:'2px 0 0', color:'#64748b', fontSize:'.72rem' }}>🏟️ {t.courtName}</p>
              )}
              {isChat && onOpenChat && t.reservationId && (
                <button
                  onClick={() => { onOpenChat({ reservationId: t.reservationId, courtName: t.courtName }); onDismiss(t.id); }}
                  style={{ marginTop:7, padding:'4px 11px', borderRadius:7, border:'none', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', fontSize:'.74rem', fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                  <i className="bi bi-chat-dots-fill" /> Ver chat
                </button>
              )}
            </div>
            <span onClick={() => onDismiss(t.id)} style={{ color:'#475569', fontSize:'1rem', flexShrink:0, cursor:'pointer' }}>×</span>
          </motion.div>
        );
      })}
    </AnimatePresence>
  </div>
);

/* ─── Notification Panel ────────────────────────────────── */
const NotificationPanel = ({ notifications, unreadCount, onMarkAllRead, onClearAll, onClose, isDark }) => {
  const bg = isDark ? 'rgba(9,9,11,0.97)' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = '#64748b';

  const fmtTime = (d) => {
    const diff = (Date.now() - new Date(d).getTime()) / 1000;
    if (diff < 60) return 'Ahora';
    if (diff < 3600) return `Hace ${Math.floor(diff/60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff/3600)} h`;
    return new Date(d).toLocaleDateString('es-PE', { day:'numeric', month:'short' });
  };

  return (
    <motion.div
      initial={{ opacity:0, y:-8, scale:.96 }}
      animate={{ opacity:1, y:0, scale:1 }}
      exit={{ opacity:0, y:-8, scale:.96 }}
      transition={{ duration:.22, ease:[.16,1,.3,1] }}
      style={{
        position:'fixed', top:78, right:16, zIndex:99999,
        width:340, maxHeight:480,
        background:bg,
        borderRadius:18, border:`1px solid ${border}`,
        boxShadow:'0 20px 60px rgba(0,0,0,.55)',
        display:'flex', flexDirection:'column', overflow:'hidden',
      }}
    >
      <div style={{ padding:'14px 16px', borderBottom:`1px solid ${border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ color:textPrimary, fontWeight:800, fontSize:'.95rem' }}>Notificaciones</span>
          {unreadCount > 0 && (
            <span style={{ background:'#ef4444', color:'#fff', fontSize:'.7rem', fontWeight:800, padding:'1px 7px', borderRadius:99 }}>{unreadCount}</span>
          )}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead} style={{ background:'none', border:'none', color:'#2563eb', fontSize:'.75rem', fontWeight:700, cursor:'pointer', padding:'4px 8px', borderRadius:6 }}>
              Marcar todo
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={onClearAll} style={{ background:'none', border:'none', color:textMuted, fontSize:'.75rem', cursor:'pointer', padding:'4px 8px', borderRadius:6 }}>
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
        {notifications.length === 0 ? (
          <div style={{ padding:'40px 24px', textAlign:'center' }}>
            <div style={{ marginBottom:8 }}><i className="bi bi-bell" style={{ fontSize:'2.5rem', color:'#64748b' }} /></div>
            <p style={{ margin:0, color:textMuted, fontSize:'.88rem', fontWeight:600 }}>Sin notificaciones</p>
            <p style={{ margin:'4px 0 0', color:textMuted, fontSize:'.78rem' }}>Las notificaciones en tiempo real aparecerán aquí.</p>
          </div>
        ) : (
          notifications.map(n => {
            const c = TOAST_COLORS[n.type] || TOAST_COLORS.info;
            return (
              <div key={n.id} style={{
                padding:'12px 16px', display:'flex', gap:12, alignItems:'flex-start',
                borderLeft:`3px solid ${n.read ? 'transparent' : c.color}`,
                background: n.read ? 'transparent' : (isDark ? 'rgba(255,255,255,.025)' : '#f8fafc'),
                transition:'background .15s',
              }}>
                <i className={`bi ${n.icon}`} style={{ fontSize:'1.2rem', flexShrink:0, marginTop:1, color:(TOAST_COLORS[n.type]||TOAST_COLORS.info).color }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ margin:0, color:textPrimary, fontWeight:n.read ? 600 : 800, fontSize:'.85rem' }}>{n.title}</p>
                  {n.body && n.body !== n.title && (
                    <p style={{ margin:'2px 0 0', color:textMuted, fontSize:'.78rem', lineHeight:1.4 }}>{n.body}</p>
                  )}
                  <p style={{ margin:'4px 0 0', color:textMuted, fontSize:'.72rem' }}>{fmtTime(n.time)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

/* ─── UserAvatar ────────────────────────────────────────── */
const UserAvatar = ({ name, size = 44, src }) => {
  const gradients = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#2563eb,#1d4ed8)',
    'linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
  ];
  const idx = (name?.charCodeAt(0) || 0) % gradients.length;
  const initial = name?.charAt(0)?.toUpperCase() || 'U';
  return (
    <div style={{
      width: size, height: size, borderRadius: 12,
      background: src ? 'transparent' : gradients[idx],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, fontSize: size * 0.42,
      flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      overflow: 'hidden',
    }}>
      {src
        ? <img src={src} alt={initial} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => {
            const parent = e.currentTarget.parentElement;
            if (!parent) return;
            e.currentTarget.style.display = 'none';
            parent.style.background = gradients[idx];
            parent.textContent = initial;
          }} />
        : initial}
    </div>
  );
};

/* ─── DashboardLayout ───────────────────────────────────── */
export const DashboardLayout = ({
  user, onLogout, title, menuItems,
  activeTab, onTabChange, children, darkMode, toggleTheme,
  tourHighlight, onRestartTour, avatarUrl, onOpenChat, onChatNotif,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifRef = useRef(null);
  const processedToastIds = useRef(new Set());
  const isDark = darkMode;

  const { notifications, toasts, unreadCount, markAllRead, dismissToast, clearAll } = useNotifications(user?.id);

  // Notificar al padre cuando llega un mensaje de chat nuevo
  useEffect(() => {
    if (!onChatNotif) return;
    toasts.forEach(t => {
      if (t.type === 'chat' && t.reservationId && !processedToastIds.current.has(t.id)) {
        processedToastIds.current.add(t.id);
        onChatNotif({ reservationId: t.reservationId.toString(), courtName: t.courtName });
      }
    });
  }, [toasts, onChatNotif]);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleBellClick = useCallback(() => {
    setShowNotifPanel(p => !p);
    if (!showNotifPanel && unreadCount > 0) markAllRead();
  }, [showNotifPanel, unreadCount, markAllRead]);

  const colors = {
    bg:               isDark ? '#09090b'                      : '#f1f5f9',
    sidebar:          isDark ? 'rgba(9,9,11,0.98)'            : '#0f172a',
    sidebarBorder:    isDark ? 'rgba(255,255,255,0.07)'       : 'rgba(255,255,255,0.12)',
    cardBg:           isDark ? 'rgba(255,255,255,0.04)'       : '#ffffff',
    cardBorder:       isDark ? 'rgba(255,255,255,0.08)'       : '#e2e8f0',
    headerBg:         isDark ? 'rgba(9,9,11,0.75)'            : 'rgba(255,255,255,0.9)',
    headerBorder:     isDark ? 'rgba(255,255,255,0.06)'       : 'rgba(255,255,255,0.8)',
    titleColor:       isDark ? '#f8fafc'                      : '#0f172a',
    textPrimary:      isDark ? '#f8fafc'                      : '#0f172a',
    textSecondary:    isDark ? '#94a3b8'                      : '#475569',
    tableBg:          isDark ? 'rgba(0,0,0,0.15)'             : '#fff',
    tableHeaderBg:    isDark ? 'rgba(0,0,0,0.25)'             : '#fafbfc',
    tableHeaderColor: isDark ? '#64748b'                      : '#94a3b8',
    tableRowHover:    isDark ? 'rgba(37, 99, 235, 0.04)'         : '#fafbff',
    tableBorderColor: isDark ? 'rgba(255,255,255,0.05)'       : '#f8fafc',
    inputBg:          isDark ? 'rgba(0,0,0,0.35)'             : '#f8fafc',
    inputBorder:      isDark ? 'rgba(255,255,255,0.1)'        : '#e2e8f0',
    inputColor:       isDark ? '#f8fafc'                      : '#0f172a',
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', width: '100vw',
      background: colors.bg,
      backgroundImage: isDark
        ? `radial-gradient(ellipse 110% 55% at 50% -5%, rgba(37, 99, 235, 0.08) 0%, transparent 60%),
           radial-gradient(rgba(255,255,255,0.025) 1px, transparent 0)`
        : `radial-gradient(#cbd5e1 1px, transparent 0)`,
      backgroundSize: isDark ? 'auto, 28px 28px' : '28px 28px',
      padding: 20, gap: 20, boxSizing: 'border-box',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes neonPulse { 0%,100%{box-shadow:inset 3px 0 0 #2563eb,0 0 16px rgba(37, 99, 235, .06)} 50%{box-shadow:inset 3px 0 0 #2563eb,0 0 24px rgba(37, 99, 235, .12)} }
        @keyframes tourPulse { 0%,100%{box-shadow:0 0 0 0 rgba(37, 99, 235, 0);background:rgba(37, 99, 235, .13);} 50%{box-shadow:0 0 0 4px rgba(37, 99, 235, .18);background:rgba(37, 99, 235, .2);} }
        @keyframes bellRing { 0%,100%{transform:rotate(0);} 20%{transform:rotate(-15deg);} 40%{transform:rotate(15deg);} 60%{transform:rotate(-8deg);} 80%{transform:rotate(8deg);} }
        .nav-item-ps.tour-highlight { animation:tourPulse 1.5s ease infinite!important; color:#2563eb!important; font-weight:700!important; border:1px solid rgba(37, 99, 235, .3)!important; }
        .nav-item-ps {
          display:flex; align-items:center; gap:10px;
          padding:11px 14px; color:#64748b;
          font-weight:600; font-size:.92rem; letter-spacing:.01em;
          border-radius:12px; transition:all .2s ease;
          cursor:pointer; border:none; background:none; width:100%; text-align:left;
        }
        .nav-item-ps:hover { background:rgba(255,255,255,.05); color:#e2e8f0; }
        .nav-item-ps.active {
          background:linear-gradient(135deg,rgba(37, 99, 235, .13),rgba(37, 99, 235, .04));
          color:#2563eb; font-weight:700;
          animation:neonPulse 3s ease infinite;
        }
        .nav-item-ps:hover .nav-icon { transform:scale(1.1); }
        .nav-item-ps.active .nav-icon { transform:scale(1.12); }
        .nav-icon { font-size:1.05rem; width:22px; text-align:center; flex-shrink:0; transition:transform .2s; }
        .nav-icon i { font-size:1.1rem; }
        .logout-ps {
          width:100%; padding:10px; border-radius:10px;
          background:rgba(255,255,255,.05); color:#64748b; border:none;
          font-weight:600; font-size:.88rem; transition:all .2s;
          display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer;
        }
        .logout-ps:hover { background:rgba(239,68,68,.15); color:#f87171; }
        .menu-btn-ps {
          display:none; background:none; border:none;
          font-size:1.4rem; cursor:pointer; margin-right:12px; padding:4px;
        }
        @media(max-width:768px) {
          .sidebar-ps { position:fixed!important; height:calc(100vh - 24px)!important; top:12px!important; left:12px!important; transform:translateX(calc(-100% - 24px))!important; }
          .sidebar-ps.open { transform:translateX(0)!important; }
          .menu-btn-ps { display:flex; align-items:center; }
        }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}; border-radius:99px; }
        ::-webkit-scrollbar-thumb:hover { background:${isDark ? 'rgba(255,255,255,0.18)' : '#cbd5e1'}; }
        .skeleton { background:linear-gradient(90deg,${isDark ? 'rgba(255,255,255,.04) 25%,rgba(255,255,255,.09) 50%,rgba(255,255,255,.04) 75%' : '#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%'}); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:8px; }
        .card-hover { transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
        .card-hover:hover { transform:translateY(-3px); }
        .action-btn-ps { transition:all .18s ease; cursor:pointer; }
        .action-btn-ps:hover { transform:translateY(-1px); }
        .premium-table { width:100%; border-collapse:collapse; text-align:left; }
        .premium-table th {
          padding:12px 18px; font-weight:700;
          color:${colors.tableHeaderColor}; font-size:.75rem;
          text-transform:uppercase; letter-spacing:.8px;
          border-bottom:1px solid ${colors.cardBorder};
          background:${colors.tableHeaderBg};
        }
        .premium-table th:first-child { border-radius:10px 0 0 0; }
        .premium-table th:last-child  { border-radius:0 10px 0 0; }
        .premium-table td {
          padding:15px 18px; background:${colors.tableBg};
          border-bottom:1px solid ${colors.tableBorderColor};
          font-size:.92rem; transition:background .15s;
          vertical-align:middle; color:${colors.textSecondary};
        }
        .table-row:hover td { background:${colors.tableRowHover}; }
        .table-row:last-child td { border-bottom:none; }
        .status-badge {
          padding:5px 12px; border-radius:99px;
          font-size:.78rem; font-weight:700;
          display:inline-flex; align-items:center; gap:5px; white-space:nowrap;
        }
        .status-badge::before {
          content:''; width:6px; height:6px; border-radius:50%;
          background:currentColor; opacity:.7; flex-shrink:0;
        }
        .modal-ps-input {
          width:100%; padding:13px 16px; border-radius:10px;
          border:1.5px solid ${colors.inputBorder};
          background:${colors.inputBg}; color:${colors.inputColor};
          font-size:1rem; transition:all .2s; box-sizing:border-box;
          font-family:inherit;
        }
        .modal-ps-input:focus { border-color:#2563eb!important; box-shadow:0 0 0 3px rgba(37, 99, 235, .12)!important; outline:none; }
        .modal-ps-input::placeholder { color:${isDark ? '#475569' : '#94a3b8'}; }
        .btn-edit-ps { background:${isDark ? 'rgba(56,189,248,.1)' : '#eff6ff'}; color:${isDark ? '#38bdf8' : '#3b82f6'}; border:none; padding:6px 14px; border-radius:8px; font-weight:700; font-size:.85rem; cursor:pointer; transition:all .18s; }
        .btn-edit-ps:hover { background:${isDark ? 'rgba(56,189,248,.18)' : '#dbeafe'}; }
        .btn-delete-ps { background:${isDark ? 'rgba(239,68,68,.1)' : '#fee2e2'}; color:${isDark ? '#f87171' : '#ef4444'}; border:none; padding:6px 14px; border-radius:8px; font-weight:700; font-size:.85rem; cursor:pointer; transition:all .18s; }
        .btn-delete-ps:hover { background:${isDark ? 'rgba(239,68,68,.18)' : '#fecaca'}; }
        .btn-primary-ps { background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#0f172a; border:none; padding:10px 20px; border-radius:10px; font-weight:700; cursor:pointer; transition:all .2s; box-shadow:0 4px 16px rgba(37, 99, 235, .2); }
        .btn-primary-ps:hover { transform:translateY(-1px); box-shadow:0 8px 28px rgba(37, 99, 235, .4); }
        .btn-dark-ps { background:${isDark ? '#f8fafc' : '#0f172a'}; color:${isDark ? '#0f172a' : '#fff'}; border:none; padding:10px 20px; border-radius:10px; font-weight:700; cursor:pointer; transition:all .2s; }
        .btn-dark-ps:hover { opacity:.88; transform:translateY(-1px); }
        .btn-secondary-ps { background:${isDark ? 'rgba(255,255,255,.06)' : '#f8fafc'}; color:${isDark ? '#e2e8f0' : '#475569'}; border:1px solid ${colors.cardBorder}; padding:8px 16px; border-radius:10px; font-weight:600; font-size:.88rem; cursor:pointer; transition:all .18s; }
        .btn-secondary-ps:hover { background:${isDark ? 'rgba(255,255,255,.1)' : '#f1f5f9'}; }
        .dashboard-card-ps {
          background:${colors.cardBg};
          backdrop-filter:blur(20px) saturate(180%);
          -webkit-backdrop-filter:blur(20px) saturate(180%);
          border-radius:20px; padding:28px;
          border:1px solid ${colors.cardBorder};
          box-shadow:${isDark ? '0 1px 3px rgba(0,0,0,.25), 0 4px 20px rgba(0,0,0,.15)' : '0 1px 3px rgba(0,0,0,.05), 0 4px 12px rgba(0,0,0,.04)'};
          transition:box-shadow .3s ease, transform .3s ease, border-color .3s ease;
        }
        ${isDark ? `.dashboard-card-ps:hover { border-color:rgba(37, 99, 235, 0.18)!important; box-shadow:0 8px 32px rgba(0,0,0,.3),0 0 0 1px rgba(37, 99, 235, 0.07)!important; }` : `.dashboard-card-ps:hover { box-shadow:0 8px 24px rgba(0,0,0,.1)!important; }`}
        .ps-text-primary { color:${colors.textPrimary}!important; }
        .ps-text-secondary { color:${colors.textSecondary}!important; }
        .ps-text-muted { color:${isDark ? '#64748b' : '#94a3b8'}!important; }
        .ps-border-color { border-color:${colors.cardBorder}!important; }
        .ps-input-bg { background:${colors.inputBg}!important; }
        .modal-overlay-ps {
          position:fixed; inset:0;
          background:rgba(0,0,0,.78);
          z-index:9999; display:flex; align-items:center; justify-content:center;
          backdrop-filter:blur(16px);
          animation:fadeInOverlay .25s ease;
        }
        @keyframes fadeInOverlay { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }
        .modal-box-ps {
          background:${isDark ? 'rgba(9,9,11,0.95)' : '#fff'};
          backdrop-filter:blur(24px);
          -webkit-backdrop-filter:blur(24px);
          border-radius:24px; width:90%; max-width:520px;
          padding:36px; max-height:90vh; overflow-y:auto;
          box-shadow:0 30px 60px rgba(0,0,0,.5), 0 0 0 1px ${colors.cardBorder};
          animation:slideUp .35s cubic-bezier(.16,1,.3,1);
        }
        .modal-title-ps { margin:0 0 6px; font-size:1.6rem; font-weight:900; letter-spacing:-.4px; color:${colors.textPrimary}; }
        .modal-sub-ps { margin:0; font-size:.92rem; color:${colors.textSecondary}; }
        .modal-close-ps {
          background:none; border:none; font-size:1.6rem; cursor:pointer;
          color:${isDark ? '#64748b' : '#94a3b8'}; width:38px; height:38px; border-radius:50%;
          display:flex; align-items:center; justify-content:center; transition:all .2s;
        }
        .modal-close-ps:hover { background:${isDark ? 'rgba(255,255,255,.08)' : '#f1f5f9'}; color:#ef4444; }
        .modal-btn-cancel-ps {
          flex:1; padding:14px; border-radius:12px;
          border:1.5px solid ${colors.cardBorder};
          background:${isDark ? 'rgba(255,255,255,.05)' : '#f8fafc'};
          color:${colors.textSecondary}; font-weight:700; font-size:1rem; cursor:pointer; transition:all .2s;
        }
        .modal-btn-cancel-ps:hover { background:${isDark ? 'rgba(255,255,255,.09)' : '#e2e8f0'}; color:${colors.textPrimary}; }
        .modal-btn-submit-ps {
          flex:1; padding:14px; border-radius:12px;
          border:none; background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff;
          font-weight:800; font-size:1rem; cursor:pointer; transition:all .2s;
          box-shadow:0 4px 16px rgba(37, 99, 235, .2);
        }
        .modal-btn-submit-ps:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(37, 99, 235, .38); }
        .modal-btn-submit-ps:disabled { opacity:.55; cursor:not-allowed; transform:none; box-shadow:none; }
        .modal-btn-danger-ps {
          flex:1; padding:14px; border-radius:12px;
          border:none; background:#ef4444; color:#fff;
          font-weight:800; font-size:1rem; cursor:pointer; transition:all .2s;
        }
        .modal-btn-danger-ps:hover { background:#dc2626; transform:translateY(-2px); box-shadow:0 10px 20px rgba(239,68,68,.3); }
        .modal-label-ps { font-size:.82rem; font-weight:700; color:${colors.textSecondary}; text-transform:uppercase; letter-spacing:.6px; margin-bottom:6px; display:block; }
        .modal-warning-ps { padding:18px; background:${isDark ? 'rgba(239,68,68,.08)' : '#fef2f2'}; border-radius:14px; border:1px solid ${isDark ? 'rgba(239,68,68,.2)' : '#fecaca'}; }
        .modal-warning-ps p { margin:0; color:${isDark ? '#fca5a5' : '#991b1b'}; font-size:.95rem; line-height:1.7; }
        .modal-info-ps { padding:16px; background:${isDark ? 'rgba(255,255,255,.04)' : '#f8fafc'}; border-radius:14px; border:1px dashed ${isDark ? 'rgba(255,255,255,.1)' : '#cbd5e1'}; }
        .bell-ring { animation: bellRing 0.5s ease; }
      `}</style>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', zIndex:30, backdropFilter:'blur(4px)' }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar-ps ${isSidebarOpen ? 'open' : ''}`} style={{
        width: 268,
        background: colors.sidebar,
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderRadius: 20,
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px -10px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.06)',
        zIndex: 40, flexShrink: 0, overflow: 'hidden',
        transition: 'transform .3s cubic-bezier(.16,1,.3,1)',
      }}>
        {/* Brand */}
        <div style={{ padding:'22px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:`1px solid rgba(255,255,255,0.06)`, background:'linear-gradient(180deg,rgba(37, 99, 235, 0.07) 0%,transparent 100%)' }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#2563eb,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', fontWeight:900, color: '#ffffff', boxShadow:'0 4px 18px rgba(37, 99, 235, .5)', flexShrink:0 }}>P</div>
          <h2 style={{ color:'#fff', margin:0, fontSize:'1.3rem', fontWeight:900, letterSpacing:'-.5px' }}>Play<span style={{ color:'#2563eb' }}>Stop</span></h2>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'14px 10px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { onTabChange(item.label); setIsSidebarOpen(false); }}
              className={`nav-item-ps ${activeTab === item.label ? 'active' : ''} ${tourHighlight === item.label ? 'tour-highlight' : ''}`}
            >
              <span className="nav-icon"><i className={`bi ${item.icon}`} /></span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding:16, borderTop:`1px solid rgba(255,255,255,0.06)`, background:'rgba(0,0,0,.25)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <UserAvatar name={user?.name} src={avatarUrl} />
            <div style={{ overflow:'hidden' }}>
              <p style={{ margin:0, color:'#f8fafc', fontWeight:700, fontSize:'.88rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>{user?.name || 'Usuario'}</p>
              <p style={{ margin:0, color:'#4b5563', fontSize:'.75rem', fontWeight:500, textTransform:'uppercase', letterSpacing:'.4px' }}>{user?.role || 'Miembro'}</p>
            </div>
          </div>
          <button className="logout-ps" onClick={onLogout}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>

        {/* Header */}
        <header style={{
          height:68, minHeight:68,
          background: colors.headerBg,
          backdropFilter:'blur(20px) saturate(180%)',
          WebkitBackdropFilter:'blur(20px) saturate(180%)',
          borderRadius:16,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 24px',
          boxShadow: isDark
            ? '0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,.25)'
            : '0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)',
          border:`1px solid ${colors.headerBorder}`,
          marginBottom:20,
          position:'relative',
        }}>
          <div style={{ display:'flex', alignItems:'center' }}>
            <button className="menu-btn-ps" onClick={() => setIsSidebarOpen(true)} style={{ color: colors.titleColor }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h1 style={{ margin:0, color:colors.titleColor, fontSize:'1.2rem', fontWeight:800, letterSpacing:'-.3px' }}>{title}</h1>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {onRestartTour && (
              <button
                onClick={onRestartTour}
                title="Ver tour de ayuda"
                style={{
                  width:38, height:38, borderRadius:10,
                  border:`1px solid ${colors.cardBorder}`,
                  background:isDark?'rgba(37, 99, 235, 0.08)':'rgba(37, 99, 235, 0.06)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  cursor:'pointer', transition:'all .18s', color:'#2563eb',
                  fontSize:'.85rem', fontWeight:800,
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(37, 99, 235, 0.15)'; e.currentTarget.style.transform = 'scale(1.06)'; }}
                onMouseOut={e => { e.currentTarget.style.background = isDark?'rgba(37, 99, 235, 0.08)':'rgba(37, 99, 235, 0.06)'; e.currentTarget.style.transform = ''; }}
              >
                ?
              </button>
            )}
            <button onClick={toggleTheme} title={isDark ? 'Modo claro' : 'Modo oscuro'} style={{ width:38, height:38, borderRadius:10, border:`1px solid ${colors.cardBorder}`, background:isDark?'rgba(255,255,255,.06)':'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all .18s', color:colors.textSecondary }}>
              {isDark
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>

            {/* Notification Bell */}
            <div ref={notifRef} style={{ position:'relative' }}>
              <button
                onClick={handleBellClick}
                title="Notificaciones"
                style={{
                  width:38, height:38, borderRadius:10,
                  border:`1px solid ${unreadCount > 0 ? 'rgba(239,68,68,0.4)' : colors.cardBorder}`,
                  background: unreadCount > 0 ? (isDark ? 'rgba(239,68,68,0.08)' : '#fef2f2') : (isDark?'rgba(255,255,255,.06)':'#f8fafc'),
                  display:'flex', alignItems:'center', justifyContent:'center',
                  cursor:'pointer', color:colors.textSecondary, position:'relative',
                  transition:'all .2s',
                }}
              >
                <svg
                  width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke={unreadCount > 0 ? '#ef4444' : 'currentColor'}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={unreadCount > 0 ? 'bell-ring' : ''}
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && (
                  <span style={{
                    position:'absolute', top:5, right:5,
                    width:8, height:8, borderRadius:'50%',
                    background:'#ef4444',
                    border:`2px solid ${isDark ? '#09090b' : '#f1f5f9'}`,
                    boxShadow:'0 0 6px rgba(239,68,68,0.6)',
                  }} />
                )}
              </button>

              <AnimatePresence>
                {showNotifPanel && createPortal(
                  <NotificationPanel
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkAllRead={markAllRead}
                    onClearAll={clearAll}
                    onClose={() => setShowNotifPanel(false)}
                    isDark={isDark}
                  />,
                  document.body
                )}
              </AnimatePresence>
            </div>

            <UserAvatar name={user?.name} size={36} />
          </div>
        </header>

        {/* Content — Framer Motion tab transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ flex:1, paddingBottom:32, overflowY:'auto', paddingRight:4 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <ChatbotWidget isDark={isDark} />

      {/* Toast stack */}
      <ToastStack toasts={toasts} onDismiss={dismissToast} onOpenChat={onOpenChat} />
    </div>
  );
};

/* ─── MetricCard with count-up ──────────────────────────── */
const METRIC_ICONS = {
  up: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  down: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  neutral: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

function useCountUp(target, duration = 1400) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target <= 0) { setCount(target); return; }
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

export const MetricCard = ({ title, value, subtitle, color, trend, index = 0 }) => {
  // Extract numeric part for count-up; leave non-numeric values as-is
  const numMatch = typeof value === 'string' ? value.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/) : null;
  const numTarget = numMatch ? parseFloat(numMatch[2]) : (typeof value === 'number' ? value : null);
  const prefix = numMatch ? numMatch[1] : '';
  const suffix = numMatch ? numMatch[3] : '';
  const shouldAnimate = numTarget !== null && !isNaN(numTarget);

  const counted = useCountUp(shouldAnimate ? numTarget : 0);
  const displayValue = shouldAnimate
    ? `${prefix}${Number.isInteger(numTarget) ? counted : counted.toFixed(1)}${suffix}`
    : value;

  return (
    <motion.div
      className="dashboard-card-ps card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: 'easeOut' } }}
      style={{ display:'flex', flexDirection:'column', position:'relative', overflow:'hidden', borderTop:`2px solid ${color}` }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
        <div style={{ width:46, height:46, borderRadius:13, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', color, boxShadow:`0 0 16px ${color}20` }}>
          {METRIC_ICONS[trend || 'neutral']}
        </div>
        {trend && (
          <span style={{ padding:'4px 10px', borderRadius:99, background:trend==='up'?'rgba(16,185,129,0.12)':'rgba(239,68,68,0.12)', color:trend==='up'?'#10b981':'#ef4444', fontSize:'.78rem', fontWeight:800, display:'flex', alignItems:'center', gap:3 }}>
            {trend==='up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      <p className="ps-text-muted" style={{ margin:'0 0 4px', fontSize:'.82rem', fontWeight:600, letterSpacing:'.3px' }}>{title}</p>
      <p className="ps-text-primary" style={{ margin:0, fontSize:'2rem', fontWeight:900, letterSpacing:'-1px', lineHeight:1 }}>{displayValue}</p>
      {subtitle && (
        <div className="ps-text-muted" style={{ marginTop:16, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.06)', fontSize:'.82rem', fontWeight:500, display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:color, display:'inline-block', flexShrink:0, boxShadow:`0 0 6px ${color}80` }} />
          {subtitle}
        </div>
      )}
    </motion.div>
  );
};

/* ─── Skeletons ────────────────────────────────────────── */
export const SkeletonCard = () => (
  <div className="dashboard-card-ps" style={{ display:'flex', flexDirection:'column', gap:14 }}>
    <div className="skeleton" style={{ height:46, width:46, borderRadius:13 }} />
    <div className="skeleton" style={{ height:14, width:'55%' }} />
    <div className="skeleton" style={{ height:34, width:'70%' }} />
    <div className="skeleton" style={{ height:12, width:'80%', marginTop:8 }} />
  </div>
);

export const SkeletonTable = ({ rows = 4 }) => (
  <div className="dashboard-card-ps" style={{ padding:0, overflow:'hidden' }}>
    <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:12 }}>
      {[45,30,15].map((w,i) => <div key={i} className="skeleton" style={{ height:12, width:`${w}%` }} />)}
    </div>
    {Array.from({ length:rows }).map((_,i) => (
      <div key={i} style={{ padding:'18px 24px', borderBottom:i<rows-1?'1px solid rgba(255,255,255,0.04)':'none', display:'flex', gap:16, alignItems:'center' }}>
        <div className="skeleton" style={{ height:13, width:'25%' }} />
        <div className="skeleton" style={{ height:13, width:'35%' }} />
        <div className="skeleton" style={{ height:22, width:80, borderRadius:99 }} />
        <div className="skeleton" style={{ height:30, width:70, borderRadius:8, marginLeft:'auto' }} />
      </div>
    ))}
  </div>
);

export const SkeletonCourtGrid = ({ count = 3 }) => (
  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
    {Array.from({ length:count }).map((_,i) => (
      <div key={i} className="dashboard-card-ps" style={{ padding:0, overflow:'hidden' }}>
        <div className="skeleton" style={{ height:160, borderRadius:0 }} />
        <div style={{ padding:20, display:'flex', flexDirection:'column', gap:12 }}>
          <div className="skeleton" style={{ height:16, width:'65%' }} />
          <div className="skeleton" style={{ height:12, width:'45%' }} />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:4 }}>
            <div className="skeleton" style={{ height:20, width:80 }} />
            <div className="skeleton" style={{ height:34, width:90, borderRadius:8 }} />
          </div>
        </div>
      </div>
    ))}
  </div>
);
