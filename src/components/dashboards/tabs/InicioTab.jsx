import { MetricCard, SkeletonCourtGrid } from '../DashboardLayout.jsx';
import CourtCard from '../shared/CourtCard.jsx';

const InicioTab = ({ canchas, loadingCanchas, reservas, gamification, loadingGami, favoritosIds, toggleFavorito, canchasFavoritas, setActiveTab, setMapModal, navigate, darkMode, C }) => (
  <>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '30px' }}>
      <MetricCard
        title="Próximo Partido"
        value={reservas.find(r => r.apiStatus === 'CONFIRMED')?.date || '—'}
        subtitle={reservas.find(r => r.apiStatus === 'CONFIRMED')?.court || 'Sin reservas activas'}
        color="#3b82f6" trend="up"
      />
      <MetricCard
        title="Puntos PlayStop"
        value={loadingGami ? '...' : `${gamification?.totalPoints ?? 0} pts`}
        subtitle={loadingGami ? '' : `Nivel ${gamification?.level ?? 1} • ${gamification?.levelName ?? 'Principiante'}`}
        color="#2563eb" trend="up"
      />
      <MetricCard
        title="Partidos Jugados"
        value={reservas.filter(r => r.apiStatus === 'ATTENDED').length || '0'}
        subtitle="Partidos completados"
        color="#f59e0b"
      />
    </div>

    {canchasFavoritas.length > 0 && (
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: C.textPrimary, fontSize: '1.15rem', fontWeight: '800', display:'flex', alignItems:'center', gap:8 }}>
            <i className="bi bi-heart-fill" style={{ color:'#ef4444' }} /> Tus Canchas Favoritas
          </h3>
          <span onClick={() => setActiveTab('Canchas Favoritas')} style={{ color: '#3b82f6', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>Ver todas →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {canchasFavoritas.slice(0, 3).map(c => (
            <CourtCard key={c.id} cancha={c} isFavorito={true}
              onToggleFavorito={() => toggleFavorito(c.id)}
              onReservar={() => navigate(`/reservar/${c.id}`)}
              onVerMapa={() => setMapModal({ show: true, cancha: c })}
              darkMode={darkMode} compact />
          ))}
        </div>
      </div>
    )}

    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: C.textPrimary, fontSize: '1.3rem', fontWeight: '800' }}>Canchas recomendadas para ti</h3>
        <span onClick={() => setActiveTab('Buscar Canchas')} style={{ color: '#3b82f6', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>Ver todas →</span>
      </div>
      {loadingCanchas ? (
        <SkeletonCourtGrid count={3} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {canchas.slice(0, 3).map((cancha, i) => (
            <CourtCard key={cancha.id || i} cancha={cancha}
              isFavorito={favoritosIds.includes(cancha.id)}
              onToggleFavorito={() => toggleFavorito(cancha.id)}
              onReservar={() => navigate(`/reservar/${cancha.id}`)}
              onVerMapa={() => setMapModal({ show: true, cancha })}
              darkMode={darkMode} />
          ))}
        </div>
      )}
    </div>
  </>
);

export default InicioTab;
