import { useState } from 'react';
import EmptyState from '../shared/EmptyState.jsx';
import { SkeletonTable } from '../DashboardLayout.jsx';
import ReservationChat from '../../chat/ReservationChat.jsx';

const STATUS_FILTERS = [
  { label: 'Todas', value: 'ALL' },
  { label: 'Confirmadas', value: 'CONFIRMED' },
  { label: 'Completadas', value: 'ATTENDED' },
  { label: 'Canceladas', value: 'CANCELLED' },
];

const ReservasTab = ({ reservas, loadingReservas, openModal, openReview, reviewedIds, setQrModal, setMapModal, setActiveTab, darkMode, C, currentUser, unreadChats = new Set(), onChatOpen }) => {
  const [reservaSearch, setReservaSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [chatModal, setChatModal] = useState(null); // { reservationId, reservationInfo }

  const filtered = reservas.filter(r => {
    const matchStatus = statusFilter === 'ALL' || r.apiStatus === statusFilter;
    const matchSearch = !reservaSearch || r.court.toLowerCase().includes(reservaSearch.toLowerCase()) || r.date.toLowerCase().includes(reservaSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <style>{`
        .reserva-actions { flex-wrap: wrap; }
        @media (max-width: 640px) {
          .reserva-actions {
            flex-basis: 100%;
            flex-direction: column;
            align-items: stretch;
          }
          .reserva-actions > * { width: 100%; justify-content: center; box-sizing: border-box; }
        }
      `}</style>

      {/* Estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total reservas',  val: reservas.length,                                          icon: 'bi-calendar3',        color: '#3b82f6' },
          { label: 'Confirmadas',     val: reservas.filter(r => r.apiStatus === 'CONFIRMED').length,  icon: 'bi-check-circle-fill', color: '#2563eb' },
          { label: 'Completadas',     val: reservas.filter(r => r.apiStatus === 'ATTENDED').length,   icon: 'bi-award-fill',        color: '#8b5cf6' },
          { label: 'Canceladas',      val: reservas.filter(r => r.apiStatus === 'CANCELLED').length,  icon: 'bi-x-circle-fill',     color: '#ef4444' },
        ].map(stat => (
          <div key={stat.label} style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: `4px solid ${stat.color}` }}>
            <i className={`bi ${stat.icon}`} style={{ fontSize: '1.6rem', color: stat.color }} />
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: C.textPrimary, lineHeight: 1 }}>{stat.val}</div>
              <div style={{ fontSize: '0.78rem', color: C.textMuted, fontWeight: '600', marginTop: '2px' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', overflow: 'hidden' }}>
        {/* Cabecera */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, color: C.textPrimary, fontSize: '1.15rem', fontWeight: '800' }}>Historial de Reservas</h3>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.textMuted, fontSize: '0.85rem', pointerEvents: 'none' }} />
              <input
                type="text" value={reservaSearch}
                onChange={e => setReservaSearch(e.target.value)}
                placeholder="Buscar reserva..."
                style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 10, border: `1.5px solid ${C.cardBorder}`, background: C.inputBg, color: C.textPrimary, fontSize: '0.88rem', outline: 'none', width: 200 }}
              />
            </div>
            <button onClick={() => setActiveTab('Buscar Canchas')} className="btn-primary-ps" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              + Nueva reserva
            </button>
          </div>
        </div>

        {/* Filtros de estado */}
        <div style={{ padding: '12px 24px', borderBottom: `1px solid ${C.cardBorder}`, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map(f => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)}
              style={{
                padding: '6px 14px', borderRadius: 99, border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                background: statusFilter === f.value ? (darkMode ? '#2563eb' : '#0f172a') : (darkMode ? '#1e293b' : '#f1f5f9'),
                color: statusFilter === f.value ? (darkMode ? '#0f172a' : '#fff') : C.textSecondary,
              }}>
              {f.label}
            </button>
          ))}
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
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px 24px' }}>
            <EmptyState icon="bi-funnel" title="Sin resultados" message="No hay reservas que coincidan con el filtro seleccionado." darkMode={darkMode} cta={{ label: 'Ver todas', onClick: () => { setStatusFilter('ALL'); setReservaSearch(''); } }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((row, idx) => (
              <div key={row.id} style={{
                padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px',
                flexWrap: 'wrap', borderBottom: idx < filtered.length - 1 ? `1px solid ${C.cardBorder}` : 'none',
                transition: 'background .15s',
              }}
                onMouseOver={e => e.currentTarget.style.background = darkMode ? '#1a2236' : '#fafbff'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Ícono de estado */}
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0, background: row.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                  <i className={`bi ${row.apiStatus === 'CONFIRMED' ? 'bi-check-circle-fill' : row.apiStatus === 'CANCELLED' ? 'bi-x-circle-fill' : row.apiStatus === 'ATTENDED' ? 'bi-award-fill' : 'bi-hourglass-split'}`} style={{ color: row.color }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <div style={{ fontWeight: '800', color: C.textPrimary, fontSize: '0.95rem', marginBottom: '2px' }}>{row.court}</div>
                  <div style={{ fontSize: '0.82rem', color: C.textMuted }}>{row.date}</div>
                </div>

                {/* Badge de estado */}
                <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '800', color: row.color, background: row.bg, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {row.status}
                </span>

                {/* Acciones */}
                <div className="reserva-actions" style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  {/* Mapa */}
                  <button
                    onClick={() => setMapModal({ show: true, cancha: { name: row.court, location: row.courtAddress, lat: row.courtLat, lng: row.courtLng, district: '', city: '' } })}
                    style={{ padding: '7px 13px', borderRadius: '9px', border: 'none', background: darkMode ? 'rgba(59,130,246,.15)' : '#eff6ff', color: '#3b82f6', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className="bi bi-geo-alt-fill" /> Cómo llegar
                  </button>

                  {/* QR */}
                  {(row.apiStatus === 'CONFIRMED' || row.apiStatus === 'PENDING') && (
                    <button
                      onClick={() => setQrModal({ show: true, reservationId: row.id, courtName: row.court, date: row.rawDate, slot: row.slotLabel, timestamp: Date.now() })}
                      style={{ padding: '7px 13px', borderRadius: '9px', border: 'none', background: darkMode ? '#1e293b' : '#0f172a', color: '#2563eb', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="bi bi-qr-code-scan" /> Ver QR
                    </button>
                  )}

                  {/* Chat — disponible en cualquier reserva no cancelada */}
                  {row.apiStatus !== 'CANCELLED' && (
                    <button
                      onClick={() => {
                        onChatOpen?.(row.id);
                        setChatModal({ reservationId: row.id, reservationInfo: { court: row.court, date: row.date, slot: row.slotLabel || '' } });
                      }}
                      style={{ position: 'relative', padding: '7px 13px', borderRadius: '9px', border: 'none', background: darkMode ? 'rgba(37, 99, 235, 0.12)' : '#f0fdf4', color: '#2563eb', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="bi bi-chat-dots-fill" /> Chat
                      {unreadChats.has(row.id.toString()) && (
                        <span style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: '50%', background: '#ef4444', border: `2px solid ${darkMode ? '#0f172a' : '#fff'}` }} />
                      )}
                    </button>
                  )}

                  {/* Google Calendar */}
                  {(row.apiStatus === 'CONFIRMED' || row.apiStatus === 'PENDING') && (() => {
                    const hourMatch = (row.slotLabel || row.time || '').match(/^(\d+):/);
                    if (!hourMatch) return null;
                    const h = parseInt(hourMatch[1]);
                    const dateStr = (row.rawDate || row.date || '').replace(/-/g, '');
                    if (!dateStr || dateStr.length < 8) return null;
                    const pad = n => String(n).padStart(2, '0');
                    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE`
                      + `&text=${encodeURIComponent('Reserva en ' + row.court + ' — PlayStop')}`
                      + `&dates=${dateStr}T${pad(h)}0000/${dateStr}T${pad(h + 1)}0000`
                      + `&details=${encodeURIComponent('Reserva confirmada en PlayStop')}`
                      + `&location=${encodeURIComponent(row.courtAddress || row.court)}`;
                    return (
                      <a key="gcal" href={calUrl} target="_blank" rel="noreferrer"
                        style={{ padding: '7px 13px', borderRadius: '9px', border: 'none', background: 'rgba(66,133,244,0.15)', color: '#4285F4', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                        <i className="bi bi-calendar-plus-fill" /> Calendario
                      </a>
                    );
                  })()}

                  {/* Compartir por WhatsApp */}
                  {row.apiStatus === 'CONFIRMED' && (
                    <button
                      onClick={() => {
                        const texto = `⚽ ¡Reserva confirmada en PlayStop!\n🏟️ ${row.court}\n📅 ${row.date}\nReserva tu turno en https://playstop.pe`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
                      }}
                      style={{ padding: '7px 13px', borderRadius: '9px', border: 'none', background: 'rgba(37,211,102,0.15)', color: '#25D366', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="bi bi-whatsapp" /> Compartir
                    </button>
                  )}

                  {/* Dejar reseña */}
                  {row.apiStatus === 'ATTENDED' && !reviewedIds.has(row.id) && (
                    <button
                      onClick={() => openReview(row)}
                      style={{ padding: '7px 13px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="bi bi-star-fill" /> Dejar reseña
                    </button>
                  )}
                  {row.apiStatus === 'ATTENDED' && reviewedIds.has(row.id) && (
                    <span style={{ padding: '7px 13px', borderRadius: '9px', background: darkMode ? 'rgba(245,158,11,0.12)' : '#fef3c7', color: '#d97706', fontWeight: '700', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="bi bi-star-fill" /> Reseñado
                    </span>
                  )}

                  {/* Cancelar */}
                  {row.apiStatus !== 'CANCELLED' && row.apiStatus !== 'ATTENDED' && (
                    <button onClick={() => openModal('CANCELAR_RESERVA', row)}
                      style={{ padding: '7px 13px', borderRadius: '9px', border: 'none', background: darkMode ? 'rgba(239,68,68,.15)' : '#fee2e2', color: darkMode ? '#f87171' : '#ef4444', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de chat */}
      {chatModal && (
        <ReservationChat
          reservationId={chatModal.reservationId}
          reservationInfo={chatModal.reservationInfo}
          currentUser={currentUser}
          onClose={() => setChatModal(null)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default ReservasTab;
