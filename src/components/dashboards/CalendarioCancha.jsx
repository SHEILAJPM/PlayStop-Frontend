import { useState, useMemo } from 'react';
import { MetricCard } from './DashboardLayout.jsx';

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];
const DIAS_SEMANA = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

const getStatusStyles = (darkMode) => ({
  Pagado:    { dot: '#2563eb', bg: darkMode ? 'rgba(37,99,235,.16)'  : '#dbeafe', text: darkMode ? '#93c5fd' : '#1e40af' },
  Asistió:   { dot: '#8b5cf6', bg: darkMode ? 'rgba(139,92,246,.16)' : '#ede9fe', text: darkMode ? '#c4b5fd' : '#5b21b6' },
  Pendiente: { dot: '#f59e0b', bg: darkMode ? 'rgba(245,158,11,.16)' : '#fef3c7', text: darkMode ? '#fcd34d' : '#92400e' },
  Cancelada: { dot: '#ef4444', bg: darkMode ? 'rgba(239,68,68,.16)'  : '#fee2e2', text: darkMode ? '#fca5a5' : '#991b1b' },
});

const fmt2 = (n) => String(n).padStart(2, '0');

const formatDateLabel = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const wd = DIAS_SEMANA[new Date(y, m - 1, d).getDay()];
  return `${wd}, ${d} de ${MESES[m - 1]} de ${y}`;
};

