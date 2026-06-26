import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../../services/api.js';

const MAX_CHARS = 300;
const POLL_INTERVAL = 5000;

const DAYS_ES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function fmtTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${DAYS_ES[d.getDay()]} ${d.getDate()} ${MONTHS_ES[d.getMonth()]} ${fmtTime(iso)}`;
}

const CSS = `
  @keyframes mcSlideUp { from { opacity:0; transform:translateY(18px) scale(0.97); } to { opacity:1; transform:none; } }
  @keyframes mcMsgIn   { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:none; } }
  @keyframes mcMsgOut  { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:none; } }
  @keyframes mcDot     { 0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)} }
`;

export default function MatchChat({ match, currentUser, onClose, darkMode = true }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(true);
  const [sending, setSending]   = useState(false);
  const [error, setError]       = useState('');
  const [unavailable, setUnavailable] = useState(false);

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const pollRef    = useRef(null);
  const lastCount  = useRef(0);

  const C = {
    bg:     darkMode ? '#0f172a' : '#fff',
    header: darkMode ? '#1e293b' : '#f8fafc',
    border: darkMode ? '#1e293b' : '#e2e8f0',
    text:   darkMode ? '#f8fafc' : '#0f172a',
    muted:  darkMode ? '#64748b' : '#94a3b8',
    input:  darkMode ? '#020617' : '#f1f5f9',
    their:  darkMode ? '#1e293b' : '#f1f5f9',
    theirTxt: darkMode ? '#f8fafc' : '#0f172a',
  };

  const scrollBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
  }, []);

  const fetchMessages = useCallback(async (silent = false) => {
    if (!match?.id) return;
    try {
      const data = await api.getMatchChatMessages(match.id);
      const list = Array.isArray(data) ? data : [];
      setMessages(list);
      if (list.length > lastCount.current) {
        lastCount.current = list.length;
        scrollBottom();
      }
      if (!silent) setLoading(false);
    } catch (err) {
      if (!silent) {
        if (err?.status === 404 || err?.status === 501 || String(err).includes('404')) {
          setUnavailable(true);
        }
        setLoading(false);
      }
    }
  }, [match?.id, scrollBottom]);

  useEffect(() => {
    fetchMessages(false);
    pollRef.current = setInterval(() => fetchMessages(true), POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [fetchMessages]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending || unavailable) return;
    setSending(true); setError('');
    const optimistic = {
      id: `opt-${Date.now()}`,
      senderId: currentUser?.id,
      senderName: currentUser?.name || 'Tú',
      content,
      sentAt: new Date().toISOString(),
      optimistic: true,
    };
    setMessages(prev => [...prev, optimistic]);
    setInput('');
    scrollBottom();
    try {
      await api.sendMatchChatMessage(match.id, content);
      await fetchMessages(true);
    } catch {
      setError('No se pudo enviar el mensaje. Intenta de nuevo.');
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isMe = (msg) => String(msg.senderId) === String(currentUser?.id);

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', padding:16, backdropFilter:'blur(4px)' }}>
      <style>{CSS}</style>

      <div style={{ background:C.bg, borderRadius:22, width:'100%', maxWidth:460, height:'82vh', maxHeight:660, display:'flex', flexDirection:'column', boxShadow:'0 30px 70px rgba(0,0,0,0.5)', overflow:'hidden', border:`1px solid ${C.border}`, animation:'mcSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>

        {/* Header */}
        <div style={{ background:C.header, borderBottom:`1px solid ${C.border}`, padding:'14px 18px', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg,#00d084,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>
            ⚽
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:800, color:C.text, fontSize:'0.95rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              Chat del partido · {match?.sportType || 'Fútbol'}
            </div>
            <div style={{ fontSize:'0.72rem', color:C.muted }}>
              {match?.courtName} · {match?.currentPlayers}/{match?.totalPlayers} jugadores
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:'1.1rem', padding:5, lineHeight:1 }}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Banner */}
        <div style={{ background: darkMode ? 'rgba(0,208,132,0.06)' : '#f0fdf4', borderBottom:`1px solid ${C.border}`, padding:'5px 18px', display:'flex', alignItems:'center', gap:6 }}>
          <i className="bi bi-chat-dots-fill" style={{ color:'#00d084', fontSize:'0.75rem' }} />
          <span style={{ fontSize:'0.7rem', color: darkMode ? '#6ee7b7' : '#059669' }}>
            Chat del equipo · visible para todos los participantes del partido
          </span>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:10 }}>
          {loading && (
            <div style={{ textAlign:'center', color:C.muted, paddingTop:40 }}>
              <div style={{ display:'flex', justifyContent:'center', gap:5, marginBottom:8 }}>
                {[0,160,320].map(d => (
                  <span key={d} style={{ width:8, height:8, borderRadius:'50%', background:'#00d084', display:'inline-block', animation:`mcDot 1s ease ${d}ms infinite` }} />
                ))}
              </div>
              <span style={{ fontSize:'0.82rem' }}>Cargando mensajes...</span>
            </div>
          )}

          {!loading && unavailable && (
            <div style={{ textAlign:'center', padding:'40px 20px', color:C.muted }}>
              <div style={{ fontSize:'2.5rem', marginBottom:12 }}>🚧</div>
              <div style={{ fontWeight:700, color:C.text, fontSize:'0.95rem', marginBottom:6 }}>Chat en construcción</div>
              <div style={{ fontSize:'0.82rem', lineHeight:1.5 }}>El chat de partidos estará disponible próximamente. Por ahora usa WhatsApp para coordinar.</div>
            </div>
          )}

          {!loading && !unavailable && messages.length === 0 && (
            <div style={{ textAlign:'center', padding:'40px 20px', color:C.muted }}>
              <div style={{ fontSize:'2.5rem', marginBottom:12 }}>💬</div>
              <div style={{ fontWeight:700, color:C.text, fontSize:'0.95rem', marginBottom:6 }}>¡Inicia la conversación!</div>
              <div style={{ fontSize:'0.82rem', lineHeight:1.5 }}>Coordina el partido con tus compañeros de equipo.</div>
            </div>
          )}

          {messages.map(msg => {
            const mine = isMe(msg);
            return (
              <div key={msg.id} style={{ display:'flex', flexDirection: mine ? 'row-reverse' : 'row', alignItems:'flex-end', gap:8, animation: mine ? 'mcMsgIn 0.22s ease' : 'mcMsgOut 0.22s ease' }}>
                {!mine && (
                  <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', color:'#fff', fontWeight:800, flexShrink:0 }}>
                    {msg.senderName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ maxWidth:'72%', display:'flex', flexDirection:'column', alignItems: mine ? 'flex-end' : 'flex-start' }}>
                  {!mine && <span style={{ fontSize:'0.68rem', color:C.muted, marginBottom:3, fontWeight:700 }}>{msg.senderName}</span>}
                  <div style={{ padding:'9px 13px', borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: mine ? 'linear-gradient(135deg,#00d084,#00b875)' : C.their, color: mine ? '#0f172a' : C.theirTxt, fontSize:'0.87rem', lineHeight:1.45, wordBreak:'break-word', opacity: msg.optimistic ? 0.7 : 1, boxShadow: mine ? '0 3px 10px rgba(0,208,132,0.25)' : 'none' }}>
                    {msg.content}
                  </div>
                  <span style={{ fontSize:'0.62rem', color:C.muted, marginTop:3 }}>{fmtTime(msg.sentAt)}</span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding:'6px 16px', background: darkMode ? 'rgba(239,68,68,0.1)' : '#fee2e2', fontSize:'0.76rem', color: darkMode ? '#fca5a5' : '#b91c1c', fontWeight:600 }}>
            {error}
          </div>
        )}

        {/* Input */}
        {!unavailable && (
          <div style={{ padding:'10px 12px', borderTop:`1px solid ${C.border}`, display:'flex', alignItems:'flex-end', gap:8 }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={handleKey}
              rows={1}
              placeholder="Escribe un mensaje... (Enter para enviar)"
              style={{ flex:1, resize:'none', padding:'9px 12px', borderRadius:12, border:`1.5px solid ${C.border}`, background:C.input, color:C.text, fontSize:'0.87rem', outline:'none', lineHeight:1.4, maxHeight:80, overflowY:'auto', fontFamily:'inherit', boxSizing:'border-box' }}
              onFocus={e => { e.target.style.borderColor = '#00d084'; }}
              onBlur={e => { e.target.style.borderColor = C.border; }}
            />
            <button onClick={handleSend} disabled={!input.trim() || sending}
              style={{ width:40, height:40, borderRadius:'50%', border:'none', background: input.trim() && !sending ? 'linear-gradient(135deg,#00d084,#00b875)' : (darkMode ? '#1e293b' : '#e2e8f0'), color: input.trim() && !sending ? '#0f172a' : C.muted, cursor: input.trim() && !sending ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0, boxShadow: input.trim() ? '0 4px 12px rgba(0,208,132,0.3)' : 'none', transition:'all 0.18s' }}>
              <i className="bi bi-send-fill" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}