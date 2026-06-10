import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=80';

function StarDisplay({ value, count, size = 14 }) {
  if (!value) return <span style={{ color: '#64748b', fontSize: size }}>Sin reseñas aún</span>;
  const full = Math.floor(value);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i < full ? '#f59e0b' : 'none'}
          stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: size }}>{value.toFixed(1)}</span>
      {count > 0 && <span style={{ color: '#64748b', fontSize: size - 1 }}>({count} reseñas)</span>}
    </span>
  );
}

export default function CourtPublicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [court, setCourt] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.getCourtBySlug(slug),
    ]).then(([c]) => {
      setCourt(c);
      return api.getCourtReviews(c.id);
    }).then(r => setReviews(Array.isArray(r) ? r : []))
      .catch(() => setError('Cancha no encontrada'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleBook = () => {
    if (!user) { navigate('/login'); return; }
    navigate(`/reservar/${court.id}`);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #1e293b', borderTop: '3px solid #00d084', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: '#64748b' }}>Cargando cancha...</p>
      </div>
    </div>
  );

  if (error || !court) return (
    <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ color: '#ef4444', fontSize: '1.2rem', fontWeight: 700 }}>Cancha no encontrada</p>
      <Link to="/" style={{ color: '#00d084', fontWeight: 600 }}>← Volver al inicio</Link>
    </div>
  );

  const canonicalUrl = `https://playstop.pe/cancha/${slug}`;
  const title = `${court.name} — ${court.sportType} en ${court.district || court.city} | PlayStop`;
  const description = `Reserva ${court.name}, cancha de ${court.sportType} en ${court.district || court.city}. Precio desde S/ ${court.pricePerHour}/hora. ⭐ ${court.averageRating ? court.averageRating.toFixed(1) : 'Sin calificación'} (${court.reviewCount} reseñas).`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="place" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={court.imageUrl || DEFAULT_IMG} />
        <meta property="og:locale" content="es_PE" />
        <meta property="og:site_name" content="PlayStop" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={court.imageUrl || DEFAULT_IMG} />

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SportsActivityLocation",
          "name": court.name,
          "description": description,
          "image": court.imageUrl || DEFAULT_IMG,
          "url": canonicalUrl,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": court.address,
            "addressLocality": court.district || court.city,
            "addressCountry": "PE"
          },
          "geo": court.latitude ? {
            "@type": "GeoCoordinates",
            "latitude": court.latitude,
            "longitude": court.longitude
          } : undefined,
          "aggregateRating": court.averageRating ? {
            "@type": "AggregateRating",
            "ratingValue": court.averageRating,
            "reviewCount": court.reviewCount
          } : undefined,
          "priceRange": `S/ ${court.pricePerHour}/hora`
        })}</script>
      </Helmet>

      <div style={{ minHeight: '100vh', background: '#030712', color: '#f1f5f9' }}>
        {/* Navbar strip */}
        <nav style={{ background: '#0a1628', borderBottom: '1px solid #1e293b', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ color: '#00d084', fontWeight: 900, fontSize: '1.2rem', textDecoration: 'none' }}>
            PlayStop
          </Link>
          <Link to="/" style={{ color: '#94a3b8', fontSize: '0.88rem', textDecoration: 'none' }}>← Inicio</Link>
        </nav>

        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 0 80px' }}>

          {/* Hero image */}
          <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
            <img src={court.imageUrl || DEFAULT_IMG} alt={court.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,7,18,0.95) 0%, transparent 55%)' }} />
            <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
              <span style={{ background: 'rgba(0,208,132,0.18)', border: '1px solid rgba(0,208,132,0.4)', color: '#00d084', borderRadius: 20, padding: '4px 14px', fontSize: '0.8rem', fontWeight: 700 }}>
                {court.sportType}
              </span>
              <h1 style={{ margin: '10px 0 6px', fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.1 }}>{court.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <StarDisplay value={court.averageRating} count={court.reviewCount} size={15} />
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4 }} strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {court.district ? `${court.district}, ` : ''}{court.city || 'Lima'}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '32px 24px 0' }}>

            {/* Price + CTA */}
            <div style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 20, padding: '24px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Precio por hora</p>
                <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 900, color: '#f1f5f9' }}>
                  S/ {parseFloat(court.pricePerHour).toFixed(2)}
                  <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>/hora</span>
                </p>
              </div>
              <button onClick={handleBook}
                style={{ background: 'linear-gradient(135deg,#00d084,#00b875)', color: '#0a1628', border: 'none', borderRadius: 14, padding: '16px 32px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,208,132,0.35)', transition: 'transform 0.15s, box-shadow 0.15s', whiteSpace: 'nowrap' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,208,132,0.45)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,208,132,0.35)'; }}>
                Reservar ahora →
              </button>
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
              {[
                { icon: 'bi-geo-alt-fill', label: 'Dirección', value: court.address },
                { icon: 'bi-building', label: 'Distrito', value: court.district || '—' },
                { icon: 'bi-trophy-fill', label: 'Deporte', value: court.sportType },
                { icon: 'bi-star-fill', label: 'Calificación', value: court.averageRating ? `${court.averageRating.toFixed(1)} / 5` : 'Sin calificación' },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 14, padding: '16px 18px' }}>
                  <p style={{ margin: '0 0 6px', color: '#64748b', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className={`bi ${icon}`} style={{ color: '#00d084' }} /> {label}
                  </p>
                  <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: '0.9rem' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Map preview if coordinates */}
            {court.latitude && court.longitude && (
              <div style={{ marginBottom: 28 }}>
                <p style={{ margin: '0 0 12px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ubicación</p>
                <a href={`https://maps.google.com/?q=${court.latitude},${court.longitude}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', background: '#0a1628', border: '1px solid #1e293b', borderRadius: 14, overflow: 'hidden', textDecoration: 'none' }}>
                  <div style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(0,208,132,0.15)', border: '1px solid rgba(0,208,132,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className="bi bi-map-fill" style={{ color: '#00d084', fontSize: '1.1rem' }} />
                    </div>
                    <div>
                      <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: '0.9rem' }}>{court.address}</p>
                      <p style={{ margin: '2px 0 0', color: '#00d084', fontSize: '0.8rem' }}>Ver en Google Maps →</p>
                    </div>
                  </div>
                </a>
              </div>
            )}

            {/* Reviews */}
            <div>
              <p style={{ margin: '0 0 16px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Reseñas ({reviews.length})
              </p>
              {reviews.length === 0 ? (
                <div style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 14, padding: '32px', textAlign: 'center', color: '#475569' }}>
                  Sé el primero en dejar una reseña
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {reviews.slice(0, 6).map(r => (
                    <div key={r.id} style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 14, padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <img src={r.userAvatar} alt={r.userName}
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: '0.9rem' }}>{r.userName}</p>
                          <p style={{ margin: 0, color: '#475569', fontSize: '0.75rem' }}>
                            {new Date(r.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <StarDisplay value={r.rating} size={12} />
                      </div>
                      {r.comment && <p style={{ margin: '0 0 10px', color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>{r.comment}</p>}
                      {r.photoUrls?.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {r.photoUrls.map((url, i) => (
                            <img key={i} src={url} alt={`Foto ${i + 1}`}
                              style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', border: '1px solid #1e293b', cursor: 'pointer' }}
                              onClick={() => window.open(url, '_blank')} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 28, textAlign: 'center' }}>
                <button onClick={handleBook}
                  style={{ background: 'linear-gradient(135deg,#00d084,#00b875)', color: '#0a1628', border: 'none', borderRadius: 14, padding: '14px 36px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 6px 18px rgba(0,208,132,0.3)' }}>
                  Reservar {court.name} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
