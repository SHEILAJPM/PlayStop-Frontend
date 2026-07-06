import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import MatchChat from '../components/chat/MatchChat.jsx';

function JoinSuccessToast({ match, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#0f172a', border: '1px solid #2563eb', borderRadius: 16, padding: '16px 20px', boxShadow: '0 8px 32px rgba(37, 99, 235, 0.25)', maxWidth: 340, animation: 'slideUp 0.3s ease' }}>
      <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
      <p style={{ margin: '0 0 4px', color: '#2563eb', fontWeight: 800, fontSize: '0.95rem' }}>✓ ¡Te uniste al partido!</p>
      <p style={{ margin: '0 0 12px', color: '#94a3b8', fontSize: '0.82rem' }}>{match?.courtName} · {match?.date}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to="/dashboard" style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb', borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
          Ver mis reservas →
        </Link>
        <button onClick={onClose} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid #1e293b', borderRadius: 8, color: '#475569', cursor: 'pointer', fontSize: '0.82rem' }}>✕</button>
      </div>
    </div>
  );
}

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function fmtDate(iso) {
  const d = new Date(iso + 'T12:00');
  return `${DAYS_ES[d.getDay()]} ${d.getDate()} ${MONTHS_ES[d.getMonth()]}`;
}

function SplitPaymentModal({ match, onConfirm, onClose, loading }) {
  const [method, setMethod] = useState('yape');
  const price = parseFloat(match.pricePerPlayer).toFixed(2);

  const METHODS = [
    { id: 'yape',   label: 'Yape',    icon: '📱', color: '#7c3aed' },
    { id: 'plin',   label: 'Plin',    icon: '💙', color: '#3b82f6' },
    { id: 'card',   label: 'Tarjeta', icon: '💳', color: '#0f172a' },
    { id: 'cash',   label: 'Efectivo al llegar', icon: '💵', color: '#2563eb' },
  ];

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9100, padding:20 }}>
      <div style={{ background:'#0a1628', border:'1px solid #1e293b', borderRadius:22, padding:28, width:'100%', maxWidth:420, animation:'slideUp 0.3s ease' }}>
        <style>{`@keyframes slideUp{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}`}</style>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <h2 style={{ margin:0, color:'#f1f5f9', fontWeight:900, fontSize:'1.2rem' }}>Pagar mi parte</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'1.2rem' }}>✕</button>
        </div>

        {/* Match summary */}
        <div style={{ background:'rgba(37, 99, 235, 0.06)', border:'1px solid rgba(37, 99, 235, 0.18)', borderRadius:14, padding:'14px 16px', marginBottom:22 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ color:'#64748b', fontSize:'0.82rem' }}>Partido</span>
            <span style={{ color:'#f1f5f9', fontWeight:700, fontSize:'0.82rem' }}>{match.sportType} · {match.courtName}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ color:'#64748b', fontSize:'0.82rem' }}>Jugadores</span>
            <span style={{ color:'#f1f5f9', fontWeight:700, fontSize:'0.82rem' }}>{match.currentPlayers + 1}/{match.totalPlayers}</span>
          </div>
          <div style={{ borderTop:'1px solid rgba(37, 99, 235, 0.15)', paddingTop:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ color:'#94a3b8', fontWeight:700, fontSize:'0.88rem' }}>Tu parte</span>
            <span style={{ color:'#2563eb', fontWeight:900, fontSize:'1.5rem' }}>S/ {price}</span>
          </div>
        </div>

        {/* Payment method */}
        <p style={{ margin:'0 0 10px', color:'#94a3b8', fontSize:'0.78rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>Método de pago</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:22 }}>
          {METHODS.map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              style={{ padding:'11px 10px', background: method === m.id ? `${m.color}18` : '#030712', border:`1.5px solid ${method === m.id ? m.color : '#1e293b'}`, borderRadius:12, color: method === m.id ? '#f1f5f9' : '#64748b', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', display:'flex', alignItems:'center', gap:7, transition:'all 0.15s' }}>
              <span>{m.icon}</span>{m.label}
            </button>
          ))}
        </div>

        {method === 'cash' && (
          <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:10, padding:'10px 14px', marginBottom:18, fontSize:'0.8rem', color:'#fde68a' }}>
            💡 El organizador confirmará tu pago al llegar a la cancha. Lleva el monto exacto.
          </div>
        )}

        <button onClick={() => onConfirm(method)} disabled={loading}
          style={{ width:'100%', padding:14, background: loading ? '#1e293b' : 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: loading ? '#475569' : '#0a1628', border:'none', borderRadius:12, fontWeight:800, fontSize:'0.95rem', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 6px 16px rgba(37, 99, 235, 0.3)' }}>
          {loading ? 'Procesando...' : `Confirmar y unirme · S/ ${price}`}
        </button>
      </div>
    </div>
  );
}

