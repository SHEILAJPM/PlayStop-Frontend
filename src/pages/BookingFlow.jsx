import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLocalReminders } from '../hooks/useLocalReminders.js';

/* ── Confetti ── */
const CONF_COLORS = ['#2563eb','#3b82f6','#f59e0b','#8b5cf6','#ef4444','#06b6d4'];
export function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i, color: CONF_COLORS[i % CONF_COLORS.length],
    x: Math.random() * 100, delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 1.5, size: 7 + Math.random() * 7,
    drift: (Math.random() - 0.5) * 100,
  }));
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9999, overflow:'hidden' }}>
      <style>{`@keyframes bf{0%{transform:translateY(-20px) translateX(0) rotate(0);opacity:1}100%{transform:translateY(110vh) translateX(var(--d)) rotate(540deg);opacity:0}}`}</style>
      {pieces.map(p => (
        <div key={p.id} style={{ position:'absolute', left:`${p.x}%`, top:0, width:p.size, height:p.size*.55, background:p.color, borderRadius:2, '--d':`${p.drift}px`, animation:`bf ${p.duration}s ease-in ${p.delay}s forwards` }} />
      ))}
    </div>
  );
}

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80';
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAYS_SHORT = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

/* ── helpers ── */
const fmtDate = (d) => d.toISOString().split('T')[0];
export const fmtDateLabel = (iso) => {
  if (!iso) return '';
  return new Date(iso + 'T12:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};
export const fmtPrice = (n) => `S/ ${parseFloat(n || 0).toFixed(2)}`;

/* ── sub-components ── */

function BackHeader({ title, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #1e293b' }}>
      <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1rem' }}>{title}</span>
    </div>
  );
}

function StarRating({ value = 0, count, size = 14, interactive = false, onRate }) {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? (hovered || value) : value;
  const full = Math.floor(display);
  const half = display - full >= 0.5;

  if (interactive) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} width={size + 4} height={size + 4} viewBox="0 0 24 24"
            fill={i <= (hovered || value) ? '#f59e0b' : 'none'}
            stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onRate && onRate(i)}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ))}
      </span>
    );
  }

  if (!value) return <span style={{ color: '#64748b', fontSize: size }}>Sin reseñas aún</span>;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i < full ? '#f59e0b' : (i === full && half ? 'url(#half-bf)' : 'none')}
          stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <defs><linearGradient id="half-bf"><stop offset="50%" stopColor="#f59e0b"/><stop offset="50%" stopColor="transparent"/></linearGradient></defs>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: size }}>{value.toFixed(1)}</span>
      {count > 0 && <span style={{ color: '#64748b', fontSize: size - 1 }}>({count} reseñas)</span>}
    </span>
  );
}

