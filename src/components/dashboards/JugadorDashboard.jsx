import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { DashboardLayout, MetricCard, SkeletonTable, SkeletonCourtGrid } from './DashboardLayout.jsx';
import { api } from '../../services/api.js';
import { useOnboarding } from '../../hooks/useOnboarding.js';
import OnboardingTour from '../onboarding/OnboardingTour.jsx';

const JUGADOR_TOUR_STEPS = [
  {
    icon: 'bi-emoji-smile-fill',
    gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    shadowColor: 'rgba(102,126,234,0.4)',
    title: '¡Bienvenido a PlayStop!',
    description: 'Eres parte de la comunidad deportiva más grande del Perú. En menos de un minuto te mostramos todo lo que puedes hacer.',
    highlight: null,
  },
  {
    icon: 'bi-search',
    gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
    shadowColor: 'rgba(59,130,246,0.4)',
    title: 'Buscar Canchas',
    description: 'Encuentra canchas cerca de ti filtrando por deporte, ciudad y precio. Fútbol, tenis, pádel y más.',
    highlight: 'Buscar Canchas',
    tip: 'Haz clic en "Ver en mapa" para ver la ubicación exacta antes de reservar.',
  },
  {
    icon: 'bi-calendar2-check-fill',
    gradient: 'linear-gradient(135deg,#00d084,#00b875)',
    shadowColor: 'rgba(0,208,132,0.4)',
    title: 'Mis Reservas',
    description: 'Consulta todas tus reservas activas. Desde aquí accedes al código QR de entrada y puedes cancelar con anticipación.',
    highlight: 'Mis Reservas',
    tip: 'Cancelas sin costo si lo haces con más de 24 horas de anticipación.',
  },
  {
    icon: 'bi-trophy-fill',
    gradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
    shadowColor: 'rgba(245,158,11,0.4)',
    title: 'Logros y Puntos',
    description: 'Cada partido que juegas te da puntos PlayStop. Sube de nivel y desbloquea recompensas exclusivas.',
    highlight: 'Logros',
  },
  {
    icon: 'bi-people-fill',
    gradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
    shadowColor: 'rgba(139,92,246,0.4)',
    title: 'Mis Amigos',
    description: 'Conecta con tus compañeros de equipo buscándolos por email. Organiza partidos y arma tu once titular.',
    highlight: 'Mis Amigos',
  },
  {
    icon: 'bi-rocket-takeoff-fill',
    gradient: 'linear-gradient(135deg,#00d084,#3b82f6)',
    shadowColor: 'rgba(0,208,132,0.4)',
    title: '¡Todo listo para jugar!',
    description: 'Ya conoces PlayStop. Busca tu primera cancha y reserva en menos de 2 minutos. ¡Nos vemos en la cancha!',
    highlight: null,
  },
];

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80';

const STATUS_MAP = {
  CONFIRMED: { label: 'Confirmada', color: '#00d084', bg: '#d1fae5' },
  PENDING:   { label: 'Pendiente',  color: '#f59e0b', bg: '#fef3c7' },
  CANCELLED: { label: 'Cancelada',  color: '#ef4444', bg: '#fee2e2' },
  ATTENDED:  { label: 'Asistió',    color: '#8b5cf6', bg: '#ede9fe' },
  COMPLETED: { label: 'Completada', color: '#3b82f6', bg: '#eff6ff' },
};

const mapCourt = (c) => ({
  id: c.id,
  img: c.imageUrl || DEFAULT_IMG,
  name: c.name,
  type: c.sportType,
  price: `S/ ${c.pricePerHour}`,
  priceNum: parseFloat(c.pricePerHour) || 0,
  location: c.address || '',
  city: c.city || '',
  district: c.district || '',
  lat: c.latitude ?? null,
  lng: c.longitude ?? null,
  averageRating: c.averageRating ?? null,
  reviewCount: c.reviewCount ?? 0,
});

const mapReservation = (r) => {
  const s = STATUS_MAP[r.status] || { label: r.status, color: '#64748b', bg: '#f1f5f9' };
  return {
    id: r.id,
    court: r.courtName,
    date: `${r.date} • ${r.slotLabel || `${r.slotHour}:00`}`,
    rawDate: r.date,
    slotLabel: r.slotLabel || `${r.slotHour}:00`,
    status: s.label,
    color: s.color,
    bg: s.bg,
    apiStatus: r.status,
    courtAddress: r.courtAddress || '',
    courtLat: r.courtLat ?? null,
    courtLng: r.courtLng ?? null,
  };
};

const AMIGOS_DEFAULT = [
  { id: 1, name: 'Martín Fernández', email: 'martin@gmail.com', img: 'https://randomuser.me/api/portraits/men/44.jpg', level: 'Intermedio', lastMatch: 'Ayer' },
  { id: 2, name: 'Lucía Gómez',      email: 'lucia@gmail.com',  img: 'https://randomuser.me/api/portraits/women/68.jpg', level: 'Avanzado',    lastMatch: 'Hace 3 días' },
  { id: 3, name: 'Carlos Ramírez',   email: 'carlos@gmail.com', img: 'https://randomuser.me/api/portraits/men/32.jpg',  level: 'Principiante', lastMatch: 'Hace 1 semana' },
  { id: 4, name: 'Valeria Castro',   email: 'vale@gmail.com',   img: 'https://randomuser.me/api/portraits/women/44.jpg', level: 'Intermedio',  lastMatch: 'Hace 2 semanas' },
];

const NIVEL_COLORS = {
  'Principiante': { color: '#f59e0b', bg: '#fef3c7' },
  'Intermedio':   { color: '#3b82f6', bg: '#eff6ff' },
  'Avanzado':     { color: '#00d084', bg: '#d1fae5' },
};

const loadFavoritos = () => {
  try { return JSON.parse(localStorage.getItem('playspot_favoritos') || '[]'); }
  catch { return []; }
};

const saveFavoritos = (ids) => {
  localStorage.setItem('playspot_favoritos', JSON.stringify(ids));
};

const PERU_CITIES = ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Cusco', 'Iquitos', 'Huancayo', 'Tacna', 'Ica'];

