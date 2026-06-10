const MapModal = ({ cancha, onClose, darkMode = false }) => {
  const cardBg = darkMode ? '#0f172a' : '#ffffff';
  const textPrimary = darkMode ? '#f8fafc' : '#0f172a';
  const textMuted = darkMode ? '#94a3b8' : '#64748b';
  const infoBg = darkMode ? '#1e293b' : '#f8fafc';
  const border = darkMode ? '#334155' : '#e2e8f0';

  const hasCoords = cancha.lat != null && cancha.lng != null;
  const query = encodeURIComponent(
    hasCoords ? `${cancha.lat},${cancha.lng}` : `${cancha.name} ${cancha.location}`
  );

  const googleMapsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${cancha.lat},${cancha.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${query}`;

  const wazeUrl = hasCoords
    ? `https://waze.com/ul?ll=${cancha.lat},${cancha.lng}&navigate=yes`
    : `https://waze.com/ul?q=${query}`;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ background: cardBg, borderRadius: '24px', width: '90%', maxWidth: '560px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', color: textPrimary, fontSize: '1.3rem', fontWeight: '900' }}><i className="bi bi-geo-alt-fill" /> Cómo llegar</h2>
            <p style={{ margin: 0, color: textMuted, fontSize: '0.88rem' }}>{cancha.name}</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar mapa" style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: textMuted, lineHeight: 1, padding: '4px' }}>×</button>
        </div>

        <div style={{ position: 'relative', width: '100%', height: '280px', background: '#e2e8f0' }}>
          <iframe
            title="Mapa de la cancha"
            src={hasCoords
              ? `https://www.openstreetmap.org/export/embed.html?bbox=${cancha.lng - 0.008},${cancha.lat - 0.006},${cancha.lng + 0.008},${cancha.lat + 0.006}&layer=mapnik&marker=${cancha.lat},${cancha.lng}`
              : `https://www.openstreetmap.org/export/embed.html?bbox=-77.05,-12.12,-76.97,-12.05&layer=mapnik`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {!hasCoords && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.7)', color: '#fff', gap: '8px' }}>
              <i className="bi bi-geo-alt-fill" style={{ fontSize: '2rem', color: '#94a3b8' }} />
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Coordenadas no disponibles</span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>Usa los botones abajo para buscar en Google Maps</span>
            </div>
          )}
        </div>

        <div style={{ padding: '16px 24px', background: infoBg, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: textPrimary }}>{cancha.location || 'Dirección no especificada'}</p>
            {(cancha.district || cancha.city) && (
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: textMuted }}>{[cancha.district, cancha.city].filter(Boolean).join(', ')}</p>
            )}
          </div>
        </div>

        <div style={{ padding: '16px 24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', background: '#4285f4', color: '#fff', fontWeight: '700', fontSize: '0.88rem', textDecoration: 'none', transition: 'opacity .15s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            Google Maps
          </a>
          <a href={wazeUrl} target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', background: '#33ccff', color: '#fff', fontWeight: '700', fontSize: '0.88rem', textDecoration: 'none', transition: 'opacity .15s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-13h-2v6l5 3 1-1.73-4-2.27z"/></svg>
            Waze
          </a>
          <button onClick={onClose}
            style={{ flex: 1, minWidth: '100px', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${border}`, background: 'transparent', color: textMuted, fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer', transition: 'all .15s' }}
            onMouseOver={e => { e.currentTarget.style.background = infoBg; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