function ReviewsSection({ courtId, user }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.getCourtReviews(courtId)
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [courtId]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - photoFiles.length);
    setPhotoFiles(prev => [...prev, ...files].slice(0, 5));
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => setPhotoPreviews(prev => [...prev, ev.target.result].slice(0, 5));
      reader.readAsDataURL(f);
    });
  };

  const removePhoto = (i) => {
    setPhotoFiles(prev => prev.filter((_, idx) => idx !== i));
    setPhotoPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Selecciona una calificación'); return; }
    setSubmitting(true); setUploading(photoFiles.length > 0); setError('');
    try {
      const photoUrls = [];
      for (const file of photoFiles) {
        const res = await api.uploadImage(file);
        if (res?.url) photoUrls.push(res.url);
      }
      const newReview = await api.createReview({ courtId, rating, comment, photoUrls });
      setReviews(prev => [newReview, ...prev]);
      setRating(0); setComment(''); setPhotoFiles([]); setPhotoPreviews([]);
    } catch (err) {
      setError(err.message || 'Error al enviar la reseña');
    } finally {
      setSubmitting(false); setUploading(false);
    }
  };

  const fmtDate = (dt) => new Date(dt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ padding: '0 20px 20px' }}>
      <p style={{ margin: '0 0 16px 0', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Reseñas ({reviews.length})
      </p>

      {user?.role === 'USER' && (
        <form onSubmit={handleSubmit} style={{ background: '#0f172a', borderRadius: 14, padding: 16, marginBottom: 20, border: '1px solid #1e293b' }}>
          <p style={{ margin: '0 0 10px', color: '#f1f5f9', fontWeight: 700, fontSize: '0.9rem' }}>Deja tu reseña</p>
          <div style={{ marginBottom: 12 }}>
            <StarRating value={rating} size={18} interactive onRate={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="¿Qué te pareció esta cancha? (opcional)"
            maxLength={500}
            rows={3}
            style={{ width: '100%', background: '#020617', border: '1px solid #1e293b', borderRadius: 10, color: '#f1f5f9', padding: '10px 12px', fontSize: '0.85rem', resize: 'none', boxSizing: 'border-box', outline: 'none' }}
          />

          {/* Photo upload */}
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: photoPreviews.length > 0 ? 8 : 0 }}>
              {photoPreviews.map((src, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={src} alt={`foto ${i + 1}`}
                    style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '1px solid #1e293b' }} />
                  <button type="button" onClick={() => removePhoto(i)}
                    style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', border: 'none', color: '#fff', fontSize: '0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                    ✕
                  </button>
                </div>
              ))}
              {photoFiles.length < 5 && (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  style={{ width: 64, height: 64, borderRadius: 8, border: '1.5px dashed #334155', background: 'transparent', color: '#64748b', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: '0.65rem', fontWeight: 700 }}>
                  <i className="bi bi-camera-fill" style={{ fontSize: '1.1rem' }} />
                  Foto
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePhotoChange} />
            {photoFiles.length > 0 && (
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.72rem' }}>{photoFiles.length}/5 fotos</p>
            )}
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '6px 0 0' }}>{error}</p>}
          <button type="submit" disabled={submitting || rating === 0}
            style={{ marginTop: 10, padding: '10px 20px', background: rating > 0 ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : '#1e293b', color: rating > 0 ? '#0a1628' : '#475569', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: '0.88rem', cursor: rating > 0 ? 'pointer' : 'not-allowed' }}>
            {uploading ? 'Subiendo fotos...' : submitting ? 'Enviando...' : 'Publicar reseña'}
          </button>
        </form>
      )}

      {loading ? (
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Cargando reseñas...</p>
      ) : reviews.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>Sé el primero en dejar una reseña</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: '#0f172a', borderRadius: 12, padding: '14px 16px', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <img src={r.userAvatar} alt={r.userName}
                  style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: '0.88rem' }}>{r.userName}</p>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.75rem' }}>{fmtDate(r.createdAt)}</p>
                </div>
                <StarRating value={r.rating} size={12} />
              </div>
              {r.comment && <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>{r.comment}</p>}
              {r.photoUrls?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {r.photoUrls.map((url, i) => (
                    <img key={i} src={url} alt={`foto ${i + 1}`}
                      style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '1px solid #1e293b', cursor: 'pointer' }}
                      onClick={() => window.open(url, '_blank')} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Step 1: Court Detail ── */
function CourtDetail({ court, onNext, user }) {
  const tags = [court.sportType, 'Césped sintético', 'Iluminación LED'].filter(Boolean);
  const rating = court.averageRating ?? null;
  const reviewCount = court.reviewCount ?? 0;
  return (
    <div>
      {/* Hero image */}
      <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
        <img src={court.imageUrl || DEFAULT_IMG} alt={court.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,7,18,0.9) 0%, transparent 50%)' }} />
      </div>

      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1.2 }}>{court.name}</h2>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 3 }} strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {court.city || 'Lima'}
          </span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <StarRating value={rating} count={reviewCount} />
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {tags.map(t => (
            <span key={t} style={{ background: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.25)', color: '#2563eb', borderRadius: 20, padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700 }}>{t}</span>
          ))}
        </div>

        {/* Description */}
        <div style={{ background: '#0f172a', borderRadius: 14, padding: 16, marginBottom: 20, border: '1px solid #1e293b' }}>
          <p style={{ margin: '0 0 8px 0', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Descripción</p>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
            {court.description || `Cancha de ${court.sportType || 'fútbol'} con césped sintético, iluminación LED y servicios completos. Disfruta de las mejores instalaciones deportivas.`}
          </p>
        </div>

        {/* Amenities */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[
            { icon: 'bi-p-square-fill', label: 'Estacionamiento' },
            { icon: 'bi-droplet-half', label: 'Vestuarios' },
            { icon: 'bi-lightbulb-fill', label: 'Iluminación' },
            { icon: 'bi-shop', label: 'Cafetería' },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0f172a', borderRadius: 10, padding: '10px 14px', border: '1px solid #1e293b' }}>
              <i className={`bi ${icon}`} style={{ fontSize: '1rem', color: '#94a3b8' }} />
              <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div style={{ background: '#0f172a', borderRadius: 16, padding: 20, border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Precio desde</p>
            <p style={{ margin: 0, color: '#f1f5f9', fontSize: '1.6rem', fontWeight: 900 }}>
              {fmtPrice(court.pricePerHour)}<span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>/hora</span>
            </p>
          </div>
          <button onClick={onNext} style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', border: 'none', borderRadius: 12, padding: '14px 22px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)', transition: 'transform 0.15s' }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            Ver horarios →
          </button>
        </div>
      </div>

      {/* Reviews section */}
      <div style={{ borderTop: '1px solid #1e293b' }}>
        <ReviewsSection courtId={court.id} user={user} />
      </div>
    </div>
  );
}

/* ── Step 2: Date & Time ── */
function DateTimePicker({ courtId, initialHours = 1, onNext, onBack: _onBack }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [duration, setDuration] = useState(Math.min(4, Math.max(1, initialHours)));
  const [lastRefresh, setLastRefresh] = useState(null);

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + weekOffset * 7 + i);
    return d;
  });

  const monthLabel = MONTHS_ES[weekDays[0].getMonth()] + ' ' + weekDays[0].getFullYear();

  const fetchSlots = async (iso, silent = false) => {
    if (!courtId || !iso) return;
    if (!silent) setLoadingSlots(true);
    try {
      const data = await api.getCourtSlots(courtId, iso);
      setSlots(Array.isArray(data) ? data : []);
      setLastRefresh(new Date());
    } catch { if (!silent) setSlots([]); }
    finally { if (!silent) setLoadingSlots(false); }
  };

  const handleSelectDate = async (d) => {
    const iso = fmtDate(d);
    setSelectedDate(iso);
    setSelectedSlot(null);
    setSlots([]);
    await fetchSlots(iso);
  };

  // Poll cada 30s mientras hay fecha seleccionada
  useEffect(() => {
    if (!selectedDate) return;
    const id = setInterval(() => fetchSlots(selectedDate, true), 30000);
    return () => clearInterval(id);
  }, [selectedDate, courtId]);

  const allHours = Array.from({ length: 15 }, (_, i) => `${(8 + i).toString().padStart(2,'0')}:00`);

  const getSlotStatus = (hour) => {
    const h = parseInt(hour);
    const match = slots.find(s => s.hour === h || s.slotHour === h);
    if (!match) return selectedDate ? 'available' : 'disabled';
    return match.available ? 'available' : 'taken';
  };

  // ¿Están libres todas las horas seguidas que ocuparía esta reserva?
  const isRangeAvailable = (startHour, hours) => {
    for (let i = 0; i < hours; i++) {
      const h = startHour + i;
      if (!allHours.includes(`${h.toString().padStart(2,'0')}:00`)) return false; // se sale del horario del local
      if (getSlotStatus(`${h}:00`) !== 'available') return false;
    }
    return true;
  };

  const handleSelectDuration = (d) => {
    setDuration(d);
    if (selectedSlot && !isRangeAvailable(parseInt(selectedSlot), d)) setSelectedSlot(null);
  };

  return (
    <div style={{ padding: '0 0 20px' }}>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
        <button onClick={() => setWeekOffset(w => Math.max(0, w - 1))} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid #1e293b', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '0.95rem' }}>{monthLabel}</span>
        <button onClick={() => setWeekOffset(w => w + 1)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid #1e293b', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Day chips */}
      <div style={{ display: 'flex', gap: 6, padding: '0 20px', overflowX: 'auto', marginBottom: 24 }}>
        {weekDays.map(d => {
          const iso = fmtDate(d);
          const isSelected = iso === selectedDate;
          const isPast = d < today;
          return (
            <button key={iso} onClick={() => !isPast && handleSelectDate(d)}
              disabled={isPast}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 44, padding: '10px 6px', borderRadius: 12, border: isSelected ? '2px solid #2563eb' : '1px solid #1e293b', background: isSelected ? 'rgba(37, 99, 235, 0.15)' : '#0f172a', cursor: isPast ? 'not-allowed' : 'pointer', opacity: isPast ? 0.4 : 1, transition: 'all 0.15s' }}>
              <span style={{ color: isSelected ? '#2563eb' : '#64748b', fontSize: '0.7rem', fontWeight: 700 }}>{DAYS_SHORT[d.getDay()]}</span>
              <span style={{ color: isSelected ? '#2563eb' : '#f1f5f9', fontWeight: 900, fontSize: '1rem' }}>{d.getDate()}</span>
            </button>
          );
        })}
      </div>

      {/* Duración */}
      <div style={{ padding: '0 20px', marginBottom: 20 }}>
        <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          ¿Cuántas horas?
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {[1, 2, 3, 4].map(d => (
            <button key={d} onClick={() => handleSelectDuration(d)}
              style={{ flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem', transition: 'all 0.15s',
                border: duration === d ? '2px solid #2563eb' : '1px solid #1e293b',
                background: duration === d ? 'rgba(37, 99, 235, 0.15)' : '#0f172a',
                color: duration === d ? '#2563eb' : '#94a3b8' }}>
              {d}h
            </button>
          ))}
        </div>
      </div>

      {/* Slots */}
      <div style={{ padding: '0 20px' }}>
        <p style={{ margin: '0 0 12px 0', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {selectedDate ? 'Hora de inicio' : 'Selecciona una fecha primero'}
        </p>

        {loadingSlots ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{ height: 44, borderRadius: 10, background: 'linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
            ))}
          </div>
        ) : (
          <>
            {/* available count for coloring */}
            {(() => {
              const availCount = slots.filter(s => s.available).length;
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {allHours.map(h => {
                    const status = getSlotStatus(h);
                    const isSelected = selectedSlot === h;
                    const isTaken = status === 'taken';
                    const fitsRange = isRangeAvailable(parseInt(h), duration);
                    const blockedByRange = !isTaken && !fitsRange;
                    const isDisabled = status === 'disabled' || isTaken || !fitsRange;
                    // Color coding: green=many available, yellow=last 1-2, red=taken, gray=no alcanza la duración
                    const slotColor = isTaken ? '#ef4444' : availCount <= 2 ? '#f59e0b' : '#2563eb';
                    return (
                      <button key={h} onClick={() => !isDisabled && setSelectedSlot(h)}
                        disabled={isDisabled}
                        title={isTaken ? 'No disponible' : blockedByRange ? `No hay ${duration}h seguidas disponibles desde aquí` : availCount <= 2 ? 'Últimos horarios' : 'Disponible'}
                        style={{
                          padding: '12px 0',
                          borderRadius: 10,
                          border: isSelected
                            ? `2px solid ${slotColor}`
                            : blockedByRange
                              ? '1px dashed #1e293b'
                              : `1px solid ${isTaken ? 'rgba(239,68,68,0.2)' : availCount <= 2 ? 'rgba(245,158,11,0.25)' : '#1e293b'}`,
                          background: isSelected ? slotColor : isTaken ? 'rgba(239,68,68,0.08)' : blockedByRange ? 'rgba(148,163,184,0.05)' : availCount <= 2 && !isDisabled ? 'rgba(245,158,11,0.08)' : '#0f172a',
                          color: isSelected ? '#0a1628' : isTaken ? '#ef4444' : blockedByRange ? '#475569' : availCount <= 2 && !isDisabled ? '#f59e0b' : '#f1f5f9',
                          fontWeight: isSelected ? 800 : 600,
                          fontSize: '0.85rem',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: !selectedDate ? 0.4 : blockedByRange ? 0.5 : 1,
                          transition: 'all 0.15s',
                          textDecoration: isTaken ? 'line-through' : 'none',
                          position: 'relative',
                        }}>
                        {h}
                        {!isTaken && availCount <= 2 && !isDisabled && selectedDate && (
                          <span style={{ position:'absolute', top:-4, right:-4, width:8, height:8, borderRadius:'50%', background:'#f59e0b', boxShadow:'0 0 6px rgba(245,158,11,0.7)' }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </>
        )}

        {/* Legend + last refresh */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {[
              { color: '#2563eb', label: 'Disponible' },
              { color: '#f59e0b', label: 'Últimos horarios' },
              { color: '#ef4444', label: 'No disponible' },
            ].map(l => (
              <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: '0.75rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: l.color, display: 'inline-block' }} />
                {l.label}
              </span>
            ))}
          </div>
          {lastRefresh && (
            <span style={{ color: '#334155', fontSize: '0.7rem' }}>
              ↻ Actualizado {lastRefresh.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '24px 20px 0' }}>
        <button onClick={() => selectedDate && selectedSlot && onNext({ date: selectedDate, slot: selectedSlot, hours: duration })}
          disabled={!selectedDate || !selectedSlot}
          style={{ width: '100%', padding: 16, background: selectedDate && selectedSlot ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : '#1e293b', color: selectedDate && selectedSlot ? '#0a1628' : '#475569', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: '1rem', cursor: selectedDate && selectedSlot ? 'pointer' : 'not-allowed', transition: 'all 0.2s', boxShadow: selectedDate && selectedSlot ? '0 8px 20px rgba(37, 99, 235, 0.3)' : 'none' }}>
          Continuar →
        </button>
      </div>
    </div>
  );
}

/* ── Step 3: Summary ── */
function BookingSummary({ court, booking, onNext, onBack: _onBack }) {
  const { date, slot, hours = 1 } = booking;
  const endHour = String(parseInt(slot) + hours).padStart(2, '0');
  const location = [court.district, court.city].filter(Boolean).join(', ');
  const total = parseFloat(court.pricePerHour || 0) * hours;
  return (
    <div style={{ padding: '20px' }}>
      {/* Court card */}
      <div style={{ display: 'flex', gap: 14, background: '#0f172a', borderRadius: 16, padding: 16, marginBottom: 20, border: '1px solid #1e293b' }}>
        <img src={court.imageUrl || DEFAULT_IMG} alt={court.name}
          style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>{court.sportType}</p>
          <h3 style={{ margin: '0 0 10px 0', color: '#f1f5f9', fontSize: '0.95rem', fontWeight: 800, lineHeight: 1.2 }}>{court.name}</h3>
          {[
            { icon: 'bi-calendar3',        text: fmtDateLabel(date) },
            { icon: 'bi-clock',            text: `${slot} — ${endHour}:00 (${hours} ${hours > 1 ? 'horas' : 'hora'})` },
            ...(location ? [{ icon: 'bi-geo-alt',   text: location }] : []),
            { icon: 'bi-cash-coin',        text: `${fmtPrice(total)} total (${fmtPrice(court.pricePerHour)}/hora × ${hours})` },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <i className={`bi ${icon}`} style={{ fontSize: '0.8rem', color: '#64748b' }} />
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why book here */}
      <div style={{ background: '#0f172a', borderRadius: 16, padding: 16, marginBottom: 20, border: '1px solid #1e293b' }}>
        <p style={{ margin: '0 0 12px 0', color: '#f1f5f9', fontWeight: 800, fontSize: '0.9rem' }}>¿Por qué reservar aquí?</p>
        {[
          'Alta calificación de usuarios',
          'Canchas bien mantenidas',
          'Atención rápida y segura',
        ].map(r => (
          <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{r}</span>
          </div>
        ))}
      </div>

      {/* Rating */}
      <div style={{ background: '#0f172a', borderRadius: 16, padding: 16, marginBottom: 24, border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Calificación del lugar</span>
        <StarRating value={court.averageRating ?? null} count={court.reviewCount ?? 0} size={13} />
      </div>

      {/* Cancellation policy */}
      <div style={{ background: 'rgba(37, 99, 235, 0.06)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: 14, padding: 14, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <i className="bi bi-shield-check-fill" style={{ color: '#2563eb', fontSize: '0.85rem' }} />
          <span style={{ color: '#2563eb', fontWeight: 800, fontSize: '0.85rem' }}>Política de cancelación</span>
        </div>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.6 }}>
          ✓ <strong style={{ color: '#f1f5f9' }}>Gratis</strong> si cancelas {court.freeCancelHours ?? 24}h o más antes del partido.<br />
          ✓ <strong style={{ color: '#f1f5f9' }}>{court.refundPercent ?? 50}% reembolso</strong> si cancelas con menos tiempo.
        </p>
      </div>

      <button onClick={onNext} style={{ width: '100%', padding: 16, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)' }}>
        Continuar →
      </button>
    </div>
  );
}

/* ── Step 4: Payment ── */
function PaymentView({ court, booking, onPay, processing, payError }) {
  const hours = booking.hours || 1;
  const total = parseFloat(court?.pricePerHour || 0) * hours;
  const endHour = String(parseInt(booking.slot) + hours).padStart(2, '0');

  const handlePay = () => onPay('card');

  return (
    <div style={{ padding: '20px' }}>
      {/* Redirect notice */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
        <i className="bi bi-shield-lock-fill" style={{ color: '#2563eb', fontSize: '0.95rem' }} />
        <span style={{ color: '#93c5fd', fontSize: '0.82rem', fontWeight: 700 }}>Serás redirigido a Stripe para completar el pago de forma segura</span>
      </div>

      {/* Total */}
      <div style={{ background: '#0f172a', borderRadius: 16, padding: 20, marginBottom: 20, border: '1px solid #1e293b' }}>
        <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total a pagar</p>
        <p style={{ margin: 0, color: '#f1f5f9', fontSize: '2rem', fontWeight: 900 }}>{fmtPrice(total)}</p>
        <p style={{ margin: '4px 0 0 0', color: '#475569', fontSize: '0.8rem' }}>{hours} {hours > 1 ? 'horas' : 'hora'} • {booking.slot} – {endHour}:00</p>
      </div>

      {/* Security note */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(37, 99, 235, 0.06)', border: '1px solid rgba(37, 99, 235, 0.15)', borderRadius: 10, padding: '10px 14px', marginBottom: 24 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span style={{ color: '#2563eb', fontSize: '0.82rem', fontWeight: 600 }}>Transacción 100% segura y encriptada</span>
      </div>

      {payError && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
          <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>⚠ {payError}</span>
        </div>
      )}
      <button onClick={handlePay} disabled={processing}
        style={{ width: '100%', padding: 16, background: processing ? '#1e293b' : 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: processing ? '#475569' : '#0a1628', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: '1rem', cursor: processing ? 'not-allowed' : 'pointer', boxShadow: processing ? 'none' : '0 8px 20px rgba(37, 99, 235, 0.3)', transition: 'all 0.2s' }}>
        {processing ? 'Redirigiendo a Stripe...' : `Pagar y reservar ${fmtPrice(total)}`}
      </button>
    </div>
  );
}

/* ── Step 5: Success ── */
export function BookingSuccess({ court, booking, reservationId, userEmail, onDone }) {
  const [showConf, setShowConf] = useState(true);
  const [reminderState, setReminderState] = useState('idle'); // idle | requesting | set | denied
  const { permission, requestPermission, scheduleReminder } = useLocalReminders();

  useEffect(() => { const t = setTimeout(() => setShowConf(false), 4000); return () => clearTimeout(t); }, []);

  // If permission was already granted on a prior visit, auto-schedule
  useEffect(() => {
    if (permission === 'granted' && booking?.date && booking?.slot && reminderState === 'idle') {
      scheduleBookingReminder();
      setReminderState('set');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleBookingReminder = () => {
    if (!booking?.date || !booking?.slot) return;
    const [hour] = booking.slot.split(':').map(Number);
    const fireAt = new Date(`${booking.date}T${String(hour - 1).padStart(2, '0')}:00:00`);
    if (isNaN(fireAt.getTime()) || fireAt <= new Date()) return;
    scheduleReminder({
      id: `booking-${reservationId || booking.date + booking.slot}`,
      title: '⏰ Tu partido empieza en 1 hora',
      body: `${court?.name} · ${booking.slot} — ¡No olvides tu QR!`,
      fireAt,
      url: '/dashboard',
    });
  };

  const handleActivateReminder = async () => {
    setReminderState('requesting');
    const result = await requestPermission();
    if (result === 'granted') {
      scheduleBookingReminder();
      setReminderState('set');
    } else {
      setReminderState('denied');
    }
  };

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      {showConf && <Confetti />}
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(37, 99, 235, 0.15)', border: '2px solid #2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(37, 99, 235, 0.3)' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 900, margin: '0 0 8px 0' }}>¡Reserva confirmada!</h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 32px 0', lineHeight: 1.6 }}>
        Tu reserva en <strong style={{ color: '#94a3b8' }}>{court?.name}</strong> fue confirmada correctamente.
      </p>

      <div style={{ background: '#0f172a', borderRadius: 16, padding: 20, marginBottom: 32, border: '1px solid #1e293b', textAlign: 'left' }}>
        {[
          { label: 'Fecha', value: fmtDateLabel(booking.date) },
          { label: 'Horario', value: `${booking.slot} – ${String(parseInt(booking.slot)+1).padStart(2,'0')}:00` },
          { label: 'Cancha', value: court?.name || '—' },
          { label: 'Total pagado', value: fmtPrice(court?.pricePerHour) },
          ...(reservationId ? [{ label: '# Reserva', value: `#${reservationId}` }] : []),
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1e293b' }}>
            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{label}</span>
            <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.85rem' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* QR de acceso */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 12, display: 'inline-block' }}>
        <QRCode
          value={`PLAYSTOP|${reservationId}|${court?.name}|${booking.date}|${booking.slot}`}
          size={160}
          bgColor="#ffffff"
          fgColor="#030712"
          level="M"
        />
      </div>
      <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: 16 }}>
        Muestra este QR al llegar a la cancha
      </p>

      {/* Notificaciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24, textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '10px 14px' }}>
          <i className="bi bi-envelope-check-fill" style={{ color: '#3b82f6', fontSize: '0.95rem', flexShrink: 0 }} />
          <span style={{ color: '#93c5fd', fontSize: '0.8rem' }}>
            QR enviado a <strong>{userEmail || 'tu correo'}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(37, 99, 235, 0.06)', border: '1px solid rgba(37, 99, 235, 0.15)', borderRadius: 10, padding: '10px 14px' }}>
          <i className="bi bi-bell-fill" style={{ color: '#2563eb', fontSize: '0.95rem', flexShrink: 0 }} />
          <span style={{ color: '#93c5fd', fontSize: '0.8rem' }}>
            El propietario ha sido notificado de tu reserva
          </span>
        </div>

        {/* Recordatorio push */}
        {reminderState === 'set' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: 10, padding: '10px 14px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
            <span style={{ color: '#93c5fd', fontSize: '0.8rem', fontWeight: 600 }}>
              Recordatorio activo — te avisamos 1 hora antes del partido
            </span>
          </div>
        ) : reminderState === 'denied' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px' }}>
            <i className="bi bi-bell-slash" style={{ color: '#f87171', fontSize: '0.9rem', flexShrink: 0 }} />
            <span style={{ color: '#fca5a5', fontSize: '0.8rem' }}>Notificaciones bloqueadas. Actívalas desde la configuración del navegador.</span>
          </div>
        ) : (
          <button
            onClick={handleActivateReminder}
            disabled={reminderState === 'requesting'}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, padding: '10px 14px', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <i className="bi bi-bell" style={{ color: '#fbbf24', fontSize: '0.95rem', flexShrink: 0 }} />
            <span style={{ color: '#fde68a', fontSize: '0.8rem', fontWeight: 600 }}>
              {reminderState === 'requesting' ? 'Solicitando permiso...' : '🔔 Activar recordatorio 1 hora antes'}
            </span>
          </button>
        )}
      </div>

      <button onClick={onDone} style={{ width: '100%', padding: 16, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)' }}>
        Ir a mis reservas
      </button>
    </div>
  );
}

/* ── Main Component ── */
export default function BookingFlow({ darkMode: _darkMode = true }) {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialHours = parseInt(searchParams.get('hours')) || 1;

  const [step, setStep] = useState(1);
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payError, setPayError] = useState('');
  const [booking, setBooking] = useState({ date: '', slot: null });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!courtId) { setError('ID de cancha no especificado'); setLoading(false); return; }
    api.getAllCourts()
      .then(data => {
        const found = Array.isArray(data) ? data.find(c => String(c.id) === String(courtId)) : null;
        if (found) setCourt(found);
        else setError('Cancha no encontrada');
      })
      .catch(() => setError('Error al conectar con el servidor'))
      .finally(() => setLoading(false));
  }, [courtId]);

  const handlePay = async (_method) => {
    setProcessing(true);
    try {
      const reservation = await api.createReservation({
        courtId: court.id,
        date: booking.date,
        slotHour: parseInt(booking.slot),
        durationHours: booking.hours || 1,
      });
      const { url } = await api.createCheckoutSession(reservation.id);
      window.location.href = url;
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('bloqueada') || msg.includes('deshabilitada')) {
        setError(msg);
      } else {
        setPayError(msg || 'Error al crear la reserva. Intenta nuevamente.');
      }
      setProcessing(false);
    }
  };

  const STEP_TITLES = {
    1: 'Detalle de cancha',
    2: 'Seleccionar fecha y hora',
    3: 'Resumen de tu reserva',
    4: 'Pago',
  };

  const goBack = () => {
    if (step === 1) navigate(-1);
    else setStep(s => s - 1);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '0 0 40px' }}>
      {/* Phone-frame container */}
      <div style={{ width: '100%', maxWidth: 480, background: '#030712', minHeight: '100vh', display: 'flex', flexDirection: 'column', boxShadow: '0 0 60px rgba(0,0,0,0.5)' }}>

        {/* Top header */}
        {step < 5 && <BackHeader title={STEP_TITLES[step]} onBack={goBack} />}

        {/* Progress bar */}
        {step < 5 && (
          <div style={{ height: 3, background: '#0f172a' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#2563eb,#1d4ed8)', width: `${(step / 4) * 100}%`, transition: 'width 0.4s ease', borderRadius: 2 }} />
          </div>
        )}

        {/* Cuenta bloqueada */}
        {user?.bannedFromReservations && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '2px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: 22 }}>
              ⛔
            </div>
            <h2 style={{ color: '#ef4444', fontWeight: 900, fontSize: '1.2rem', margin: '0 0 12px' }}>Cuenta bloqueada</h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.7, margin: '0 0 10px' }}>
              Tu cuenta ha sido <strong style={{ color: '#f1f5f9' }}>bloqueada permanentemente</strong> por incumplimiento de las normas de la plataforma.
            </p>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 28px' }}>
              No es posible realizar nuevas reservas. Si crees que esto es un error, contacta a soporte.
            </p>
            <a href="mailto:soporte@playstop.pe"
              style={{ display: 'block', padding: '12px 24px', background: '#1e293b', color: '#94a3b8', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', marginBottom: 12, border: '1px solid #334155' }}>
              📧 soporte@playstop.pe
            </a>
            <button onClick={() => navigate(-1)}
              style={{ padding: '12px 24px', background: 'transparent', color: '#64748b', border: '1px solid #1e293b', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
              Volver
            </button>
          </div>
        )}

        {/* Content */}
        {!user?.bannedFromReservations && (loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #1e293b', borderTop: '3px solid #2563eb', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#64748b', fontWeight: 600 }}>Cargando cancha...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}><i className="bi bi-exclamation-triangle-fill" style={{ color: '#ef4444' }} /></div>
            <p style={{ color: '#ef4444', fontWeight: 700, marginBottom: 24 }}>{error}</p>
            <button onClick={() => navigate(-1)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', borderRadius: 12, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>Volver</button>
          </div>
        ) : (
          <>
            {step === 1 && court && <CourtDetail court={court} onNext={() => setStep(2)} user={user} />}
            {step === 2 && <DateTimePicker courtId={courtId} initialHours={initialHours} onBack={goBack} onNext={(sel) => { setBooking(sel); setStep(3); }} />}
            {step === 3 && court && <BookingSummary court={court} booking={booking} onNext={() => setStep(4)} onBack={goBack} />}
            {step === 4 && court && <PaymentView court={court} booking={booking} onPay={handlePay} processing={processing} payError={payError} />}
          </>
        ))}
      </div>
    </div>
  );
}
