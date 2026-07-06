import { useState, useMemo } from 'react';

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];
const DIAS_SEMANA = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

const STATUS_STYLES = {
  Pagado:   { dot: '#2563eb', bg: '#d1fae5', text: '#065f46' },
  Asistió:  { dot: '#8b5cf6', bg: '#ede9fe', text: '#5b21b6' },
  Pendiente:{ dot: '#f59e0b', bg: '#fef3c7', text: '#92400e' },
  Cancelada:{ dot: '#ef4444', bg: '#fee2e2', text: '#991b1b' },
};

const fmt2 = (n) => String(n).padStart(2, '0');

const formatDateLabel = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const wd = DIAS_SEMANA[new Date(y, m - 1, d).getDay()];
  return `${wd}, ${d} de ${MESES[m - 1]} de ${y}`;
};

const CalendarioCancha = ({ reservas = [] }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDay, setSelectedDay] = useState(null);

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
    if (rsvs.some(r => r.status === 'Pagado'))    return { bg: '#d1fae5', dot: '#2563eb' };
    if (rsvs.some(r => r.status === 'Asistió'))   return { bg: '#ede9fe', dot: '#8b5cf6' };
    if (rsvs.some(r => r.status === 'Pendiente')) return { bg: '#fef3c7', dot: '#f59e0b' };
    if (rsvs.some(r => r.status === 'Cancelada')) return { bg: '#fee2e2', dot: '#ef4444' };
    return { bg: '#fef3c7', dot: '#f59e0b' };
  };

  // Summary metrics
  const esMismoMes = (r) => {
    const [y, m] = (r.date || '').split('-').map(Number);
    return y === viewDate.getFullYear() && m === viewDate.getMonth() + 1;
  };
  const totalMes    = reservas.filter(esMismoMes).length;
  const pagadasMes  = reservas.filter(r => esMismoMes(r) && (r.status === 'Pagado' || r.status === 'Asistió')).length;
  const canceladasMes = reservas.filter(r => esMismoMes(r) && r.status === 'Cancelada').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Métricas del mes ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Reservas este mes', value: totalMes,                              color: '#3b82f6' },
          { label: 'Confirmadas',       value: pagadasMes,                            color: '#2563eb' },
          { label: 'Canceladas',        value: canceladasMes,                         color: '#ef4444' },
        ].map(m => (
          <div key={m.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 20px' }}>
            <p style={{ margin: '0 0 4px', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* ── Calendario ── */}
      <div className="dashboard-card">

        {/* Header de navegación */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <button onClick={prevMonth} style={navBtnStyle}>← Anterior</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: '#0f172a' }}>
              {MESES[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h3>
            <button onClick={goToday} style={{ ...navBtnStyle, backgroundColor: '#eff6ff', color: '#3b82f6' }}>Hoy</button>
          </div>
          <button onClick={nextMonth} style={navBtnStyle}>Siguiente →</button>
        </div>

        {/* Encabezados de días */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
          {DIAS_SEMANA.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '4px 0' }}>
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
                onClick={() => setSelectedDay(isSelected ? null : cell.dateStr)}
                style={{
                  minHeight: '64px',
                  padding: '8px 6px',
                  borderRadius: '10px',
                  border: isSelected
                    ? '2px solid #0f172a'
                    : isToday
                    ? '2px solid #3b82f6'
                    : '1px solid #f1f5f9',
                  backgroundColor: isSelected ? '#0f172a' : bg || '#fff',
                  cursor: hasRsvs ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(15,23,42,0.2)' : 'none',
                }}
                onMouseOver={e => { if (hasRsvs && !isSelected) e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; }}
              >
                <span style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: isToday ? '900' : '600',
                  color: isSelected ? '#fff' : isToday ? '#3b82f6' : '#0f172a',
                }}>
                  {cell.d}
                </span>

                {hasRsvs && (
                  <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      backgroundColor: isSelected ? '#fff' : dot,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: '0.7rem', fontWeight: '800',
                      color: isSelected ? 'rgba(255,255,255,0.85)' : '#475569',
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
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          {Object.entries(STATUS_STYLES).map(([label, s]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: s.bg, border: `1px solid ${s.dot}` }} />
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panel de detalle del día seleccionado ── */}
      {selectedDay && (
        <div className="dashboard-card" style={{ animation: 'slideDown 0.25s ease' }}>
          <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`}</style>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h4 style={{ margin: '0 0 2px', fontSize: '1.1rem', fontWeight: '900', color: '#0f172a' }}>
                {formatDateLabel(selectedDay)}
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                {selectedRsvs.length === 0
                  ? 'Sin reservas para este día'
                  : `${selectedRsvs.length} reserva${selectedRsvs.length > 1 ? 's' : ''}`}
              </p>
            </div>
            <button onClick={() => setSelectedDay(null)} style={{ background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 14px', fontSize: '0.85rem', color: '#64748b', cursor: 'pointer', fontWeight: '700' }}>
              Cerrar
            </button>
          </div>

          {selectedRsvs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
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
                  const st = STATUS_STYLES[r.status] || { dot: '#64748b', bg: '#f1f5f9', text: '#475569' };
                  return (
                    <div key={r.id} style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '14px 18px',
                      backgroundColor: st.bg,
                      borderRadius: '12px',
                      border: `1px solid ${st.dot}22`,
                      flexWrap: 'wrap',
                    }}>
                      {/* Hora */}
                      <div style={{ minWidth: '100px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bi bi-clock" style={{ fontSize: '1rem' }} />
                        <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#0f172a' }}>{r.time}</span>
                      </div>
                      {/* Cancha */}
                      <div style={{ flex: 1, minWidth: '120px' }}>
                        <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{r.court}</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                          {r.client || r.clientName || 'Cliente'}
                          {r.clientEmail ? ` · ${r.clientEmail}` : ''}
                        </p>
                      </div>
                      {/* Monto */}
                      <span style={{ fontWeight: '900', fontSize: '1rem', color: '#0f172a' }}>{r.amount}</span>
                      {/* Estado */}
                      <span style={{
                        fontSize: '0.75rem', fontWeight: '800',
                        color: st.text, backgroundColor: '#fff',
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

const navBtnStyle = {
  padding: '8px 16px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
  color: '#475569',
  fontWeight: '700',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

export default CalendarioCancha;
