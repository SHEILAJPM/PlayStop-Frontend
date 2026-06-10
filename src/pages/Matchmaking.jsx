import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function fmtDate(iso) {
  const d = new Date(iso + 'T12:00');
  return `${DAYS_ES[d.getDay()]} ${d.getDate()} ${MONTHS_ES[d.getMonth()]}`;
}

function MatchCard({ match, user, onJoin, onCancel }) {
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
        <div style={{ position: 'absolute', top: 10, right: 10, background: isFull ? 'rgba(239,68,68,0.9)' : 'rgba(0,208,132,0.9)', color: isFull ? '#fff' : '#0a1628', borderRadius: 20, padding: '4px 10px', fontSize: '0.72rem', fontWeight: 800 }}>
          {isFull ? 'Completo' : `${match.spotsLeft} lugar${match.spotsLeft !== 1 ? 'es' : ''} libre${match.spotsLeft !== 1 ? 's' : ''}`}
        </div>
        <div style={{ position: 'absolute', bottom: 10, left: 14 }}>
          <span style={{ background: 'rgba(0,208,132,0.2)', border: '1px solid rgba(0,208,132,0.4)', color: '#00d084', borderRadius: 12, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
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
            <div style={{ height: '100%', width: `${pct}%`, background: isFull ? '#ef4444' : pct >= 75 ? '#f59e0b' : '#00d084', borderRadius: 6, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {Array.from({ length: match.totalPlayers }).map((_, i) => (
              <div key={i} style={{ width: 26, height: 26, borderRadius: '50%', background: i < match.currentPlayers ? '#00d084' : '#1e293b', border: `2px solid ${i < match.currentPlayers ? '#00d084' : '#334155'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {i < match.currentPlayers && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            ))}
          </div>
        </div>

        {/* Price + organizer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <p style={{ margin: '0 0 2px', color: '#475569', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>Precio p/ jugador</p>
            <p style={{ margin: 0, color: '#00d084', fontWeight: 900, fontSize: '1.1rem' }}>S/ {parseFloat(match.pricePerPlayer).toFixed(0)}</p>
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
              style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg,#00d084,#00b875)', color: '#0a1628', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,208,132,0.3)' }}>
              Unirme al partido →
            </button>
          ) : (
            <div style={{ textAlign: 'center', color: '#475569', fontSize: '0.85rem', padding: '10px 0', fontWeight: 600 }}>Partido completo</div>
          )
        )}
        {!user && !isFull && (
          <Link to="/login" style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'linear-gradient(135deg,#00d084,#00b875)', color: '#0a1628', borderRadius: 10, fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none' }}>
            Iniciar sesión para unirme
          </Link>
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
            style={{ padding: '14px', background: 'linear-gradient(135deg,#00d084,#00b875)', color: '#0a1628', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '0.95rem', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 6px 16px rgba(0,208,132,0.3)', opacity: submitting ? 0.7 : 1 }}>
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

  const sports = ['Todos', ...new Set(matches.map(m => m.sportType).filter(Boolean))];

  useEffect(() => {
    Promise.all([api.getOpenMatches(), api.getAllCourts()])
      .then(([m, c]) => { setMatches(Array.isArray(m) ? m : []); setCourts(Array.isArray(c) ? c : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = async (id) => {
    if (!user) { navigate('/login'); return; }
    try {
      const updated = await api.joinMatch(id);
      setMatches(prev => prev.map(m => m.id === id ? updated : m));
    } catch (err) { alert(err.message); }
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
        <Link to="/" style={{ color: '#00d084', fontWeight: 900, fontSize: '1.2rem', textDecoration: 'none' }}>PlayStop</Link>
        <span style={{ color: '#475569' }}>/</span>
        <span style={{ color: '#f1f5f9', fontWeight: 700 }}>Buscar Jugadores</span>
        <div style={{ flex: 1 }} />
        {user?.role === 'USER' && (
          <button onClick={() => setShowCreate(true)}
            style={{ background: 'linear-gradient(135deg,#00d084,#00b875)', color: '#0a1628', border: 'none', borderRadius: 10, padding: '9px 18px', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,208,132,0.3)' }}>
            + Publicar partido
          </button>
        )}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {/* Hero text */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', background: 'rgba(0,208,132,0.1)', border: '1px solid rgba(0,208,132,0.25)', color: '#00d084', borderRadius: 20, padding: '5px 16px', fontSize: '0.8rem', fontWeight: 700, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Matchmaking
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>
            Únete a un <span style={{ color: '#00d084' }}>partido</span>
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '1rem', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
            Jugadores buscando completar su equipo. Únete y divide el costo de la cancha.
          </p>
        </div>

        {/* Sport filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          {sports.map(s => (
            <button key={s} onClick={() => setSportFilter(s)}
              style={{ padding: '7px 16px', borderRadius: 20, border: sportFilter === s ? '1px solid #00d084' : '1px solid #1e293b', background: sportFilter === s ? 'rgba(0,208,132,0.15)' : '#0a1628', color: sportFilter === s ? '#00d084' : '#64748b', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #1e293b', borderTop: '3px solid #00d084', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
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
                style={{ background: 'linear-gradient(135deg,#00d084,#00b875)', color: '#0a1628', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 800, cursor: 'pointer' }}>
                Publicar partido
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {filtered.map(m => (
              <MatchCard key={m.id} match={m} user={user} onJoin={handleJoin} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>

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
