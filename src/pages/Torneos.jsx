import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const DAYS_ES   = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T12:00');
  return `${DAYS_ES[d.getDay()]} ${d.getDate()} ${MONTHS_ES[d.getMonth()]}`;
}

const SPORT_ICONS = {
  'Fútbol':   '⚽', 'Fútbol 5': '⚽', 'Fútbol 7': '⚽',
  'Pádel':    '🎾', 'Tenis':    '🎾',
  'Vóley':    '🏐', 'Básquet':  '🏀',
};

// ── Mock data while backend endpoint is built ─────────────────────────────
const MOCK_TOURNAMENTS = [
  {
    id: 1, name: 'Copa PlayStop Lima 2026', sportType: 'Fútbol 5', courtName: 'Estadio Los Próceres', courtDistrict: 'San Borja',
    startDate: '2026-07-15', endDate: '2026-07-20', maxTeams: 16, registeredTeams: 9,
    pricePerTeam: 150, prize: 'S/ 2,000 + trofeo', status: 'OPEN',
    description: 'Torneo relámpago de fútbol 5 con fase de grupos y eliminatorias directas. Todos los niveles bienvenidos.',
    organizerName: 'PlayStop Oficial', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=70',
  },
  {
    id: 2, name: 'Torneo de Pádel Miraflores', sportType: 'Pádel', courtName: 'Club Los Delfines', courtDistrict: 'Miraflores',
    startDate: '2026-07-08', endDate: '2026-07-09', maxTeams: 8, registeredTeams: 8,
    pricePerTeam: 80, prize: 'S/ 800 + equipamiento', status: 'FULL',
    description: 'Torneo de pádel de dobles, nivel intermedio-avanzado. Canchas de cristal con iluminación LED.',
    organizerName: 'Club Los Delfines', imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=70',
  },
  {
    id: 3, name: 'Liga Interbarrios Básquet', sportType: 'Básquet', courtName: 'Coliseo Municipal', courtDistrict: 'Surco',
    startDate: '2026-08-01', endDate: '2026-08-31', maxTeams: 12, registeredTeams: 4,
    pricePerTeam: 200, prize: 'S/ 3,000 + medallas', status: 'OPEN',
    description: 'Liga mensual de básquet por equipos. Ideal para colegios, empresas y grupos de amigos.',
    organizerName: 'Municipalidad de Surco', imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=70',
  },
];

