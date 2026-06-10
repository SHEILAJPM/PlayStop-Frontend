import { useState, useEffect, useRef } from 'react';

const RESPONSES = [
  {
    keywords: ['hola', 'buenas', 'buenos', 'hey', 'hi', 'saludos', 'buen día', 'buenas tardes', 'buenas noches'],
    answer: '¡Hola! Soy el asistente de PlaySpot. Puedo ayudarte con reservas, precios, soporte técnico y más. ¿En qué te ayudo hoy?',
  },
  {
    keywords: ['gracias', 'thanks', 'perfecto', 'genial', 'excelente', 'ok', 'okey', 'entendido'],
    answer: '¡De nada! Si tienes más preguntas, aquí estaré. ¿Hay algo más en lo que pueda ayudarte?',
  },
  // --- Reservas ---
  {
    keywords: ['cómo reservo', 'como reservo', 'cómo reservar', 'como reservar', 'hacer una reserva', 'hacer reserva', 'quiero reservar', 'reservar cancha'],
    answer: 'Para reservar una cancha:\n1. Inicia sesión en tu cuenta\n2. Ve a "Buscar Canchas" en tu dashboard\n3. Elige la cancha que te guste\n4. Selecciona fecha y horario disponible\n5. Confirma el pago\n\n¡Listo! Recibirás un código QR en tu correo para presentar al llegar.',
  },
  {
    keywords: ['reserva', 'reservas', 'mis reservas', 'ver reservas', 'historial'],
    answer: 'Puedes ver todas tus reservas en la sección "Mis Reservas" de tu dashboard. Ahí encontrarás el estado (Confirmada, Pendiente, Cancelada) y el código QR de cada una.',
  },
  {
    keywords: ['cancelar', 'cancelación', 'cancelacion', 'anular'],
    answer: 'Puedes cancelar una reserva desde "Mis Reservas" en tu dashboard. La cancelación es gratuita si la haces con más de 12 horas de anticipación. Si el complejo cancela por fuerza mayor, recibes reembolso automático del 100%.',
  },
  {
    keywords: ['qr', 'código qr', 'codigo qr', 'código de entrada', 'acceso'],
    answer: 'Tu código QR se genera automáticamente al confirmar la reserva. Lo encuentras en "Mis Reservas" pulsando el botón "Ver QR". También te lo enviamos por correo. Preséntalo al propietario al llegar.',
  },
  {
    keywords: ['reprogramar', 'cambiar fecha', 'cambiar horario', 'mover reserva'],
    answer: 'Por ahora puedes cancelar tu reserva actual y hacer una nueva con la fecha/horario que prefieras. Recuerda que la cancelación es sin costo hasta 12 horas antes del partido.',
  },
  {
    keywords: ['pago dividido', 'dividir pago', 'split', 'entre amigos', 'entre varios'],
    answer: '¡El pago dividido es muy fácil! Al reservar, pagas solo tu parte. PlaySpot genera un enlace único que compartes con tus amigos por WhatsApp. Ellos tienen hasta 2 horas antes del partido para pagar su parte. ¡Adiós deudas!',
  },
  // --- Precios y planes ---
  {
    keywords: ['precio', 'precios', 'costo', 'costos', 'cuánto cuesta', 'cuanto cuesta', 'cobran', 'tarifa'],
    answer: 'Para jugadores: descargar y buscar canchas es **100% gratis**. Solo pagas el alquiler de la cancha al reservar.\n\nPara clubes y propietarios:\n• **Plan Básico**: sin costo fijo, solo comisión por reserva exitosa\n• **Plan PRO**: cuota fija mensual con funciones avanzadas\n\n¿Te interesa algún plan en particular?',
  },
  {
    keywords: ['plan', 'planes', 'suscripción', 'suscripcion', 'mensual', 'comisión', 'comision'],
    answer: 'PlaySpot tiene dos planes para propietarios:\n\n• **Básico**: 0 costo de afiliación + comisión por reserva exitosa\n• **PRO**: cuota mensual fija con analíticas avanzadas, gestión de calendario y soporte prioritario\n\nPara jugadores, la app es siempre gratuita.',
  },
  {
    keywords: ['gratis', 'gratuito', 'free', 'sin costo', 'cobro'],
    answer: '¡Sí! Para los jugadores, usar PlaySpot para buscar canchas y reservar es completamente gratis. Solo pagas el alquiler de la cancha al momento de reservar.',
  },
  {
    keywords: ['ingresos', 'cobro propietario', 'recibir dinero', 'depósito', 'deposito', 'pago a propietario'],
    answer: 'Los propietarios reciben sus ingresos en un plazo de 24 a 48 horas hábiles después de cada transacción, directo a su cuenta bancaria. Pueden ver el detalle y descargar comprobantes desde su panel financiero.',
  },
  // --- Canchas ---
  {
    keywords: ['cancha', 'canchas', 'buscar cancha', 'encontrar cancha', 'disponible', 'disponibles'],
    answer: 'Para encontrar la cancha ideal:\n• Usa los filtros de **deporte**, **ciudad** y **distrito**\n• Ajusta el **rango de precio** por hora\n• Ve las fotos y ubicación antes de reservar\n\nTenemos canchas de fútbol, pádel, tenis, vóley y básquet.',
  },
  {
    keywords: ['fútbol', 'futbol', 'pádel', 'padel', 'tenis', 'vóley', 'voley', 'básquet', 'basquet', 'deporte', 'deportes'],
    answer: 'PlaySpot tiene canchas de:\n• **Fútbol** (grass, sintético)\n• **Pádel**\n• **Tenis**\n• **Vóley**\n• **Básquet**\n\nFiltra por deporte en la sección "Buscar Canchas" de tu dashboard.',
  },
  {
    keywords: ['favoritos', 'favorita', 'guardar cancha'],
    answer: 'Puedes guardar canchas favoritas tocando el corazón en cada tarjeta de cancha. Las encontrarás todas reunidas en la sección "Canchas Favoritas" de tu dashboard.',
  },
  // --- Soporte técnico ---
  {
    keywords: ['contraseña', 'contrasena', 'olvidé', 'olvide', 'no puedo entrar', 'recuperar cuenta', 'forgot'],
    answer: 'Para recuperar tu contraseña:\n1. Ve a la pantalla de inicio de sesión\n2. Haz clic en **"¿Olvidaste tu contraseña?"**\n3. Ingresa tu correo\n4. Recibirás un código de verificación\n5. Ingresa el código y crea una nueva contraseña\n\n¿Sigues teniendo problemas? Escríbenos a soporte@playspot.pe',
  },
  {
    keywords: ['login', 'iniciar sesión', 'iniciar sesion', 'ingresar', 'no me deja entrar', 'no puedo logear', 'error al entrar'],
    answer: 'Si tienes problemas para iniciar sesión:\n1. Verifica que tu correo y contraseña sean correctos\n2. Si olvidaste tu contraseña, usa "¿Olvidaste tu contraseña?"\n3. Asegúrate de tener conexión a internet\n\nSi el problema persiste, escríbenos a soporte@playspot.pe',
  },
  {
    keywords: ['registrar', 'registro', 'crear cuenta', 'nueva cuenta', 'sign up'],
    answer: 'Para crear tu cuenta en PlaySpot:\n1. Haz clic en **"Registrarse"** en la página principal\n2. Ingresa tu nombre, correo y contraseña\n3. Confirma tu correo con el código que te enviamos\n4. ¡Listo! Ya puedes buscar y reservar canchas\n\n¡Es completamente gratis!',
  },
  {
    keywords: ['error', 'falla', 'no funciona', 'problema', 'bug', 'no carga'],
    answer: 'Lamentamos los inconvenientes. Para reportar un problema:\n• Intenta recargar la página\n• Limpia el caché de tu navegador\n• Si el problema persiste, escríbenos a **soporte@playspot.pe** con una captura de pantalla del error.\n\n¡Lo resolveremos a la brevedad!',
  },
  {
    keywords: ['soporte', 'ayuda', 'contacto', 'contactar', 'atención', 'atencion', 'servicio al cliente'],
    answer: 'Puedes contactar a nuestro equipo de soporte:\n• **Email**: soporte@playspot.pe\n• **WhatsApp**: +51 900 000 000\n• Horario: Lun–Vie 9am a 6pm (Lima, Perú)\n\nTambién puedes usar el formulario en la sección "Contacto" de nuestra web.',
  },
  // --- Club / Propietario ---
  {
    keywords: ['club', 'complejo', 'propietario', 'registrar cancha', 'publicar cancha', 'tengo canchas', 'dueño'],
    answer: '¿Eres propietario de un complejo deportivo? Con PlaySpot puedes:\n• Publicar tus canchas en minutos\n• Gestionar reservas y calendario\n• Recibir pagos automáticos\n• Ver analíticas de tus ingresos\n\nEscríbenos a **clubes@playspot.pe** o regístrate como propietario desde nuestra web.',
  },
  {
    keywords: ['PlaySpot', 'playspot', 'qué es', 'que es', 'cómo funciona', 'como funciona'],
    answer: '**PlaySpot** es la plataforma para reservar canchas deportivas en Perú. Conectamos jugadores con complejos deportivos para que reservar sea fácil, rápido y seguro.\n\n• Para **jugadores**: encuentra y reserva canchas en segundos\n• Para **clubes**: gestiona reservas y cobra automáticamente\n\n¿Quieres saber algo más específico?',
  },
];

