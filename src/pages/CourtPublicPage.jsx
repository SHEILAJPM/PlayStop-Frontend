import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=80';

function StarPicker({ value, onChange, size = 28 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= (hovered || value) ? '#f59e0b' : 'none'}
          stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ cursor: 'pointer', transition: 'transform 0.1s', transform: i <= (hovered || value) ? 'scale(1.15)' : 'scale(1)' }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

function WriteReviewForm({ courtId, user, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  if (done) return (
    <div style={{ background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.25)', borderRadius: 14, padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <span style={{ color: '#93c5fd', fontWeight: 700, fontSize: '0.9rem' }}>¡Gracias! Tu reseña fue publicada.</span>
    </div>
  );

  const handleSubmit = async () => {
    if (rating === 0) { setError('Selecciona una calificación'); return; }
    setSubmitting(true); setError('');
    try {
      const review = await api.createReview({ courtId, rating, comment });
      onSubmit(review);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Error al publicar la reseña. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 14, padding: '20px 18px', marginBottom: 12 }}>
      <p style={{ margin: '0 0 14px', color: '#f1f5f9', fontWeight: 800, fontSize: '0.95rem' }}>Deja tu reseña</p>
      <div style={{ marginBottom: 14 }}>
        <StarPicker value={rating} onChange={setRating} />
        {rating > 0 && (
          <span style={{ marginLeft: 10, color: '#f59e0b', fontSize: '0.82rem', fontWeight: 700 }}>
            {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][rating]}
          </span>
        )}
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        rows={3}
        maxLength={500}
        placeholder="Cuéntanos tu experiencia (opcional)..."
        style={{ width: '100%', background: '#030712', border: '1px solid #1e293b', borderRadius: 10, color: '#f1f5f9', padding: '10px 12px', fontSize: '0.88rem', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
      />
      {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '6px 0 0', fontWeight: 600 }}>{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={submitting || rating === 0}
        style={{ marginTop: 12, padding: '10px 24px', background: submitting || rating === 0 ? '#1e293b' : 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: submitting || rating === 0 ? '#475569' : '#0a1628', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: '0.88rem', cursor: submitting || rating === 0 ? 'not-allowed' : 'pointer', boxShadow: rating > 0 ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none', transition: 'all 0.2s' }}>
        {submitting ? 'Publicando...' : 'Publicar reseña'}
      </button>
    </div>
  );
}

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
        <div style={{ width: 48, height: 48, border: '3px solid #1e293b', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: '#64748b' }}>Cargando cancha...</p>
      </div>
    </div>
  );

  if (error || !court) return (
    <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ color: '#ef4444', fontSize: '1.2rem', fontWeight: 700 }}>Cancha no encontrada</p>
      <Link to="/" style={{ color: '#2563eb', fontWeight: 600 }}>← Volver al inicio</Link>
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
          <Link to="/" style={{ color: '#2563eb', fontWeight: 900, fontSize: '1.2rem', textDecoration: 'none' }}>
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
              <span style={{ background: 'rgba(37, 99, 235, 0.18)', border: '1px solid rgba(37, 99, 235, 0.4)', color: '#2563eb', borderRadius: 20, padding: '4px 14px', fontSize: '0.8rem', fontWeight: 700 }}>
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
                style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', border: 'none', borderRadius: 14, padding: '16px 32px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)', transition: 'transform 0.15s, box-shadow 0.15s', whiteSpace: 'nowrap' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(37, 99, 235, 0.45)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.35)'; }}>
                Reservar ahora →
              </button>
            </div>
            {/* Cancellation policy badge */}
            {(court.freeCancelHours != null || court.refundPercent != null) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: 10, padding: '9px 14px', marginBottom: 10 }}>
                <i className="bi bi-shield-check-fill" style={{ color: '#2563eb', fontSize: '0.9rem' }} />
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  <strong style={{ color: '#2563eb' }}>Cancelación gratis</strong> hasta {court.freeCancelHours ?? 24}h antes · {court.refundPercent ?? 50}% de reembolso después
                </span>
              </div>
            )}

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
                    <i className={`bi ${icon}`} style={{ color: '#2563eb' }} /> {label}
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
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className="bi bi-map-fill" style={{ color: '#2563eb', fontSize: '1.1rem' }} />
                    </div>
                    <div>
                      <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: '0.9rem' }}>{court.address}</p>
                      <p style={{ margin: '2px 0 0', color: '#2563eb', fontSize: '0.8rem' }}>Ver en Google Maps →</p>
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

              {user && (
                <WriteReviewForm
                  courtId={court.id}
                  user={user}
                  onSubmit={(newReview) => {
                    setReviews(prev => [newReview, ...prev]);
                    setCourt(prev => ({
                      ...prev,
                      reviewCount: (prev.reviewCount || 0) + 1,
                      averageRating: prev.averageRating
                        ? ((prev.averageRating * (prev.reviewCount || 0)) + newReview.rating) / ((prev.reviewCount || 0) + 1)
                        : newReview.rating,
                    }));
                  }}
                />
              )}

              {reviews.length === 0 ? (
                <div style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 14, padding: '32px', textAlign: 'center', color: '#475569' }}>
                  {user ? 'Todavía no hay reseñas. ¡Sé el primero!' : 'Sé el primero en dejar una reseña'}
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
                  style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', border: 'none', borderRadius: 14, padding: '14px 36px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 6px 18px rgba(37, 99, 235, 0.3)' }}>
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
