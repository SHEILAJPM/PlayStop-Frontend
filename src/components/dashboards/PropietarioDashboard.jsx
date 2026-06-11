
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DashboardLayout, MetricCard, SkeletonCard, SkeletonTable, SkeletonCourtGrid } from './DashboardLayout.jsx';
// bootstrap imported globally in main.jsx
import CalendarioCancha from './CalendarioCancha.jsx';
import { api } from '../../services/api.js';
import { useOnboarding } from '../../hooks/useOnboarding.js';
import OnboardingTour from '../onboarding/OnboardingTour.jsx';

const PROPIETARIO_TOUR_STEPS = [
  {
    icon: 'bi-star-fill',
    gradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
    shadowColor: 'rgba(245,158,11,0.4)',
    title: '¡Bienvenido, Propietario!',
    description: 'Desde aquí gestionas todo tu complejo deportivo: canchas, reservas, ingresos y verificación de asistencia.',
    highlight: null,
  },
  {
    icon: 'bi-building',
    gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
    shadowColor: 'rgba(59,130,246,0.4)',
    title: 'Gestiona tus Canchas',
    description: 'Agrega nuevas canchas, sube fotos, establece el precio por hora y actívalas o desactívalas cuando quieras.',
    highlight: 'Mis Canchas',
    tip: 'Canchas con fotos reciben hasta 3× más reservas.',
  },
  {
    icon: 'bi-calendar3',
    gradient: 'linear-gradient(135deg,#00d084,#00b875)',
    shadowColor: 'rgba(0,208,132,0.4)',
    title: 'Calendario de Reservas',
    description: 'Visualiza todas las reservas en un calendario claro. Filtra por cancha, fecha y estado. Sin sorpresas.',
    highlight: 'Calendario de Reservas',
  },
  {
    icon: 'bi-phone-fill',
    gradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
    shadowColor: 'rgba(139,92,246,0.4)',
    title: 'Verificar Asistencia con QR',
    description: 'Cuando llegue un jugador, escanea su código QR desde esta sección. Confirmación instantánea sin papel.',
    highlight: 'Escanear QR',
    tip: 'Funciona desde el celular. Solo apunta la cámara al QR del jugador.',
  },
  {
    icon: 'bi-cash-coin',
    gradient: 'linear-gradient(135deg,#00d084,#065f46)',
    shadowColor: 'rgba(0,208,132,0.35)',
    title: 'Control de Finanzas',
    description: 'Sigue tus ingresos en tiempo real, analiza el rendimiento de cada cancha y exporta reportes.',
    highlight: 'Finanzas',
  },
  {
    icon: 'bi-check-circle-fill',
    gradient: 'linear-gradient(135deg,#00d084,#3b82f6)',
    shadowColor: 'rgba(0,208,132,0.4)',
    title: '¡Tu complejo está listo!',
    description: 'Empieza agregando tu primera cancha en "Mis Canchas" para que los jugadores puedan encontrarla y reservarla.',
    highlight: null,
  },
];

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80';

const mapOwnerCourt = (c) => ({
  id: c.id,
  img: c.imageUrl || DEFAULT_IMG,
  name: c.name,
  type: c.sportType,
  price: `S/ ${c.pricePerHour}`,
  pricePerHour: c.pricePerHour,
  status: c.active ? 'Operativa' : 'Inactiva',
  color: c.active ? '#00d084' : '#f59e0b',
  location: c.address || '',
  sportType: c.sportType,
  address: c.address,
  imageUrl: c.imageUrl,
  city: c.city || '',
  district: c.district || '',
});

const mapOwnerReservation = (r) => {
  const isCancelled = r.status === 'CANCELLED';
  const isAttended  = r.status === 'ATTENDED';
  // PENDING y CONFIRMED se tratan como Pagado (pago simulado siempre aprobado)
  const isActive    = r.status === 'PENDING' || r.status === 'CONFIRMED';

  const status = isCancelled ? 'Cancelada' : isAttended ? 'Asistió' : isActive ? 'Pagado' : 'Pendiente';
  const color  = isCancelled ? '#ef4444'   : isAttended ? '#8b5cf6' : '#00d084';
  const bg     = isCancelled ? '#fee2e2'   : isAttended ? '#ede9fe' : '#d1fae5';

  return {
    id: r.id,
    time: r.slotLabel || `${r.slotHour}:00 - ${r.slotHour + 1}:00`,
    court: r.courtName,
    client: r.clientName || 'Cliente',
    clientEmail: r.clientEmail || '',
    amount: `S/ ${r.totalAmount}`,
    status,
    color,
    bg,
    date: r.date,
    apiStatus: r.status,
  };
};

const SPORT_OPTIONS = ['Fútbol', 'Fútbol 5', 'Fútbol 7', 'Pádel', 'Tenis', 'Vóley', 'Básquet'];

const PERU_CITIES = ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Cusco', 'Iquitos', 'Huancayo', 'Tacna', 'Ica'];

const ImageUploader = ({ preview, dragOver, uploading, onFile, onDragOver, onDragLeave, isDark = false }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ fontSize: '0.9rem', fontWeight: '800', color: isDark ? '#94a3b8' : '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      Foto de la Cancha <span style={{ color: isDark ? '#64748b' : '#94a3b8', fontWeight: '500', textTransform: 'none' }}>(opcional)</span>
    </label>
    <label
      onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
      onDragLeave={onDragLeave}
      onDrop={(e) => { e.preventDefault(); onDragLeave(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        border: `2px dashed ${dragOver ? '#00d084' : preview ? '#00d084' : (isDark ? '#334155' : '#cbd5e1')}`,
        borderRadius: '16px', padding: preview ? '0' : '28px 20px',
        backgroundColor: dragOver ? 'rgba(0,208,132,0.05)' : (isDark ? '#020617' : '#f8fafc'),
        cursor: uploading ? 'wait' : 'pointer',
        overflow: 'hidden', transition: 'all 0.2s', minHeight: '140px', position: 'relative',
      }}
    >
      {preview ? (
        <>
          <img src={preview} alt="preview" style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
            onMouseOver={e => e.currentTarget.style.opacity = 1}
            onMouseOut={e => e.currentTarget.style.opacity = 0}>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.9rem' }}>Cambiar foto</span>
          </div>
        </>
      ) : (
        <>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(0,208,132,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '1.5rem' }}>
            <i className={`bi ${uploading ? 'bi-hourglass-split' : 'bi-camera-fill'}`} />
          </div>
          <p style={{ margin: 0, fontWeight: '700', color: isDark ? '#94a3b8' : '#334155', fontSize: '0.95rem' }}>
            {uploading ? 'Subiendo...' : 'Haz clic o arrastra una foto'}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: isDark ? '#64748b' : '#94a3b8' }}>JPG, PNG, WebP · Máx 10MB</p>
        </>
      )}
      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => onFile(e.target.files[0])} />
    </label>
  </div>
);

const ICON_MAP = {
  Deportivos: ['bi-dribbble', 'bi-circle-half', 'bi-circle-fill', 'bi-record-circle', 'bi-shield-fill', 'bi-person-running', 'bi-lightning-fill', 'bi-trophy-fill'],
  Abarrotes:  ['bi-droplet-fill', 'bi-cup-straw', 'bi-box-seam', 'bi-apple', 'bi-cup', 'bi-candy', 'bi-bag', 'bi-basket2'],
};

