import { useState, useRef, useEffect } from 'react';

/* ─── Chatbot data ──────────────────────────────────────── */
const BOT_REPLIES = [
  { keywords: ['hola','hi','hello','buenas','buen'], reply: '¡Hola! 👋 Soy el asistente de PlayStop. ¿En qué te puedo ayudar hoy?' },
  { keywords: ['reserva','reservar','reservacion','reservación','booking'], reply: 'Para gestionar tus reservas, ve a la sección "Mis Reservas" en el menú lateral. ¿Tienes algún problema específico con una reserva?' },
  { keywords: ['pago','cobro','factura','tarjeta','culqi','precio'], reply: 'Los pagos se procesan de forma segura a través de Culqi. Si tuviste un problema, contáctanos en soporte@playstop.pe con tu número de reserva.' },
  { keywords: ['cancha','campo','pista','court','buscar'], reply: 'Puedes buscar canchas en "Buscar Canchas". Filtra por deporte, ciudad, precio y más. 🏟️' },
  { keywords: ['cancelar','devolucion','devolución','reembolso','refund'], reply: 'Para cancelar una reserva, ve a "Mis Reservas" y haz clic en "Cancelar". Las cancelaciones con más de 24h de anticipación son gratuitas.' },
  { keywords: ['problema','error','falla','fallo','bug','reporte','reportar','incidencia'], reply: 'Lamentamos el inconveniente. 😔 Descríbenos el problema aquí o escríbenos a soporte@playstop.pe. ¿Qué ocurrió exactamente?' },
  { keywords: ['propietario','owner','local','tienda','negocio'], reply: 'Los propietarios pueden gestionar canchas, productos y reservas desde su dashboard. ¿Necesitas ayuda con alguna función específica?' },
  { keywords: ['horario','hora','slot','turno','disponible'], reply: 'Los horarios disponibles aparecen al seleccionar una cancha y elegir fecha. Cada bloque es de 1 hora. ⏰' },
  { keywords: ['perfil','cuenta','contraseña','password','datos'], reply: 'Actualiza tu perfil y contraseña en la sección "Mi Perfil" del menú lateral. 👤' },
  { keywords: ['qr','código','codigo','entrada','acceso'], reply: 'Tu código QR se genera al confirmar la reserva. Encuéntralo en "Mis Reservas" → Ver QR. 📱' },
  { keywords: ['gracias','thanks','ok','perfecto','listo','genial','excelente'], reply: '¡De nada! Si necesitas algo más, aquí estaré. ¡Que disfrutes tu partido! 🏅' },
  { keywords: ['soporte','ayuda','help','contacto','contact'], reply: 'Puedes contactarnos por: 📧 soporte@playstop.pe | 📞 +51 1 234-5678 (Lun-Vie 9am-6pm).' },
  { keywords: ['como funciona','funcionamiento','como','cómo'], reply: 'PlayStop es la plataforma líder para reservar canchas deportivas en Perú. Busca, filtra y reserva en segundos. ¡Es muy fácil! ⚽' },
];

const QUICK_REPLIES = [
  { label: '🐛 Reportar problema', text: 'Quiero reportar un problema' },
  { label: '📅 Problema con reserva', text: 'Tengo un problema con mi reserva' },
  { label: '💳 Problema de pago', text: 'Tuve un problema con mi pago' },
  { label: '❓ ¿Cómo funciona?', text: '¿Cómo funciona PlayStop?' },
];

const getBotReply = (msg) => {
  const lower = msg.toLowerCase();
  for (const { keywords, reply } of BOT_REPLIES) {
    if (keywords.some(k => lower.includes(k))) return reply;
  }
  return 'Entiendo. Para atención personalizada escríbenos a soporte@playstop.pe o llama al +51 1 234-5678 (Lun-Vie, 9am-6pm). ¿Hay algo más en que te pueda ayudar?';
};