const JugadorDashboard = ({ user, onLogout, darkMode = false, toggleTheme }) => {
  const navigate = useNavigate();
  const C = {
    textPrimary: darkMode ? '#f8fafc' : '#0f172a',
    textSecondary: darkMode ? '#94a3b8' : '#475569',
    textMuted: darkMode ? '#64748b' : '#94a3b8',
    cardBg: darkMode ? '#0f172a' : '#ffffff',
    cardBorder: darkMode ? '#1e293b' : '#e2e8f0',
    inputBg: darkMode ? '#020617' : '#f8fafc',
    inputBorder: darkMode ? '#1e293b' : '#e2e8f0',
    infoBg: darkMode ? '#1e293b' : '#f8fafc',
    infoBorder: darkMode ? '#334155' : '#cbd5e1',
  };
  const [activeTab, setActiveTab] = useState('Inicio');
  const { showTour, finishTour, retakeTour, tourHighlight, setTourHighlight } = useOnboarding('jugador');
  const [canchaSearch, setCanchaSearch] = useState('');
  const [canchaSportFilter, setCanchaSportFilter] = useState('Todos');
  const [cityFilter, setCityFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500);

  const [canchas, setCanchas] = useState([]);
  const [loadingCanchas, setLoadingCanchas] = useState(true);
  const [errorCanchas, setErrorCanchas] = useState(null);

  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);

  const [amigos, setAmigos] = useState(AMIGOS_DEFAULT);
  const [emailBusqueda, setEmailBusqueda] = useState('');
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null); // null | 'not_found' | { ...user }
  const [buscandoAmigo, setBuscandoAmigo] = useState(false);

  const [favoritosIds, setFavoritosIds] = useState(loadFavoritos);

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [modal, setModal] = useState({ show: false, action: null, payload: null });
  const [qrModal, setQrModal] = useState({ show: false, reservationId: null, courtName: '', date: '', slot: '' });
  const [mapModal, setMapModal] = useState({ show: false, cancha: null });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // 'form' | 'processing' | 'success'
  const [paymentStage, setPaymentStage] = useState('form');
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  // Profile
  const [profileData, setProfileData] = useState({ nombre: user?.name || '', telefono: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [pwdData, setPwdData] = useState({ contrasenaActual: '', nuevaContrasena: '', confirmarContrasena: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);

  // Gamification
  const [gamification, setGamification] = useState(null);
  const [loadingGami, setLoadingGami] = useState(true);

  // Confetti
  const [showConfetti, setShowConfetti] = useState(false);

  // Armar Equipo
  const [equipoSessions, setEquipoSessions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('playspot_equipo_sessions') || '[]'); }
    catch { return []; }
  });
  const [newSession, setNewSession] = useState({ court: '', sport: 'Fútbol', date: '', time: '08:00', totalPlayers: 10, notes: '' });
  const [equipoModal, setEquipoModal] = useState(false);

  useEffect(() => {
    api.getAllCourts()
      .then(data => {
        setCanchas(Array.isArray(data) ? data.map(mapCourt) : []);
        setErrorCanchas(null);
      })
      .catch((err) => {
        console.error('Error cargando canchas:', err);
        setErrorCanchas(err.message || 'Error de conexión con el servidor');
        setCanchas([]);
      })
      .finally(() => setLoadingCanchas(false));
  }, []);

  useEffect(() => {
    api.getMyReservations()
      .then(data => setReservas(Array.isArray(data) ? data.map(mapReservation) : []))
      .catch(() => setReservas([]))
      .finally(() => setLoadingReservas(false));
  }, []);

  useEffect(() => {
    api.getMe()
      .then(data => setProfileData({ nombre: data.name || '', telefono: data.phone || '' }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    api.getGamificationProfile()
      .then(data => setGamification(data))
      .catch(() => setGamification(null))
      .finally(() => setLoadingGami(false));
  }, []);

  const toggleFavorito = useCallback((canchaId) => {
    setFavoritosIds(prev => {
      const next = prev.includes(canchaId)
        ? prev.filter(id => id !== canchaId)
        : [...prev, canchaId];
      saveFavoritos(next);
      return next;
    });
  }, []);

  const canchasFavoritas = canchas.filter(c => favoritosIds.includes(c.id));

  const filteredCanchas = canchas.filter(c => {
    const q = canchaSearch.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
    const matchSport = canchaSportFilter === 'Todos' || c.type.toLowerCase().includes(canchaSportFilter.toLowerCase());
    const matchCity = !cityFilter || c.city === cityFilter || c.location.toLowerCase().includes(cityFilter.toLowerCase());
    const matchDistrict = !districtFilter || c.district.toLowerCase().includes(districtFilter.toLowerCase()) || c.location.toLowerCase().includes(districtFilter.toLowerCase());
    const matchPrice = c.priceNum >= priceMin && c.priceNum <= priceMax;
    return matchSearch && matchSport && matchCity && matchDistrict && matchPrice;
  });

  const hasActiveFilters = canchaSearch || canchaSportFilter !== 'Todos' || cityFilter || districtFilter || priceMin > 0 || priceMax < 500;

  const clearFilters = () => {
    setCanchaSearch('');
    setCanchaSportFilter('Todos');
    setCityFilter('');
    setDistrictFilter('');
    setPriceMin(0);
    setPriceMax(500);
  };

  const openModal = (action, payload = null) => setModal({ show: true, action, payload });
  const closeModal = () => {
    setModal({ show: false, action: null, payload: null });
    setAcceptedTerms(false);
    setSelectedDate('');
    setSelectedSlot(null);
    setSlots([]);
    setEmailBusqueda('');
    setResultadoBusqueda(null);
    setPaymentStage('form');
    setConfirmedReservation(null);
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedSlot(null);
    setSlots([]);
    if (date && modal.payload?.id) {
      setLoadingSlots(true);
      try {
        const data = await api.getCourtSlots(modal.payload.id, date);
        setSlots(Array.isArray(data) ? data : []);
      } catch {
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
  };

  const buscarAmigoPorEmail = async () => {
    const email = emailBusqueda.trim().toLowerCase();
    if (!email) return;
    setBuscandoAmigo(true);
    setResultadoBusqueda(null);

    await new Promise(r => setTimeout(r, 700));

    const yaEsAmigo = amigos.find(a => a.email.toLowerCase() === email);
    if (yaEsAmigo) {
      setResultadoBusqueda({ type: 'already', ...yaEsAmigo });
    } else if (email.includes('@')) {
      const nombre = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      setResultadoBusqueda({
        type: 'found',
        id: Date.now(),
        name: nombre,
        email,
        img: `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=0f172a&color=fff&size=100`,
        level: 'Principiante',
        lastMatch: 'Nuevo',
      });
    } else {
      setResultadoBusqueda({ type: 'not_found' });
    }
    setBuscandoAmigo(false);
  };

  const confirmarAgregarAmigo = () => {
    if (!resultadoBusqueda || resultadoBusqueda.type !== 'found') return;
    setAmigos(prev => [{ ...resultadoBusqueda }, ...prev]);
    setResultadoBusqueda({ type: 'sent', name: resultadoBusqueda.name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (modal.action === 'RESERVAR_CANCHA') {
      if (!selectedDate || selectedSlot === null) {
        alert('Por favor selecciona fecha y horario.');
        return;
      }
      setModal({ show: true, action: 'PAGO_CULQI', payload: { ...modal.payload, selectedDate, selectedSlot, slotLabel: slots.find(s => s.hour === selectedSlot)?.label || `${selectedSlot}:00` } });
      return;
    }

    setSubmitting(true);
    try {
      if (modal.action === 'CANCELAR_RESERVA') {
        await api.cancelReservation(modal.payload.id);
        setReservas(prev => prev.filter(r => r.id !== modal.payload.id));
        closeModal();

      } else if (modal.action === 'PAGO_CULQI') {
        setPaymentStage('processing');
        // Simulate payment gateway delay, then call backend
        await new Promise(r => setTimeout(r, 2000));
        const newRes = await api.createReservation({
          courtId: modal.payload.id,
          date: modal.payload.selectedDate,
          slotHour: modal.payload.selectedSlot,
        });
        const mapped = mapReservation(newRes);
        setReservas(prev => [mapped, ...prev]);
        setConfirmedReservation({
          id: newRes.id,
          court: modal.payload.name,
          date: modal.payload.selectedDate,
          slot: modal.payload.slotLabel,
          amount: modal.payload.price,
        });
        setPaymentStage('success');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    } catch (err) {
      setPaymentStage('form');
      alert(err.message || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    {showConfetti && <Confetti />}
    <DashboardLayout user={user} onLogout={onLogout} darkMode={darkMode} toggleTheme={toggleTheme}
      title={activeTab === 'Inicio' ? 'Mi Resumen Deportivo' : activeTab}
      activeTab={activeTab} onTabChange={setActiveTab}
      tourHighlight={tourHighlight} onRestartTour={retakeTour}
      menuItems={[
        { icon: 'bi-house-fill',           label: 'Inicio' },
        { icon: 'bi-search',               label: 'Buscar Canchas' },
        { icon: 'bi-calendar2-check-fill', label: 'Mis Reservas' },
        { icon: 'bi-trophy-fill',          label: 'Logros' },
        { icon: 'bi-people-fill',          label: 'Mis Amigos' },
        { icon: 'bi-diagram-3-fill',       label: 'Armar Equipo' },
        { icon: 'bi-heart-fill',           label: 'Canchas Favoritas' },
        { icon: 'bi-person-circle',        label: 'Mi Perfil' },
      ]}>

      {/* ─── Inicio ────────────────────────────────────── */}
      {activeTab === 'Inicio' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '30px' }}>
            <MetricCard title="Próximo Partido" value={reservas.find(r => r.apiStatus === 'CONFIRMED')?.date || '—'} subtitle={reservas.find(r => r.apiStatus === 'CONFIRMED')?.court || 'Sin reservas activas'} color="#3b82f6" trend="up" />
            <MetricCard title="Puntos PlayStop" value={loadingGami ? '...' : `${gamification?.totalPoints ?? 0} pts`} subtitle={loadingGami ? '' : `Nivel ${gamification?.level ?? 1} • ${gamification?.levelName ?? 'Principiante'}`} color="#00d084" trend="up" />
            <MetricCard title="Partidos Jugados" value={reservas.filter(r => r.apiStatus === 'ATTENDED').length || '0'} subtitle="Partidos completados" color="#f59e0b" />
          </div>

          {/* Canchas favoritas en inicio */}
          {canchasFavoritas.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: C.textPrimary, fontSize: '1.15rem', fontWeight: '800', display:'flex', alignItems:'center', gap:8 }}><i className="bi bi-heart-fill" style={{ color:'#ef4444' }} /> Tus Canchas Favoritas</h3>
                <span onClick={() => setActiveTab('Canchas Favoritas')} style={{ color: '#3b82f6', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>Ver todas →</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {canchasFavoritas.slice(0, 3).map(c => (
                  <CourtCard key={c.id} cancha={c} isFavorito={true} onToggleFavorito={() => toggleFavorito(c.id)} onReservar={() => navigate(`/reservar/${c.id}`)} onVerMapa={() => setMapModal({ show: true, cancha: c })} darkMode={darkMode} compact />
                ))}
              </div>
            </div>
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: C.textPrimary, fontSize: '1.3rem', fontWeight: '800' }}>Canchas recomendadas para ti</h3>
              <span onClick={() => setActiveTab('Buscar Canchas')} style={{ color: '#3b82f6', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>Ver todas →</span>
            </div>
            {loadingCanchas ? (
              <SkeletonCourtGrid count={3} />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {canchas.slice(0, 3).map((cancha, i) => (
                  <CourtCard key={cancha.id || i} cancha={cancha} isFavorito={favoritosIds.includes(cancha.id)} onToggleFavorito={() => toggleFavorito(cancha.id)} onReservar={() => navigate(`/reservar/${cancha.id}`)} onVerMapa={() => setMapModal({ show: true, cancha })} darkMode={darkMode} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ─── Buscar Canchas ────────────────────────────── */}
      {activeTab === 'Buscar Canchas' && (
        <div>
          <style>{`
            @keyframes heroSlide { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
            .filter-card { background:${darkMode ? '#0f172a' : '#fff'}; border-radius:20px; padding:24px; border:1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}; box-shadow:0 1px 3px rgba(0,0,0,0.05); }
            .filter-label { font-size:0.78rem; font-weight:800; color:${darkMode ? '#94a3b8' : '#64748b'}; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:8px; display:block; }
            .filter-input { width:100%; padding:11px 14px; border-radius:10px; border:1.5px solid ${darkMode ? '#1e293b' : '#e2e8f0'}; font-size:0.95rem; outline:none; background:${darkMode ? '#020617' : '#f8fafc'}; color:${darkMode ? '#f8fafc' : '#0f172a'}; box-sizing:border-box; transition:border-color 0.2s; }
            .filter-input:focus { border-color:#00d084; background:${darkMode ? '#0f172a' : '#fff'}; }
            .sport-chip { padding:8px 16px; border-radius:99px; border:none; font-size:0.82rem; font-weight:700; cursor:pointer; transition:all 0.18s; white-space:nowrap; }
            .sport-chip.active { background:${darkMode ? '#00d084' : '#0f172a'}; color:${darkMode ? '#0f172a' : '#fff'}; box-shadow:0 4px 12px rgba(15,23,42,0.25); }
            .sport-chip.inactive { background:${darkMode ? '#1e293b' : '#f1f5f9'}; color:${darkMode ? '#94a3b8' : '#475569'}; }
            .sport-chip.inactive:hover { background:${darkMode ? '#334155' : '#e2e8f0'}; color:${darkMode ? '#f8fafc' : '#0f172a'}; }
            .range-track { width:100%; height:4px; border-radius:2px; background: linear-gradient(to right, ${darkMode ? '#1e293b' : '#e2e8f0'} 0%, ${darkMode ? '#1e293b' : '#e2e8f0'} var(--min-pct), #00d084 var(--min-pct), #00d084 var(--max-pct), ${darkMode ? '#1e293b' : '#e2e8f0'} var(--max-pct), ${darkMode ? '#1e293b' : '#e2e8f0'} 100%); }
            input[type=range] { -webkit-appearance:none; appearance:none; width:100%; height:4px; background:transparent; outline:none; margin:0; }
            input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:${darkMode ? '#00d084' : '#0f172a'}; cursor:pointer; border:2px solid ${darkMode ? '#020617' : '#fff'}; box-shadow:0 2px 6px rgba(0,0,0,0.2); }
          `}</style>

          {/* Hero banner */}
          <div style={{ borderRadius: '24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f4c75 100%)', padding: '36px 32px', marginBottom: '28px', position: 'relative', overflow: 'hidden', animation: 'heroSlide 0.5s ease' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(0,208,132,0.08)' }} />
            <div style={{ position: 'absolute', bottom: '-60px', right: '80px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(59,130,246,0.08)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ background: 'rgba(0,208,132,0.2)', color: '#00d084', padding: '4px 12px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.5px' }}>
                  {canchas.length} canchas disponibles
                </span>
              </div>
              <h2 style={{ margin: '0 0 8px', color: '#fff', fontSize: '1.9rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
                Encuentra tu cancha perfecta
              </h2>
              <p style={{ margin: '0 0 24px', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
                Filtra por deporte, ciudad, distrito y precio para encontrar la cancha ideal.
              </p>
              {/* Search bar */}
              <div style={{ display: 'flex', gap: '12px', maxWidth: '600px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <i className="bi bi-search" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: '1rem', pointerEvents: 'none' }} />
                  <input
                    type="text" value={canchaSearch}
                    onChange={(e) => setCanchaSearch(e.target.value)}
                    placeholder="Buscar por nombre, deporte o dirección..."
                    style={{ width: '100%', padding: '14px 18px 14px 44px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.15)', fontSize: '0.95rem', outline: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(8px)', boxSizing: 'border-box' }}
                  />
                </div>
                {hasActiveFilters && (
                  <button onClick={clearFilters} style={{ padding: '14px 20px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '0.88rem', whiteSpace: 'nowrap', backdropFilter: 'blur(8px)' }}>
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>

          {errorCanchas && (
            <div style={{ padding: '16px 20px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#991b1b', fontWeight: '600', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <i className="bi bi-exclamation-triangle-fill" style={{ color:'#ef4444' }} />
              <span>No se pudieron cargar las canchas: <strong>{errorCanchas}</strong></span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>

            {/* ── Sidebar de filtros ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '20px' }}>

              {/* Deporte chips */}
              <div className="filter-card">
                <span className="filter-label">Deporte</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Todos', 'Fútbol', 'Pádel', 'Tenis', 'Vóley', 'Básquet'].map(s => (
                    <button key={s} className={`sport-chip ${canchaSportFilter === s ? 'active' : 'inactive'}`}
                      onClick={() => setCanchaSportFilter(s)}>
                      {s === 'Todos' ? 'Todos' : s === 'Fútbol' ? <><i className="bi bi-dribbble" style={{marginRight:5}} />Fútbol</> : s === 'Pádel' ? <><i className="bi bi-record-circle" style={{marginRight:5}} />Pádel</> : s === 'Tenis' ? <><i className="bi bi-circle-fill" style={{marginRight:5}} />Tenis</> : s === 'Vóley' ? <><i className="bi bi-circle" style={{marginRight:5}} />Vóley</> : <><i className="bi bi-circle-half" style={{marginRight:5}} />Básquet</>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ciudad */}
              <div className="filter-card">
                <span className="filter-label">Ciudad</span>
                <select className="filter-input" value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
                  <option value="">Todas las ciudades</option>
                  {PERU_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Distrito */}
              <div className="filter-card">
                <span className="filter-label">Distrito</span>
                <input
                  className="filter-input"
                  type="text"
                  value={districtFilter}
                  onChange={e => setDistrictFilter(e.target.value)}
                  placeholder="Ej. Miraflores, Surco..."
                />
              </div>

              {/* Precio */}
              <div className="filter-card">
                <span className="filter-label">Precio por hora</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textPrimary }}>S/ {priceMin}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textPrimary }}>S/ {priceMax}</span>
                </div>
                <div style={{ position: 'relative', height: '20px', marginBottom: '8px' }}>
                  <div className="range-track" style={{ position: 'absolute', top: '8px', left: 0, right: 0, '--min-pct': `${(priceMin/500)*100}%`, '--max-pct': `${(priceMax/500)*100}%` }} />
                  <input type="range" min="0" max="500" step="10" value={priceMin}
                    onChange={e => setPriceMin(Math.min(Number(e.target.value), priceMax - 10))}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'auto' }} />
                  <input type="range" min="0" max="500" step="10" value={priceMax}
                    onChange={e => setPriceMax(Math.max(Number(e.target.value), priceMin + 10))}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
                  Arrastra para ajustar el rango
                </p>
              </div>

              {/* Resultados count */}
              <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#00d084' }}>{filteredCanchas.length}</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>canchas encontradas</div>
              </div>
            </div>

            {/* ── Grid de canchas ── */}
            <div>
              {loadingCanchas ? (
                <SkeletonCourtGrid count={6} />
              ) : filteredCanchas.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {filteredCanchas.map((cancha, i) => (
                    <CourtCard key={cancha.id || i} cancha={cancha}
                      isFavorito={favoritosIds.includes(cancha.id)}
                      onToggleFavorito={() => toggleFavorito(cancha.id)}
                      onReservar={() => navigate(`/reservar/${cancha.id}`)}
                      onVerMapa={() => setMapModal({ show: true, cancha })}
                      darkMode={darkMode} />
                  ))}
                </div>
              ) : (
                <EmptyState icon="bi-search" title="Sin resultados" message="Prueba ajustando los filtros o el rango de precios." darkMode={darkMode} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Mis Reservas ──────────────────────────────── */}
      {activeTab === 'Mis Reservas' && (
        <div>
          {/* Header con estadísticas rápidas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total reservas', val: reservas.length, icon: 'bi-calendar3', color: '#3b82f6' },
              { label: 'Confirmadas', val: reservas.filter(r => r.apiStatus === 'CONFIRMED').length, icon: 'bi-check-circle-fill', color: '#00d084' },
              { label: 'Completadas', val: reservas.filter(r => r.apiStatus === 'ATTENDED').length, icon: 'bi-award-fill', color: '#8b5cf6' },
              { label: 'Canceladas', val: reservas.filter(r => r.apiStatus === 'CANCELLED').length, icon: 'bi-x-circle-fill', color: '#ef4444' },
            ].map(stat => (
              <div key={stat.label} style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: `4px solid ${stat.color}` }}>
                <span style={{ fontSize: '1.6rem' }}>{stat.icon}</span>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: C.textPrimary, lineHeight: 1 }}>{stat.val}</div>
                  <div style={{ fontSize: '0.78rem', color: C.textMuted, fontWeight: '600', marginTop: '2px' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: C.textPrimary, fontSize: '1.15rem', fontWeight: '800' }}>Historial de Reservas</h3>
              <button onClick={() => setActiveTab('Buscar Canchas')} className="btn-primary-ps" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                + Nueva reserva
              </button>
            </div>

            {loadingReservas ? (
              <div style={{ padding: '24px' }}><SkeletonTable rows={3} /></div>
            ) : reservas.length === 0 ? (
              <div style={{ padding: '40px 24px' }}>
                <EmptyState
                  icon="bi-calendar3"
                  title="Aún no tienes reservas"
                  message="Busca una cancha, elige tu horario favorito y reserva en menos de 2 minutos."
                  darkMode={darkMode}
                  cta={{ label: 'Buscar canchas', onClick: () => setActiveTab('Buscar Canchas') }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {reservas.map((row, idx) => (
                  <div key={row.id} style={{
                    padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
                    flexWrap: 'wrap', borderBottom: idx < reservas.length - 1 ? `1px solid ${C.cardBorder}` : 'none',
                    transition: 'background .15s',
                  }}
                    onMouseOver={e => e.currentTarget.style.background = darkMode ? '#1a2236' : '#fafbff'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Estado icon */}
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0, background: row.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                      <i className={`bi ${row.apiStatus === 'CONFIRMED' ? 'bi-check-circle-fill' : row.apiStatus === 'CANCELLED' ? 'bi-x-circle-fill' : row.apiStatus === 'ATTENDED' ? 'bi-award-fill' : 'bi-hourglass-split'}`} style={{ color: row.color }} />
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: '150px' }}>
                      <div style={{ fontWeight: '800', color: C.textPrimary, fontSize: '0.95rem', marginBottom: '2px' }}>{row.court}</div>
                      <div style={{ fontSize: '0.82rem', color: C.textMuted }}>{row.date}</div>
                    </div>
                    {/* Status badge */}
                    <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '800', color: row.color, background: row.bg, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {row.status}
                    </span>
                    {/* Acciones */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                      {/* Cómo llegar */}
                      <button
                        onClick={() => setMapModal({ show: true, cancha: { name: row.court, location: row.courtAddress, lat: row.courtLat, lng: row.courtLng, district: '', city: '' } })}
                        style={{ padding: '7px 13px', borderRadius: '9px', border: 'none', background: darkMode ? 'rgba(59,130,246,.15)' : '#eff6ff', color: '#3b82f6', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="bi bi-geo-alt-fill" /> Cómo llegar
                      </button>
                      {(row.apiStatus === 'CONFIRMED' || row.apiStatus === 'PENDING') && (
                        <button
                          onClick={() => setQrModal({ show: true, reservationId: row.id, courtName: row.court, date: row.rawDate, slot: row.slotLabel, timestamp: Date.now() })}
                          style={{ padding: '7px 13px', borderRadius: '9px', border: 'none', background: darkMode ? '#1e293b' : '#0f172a', color: '#00d084', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <i className="bi bi-qr-code-scan" /> Ver QR
                        </button>
                      )}
                      {row.apiStatus === 'ATTENDED' && (
                        <span style={{ padding: '7px 13px', borderRadius: '9px', background: darkMode ? 'rgba(139,92,246,.2)' : '#ede9fe', color: darkMode ? '#a78bfa' : '#7c3aed', fontWeight: '700', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <i className="bi bi-award-fill" /> Asistió
                        </span>
                      )}
                      {row.apiStatus !== 'CANCELLED' && row.apiStatus !== 'ATTENDED' && (
                        <button onClick={() => openModal('CANCELAR_RESERVA', row)} style={{ padding: '7px 13px', borderRadius: '9px', border: 'none', background: darkMode ? 'rgba(239,68,68,.15)' : '#fee2e2', color: darkMode ? '#f87171' : '#ef4444', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Logros ───────────────────────────────────── */}
      {activeTab === 'Logros' && (
        <div>
          <style>{`
            @keyframes fillBar { from { width: 0; } to { width: var(--bar-pct); } }
            @keyframes badgePop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          `}</style>

          {loadingGami ? (
            <div style={{ textAlign: 'center', padding: '60px', color: C.textMuted, fontSize: '1rem', fontWeight: '700' }}>
              Cargando logros...
            </div>
          ) : !gamification ? (
            <EmptyState icon="bi-trophy-fill" title="No disponible" message="No se pudo cargar tu perfil de logros." darkMode={darkMode} />
          ) : (
            <>
              {/* ── Level card ── */}
              <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f4c75 100%)', borderRadius: '24px', padding: '32px', marginBottom: '28px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(0,208,132,0.08)' }} />
                <div style={{ position: 'absolute', bottom: '-50px', right: '100px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(59,130,246,0.08)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                        Tu nivel actual
                      </div>
                      <div style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
                        {gamification.levelName}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                        Nivel {gamification.level}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
                        Puntos totales
                      </div>
                      <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#00d084', letterSpacing: '-1px', lineHeight: 1 }}>
                        {gamification.totalPoints.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                        pts acumulados
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {gamification.pointsToNextLevel > 0 && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'rgba(255,255,255,0.7)' }}>
                          Progreso al siguiente nivel
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#00d084' }}>
                          {gamification.pointsToNextLevel} pts restantes
                        </span>
                      </div>
                      <div style={{ height: '8px', borderRadius: '99px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                        {(() => {
                          const thresholds = [0, 100, 250, 500, 1000, 2000];
                          const lvl = gamification.level - 1;
                          const from = thresholds[lvl] ?? 0;
                          const to = thresholds[lvl + 1] ?? from + 1000;
                          const pct = Math.min(100, ((gamification.totalPoints - from) / (to - from)) * 100);
                          return (
                            <div style={{
                              height: '100%', borderRadius: '99px',
                              background: 'linear-gradient(90deg, #00d084, #3b82f6)',
                              width: `${pct}%`,
                              animation: 'fillBar 1s ease forwards',
                              '--bar-pct': `${pct}%`,
                            }} />
                          );
                        })()}
                      </div>
                    </div>
                  )}
                  {gamification.pointsToNextLevel === 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,208,132,0.15)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(0,208,132,0.3)' }}>
                      <i className="bi bi-trophy-fill" style={{ fontSize: '1.2rem', color: '#00d084' }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#00d084' }}>¡Has alcanzado el nivel máximo! Eres una leyenda.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── How to earn points ── */}
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '20px 24px', marginBottom: '28px' }}>
                <h3 style={{ margin: '0 0 16px', color: C.textPrimary, fontSize: '1rem', fontWeight: '800' }}>¿Cómo ganar puntos?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {[
                    { icon: 'bi-check-circle-fill', label: 'Partido completado', pts: '+5 pts' },
                    { icon: 'bi-geo-alt-fill',      label: 'Primera reserva',    pts: '+10 pts' },
                    { icon: 'bi-pencil-fill',        label: 'Primera reseña',     pts: '+20 pts' },
                    { icon: 'bi-award-fill',         label: 'Logros desbloqueados', pts: '+ bonus' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '12px', background: darkMode ? '#0f172a' : '#f8fafc', border: `1px solid ${C.cardBorder}` }}>
                      <i className={`bi ${item.icon}`} style={{ fontSize: '1.3rem', color: '#00d084' }} />
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: C.textPrimary }}>{item.label}</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#00d084' }}>{item.pts}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Achievements grid ── */}
              <h3 style={{ margin: '0 0 16px', color: C.textPrimary, fontSize: '1.15rem', fontWeight: '800' }}>
                Logros ({gamification.achievements.filter(a => a.unlocked).length}/{gamification.achievements.length} desbloqueados)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {gamification.achievements.map((a, i) => (
                  <div key={a.id} style={{
                    background: C.cardBg,
                    border: `1px solid ${a.unlocked ? (darkMode ? 'rgba(0,208,132,0.4)' : 'rgba(0,208,132,0.5)') : C.cardBorder}`,
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    opacity: a.unlocked ? 1 : 0.55,
                    animation: a.unlocked ? `badgePop 0.4s ease ${i * 0.05}s both` : 'none',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {a.unlocked && (
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #00d084, #3b82f6)', borderRadius: '16px 16px 0 0' }} />
                    )}
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
                      background: a.unlocked ? 'linear-gradient(135deg, rgba(0,208,132,0.15), rgba(59,130,246,0.15))' : (darkMode ? '#1e293b' : '#f1f5f9'),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.6rem',
                      border: a.unlocked ? '1px solid rgba(0,208,132,0.3)' : `1px solid ${C.cardBorder}`,
                      filter: a.unlocked ? 'none' : 'grayscale(1)',
                    }}>
                      {a.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontWeight: '800', color: C.textPrimary, fontSize: '0.95rem' }}>{a.name}</span>
                        {a.unlocked && <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#00d084', background: 'rgba(0,208,132,0.12)', padding: '2px 7px', borderRadius: '99px', whiteSpace: 'nowrap' }}>Desbloqueado</span>}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: C.textMuted, marginBottom: '6px' }}>{a.description}</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '800', color: a.unlocked ? '#00d084' : C.textMuted }}>
                        +{a.pointsReward} pts
                        {a.unlocked && a.unlockedAt && (
                          <span style={{ fontWeight: '600', color: C.textMuted, marginLeft: '8px' }}>
                            · {new Date(a.unlockedAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                    {!a.unlocked && (
                      <div style={{ fontSize: '1.2rem', color: C.textMuted, flexShrink: 0 }}>🔒</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── Mis Amigos ────────────────────────────────── */}
      {activeTab === 'Mis Amigos' && (
        <div>
          {/* Buscador por correo */}
          <div className="dashboard-card-ps" style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 6px 0', color: C.textPrimary, fontSize: '1.15rem', fontWeight: '800' }}>Buscar jugadores por correo</h3>
            <p style={{ margin: '0 0 18px', color: C.textSecondary, fontSize: '0.9rem' }}>Ingresa el correo de tu amigo para agregarlo a tu lista.</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="email"
                value={emailBusqueda}
                onChange={e => { setEmailBusqueda(e.target.value); setResultadoBusqueda(null); }}
                onKeyDown={e => e.key === 'Enter' && buscarAmigoPorEmail()}
                placeholder="correo@ejemplo.com"
                className="modal-ps-input"
                style={{ flex: 1, minWidth: '220px' }}
              />
              <button
                onClick={buscarAmigoPorEmail}
                disabled={buscandoAmigo || !emailBusqueda.trim()}
                className="btn-primary-ps"
                style={{ padding: '13px 22px', opacity: !emailBusqueda.trim() ? 0.5 : 1, cursor: buscandoAmigo ? 'wait' : 'pointer' }}
              >
                {buscandoAmigo ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {/* Resultado de búsqueda */}
            {resultadoBusqueda && (
              <div style={{ marginTop: '16px' }}>
                {resultadoBusqueda.type === 'not_found' && (
                  <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '12px', color: '#92400e', fontWeight: '600' }}>
                    No se encontró ningún usuario con ese correo.
                  </div>
                )}
                {resultadoBusqueda.type === 'already' && (
                  <div style={{ padding: '16px', backgroundColor: '#d1fae5', borderRadius: '12px', color: '#065f46', fontWeight: '600' }}>
                    ✓ {resultadoBusqueda.name} ya está en tu lista de amigos.
                  </div>
                )}
                {resultadoBusqueda.type === 'sent' && (
                  <div style={{ padding: '16px', backgroundColor: '#d1fae5', borderRadius: '12px', color: '#065f46', fontWeight: '600' }}>
                    ✓ Solicitud enviada a {resultadoBusqueda.name}.
                  </div>
                )}
                {resultadoBusqueda.type === 'found' && (
                  <div style={{ padding: '16px', backgroundColor: C.infoBg, borderRadius: '12px', border: `1px solid ${C.infoBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src={resultadoBusqueda.img} alt={resultadoBusqueda.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <p style={{ margin: 0, fontWeight: '800', color: C.textPrimary, fontSize: '1rem' }}>{resultadoBusqueda.name}</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: C.textSecondary }}>{resultadoBusqueda.email}</p>
                      </div>
                    </div>
                    <button onClick={confirmarAgregarAmigo} className="btn-primary-ps" style={{ padding: '10px 20px' }}>
                      + Agregar amigo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lista de amigos */}
          <div className="dashboard-card-ps">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: C.textPrimary, fontSize: '1.2rem', fontWeight: '800' }}>Mis Amigos ({amigos.length})</h3>
            </div>
            {amigos.length === 0 ? (
              <EmptyState icon="bi-people-fill" title="Sin amigos aún" message="Busca jugadores por correo para agregarlos a tu lista." darkMode={darkMode} />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {amigos.map((amigo) => {
                  const nivel = NIVEL_COLORS[amigo.level] || { color: '#64748b', bg: '#f1f5f9' };
                  return (
                    <div key={amigo.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', border: `1px solid ${C.cardBorder}`, borderRadius: '16px', transition: 'all 0.2s', backgroundColor: C.cardBg }} className="card-hover">
                      <img src={amigo.img} alt={amigo.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: C.textPrimary, fontWeight: '800', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{amigo.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: nivel.color, backgroundColor: nivel.bg, padding: '2px 8px', borderRadius: '6px' }}>{amigo.level}</span>
                          <span style={{ fontSize: '0.8rem', color: C.textMuted }}>{amigo.lastMatch === 'Nuevo' ? 'Nuevo amigo' : amigo.lastMatch}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setAmigos(prev => prev.filter(a => a.id !== amigo.id))}
                        title="Eliminar amigo"
                        style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '1.1rem', padding: '4px', borderRadius: '8px', transition: 'color 0.2s', flexShrink: 0 }}
                        onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseOut={e => e.currentTarget.style.color = '#cbd5e1'}
                      >✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Armar Equipo ─────────────────────────────── */}
      {activeTab === 'Armar Equipo' && (
        <div>
          <style>{`
            @keyframes sessionPop { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
          `}</style>
          {/* Hero */}
          <div style={{ borderRadius:24, background:'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#312e81 100%)', padding:'32px', marginBottom:28, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'140px', height:'140px', borderRadius:'50%', background:'rgba(139,92,246,0.12)' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <span style={{ background:'rgba(139,92,246,0.2)', color:'#a78bfa', padding:'4px 12px', borderRadius:99, fontSize:'.78rem', fontWeight:800 }}>
                  {equipoSessions.filter(s => s.confirmed < s.totalPlayers).length} sesiones abiertas
                </span>
              </div>
              <h2 style={{ margin:'0 0 8px', color:'#fff', fontSize:'1.8rem', fontWeight:900, letterSpacing:'-0.5px' }}>Arma tu equipo</h2>
              <p style={{ margin:'0 0 24px', color:'rgba(255,255,255,0.6)', fontSize:'.95rem' }}>Crea o únete a sesiones públicas. Llena canchas, encuentra compañeros.</p>
              <button
                onClick={() => setEquipoModal(true)}
                style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff', border:'none', borderRadius:12, padding:'12px 22px', fontWeight:800, fontSize:'.95rem', cursor:'pointer', boxShadow:'0 8px 20px rgba(139,92,246,0.35)' }}
              >
                + Crear sesión
              </button>
            </div>
          </div>

          {/* Sessions grid */}
          {equipoSessions.length === 0 ? (
            <EmptyState
              icon="bi-dribbble"
              title="Sin sesiones activas"
              message="Crea la primera sesión y encuentra compañeros para jugar."
              darkMode={darkMode}
              cta={{ label: '+ Crear sesión', onClick: () => setEquipoModal(true) }}
            />
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
              {equipoSessions.map((s, i) => {
                const spotsLeft = s.totalPlayers - s.confirmed;
                const isFull = spotsLeft === 0;
                const spotColor = isFull ? '#ef4444' : spotsLeft <= 2 ? '#f59e0b' : '#00d084';
                return (
                  <div key={s.id} className="card-hover" style={{ background:C.cardBg, border:`1px solid ${C.cardBorder}`, borderRadius:20, overflow:'hidden', animation:`sessionPop 0.3s ease ${i*0.05}s both` }}>
                    <div style={{ height:6, background:`linear-gradient(90deg,${spotColor},${spotColor}80)` }} />
                    <div style={{ padding:'18px 20px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                        <div>
                          <div style={{ fontSize:'.72rem', fontWeight:800, color:'#8b5cf6', textTransform:'uppercase', letterSpacing:'.4px', marginBottom:4 }}>{s.sport}</div>
                          <h4 style={{ margin:0, color:C.textPrimary, fontSize:'1rem', fontWeight:800 }}>{s.court || 'Cancha por definir'}</h4>
                        </div>
                        <span style={{ padding:'4px 10px', borderRadius:99, background:isFull?'rgba(239,68,68,0.12)':spotsLeft<=2?'rgba(245,158,11,0.12)':'rgba(0,208,132,0.12)', color:spotColor, fontSize:'.75rem', fontWeight:800, whiteSpace:'nowrap' }}>
                          {isFull ? 'Completo' : `${spotsLeft} cupos`}
                        </span>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:16 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.82rem', color:C.textMuted }}>
                          <i className="bi bi-calendar3" /><span>{s.date} • {s.time}</span>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.82rem', color:C.textMuted }}>
                          <i className="bi bi-people-fill" /><span>{s.confirmed}/{s.totalPlayers} jugadores</span>
                        </div>
                        {s.notes && (
                          <div style={{ fontSize:'.8rem', color:C.textSecondary, background:C.infoBg, borderRadius:8, padding:'8px 10px', marginTop:4 }}>{s.notes}</div>
                        )}
                      </div>
                      {/* Progress bar */}
                      <div style={{ height:4, borderRadius:99, background:darkMode?'#1e293b':'#e2e8f0', overflow:'hidden', marginBottom:14 }}>
                        <div style={{ height:'100%', borderRadius:99, background:spotColor, width:`${(s.confirmed/s.totalPlayers)*100}%`, transition:'width .4s ease' }} />
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        {!isFull && (
                          <button
                            onClick={() => {
                              const updated = equipoSessions.map(x => x.id === s.id ? { ...x, confirmed: x.confirmed + 1 } : x);
                              setEquipoSessions(updated);
                              localStorage.setItem('playspot_equipo_sessions', JSON.stringify(updated));
                            }}
                            style={{ flex:1, padding:'9px 0', borderRadius:10, border:'none', background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff', fontWeight:700, fontSize:'.85rem', cursor:'pointer' }}
                          >
                            Unirme
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm('¿Eliminar esta sesión?')) {
                              const updated = equipoSessions.filter(x => x.id !== s.id);
                              setEquipoSessions(updated);
                              localStorage.setItem('playspot_equipo_sessions', JSON.stringify(updated));
                            }
                          }}
                          style={{ padding:'9px 14px', borderRadius:10, border:`1px solid ${C.cardBorder}`, background:'transparent', color:C.textMuted, fontWeight:600, fontSize:'.82rem', cursor:'pointer' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Create session modal */}
          {equipoModal && (
            <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.88)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(12px)' }}>
              <div className="modal-box-ps" style={{ maxWidth:460 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                  <h2 className="modal-title-ps">Crear sesión de juego</h2>
                  <button onClick={() => setEquipoModal(false)} className="modal-close-ps">×</button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <label className="modal-label-ps">Deporte</label>
                    <select className="modal-ps-input" value={newSession.sport} onChange={e => setNewSession(p => ({ ...p, sport: e.target.value }))}>
                      {['Fútbol','Pádel','Tenis','Vóley','Básquet'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <label className="modal-label-ps">Cancha (opcional)</label>
                    <input className="modal-ps-input" placeholder="Ej. Cancha Los Olivos" value={newSession.court} onChange={e => setNewSession(p => ({ ...p, court: e.target.value }))} />
                  </div>
                  <div style={{ display:'flex', gap:12 }}>
                    <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
                      <label className="modal-label-ps">Fecha</label>
                      <input type="date" className="modal-ps-input" value={newSession.date} min={new Date().toISOString().split('T')[0]} onChange={e => setNewSession(p => ({ ...p, date: e.target.value }))} />
                    </div>
                    <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
                      <label className="modal-label-ps">Hora</label>
                      <input type="time" className="modal-ps-input" value={newSession.time} onChange={e => setNewSession(p => ({ ...p, time: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <label className="modal-label-ps">Jugadores necesarios</label>
                    <input type="number" className="modal-ps-input" min={2} max={22} value={newSession.totalPlayers} onChange={e => setNewSession(p => ({ ...p, totalPlayers: parseInt(e.target.value) || 2 }))} />
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <label className="modal-label-ps">Notas (opcional)</label>
                    <input className="modal-ps-input" placeholder="Ej. Traer peto amarillo, nivel intermedio" value={newSession.notes} onChange={e => setNewSession(p => ({ ...p, notes: e.target.value }))} />
                  </div>
                  <div style={{ display:'flex', gap:12, marginTop:8 }}>
                    <button onClick={() => setEquipoModal(false)} className="modal-btn-cancel-ps">Cancelar</button>
                    <button
                      onClick={() => {
                        if (!newSession.date) { alert('Selecciona una fecha'); return; }
                        const session = { ...newSession, id: Date.now(), confirmed: 1, createdBy: user?.name || 'Tú' };
                        const updated = [session, ...equipoSessions];
                        setEquipoSessions(updated);
                        localStorage.setItem('playspot_equipo_sessions', JSON.stringify(updated));
                        setEquipoModal(false);
                        setNewSession({ court: '', sport: 'Fútbol', date: '', time: '08:00', totalPlayers: 10, notes: '' });
                      }}
                      className="modal-btn-submit-ps"
                    >
                      Crear sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Canchas Favoritas ─────────────────────────── */}
      {activeTab === 'Canchas Favoritas' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', color: C.textPrimary, fontSize: '1.3rem', fontWeight: '800' }}>Canchas Favoritas</h3>
              <p style={{ margin: 0, color: C.textSecondary, fontSize: '0.9rem' }}>Toca el corazón en cualquier cancha para agregarla aquí.</p>
            </div>
          </div>
          {loadingCanchas ? (
            <SkeletonCourtGrid count={3} />
          ) : canchasFavoritas.length === 0 ? (
            <EmptyState
              icon="bi-heart-fill"
              title="Sin canchas favoritas"
              message="Toca el corazón en cualquier cancha para guardarla aquí y acceder rápido."
              darkMode={darkMode}
              cta={{ label: 'Explorar canchas', onClick: () => setActiveTab('Buscar Canchas') }}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {canchasFavoritas.map(cancha => (
                <CourtCard key={cancha.id} cancha={cancha} isFavorito={true} onToggleFavorito={() => toggleFavorito(cancha.id)} onReservar={() => navigate(`/reservar/${cancha.id}`)} onVerMapa={() => setMapModal({ show: true, cancha })} darkMode={darkMode} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Mi Perfil ─────────────────────────────────── */}
      {activeTab === 'Mi Perfil' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', alignItems: 'start' }}>
          <div className="dashboard-card-ps" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '120px', background: 'linear-gradient(135deg, rgba(0, 208, 132, 0.8) 0%, rgba(59, 130, 246, 0.8) 100%)' }}></div>
            <div style={{ padding: '0 32px 32px 32px', marginTop: '-40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e2e8f0', backgroundImage: `url(https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.nombre || user?.name || 'U')}&background=0f172a&color=fff&size=150)`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}></div>
                <div>
                  <label htmlFor="profile-pic" className="btn-secondary-ps" style={{ padding: '8px 16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    Cambiar Foto
                  </label>
                  <input type="file" id="profile-pic" accept="image/*" style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      try {
                        const { url } = await api.uploadImage(file);
                        await api.updateAvatar(url);
                        setProfileMsg({ type: 'success', text: 'Foto actualizada correctamente' });
                      } catch (err) {
                        setProfileMsg({ type: 'error', text: err.message || 'Error al subir la foto' });
                      }
                    }} />
                </div>
              </div>
              <h3 style={{ margin: '0 0 4px 0', color: C.textPrimary, fontSize: '1.4rem', fontWeight: '800' }}>Información Personal</h3>
              <p style={{ margin: '0 0 24px 0', color: C.textSecondary, fontSize: '0.95rem' }}>Actualiza tus datos y cómo te ven los demás.</p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setProfileSaving(true); setProfileMsg(null);
                try {
                  await api.updateMe({ nombre: profileData.nombre, telefono: profileData.telefono });
                  setProfileMsg({ type: 'success', text: '¡Perfil actualizado con éxito!' });
                } catch (err) {
                  setProfileMsg({ type: 'error', text: err.message || 'Error al guardar' });
                } finally { setProfileSaving(false); }
              }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary }}>Nombre Completo</label>
                    <input type="text" value={profileData.nombre}
                      onChange={e => setProfileData(p => ({ ...p, nombre: e.target.value }))}
                      className="modal-ps-input" required />
                  </div>
                  <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary }}>Teléfono</label>
                    <input type="tel" value={profileData.telefono}
                      onChange={e => setProfileData(p => ({ ...p, telefono: e.target.value }))}
                      className="modal-ps-input" />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary }}>Correo Electrónico</label>
                  <input type="email" value={user?.email || ''} className="modal-ps-input" disabled style={{ opacity: 0.6 }} />
                </div>
                {profileMsg && (
                  <div style={{ padding: '10px 14px', borderRadius: '10px', background: profileMsg.type === 'success' ? '#d1fae5' : '#fee2e2', color: profileMsg.type === 'success' ? '#065f46' : '#991b1b', fontWeight: '700', fontSize: '0.88rem' }}>
                    {profileMsg.text}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button type="submit" className="btn-primary-ps" style={{ padding: '12px 24px' }} disabled={profileSaving}>
                    {profileSaving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="dashboard-card-ps" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h3 style={{ margin: 0, color: C.textPrimary, fontSize: '1.4rem', fontWeight: '800' }}>Seguridad</h3>
              </div>
              <p style={{ margin: '0 0 24px 0', color: C.textSecondary, fontSize: '0.95rem' }}>Protege tu cuenta con una contraseña segura.</p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setPwdSaving(true); setPwdMsg(null);
                try {
                  await api.changePassword(pwdData);
                  setPwdMsg({ type: 'success', text: 'Contraseña actualizada correctamente' });
                  setPwdData({ contrasenaActual: '', nuevaContrasena: '', confirmarContrasena: '' });
                } catch (err) {
                  setPwdMsg({ type: 'error', text: err.message || 'Error al cambiar contraseña' });
                } finally { setPwdSaving(false); }
              }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary }}>Contraseña Actual</label>
                  <input type="password" required className="modal-ps-input" placeholder="••••••••"
                    value={pwdData.contrasenaActual}
                    onChange={e => setPwdData(p => ({ ...p, contrasenaActual: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary }}>Nueva Contraseña</label>
                    <input type="password" required minLength="8" className="modal-ps-input" placeholder="••••••••"
                      value={pwdData.nuevaContrasena}
                      onChange={e => setPwdData(p => ({ ...p, nuevaContrasena: e.target.value }))} />
                  </div>
                  <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary }}>Confirmar Nueva</label>
                    <input type="password" required minLength="8" className="modal-ps-input" placeholder="••••••••"
                      value={pwdData.confirmarContrasena}
                      onChange={e => setPwdData(p => ({ ...p, confirmarContrasena: e.target.value }))} />
                  </div>
                </div>
                {pwdMsg && (
                  <div style={{ padding: '10px 14px', borderRadius: '10px', background: pwdMsg.type === 'success' ? '#d1fae5' : '#fee2e2', color: pwdMsg.type === 'success' ? '#065f46' : '#991b1b', fontWeight: '700', fontSize: '0.88rem' }}>
                    {pwdMsg.text}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: C.infoBg, padding: '16px', borderRadius: '12px', border: `1px dashed ${C.infoBorder}` }}>
                  <span style={{ fontSize: '0.85rem', color: C.textSecondary, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}><span style={{ color: '#00d084', fontSize: '1.2rem' }}>✓</span> Mínimo 8 caracteres</span>
                  <span style={{ fontSize: '0.85rem', color: C.textSecondary, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}><span style={{ color: '#00d084', fontSize: '1.2rem' }}>✓</span> Al menos un número y un símbolo especial</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button type="submit" className="btn-dark-ps" style={{ padding: '12px 24px' }} disabled={pwdSaving}>
                    {pwdSaving ? 'Actualizando...' : 'Actualizar Contraseña'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>

    {/* ─── MODAL QR ──────────────────────────────────── */}
    {qrModal.show && (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(16px)', animation: 'fadeIn 0.3s ease' }}>
        <div style={{ background: C.cardBg, borderRadius: '28px', padding: '36px', width: '90%', maxWidth: '420px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)', textAlign: 'center' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ margin: '0 0 4px', color: C.textPrimary, fontSize: '1.5rem', fontWeight: '900' }}>Tu Código QR</h2>
              <p style={{ margin: 0, color: C.textSecondary, fontSize: '0.88rem' }}>Muéstraselo al propietario al llegar</p>
            </div>
            <button onClick={() => setQrModal({ show: false, reservationId: null })}
              style={{ background: 'transparent', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: C.textMuted, width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>

          {/* Info de la reserva */}
          <div style={{ background: C.infoBg, borderRadius: '16px', padding: '14px 18px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: C.textSecondary, fontWeight: '600' }}><i className="bi bi-building" /> Cancha</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: C.textPrimary }}>{qrModal.courtName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: C.textSecondary, fontWeight: '600' }}><i className="bi bi-calendar3" /> Fecha</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textPrimary }}>{qrModal.date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: C.textSecondary, fontWeight: '600' }}><i className="bi bi-clock" /> Horario</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textPrimary }}>{qrModal.slot}</span>
            </div>
          </div>

          {/* QR Image */}
          <div style={{ display: 'inline-block', padding: '16px', background: '#fff', borderRadius: '20px', border: `2px solid ${C.cardBorder}`, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
            <img
              src={`${api.getReservationQrUrl(qrModal.reservationId)}?t=${qrModal.timestamp}`}
              alt="QR de reserva"
              style={{ width: '220px', height: '220px', display: 'block', borderRadius: '8px' }}
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div style={{ display: 'none', width: '220px', height: '220px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', color: '#94a3b8' }}>
              <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '2rem', color: '#94a3b8' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>No se pudo cargar el QR</span>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(0,208,132,0.1), rgba(0,208,132,0.05))', border: '1px solid rgba(0,208,132,0.25)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#065f46', fontWeight: '700' }}>
              <i className="bi bi-phone-fill" /> El propietario escaneará este código para confirmar tu asistencia
            </p>
          </div>

          <button onClick={() => setQrModal({ show: false, reservationId: null })}
            className="btn-dark-ps" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
            Cerrar
          </button>
        </div>
      </div>
    )}

    {/* ─── MODAL GLOBAL ──────────────────────────────── */}
    {modal.show && (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease' }}>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
          @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        `}</style>
        <div className="modal-box-ps" style={{ animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)', maxHeight: '90vh', overflowY: 'auto' }}>

          {/* Header — oculto en success */}
          {paymentStage !== 'success' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div>
                <h2 className="modal-title-ps" style={{ fontSize: '1.75rem', letterSpacing: '-0.5px' }}>
                  {modal.action === 'CANCELAR_RESERVA' ? 'Cancelar Reserva' : modal.action === 'PAGO_CULQI' ? 'Pago Seguro' : 'Confirmar Reserva'}
                </h2>
                <p className="modal-sub-ps">
                  {modal.action === 'CANCELAR_RESERVA' ? '¿Estás seguro de que deseas cancelar este partido?' : modal.action === 'PAGO_CULQI' ? 'Ingresa los datos de tu tarjeta.' : `Reserva en ${modal.payload?.name}.`}
                </p>
              </div>
              {paymentStage === 'form' && (
                <button onClick={closeModal} className="modal-close-ps">&times;</button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {modal.action === 'CANCELAR_RESERVA' && (
              <div className="modal-warning-ps" style={{ padding: '20px', borderRadius: '16px' }}>
                <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.6' }}>
                  Se cancelará tu reserva en <strong style={{ color: '#7f1d1d' }}>{modal.payload?.court}</strong>.<br/><br/>
                  Esta acción <span style={{ textDecoration: 'underline' }}>no se puede deshacer</span>.
                </p>
              </div>
            )}

            {modal.action === 'RESERVAR_CANCHA' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: C.infoBg, borderRadius: '16px', border: `1px dashed ${C.infoBorder}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>📍</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '800', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ubicación</div>
                      <div style={{ color: C.textPrimary, fontWeight: '700', fontSize: '0.95rem', marginTop: '2px' }}>{modal.payload?.location || 'Dirección no especificada'}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha</label>
                  <input type="date" name="date" className="modal-ps-input" required value={selectedDate} onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]} />
                </div>
                {selectedDate && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Horario</label>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', fontWeight: '700' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#0f172a', display: 'inline-block' }} />Disponible</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#e2e8f0', display: 'inline-block' }} />Ocupado</span>
                      </div>
                    </div>
                    {loadingSlots ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div key={i} style={{ height: '44px', borderRadius: '10px', background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s infinite' }} />
                        ))}
                      </div>
                    ) : slots.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', background: '#f8fafc', borderRadius: '12px' }}>
                        No hay horarios disponibles
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', maxHeight: '220px', overflowY: 'auto', padding: '4px' }}>
                        {slots.map(s => {
                          const isSelected = selectedSlot === s.hour;
                          const hour = `${String(s.hour).padStart(2,'0')}:00`;
                          return (
                            <button
                              key={s.hour}
                              type="button"
                              disabled={!s.available}
                              onClick={() => s.available && setSelectedSlot(s.hour)}
                              style={{
                                padding: '10px 6px',
                                borderRadius: '10px',
                                border: isSelected ? '2px solid #00d084' : '2px solid transparent',
                                background: isSelected
                                  ? 'linear-gradient(135deg, #0f172a, #1e3a5f)'
                                  : s.available ? '#f1f5f9' : '#f8fafc',
                                color: isSelected ? '#00d084' : s.available ? '#334155' : '#cbd5e1',
                                fontWeight: isSelected ? '800' : '700',
                                fontSize: '0.82rem',
                                cursor: s.available ? 'pointer' : 'not-allowed',
                                transition: 'all 0.15s',
                                textDecoration: !s.available ? 'line-through' : 'none',
                                boxShadow: isSelected ? '0 4px 12px rgba(0,208,132,0.25)' : 'none',
                              }}
                              onMouseOver={e => { if (s.available && !isSelected) e.currentTarget.style.background = '#e2e8f0'; }}
                              onMouseOut={e => { if (s.available && !isSelected) e.currentTarget.style.background = '#f1f5f9'; }}
                            >
                              {hour}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {selectedSlot !== null && (
                      <div style={{ background: 'linear-gradient(135deg, rgba(0,208,132,0.1), rgba(0,208,132,0.05))', border: '1px solid rgba(0,208,132,0.3)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bi bi-clock" style={{ fontSize: '1rem', color: '#065f46' }} />
                        <span style={{ fontWeight: '800', color: '#065f46', fontSize: '0.9rem' }}>
                          {slots.find(s => s.hour === selectedSlot)?.label || `${String(selectedSlot).padStart(2,'0')}:00 - ${String(selectedSlot+1).padStart(2,'0')}:00`}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div style={{ padding: '16px', backgroundColor: C.infoBg, borderRadius: '16px', border: `1px dashed ${C.infoBorder}`, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '600', color: C.textSecondary }}>Total a pagar:</span>
                  <span style={{ fontWeight: '900', color: C.textPrimary, fontSize: '1.1rem' }}>{modal.payload?.price}/hora</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#00d084' }} />
                  <label htmlFor="terms" style={{ fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>
                    Acepto los <span style={{ color: '#3b82f6', textDecoration: 'underline' }}>Términos y Condiciones</span>.
                  </label>
                </div>
              </>
            )}

            {modal.action === 'PAGO_CULQI' && paymentStage === 'form' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Resumen de la reserva */}
                <div style={{ background: C.infoBg, border: `1px dashed ${C.infoBorder}`, borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', color: C.textSecondary, fontWeight: '600' }}>Cancha</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textPrimary }}>{modal.payload?.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', color: C.textSecondary, fontWeight: '600' }}>Fecha</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: C.textPrimary }}>{modal.payload?.selectedDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', color: C.textSecondary, fontWeight: '600' }}>Horario</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: C.textPrimary }}>{modal.payload?.slotLabel}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${C.cardBorder}`, paddingTop: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: C.textPrimary }}>Total</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#00d084' }}>{modal.payload?.price}</span>
                  </div>
                </div>
                {/* Campos de tarjeta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '800', color: C.textSecondary }}>Número de Tarjeta</label>
                  <input name="cardNumber" type="text" className="modal-ps-input" required placeholder="0000 0000 0000 0000" maxLength="19"
                    onInput={e => {
                      const d = e.target.value.replace(/\D/g, '').slice(0, 16);
                      e.target.value = d.replace(/(.{4})/g, '$1 ').trim();
                    }} />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '800', color: C.textSecondary }}>Vencimiento</label>
                    <input name="exp" type="text" className="modal-ps-input" required placeholder="MM/AA" maxLength="5"
                      onInput={e => {
                        let d = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (d.length > 2) d = d.slice(0, 2) + '/' + d.slice(2);
                        e.target.value = d;
                      }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '800', color: C.textSecondary }}>CVC</label>
                    <input name="cvc" type="password" className="modal-ps-input" required placeholder="•••" maxLength="3"
                      onInput={e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3); }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: '700' }}>Pago 100% seguro y encriptado</span>
                </div>
              </div>
            )}

            {/* ── Stage: procesando ── */}
            {modal.action === 'PAGO_CULQI' && paymentStage === 'processing' && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <style>{`
                  @keyframes spin { to { transform: rotate(360deg); } }
                  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
                `}</style>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid #e2e8f0', borderTopColor: '#00d084', animation: 'spin 0.9s linear infinite', margin: '0 auto 24px' }} />
                <h3 style={{ margin: '0 0 8px', color: C.textPrimary, fontWeight: '900', fontSize: '1.3rem' }}>Procesando pago...</h3>
                <p style={{ margin: 0, color: C.textSecondary, fontSize: '0.9rem', animation: 'pulse 1.8s ease-in-out infinite' }}>
                  Por favor espera, estamos verificando tu transacción.
                </p>
              </div>
            )}

            {/* ── Stage: éxito ── */}
            {modal.action === 'PAGO_CULQI' && paymentStage === 'success' && confirmedReservation && (
              <div style={{ textAlign: 'center' }}>
                <style>{`@keyframes popIn { from{transform:scale(0);opacity:0;} to{transform:scale(1);opacity:1;} }`}</style>
                {/* Ícono de éxito */}
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00d084" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 style={{ margin: '0 0 6px', color: C.textPrimary, fontWeight: '900', fontSize: '1.6rem' }}>¡Reserva confirmada!</h2>
                <p style={{ margin: '0 0 24px', color: C.textSecondary, fontSize: '0.95rem' }}>
                  Revisa tu correo — te enviamos los detalles y tu código QR de entrada.
                </p>
                {/* Detalles de la reserva */}
                <div style={{ background: C.infoBg, borderRadius: '14px', padding: '18px', textAlign: 'left', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { icon: 'bi-building',      label: 'Cancha',  value: confirmedReservation.court },
                    { icon: 'bi-calendar3',     label: 'Fecha',   value: confirmedReservation.date },
                    { icon: 'bi-clock',         label: 'Horario', value: confirmedReservation.slot },
                    { icon: 'bi-credit-card-fill', label: 'Pagado', value: confirmedReservation.amount },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.88rem', color: C.textSecondary, fontWeight: '600' }}><i className={`bi ${icon}`} /> {label}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textPrimary }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#d1fae5', borderRadius: '10px', padding: '10px 14px', marginBottom: '8px' }}>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#065f46', fontWeight: '700' }}>
                    <i className="bi bi-envelope-fill" /> Código QR enviado a tu correo — preséntalo al ingresar
                  </p>
                </div>
              </div>
            )}

            {/* Botones — se ocultan mientras procesa o en pantalla de éxito */}
            {paymentStage === 'form' && (
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                <button type="button" onClick={closeModal} className="modal-btn-cancel-ps" style={{ flex: 1, padding: '16px', fontSize: '1.05rem' }}>
                  Cancelar
                </button>
                <button type="submit"
                  disabled={submitting || (modal.action === 'RESERVAR_CANCHA' && (!acceptedTerms || !selectedDate || selectedSlot === null))}
                  className={modal.action === 'CANCELAR_RESERVA' ? 'modal-btn-danger-ps' : 'modal-btn-submit-ps'}
                  style={{ flex: 1, padding: '16px', fontSize: '1.05rem', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                  {modal.action === 'CANCELAR_RESERVA' ? 'Sí, Cancelar' : modal.action === 'PAGO_CULQI' ? 'Confirmar Reserva' : 'Continuar al Pago'}
                </button>
              </div>
            )}

            {/* Pantalla de éxito: solo botón de cerrar */}
            {paymentStage === 'success' && (
              <button type="button" onClick={closeModal} className="btn-dark-ps"
                style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '8px' }}>
                Listo
              </button>
            )}
          </form>
        </div>
      </div>
    )}

    {/* ─── MODAL MAPA ────────────────────────────────── */}
    {mapModal.show && mapModal.cancha && (
      <MapModal cancha={mapModal.cancha} onClose={() => setMapModal({ show: false, cancha: null })} darkMode={darkMode} />
    )}

    {/* ─── TOUR ONBOARDING ───────────────────────────── */}
    <AnimatePresence>
      {showTour && (
        <OnboardingTour
          steps={JUGADOR_TOUR_STEPS}
          onComplete={finishTour}
          onSkip={finishTour}
          onHighlight={setTourHighlight}
          isDark={darkMode}
        />
      )}
    </AnimatePresence>
    </>
  );
};

/* ── Confetti ────────────────────────────────────────── */
const CONFETTI_COLORS = ['#00d084','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4'];
const Confetti = () => {
  const pieces = Array.from({ length: 72 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2.2 + Math.random() * 1.6,
    size: 7 + Math.random() * 7,
    rotate: Math.random() * 360,
    drift: (Math.random() - 0.5) * 120,
  }));
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:99999, overflow:'hidden' }}>
      <style>{`
        @keyframes cfall {
          0%   { transform: translateY(-30px) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) translateX(var(--drift)) rotate(var(--rotate)); opacity: 0; }
        }
      `}</style>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:'absolute', left:`${p.x}%`, top:0,
          width:p.size, height:p.size * 0.55,
          background:p.color, borderRadius:2,
          '--drift':`${p.drift}px`, '--rotate':`${p.rotate + 540}deg`,
          animation:`cfall ${p.duration}s ease-in ${p.delay}s forwards`,
        }} />
      ))}
    </div>
  );
};

/* ── Empty state ─────────────────────────────────────── */
const EmptyState = ({ icon, title, message, darkMode = false, cta }) => (
  <div style={{
    gridColumn: '1 / -1', textAlign: 'center', padding: '64px 32px',
    background: darkMode ? '#0f172a' : '#fff',
    borderRadius: 24,
    border: `1px dashed ${darkMode ? '#1e293b' : '#e2e8f0'}`,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
  }}>
    {/* Illustrated icon ring */}
    <div style={{
      width: 88, height: 88, borderRadius: '50%',
      background: darkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc',
      border: `2px dashed ${darkMode ? '#1e293b' : '#e2e8f0'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '2.6rem', marginBottom: 20,
      boxShadow: darkMode ? '0 0 40px rgba(0,208,132,0.04)' : '0 4px 20px rgba(0,0,0,0.04)',
    }}>
      {icon}
    </div>
    <h3 style={{ margin: '0 0 8px', color: darkMode ? '#f8fafc' : '#0f172a', fontWeight: 800, fontSize: '1.1rem' }}>{title}</h3>
    <p style={{ margin: 0, color: '#94a3b8', maxWidth: 300, marginInline: 'auto', fontSize: '.9rem', lineHeight: 1.6 }}>{message}</p>
    {cta && (
      <button
        onClick={cta.onClick}
        style={{ marginTop: 20, padding: '10px 22px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#00d084,#00b875)', color: '#0f172a', fontWeight: 800, fontSize: '.9rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,208,132,0.25)' }}
      >
        {cta.label}
      </button>
    )}
  </div>
);

/* ── Court card ──────────────────────────────────────── */
const SPORT_COLORS = {
  fútbol: '#00d084', padel: '#3b82f6', pádel: '#3b82f6',
  tenis: '#f59e0b', vóley: '#8b5cf6', voley: '#8b5cf6',
  básquet: '#ef4444', basquet: '#ef4444',
};

const sportColor = (type = '') => {
  const key = type.toLowerCase().split(' ')[0];
  return SPORT_COLORS[key] || '#64748b';
};

/* ── Mini star rating ────────────────────────────────── */
const MiniStars = ({ rating, count }) => {
  if (!rating) return <span style={{ fontSize: '.75rem', color: '#64748b' }}>Sin reseñas</span>;
  const full = Math.floor(rating);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill={i <= full ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span style={{ fontSize: '.75rem', color: '#f59e0b', fontWeight: 700 }}>{rating.toFixed(1)}</span>
      {count > 0 && <span style={{ fontSize: '.72rem', color: '#64748b' }}>({count})</span>}
    </span>
  );
};

const CourtCard = ({ cancha, isFavorito, onToggleFavorito, onReservar, onVerMapa, darkMode = false, compact = false }) => {
  const accent = sportColor(cancha.type);
  const cardBg = darkMode ? '#0f172a' : '#fff';
  const cardBorder = darkMode ? '#1e293b' : '#e2e8f0';
  const textPrimary = darkMode ? '#f8fafc' : '#0f172a';
  const textMuted = '#94a3b8';
  const dividerColor = darkMode ? '#1e293b' : '#f1f5f9';

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareData = {
      title: `${cancha.name} — PlayStop`,
      text: `Reserva ${cancha.type} en ${cancha.name}. Desde ${cancha.price}/hora`,
      url: `${window.location.origin}/reservar/${cancha.id}`,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      navigator.clipboard?.writeText(shareData.url);
      alert('¡Enlace copiado!');
    }
  };

  return (
    <div className="card-hover" style={{
      backgroundColor: cardBg, borderRadius: 20,
      border: `1px solid ${cardBorder}`, overflow: 'hidden',
      transition: 'all .28s ease', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ position: 'relative', height: compact ? 140 : 168 }}>
        <div style={{
          height: '100%',
          backgroundImage: `url(${cancha.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)' }} />
        <span style={{
          position: 'absolute', top: 12, left: 12,
          background: accent, color: '#fff',
          fontSize: '.72rem', fontWeight: 800,
          padding: '4px 10px', borderRadius: 99,
          boxShadow: `0 4px 12px ${accent}55`,
          textTransform: 'uppercase', letterSpacing: '.4px',
        }}>
          {cancha.type}
        </span>
        <div style={{ position:'absolute', top:10, right:12, display:'flex', gap:6 }}>
          {/* Share button */}
          <button
            onClick={handleShare}
            title="Compartir cancha"
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              border: 'none', cursor: 'pointer',
              backgroundColor: 'rgba(255,255,255,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.85rem', transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
          {/* Favorito */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorito(); }}
            title={isFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              border: 'none', cursor: 'pointer',
              backgroundColor: 'rgba(255,255,255,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.15rem', transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <i className={`bi ${isFavorito ? 'bi-heart-fill' : 'bi-heart'}`} style={{ color: isFavorito ? '#ef4444' : '#94a3b8' }} />
          </button>
        </div>
      </div>

      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800, color: textPrimary }}>
          {cancha.name}
        </h4>
        {/* Star rating */}
        <div style={{ marginBottom: 6 }}>
          <MiniStars rating={cancha.averageRating} count={cancha.reviewCount} />
        </div>
        {cancha.location && (
          <p style={{ margin: '0 0 10px', fontSize: '.8rem', color: textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {cancha.location}
          </p>
        )}
        {/* Botón cómo llegar */}
        <button
          onClick={onVerMapa}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'transparent', border: `1px solid ${cardBorder}`,
            borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
            fontSize: '.78rem', fontWeight: 700, color: '#3b82f6',
            marginBottom: '10px', width: 'fit-content', transition: 'all .15s',
          }}
          onMouseOver={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#3b82f6'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = cardBorder; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Cómo llegar
        </button>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: `1px solid ${dividerColor}` }}>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: textPrimary }}>{cancha.price}</span>
            <span style={{ fontSize: '.78rem', color: textMuted, fontWeight: 500 }}>/hora</span>
          </div>
          <button
            onClick={onReservar}
            style={{
              background: accent, color: '#fff', border: 'none',
              padding: '8px 18px', borderRadius: 10,
              fontWeight: 700, fontSize: '.88rem', cursor: 'pointer',
              transition: 'all .18s', boxShadow: `0 4px 12px ${accent}40`,
            }}
            onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseOut={e => e.currentTarget.style.filter = ''}
          >
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Map Modal ───────────────────────────────────────── */
const MapModal = ({ cancha, onClose, darkMode = false }) => {
  const cardBg = darkMode ? '#0f172a' : '#ffffff';
  const textPrimary = darkMode ? '#f8fafc' : '#0f172a';
  const textMuted = darkMode ? '#94a3b8' : '#64748b';
  const infoBg = darkMode ? '#1e293b' : '#f8fafc';
  const border = darkMode ? '#334155' : '#e2e8f0';

  const hasCoords = cancha.lat != null && cancha.lng != null;
  const query = encodeURIComponent(
    hasCoords ? `${cancha.lat},${cancha.lng}` : `${cancha.name} ${cancha.location}`
  );

  const googleMapsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${cancha.lat},${cancha.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${query}`;

  const wazeUrl = hasCoords
    ? `https://waze.com/ul?ll=${cancha.lat},${cancha.lng}&navigate=yes`
    : `https://waze.com/ul?q=${query}`;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ background: cardBg, borderRadius: '24px', width: '90%', maxWidth: '560px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', color: textPrimary, fontSize: '1.3rem', fontWeight: '900' }}>📍 Cómo llegar</h2>
            <p style={{ margin: 0, color: textMuted, fontSize: '0.88rem' }}>{cancha.name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: textMuted, lineHeight: 1, padding: '4px' }}>×</button>
        </div>

        {/* Mapa */}
        <div style={{ position: 'relative', width: '100%', height: '280px', background: '#e2e8f0' }}>
          <iframe
            title="Mapa de la cancha"
            src={hasCoords
              ? `https://www.openstreetmap.org/export/embed.html?bbox=${cancha.lng - 0.008},${cancha.lat - 0.006},${cancha.lng + 0.008},${cancha.lat + 0.006}&layer=mapnik&marker=${cancha.lat},${cancha.lng}`
              : `https://www.openstreetmap.org/export/embed.html?bbox=-77.05,-12.12,-76.97,-12.05&layer=mapnik`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {!hasCoords && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.7)', color: '#fff', gap: '8px' }}>
              <span style={{ fontSize: '2rem' }}>📍</span>
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Coordenadas no disponibles</span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>Usa los botones abajo para buscar en Google Maps</span>
            </div>
          )}
        </div>

        {/* Info dirección */}
        <div style={{ padding: '16px 24px', background: infoBg, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: textPrimary }}>{cancha.location || 'Dirección no especificada'}</p>
            {(cancha.district || cancha.city) && (
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: textMuted }}>{[cancha.district, cancha.city].filter(Boolean).join(', ')}</p>
            )}
          </div>
        </div>

        {/* Botones de navegación */}
        <div style={{ padding: '16px 24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', background: '#4285f4', color: '#fff', fontWeight: '700', fontSize: '0.88rem', textDecoration: 'none', transition: 'opacity .15s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            Google Maps
          </a>
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', background: '#33ccff', color: '#fff', fontWeight: '700', fontSize: '0.88rem', textDecoration: 'none', transition: 'opacity .15s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-13h-2v6l5 3 1-1.73-4-2.27z"/></svg>
            Waze
          </a>
          <button
            onClick={onClose}
            style={{ flex: 1, minWidth: '100px', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer', transition: 'all .15s' }}
            onMouseOver={e => { e.currentTarget.style.background = infoBg; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default JugadorDashboard;