function ShareButtons({ match }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/matchmaking`;
  const text = `⚽ ¡Únete a un partido de ${match.sportType} en ${match.courtName}!\n📅 ${fmtDate(match.date)} · ${String(match.slotHour).padStart(2,'0')}:00\n💰 S/ ${parseFloat(match.pricePerPlayer).toFixed(0)} por jugador\n👇 Reserva en PlayStop`;

  const handleWA = () => window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = `${text}\n${url}`;
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleNative = () => {
    navigator.share({ title: `Partido de ${match.sportType} — PlayStop`, text, url }).catch(() => {});
  };

  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
      <button onClick={handleWA}
        title="Compartir por WhatsApp"
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: 9, color: '#25d366', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.998 2C6.48 2 2 6.48 2 12c0 1.852.504 3.585 1.38 5.073L2 22l4.978-1.372A9.956 9.956 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 11.998 2zm.002 18a7.96 7.96 0 0 1-4.042-1.1l-.29-.173-2.955.815.825-3.022-.189-.31A7.972 7.972 0 0 1 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/></svg>
        WhatsApp
      </button>
      <button onClick={handleCopy}
        title="Copiar enlace"
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px', background: copied ? 'rgba(37, 99, 235, 0.12)' : 'rgba(100,116,139,0.1)', border: `1px solid ${copied ? 'rgba(37, 99, 235, 0.3)' : '#1e293b'}`, borderRadius: 9, color: copied ? '#2563eb' : '#64748b', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}>
        {copied
          ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> ¡Copiado!</>
          : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copiar</>
        }
      </button>
      {'share' in navigator && (
        <button onClick={handleNative}
          title="Más opciones"
          style={{ padding: '8px 10px', background: 'rgba(100,116,139,0.1)', border: '1px solid #1e293b', borderRadius: 9, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </button>
      )}
    </div>
  );
}

function MatchCard({ match, user, onJoin, onCancel, onChatOpen }) {
  const pct = (match.currentPlayers / match.totalPlayers) * 100;
  const isOrganizer = user?.id && match.organizerName === user?.name;
  const isFull = !match.open;

  return (
    <div style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 18, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)'; }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

      {/* Court image strip */}
      <div style={{ height: 110, backgroundImage: `url(${match.courtImageUrl || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&q=60'})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(10,22,40,1) 0%,transparent 60%)' }} />
        <div style={{ position: 'absolute', top: 10, right: 10, background: isFull ? 'rgba(239,68,68,0.9)' : 'rgba(37, 99, 235, 0.9)', color: isFull ? '#fff' : '#0a1628', borderRadius: 20, padding: '4px 10px', fontSize: '0.72rem', fontWeight: 800 }}>
          {isFull ? 'Completo' : `${match.spotsLeft} lugar${match.spotsLeft !== 1 ? 'es' : ''} libre${match.spotsLeft !== 1 ? 's' : ''}`}
        </div>
        <div style={{ position: 'absolute', bottom: 10, left: 14 }}>
          <span style={{ background: 'rgba(37, 99, 235, 0.2)', border: '1px solid rgba(37, 99, 235, 0.4)', color: '#2563eb', borderRadius: 12, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
            {match.sportType}
          </span>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 4px', color: '#f1f5f9', fontWeight: 800, fontSize: '1rem', lineHeight: 1.2 }}>{match.courtName}</h3>
        <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '0.8rem' }}>
          <i className="bi bi-geo-alt-fill" style={{ marginRight: 4 }} />{match.courtDistrict || 'Lima'}
        </p>

        {/* Date + time */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, background: '#030712', borderRadius: 10, padding: '10px 12px', border: '1px solid #1e293b' }}>
            <p style={{ margin: '0 0 2px', color: '#475569', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>Fecha</p>
            <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: '0.88rem' }}>{fmtDate(match.date)}</p>
          </div>
          <div style={{ flex: 1, background: '#030712', borderRadius: 10, padding: '10px 12px', border: '1px solid #1e293b' }}>
            <p style={{ margin: '0 0 2px', color: '#475569', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>Hora</p>
            <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: '0.88rem' }}>{String(match.slotHour).padStart(2,'0')}:00</p>
          </div>
        </div>

        {/* Players progress */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Jugadores</span>
            <span style={{ color: '#f1f5f9', fontSize: '0.75rem', fontWeight: 700 }}>{match.currentPlayers}/{match.totalPlayers}</span>
          </div>
          <div style={{ height: 6, background: '#1e293b', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: isFull ? '#ef4444' : pct >= 75 ? '#f59e0b' : '#2563eb', borderRadius: 6, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {Array.from({ length: match.totalPlayers }).map((_, i) => (
              <div key={i} style={{ width: 26, height: 26, borderRadius: '50%', background: i < match.currentPlayers ? '#2563eb' : '#1e293b', border: `2px solid ${i < match.currentPlayers ? '#2563eb' : '#334155'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {i < match.currentPlayers && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            ))}
          </div>
        </div>

        {/* Price + organizer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <p style={{ margin: '0 0 2px', color: '#475569', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>Precio p/ jugador</p>
            <p style={{ margin: 0, color: '#2563eb', fontWeight: 900, fontSize: '1.1rem' }}>S/ {parseFloat(match.pricePerPlayer).toFixed(0)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 2px', color: '#475569', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>Organizador</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <img src={match.organizerAvatar} alt={match.organizerName}
                style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>{match.organizerName}</span>
            </div>
          </div>
        </div>

        {match.description && (
          <p style={{ margin: '0 0 14px', color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5, borderTop: '1px solid #1e293b', paddingTop: 10 }}>
            {match.description}
          </p>
        )}

        {/* Actions */}
        {user && (
          isOrganizer ? (
            <button onClick={() => onCancel(match.id)}
              style={{ width: '100%', padding: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
              Cancelar partido
            </button>
          ) : !isFull ? (
            <button onClick={() => onJoin(match.id)}
              style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
              Unirme al partido →
            </button>
          ) : (
            <div style={{ textAlign: 'center', color: '#475569', fontSize: '0.85rem', padding: '10px 0', fontWeight: 600 }}>Partido completo</div>
          )
        )}
        {!user && !isFull && (
          <Link to="/login" style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', borderRadius: 10, fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none' }}>
            Iniciar sesión para unirme
          </Link>
        )}

        {!isFull && <ShareButtons match={match} />}

        {user && (
          <button onClick={() => onChatOpen(match)}
            style={{ marginTop:8, width:'100%', padding:'8px', background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:10, color:'#60a5fa', fontWeight:700, fontSize:'0.8rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
            <i className="bi bi-chat-dots-fill" />
            Chat del partido
          </button>
        )}
      </div>
    </div>
  );
}

function CreateMatchModal({ courts, onClose, onCreate }) {
  const [courtId, setCourtId] = useState('');
  const [date, setDate] = useState('');
  const [slotHour, setSlotHour] = useState(10);
  const [totalPlayers, setTotalPlayers] = useState(10);
  const [pricePerPlayer, setPricePerPlayer] = useState(15);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courtId || !date) { setError('Completa todos los campos'); return; }
    setSubmitting(true); setError('');
    try {
      const match = await api.createMatch({ courtId, date, slotHour, totalPlayers, pricePerPlayer, description });
      onCreate(match);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al crear el partido');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: '20px' }}>
      <div style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 20, padding: '28px', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: '#f1f5f9', fontWeight: 900, fontSize: '1.2rem' }}>Publicar partido</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.3rem' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Cancha</label>
            <select value={courtId} onChange={e => setCourtId(e.target.value)}
              style={{ width: '100%', background: '#030712', border: '1px solid #1e293b', borderRadius: 10, color: '#f1f5f9', padding: '10px 12px', fontSize: '0.9rem', outline: 'none' }}>
              <option value="">Selecciona una cancha...</option>
              {courts.map(c => <option key={c.id} value={c.id}>{c.name} — {c.district}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Fecha</label>
              <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)}
                style={{ width: '100%', background: '#030712', border: '1px solid #1e293b', borderRadius: 10, color: '#f1f5f9', padding: '10px 12px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Hora</label>
              <select value={slotHour} onChange={e => setSlotHour(+e.target.value)}
                style={{ width: '100%', background: '#030712', border: '1px solid #1e293b', borderRadius: 10, color: '#f1f5f9', padding: '10px 12px', fontSize: '0.9rem', outline: 'none' }}>
                {Array.from({ length: 18 }, (_, i) => i + 6).map(h => (
                  <option key={h} value={h}>{String(h).padStart(2,'0')}:00</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Total jugadores</label>
              <input type="number" value={totalPlayers} min={2} max={22} onChange={e => setTotalPlayers(+e.target.value)}
                style={{ width: '100%', background: '#030712', border: '1px solid #1e293b', borderRadius: 10, color: '#f1f5f9', padding: '10px 12px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Precio c/u (S/)</label>
              <input type="number" value={pricePerPlayer} min={1} step={1} onChange={e => setPricePerPlayer(+e.target.value)}
                style={{ width: '100%', background: '#030712', border: '1px solid #1e293b', borderRadius: 10, color: '#f1f5f9', padding: '10px 12px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>Descripción (opcional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} maxLength={300}
              placeholder="Ej: Partido amistoso, todos los niveles bienvenidos..."
              style={{ width: '100%', background: '#030712', border: '1px solid #1e293b', borderRadius: 10, color: '#f1f5f9', padding: '10px 12px', fontSize: '0.9rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: 0 }}>{error}</p>}

          <button type="submit" disabled={submitting}
            style={{ padding: '14px', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '0.95rem', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Publicando...' : 'Publicar partido ⚽'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Matchmaking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [sportFilter, setSportFilter] = useState('Todos');
  const [joinedMatch, setJoinedMatch] = useState(null);
  const [splitModal, setSplitModal] = useState(null); // match object awaiting payment
  const [splitLoading, setSplitLoading] = useState(false);
  const [chatMatch, setChatMatch] = useState(null); // match object for chat

  const sports = ['Todos', ...new Set(matches.map(m => m.sportType).filter(Boolean))];

  useEffect(() => {
    Promise.all([api.getOpenMatches(), api.getAllCourts()])
      .then(([m, c]) => { setMatches(Array.isArray(m) ? m : []); setCourts(Array.isArray(c) ? c : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = (id) => {
    if (!user) { navigate('/login'); return; }
    const match = matches.find(m => m.id === id);
    if (match) setSplitModal(match);
  };

  const handleSplitConfirm = async (_method) => {
    if (!splitModal) return;
    setSplitLoading(true);
    try {
      const updated = await api.joinMatch(splitModal.id);
      setMatches(prev => prev.map(m => m.id === splitModal.id ? updated : m));
      setJoinedMatch(updated);
      setSplitModal(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSplitLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('¿Cancelar este partido?')) return;
    try {
      await api.cancelMatch(id);
      setMatches(prev => prev.filter(m => m.id !== id));
    } catch (err) { alert(err.message); }
  };

  const filtered = sportFilter === 'Todos' ? matches : matches.filter(m => m.sportType?.includes(sportFilter));

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#f1f5f9' }}>
      {/* Header */}
      <div style={{ background: '#0a1628', borderBottom: '1px solid #1e293b', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to="/" style={{ color: '#2563eb', fontWeight: 900, fontSize: '1.2rem', textDecoration: 'none' }}>PlayStop</Link>
        <span style={{ color: '#475569' }}>/</span>
        <span style={{ color: '#f1f5f9', fontWeight: 700 }}>Buscar Jugadores</span>
        <div style={{ flex: 1 }} />
        {user?.role === 'USER' && (
          <button onClick={() => setShowCreate(true)}
            style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', border: 'none', borderRadius: 10, padding: '9px 18px', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
            + Publicar partido
          </button>
        )}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {/* Hero text */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.25)', color: '#2563eb', borderRadius: 20, padding: '5px 16px', fontSize: '0.8rem', fontWeight: 700, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Matchmaking
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>
            Únete a un <span style={{ color: '#2563eb' }}>partido</span>
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '1rem', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
            Jugadores buscando completar su equipo. Únete y divide el costo de la cancha.
          </p>
        </div>

        {/* Sport filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          {sports.map(s => (
            <button key={s} onClick={() => setSportFilter(s)}
              style={{ padding: '7px 16px', borderRadius: 20, border: sportFilter === s ? '1px solid #2563eb' : '1px solid #1e293b', background: sportFilter === s ? 'rgba(37, 99, 235, 0.15)' : '#0a1628', color: sportFilter === s ? '#2563eb' : '#64748b', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #1e293b', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color: '#64748b' }}>Cargando partidos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#0a1628', borderRadius: 20, border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚽</div>
            <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 8px' }}>No hay partidos disponibles</p>
            <p style={{ color: '#64748b', margin: '0 0 24px' }}>Sé el primero en publicar un partido para este deporte</p>
            {user?.role === 'USER' && (
              <button onClick={() => setShowCreate(true)}
                style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 800, cursor: 'pointer' }}>
                Publicar partido
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {filtered.map(m => (
              <MatchCard key={m.id} match={m} user={user} onJoin={handleJoin} onCancel={handleCancel} onChatOpen={setChatMatch} />
            ))}
          </div>
        )}
      </div>

      {joinedMatch && <JoinSuccessToast match={joinedMatch} onClose={() => setJoinedMatch(null)} />}

      {splitModal && (
        <SplitPaymentModal
          match={splitModal}
          loading={splitLoading}
          onConfirm={handleSplitConfirm}
          onClose={() => setSplitModal(null)}
        />
      )}

      {chatMatch && (
        <MatchChat
          match={chatMatch}
          currentUser={user}
          onClose={() => setChatMatch(null)}
          darkMode={true}
        />
      )}

      {showCreate && (
        <CreateMatchModal
          courts={courts}
          onClose={() => setShowCreate(false)}
          onCreate={match => setMatches(prev => [match, ...prev])}
        />
      )}
    </div>
  );
}
