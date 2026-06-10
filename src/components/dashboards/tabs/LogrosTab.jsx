import EmptyState from '../shared/EmptyState.jsx';

const LogrosTab = ({ gamification, loadingGami, darkMode, C }) => {
  if (loadingGami) {
    return (
      <div>
        <div className="skeleton" style={{ height: 200, borderRadius: 24, marginBottom: 28 }} />
        <div className="skeleton" style={{ height: 100, borderRadius: 20, marginBottom: 28 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 96, borderRadius: 16 }} />)}
        </div>
      </div>
    );
  }

  if (!gamification) {
    return <EmptyState icon="bi-trophy-fill" title="No disponible" message="No se pudo cargar tu perfil de logros." darkMode={darkMode} />;
  }

  const thresholds = [0, 100, 250, 500, 1000, 2000];
  const lvl = gamification.level - 1;
  const from = thresholds[lvl] ?? 0;
  const to = thresholds[lvl + 1] ?? from + 1000;
  const progressPct = Math.min(100, ((gamification.totalPoints - from) / (to - from)) * 100);

  return (
    <div>
      <style>{`
        @keyframes fillBar { from { width: 0; } to { width: var(--bar-pct); } }
        @keyframes badgePop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f4c75 100%)', borderRadius: '24px', padding: '32px', marginBottom: '28px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(0,208,132,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-50px', right: '100px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(59,130,246,0.08)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>Tu nivel actual</div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-0.5px' }}>{gamification.levelName}</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Nivel {gamification.level}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>Puntos totales</div>
              <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#00d084', letterSpacing: '-1px', lineHeight: 1 }}>{gamification.totalPoints.toLocaleString()}</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>pts acumulados</div>
            </div>
          </div>

          {gamification.pointsToNextLevel > 0 ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'rgba(255,255,255,0.7)' }}>Progreso al siguiente nivel</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#00d084' }}>{gamification.pointsToNextLevel} pts restantes</span>
              </div>
              <div style={{ height: '8px', borderRadius: '99px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #00d084, #3b82f6)', width: `${progressPct}%`, animation: 'fillBar 1s ease forwards', '--bar-pct': `${progressPct}%` }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,208,132,0.15)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(0,208,132,0.3)' }}>
              <i className="bi bi-trophy-fill" style={{ fontSize: '1.2rem', color: '#00d084' }} />
              <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#00d084' }}>¡Has alcanzado el nivel máximo! Eres una leyenda.</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '20px 24px', marginBottom: '28px' }}>
        <h3 style={{ margin: '0 0 16px', color: C.textPrimary, fontSize: '1rem', fontWeight: '800' }}>¿Cómo ganar puntos?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {[
            { icon: 'bi-check-circle-fill', label: 'Partido completado',    pts: '+5 pts' },
            { icon: 'bi-geo-alt-fill',      label: 'Primera reserva',       pts: '+10 pts' },
            { icon: 'bi-pencil-fill',        label: 'Primera reseña',        pts: '+20 pts' },
            { icon: 'bi-award-fill',         label: 'Logros desbloqueados',  pts: '+ bonus' },
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

      <h3 style={{ margin: '0 0 16px', color: C.textPrimary, fontSize: '1.15rem', fontWeight: '800' }}>
        Logros ({gamification.achievements.filter(a => a.unlocked).length}/{gamification.achievements.length} desbloqueados)
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {gamification.achievements.map((a, i) => (
          <div key={a.id} style={{
            background: C.cardBg,
            border: `1px solid ${a.unlocked ? (darkMode ? 'rgba(0,208,132,0.4)' : 'rgba(0,208,132,0.5)') : C.cardBorder}`,
            borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px',
            opacity: a.unlocked ? 1 : 0.55,
            animation: a.unlocked ? `badgePop 0.4s ease ${i * 0.05}s both` : 'none',
            position: 'relative', overflow: 'hidden',
          }}>
            {a.unlocked && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #00d084, #3b82f6)', borderRadius: '16px 16px 0 0' }} />}
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
              background: a.unlocked ? 'linear-gradient(135deg, rgba(0,208,132,0.15), rgba(59,130,246,0.15))' : (darkMode ? '#1e293b' : '#f1f5f9'),
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
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
            {!a.unlocked && <div style={{ fontSize: '1.2rem', color: C.textMuted, flexShrink: 0 }}><i className="bi bi-lock-fill" /></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogrosTab;
