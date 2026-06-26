const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function MiniBar({ value, max, color = '#00d084', label, sublabel }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:70, flexShrink:0, textAlign:'right' }}>
        <span style={{ fontSize:'0.78rem', fontWeight:700, color:'#94a3b8', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', display:'block' }}>{label}</span>
        {sublabel && <span style={{ fontSize:'0.68rem', color:'#475569' }}>{sublabel}</span>}
      </div>
      <div style={{ flex:1, height:8, borderRadius:99, background:'#1e293b', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, borderRadius:99, background:color, transition:'width 0.7s ease', boxShadow:`0 0 6px ${color}60` }} />
      </div>
      <span style={{ width:28, textAlign:'right', fontSize:'0.82rem', fontWeight:900, color, flexShrink:0 }}>{value}</span>
    </div>
  );
}

export default function EstadisticasTab({ reservas = [], gamification, loadingReservas, darkMode, C }) {
  // ── Derived data ───────────────────────────────────────────────────────────
  const attended  = reservas.filter(r => r.apiStatus === 'ATTENDED');
  const confirmed = reservas.filter(r => r.apiStatus === 'CONFIRMED');
  const total     = reservas.length;
  const horasJugadas = attended.length; // 1 reserva = 1 hora

  // Sports breakdown
  const sportMap = {};
  attended.forEach(r => {
    const s = r.court?.split(' ')[0] || 'Otro';
    sportMap[s] = (sportMap[s] || 0) + 1;
  });
  const sportEntries = Object.entries(sportMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSport = Math.max(...sportEntries.map(e => e[1]), 1);

  // Activity last 6 months
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const y = d.getFullYear();
    const m = d.getMonth();
    const count = attended.filter(r => {
      if (!r.rawDate) return false;
      const rd = new Date(r.rawDate + 'T12:00');
      return rd.getFullYear() === y && rd.getMonth() === m;
    }).length;
    return { label: MONTHS_ES[m], count };
  });
  const maxMonth = Math.max(...last6.map(d => d.count), 1);

  // Streak: consecutive months with at least 1 game
  let streak = 0;
  for (let i = last6.length - 1; i >= 0; i--) {
    if (last6[i].count > 0) streak++;
    else break;
  }

  // Win rate (attended / total confirmed+attended)
  const completedOrAttended = reservas.filter(r => r.apiStatus === 'ATTENDED' || r.apiStatus === 'CONFIRMED').length;
  const winRate = completedOrAttended > 0 ? Math.round((attended.length / completedOrAttended) * 100) : 0;

  // Favourite court
  const courtMap = {};
  attended.forEach(r => { courtMap[r.court] = (courtMap[r.court] || 0) + 1; });
  const favCourt = Object.entries(courtMap).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  const barColor = '#00d084';
  const textColor  = darkMode ? '#f8fafc' : '#0f172a';
  const mutedColor = darkMode ? '#64748b' : '#94a3b8';
  const cardBg     = darkMode ? '#0f172a' : '#fff';
  const cardBorder = darkMode ? '#1e293b' : '#e2e8f0';

  if (loadingReservas) {
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ height:120, borderRadius:16, background:'linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.4s infinite' }} />
        ))}
        <style>{`@keyframes shimmer{to{background-position:-200% 0}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16 }}>
        {[
          { label:'Horas jugadas',      value: horasJugadas,                       icon:'bi-clock-fill',     color:'#00d084' },
          { label:'Partidos totales',   value: total,                              icon:'bi-calendar3',      color:'#3b82f6' },
          { label:'Nivel actual',       value: gamification?.level ?? '—',         icon:'bi-trophy-fill',    color:'#f59e0b' },
          { label:'Puntos PlayStop',    value: `${gamification?.totalPoints ?? 0}`, icon:'bi-star-fill',     color:'#8b5cf6' },
        ].map(k => (
          <div key={k.label} style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:'18px 20px', borderTop:`3px solid ${k.color}`, display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:`${k.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 }}>
              <i className={`bi ${k.icon}`} style={{ color:k.color }} />
            </div>
            <div>
              <div style={{ fontSize:'0.72rem', fontWeight:700, color:mutedColor, textTransform:'uppercase', letterSpacing:'0.3px', marginBottom:3 }}>{k.label}</div>
              <div style={{ fontSize:'1.5rem', fontWeight:900, color:textColor, lineHeight:1 }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Racha + Cancha favorita */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
        <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:'20px 22px', display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ fontSize:'2.4rem', lineHeight:1 }}>🔥</div>
          <div>
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:mutedColor, textTransform:'uppercase', letterSpacing:'0.3px', marginBottom:3 }}>Racha activa</div>
            <div style={{ fontSize:'1.8rem', fontWeight:900, color: streak > 0 ? '#f59e0b' : textColor, lineHeight:1 }}>{streak} mes{streak !== 1 ? 'es' : ''}</div>
            <div style={{ fontSize:'0.75rem', color:mutedColor, marginTop:4 }}>
              {streak === 0 ? 'Juega este mes para empezar tu racha' : streak >= 3 ? '¡Imparable! Sigue así 💪' : 'Buen ritmo, ¡no pares!'}
            </div>
          </div>
        </div>

        <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:'20px 22px', display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ width:46, height:46, borderRadius:12, background:'rgba(0,208,132,0.12)', border:'1px solid rgba(0,208,132,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>
            <i className="bi bi-building-fill" style={{ color:'#00d084' }} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:mutedColor, textTransform:'uppercase', letterSpacing:'0.3px', marginBottom:3 }}>Cancha favorita</div>
            <div style={{ fontSize:'1rem', fontWeight:800, color:textColor, lineHeight:1.2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{favCourt}</div>
            <div style={{ fontSize:'0.75rem', color:mutedColor, marginTop:4 }}>
              {courtMap[favCourt] ? `${courtMap[favCourt]} partido${courtMap[favCourt] !== 1 ? 's' : ''} jugado${courtMap[favCourt] !== 1 ? 's' : ''}` : ''}
            </div>
          </div>
        </div>

        <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:'20px 22px', display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ position:'relative', width:56, height:56, flexShrink:0 }}>
            <svg viewBox="0 0 36 36" style={{ width:'100%', height:'100%', transform:'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={darkMode ? '#1e293b' : '#e2e8f0'} strokeWidth="3.2" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#00d084" strokeWidth="3.2"
                strokeDasharray={`${winRate} ${100 - winRate}`} strokeLinecap="round"
                style={{ transition:'stroke-dasharray 0.7s ease' }} />
            </svg>
            <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:900, color:textColor }}>{winRate}%</span>
          </div>
          <div>
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:mutedColor, textTransform:'uppercase', letterSpacing:'0.3px', marginBottom:3 }}>Tasa de asistencia</div>
            <div style={{ fontSize:'1rem', fontWeight:800, color:textColor, lineHeight:1.2 }}>
              {winRate >= 80 ? '¡Excelente!' : winRate >= 50 ? 'Buen nivel' : 'Puedes mejorar'}
            </div>
            <div style={{ fontSize:'0.75rem', color:mutedColor, marginTop:4 }}>{attended.length} de {completedOrAttended} reservas asistidas</div>
          </div>
        </div>
      </div>

      {/* Actividad últimos 6 meses */}
      <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:'22px 24px' }}>
        <h3 style={{ margin:'0 0 20px', color:textColor, fontSize:'1.05rem', fontWeight:800 }}>
          <i className="bi bi-graph-up" style={{ color:barColor, marginRight:8 }} />
          Actividad — últimos 6 meses
        </h3>
        {attended.length === 0 ? (
          <p style={{ margin:0, color:mutedColor, textAlign:'center', padding:'20px 0', fontSize:'0.88rem' }}>Aún no hay partidos completados.</p>
        ) : (
          <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:130 }}>
            {last6.map((d, i) => (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5, height:'100%', justifyContent:'flex-end' }}>
                {d.count > 0 && (
                  <span style={{ fontSize:'0.7rem', fontWeight:800, color:barColor }}>{d.count}</span>
                )}
                <div style={{ width:'100%', borderRadius:8, background: d.count > 0 ? barColor : (darkMode ? '#1e293b' : '#e2e8f0'), height:`${Math.max((d.count / maxMonth) * 110, d.count > 0 ? 10 : 4)}px`, transition:'height 0.6s ease', boxShadow: d.count > 0 ? `0 0 10px ${barColor}40` : 'none' }} />
                <span style={{ fontSize:'0.72rem', color:mutedColor, fontWeight:600 }}>{d.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deporte favorito */}
      {sportEntries.length > 0 && (
        <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:'22px 24px' }}>
          <h3 style={{ margin:'0 0 18px', color:textColor, fontSize:'1.05rem', fontWeight:800 }}>
            <i className="bi bi-trophy-fill" style={{ color:'#f59e0b', marginRight:8 }} />
            Deportes más jugados
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {sportEntries.map(([sport, count], i) => (
              <MiniBar
                key={sport}
                label={sport}
                value={count}
                max={maxSport}
                color={['#00d084','#3b82f6','#f59e0b','#8b5cf6','#ef4444'][i % 5]}
              />
            ))}
          </div>
        </div>
      )}

      {total === 0 && (
        <div style={{ background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:16, padding:'40px 24px', textAlign:'center' }}>
          <div style={{ fontSize:'3rem', marginBottom:12 }}>⚽</div>
          <p style={{ margin:'0 0 6px', color:textColor, fontWeight:700, fontSize:'1.05rem' }}>Sin historial aún</p>
          <p style={{ margin:0, color:mutedColor, fontSize:'0.88rem' }}>Haz tu primera reserva para empezar a ver tus estadísticas.</p>
        </div>
      )}
    </div>
  );
}