/* ─── ChatbotWidget ─────────────────────────────────────── */
const ChatbotWidget = ({ isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: '¡Hola! 👋 Soy el asistente de PlayStop. ¿En qué te puedo ayudar hoy?', id: 0 },
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

  const chatBg = isDark ? '#0f172a' : '#fff';
  const botBubbleBg = isDark ? '#1e293b' : '#f1f5f9';
  const botBubbleColor = isDark ? '#f8fafc' : '#0f172a';
  const inputBg = isDark ? '#020617' : '#f8fafc';
  const inputBorder = isDark ? '#1e293b' : '#e2e8f0';
  const inputColor = isDark ? '#f8fafc' : '#0f172a';

  return (
    <>
      <style>{`
        @keyframes chatSlideUp { from{opacity:0;transform:translateY(16px) scale(.96);}to{opacity:1;transform:translateY(0) scale(1);} }
        @keyframes chatPop { from{transform:scale(0) rotate(-20deg);}to{transform:scale(1) rotate(0);} }
        @keyframes chatDot { 0%,80%,100%{transform:scale(0);opacity:.4;}40%{transform:scale(1);opacity:1;} }
        .chat-send-btn:hover:not(:disabled){filter:brightness(1.1);transform:scale(1.06);}
        .chat-quick-btn{padding:6px 13px;border-radius:20px;border:1.5px solid ${isDark?'#334155':'#e2e8f0'};background:${isDark?'#1e293b':'#fff'};color:${isDark?'#94a3b8':'#475569'};font-size:.77rem;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .18s;font-family:inherit;}
        .chat-quick-btn:hover{border-color:#00d084;color:#00d084;background:${isDark?'rgba(0,208,132,.08)':'rgba(0,208,132,.05)'};}
      `}</style>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          position:'fixed', bottom:24, right:24, zIndex:9990,
          width:56, height:56, borderRadius:'50%',
          background: isOpen ? '#ef4444' : 'linear-gradient(135deg,#00d084,#00b875)',
          border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 4px 20px rgba(0,0,0,0.3)', transition:'all .3s cubic-bezier(.16,1,.3,1)',
          fontSize:'1.4rem', animation:'chatPop 0.5s cubic-bezier(.34,1.56,.64,1)',
        }}
        title={isOpen ? 'Cerrar chat' : 'Abrir asistente'}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div style={{
          position:'fixed', bottom:92, right:24, zIndex:9989,
          width:360, maxWidth:'calc(100vw - 48px)',
          borderRadius:24, overflow:'hidden',
          boxShadow:'0 20px 60px rgba(0,0,0,0.35)',
          animation:'chatSlideUp 0.3s cubic-bezier(.16,1,.3,1)',
          display:'flex', flexDirection:'column', maxHeight:'72vh',
        }}>
          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,#0f172a,#1e3a5f)', padding:'16px 20px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(0,208,132,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 }}>🤖</div>
            <div style={{ flex:1 }}>
              <p style={{ margin:0, color:'#fff', fontWeight:800, fontSize:'.95rem' }}>Asistente PlayStop</p>
              <p style={{ margin:0, color:'rgba(255,255,255,.55)', fontSize:'.73rem', display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#00d084', display:'inline-block' }} /> En línea ahora
              </p>
            </div>
            <button onClick={() => setMessages([{ from:'bot', text:'¡Hola! 👋 ¿En qué te puedo ayudar?', id:nextId.current++ }]) || setShowQuick(true)}
              style={{ background:'rgba(255,255,255,.1)', border:'none', color:'rgba(255,255,255,.6)', fontSize:'.75rem', fontWeight:700, padding:'4px 10px', borderRadius:8, cursor:'pointer' }}>
              Nueva chat
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:16, background:chatBg, display:'flex', flexDirection:'column', gap:10 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display:'flex', justifyContent:msg.from==='user'?'flex-end':'flex-start', gap:8, alignItems:'flex-end' }}>
                {msg.from === 'bot' && (
                  <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(0,208,132,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.85rem', flexShrink:0 }}>🤖</div>
                )}
                <div style={{
                  maxWidth:'78%', padding:'10px 14px',
                  borderRadius: msg.from==='user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.from==='user' ? '#00d084' : botBubbleBg,
                  color: msg.from==='user' ? '#0f172a' : botBubbleColor,
                  fontSize:'.88rem', fontWeight:500, lineHeight:1.55,
                  boxShadow:'0 2px 8px rgba(0,0,0,.07)',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(0,208,132,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.85rem', flexShrink:0 }}>🤖</div>
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
                  <button key={qr.label} className="chat-quick-btn" onClick={() => sendMessage(qr.text)}>{qr.label}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding:'10px 12px', background:chatBg, borderTop:`1px solid ${inputBorder}`, display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
            <input
              type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Escribe tu mensaje..."
              style={{ flex:1, padding:'9px 14px', borderRadius:12, border:`1.5px solid ${inputBorder}`, background:inputBg, color:inputColor, fontSize:'.87rem', outline:'none', fontFamily:'inherit' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="chat-send-btn"
              style={{
                width:38, height:38, borderRadius:'50%', border:'none',
                background: input.trim() ? '#00d084' : (isDark?'#1e293b':'#e2e8f0'),
                color: input.trim() ? '#0f172a' : '#94a3b8',
                cursor: input.trim() ? 'pointer' : 'default',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, transition:'all .18s', fontSize:'1rem',
              }}
            >➤</button>
          </div>
        </div>
      )}
    </>
  );
};

const UserAvatar = ({ name, size = 44 }) => {
  const gradients = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#00d084,#00b875)',
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
      background: gradients[idx],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, fontSize: size * 0.42,
      flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    }}>
      {initial}
    </div>
  );
};