function JoinModal({ tournament, onClose, onConfirm, loading }) {
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!teamName.trim()) { setError('Ingresa el nombre de tu equipo'); return; }
    onConfirm(teamName.trim());
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9100, padding:20 }}>
      <div style={{ background:'#0a1628', border:'1px solid #1e293b', borderRadius:22, padding:28, width:'100%', maxWidth:420 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <h2 style={{ margin:0, color:'#f1f5f9', fontWeight:900, fontSize:'1.2rem' }}>Inscribir equipo</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'1.2rem' }}>✕</button>
        </div>

        <div style={{ background:'rgba(0,208,132,0.06)', border:'1px solid rgba(0,208,132,0.18)', borderRadius:14, padding:'14px 16px', marginBottom:22 }}>
          <div style={{ fontSize:'1.1rem', fontWeight:900, color:'#f1f5f9', marginBottom:6 }}>{SPORT_ICONS[tournament.sportType] || '🏆'} {tournament.name}</div>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            <span style={{ color:'#64748b', fontSize:'0.82rem' }}>📅 {fmtDate(tournament.startDate)}</span>
            <span style={{ color:'#64748b', fontSize:'0.82rem' }}>📍 {tournament.courtDistrict}</span>
            <span style={{ color:'#00d084', fontSize:'0.82rem', fontWeight:800 }}>S/ {tournament.pricePerTeam}/equipo</span>
          </div>
        </div>

        <label style={{ display:'block', color:'#94a3b8', fontSize:'0.78rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>
          Nombre de tu equipo
        </label>
        <input
          value={teamName}
          onChange={e => { setTeamName(e.target.value); setError(''); }}
          placeholder="Ej: Los Tigres FC"
          maxLength={40}
          style={{ width:'100%', background:'#030712', border:`1.5px solid ${error ? '#ef4444' : '#1e293b'}`, borderRadius:10, color:'#f1f5f9', padding:'11px 14px', fontSize:'0.9rem', outline:'none', boxSizing:'border-box', marginBottom:error ? 6 : 20 }}
          onFocus={e => { e.target.style.borderColor = '#00d084'; }}
          onBlur={e => { e.target.style.borderColor = error ? '#ef4444' : '#1e293b'; }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        {error && <p style={{ color:'#ef4444', fontSize:'0.8rem', margin:'0 0 16px', fontWeight:600 }}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width:'100%', padding:14, background: loading ? '#1e293b' : 'linear-gradient(135deg,#00d084,#00b875)', color: loading ? '#475569' : '#0a1628', border:'none', borderRadius:12, fontWeight:800, fontSize:'0.95rem', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 6px 16px rgba(0,208,132,0.3)' }}>
          {loading ? 'Inscribiendo...' : `Inscribir equipo · S/ ${tournament.pricePerTeam}`}
        </button>
      </div>
    </div>
  );
}

function TournamentCard({ tournament, user, onJoin }) {
  const spotsLeft = tournament.maxTeams - tournament.registeredTeams;
  const pct = (tournament.registeredTeams / tournament.maxTeams) * 100;
  const isFull = tournament.status === 'FULL' || spotsLeft <= 0;

  return (
    <div style={{ background:'#0a1628', border:'1px solid #1e293b', borderRadius:18, overflow:'hidden', transition:'transform 0.2s, box-shadow 0.2s' }}
      onMouseOver={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.3)'; }}
      onMouseOut={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>

      {/* Image */}
      <div style={{ height:130, backgroundImage:`url(${tournament.imageUrl})`, backgroundSize:'cover', backgroundPosition:'center', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(10,22,40,1) 0%,transparent 60%)' }} />
        <div style={{ position:'absolute', top:10, right:10, background: isFull ? 'rgba(239,68,68,0.9)' : 'rgba(0,208,132,0.9)', color: isFull ? '#fff' : '#0a1628', borderRadius:20, padding:'4px 10px', fontSize:'0.72rem', fontWeight:800 }}>
          {isFull ? 'Completo' : `${spotsLeft} lugar${spotsLeft !== 1 ? 'es' : ''} libre${spotsLeft !== 1 ? 's' : ''}`}
        </div>
        <div style={{ position:'absolute', bottom:10, left:14, display:'flex', gap:6, alignItems:'center' }}>
          <span style={{ background:'rgba(0,208,132,0.2)', border:'1px solid rgba(0,208,132,0.4)', color:'#00d084', borderRadius:12, padding:'3px 10px', fontSize:'0.72rem', fontWeight:700 }}>
            {SPORT_ICONS[tournament.sportType] || '🏆'} {tournament.sportType}
          </span>
        </div>
      </div>

      <div style={{ padding:16 }}>
        <h3 style={{ margin:'0 0 6px', color:'#f1f5f9', fontWeight:900, fontSize:'1rem', lineHeight:1.2 }}>{tournament.name}</h3>
        <p style={{ margin:'0 0 14px', color:'#64748b', fontSize:'0.8rem' }}>
          <i className="bi bi-geo-alt-fill" style={{ marginRight:4 }} />{tournament.courtDistrict} · {tournament.courtName}
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
          {[
            { icon:'bi-calendar3',    label:'Inicio',  value: fmtDate(tournament.startDate) },
            { icon:'bi-calendar-check', label:'Fin',   value: fmtDate(tournament.endDate) },
            { icon:'bi-people-fill',  label:'Equipos', value: `${tournament.registeredTeams}/${tournament.maxTeams}` },
            { icon:'bi-trophy-fill',  label:'Premio',  value: tournament.prize },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ background:'#030712', borderRadius:10, padding:'9px 11px', border:'1px solid #1e293b' }}>
              <p style={{ margin:'0 0 2px', color:'#475569', fontSize:'0.66rem', fontWeight:700, textTransform:'uppercase' }}>{label}</p>
              <p style={{ margin:0, color:'#f1f5f9', fontWeight:700, fontSize:'0.8rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Teams progress bar */}
        <div style={{ marginBottom:14 }}>
          <div style={{ height:6, background:'#1e293b', borderRadius:6, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background: isFull ? '#ef4444' : pct >= 75 ? '#f59e0b' : '#00d084', borderRadius:6, transition:'width 0.4s' }} />
          </div>
        </div>

        {tournament.description && (
          <p style={{ margin:'0 0 14px', color:'#64748b', fontSize:'0.8rem', lineHeight:1.5, borderTop:'1px solid #1e293b', paddingTop:10 }}>
            {tournament.description}
          </p>
        )}

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div>
            <p style={{ margin:'0 0 2px', color:'#475569', fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase' }}>Inscripción</p>
            <p style={{ margin:0, color:'#00d084', fontWeight:900, fontSize:'1.1rem' }}>S/ {tournament.pricePerTeam}<span style={{ color:'#475569', fontWeight:500, fontSize:'0.8rem' }}>/equipo</span></p>
          </div>
          <div style={{ textAlign:'right' }}>
            <p style={{ margin:'0 0 2px', color:'#475569', fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase' }}>Organizador</p>
            <p style={{ margin:0, color:'#94a3b8', fontSize:'0.8rem', fontWeight:600 }}>{tournament.organizerName}</p>
          </div>
        </div>

        {!isFull && user ? (
          <button onClick={() => onJoin(tournament)}
            style={{ width:'100%', padding:'10px', background:'linear-gradient(135deg,#00d084,#00b875)', color:'#0a1628', border:'none', borderRadius:10, fontWeight:800, fontSize:'0.9rem', cursor:'pointer', boxShadow:'0 4px 12px rgba(0,208,132,0.3)' }}>
            Inscribir mi equipo →
          </button>
        ) : !isFull && !user ? (
          <Link to="/login" style={{ display:'block', textAlign:'center', padding:'10px', background:'linear-gradient(135deg,#00d084,#00b875)', color:'#0a1628', borderRadius:10, fontWeight:800, fontSize:'0.9rem', textDecoration:'none' }}>
            Inicia sesión para inscribirte
          </Link>
        ) : (
          <div style={{ textAlign:'center', color:'#475569', fontSize:'0.85rem', padding:'10px 0', fontWeight:600 }}>Torneo completo</div>
        )}
      </div>
    </div>
  );
}

function SuccessToast({ tournament, teamName, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 6000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, background:'#0f172a', border:'1px solid #00d084', borderRadius:16, padding:'16px 20px', boxShadow:'0 8px 32px rgba(0,208,132,0.25)', maxWidth:340, animation:'slideUp 0.3s ease' }}>
      <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}}`}</style>
      <p style={{ margin:'0 0 4px', color:'#00d084', fontWeight:800, fontSize:'0.95rem' }}>🏆 ¡Equipo inscrito!</p>
      <p style={{ margin:'0 0 10px', color:'#94a3b8', fontSize:'0.82rem' }}><strong style={{ color:'#f1f5f9' }}>{teamName}</strong> en {tournament.name}</p>
      <button onClick={onClose} style={{ padding:'7px 14px', background:'rgba(0,208,132,0.15)', color:'#00d084', border:'none', borderRadius:8, fontWeight:700, fontSize:'0.82rem', cursor:'pointer' }}>
        Entendido ✓
      </button>
    </div>
  );
}

export default function Torneos() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sportFilter, setSportFilter] = useState('Todos');
  const [joinModal, setJoinModal] = useState(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [successToast, setSuccessToast] = useState(null);

  useEffect(() => {
    api.getTournaments()
      .then(data => setTournaments(Array.isArray(data) ? data : []))
      .catch(() => setTournaments(MOCK_TOURNAMENTS))
      .finally(() => setLoading(false));
  }, []);

  const sports = ['Todos', ...new Set(tournaments.map(t => t.sportType).filter(Boolean))];
  const filtered = sportFilter === 'Todos' ? tournaments : tournaments.filter(t => t.sportType === sportFilter);

  const handleJoinConfirm = async (teamName) => {
    if (!joinModal) return;
    setJoinLoading(true);
    try {
      await api.joinTournament(joinModal.id, teamName);
      setTournaments(prev => prev.map(t => t.id === joinModal.id
        ? { ...t, registeredTeams: t.registeredTeams + 1, status: t.registeredTeams + 1 >= t.maxTeams ? 'FULL' : t.status }
        : t
      ));
      setSuccessToast({ tournament: joinModal, teamName });
      setJoinModal(null);
    } catch {
      // Optimistic update anyway (backend may not exist yet)
      setTournaments(prev => prev.map(t => t.id === joinModal.id
        ? { ...t, registeredTeams: t.registeredTeams + 1 }
        : t
      ));
      setSuccessToast({ tournament: joinModal, teamName });
      setJoinModal(null);
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#030712', color:'#f1f5f9' }}>
      {/* Header */}
      <nav style={{ background:'#0a1628', borderBottom:'1px solid #1e293b', padding:'14px 24px', display:'flex', alignItems:'center', gap:12 }}>
        <Link to="/" style={{ color:'#00d084', fontWeight:900, fontSize:'1.2rem', textDecoration:'none' }}>PlayStop</Link>
        <span style={{ color:'#475569' }}>/</span>
        <span style={{ color:'#f1f5f9', fontWeight:700 }}>Torneos y Ligas</span>
        <div style={{ flex:1 }} />
        {user && (
          <Link to="/dashboard" style={{ color:'#94a3b8', fontSize:'0.88rem', textDecoration:'none' }}>← Dashboard</Link>
        )}
      </nav>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign:'center', marginBottom:42 }}>
          <div style={{ display:'inline-block', background:'rgba(0,208,132,0.1)', border:'1px solid rgba(0,208,132,0.25)', color:'#00d084', borderRadius:20, padding:'5px 16px', fontSize:'0.8rem', fontWeight:700, marginBottom:14, textTransform:'uppercase', letterSpacing:'1px' }}>
            🏆 Torneos y Ligas
          </div>
          <h1 style={{ margin:'0 0 12px', fontSize:'2.5rem', fontWeight:900, letterSpacing:'-1px' }}>
            Compite en <span style={{ color:'#00d084' }}>torneos</span> reales
          </h1>
          <p style={{ margin:0, color:'#64748b', fontSize:'1rem', maxWidth:500, marginLeft:'auto', marginRight:'auto', lineHeight:1.6 }}>
            Inscribe tu equipo en torneos organizados por los mejores complejos deportivos de Lima.
          </p>
        </div>

        {/* Sport filters */}
        <div style={{ display:'flex', gap:8, marginBottom:28, flexWrap:'wrap', justifyContent:'center' }}>
          {sports.map(s => (
            <button key={s} onClick={() => setSportFilter(s)}
              style={{ padding:'7px 16px', borderRadius:20, border: sportFilter === s ? '1px solid #00d084' : '1px solid #1e293b', background: sportFilter === s ? 'rgba(0,208,132,0.15)' : '#0a1628', color: sportFilter === s ? '#00d084' : '#64748b', fontSize:'0.82rem', fontWeight:700, cursor:'pointer', transition:'all 0.15s' }}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <div style={{ width:40, height:40, border:'3px solid #1e293b', borderTop:'3px solid #00d084', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color:'#64748b' }}>Cargando torneos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', background:'#0a1628', borderRadius:20, border:'1px solid #1e293b' }}>
            <div style={{ fontSize:'3rem', marginBottom:16 }}>🏆</div>
            <p style={{ color:'#f1f5f9', fontWeight:700, fontSize:'1.1rem', margin:'0 0 8px' }}>No hay torneos disponibles</p>
            <p style={{ color:'#64748b', margin:0 }}>Vuelve pronto — los propietarios publican torneos regularmente.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:22 }}>
            {filtered.map(t => (
              <TournamentCard key={t.id} tournament={t} user={user} onJoin={setJoinModal} />
            ))}
          </div>
        )}
      </div>

      {joinModal && (
        <JoinModal
          tournament={joinModal}
          loading={joinLoading}
          onClose={() => setJoinModal(null)}
          onConfirm={handleJoinConfirm}
        />
      )}

      {successToast && (
        <SuccessToast
          tournament={successToast.tournament}
          teamName={successToast.teamName}
          onClose={() => setSuccessToast(null)}
        />
      )}
    </div>
  );
}
