import { useState } from 'react';
import CourtCard from '../shared/CourtCard.jsx';
import EmptyState from '../shared/EmptyState.jsx';
import { SkeletonCourtGrid } from '../DashboardLayout.jsx';

const FavoritasTab = ({ canchasFavoritas, loadingCanchas, toggleFavorito, setActiveTab, setMapModal, navigate, darkMode, C }) => {
  const [favSearch, setFavSearch] = useState('');

  if (loadingCanchas) return <SkeletonCourtGrid count={3} />;

  if (canchasFavoritas.length === 0) {
    return (
      <EmptyState
        icon="bi-heart-fill"
        title="Sin canchas favoritas"
        message="Toca el corazón en cualquier cancha para guardarla aquí y acceder rápido."
        darkMode={darkMode}
        cta={{ label: 'Explorar canchas', onClick: () => setActiveTab('Buscar Canchas') }}
      />
    );
  }

  const filtered = canchasFavoritas.filter(c =>
    !favSearch || c.name.toLowerCase().includes(favSearch.toLowerCase()) || c.type.toLowerCase().includes(favSearch.toLowerCase()) || c.location.toLowerCase().includes(favSearch.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ margin: '0 0 4px', color: C.textPrimary, fontSize: '1.3rem', fontWeight: '800' }}>Canchas Favoritas</h3>
          <p style={{ margin: 0, color: C.textSecondary, fontSize: '0.9rem' }}>Toca el corazón en cualquier cancha para agregarla aquí.</p>
        </div>
        <div style={{ position: 'relative', width: '100%', maxWidth: 200 }}>
          <i className="bi bi-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.textMuted, fontSize: '0.85rem', pointerEvents: 'none' }} />
          <input
            type="text" value={favSearch}
            onChange={e => setFavSearch(e.target.value)}
            placeholder="Buscar favorita..."
            style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 9, paddingBottom: 9, borderRadius: 10, border: `1.5px solid ${C.cardBorder}`, background: C.inputBg, color: C.textPrimary, fontSize: '0.88rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="bi-search" title="Sin resultados" message="No hay favoritas que coincidan con la búsqueda." darkMode={darkMode} cta={{ label: 'Limpiar búsqueda', onClick: () => setFavSearch('') }} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {filtered.map(cancha => (
            <CourtCard key={cancha.id} cancha={cancha} isFavorito={true}
              onToggleFavorito={() => toggleFavorito(cancha.id)}
              onReservar={() => navigate(`/reservar/${cancha.id}`)}
              onVerMapa={() => setMapModal({ show: true, cancha })}
              darkMode={darkMode} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritasTab;