const DEFAULT_RESPONSE = 'No estoy seguro de entenderte. Puedes preguntarme sobre:\n• **Reservas** (cómo reservar, cancelar, QR)\n• **Precios** (costos, planes, comisiones)\n• **Canchas** (buscar, filtrar, favoritos)\n• **Soporte** (login, contraseña, errores)\n\nO escríbenos directamente a soporte@playspot.pe';

const WELCOME = '¡Hola! Soy el asistente virtual de **PlaySpot**. Estoy aquí para ayudarte con reservas, precios, soporte y más.\n\n¿En qué puedo ayudarte hoy?';

function getResponse(input) {
  const text = input.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  for (const entry of RESPONSES) {
    const normalized = entry.keywords.map(k =>
      k.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    );
    if (normalized.some(k => text.includes(k))) return entry.answer;
  }
  return DEFAULT_RESPONSE;
}

function renderText(text) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    );
  });
}

const QUICK_OPTIONS = [
  { icon: 'bi-calendar-check', label: '¿Cómo reservo?',      text: '¿Cómo reservar una cancha?' },
  { icon: 'bi-cash-coin',      label: 'Precios',              text: '¿Cuánto cuesta?' },
  { icon: 'bi-x-circle',       label: 'Cancelar reserva',     text: '¿Cómo cancelo una reserva?' },
  { icon: 'bi-lock-fill',      label: 'Olvidé mi contraseña', text: 'Olvidé mi contraseña' },
];

