import { useState } from 'react';
import EmptyState from '../shared/EmptyState.jsx';
import { api } from '../../../services/api.js';

const AMIGOS_DEFAULT = [
  { id: 1, name: 'Martín Fernández', email: 'martin@gmail.com', img: 'https://randomuser.me/api/portraits/men/44.jpg',   level: 'Intermedio',   lastMatch: 'Ayer' },
  { id: 2, name: 'Lucía Gómez',      email: 'lucia@gmail.com',  img: 'https://randomuser.me/api/portraits/women/68.jpg', level: 'Avanzado',     lastMatch: 'Hace 3 días' },
  { id: 3, name: 'Carlos Ramírez',   email: 'carlos@gmail.com', img: 'https://randomuser.me/api/portraits/men/32.jpg',   level: 'Principiante', lastMatch: 'Hace 1 semana' },
  { id: 4, name: 'Valeria Castro',   email: 'vale@gmail.com',   img: 'https://randomuser.me/api/portraits/women/44.jpg', level: 'Intermedio',   lastMatch: 'Hace 2 semanas' },
];

const NIVEL_COLORS = {
  'Principiante': { color: '#f59e0b', bg: '#fef3c7' },
  'Intermedio':   { color: '#3b82f6', bg: '#eff6ff' },
  'Avanzado':     { color: '#00d084', bg: '#d1fae5' },
};

const AmigosTab = ({ darkMode, C }) => {
  const [amigos, setAmigos] = useState(AMIGOS_DEFAULT);
  const [emailBusqueda, setEmailBusqueda] = useState('');
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);
  const [buscandoAmigo, setBuscandoAmigo] = useState(false);

  const buscarAmigoPorEmail = async () => {
    const email = emailBusqueda.trim().toLowerCase();
    if (!email) return;
    setBuscandoAmigo(true);
    setResultadoBusqueda(null);
    try {
      const yaEsAmigo = amigos.find(a => a.email.toLowerCase() === email);
      if (yaEsAmigo) { setResultadoBusqueda({ type: 'already', ...yaEsAmigo }); return; }
      const user = await api.searchUserByEmail(email);
      if (user?.id) {
        setResultadoBusqueda({
          type: 'found', id: user.id,
          name: user.name || user.fullName || email.split('@')[0],
          email: user.email,
          img: user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || email)}&background=0f172a&color=fff&size=100`,
          level: user.level || 'Principiante',
          lastMatch: 'Nuevo',
        });
      } else {
        setResultadoBusqueda({ type: 'not_found' });
      }
    } catch {
      setResultadoBusqueda({ type: 'not_found' });
    } finally {
      setBuscandoAmigo(false);
    }
  };

  const confirmarAgregarAmigo = async () => {
    if (!resultadoBusqueda || resultadoBusqueda.type !== 'found') return;
    try {
      await api.sendFriendRequest(resultadoBusqueda.id);
    } catch { /* continúa aunque falle, el backend puede manejar duplicados */ }
    setAmigos(prev => [{ ...resultadoBusqueda }, ...prev]);
    setResultadoBusqueda({ type: 'sent', name: resultadoBusqueda.name });
  };

  return (
    <div>
      <div className="dashboard-card-ps" style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 6px 0', color: C.textPrimary, fontSize: '1.15rem', fontWeight: '800' }}>Buscar jugadores por correo</h3>
        <p style={{ margin: '0 0 18px', color: C.textSecondary, fontSize: '0.9rem' }}>Ingresa el correo de tu amigo para agregarlo a tu lista.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="email" value={emailBusqueda}
            onChange={e => { setEmailBusqueda(e.target.value); setResultadoBusqueda(null); }}
            onKeyDown={e => e.key === 'Enter' && buscarAmigoPorEmail()}
            placeholder="correo@ejemplo.com"
            className="modal-ps-input"
            style={{ flex: 1, minWidth: '220px' }}
          />
          <button onClick={buscarAmigoPorEmail} disabled={buscandoAmigo || !emailBusqueda.trim()}
            className="btn-primary-ps"
            style={{ padding: '13px 22px', opacity: !emailBusqueda.trim() ? 0.5 : 1, cursor: buscandoAmigo ? 'wait' : 'pointer' }}>
            {buscandoAmigo ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

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

      <div className="dashboard-card-ps">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: C.textPrimary, fontSize: '1.2rem', fontWeight: '800' }}>Mis Amigos ({amigos.length})</h3>
        </div>
        {amigos.length === 0 ? (
          <EmptyState icon="bi-people-fill" title="Sin amigos aún" message="Busca jugadores por correo para agregarlos a tu lista." darkMode={darkMode} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {amigos.map(amigo => {
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
                    aria-label="Eliminar amigo"
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
  );
};

export default AmigosTab;