const TIENDA_DEFAULT = [
  { id: 1, name: 'Pelota de Fútbol', category: 'Deportivos', price: 45.00, stock: 10, icon: 'bi-dribbble', imageUrl: null },
  { id: 2, name: 'Guantes de Arquero', category: 'Deportivos', price: 65.00, stock: 5,  icon: 'bi-shield-fill', imageUrl: null },
  { id: 3, name: 'Rodilleras Profesionales', category: 'Deportivos', price: 35.00, stock: 8, icon: 'bi-person-running', imageUrl: null },
  { id: 4, name: 'Agua Mineral 600ml', category: 'Abarrotes', price: 2.50, stock: 80, icon: 'bi-droplet-fill', imageUrl: null },
  { id: 5, name: 'Gatorade 500ml', category: 'Abarrotes', price: 5.00, stock: 40, icon: 'bi-cup-straw', imageUrl: null },
  { id: 6, name: 'Barra Energética', category: 'Abarrotes', price: 3.50, stock: 30, icon: 'bi-box-seam', imageUrl: null },
];

const PropietarioDashboard = ({ user, onLogout, darkMode = false, toggleTheme }) => {
  const C = {
    textPrimary: darkMode ? '#f8fafc' : '#0f172a',
    textSecondary: darkMode ? '#94a3b8' : '#475569',
    textMuted: darkMode ? '#64748b' : '#94a3b8',
    cardBg: darkMode ? '#0f172a' : '#ffffff',
    cardBorder: darkMode ? '#1e293b' : '#e2e8f0',
    inputBg: darkMode ? '#020617' : '#f8fafc',
    inputBorder: darkMode ? '#1e293b' : '#e2e8f0',
    btnSecBg: darkMode ? 'rgba(255,255,255,.07)' : '#f1f5f9',
    btnSecColor: darkMode ? '#f8fafc' : '#475569',
    tagDeportivosBg: darkMode ? 'rgba(59,130,246,.15)' : '#eff6ff',
    tagDeportivosColor: darkMode ? '#60a5fa' : '#3b82f6',
    tagAbarrotesBg: darkMode ? 'rgba(245,158,11,.15)' : '#fef3c7',
    tagAbarrotesColor: darkMode ? '#fbbf24' : '#d97706',
    warningBg: darkMode ? 'rgba(239,68,68,.1)' : '#fef2f2',
    warningBorder: darkMode ? 'rgba(239,68,68,.2)' : '#fecaca',
    warningText: darkMode ? '#fca5a5' : '#991b1b',
    infoBg: darkMode ? '#1e293b' : '#f8fafc',
    infoBorder: darkMode ? '#334155' : '#cbd5e1',
    rowHover: darkMode ? '#1a2236' : '#fafbff',
  };
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { showTour, finishTour, retakeTour, tourHighlight, setTourHighlight } = useOnboarding('propietario');

  const [canchas, setCanchas] = useState([]);
  const [loadingCanchas, setLoadingCanchas] = useState(true);

  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);

  const [tiendaItems, setTiendaItems] = useState(TIENDA_DEFAULT);
  const [tiendaFiltro, setTiendaFiltro] = useState('Todos');
  const [tiendaSearch, setTiendaSearch] = useState('');

  const [modal, setModal] = useState({ show: false, action: null, payload: null });
  const [submitting, setSubmitting] = useState(false);

  // QR Scanner state
  const [qrScanning, setQrScanning] = useState(false);
  const [qrManualId, setQrManualId] = useState('');
  const [qrVerified, setQrVerified] = useState(null); // null | 'loading' | reservationData | 'error'
  const [qrError, setQrError] = useState('');
  const [confirmingAttendance, setConfirmingAttendance] = useState(false);
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false);
  const scannerRef = useRef(null);
  const html5ScannerRef = useRef(null);

  // Image upload state (cancha)
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageDragOver, setImageDragOver] = useState(false);

  // Image upload state (product)
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const [productImageDragOver, setProductImageDragOver] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.getMyCourts();
      const courts = Array.isArray(data) ? data.map(mapOwnerCourt) : [];
      setCanchas(courts);
      setLoadingCanchas(false);

      if (courts.length > 0) {
        const results = await Promise.allSettled(
          courts.map(c => api.getCourtReservations(c.id))
        );
        const all = results
          .filter(r => r.status === 'fulfilled' && Array.isArray(r.value))
          .flatMap(r => r.value.map(mapOwnerReservation));
        setReservas(all);
      }
    } catch (err) {
      console.error('Error cargando datos del propietario:', err);
      setLoadingCanchas(false);
    } finally {
      setLoadingReservas(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openModal = (action, payload = null) => {
    const isCancha = action?.includes('CANCHA');
    const isProducto = action?.includes('PRODUCTO');
    setImageFile(null);
    setImagePreview(isCancha ? (payload?.imageUrl || null) : null);
    setProductImageFile(null);
    setProductImagePreview(isProducto ? (payload?.imageUrl || null) : null);
    setModal({ show: true, action, payload });
  };
  const closeModal = () => {
    setModal({ show: false, action: null, payload: null });
    setImageFile(null);
    setImagePreview(null);
    setProductImageFile(null);
    setProductImagePreview(null);
  };

  const handleImageSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const fd = new FormData(e.target);
    setSubmitting(true);

    try {
      // Upload image first if one was selected
      let finalImageUrl = modal.payload?.imageUrl || null;
      if (imageFile) {
        setUploadingImage(true);
        const uploadResult = await api.uploadImage(imageFile);
        finalImageUrl = uploadResult.url;
        setUploadingImage(false);
      }

      switch (modal.action) {
        case 'AGREGAR_CANCHA': {
          const newCourt = await api.createCourt({
            name: fd.get('name'),
            sportType: fd.get('sportType'),
            pricePerHour: parseFloat(fd.get('pricePerHour')),
            address: fd.get('address'),
            city: fd.get('city') || null,
            district: fd.get('district') || null,
            imageUrl: finalImageUrl,
          });
          setCanchas(prev => [...prev, mapOwnerCourt(newCourt)]);
          break;
        }
        case 'EDITAR_CANCHA': {
          const updated = await api.updateCourt(modal.payload.id, {
            name: fd.get('name') || modal.payload.name,
            sportType: fd.get('sportType') || modal.payload.sportType,
            pricePerHour: parseFloat(fd.get('pricePerHour')) || modal.payload.pricePerHour,
            address: fd.get('address') || modal.payload.address,
            city: fd.get('city') || modal.payload.city || null,
            district: fd.get('district') || modal.payload.district || null,
            imageUrl: finalImageUrl,
          });
          setCanchas(prev => prev.map(c => c.id === modal.payload.id ? mapOwnerCourt(updated) : c));
          break;
        }
        case 'ELIMINAR_CANCHA': {
          await api.deleteCourt(modal.payload.id);
          setCanchas(prev => prev.filter(c => c.id !== modal.payload.id));
          setReservas(prev => prev.filter(r => r.courtId !== modal.payload.id));
          break;
        }
        case 'CANCELAR_RESERVA': {
          await api.cancelReservationByOwner(modal.payload.id);
          setReservas(prev => prev.map(r => r.id === modal.payload.id
            ? { ...r, status: 'Cancelada', color: '#ef4444', bg: '#fee2e2' }
            : r));
          break;
        }
        case 'EDITAR_RESERVA':
          setReservas(prev => prev.map(r => r.id === modal.payload.id ? { ...r, time: fd.get('time') } : r));
          break;

        case 'AGREGAR_PRODUCTO': {
          const cat = fd.get('category');
          const iconList = ICON_MAP[cat] || ['bi-bag-fill'];
          let productImgUrl = null;
          if (productImageFile) {
            setUploadingProductImage(true);
            try {
              const res = await api.uploadImage(productImageFile);
              productImgUrl = res.url;
            } catch { productImgUrl = null; }
            setUploadingProductImage(false);
          }
          setTiendaItems(prev => [...prev, {
            id: Date.now(),
            name: fd.get('productName'),
            category: cat,
            price: parseFloat(fd.get('price')),
            stock: parseInt(fd.get('stock'), 10),
            icon: iconList[Math.floor(Math.random() * iconList.length)],
            imageUrl: productImgUrl,
          }]);
          break;
        }
        case 'EDITAR_PRODUCTO': {
          let editProductImgUrl = modal.payload?.imageUrl || null;
          if (productImageFile) {
            setUploadingProductImage(true);
            try {
              const res = await api.uploadImage(productImageFile);
              editProductImgUrl = res.url;
            } catch { editProductImgUrl = modal.payload?.imageUrl || null; }
            setUploadingProductImage(false);
          }
          setTiendaItems(prev => prev.map(p => p.id === modal.payload.id ? {
            ...p,
            name: fd.get('productName') || p.name,
            category: fd.get('category') || p.category,
            price: parseFloat(fd.get('price')) || p.price,
            stock: parseInt(fd.get('stock'), 10) >= 0 ? parseInt(fd.get('stock'), 10) : p.stock,
            imageUrl: editProductImgUrl,
          } : p));
          break;
        }
        case 'ELIMINAR_PRODUCTO':
          setTiendaItems(prev => prev.filter(p => p.id !== modal.payload.id));
          break;

        default: break;
      }
      closeModal();
    } catch (err) {
      alert(err.message || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const hoy = new Date().toISOString().split('T')[0];
  const ingresosHoy = reservas
    .filter(r => (r.status === 'Pagado' || r.status === 'Asistió') && r.date === hoy)
    .reduce((sum, r) => sum + parseFloat(r.amount.replace('S/ ', '') || 0), 0);
  const reservasActivas = reservas.filter(r => r.status !== 'Cancelada').length;
  const ocupacion = canchas.length > 0 ? Math.round((reservasActivas / (canchas.length * 10)) * 100) : 0;

  const filteredTienda = tiendaItems.filter(p =>
    (tiendaFiltro === 'Todos' || p.category === tiendaFiltro) &&
    p.name.toLowerCase().includes(tiendaSearch.toLowerCase())
  );

  const modalTitle = {
    AGREGAR_CANCHA: 'Nueva Cancha',
    EDITAR_CANCHA: 'Editar Cancha',
    ELIMINAR_CANCHA: 'Eliminar Cancha',
    CANCELAR_RESERVA: 'Cancelar Reserva',
    EDITAR_RESERVA: 'Editar Reserva',
    AGREGAR_PRODUCTO: 'Nuevo Producto',
    EDITAR_PRODUCTO: 'Editar Producto',
    ELIMINAR_PRODUCTO: 'Eliminar Producto',
  };

  return (
    <>
    <DashboardLayout user={user} onLogout={onLogout} darkMode={darkMode} toggleTheme={toggleTheme}
      title={activeTab === 'Dashboard' ? 'Panel del Complejo' : activeTab}
      activeTab={activeTab} onTabChange={setActiveTab}
      tourHighlight={tourHighlight} onRestartTour={retakeTour}
      menuItems={[
        { icon: 'bi-grid-fill',           label: 'Dashboard' },
        { icon: 'bi-calendar3',           label: 'Calendario de Reservas' },
        { icon: 'bi-geo-alt-fill',        label: 'Mis Canchas' },
        { icon: 'bi-qr-code-scan',        label: 'Escanear QR' },
        { icon: 'bi-shop',                label: 'Tienda' },
        { icon: 'bi-cash-stack',          label: 'Finanzas' },
        { icon: 'bi-bar-chart-fill',      label: 'Analíticas' },
        { icon: 'bi-person-circle',       label: 'Mi Perfil' },
      ]}>

      {/* ─── Dashboard ─────────────────────────────────── */}
      {activeTab === 'Dashboard' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            {loadingCanchas ? (
              <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
            ) : (
              <>
                <MetricCard title="Ingresos de Hoy" value={ingresosHoy > 0 ? `S/ ${ingresosHoy.toFixed(2)}` : 'S/ 0.00'} subtitle="Reservas pagadas hoy" color="#00d084" trend="up" />
                <MetricCard title="Reservas Activas" value={reservasActivas} subtitle={`${canchas.length} canchas registradas`} color="#f59e0b" />
                <MetricCard title="Ocupación" value={`${ocupacion}%`} subtitle="Basado en reservas activas" color="#3b82f6" trend={ocupacion > 50 ? 'up' : 'down'} />
              </>
            )}
          </div>

          <div className="dashboard-card-ps">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: C.textPrimary, fontSize: '1.2rem', fontWeight: '800' }}>Últimas Reservas</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setLoadingReservas(true); loadData(); }} className="btn-secondary-ps">
                  <i className="bi bi-arrow-clockwise" /> Actualizar
                </button>
                <button onClick={() => setActiveTab('Calendario de Reservas')} className="btn-secondary-ps">Ver calendario</button>
              </div>
            </div>
            {loadingReservas ? (
              <SkeletonTable rows={4} />
            ) : reservas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', color: C.textMuted }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}><i className="bi bi-inbox" /></div>
                <p style={{ margin: 0, fontWeight: 600, color: C.textSecondary }}>Aún no tienes reservas registradas.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', padding: '10px 0' }}>
                <table className="premium-table">
                  <thead>
                    <tr><th>Horario</th><th>Cancha</th><th>Fecha</th><th>Monto</th><th>Estado</th><th>Acción</th></tr>
                  </thead>
                  <tbody>
                    {reservas.slice(0, 10).map((row) => (
                      <tr key={row.id} className="table-row">
                        <td style={{ fontWeight: '600', color: C.textPrimary }}>{row.time}</td>
                        <td style={{ color: C.textSecondary }}>{row.court}</td>
                        <td style={{ color: C.textSecondary }}>{row.date}</td>
                        <td style={{ color: C.textPrimary, fontWeight: '700' }}>{row.amount}</td>
                        <td><span className="status-badge" style={{ color: row.color, backgroundColor: row.bg }}>{row.status}</span></td>
                        <td>
                          {row.status !== 'Cancelada' && (
                            <button onClick={() => openModal('CANCELAR_RESERVA', row)} className="btn-delete-ps">Cancelar</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ─── Calendario ───────────────────────────────── */}
      {activeTab === 'Calendario de Reservas' && (
        loadingReservas ? (
          <div className="dashboard-card-ps" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}><i className="bi bi-calendar3" /></div>
            <p style={{ margin: 0, fontWeight: '600' }}>Cargando calendario...</p>
          </div>
        ) : (
          <CalendarioCancha reservas={reservas} />
        )
      )}

      {/* ─── Mis Canchas ──────────────────────────────── */}
      {activeTab === 'Mis Canchas' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: '0', color: C.textPrimary, fontSize: '1.3rem', fontWeight: '800' }}>Gestión de Infraestructura</h3>
            <button onClick={() => openModal('AGREGAR_CANCHA')} className="btn-dark-ps">
              + Nueva Cancha
            </button>
          </div>
          {loadingCanchas ? (
            <SkeletonCourtGrid count={3} />
          ) : canchas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', background: C.cardBg, borderRadius: 20, border: `1px solid ${C.cardBorder}` }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}><i className="bi bi-building" /></div>
              <h3 style={{ margin: '0 0 8px', color: C.textPrimary, fontWeight: 800 }}>Sin canchas registradas</h3>
              <p style={{ margin: 0, color: C.textMuted }}>Agrega tu primera cancha para empezar a recibir reservas.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {canchas.map((cancha) => (
                <div key={cancha.id} className="card-hover" style={{ backgroundColor: C.cardBg, borderRadius: '20px', border: `1px solid ${C.cardBorder}`, overflow: 'hidden', transition: 'all 0.3s ease' }}>
                  <div style={{ height: '160px', backgroundImage: `url(${cancha.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', color: cancha.color, boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }}>
                      ● {cancha.status}
                    </div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: '800', color: C.textPrimary }}>{cancha.name}</h4>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: C.textSecondary, fontWeight: '500' }}>{cancha.type}</p>
                    {cancha.location && <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: C.textMuted }}><i className="bi bi-geo-alt-fill" /> {cancha.location}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.cardBorder}`, paddingTop: '14px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '900', color: C.textPrimary }}>{cancha.price}<span style={{ fontSize: '0.8rem', color: C.textMuted, fontWeight: '500' }}>/hora</span></span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openModal('ELIMINAR_CANCHA', cancha)} className="btn-delete-ps">Eliminar</button>
                        <button onClick={() => openModal('EDITAR_CANCHA', cancha)} className="btn-edit-ps">Editar</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Escanear QR ─────────────────────────────── */}
      {activeTab === 'Escanear QR' && (
        <QrScannerSection
          scannerRef={scannerRef}
          html5ScannerRef={html5ScannerRef}
          qrScanning={qrScanning}
          setQrScanning={setQrScanning}
          qrManualId={qrManualId}
          setQrManualId={setQrManualId}
          qrVerified={qrVerified}
          setQrVerified={setQrVerified}
          qrError={qrError}
          setQrError={setQrError}
          confirmingAttendance={confirmingAttendance}
          setConfirmingAttendance={setConfirmingAttendance}
          attendanceConfirmed={attendanceConfirmed}
          setAttendanceConfirmed={setAttendanceConfirmed}
          darkMode={darkMode}
        />
      )}

      {/* ─── Tienda ───────────────────────────────────── */}
      {activeTab === 'Tienda' && (
        <div>
          {/* Métricas de tienda */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '30px' }}>
            <MetricCard title="Productos en Tienda" value={tiendaItems.length} subtitle="En catálogo activo" color="#3b82f6" />
            <MetricCard title="Artículos Deportivos" value={tiendaItems.filter(p => p.category === 'Deportivos').length} subtitle="Equipamiento y accesorios" color="#00d084" />
            <MetricCard title="Abarrotes" value={tiendaItems.filter(p => p.category === 'Abarrotes').length} subtitle="Bebidas y snacks" color="#f59e0b" />
          </div>

          <div className="dashboard-card-ps">
            {/* Barra de herramientas */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="text" value={tiendaSearch}
                  onChange={e => setTiendaSearch(e.target.value)}
                  placeholder="Buscar producto..."
                  className="modal-ps-input" style={{ minWidth: '180px', padding: '10px 14px', width: 'auto' }}
                />
                {['Todos', 'Deportivos', 'Abarrotes'].map(cat => (
                  <button key={cat} onClick={() => setTiendaFiltro(cat)} style={{
                    padding: '9px 16px', borderRadius: '10px', border: 'none',
                    backgroundColor: tiendaFiltro === cat ? '#0f172a' : C.btnSecBg,
                    color: tiendaFiltro === cat ? '#fff' : C.btnSecColor,
                    fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
                  }}>{cat}</button>
                ))}
              </div>
              <button onClick={() => openModal('AGREGAR_PRODUCTO')} className="btn-primary-ps">
                + Agregar Producto
              </button>
            </div>

            {/* Grid de productos */}
            {filteredTienda.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: C.textMuted }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}><i className="bi bi-cart3" /></div>
                <h3 style={{ margin: '0 0 6px', color: C.textPrimary, fontWeight: 800 }}>Sin productos</h3>
                <p style={{ margin: 0 }}>Agrega tu primer producto a la tienda.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {filteredTienda.map(producto => (
                  <div key={producto.id} className="card-hover" style={{
                    background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px',
                    overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    transition: 'all 0.2s',
                  }}>
                    {/* Imagen del producto */}
                    {producto.imageUrl ? (
                      <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                        <img src={producto.imageUrl} alt={producto.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{
                          position: 'absolute', top: 8, left: 8,
                          fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px',
                          color: producto.category === 'Deportivos' ? C.tagDeportivosColor : C.tagAbarrotesColor,
                          backgroundColor: producto.category === 'Deportivos' ? C.tagDeportivosBg : C.tagAbarrotesBg,
                          padding: '3px 8px', borderRadius: '6px',
                        }}>{producto.category}</span>
                      </div>
                    ) : (
                      <div style={{ height: '100px', background: C.infoBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <i className={`bi ${producto.icon}`} style={{ fontSize: '2.2rem' }} />
                        <span style={{
                          fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px',
                          color: producto.category === 'Deportivos' ? C.tagDeportivosColor : C.tagAbarrotesColor,
                          backgroundColor: producto.category === 'Deportivos' ? C.tagDeportivosBg : C.tagAbarrotesBg,
                          padding: '2px 8px', borderRadius: '6px',
                        }}>{producto.category}</span>
                      </div>
                    )}
                    <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h4 style={{ margin: '0 0 2px', fontWeight: '800', color: C.textPrimary, fontSize: '0.95rem' }}>{producto.name}</h4>
                      <p style={{ margin: 0, color: producto.stock <= 5 ? '#ef4444' : C.textMuted, fontSize: '0.82rem', fontWeight: producto.stock <= 5 ? '700' : '400' }}>
                        {producto.stock <= 5 ? <><i className="bi bi-exclamation-triangle-fill" />{' '}</> : ''}Stock: {producto.stock} uds
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.cardBorder}`, paddingTop: '10px', marginTop: 'auto' }}>
                        <span style={{ fontWeight: '900', fontSize: '1.05rem', color: C.textPrimary }}>S/ {producto.price.toFixed(2)}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => openModal('ELIMINAR_PRODUCTO', producto)} className="btn-delete-ps">Eliminar</button>
                          <button onClick={() => openModal('EDITAR_PRODUCTO', producto)} className="btn-edit-ps">Editar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Finanzas ─────────────────────────────────── */}
      {activeTab === 'Finanzas' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '30px' }}>
            <MetricCard title="Total Ingresos" value={`S/ ${reservas.filter(r => r.status === 'Pagado' || r.status === 'Asistió').reduce((sum, r) => sum + parseFloat(r.amount.replace('S/ ', '') || 0), 0).toFixed(2)}`} subtitle="Reservas confirmadas" color="#00d084" />
            <MetricCard title="Reservas Totales" value={reservas.length} subtitle="Todas las reservas" color="#3b82f6" trend="up" />
            <MetricCard title="Comisiones PlaySpot" value="S/ 0.00" subtitle="Plan Pro Activo" color="#f59e0b" />
          </div>
          <div className="dashboard-card-ps">
            <h3 style={{ margin: '0 0 20px 0', color: C.textPrimary, fontSize: '1.2rem', fontWeight: '800' }}>Historial de Reservas Pagadas</h3>
            {loadingReservas ? (
              <div style={{ textAlign: 'center', padding: '40px', color: C.textMuted }}>Cargando...</div>
            ) : (
              <div style={{ overflowX: 'auto', padding: '10px 0' }}>
                <table className="premium-table">
                  <thead>
                    <tr><th>Fecha</th><th>Horario</th><th>Cancha</th><th>Monto</th><th>Estado</th></tr>
                  </thead>
                  <tbody>
                    {reservas.filter(r => r.status === 'Pagado' || r.status === 'Asistió').map((row) => (
                      <tr key={row.id} className="table-row">
                        <td style={{ color: C.textPrimary, fontWeight: '500' }}>{row.date}</td>
                        <td style={{ color: C.textSecondary }}>{row.time}</td>
                        <td style={{ color: C.textSecondary }}>{row.court}</td>
                        <td style={{ color: C.textPrimary, fontWeight: '800' }}>{row.amount}</td>
                        <td><span className="status-badge" style={{ color: row.color, backgroundColor: row.bg }}>{row.status}</span></td>
                      </tr>
                    ))}
                    {reservas.filter(r => r.status === 'Pagado' || r.status === 'Asistió').length === 0 && (
                      <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: C.textMuted }}>No hay ingresos registrados.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Analíticas ───────────────────────────────── */}
      {activeTab === 'Analíticas' && (() => {
        // Derive analytics from reservas & canchas
        const paid = reservas.filter(r => r.status === 'Pagado');
        const totalIngresos = paid.reduce((s, r) => s + parseFloat(r.amount.replace('S/ ','') || 0), 0);

        // Revenue by court
        const revByCourt = {};
        const resByCourt = {};
        paid.forEach(r => {
          revByCourt[r.court] = (revByCourt[r.court] || 0) + parseFloat(r.amount.replace('S/ ','') || 0);
          resByCourt[r.court] = (resByCourt[r.court] || 0) + 1;
        });
        const courtRevEntries = Object.entries(revByCourt).sort((a,b) => b[1]-a[1]).slice(0,6);
        const maxRev = Math.max(...courtRevEntries.map(e => e[1]), 1);

        // Reservations by status
        const statusCount = {
          Pagado:   reservas.filter(r => r.status === 'Pagado').length,
          Pendiente: reservas.filter(r => r.status === 'Pendiente').length,
          Cancelada: reservas.filter(r => r.status === 'Cancelada').length,
          'Asistió':  reservas.filter(r => r.status === 'Asistió').length,
        };

        // Peak hours: count reservations per hour from time field "HH:00 - HH+1:00"
        const hourCounts = {};
        reservas.forEach(r => {
          const m = r.time?.match(/^(\d+):/);
          if (m) { const h = parseInt(m[1]); hourCounts[h] = (hourCounts[h] || 0) + 1; }
        });
        const maxHour = Math.max(...Object.values(hourCounts), 1);
        const hours = Array.from({ length: 15 }, (_, i) => i + 8);

        // Revenue last 7 days (simulated from date field)
        const dayRevMap = {};
        paid.forEach(r => {
          const d = r.date || '';
          if (d) dayRevMap[d] = (dayRevMap[d] || 0) + parseFloat(r.amount.replace('S/ ','') || 0);
        });
        const last7 = Array.from({ length:7 }, (_, i) => {
          const d = new Date(); d.setDate(d.getDate() - (6-i));
          const iso = d.toISOString().split('T')[0];
          return { label: d.toLocaleDateString('es-PE',{weekday:'short'}), value: dayRevMap[iso] || 0 };
        });
        const maxDay = Math.max(...last7.map(d=>d.value), 1);

        const barColor = '#00d084';
        const mutedColor = darkMode ? '#64748b' : '#94a3b8';
        const textColor = darkMode ? '#f8fafc' : '#0f172a';
        const borderColor = darkMode ? '#1e293b' : '#e2e8f0';
        const cardBgColor = darkMode ? '#0f172a' : '#fff';

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* KPIs row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
              {[
                { label: 'Total Ingresos', value: `S/ ${totalIngresos.toFixed(2)}`, color: '#00d084', icon: 'bi-cash-coin' },
                { label: 'Reservas totales', value: reservas.length, color: '#3b82f6', icon: 'bi-calendar3' },
                { label: 'Tasa de cancelación', value: reservas.length > 0 ? `${Math.round((statusCount.Cancelada/reservas.length)*100)}%` : '0%', color: '#ef4444', icon: 'bi-x-circle-fill' },
                { label: 'Canchas activas', value: canchas.filter(c=>c.status==='Operativa').length, color: '#f59e0b', icon: 'bi-building' },
              ].map(k => (
                <div key={k.label} className="dashboard-card-ps card-hover" style={{ borderTop: `2px solid ${k.color}`, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${k.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}><i className={`bi ${k.icon}`} /></div>
                  <div>
                    <div style={{ fontSize: '.78rem', fontWeight: 700, color: mutedColor, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '.3px' }}>{k.label}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: textColor, lineHeight: 1 }}>{k.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue last 7 days bar chart */}
            <div className="dashboard-card-ps">
              <h3 style={{ margin: '0 0 20px', color: textColor, fontSize: '1.1rem', fontWeight: 800 }}>Ingresos — últimos 7 días</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160 }}>
                {last7.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '.7rem', fontWeight: 700, color: barColor, opacity: d.value > 0 ? 1 : 0 }}>
                      S/{d.value.toFixed(0)}
                    </span>
                    <div style={{ width: '100%', borderRadius: 8, background: barColor, opacity: d.value > 0 ? 1 : 0.18, height: `${Math.max((d.value / maxDay) * 130, d.value > 0 ? 8 : 4)}px`, transition: 'height .6s ease', boxShadow: d.value > 0 ? `0 0 12px ${barColor}40` : 'none' }} />
                    <span style={{ fontSize: '.72rem', color: mutedColor, fontWeight: 600 }}>{d.label}</span>
                  </div>
                ))}
              </div>
              {paid.length === 0 && (
                <p style={{ margin: '12px 0 0', textAlign: 'center', color: mutedColor, fontSize: '.85rem' }}>Aún no hay reservas pagadas para mostrar.</p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
              {/* Revenue by court */}
              <div className="dashboard-card-ps">
                <h3 style={{ margin: '0 0 16px', color: textColor, fontSize: '1.1rem', fontWeight: 800 }}>Ingresos por cancha</h3>
                {courtRevEntries.length === 0 ? (
                  <p style={{ margin: 0, color: mutedColor, fontSize: '.88rem', textAlign: 'center', padding: '24px 0' }}>Sin datos aún.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {courtRevEntries.map(([court, rev], i) => (
                      <div key={court}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: '.85rem', fontWeight: 700, color: textColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{court}</span>
                          <span style={{ fontSize: '.85rem', fontWeight: 900, color: barColor }}>S/ {rev.toFixed(2)}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, background: darkMode ? '#1e293b' : '#e2e8f0', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 99, width: `${(rev/maxRev)*100}%`, background: `linear-gradient(90deg,${barColor},#3b82f6)`, transition: 'width .7s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status breakdown donut-like */}
              <div className="dashboard-card-ps">
                <h3 style={{ margin: '0 0 16px', color: textColor, fontSize: '1.1rem', fontWeight: 800 }}>Estado de reservas</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Pagadas / Confirmadas', count: statusCount.Pagado,   color: '#00d084' },
                    { label: 'Asistidas',              count: statusCount['Asistió'], color: '#8b5cf6' },
                    { label: 'Pendientes',             count: statusCount.Pendiente, color: '#f59e0b' },
                    { label: 'Canceladas',             count: statusCount.Cancelada, color: '#ef4444' },
                  ].map(s => {
                    const pct = reservas.length > 0 ? Math.round((s.count / reservas.length) * 100) : 0;
                    return (
                      <div key={s.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: '.82rem', fontWeight: 600, color: mutedColor }}>{s.label}</span>
                          <span style={{ fontSize: '.82rem', fontWeight: 800, color: s.color }}>{s.count} ({pct}%)</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, background: darkMode ? '#1e293b' : '#e2e8f0', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: s.color, transition: 'width .6s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Peak hours heatmap */}
            <div className="dashboard-card-ps">
              <h3 style={{ margin: '0 0 16px', color: textColor, fontSize: '1.1rem', fontWeight: 800 }}>Horas pico</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 4 }}>
                {hours.map(h => {
                  const cnt = hourCounts[h] || 0;
                  const pct = cnt / maxHour;
                  const heatColor = pct > 0.7 ? '#ef4444' : pct > 0.4 ? '#f59e0b' : pct > 0 ? '#00d084' : (darkMode ? '#1e293b' : '#e2e8f0');
                  return (
                    <div key={h} style={{ flex: '0 0 auto', width: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, height: '100%', justifyContent: 'flex-end' }}>
                      {cnt > 0 && <span style={{ fontSize: '.65rem', fontWeight: 700, color: heatColor }}>{cnt}</span>}
                      <div style={{ width: '100%', borderRadius: 6, background: heatColor, height: `${Math.max(pct*80, cnt>0?8:4)}px`, transition: 'height .5s ease', boxShadow: pct > 0 ? `0 0 8px ${heatColor}50` : 'none' }} />
                      <span style={{ fontSize: '.68rem', color: mutedColor, fontWeight: 600 }}>{h}h</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
                {[{ color: '#00d084', label: 'Baja demanda' }, { color: '#f59e0b', label: 'Media' }, { color: '#ef4444', label: 'Alta demanda' }].map(l => (
                  <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '.75rem', color: mutedColor }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: l.color, display: 'inline-block' }} />{l.label}
                  </span>
                ))}
              </div>
            </div>

          </div>
        );
      })()}

      {/* ─── Mi Perfil ────────────────────────────────── */}
      {activeTab === 'Mi Perfil' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', alignItems: 'start' }}>
          <div className="dashboard-card-ps" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '120px', background: 'linear-gradient(135deg, rgba(0, 208, 132, 0.8) 0%, rgba(59, 130, 246, 0.8) 100%)' }}></div>
            <div style={{ padding: '0 32px 32px 32px', marginTop: '-40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e2e8f0', backgroundImage: `url(https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0f172a&color=fff&size=150)`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}></div>
              </div>
              <h3 style={{ margin: '0 0 4px 0', color: C.textPrimary, fontSize: '1.3rem', fontWeight: '800' }}>Información Personal</h3>
              <p style={{ margin: '0 0 24px 0', color: C.textSecondary, fontSize: '0.92rem' }}>Actualiza tus datos de propietario.</p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Perfil actualizado con éxito'); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary }}>Nombre Completo</label>
                    <input type="text" defaultValue={user?.name} className="modal-ps-input" required />
                  </div>
                  <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary }}>Teléfono</label>
                    <input type="tel" defaultValue="+51 987 654 321" className="modal-ps-input" />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary }}>Correo Electrónico</label>
                  <input type="email" defaultValue={user?.email} className="modal-ps-input" required />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button type="submit" className="btn-primary-ps">Guardar Cambios</button>
                </div>
              </form>
            </div>
          </div>
          <div className="dashboard-card-ps" style={{ padding: '28px' }}>
            <h3 style={{ margin: '0 0 6px 0', color: C.textPrimary, fontSize: '1.3rem', fontWeight: '800' }}>Seguridad</h3>
            <p style={{ margin: '0 0 20px 0', color: C.textSecondary, fontSize: '0.92rem' }}>Protege tu cuenta con una contraseña segura.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Contraseña actualizada con éxito'); e.target.reset(); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary }}>Contraseña Actual</label>
                <input type="password" required className="modal-ps-input" placeholder="••••••••" />
              </div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '140px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary }}>Nueva Contraseña</label>
                  <input type="password" required minLength="6" className="modal-ps-input" placeholder="••••••••" />
                </div>
                <div style={{ flex: 1, minWidth: '140px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary }}>Confirmar Nueva</label>
                  <input type="password" required minLength="6" className="modal-ps-input" placeholder="••••••••" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button type="submit" className="btn-dark-ps">Actualizar Contraseña</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>

    {/* ─── MODAL GLOBAL ─────────────────────────────── */}
    {modal.show && (
      <div className="modal-overlay-ps">
        <div className="modal-box-ps">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h2 className="modal-title-ps">{modalTitle[modal.action] || 'Acción'}</h2>
              <p className="modal-sub-ps">
                {(modal.action?.includes('ELIMINAR') || modal.action === 'CANCELAR_RESERVA') ? 'Esta acción no se puede deshacer.' : 'Completa la información requerida.'}
              </p>
            </div>
            <button onClick={closeModal} className="modal-close-ps">&times;</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Cancha: agregar */}
            {modal.action === 'AGREGAR_CANCHA' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre de la Cancha</label>
                  <input name="name" className="modal-ps-input" required placeholder="Ej. Cancha Principal" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tipo de Deporte</label>
                  <select name="sportType" required className="modal-ps-input">
                    <option value="">Selecciona un deporte</option>
                    {SPORT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Precio por Hora (S/)</label>
                  <input name="pricePerHour" type="number" min="1" step="0.5" className="modal-ps-input" required placeholder="80" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dirección</label>
                  <input name="address" className="modal-ps-input" required placeholder="Ej. Av. Javier Prado Este 456" />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ciudad</label>
                    <select name="city" className="modal-ps-input">
                      <option value="">Seleccionar...</option>
                      {PERU_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Distrito</label>
                    <input name="district" className="modal-ps-input" placeholder="Ej. Miraflores" />
                  </div>
                </div>
                <ImageUploader
                  preview={imagePreview} dragOver={imageDragOver} uploading={uploadingImage}
                  onFile={handleImageSelect} isDark={darkMode}
                  onDragOver={() => setImageDragOver(true)} onDragLeave={() => setImageDragOver(false)}
                />
              </>
            )}

            {/* Cancha: editar */}
            {modal.action === 'EDITAR_CANCHA' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre</label>
                  <input name="name" className="modal-ps-input" required defaultValue={modal.payload?.name} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tipo de Deporte</label>
                  <select name="sportType" required className="modal-ps-input" defaultValue={modal.payload?.sportType}>
                    {SPORT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Precio por Hora (S/)</label>
                  <input name="pricePerHour" type="number" min="1" step="0.5" className="modal-ps-input" required defaultValue={modal.payload?.pricePerHour} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dirección</label>
                  <input name="address" className="modal-ps-input" required defaultValue={modal.payload?.address} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ciudad</label>
                    <select name="city" className="modal-ps-input" defaultValue={modal.payload?.city || ''}>
                      <option value="">Seleccionar...</option>
                      {PERU_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Distrito</label>
                    <input name="district" className="modal-ps-input" defaultValue={modal.payload?.district || ''} placeholder="Ej. Miraflores" />
                  </div>
                </div>
                <ImageUploader
                  preview={imagePreview} dragOver={imageDragOver} uploading={uploadingImage}
                  onFile={handleImageSelect} isDark={darkMode}
                  onDragOver={() => setImageDragOver(true)} onDragLeave={() => setImageDragOver(false)}
                />
              </>
            )}

            {/* Cancha: eliminar */}
            {modal.action === 'ELIMINAR_CANCHA' && (
              <div className="modal-warning-ps">
                <p>¿Estás seguro de eliminar <strong>{modal.payload?.name}</strong>?<br/><br/>Se eliminarán también todas sus reservas. Esta acción <u>no se puede deshacer</u>.</p>
              </div>
            )}

            {/* Reserva: cancelar */}
            {modal.action === 'CANCELAR_RESERVA' && (
              <div className="modal-warning-ps">
                <p>¿Cancelar la reserva de <strong>{modal.payload?.court}</strong>?<br/>
                <span style={{ fontSize: '0.88rem', opacity: .8 }}>Horario: {modal.payload?.time} · {modal.payload?.date}</span><br/><br/>
                Se notificará al cliente por correo. Esta acción <u>no se puede deshacer</u>.</p>
              </div>
            )}

            {/* Reserva: editar */}
            {modal.action === 'EDITAR_RESERVA' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actualizar Horario</label>
                <input name="time" className="modal-ps-input" required defaultValue={modal.payload?.time} placeholder="Ej. 18:00 - 19:00" />
              </div>
            )}

            {/* Producto: agregar / editar */}
            {(modal.action === 'AGREGAR_PRODUCTO' || modal.action === 'EDITAR_PRODUCTO') && (
              <>
                {/* Imagen del producto */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="modal-ps-label" style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Foto del Producto <span style={{ color: C.textMuted, fontWeight: '400', textTransform: 'none', fontSize: '0.78rem' }}>(opcional)</span>
                  </label>
                  <label
                    onDragOver={(e) => { e.preventDefault(); setProductImageDragOver(true); }}
                    onDragLeave={() => setProductImageDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setProductImageDragOver(false); const f = e.dataTransfer.files[0]; if (f) { setProductImageFile(f); const r = new FileReader(); r.onload = ev => setProductImagePreview(ev.target.result); r.readAsDataURL(f); } }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      border: `2px dashed ${productImageDragOver ? '#00d084' : productImagePreview ? '#00d084' : C.inputBorder}`,
                      borderRadius: '14px', padding: productImagePreview ? '0' : '24px 16px',
                      backgroundColor: productImageDragOver ? 'rgba(0,208,132,0.05)' : C.inputBg,
                      cursor: uploadingProductImage ? 'wait' : 'pointer',
                      overflow: 'hidden', transition: 'all 0.2s', minHeight: '120px', position: 'relative',
                    }}
                  >
                    {productImagePreview ? (
                      <>
                        <img src={productImagePreview} alt="preview" style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                        <div
                          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                          onMouseOver={e => e.currentTarget.style.opacity = 1}
                          onMouseOut={e => e.currentTarget.style.opacity = 0}
                        >
                          <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.9rem' }}>Cambiar foto</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}><i className={`bi ${uploadingProductImage ? 'bi-hourglass-split' : 'bi-image-fill'}`} /></div>
                        <p style={{ margin: 0, fontWeight: '700', color: C.textSecondary, fontSize: '0.88rem' }}>
                          {uploadingProductImage ? 'Subiendo...' : 'Haz clic o arrastra una foto'}
                        </p>
                        <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: C.textMuted }}>JPG, PNG · Máx 10MB</p>
                      </>
                    )}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                      const f = e.target.files[0];
                      if (f) {
                        setProductImageFile(f);
                        const reader = new FileReader();
                        reader.onload = ev => setProductImagePreview(ev.target.result);
                        reader.readAsDataURL(f);
                      }
                    }} />
                  </label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre del Producto</label>
                  <input name="productName" className="modal-ps-input" required defaultValue={modal.payload?.name} placeholder="Ej. Pelota de Fútbol" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Categoría</label>
                  <select name="category" className="modal-ps-input" defaultValue={modal.payload?.category || 'Deportivos'}>
                    <option value="Deportivos">Deportivos</option>
                    <option value="Abarrotes">Abarrotes</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Precio (S/)</label>
                    <input name="price" type="number" min="0.10" step="0.10" className="modal-ps-input" required defaultValue={modal.payload?.price} placeholder="0.00" />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stock</label>
                    <input name="stock" type="number" min="0" className="modal-ps-input" required defaultValue={modal.payload?.stock} placeholder="0" />
                  </div>
                </div>
              </>
            )}

            {/* Producto: eliminar */}
            {modal.action === 'ELIMINAR_PRODUCTO' && (
              <div className="modal-warning-ps">
                <p>¿Eliminar el producto <strong>{modal.payload?.name}</strong> de la tienda?<br/><br/>Esta acción <u>no se puede deshacer</u>.</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="button" onClick={closeModal} className="modal-btn-cancel-ps">Cancelar</button>
              <button type="submit" disabled={submitting || uploadingProductImage}
                className={(modal.action?.includes('ELIMINAR') || modal.action === 'CANCELAR_RESERVA') ? 'modal-btn-danger-ps' : 'modal-btn-submit-ps'}>
                {(submitting || uploadingProductImage) ? 'Procesando...' : modal.action?.includes('ELIMINAR') ? 'Sí, eliminar' : modal.action === 'CANCELAR_RESERVA' ? 'Sí, cancelar' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* ─── TOUR ONBOARDING ─────────────────────────────── */}
    <AnimatePresence>
      {showTour && (
        <OnboardingTour
          steps={PROPIETARIO_TOUR_STEPS}
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

/* ── QR Scanner Section ────────────────────────────────── */
const QrScannerSection = ({
  scannerRef, html5ScannerRef,
  qrScanning, setQrScanning,
  qrManualId, setQrManualId,
  qrVerified, setQrVerified,
  qrError, setQrError,
  confirmingAttendance, setConfirmingAttendance,
  attendanceConfirmed, setAttendanceConfirmed,
  darkMode = false,
}) => {
  const QC = {
    bg: darkMode ? '#0f172a' : '#fff',
    border: darkMode ? '#1e293b' : '#e2e8f0',
    divider: darkMode ? '#1e293b' : '#f1f5f9',
    textPrimary: darkMode ? '#f8fafc' : '#0f172a',
    textSecondary: darkMode ? '#94a3b8' : '#64748b',
    infoBg: darkMode ? '#1e293b' : '#f8fafc',
    infoBorder: darkMode ? '#334155' : '#e2e8f0',
    inputBg: darkMode ? '#020617' : '#fff',
    inputBorder: darkMode ? '#1e293b' : '#e2e8f0',
    btnBg: darkMode ? '#1e293b' : '#f8fafc',
    btnColor: darkMode ? '#94a3b8' : '#475569',
    btnBorder: darkMode ? '#334155' : '#e2e8f0',
  };

  const extractReservationId = (qrText) => {
    const match = qrText.match(/ID:([a-f0-9-]{36})/i);
    return match ? match[1] : qrText.trim();
  };

  const verifyId = async (rawId) => {
    const id = extractReservationId(rawId);
    if (!id) return;
    setQrVerified('loading');
    setQrError('');
    setAttendanceConfirmed(false);
    try {
      const data = await api.verifyReservation(id);
      setQrVerified(data);
    } catch (err) {
      setQrVerified('error');
      setQrError(err.message || 'Reserva no encontrada o no pertenece a tus canchas');
    }
  };

  const startScanner = async () => {
    setQrScanning(true);
    setQrVerified(null);
    setQrError('');
    setAttendanceConfirmed(false);
    await new Promise(r => setTimeout(r, 200));
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('qr-reader');
      html5ScannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await scanner.stop();
          setQrScanning(false);
          await verifyId(decodedText);
        },
        () => {}
      );
    } catch {
      setQrScanning(false);
      setQrError('No se pudo acceder a la cámara. Usa la entrada manual.');
    }
  };

  const stopScanner = async () => {
    if (html5ScannerRef.current) {
      try { await html5ScannerRef.current.stop(); } catch { /* best-effort stop */ }
      html5ScannerRef.current = null;
    }
    setQrScanning(false);
  };

  const confirmAttendance = async () => {
    if (!qrVerified || qrVerified === 'loading' || qrVerified === 'error') return;
    setConfirmingAttendance(true);
    try {
      await api.confirmAttendance(qrVerified.id);
      setAttendanceConfirmed(true);
      setQrVerified(prev => ({ ...prev, status: 'ATTENDED' }));
    } catch (err) {
      setQrError(err.message || 'Error confirmando asistencia');
    } finally {
      setConfirmingAttendance(false);
    }
  };

  const reset = async () => {
    await stopScanner();
    setQrVerified(null);
    setQrManualId('');
    setQrError('');
    setAttendanceConfirmed(false);
  };

  const statusColors = {
    CONFIRMED: { label: 'Confirmada', color: '#00d084', bg: '#d1fae5' },
    PENDING:   { label: 'Pendiente',  color: '#f59e0b', bg: '#fef3c7' },
    CANCELLED: { label: 'Cancelada',  color: '#ef4444', bg: '#fee2e2' },
    ATTENDED:  { label: 'Asistió',    color: '#8b5cf6', bg: '#ede9fe' },
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <style>{`
        @keyframes scanLine { 0%{top:10%} 50%{top:85%} 100%{top:10%} }
        #qr-reader video { border-radius: 16px; }
        #qr-reader { border: none !important; }
        #qr-reader__scan_region { border-radius: 16px; overflow: hidden; }
        #qr-reader__dashboard { display: none !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ margin: '0 0 6px', color: QC.textPrimary, fontSize: '1.6rem', fontWeight: '900' }}>Verificar Acceso</h2>
        <p style={{ margin: 0, color: QC.textSecondary }}>Escanea el QR del jugador o ingresa el ID de reserva para confirmar su asistencia.</p>
      </div>

      {/* Estado: resultado verificado */}
      {qrVerified && qrVerified !== 'loading' && qrVerified !== 'error' && (
        <div style={{ background: QC.bg, borderRadius: '24px', border: `1px solid ${QC.border}`, overflow: 'hidden', marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          {/* Banner superior */}
          <div style={{ background: attendanceConfirmed ? 'linear-gradient(135deg, #6d28d9, #8b5cf6)' : 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '24px 28px', color: '#fff' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}><i className={`bi ${attendanceConfirmed ? 'bi-award-fill' : 'bi-check-circle-fill'}`} /></div>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.3rem', fontWeight: '900' }}>
              {attendanceConfirmed ? '¡Asistencia Confirmada!' : 'Reserva Válida'}
            </h3>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
              {attendanceConfirmed ? 'El jugador puede ingresar a la cancha.' : 'Verifica los datos antes de confirmar.'}
            </p>
          </div>

          {/* Datos */}
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: 'bi-person-fill',       label: 'Jugador', value: qrVerified.clientName },
              { icon: 'bi-envelope-fill',     label: 'Correo',  value: qrVerified.clientEmail },
              { icon: 'bi-building',          label: 'Cancha',  value: qrVerified.courtName },
              { icon: 'bi-calendar3',         label: 'Fecha',   value: qrVerified.date },
              { icon: 'bi-clock',             label: 'Horario', value: qrVerified.slotLabel },
              { icon: 'bi-credit-card-fill',  label: 'Monto',   value: `S/ ${qrVerified.totalAmount}` },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${QC.divider}` }}>
                <span style={{ fontSize: '0.88rem', color: QC.textSecondary, fontWeight: '600' }}><i className={`bi ${icon}`} /> {label}</span>
                <span style={{ fontSize: '0.92rem', fontWeight: '800', color: QC.textPrimary }}>{value}</span>
              </div>
            ))}
            {/* Estado */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
              <span style={{ fontSize: '0.88rem', color: QC.textSecondary, fontWeight: '600' }}><i className="bi bi-clipboard-check" /> Estado</span>
              <span style={{ padding: '4px 14px', borderRadius: '99px', fontSize: '0.82rem', fontWeight: '800', color: (statusColors[qrVerified.status] || statusColors.PENDING).color, background: (statusColors[qrVerified.status] || statusColors.PENDING).bg }}>
                {(statusColors[qrVerified.status] || { label: qrVerified.status }).label}
              </span>
            </div>
          </div>

          {/* Acciones */}
          <div style={{ padding: '0 28px 28px', display: 'flex', gap: '12px' }}>
            {!attendanceConfirmed && qrVerified.status !== 'CANCELLED' && qrVerified.status !== 'ATTENDED' && (
              <button onClick={confirmAttendance} disabled={confirmingAttendance}
                style={{ flex: 1, padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #00d084, #00b875)', color: '#fff', fontWeight: '800', fontSize: '1rem', cursor: confirmingAttendance ? 'wait' : 'pointer', opacity: confirmingAttendance ? 0.7 : 1 }}>
                {confirmingAttendance ? 'Confirmando...' : 'Confirmar Asistencia'}
              </button>
            )}
            {(qrVerified.status === 'CANCELLED') && (
              <div style={{ flex: 1, padding: '16px', borderRadius: '14px', background: '#fee2e2', color: '#ef4444', fontWeight: '800', textAlign: 'center' }}>
                <i className="bi bi-x-circle-fill" /> Reserva cancelada — no puede ingresar
              </div>
            )}
            <button onClick={reset} style={{ padding: '16px 20px', borderRadius: '14px', border: `1.5px solid ${QC.btnBorder}`, background: QC.btnBg, color: QC.btnColor, fontWeight: '700', cursor: 'pointer' }}>
              Nuevo
            </button>
          </div>
        </div>
      )}

      {/* Estado: cargando */}
      {qrVerified === 'loading' && (
        <div style={{ background: QC.bg, borderRadius: '20px', border: `1px solid ${QC.border}`, padding: '40px', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', border: `4px solid ${QC.border}`, borderTopColor: '#00d084', borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ margin: 0, color: QC.textSecondary, fontWeight: '600' }}>Verificando reserva...</p>
        </div>
      )}

      {/* Error */}
      {qrError && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '1.3rem', color: '#991b1b', flexShrink: 0 }} />
          <div>
            <p style={{ margin: '0 0 4px', fontWeight: '800', color: '#991b1b' }}>Error al verificar</p>
            <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.88rem' }}>{qrError}</p>
          </div>
        </div>
      )}

      {/* Scanner de cámara */}
      {!qrVerified && (
        <div style={{ background: QC.bg, borderRadius: '24px', border: `1px solid ${QC.border}`, overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ padding: '24px 28px 20px', borderBottom: `1px solid ${QC.divider}` }}>
            <h3 style={{ margin: '0 0 4px', color: QC.textPrimary, fontWeight: '800' }}><i className="bi bi-camera-fill" /> Escanear con cámara</h3>
            <p style={{ margin: 0, color: QC.textSecondary, fontSize: '0.88rem' }}>Apunta la cámara al QR del jugador.</p>
          </div>
          <div style={{ padding: '20px 28px 24px' }}>
            {qrScanning ? (
              <div>
                <div id="qr-reader" ref={scannerRef} style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '14px' }} />
                <button onClick={stopScanner} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `1.5px solid ${QC.btnBorder}`, background: QC.btnBg, color: QC.btnColor, fontWeight: '700', cursor: 'pointer' }}>
                  Detener cámara
                </button>
              </div>
            ) : (
              <button onClick={startScanner}
                style={{ width: '100%', padding: '20px', borderRadius: '16px', border: `2px dashed ${darkMode ? '#334155' : '#cbd5e1'}`, background: QC.infoBg, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#00d084'; e.currentTarget.style.background = 'rgba(0,208,132,0.04)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = darkMode ? '#334155' : '#cbd5e1'; e.currentTarget.style.background = QC.infoBg; }}>
                <i className="bi bi-camera-fill" style={{ fontSize: '2.5rem', color: '#64748b' }} />
                <span style={{ fontWeight: '700', color: QC.textPrimary, fontSize: '1rem' }}>Abrir cámara</span>
                <span style={{ fontSize: '0.8rem', color: QC.textSecondary }}>Se solicitará permiso de cámara</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Entrada manual */}
      {!qrVerified && (
        <div style={{ background: QC.bg, borderRadius: '24px', border: `1px solid ${QC.border}`, padding: '24px 28px' }}>
          <h3 style={{ margin: '0 0 4px', color: QC.textPrimary, fontWeight: '800' }}><i className="bi bi-keyboard" /> Ingreso manual</h3>
          <p style={{ margin: '0 0 16px', color: QC.textSecondary, fontSize: '0.88rem' }}>Pega el ID de reserva del jugador (visible en su QR).</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              value={qrManualId}
              onChange={e => setQrManualId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && qrManualId.trim() && verifyId(qrManualId)}
              placeholder="Ej. 3f8a1b2c-4d5e-6f7a-8b9c-0d1e2f3a4b5c"
              style={{ flex: 1, padding: '13px 16px', borderRadius: '12px', border: `2px solid ${QC.inputBorder}`, background: QC.inputBg, color: QC.textPrimary, fontSize: '0.9rem', outline: 'none', fontFamily: 'monospace' }}
              onFocus={e => e.target.style.borderColor = '#00d084'}
              onBlur={e => e.target.style.borderColor = QC.inputBorder}
            />
            <button onClick={() => qrManualId.trim() && verifyId(qrManualId)}
              disabled={!qrManualId.trim()}
              className="btn-dark-ps"
              style={{ padding: '13px 20px', cursor: qrManualId.trim() ? 'pointer' : 'not-allowed', opacity: qrManualId.trim() ? 1 : 0.5, whiteSpace: 'nowrap' }}>
              Verificar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropietarioDashboard;
