import { useState, useMemo } from 'react';
import CourtCard from '../shared/CourtCard.jsx';
import EmptyState from '../shared/EmptyState.jsx';
import { SkeletonCourtGrid } from '../DashboardLayout.jsx';

const PAGE_SIZE = 12;

const PERU_CITIES = ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Cusco', 'Iquitos', 'Huancayo', 'Tacna', 'Ica'];

const BuscarCanchasTab = ({ canchas, loadingCanchas, errorCanchas, favoritosIds, toggleFavorito, setMapModal, navigate, darkMode, C }) => {
  const [canchaSearch, setCanchaSearch] = useState('');
  const [canchaSportFilter, setCanchaSportFilter] = useState('Todos');
  const [cityFilter, setCityFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500);
  const [page, setPage] = useState(1);

  const filteredCanchas = useMemo(() => canchas.filter(c => {
    const q = canchaSearch.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
    const matchSport = canchaSportFilter === 'Todos' || c.type.toLowerCase().includes(canchaSportFilter.toLowerCase());
    const matchCity = !cityFilter || c.city === cityFilter || c.location.toLowerCase().includes(cityFilter.toLowerCase());
    const matchDistrict = !districtFilter || c.district.toLowerCase().includes(districtFilter.toLowerCase()) || c.location.toLowerCase().includes(districtFilter.toLowerCase());
    const matchPrice = c.priceNum >= priceMin && c.priceNum <= priceMax;
    return matchSearch && matchSport && matchCity && matchDistrict && matchPrice;
  }), [canchas, canchaSearch, canchaSportFilter, cityFilter, districtFilter, priceMin, priceMax]);

  const totalPages = Math.ceil(filteredCanchas.length / PAGE_SIZE);
  const paginated = filteredCanchas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasActiveFilters = canchaSearch || canchaSportFilter !== 'Todos' || cityFilter || districtFilter || priceMin > 0 || priceMax < 500;

  const resetPage = () => setPage(1);

  const clearFilters = () => {
    setCanchaSearch('');
    setCanchaSportFilter('Todos');
    setCityFilter('');
    setDistrictFilter('');
    setPriceMin(0);
    setPriceMax(500);
    setPage(1);
  };

  return (
    <div>
      <style>{`
        @keyframes heroSlide { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        .filter-card { background:${darkMode ? '#0f172a' : '#fff'}; border-radius:20px; padding:24px; border:1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}; box-shadow:0 1px 3px rgba(0,0,0,0.05); }
        .filter-label { font-size:0.78rem; font-weight:800; color:${darkMode ? '#94a3b8' : '#64748b'}; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:8px; display:block; }
        .filter-input { width:100%; padding:11px 14px; border-radius:10px; border:1.5px solid ${darkMode ? '#1e293b' : '#e2e8f0'}; font-size:0.95rem; outline:none; background:${darkMode ? '#020617' : '#f8fafc'}; color:${darkMode ? '#f8fafc' : '#0f172a'}; box-sizing:border-box; transition:border-color 0.2s; }
        .filter-input:focus { border-color:#2563eb; background:${darkMode ? '#0f172a' : '#fff'}; }
        .sport-chip { padding:8px 16px; border-radius:99px; border:none; font-size:0.82rem; font-weight:700; cursor:pointer; transition:all 0.18s; white-space:nowrap; }
        .sport-chip.active { background:${darkMode ? '#2563eb' : '#0f172a'}; color:${darkMode ? '#0f172a' : '#fff'}; box-shadow:0 4px 12px rgba(15,23,42,0.25); }
        .sport-chip.inactive { background:${darkMode ? '#1e293b' : '#f1f5f9'}; color:${darkMode ? '#94a3b8' : '#475569'}; }
        .sport-chip.inactive:hover { background:${darkMode ? '#334155' : '#e2e8f0'}; color:${darkMode ? '#f8fafc' : '#0f172a'}; }
        .range-track { width:100%; height:4px; border-radius:2px; background: linear-gradient(to right, ${darkMode ? '#1e293b' : '#e2e8f0'} 0%, ${darkMode ? '#1e293b' : '#e2e8f0'} var(--min-pct), #2563eb var(--min-pct), #2563eb var(--max-pct), ${darkMode ? '#1e293b' : '#e2e8f0'} var(--max-pct), ${darkMode ? '#1e293b' : '#e2e8f0'} 100%); }
        input[type=range] { -webkit-appearance:none; appearance:none; width:100%; height:4px; background:transparent; outline:none; margin:0; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:${darkMode ? '#2563eb' : '#0f172a'}; cursor:pointer; border:2px solid ${darkMode ? '#020617' : '#fff'}; box-shadow:0 2px 6px rgba(0,0,0,0.2); }
      `}</style>

      <div style={{ borderRadius: '24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f4c75 100%)', padding: '36px 32px', marginBottom: '28px', position: 'relative', overflow: 'hidden', animation: 'heroSlide 0.5s ease' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '80px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(59,130,246,0.08)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ background: 'rgba(37, 99, 235, 0.2)', color: '#2563eb', padding: '4px 12px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.5px' }}>
              {canchas.length} canchas disponibles
            </span>
          </div>
          <h2 style={{ margin: '0 0 8px', color: '#fff', fontSize: '1.9rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
            Encuentra tu cancha perfecta
          </h2>
          <p style={{ margin: '0 0 24px', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
            Filtra por deporte, ciudad, distrito y precio para encontrar la cancha ideal.
          </p>
          <div style={{ display: 'flex', gap: '12px', maxWidth: '600px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <i className="bi bi-search" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: '1rem', pointerEvents: 'none' }} />
              <input
                type="text" value={canchaSearch}
                onChange={(e) => setCanchaSearch(e.target.value)}
                placeholder="Buscar por nombre, deporte o dirección..."
                style={{ width: '100%', padding: '14px 18px 14px 44px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.15)', fontSize: '0.95rem', outline: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(8px)', boxSizing: 'border-box' }}
              />
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} style={{ padding: '14px 20px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '0.88rem', whiteSpace: 'nowrap', backdropFilter: 'blur(8px)' }}>
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {errorCanchas && (
        <div style={{ padding: '16px 20px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#991b1b', fontWeight: '600', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <i className="bi bi-exclamation-triangle-fill" style={{ color:'#ef4444' }} />
          <span>No se pudieron cargar las canchas: <strong>{errorCanchas}</strong></span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '20px' }}>
          <div className="filter-card">
            <span className="filter-label">Deporte</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Todos', 'Fútbol', 'Pádel', 'Tenis', 'Vóley', 'Básquet'].map(s => (
                <button key={s} className={`sport-chip ${canchaSportFilter === s ? 'active' : 'inactive'}`}
                  onClick={() => { setCanchaSportFilter(s); resetPage(); }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-card">
            <span className="filter-label">Ciudad</span>
            <select className="filter-input" value={cityFilter} onChange={e => { setCityFilter(e.target.value); resetPage(); }}>
              <option value="">Todas las ciudades</option>
              {PERU_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="filter-card">
            <span className="filter-label">Distrito</span>
            <input className="filter-input" type="text" value={districtFilter}
              onChange={e => { setDistrictFilter(e.target.value); resetPage(); }} placeholder="Ej. Miraflores, Surco..." />
          </div>

          <div className="filter-card">
            <span className="filter-label">Precio por hora</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textPrimary }}>S/ {priceMin}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textPrimary }}>S/ {priceMax}</span>
            </div>
            <div style={{ position: 'relative', height: '20px', marginBottom: '8px' }}>
              <div className="range-track" style={{ position: 'absolute', top: '8px', left: 0, right: 0, '--min-pct': `${(priceMin/500)*100}%`, '--max-pct': `${(priceMax/500)*100}%` }} />
              <input type="range" min="0" max="500" step="10" value={priceMin}
                onChange={e => setPriceMin(Math.min(Number(e.target.value), priceMax - 10))}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'auto' }} />
              <input type="range" min="0" max="500" step="10" value={priceMax}
                onChange={e => setPriceMax(Math.max(Number(e.target.value), priceMin + 10))}
                style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
              Arrastra para ajustar el rango
            </p>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2563eb' }}>{filteredCanchas.length}</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>canchas encontradas</div>
          </div>
        </div>

        <div>
          {loadingCanchas ? (
            <SkeletonCourtGrid count={6} />
          ) : filteredCanchas.length > 0 ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {paginated.map((cancha, i) => (
                  <CourtCard key={cancha.id || i} cancha={cancha}
                    isFavorito={favoritosIds.includes(cancha.id)}
                    onToggleFavorito={() => toggleFavorito(cancha.id)}
                    onReservar={() => navigate(`/reservar/${cancha.id}`)}
                    onVerMapa={() => setMapModal({ show: true, cancha })}
                    darkMode={darkMode} />
                ))}
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '28px', flexWrap: 'wrap' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: '8px 14px', borderRadius: '10px', border: '1.5px solid', borderColor: page === 1 ? (darkMode ? '#1e293b' : '#e2e8f0') : '#2563eb', background: 'transparent', color: page === 1 ? '#475569' : '#2563eb', fontWeight: '700', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}>
                    ← Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setPage(n)}
                      style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid', borderColor: n === page ? '#2563eb' : (darkMode ? '#1e293b' : '#e2e8f0'), background: n === page ? '#2563eb' : 'transparent', color: n === page ? '#0f172a' : (darkMode ? '#94a3b8' : '#64748b'), fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem' }}>
                      {n}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ padding: '8px 14px', borderRadius: '10px', border: '1.5px solid', borderColor: page === totalPages ? (darkMode ? '#1e293b' : '#e2e8f0') : '#2563eb', background: 'transparent', color: page === totalPages ? '#475569' : '#2563eb', fontWeight: '700', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.85rem' }}>
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState icon="bi-search" title="Sin resultados" message="Prueba ajustando los filtros o el rango de precios." darkMode={darkMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BuscarCanchasTab;