export default function ChatBot({ darkMode = false }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: WELCOME, ts: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, open]);

  const sendMessage = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: msg, ts: Date.now() }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = getResponse(msg);
      setMessages(prev => [...prev, { from: 'bot', text: reply, ts: Date.now() }]);
      if (!open) setUnread(n => n + 1);
    }, 600 + Math.random() * 400);
  };

  const dk = darkMode;
  const bg = dk ? '#0f172a' : '#ffffff';
  const surface = dk ? '#1e293b' : '#f8fafc';
  const border = dk ? '#334155' : '#e2e8f0';
  const textPrimary = dk ? '#f8fafc' : '#0f172a';
  return (
    <>
      <style>{`
        .chatbot-widget { position: fixed; bottom: 24px; right: 24px; z-index: 9000; font-family: inherit; }
        .chatbot-btn { width: 58px; height: 58px; border-radius: 50%; background: linear-gradient(135deg, #00d084, #00b872); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 8px 25px rgba(0,208,132,0.4); transition: transform 0.2s, box-shadow 0.2s; }
        .chatbot-btn:hover { transform: scale(1.08); box-shadow: 0 12px 30px rgba(0,208,132,0.5); }
        .chatbot-panel { position: absolute; bottom: 70px; right: 0; width: 360px; max-height: 520px; border-radius: 20px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.25); animation: chatSlideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
        @keyframes chatSlideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        .chat-bubble { max-width: 85%; padding: 10px 14px; border-radius: 16px; font-size: 0.88rem; line-height: 1.55; word-break: break-word; }
        .chat-bubble.bot { align-self: flex-start; border-bottom-left-radius: 4px; }
        .chat-bubble.user { align-self: flex-end; border-bottom-right-radius: 4px; background: linear-gradient(135deg, #00d084, #00b872); color: #fff; }
        .typing-dot { width: 7px; height: 7px; border-radius: 50%; background: #64748b; animation: typingBounce 1.2s infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        .quick-chip { padding: 6px 12px; border-radius: 99px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.15s; white-space: nowrap; border: 1.5px solid #00d084; background: transparent; color: #00d084; }
        .quick-chip:hover { background: #00d084; color: #fff; }
        .chat-input-area { display: flex; gap: 8px; padding: 12px 14px; }
        .chat-input { flex: 1; padding: 10px 14px; border-radius: 12px; font-size: 0.9rem; outline: none; resize: none; font-family: inherit; transition: border-color 0.2s; }
        .chat-send-btn { width: 40px; height: 40px; border-radius: 12px; border: none; background: linear-gradient(135deg, #00d084, #00b872); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: opacity 0.15s; }
        .chat-send-btn:disabled { opacity: 0.4; cursor: default; }
        @media (max-width: 420px) { .chatbot-panel { width: calc(100vw - 32px); right: -8px; } }
      `}</style>

      <div className="chatbot-widget">
        {open && (
          <div className="chatbot-panel" style={{ background: bg, border: `1px solid ${border}` }}>
            {/* Header */}
            <div style={{ padding: '14px 18px', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,208,132,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#00d084' }}><i className="bi bi-robot" /></div>
                <div>
                  <div style={{ color: '#fff', fontWeight: '800', fontSize: '0.95rem', lineHeight: 1 }}>Asistente PlaySpot</div>
                  <div style={{ color: '#00d084', fontSize: '0.72rem', fontWeight: '700', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00d084', display: 'inline-block' }} />
                    En línea
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1, padding: '4px' }}>×</button>
            </div>

            {/* Messages */}
            <div className="chat-messages" style={{ background: surface }}>
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.from}`}
                  style={m.from === 'bot' ? { background: bg, border: `1px solid ${border}`, color: textPrimary } : {}}>
                  {renderText(m.text)}
                </div>
              ))}
              {typing && (
                <div className="chat-bubble bot" style={{ background: bg, border: `1px solid ${border}` }}>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '2px 0' }}>
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick options */}
            {messages.length <= 2 && !typing && (
              <div style={{ padding: '8px 14px 4px', background: surface, display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: `1px solid ${border}` }}>
                {QUICK_OPTIONS.map(opt => (
                  <button key={opt.label} className="quick-chip" onClick={() => sendMessage(opt.text)}>
                    <i className={`bi ${opt.icon}`} style={{ marginRight: 5 }} />{opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="chat-input-area" style={{ background: bg, borderTop: `1px solid ${border}` }}>
              <input
                ref={inputRef}
                className="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Escribe tu pregunta..."
                style={{ background: surface, border: `1.5px solid ${border}`, color: textPrimary }}
              />
              <button className="chat-send-btn" onClick={() => sendMessage()} disabled={!input.trim() || typing}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* FAB button */}
        <button className="chatbot-btn" onClick={() => setOpen(o => !o)} title="Abrir chat de soporte">
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          )}
          {!open && unread > 0 && (
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '20px', height: '20px', borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {unread}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