export const DashboardLayout = ({
  user, onLogout, title, menuItems,
  activeTab, onTabChange, children, darkMode, toggleTheme,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDark = darkMode;

  const colors = {
    bg: isDark ? '#020617' : '#f1f5f9',
    sidebar: isDark ? '#070e1f' : '#0f172a',
    sidebarBorder: 'rgba(255,255,255,0.07)',
    cardBg: isDark ? '#0f172a' : '#ffffff',
    cardBorder: isDark ? '#1e293b' : '#e2e8f0',
    headerBg: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
    headerBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)',
    titleColor: isDark ? '#f8fafc' : '#0f172a',
    textPrimary: isDark ? '#f8fafc' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#475569',
    tableBg: isDark ? '#0f172a' : '#fff',
    tableHeaderBg: isDark ? '#0a0f1e' : '#fafbfc',
    tableHeaderColor: isDark ? '#475569' : '#94a3b8',
    tableRowHover: isDark ? '#1a2236' : '#fafbff',
    tableBorderColor: isDark ? '#1a2236' : '#f8fafc',
    inputBg: isDark ? '#020617' : '#f8fafc',
    inputBorder: isDark ? '#1e293b' : '#e2e8f0',
    inputColor: isDark ? '#f8fafc' : '#0f172a',
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', width: '100vw',
      background: colors.bg,
      backgroundImage: `radial-gradient(${isDark ? '#1e293b' : '#cbd5e1'} 1px, transparent 0)`,
      backgroundSize: '28px 28px',
      padding: 20, gap: 20, boxSizing: 'border-box',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes contentFadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .tab-content { animation: contentFadeIn .35s cubic-bezier(.16,1,.3,1) forwards; }
        .nav-item-ps {
          display:flex; align-items:center; gap:10px;
          padding:11px 14px; color:#94a3b8;
          font-weight:600; font-size:.92rem;
          border-radius:12px; transition:all .18s ease;
          cursor:pointer; border:none; background:none; width:100%; text-align:left;
        }
        .nav-item-ps:hover { background:rgba(255,255,255,.06); color:#f8fafc; }
        .nav-item-ps.active {
          background:linear-gradient(135deg,rgba(0,208,132,.2),rgba(0,208,132,.08));
          color:#00d084; font-weight:700; box-shadow:inset 3px 0 0 #00d084;
        }
        .nav-item-ps:hover .nav-icon { transform:scale(1.1); }
        .nav-item-ps.active .nav-icon { transform:scale(1.12); }
        .nav-icon { font-size:1.05rem; width:22px; text-align:center; flex-shrink:0; transition:transform .2s; }
        .logout-ps {
          width:100%; padding:10px; border-radius:10px;
          background:rgba(255,255,255,.06); color:#94a3b8; border:none;
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
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:99px; }
        ::-webkit-scrollbar-thumb:hover { background:#cbd5e1; }
        .skeleton { background:linear-gradient(90deg,${isDark ? '#1e293b 25%,#0f172a 50%,#1e293b 75%' : '#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%'}); background-size:200% 100%; animation:shimmer 1.2s infinite; border-radius:8px; }
        .card-hover { transition:all .25s ease; }
        .card-hover:hover { transform:translateY(-4px); box-shadow:0 16px 32px rgba(0,0,0,.12)!important; }
        .action-btn-ps { transition:all .18s ease; cursor:pointer; }
        .action-btn-ps:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(0,0,0,.12); }
        .premium-table { width:100%; border-collapse:collapse; text-align:left; }
        .premium-table th {
          padding:12px 18px; font-weight:600;
          color:${colors.tableHeaderColor}; font-size:.78rem;
          text-transform:uppercase; letter-spacing:.6px;
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
          border:2px solid ${colors.inputBorder};
          background:${colors.inputBg}; color:${colors.inputColor};
          font-size:1rem; transition:all .2s; box-sizing:border-box;
          font-family:inherit;
        }
        .modal-ps-input:focus { border-color:#00d084!important; box-shadow:0 0 0 4px rgba(0,208,132,.15)!important; outline:none; background:${isDark ? '#0a0f1e' : '#fff'}!important; }
        .modal-ps-input::placeholder { color:${isDark ? '#475569' : '#94a3b8'}; }
        .btn-edit-ps { background:${isDark ? 'rgba(59,130,246,.15)' : '#eff6ff'}; color:${isDark ? '#60a5fa' : '#3b82f6'}; border:none; padding:6px 14px; border-radius:8px; font-weight:700; font-size:.85rem; cursor:pointer; transition:all .18s; }
        .btn-edit-ps:hover { background:${isDark ? 'rgba(59,130,246,.25)' : '#dbeafe'}; }
        .btn-delete-ps { background:${isDark ? 'rgba(239,68,68,.15)' : '#fee2e2'}; color:${isDark ? '#f87171' : '#ef4444'}; border:none; padding:6px 14px; border-radius:8px; font-weight:700; font-size:.85rem; cursor:pointer; transition:all .18s; }
        .btn-delete-ps:hover { background:${isDark ? 'rgba(239,68,68,.25)' : '#fecaca'}; }
        .btn-primary-ps { background:#00d084; color:#0f172a; border:none; padding:10px 20px; border-radius:10px; font-weight:700; cursor:pointer; transition:all .2s; }
        .btn-primary-ps:hover { background:#00b875; transform:translateY(-1px); box-shadow:0 8px 20px rgba(0,208,132,.3); }
        .btn-dark-ps { background:${isDark ? '#f8fafc' : '#0f172a'}; color:${isDark ? '#0f172a' : '#fff'}; border:none; padding:10px 20px; border-radius:10px; font-weight:700; cursor:pointer; transition:all .2s; }
        .btn-dark-ps:hover { opacity:.88; transform:translateY(-1px); }
        .btn-secondary-ps { background:${isDark ? 'rgba(255,255,255,.06)' : '#f8fafc'}; color:${isDark ? '#f8fafc' : '#475569'}; border:1px solid ${colors.cardBorder}; padding:8px 16px; border-radius:10px; font-weight:600; font-size:.88rem; cursor:pointer; transition:all .18s; }
        .btn-secondary-ps:hover { background:${isDark ? 'rgba(255,255,255,.1)' : '#f1f5f9'}; }
        .dashboard-card-ps {
          background:${colors.cardBg}; border-radius:20px; padding:28px;
          border:1px solid ${colors.cardBorder};
          box-shadow:0 1px 3px rgba(0,0,0,.05), 0 4px 12px rgba(0,0,0,.04);
          transition:box-shadow .25s ease, transform .25s ease;
        }
        .dashboard-card-ps:hover { box-shadow:0 8px 24px rgba(0,0,0,.1); }
        .ps-text-primary { color:${colors.textPrimary}!important; }
        .ps-text-secondary { color:${colors.textSecondary}!important; }
        .ps-text-muted { color:${isDark ? '#64748b' : '#94a3b8'}!important; }
        .ps-border-color { border-color:${colors.cardBorder}!important; }
        .ps-input-bg { background:${colors.inputBg}!important; }
        .modal-overlay-ps {
          position:fixed; inset:0;
          background:rgba(15,23,42,.88);
          z-index:9999; display:flex; align-items:center; justify-content:center;
          backdrop-filter:blur(12px);
          animation:fadeInOverlay .25s ease;
        }
        @keyframes fadeInOverlay { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }
        .modal-box-ps {
          background:${colors.cardBg};
          border-radius:24px; width:90%; max-width:520px;
          padding:36px; max-height:90vh; overflow-y:auto;
          box-shadow:0 30px 60px rgba(0,0,0,.4), 0 0 0 1px ${colors.cardBorder};
          animation:slideUp .35s cubic-bezier(.16,1,.3,1);
        }
        .modal-title-ps { margin:0 0 6px; font-size:1.6rem; font-weight:900; letter-spacing:-.4px; color:${colors.textPrimary}; }
        .modal-sub-ps { margin:0; font-size:.92rem; color:${colors.textSecondary}; }
        .modal-close-ps {
          background:none; border:none; font-size:1.6rem; cursor:pointer;
          color:${isDark ? '#64748b' : '#94a3b8'}; width:38px; height:38px; border-radius:50%;
          display:flex; align-items:center; justify-content:center; transition:all .2s;
        }
        .modal-close-ps:hover { background:${isDark ? '#1e293b' : '#f1f5f9'}; color:#ef4444; }
        .modal-btn-cancel-ps {
          flex:1; padding:14px; border-radius:12px;
          border:2px solid ${colors.cardBorder};
          background:${isDark ? '#1e293b' : '#f8fafc'};
          color:${colors.textSecondary}; font-weight:700; font-size:1rem; cursor:pointer; transition:all .2s;
        }
        .modal-btn-cancel-ps:hover { background:${isDark ? '#0f172a' : '#e2e8f0'}; color:${colors.textPrimary}; }
        .modal-btn-submit-ps {
          flex:1; padding:14px; border-radius:12px;
          border:none; background:#00d084; color:#fff;
          font-weight:800; font-size:1rem; cursor:pointer; transition:all .2s;
        }
        .modal-btn-submit-ps:hover { background:#00b875; transform:translateY(-2px); box-shadow:0 10px 20px rgba(0,208,132,.3); }
        .modal-btn-submit-ps:disabled { opacity:.6; cursor:not-allowed; transform:none; box-shadow:none; }
        .modal-btn-danger-ps {
          flex:1; padding:14px; border-radius:12px;
          border:none; background:#ef4444; color:#fff;
          font-weight:800; font-size:1rem; cursor:pointer; transition:all .2s;
        }
        .modal-btn-danger-ps:hover { background:#dc2626; transform:translateY(-2px); box-shadow:0 10px 20px rgba(239,68,68,.3); }
        .modal-label-ps { font-size:.85rem; font-weight:700; color:${colors.textSecondary}; text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px; display:block; }
        .modal-warning-ps { padding:18px; background:${isDark ? 'rgba(239,68,68,.1)' : '#fef2f2'}; border-radius:14px; border:1px solid ${isDark ? 'rgba(239,68,68,.2)' : '#fecaca'}; }
        .modal-warning-ps p { margin:0; color:${isDark ? '#fca5a5' : '#991b1b'}; font-size:.95rem; line-height:1.7; }
        .modal-info-ps { padding:16px; background:${isDark ? '#1e293b' : '#f8fafc'}; border-radius:14px; border:1px dashed ${isDark ? '#334155' : '#cbd5e1'}; }
      `}</style>

      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(15,23,42,.55)', zIndex:30, backdropFilter:'blur(4px)' }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar-ps ${isSidebarOpen ? 'open' : ''}`} style={{
        width: 268, background: colors.sidebar,
        borderRadius: 20, display:'flex', flexDirection:'column',
        boxShadow:'0 20px 60px -10px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.05)',
        zIndex: 40, flexShrink: 0, overflow:'hidden',
        transition:'transform .3s cubic-bezier(.16,1,.3,1)',
      }}>
        {/* Brand */}
        <div style={{ padding:'22px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:`1px solid ${colors.sidebarBorder}`, background:'linear-gradient(180deg,rgba(0,208,132,.08) 0%,transparent 100%)' }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#00d084,#00b875)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', fontWeight:900, color:'#0f172a', boxShadow:'0 4px 12px rgba(0,208,132,.35)', flexShrink:0 }}>P</div>
          <h2 style={{ color:'#fff', margin:0, fontSize:'1.3rem', fontWeight:900, letterSpacing:'-.5px' }}>Play<span style={{ color:'#00d084' }}>Stop</span></h2>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'14px 10px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { onTabChange(item.label); setIsSidebarOpen(false); }}
              className={`nav-item-ps ${activeTab === item.label ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding:16, borderTop:`1px solid ${colors.sidebarBorder}`, background:'rgba(0,0,0,.2)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <UserAvatar name={user?.name} />
            <div style={{ overflow:'hidden' }}>
              <p style={{ margin:0, color:'#f8fafc', fontWeight:700, fontSize:'.88rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>{user?.name || 'Usuario'}</p>
              <p style={{ margin:0, color:'#64748b', fontSize:'.75rem', fontWeight:500, textTransform:'uppercase', letterSpacing:'.4px' }}>{user?.role || 'Miembro'}</p>
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
          backdropFilter:'blur(12px)',
          borderRadius:16,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 24px',
          boxShadow:`0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)`,
          border:`1px solid ${colors.headerBorder}`,
          marginBottom:20,
        }}>
          <div style={{ display:'flex', alignItems:'center' }}>
            <button className="menu-btn-ps" onClick={() => setIsSidebarOpen(true)} style={{ color: colors.titleColor }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h1 style={{ margin:0, color:colors.titleColor, fontSize:'1.25rem', fontWeight:800, letterSpacing:'-.4px' }}>{title}</h1>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={toggleTheme} title={isDark ? 'Modo claro' : 'Modo oscuro'} style={{ width:38, height:38, borderRadius:10, border:`1px solid ${colors.cardBorder}`, background:isDark?'#1e293b':'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all .18s', color:colors.textSecondary }}>
              {isDark
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
            <button title="Notificaciones" style={{ width:38, height:38, borderRadius:10, border:`1px solid ${colors.cardBorder}`, background:isDark?'#1e293b':'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:colors.textSecondary, position:'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span style={{ position:'absolute', top:7, right:7, width:7, height:7, borderRadius:'50%', background:'#ef4444', border:'2px solid white' }} />
            </button>
            <UserAvatar name={user?.name} size={36} />
          </div>
        </header>

        {/* Content */}
        <div className="tab-content" key={activeTab} style={{ flex:1, paddingBottom:32, overflowY:'auto', paddingRight:4 }}>
          {children}
        </div>
      </main>

      <ChatbotWidget isDark={isDark} />
    </div>
  );
};

/* ─── MetricCard ───────────────────────────────────────── */
const METRIC_ICONS = {
  up: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  down: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  neutral: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

export const MetricCard = ({ title, value, subtitle, color, trend }) => (
  <div className="dashboard-card-ps card-hover" style={{ display:'flex', flexDirection:'column', position:'relative', overflow:'hidden', borderTop:`3px solid ${color}` }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
      <div style={{ width:46, height:46, borderRadius:13, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', color }}>
        {METRIC_ICONS[trend || 'neutral']}
      </div>
      {trend && (
        <span style={{ padding:'4px 10px', borderRadius:99, background:trend==='up'?'#d1fae5':'#fee2e2', color:trend==='up'?'#047857':'#be123c', fontSize:'.78rem', fontWeight:800, display:'flex', alignItems:'center', gap:3 }}>
          {trend==='up' ? '↑' : '↓'}
        </span>
      )}
    </div>
    <p className="ps-text-muted" style={{ margin:'0 0 4px', fontSize:'.85rem', fontWeight:600 }}>{title}</p>
    <p className="ps-text-primary" style={{ margin:0, fontSize:'2rem', fontWeight:900, letterSpacing:'-1px', lineHeight:1 }}>{value}</p>
    {subtitle && (
      <div className="ps-text-muted" style={{ marginTop:16, paddingTop:12, borderTop:'1px solid var(--bs-border-color, #f1f5f9)', fontSize:'.82rem', fontWeight:500, display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ width:7, height:7, borderRadius:'50%', background:color, display:'inline-block', flexShrink:0 }} />
        {subtitle}
      </div>
    )}
  </div>
);

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
    <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f5f9', display:'flex', gap:12 }}>
      {[45,30,15].map((w,i) => <div key={i} className="skeleton" style={{ height:12, width:`${w}%` }} />)}
    </div>
    {Array.from({ length:rows }).map((_,i) => (
      <div key={i} style={{ padding:'18px 24px', borderBottom:i<rows-1?'1px solid #f8fafc':'none', display:'flex', gap:16, alignItems:'center' }}>
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
