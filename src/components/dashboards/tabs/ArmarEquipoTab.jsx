import { useState } from 'react';
import EmptyState from '../shared/EmptyState.jsx';

const ArmarEquipoTab = ({ user, darkMode, C }) => {
  const [equipoSessions, setEquipoSessions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('playspot_equipo_sessions') || '[]'); }
    catch { return []; }
  });
  const [newSession, setNewSession] = useState({ court: '', sport: 'Fútbol', date: '', time: '08:00', totalPlayers: 10, notes: '' });
  const [equipoModal, setEquipoModal] = useState(false);

  const saveAndSet = (sessions) => {
    setEquipoSessions(sessions);
    localStorage.setItem('playspot_equipo_sessions', JSON.stringify(sessions));
  };

  return (
    <div>
      <style>{`@keyframes sessionPop { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }`}</style>

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
          <button onClick={() => setEquipoModal(true)}
            style={{ background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff', border:'none', borderRadius:12, padding:'12px 22px', fontWeight:800, fontSize:'.95rem', cursor:'pointer', boxShadow:'0 8px 20px rgba(139,92,246,0.35)' }}>
            + Crear sesión
          </button>
        </div>
      </div>

      {equipoSessions.length === 0 ? (
        <EmptyState icon="bi-dribbble" title="Sin sesiones activas" message="Crea la primera sesión y encuentra compañeros para jugar." darkMode={darkMode} cta={{ label: '+ Crear sesión', onClick: () => setEquipoModal(true) }} />
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
                    <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.82rem', color:C.textMuted }}><i className="bi bi-calendar3" /><span>{s.date} • {s.time}</span></div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.82rem', color:C.textMuted }}><i className="bi bi-people-fill" /><span>{s.confirmed}/{s.totalPlayers} jugadores</span></div>
                    {s.notes && <div style={{ fontSize:'.8rem', color:C.textSecondary, background:C.infoBg, borderRadius:8, padding:'8px 10px', marginTop:4 }}>{s.notes}</div>}
                  </div>
                  <div style={{ height:4, borderRadius:99, background:darkMode?'#1e293b':'#e2e8f0', overflow:'hidden', marginBottom:14 }}>
                    <div style={{ height:'100%', borderRadius:99, background:spotColor, width:`${(s.confirmed/s.totalPlayers)*100}%`, transition:'width .4s ease' }} />
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    {!isFull && (
                      <button onClick={() => saveAndSet(equipoSessions.map(x => x.id === s.id ? { ...x, confirmed: x.confirmed + 1 } : x))}
                        style={{ flex:1, padding:'9px 0', borderRadius:10, border:'none', background:'linear-gradient(135deg,#8b5cf6,#6d28d9)', color:'#fff', fontWeight:700, fontSize:'.85rem', cursor:'pointer' }}>
                        Unirme
                      </button>
                    )}
                    <button onClick={() => { if (window.confirm('¿Eliminar esta sesión?')) saveAndSet(equipoSessions.filter(x => x.id !== s.id)); }}
                      style={{ padding:'9px 14px', borderRadius:10, border:`1px solid ${C.cardBorder}`, background:'transparent', color:C.textMuted, fontWeight:600, fontSize:'.82rem', cursor:'pointer' }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {equipoModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.88)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(12px)' }}>
          <div className="modal-box-ps" style={{ maxWidth:460 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <h2 className="modal-title-ps">Crear sesión de juego</h2>
              <button onClick={() => setEquipoModal(false)} className="modal-close-ps" aria-label="Cerrar">×</button>
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
                <button onClick={() => {
                  if (!newSession.date) { alert('Selecciona una fecha'); return; }
                  saveAndSet([{ ...newSession, id: Date.now(), confirmed: 1, createdBy: user?.name || 'Tú' }, ...equipoSessions]);
                  setEquipoModal(false);
                  setNewSession({ court: '', sport: 'Fútbol', date: '', time: '08:00', totalPlayers: 10, notes: '' });
                }} className="modal-btn-submit-ps">
                  Crear sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArmarEquipoTab;