const CalendarioCancha = ({ reservas = [], darkMode = false }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDay, setSelectedDay] = useState(null);

  const C = {
    textPrimary:   darkMode ? '#f8fafc' : '#0f172a',
    textSecondary: darkMode ? '#94a3b8' : '#475569',
    textMuted:     darkMode ? '#64748b' : '#94a3b8',
    cardBg:        darkMode ? 'rgba(255,255,255,.02)' : '#ffffff',
    cellBorder:    darkMode ? '#1e293b' : '#f1f5f9',
    divider:       darkMode ? '#1e293b' : '#f1f5f9',
    todayRing:     '#3b82f6',
    todayBg:       darkMode ? 'rgba(59,130,246,.1)' : '#eff6ff',
    selectedBg:    darkMode ? '#f8fafc' : '#0f172a',
    selectedText:  darkMode ? '#0f172a' : '#fff',
    navBtnBg:      darkMode ? 'rgba(255,255,255,.06)' : '#f8fafc',
    navBtnBorder:  darkMode ? '#1e293b' : '#e2e8f0',
    navBtnColor:   darkMode ? '#e2e8f0' : '#475569',
    todayBtnBg:    darkMode ? 'rgba(59,130,246,.15)' : '#eff6ff',
    detailChipBg:  darkMode ? 'rgba(255,255,255,.06)' : '#ffffff',
  };
  const STATUS_STYLES = getStatusStyles(darkMode);

  const prevMonth = () =>
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const goToday = () => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(today.toISOString().split('T')[0]);
  };

  // Group reservations by date string
  const byDate = useMemo(() => {
    const map = {};
    reservas.forEach(r => {
      if (!r.date) return;
      if (!map[r.date]) map[r.date] = [];
      map[r.date].push(r);
    });
    return map;
  }, [reservas]);

  // Build the 7-column grid for the current month
  const cells = useMemo(() => {
    const year  = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const lastDay  = new Date(year, month + 1, 0).getDate();
    const grid = [];
    for (let i = 0; i < firstDow; i++) grid.push(null);
    for (let d = 1; d <= lastDay; d++) {
      const dateStr = `${year}-${fmt2(month + 1)}-${fmt2(d)}`;
      grid.push({ d, dateStr, rsvs: byDate[dateStr] || [] });
    }
    return grid;
  }, [viewDate, byDate]);

  const todayStr = today.toISOString().split('T')[0];
  const selectedRsvs = selectedDay ? (byDate[selectedDay] || []) : [];

  // Dominant colour for a day cell
  const cellStyle = (rsvs) => {
    if (!rsvs.length) return { bg: 'transparent', dot: null };
    if (rsvs.some(r => r.status === 'Pagado'))    return { bg: STATUS_STYLES.Pagado.bg,    dot: STATUS_STYLES.Pagado.dot };
    if (rsvs.some(r => r.status === 'Asistió'))   return { bg: STATUS_STYLES.Asistió.bg,   dot: STATUS_STYLES.Asistió.dot };
    if (rsvs.some(r => r.status === 'Pendiente')) return { bg: STATUS_STYLES.Pendiente.bg, dot: STATUS_STYLES.Pendiente.dot };
    return { bg: STATUS_STYLES.Cancelada.bg, dot: STATUS_STYLES.Cancelada.dot };
  };

  // Summary metrics
  const esMismoMes = (r) => {
    const [y, m] = (r.date || '').split('-').map(Number);
    return y === viewDate.getFullYear() && m === viewDate.getMonth() + 1;
  };
  const totalMes      = reservas.filter(esMismoMes).length;
  const pagadasMes    = reservas.filter(r => esMismoMes(r) && (r.status === 'Pagado' || r.status === 'Asistió')).length;
  const canceladasMes = reservas.filter(r => esMismoMes(r) && r.status === 'Cancelada').length;

  const navBtnStyle = {
    padding: '8px 16px',
    borderRadius: '10px',
    border: `1px solid ${C.navBtnBorder}`,
    backgroundColor: C.navBtnBg,
    color: C.navBtnColor,
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <style>{`
        @media (max-width: 480px) {
          .cal-day-cell { min-height: 48px !important; padding: 6px 3px !important; }
          .cal-rsv-label { display: none !important; }
        }
      `}</style>

      {/* ── Métricas del mes ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        <MetricCard title="Reservas este mes" value={totalMes} subtitle={`${MESES[viewDate.getMonth()]} ${viewDate.getFullYear()}`} color="#3b82f6" />
        <MetricCard title="Confirmadas" value={pagadasMes} subtitle="Pagadas o asistidas" color="#2563eb" />
        <MetricCard title="Canceladas" value={canceladasMes} subtitle="Este mes" color="#ef4444" />
      </div>

      {/* ── Calendario ── */}
      <div className="dashboard-card-ps">

        {/* Header de navegación */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <button onClick={prevMonth} style={navBtnStyle}>← Anterior</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: C.textPrimary }}>
              {MESES[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h3>
            <button onClick={goToday} style={{ ...navBtnStyle, backgroundColor: C.todayBtnBg, color: '#3b82f6', border: '1px solid transparent' }}>Hoy</button>
          </div>
          <button onClick={nextMonth} style={navBtnStyle}>Siguiente →</button>
        </div>

        {/* Encabezados de días */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
          {DIAS_SEMANA.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: '800', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '4px 0' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid de días */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {cells.map((cell, i) => {
            if (!cell) return <div key={`empty-${i}`} />;
            const { bg, dot } = cellStyle(cell.rsvs);
            const isToday    = cell.dateStr === todayStr;
            const isSelected = cell.dateStr === selectedDay;
            const hasRsvs    = cell.rsvs.length > 0;

            return (
              <div
                key={cell.dateStr}
                className="cal-day-cell"
                onClick={() => setSelectedDay(isSelected ? null : cell.dateStr)}
                style={{
                  minHeight: '64px',
                  padding: '8px 6px',
                  borderRadius: '10px',
                  border: isSelected
                    ? `2px solid ${C.selectedBg}`
                    : isToday
                    ? `2px solid ${C.todayRing}`
                    : `1px solid ${C.cellBorder}`,
                  backgroundColor: isSelected ? C.selectedBg : isToday && bg === 'transparent' ? C.todayBg : (bg || C.cardBg),
                  cursor: hasRsvs ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.25)' : 'none',
                }}
                onMouseOver={e => { if (hasRsvs && !isSelected) e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; }}
              >
                <span style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: isToday ? '900' : '600',
                  color: isSelected ? C.selectedText : isToday ? C.todayRing : C.textPrimary,
                }}>
                  {cell.d}
                </span>

                {hasRsvs && (
                  <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      backgroundColor: isSelected ? C.selectedText : dot,
                      flexShrink: 0,
                    }} />
                    <span className="cal-rsv-label" style={{
                      fontSize: '0.7rem', fontWeight: '800',
                      color: isSelected ? (darkMode ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.85)') : C.textSecondary,
                    }}>
                      {cell.rsvs.length} rsv
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Leyenda */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap', paddingTop: '16px', borderTop: `1px solid ${C.divider}` }}>
          {Object.entries(STATUS_STYLES).map(([label, s]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: s.bg, border: `1px solid ${s.dot}` }} />
              <span style={{ fontSize: '0.8rem', color: C.textSecondary, fontWeight: '600' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panel de detalle del día seleccionado ── */}
      {selectedDay && (
        <div className="dashboard-card-ps" style={{ animation: 'slideDown 0.25s ease' }}>
          <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`}</style>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h4 style={{ margin: '0 0 2px', fontSize: '1.1rem', fontWeight: '900', color: C.textPrimary }}>
                {formatDateLabel(selectedDay)}
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: C.textSecondary }}>
                {selectedRsvs.length === 0
                  ? 'Sin reservas para este día'
                  : `${selectedRsvs.length} reserva${selectedRsvs.length > 1 ? 's' : ''}`}
              </p>
            </div>
            <button onClick={() => setSelectedDay(null)} style={{ background: 'transparent', border: `1px solid ${C.navBtnBorder}`, borderRadius: '8px', padding: '6px 14px', fontSize: '0.85rem', color: C.textSecondary, cursor: 'pointer', fontWeight: '700' }}>
              Cerrar
            </button>
          </div>

          {selectedRsvs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: C.textMuted }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}><i className="bi bi-inbox" /></div>
              <p style={{ margin: 0, fontWeight: '600' }}>No hay reservas para este día.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedRsvs
                .slice()
                .sort((a, b) => {
                  const hourA = parseInt((a.time || '0:00').split(':')[0]);
                  const hourB = parseInt((b.time || '0:00').split(':')[0]);
                  return hourA - hourB;
                })
                .map(r => {
                  const st = STATUS_STYLES[r.status] || { dot: C.textMuted, bg: C.navBtnBg, text: C.textSecondary };
                  return (
                    <div key={r.id} style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '14px 18px',
                      backgroundColor: st.bg,
                      borderRadius: '12px',
                      border: `1px solid ${st.dot}33`,
                      flexWrap: 'wrap',
                    }}>
                      {/* Hora */}
                      <div style={{ minWidth: '100px', display: 'flex', alignItems: 'center', gap: '8px', color: C.textPrimary }}>
                        <i className="bi bi-clock" style={{ fontSize: '1rem' }} />
                        <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>{r.time}</span>
                      </div>
                      {/* Cancha */}
                      <div style={{ flex: 1, minWidth: '120px' }}>
                        <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem', color: C.textPrimary }}>{r.court}</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: C.textSecondary }}>
                          {r.client || r.clientName || 'Cliente'}
                          {r.clientEmail ? ` · ${r.clientEmail}` : ''}
                        </p>
                      </div>
                      {/* Monto */}
                      <span style={{ fontWeight: '900', fontSize: '1rem', color: C.textPrimary }}>{r.amount}</span>
                      {/* Estado */}
                      <span style={{
                        fontSize: '0.75rem', fontWeight: '800',
                        color: st.text, backgroundColor: C.detailChipBg,
                        padding: '3px 10px', borderRadius: '20px',
                        border: `1px solid ${st.dot}55`,
                      }}>
                        {r.status}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarioCancha;
