import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { DashboardLayout, SkeletonTable } from './DashboardLayout.jsx';
import { api } from '../../services/api.js';
import { useOnboarding } from '../../hooks/useOnboarding.js';
import OnboardingTour from '../onboarding/OnboardingTour.jsx';
import ReservationChat from '../chat/ReservationChat.jsx';

import Confetti from './shared/Confetti.jsx';
import MapModal from './shared/MapModal.jsx';
import ErrorBoundary from './shared/ErrorBoundary.jsx';

import InicioTab from './tabs/InicioTab.jsx';
import BuscarCanchasTab from './tabs/BuscarCanchasTab.jsx';
import ReservasTab from './tabs/ReservasTab.jsx';
import LogrosTab from './tabs/LogrosTab.jsx';
import AmigosTab from './tabs/AmigosTab.jsx';
import ArmarEquipoTab from './tabs/ArmarEquipoTab.jsx';
import FavoritasTab from './tabs/FavoritasTab.jsx';
import ReferidosTab from './tabs/ReferidosTab.jsx';
import PerfilTab from './tabs/PerfilTab.jsx';
import EstadisticasTab from './tabs/EstadisticasTab.jsx';

// ── Tour steps ────────────────────────────────────────────────────────────────
const JUGADOR_TOUR_STEPS = [
  { icon: 'bi-emoji-smile-fill', gradient: 'linear-gradient(135deg,#667eea,#764ba2)', shadowColor: 'rgba(102,126,234,0.4)', title: '¡Bienvenido a PlayStop!', description: 'Eres parte de la comunidad deportiva más grande del Perú. En menos de un minuto te mostramos todo lo que puedes hacer.', highlight: null },
  { icon: 'bi-search', gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', shadowColor: 'rgba(59,130,246,0.4)', title: 'Buscar Canchas', description: 'Encuentra canchas cerca de ti filtrando por deporte, ciudad y precio. Fútbol, tenis, pádel y más.', highlight: 'Buscar Canchas', tip: 'Haz clic en "Ver en mapa" para ver la ubicación exacta antes de reservar.' },
  { icon: 'bi-calendar2-check-fill', gradient: 'linear-gradient(135deg,#2563eb,#1d4ed8)', shadowColor: 'rgba(37, 99, 235, 0.4)', title: 'Mis Reservas', description: 'Consulta todas tus reservas activas. Desde aquí accedes al código QR de entrada y puedes cancelar con anticipación.', highlight: 'Mis Reservas', tip: 'Cancelas sin costo si lo haces con más de 24 horas de anticipación.' },
  { icon: 'bi-trophy-fill', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', shadowColor: 'rgba(245,158,11,0.4)', title: 'Logros y Puntos', description: 'Cada partido que juegas te da puntos PlayStop. Sube de nivel y desbloquea recompensas exclusivas.', highlight: 'Logros' },
  { icon: 'bi-people-fill', gradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', shadowColor: 'rgba(139,92,246,0.4)', title: 'Mis Amigos', description: 'Conecta con tus compañeros de equipo buscándolos por email. Organiza partidos y arma tu once titular.', highlight: 'Mis Amigos' },
  { icon: 'bi-rocket-takeoff-fill', gradient: 'linear-gradient(135deg,#2563eb,#3b82f6)', shadowColor: 'rgba(37, 99, 235, 0.4)', title: '¡Todo listo para jugar!', description: 'Ya conoces PlayStop. Busca tu primera cancha y reserva en menos de 2 minutos. ¡Nos vemos en la cancha!', highlight: null },
];

// ── Data helpers ──────────────────────────────────────────────────────────────
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80';

const STATUS_MAP = {
  CONFIRMED: { label: 'Confirmada', color: '#2563eb', bg: '#d1fae5' },
  PENDING:   { label: 'Pendiente',  color: '#f59e0b', bg: '#fef3c7' },
  CANCELLED: { label: 'Cancelada',  color: '#ef4444', bg: '#fee2e2' },
  ATTENDED:  { label: 'Asistió',    color: '#8b5cf6', bg: '#ede9fe' },
  COMPLETED: { label: 'Completada', color: '#3b82f6', bg: '#eff6ff' },
};

const mapCourt = (c) => ({
  id: c.id, slug: c.slug || '',
  img: c.imageUrl || DEFAULT_IMG,
  name: c.name, type: c.sportType,
  price: `S/ ${c.pricePerHour}`, priceNum: parseFloat(c.pricePerHour) || 0,
  location: c.address || '', city: c.city || '', district: c.district || '',
  lat: c.latitude ?? null, lng: c.longitude ?? null,
  averageRating: c.averageRating ?? null, reviewCount: c.reviewCount ?? 0,
});

const mapReservation = (r) => {
  const s = STATUS_MAP[r.status] || { label: r.status, color: '#64748b', bg: '#f1f5f9' };
  return {
    id: r.id, courtId: r.courtId || null,
    court: r.courtName,
    date: `${r.date} • ${r.slotLabel || `${r.slotHour}:00`}`,
    rawDate: r.date,
    slotLabel: r.slotLabel || `${r.slotHour}:00`,
    slotHour: r.slotHour ?? null,
    status: s.label, color: s.color, bg: s.bg, apiStatus: r.status,
    courtAddress: r.courtAddress || '',
    courtLat: r.courtLat ?? null, courtLng: r.courtLng ?? null,
  };
};

const loadFavoritos = () => {
  try { return JSON.parse(localStorage.getItem('playspot_favoritos') || '[]'); }
  catch { return []; }
};
const saveFavoritos = (ids) => localStorage.setItem('playspot_favoritos', JSON.stringify(ids));

// ── Star rating (review modal) ────────────────────────────────────────────────
const StarRating = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: 6 }}>
    {[1,2,3,4,5].map(i => (
      <button key={i} type="button" onClick={() => onChange(i)}
        aria-label={`${i} estrella${i > 1 ? 's' : ''}`}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', transition: 'transform .1s' }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg width="32" height="32" viewBox="0 0 24 24"
          fill={i <= value ? '#f59e0b' : 'none'}
          stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </button>
    ))}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const JugadorDashboard = ({ user, onLogout, darkMode = false, toggleTheme }) => {
  const navigate = useNavigate();
  const C = {
    textPrimary:   darkMode ? '#f8fafc' : '#0f172a',
    textSecondary: darkMode ? '#94a3b8' : '#475569',
    textMuted:     darkMode ? '#64748b' : '#94a3b8',
    cardBg:        darkMode ? '#0f172a' : '#ffffff',
    cardBorder:    darkMode ? '#1e293b' : '#e2e8f0',
    inputBg:       darkMode ? '#020617' : '#f8fafc',
    inputBorder:   darkMode ? '#1e293b' : '#e2e8f0',
    infoBg:        darkMode ? '#1e293b' : '#f8fafc',
    infoBorder:    darkMode ? '#334155' : '#cbd5e1',
  };

  const [activeTab, setActiveTab] = useState('Inicio');
  const { showTour, finishTour, retakeTour, tourHighlight, setTourHighlight } = useOnboarding('jugador');
  const [chatFromNotif, setChatFromNotif] = useState(null);
  const [unreadChats, setUnreadChats] = useState(new Set());

  // ── Shared data state ────────────────────────────────────────────────────────
  const [canchas, setCanchas] = useState([]);
  const [loadingCanchas, setLoadingCanchas] = useState(true);
  const [errorCanchas, setErrorCanchas] = useState(null);

  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);

  const [gamification, setGamification] = useState(null);
  const [loadingGami, setLoadingGami] = useState(true);

  const [favoritosIds, setFavoritosIds] = useState(loadFavoritos);
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem('playspot-avatar') || '');
  const [showConfetti, setShowConfetti] = useState(false);

  // ── Modal state ──────────────────────────────────────────────────────────────
  const [modal, setModal] = useState({ show: false, action: null, payload: null });
  const [qrModal, setQrModal] = useState({ show: false, reservationId: null, courtName: '', date: '', slot: '' });
  const [mapModal, setMapModal] = useState({ show: false, cancha: null });

  // ── Review modal state ────────────────────────────────────────────────────────
  const [reviewModal, setReviewModal] = useState({ show: false, reservationId: null, courtId: null, courtName: '' });
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState(null);
  const [reviewedIds, setReviewedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('playspot_reviewed') || '[]')); }
    catch { return new Set(); }
  });

  // ── Payment flow state ────────────────────────────────────────────────────────
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentStage, setPaymentStage] = useState('form');
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  // ── Data fetching ─────────────────────────────────────────────────────────────
  useEffect(() => {
    api.getAllCourts()
      .then(data => { setCanchas(Array.isArray(data) ? data.map(mapCourt) : []); setErrorCanchas(null); })
      .catch(err => { setErrorCanchas(err.message || 'Error de conexión con el servidor'); setCanchas([]); })
      .finally(() => setLoadingCanchas(false));
  }, []);

  useEffect(() => {
    api.getMyReservations()
      .then(data => setReservas(Array.isArray(data) ? data.map(mapReservation) : []))
      .catch(() => setReservas([]))
      .finally(() => setLoadingReservas(false));
  }, []);

  useEffect(() => {
    api.getGamificationProfile()
      .then(data => setGamification(data))
      .catch(() => setGamification(null))
      .finally(() => setLoadingGami(false));
  }, []);

  // ── Favoritos ─────────────────────────────────────────────────────────────────
  const toggleFavorito = useCallback((canchaId) => {
    setFavoritosIds(prev => {
      const next = prev.includes(canchaId) ? prev.filter(id => id !== canchaId) : [...prev, canchaId];
      saveFavoritos(next);
      return next;
    });
  }, []);

  const canchasFavoritas = canchas.filter(c => favoritosIds.includes(c.id));

  // ── Modal helpers ─────────────────────────────────────────────────────────────
  const openModal = (action, payload = null) => setModal({ show: true, action, payload });
  const closeModal = () => {
    setModal({ show: false, action: null, payload: null });
    setAcceptedTerms(false);
    setSelectedDate('');
    setSelectedSlot(null);
    setSlots([]);
    setPaymentStage('form');
    setConfirmedReservation(null);
  };

  const openReview = (row) => {
    setReviewRating(0);
    setReviewComment('');
    setReviewMsg(null);
    setReviewModal({ show: true, reservationId: row.id, courtId: row.courtId, courtName: row.court });
  };

  const submitReview = async () => {
    if (reviewRating === 0) return;
    setReviewSubmitting(true);
    try {
      await api.createReview({ courtId: reviewModal.courtId, rating: reviewRating, comment: reviewComment });
      const newSet = new Set([...reviewedIds, reviewModal.reservationId]);
      setReviewedIds(newSet);
      localStorage.setItem('playspot_reviewed', JSON.stringify([...newSet]));
      setReviewMsg({ type: 'success', text: '¡Reseña enviada! Gracias por tu opinión.' });
      setTimeout(() => setReviewModal({ show: false, reservationId: null, courtId: null, courtName: '' }), 1800);
    } catch (err) {
      setReviewMsg({ type: 'error', text: err.message || 'Error al enviar la reseña' });
    } finally {
      setReviewSubmitting(false);
    }
  };

  // ── Slot / payment handlers ───────────────────────────────────────────────────
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
      } catch { setSlots([]); }
      finally { setLoadingSlots(false); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (modal.action === 'RESERVAR_CANCHA') {
      if (!selectedDate || selectedSlot === null) { alert('Por favor selecciona fecha y horario.'); return; }
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
        await new Promise(r => setTimeout(r, 2000));
        const newRes = await api.createReservation({ courtId: modal.payload.id, date: modal.payload.selectedDate, slotHour: modal.payload.selectedSlot });
        setReservas(prev => [mapReservation(newRes), ...prev]);
        setConfirmedReservation({ id: newRes.id, court: modal.payload.name, date: modal.payload.selectedDate, slot: modal.payload.slotLabel, amount: modal.payload.price });
        setPaymentStage('success');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    } catch (err) {
      setPaymentStage('form');
      alert(err.message || 'Ocurrió un error. Intenta de nuevo.');
    } finally { setSubmitting(false); }
  };

  // ── Cancellation fee helper ───────────────────────────────────────────────────
  const getCancelInfo = (payload) => {
    if (!payload?.rawDate || payload?.slotHour == null) return null;
    const dt = new Date(`${payload.rawDate}T${String(payload.slotHour).padStart(2,'0')}:00:00`);
    const hours = (dt - Date.now()) / (1000 * 60 * 60);
    return { hours: Math.max(0, Math.round(hours)), free: hours > 24 };
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <DashboardLayout
        user={user} onLogout={onLogout} darkMode={darkMode} toggleTheme={toggleTheme}
        title={activeTab === 'Inicio' ? 'Mi Resumen Deportivo' : activeTab}
        activeTab={activeTab} onTabChange={setActiveTab}
        tourHighlight={tourHighlight} onRestartTour={retakeTour}
        avatarUrl={avatarUrl}
        onOpenChat={({ reservationId, courtName }) => {
          setUnreadChats(prev => { const next = new Set(prev); next.delete(reservationId.toString()); return next; });
          setChatFromNotif({ reservationId, reservationInfo: { court: courtName, date: '', slot: '' } });
        }}
        onChatNotif={({ reservationId }) =>
          setUnreadChats(prev => new Set([...prev, reservationId.toString()]))
        }
        menuItems={[
          { icon: 'bi-house-fill',           label: 'Inicio' },
          { icon: 'bi-search',               label: 'Buscar Canchas' },
          { icon: 'bi-calendar2-check-fill', label: 'Mis Reservas' },
          { icon: 'bi-bar-chart-fill',       label: 'Estadísticas' },
          { icon: 'bi-trophy-fill',          label: 'Logros' },
          { icon: 'bi-people-fill',          label: 'Mis Amigos' },
          { icon: 'bi-diagram-3-fill',       label: 'Armar Equipo' },
          { icon: 'bi-heart-fill',           label: 'Canchas Favoritas' },
          { icon: 'bi-gift-fill',            label: 'Referidos' },
          { icon: 'bi-person-circle',        label: 'Mi Perfil' },
        ]}>

        <ErrorBoundary C={C}>

        {/* ── Banner de cuenta bloqueada ──────────────────────────────────── */}
        {user?.bannedFromReservations && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.08))',
            border: '1.5px solid rgba(239,68,68,0.4)',
            borderRadius: '16px',
            padding: '18px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
          }}>
            <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>⛔</span>
            <div>
              <p style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '1.05rem', color: '#ef4444' }}>
                Cuenta bloqueada
              </p>
              <p style={{ margin: '0 0 10px', color: C.textSecondary, fontSize: '0.9rem', lineHeight: 1.55 }}>
                Tu cuenta está bloqueada y no puedes realizar nuevas reservas. Si crees que es un
                error, contacta a soporte.
              </p>
              <a href="mailto:soporte@playstop.pe"
                style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'underline' }}>
                soporte@playstop.pe
              </a>
            </div>
          </div>
        )}

        {activeTab === 'Inicio' && (
          <InicioTab canchas={canchas} loadingCanchas={loadingCanchas} reservas={reservas} gamification={gamification} loadingGami={loadingGami} favoritosIds={favoritosIds} toggleFavorito={toggleFavorito} canchasFavoritas={canchasFavoritas} setActiveTab={setActiveTab} setMapModal={setMapModal} navigate={navigate} darkMode={darkMode} C={C} />
        )}
        {activeTab === 'Buscar Canchas' && (
          <BuscarCanchasTab canchas={canchas} loadingCanchas={loadingCanchas} errorCanchas={errorCanchas} favoritosIds={favoritosIds} toggleFavorito={toggleFavorito} setMapModal={setMapModal} navigate={navigate} darkMode={darkMode} C={C} />
        )}
        {activeTab === 'Mis Reservas' && (
          <ReservasTab reservas={reservas} loadingReservas={loadingReservas} openModal={openModal} openReview={openReview} reviewedIds={reviewedIds} setQrModal={setQrModal} setMapModal={setMapModal} setActiveTab={setActiveTab} darkMode={darkMode} C={C} currentUser={user} unreadChats={unreadChats} onChatOpen={reservationId => setUnreadChats(prev => { const next = new Set(prev); next.delete(reservationId.toString()); return next; })} />
        )}
        {activeTab === 'Estadísticas' && (
          <EstadisticasTab reservas={reservas} gamification={gamification} loadingReservas={loadingReservas} darkMode={darkMode} C={C} />
        )}
        {activeTab === 'Logros' && (
          <LogrosTab gamification={gamification} loadingGami={loadingGami} darkMode={darkMode} C={C} />
        )}
        {activeTab === 'Mis Amigos' && (
          <AmigosTab darkMode={darkMode} C={C} />
        )}
        {activeTab === 'Armar Equipo' && (
          <ArmarEquipoTab user={user} darkMode={darkMode} C={C} />
        )}
        {activeTab === 'Canchas Favoritas' && (
          <FavoritasTab canchasFavoritas={canchasFavoritas} loadingCanchas={loadingCanchas} toggleFavorito={toggleFavorito} setActiveTab={setActiveTab} setMapModal={setMapModal} navigate={navigate} darkMode={darkMode} C={C} />
        )}
        {activeTab === 'Referidos' && <ReferidosTab user={user} />}
        {activeTab === 'Mi Perfil' && (
          <PerfilTab user={user} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} darkMode={darkMode} C={C} />
        )}
        </ErrorBoundary>
      </DashboardLayout>

      {/* ── QR Modal ─────────────────────────────────────────────────────────── */}
      {qrModal.show && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(16px)', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ background: C.cardBg, borderRadius: '28px', padding: 'clamp(20px, 6vw, 36px)', width: '90%', maxWidth: '420px', boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ textAlign: 'left' }}>
                <h2 style={{ margin: '0 0 4px', color: C.textPrimary, fontSize: '1.5rem', fontWeight: '900' }}>Tu Código QR</h2>
                <p style={{ margin: 0, color: C.textSecondary, fontSize: '0.88rem' }}>Muéstraselo al propietario al llegar</p>
              </div>
              <button onClick={() => setQrModal({ show: false, reservationId: null })} aria-label="Cerrar QR"
                style={{ background: 'transparent', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: C.textMuted, width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <div style={{ background: C.infoBg, borderRadius: '16px', padding: '14px 18px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
              {[
                { icon: 'bi-building', label: 'Cancha',  value: qrModal.courtName },
                { icon: 'bi-calendar3', label: 'Fecha',  value: qrModal.date },
                { icon: 'bi-clock',     label: 'Horario', value: qrModal.slot },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: C.textSecondary, fontWeight: '600' }}><i className={`bi ${icon}`} /> {label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: C.textPrimary }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ maxWidth: '252px', margin: '0 auto 20px', padding: '16px', boxSizing: 'border-box', background: '#fff', borderRadius: '20px', border: `2px solid ${C.cardBorder}`, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
              <img src={`${api.getReservationQrUrl(qrModal.reservationId)}?t=${qrModal.timestamp}`} alt="QR de reserva"
                style={{ width: '100%', maxWidth: '220px', height: 'auto', aspectRatio: '1 / 1', display: 'block', margin: '0 auto', borderRadius: '8px' }}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              <div style={{ display: 'none', width: '100%', maxWidth: '220px', aspectRatio: '1 / 1', margin: '0 auto', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', color: '#94a3b8' }}>
                <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '2rem' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>No se pudo cargar el QR</span>
              </div>
            </div>
            <div style={{ background: 'linear-gradient(135deg,rgba(37, 99, 235, 0.1),rgba(37, 99, 235, 0.05))', border: '1px solid rgba(37, 99, 235, 0.25)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#1d4ed8', fontWeight: '700' }}>
                <i className="bi bi-phone-fill" /> El propietario escaneará este código para confirmar tu asistencia
              </p>
            </div>
            <button onClick={() => setQrModal({ show: false, reservationId: null })} className="btn-dark-ps" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>Cerrar</button>
          </div>
        </div>
      )}

      {/* ── Review Modal ──────────────────────────────────────────────────────── */}
      {reviewModal.show && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease' }}>
          <div className="modal-box-ps" style={{ maxWidth: 440, animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 className="modal-title-ps">Dejar reseña</h2>
                <p className="modal-sub-ps">{reviewModal.courtName}</p>
              </div>
              <button onClick={() => setReviewModal({ show: false, reservationId: null, courtId: null, courtName: '' })} className="modal-close-ps" aria-label="Cerrar">&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <p style={{ margin: '0 0 10px', fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary }}>¿Cómo fue tu experiencia?</p>
                <StarRating value={reviewRating} onChange={setReviewRating} />
                {reviewRating > 0 && (
                  <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: ['','#ef4444','#f59e0b','#f59e0b','#2563eb','#2563eb'][reviewRating], fontWeight: 700 }}>
                    {['','Muy malo','Regular','Bueno','Muy bueno','Excelente'][reviewRating]}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary }}>Comentario (opcional)</label>
                <textarea
                  value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                  placeholder="Cuéntanos sobre la cancha, las instalaciones, la atención..."
                  rows={3} maxLength={500}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${C.cardBorder}`, background: C.inputBg, color: C.textPrimary, fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '0.75rem', color: C.textMuted, textAlign: 'right' }}>{reviewComment.length}/500</span>
              </div>

              {reviewMsg && (
                <div style={{ padding: '12px 16px', borderRadius: 12, background: reviewMsg.type === 'success' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(239,68,68,0.1)', border: `1px solid ${reviewMsg.type === 'success' ? 'rgba(37, 99, 235, 0.35)' : 'rgba(239,68,68,0.3)'}`, color: reviewMsg.type === 'success' ? '#2563eb' : '#ef4444', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className={`bi ${reviewMsg.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`} />
                  {reviewMsg.text}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setReviewModal({ show: false, reservationId: null, courtId: null, courtName: '' })} className="modal-btn-cancel-ps" style={{ flex: 1, padding: '14px' }}>Cancelar</button>
                <button type="button" onClick={submitReview} disabled={reviewRating === 0 || reviewSubmitting}
                  className="modal-btn-submit-ps"
                  style={{ flex: 1, padding: '14px', opacity: reviewRating === 0 ? 0.5 : 1, cursor: reviewRating === 0 ? 'not-allowed' : 'pointer' }}>
                  {reviewSubmitting ? 'Enviando...' : 'Publicar reseña'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Cancel / Payment Modal ────────────────────────────────────────────── */}
      {modal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: 'rgba(15,23,42,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease' }}>
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
            @keyframes popIn { from{transform:scale(0);opacity:0;} to{transform:scale(1);opacity:1;} }
          `}</style>
          <div className="modal-box-ps" style={{ animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)', maxHeight: '90vh', overflowY: 'auto' }}>
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
                {paymentStage === 'form' && <button onClick={closeModal} className="modal-close-ps">&times;</button>}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {modal.action === 'CANCELAR_RESERVA' && (() => {
                const info = getCancelInfo(modal.payload);
                return (
                  <div className="modal-warning-ps" style={{ padding: '20px', borderRadius: '16px' }}>
                    <p style={{ margin: '0 0 12px', fontSize: '1.05rem', lineHeight: '1.6' }}>
                      Se cancelará tu reserva en <strong style={{ color: '#7f1d1d' }}>{modal.payload?.court}</strong>.
                    </p>
                    {info && (
                      <div style={{ padding: '10px 14px', borderRadius: 10, background: info.free ? 'rgba(37, 99, 235, 0.12)' : 'rgba(245,158,11,0.12)', border: `1px solid ${info.free ? 'rgba(37, 99, 235, 0.3)' : 'rgba(245,158,11,0.3)'}`, fontSize: '0.88rem', fontWeight: 700, color: info.free ? '#1d4ed8' : '#92400e', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className={`bi ${info.free ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} />
                        {info.free
                          ? `Cancelas gratis — faltan ${info.hours} horas para tu reserva`
                          : `Se aplicará cargo del 50% — faltan solo ${info.hours} horas para tu reserva`}
                      </div>
                    )}
                    <p style={{ margin: '12px 0 0', fontSize: '0.85rem', color: '#7f1d1d', fontWeight: 600 }}>Esta acción no se puede deshacer.</p>
                  </div>
                );
              })()}

              {modal.action === 'RESERVAR_CANCHA' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: C.infoBg, borderRadius: '16px', border: `1px dashed ${C.infoBorder}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <i className="bi bi-geo-alt-fill" style={{ fontSize: '1.2rem', flexShrink: 0, color: '#64748b' }} />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ubicación</div>
                        <div style={{ color: C.textPrimary, fontWeight: '700', fontSize: '0.95rem', marginTop: '2px' }}>{modal.payload?.location || 'Dirección no especificada'}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha</label>
                    <input type="date" name="date" className="modal-ps-input" required value={selectedDate} onChange={handleDateChange} min={new Date().toISOString().split('T')[0]} />
                  </div>
                  {selectedDate && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Horario</label>
                      {loadingSlots ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                          {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ height: '44px', borderRadius: '10px', background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s infinite' }} />)}
                        </div>
                      ) : slots.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', background: '#f8fafc', borderRadius: '12px' }}>No hay horarios disponibles</div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', maxHeight: '220px', overflowY: 'auto', padding: '4px' }}>
                          {slots.map(s => {
                            const isSelected = selectedSlot === s.hour;
                            return (
                              <button key={s.hour} type="button" disabled={!s.available} onClick={() => s.available && setSelectedSlot(s.hour)}
                                style={{ padding: '10px 6px', borderRadius: '10px', border: isSelected ? '2px solid #2563eb' : '2px solid transparent', background: isSelected ? 'linear-gradient(135deg,#0f172a,#1e3a5f)' : s.available ? '#f1f5f9' : '#f8fafc', color: isSelected ? '#2563eb' : s.available ? '#334155' : '#cbd5e1', fontWeight: isSelected ? '800' : '700', fontSize: '0.82rem', cursor: s.available ? 'pointer' : 'not-allowed', transition: 'all 0.15s', textDecoration: !s.available ? 'line-through' : 'none', boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none' }}>
                                {`${String(s.hour).padStart(2,'0')}:00`}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ padding: '16px', backgroundColor: C.infoBg, borderRadius: '16px', border: `1px dashed ${C.infoBorder}`, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: C.textSecondary }}>Total a pagar:</span>
                    <span style={{ fontWeight: '900', color: C.textPrimary, fontSize: '1.1rem' }}>{modal.payload?.price}/hora</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2563eb' }} />
                    <label htmlFor="terms" style={{ fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>
                      Acepto los <span style={{ color: '#3b82f6', textDecoration: 'underline' }}>Términos y Condiciones</span>.
                    </label>
                  </div>
                </>
              )}

              {modal.action === 'PAGO_CULQI' && paymentStage === 'form' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: C.infoBg, border: `1px dashed ${C.infoBorder}`, borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[
                      { label: 'Cancha',  value: modal.payload?.name },
                      { label: 'Fecha',   value: modal.payload?.selectedDate },
                      { label: 'Horario', value: modal.payload?.slotLabel },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', color: C.textSecondary, fontWeight: '600' }}>{label}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textPrimary }}>{value}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${C.cardBorder}`, paddingTop: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '800', color: C.textPrimary }}>Total</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#2563eb' }}>{modal.payload?.price}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '800', color: C.textSecondary }}>Número de Tarjeta</label>
                    <input name="cardNumber" type="text" className="modal-ps-input" required placeholder="0000 0000 0000 0000" maxLength="19"
                      onInput={e => { const d = e.target.value.replace(/\D/g,'').slice(0,16); e.target.value = d.replace(/(.{4})/g,'$1 ').trim(); }} />
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '800', color: C.textSecondary }}>Vencimiento</label>
                      <input name="exp" type="text" className="modal-ps-input" required placeholder="MM/AA" maxLength="5"
                        onInput={e => { let d = e.target.value.replace(/\D/g,'').slice(0,4); if (d.length > 2) d = d.slice(0,2) + '/' + d.slice(2); e.target.value = d; }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '800', color: C.textSecondary }}>CVC</label>
                      <input name="cvc" type="password" className="modal-ps-input" required placeholder="•••" maxLength="3"
                        onInput={e => { e.target.value = e.target.value.replace(/\D/g,'').slice(0,3); }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: '700' }}>Pago 100% seguro y encriptado</span>
                  </div>
                </div>
              )}

              {modal.action === 'PAGO_CULQI' && paymentStage === 'processing' && (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid #e2e8f0', borderTopColor: '#2563eb', animation: 'spin 0.9s linear infinite', margin: '0 auto 24px' }} />
                  <h3 style={{ margin: '0 0 8px', color: C.textPrimary, fontWeight: '900', fontSize: '1.3rem' }}>Procesando pago...</h3>
                  <p style={{ margin: 0, color: C.textSecondary, fontSize: '0.9rem', animation: 'pulse 1.8s ease-in-out infinite' }}>Por favor espera, estamos verificando tu transacción.</p>
                </div>
              )}

              {modal.action === 'PAGO_CULQI' && paymentStage === 'success' && confirmedReservation && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h2 style={{ margin: '0 0 6px', color: C.textPrimary, fontWeight: '900', fontSize: '1.6rem' }}>¡Reserva confirmada!</h2>
                  <p style={{ margin: '0 0 24px', color: C.textSecondary, fontSize: '0.95rem' }}>Revisa tu correo — te enviamos los detalles y tu código QR de entrada.</p>
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
                </div>
              )}

              {paymentStage === 'form' && (
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                  <button type="button" onClick={closeModal} className="modal-btn-cancel-ps" style={{ flex: 1, padding: '16px', fontSize: '1.05rem' }}>Cancelar</button>
                  <button type="submit"
                    disabled={submitting || (modal.action === 'RESERVAR_CANCHA' && (!acceptedTerms || !selectedDate || selectedSlot === null))}
                    className={modal.action === 'CANCELAR_RESERVA' ? 'modal-btn-danger-ps' : 'modal-btn-submit-ps'}
                    style={{ flex: 1, padding: '16px', fontSize: '1.05rem', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                    {modal.action === 'CANCELAR_RESERVA' ? 'Sí, Cancelar' : modal.action === 'PAGO_CULQI' ? 'Confirmar Reserva' : 'Continuar al Pago'}
                  </button>
                </div>
              )}
              {paymentStage === 'success' && (
                <button type="button" onClick={closeModal} className="btn-dark-ps" style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '8px' }}>Listo</button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ── Map Modal ─────────────────────────────────────────────────────────── */}
      {mapModal.show && mapModal.cancha && (
        <MapModal cancha={mapModal.cancha} onClose={() => setMapModal({ show: false, cancha: null })} darkMode={darkMode} />
      )}

      {/* ── Tour ──────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showTour && (
          <OnboardingTour
            steps={JUGADOR_TOUR_STEPS} onComplete={finishTour} onSkip={finishTour}
            onHighlight={setTourHighlight} isDark={darkMode}
          />
        )}
      </AnimatePresence>

      {/* ── Chat abierto desde notificación ───────────────────────────────────── */}
      {chatFromNotif && (
        <ReservationChat
          reservationId={chatFromNotif.reservationId}
          reservationInfo={chatFromNotif.reservationInfo}
          currentUser={user}
          onClose={() => setChatFromNotif(null)}
          darkMode={darkMode}
        />
      )}
    </>
  );
};

export default JugadorDashboard;
