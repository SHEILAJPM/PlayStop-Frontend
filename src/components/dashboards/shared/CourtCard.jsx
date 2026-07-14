import { cloudinaryResize } from '../../../utils/cloudinary.js';

const SPORT_COLORS = {
  fútbol: '#2563eb', padel: '#3b82f6', pádel: '#3b82f6',
  tenis: '#f59e0b', vóley: '#8b5cf6', voley: '#8b5cf6',
  básquet: '#ef4444', basquet: '#ef4444',
};

export const sportColor = (type = '') => {
  const key = type.toLowerCase().split(' ')[0];
  return SPORT_COLORS[key] || '#64748b';
};

const MiniStars = ({ rating, count }) => {
  if (!rating) return <span style={{ fontSize: '.75rem', color: '#64748b' }}>Sin reseñas</span>;
  const full = Math.floor(rating);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill={i <= full ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span style={{ fontSize: '.75rem', color: '#f59e0b', fontWeight: 700 }}>{rating.toFixed(1)}</span>
      {count > 0 && <span style={{ fontSize: '.72rem', color: '#64748b' }}>({count})</span>}
    </span>
  );
};

const CourtCard = ({ cancha, isFavorito, onToggleFavorito, onReservar, onVerMapa, darkMode = false, compact = false }) => {
  const accent = sportColor(cancha.type);
  const cardBg = darkMode ? '#0f172a' : '#fff';
  const cardBorder = darkMode ? '#1e293b' : '#e2e8f0';
  const textPrimary = darkMode ? '#f8fafc' : '#0f172a';
  const textMuted = '#94a3b8';
  const dividerColor = darkMode ? '#1e293b' : '#f1f5f9';

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareData = {
      title: `${cancha.name} — PlayStop`,
      text: `Reserva ${cancha.type} en ${cancha.name}. Desde ${cancha.price}/hora`,
      url: cancha.slug ? `${window.location.origin}/cancha/${cancha.slug}` : `${window.location.origin}/reservar/${cancha.id}`,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      navigator.clipboard?.writeText(shareData.url);
      alert('¡Enlace copiado!');
    }
  };

  return (
    <div className="card-hover" style={{
      backgroundColor: cardBg, borderRadius: 20,
      border: `1px solid ${cardBorder}`, overflow: 'hidden',
      transition: 'all .28s ease', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ position: 'relative', height: compact ? 140 : 168 }}>
        <img
          src={cloudinaryResize(cancha.img, 360)}
          alt={cancha.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)' }} />
        <span style={{
          position: 'absolute', top: 12, left: 12,
          background: accent, color: '#fff',
          fontSize: '.72rem', fontWeight: 800,
          padding: '4px 10px', borderRadius: 99,
          boxShadow: `0 4px 12px ${accent}55`,
          textTransform: 'uppercase', letterSpacing: '.4px',
        }}>
          {cancha.type}
        </span>
        <div style={{ position:'absolute', top:10, right:12, display:'flex', gap:6 }}>
          <button
            onClick={handleShare}
            aria-label="Compartir cancha"
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              border: 'none', cursor: 'pointer',
              backgroundColor: 'rgba(255,255,255,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.85rem', transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorito(); }}
            aria-label={isFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              border: 'none', cursor: 'pointer',
              backgroundColor: 'rgba(255,255,255,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.15rem', transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <i className={`bi ${isFavorito ? 'bi-heart-fill' : 'bi-heart'}`} style={{ color: isFavorito ? '#ef4444' : '#94a3b8' }} />
          </button>
        </div>
      </div>

      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800, color: textPrimary }}>
          {cancha.name}
        </h4>
        <div style={{ marginBottom: 6 }}>
          <MiniStars rating={cancha.averageRating} count={cancha.reviewCount} />
        </div>
        {cancha.location && (
          <p style={{ margin: '0 0 10px', fontSize: '.8rem', color: textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {cancha.location}
          </p>
        )}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <button
            onClick={onVerMapa}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'transparent', border: `1px solid ${cardBorder}`,
              borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
              fontSize: '.78rem', fontWeight: 700, color: '#3b82f6',
              width: 'fit-content', transition: 'all .15s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#3b82f6'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = cardBorder; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            Cómo llegar
          </button>
          {cancha.location && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cancha.location)}`}
              target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: 'transparent', border: `1px solid ${cardBorder}`,
                borderRadius: 8, padding: '5px 10px',
                fontSize: '.78rem', fontWeight: 700, color: '#2563eb',
                width: 'fit-content', textDecoration: 'none', transition: 'all .15s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#2563eb'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = cardBorder; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Google Maps
            </a>
          )}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: `1px solid ${dividerColor}` }}>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: textPrimary }}>{cancha.price}</span>
            <span style={{ fontSize: '.78rem', color: textMuted, fontWeight: 500 }}>/hora</span>
          </div>
          <button
            onClick={onReservar}
            style={{
              background: accent, color: '#fff', border: 'none',
              padding: '8px 18px', borderRadius: 10,
              fontWeight: 700, fontSize: '.88rem', cursor: 'pointer',
              transition: 'all .18s', boxShadow: `0 4px 12px ${accent}40`,
            }}
            onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseOut={e => e.currentTarget.style.filter = ''}
          >
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourtCard;
