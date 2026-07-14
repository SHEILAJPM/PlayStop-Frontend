import { useState, createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cloudinaryResize } from '../utils/cloudinary.js';

/* ── Context ── */
const ComparadorContext = createContext(null);

export function ComparadorProvider({ children }) {
  const [selected, setSelected] = useState([]);

  const toggle = useCallback((court) => {
    setSelected(prev => {
      const exists = prev.find(c => c.id === court.id);
      if (exists) return prev.filter(c => c.id !== court.id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, court];
    });
  }, []);

  const isSelected = useCallback((id) => selected.some(c => c.id === id), [selected]);
  const clear = useCallback(() => setSelected([]), []);

  return (
    <ComparadorContext.Provider value={{ selected, toggle, isSelected, clear }}>
      {children}
    </ComparadorContext.Provider>
  );
}

export function useComparador() {
  return useContext(ComparadorContext);
}

/* ── Checkbox to embed in court cards ── */
export function ComparadorCheckbox({ court }) {
  const { toggle, isSelected } = useComparador();
  const checked = isSelected(court.id);
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); toggle(court); }}
      title={checked ? 'Quitar de comparación' : 'Agregar a comparación'}
      style={{
        position: 'absolute', top: 12, left: 12, zIndex: 10,
        width: 28, height: 28, borderRadius: 7,
        background: checked ? '#3b82f6' : 'rgba(15,23,42,0.75)',
        border: `2px solid ${checked ? '#3b82f6' : 'rgba(255,255,255,0.25)'}`,
        backdropFilter: 'blur(4px)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
      {checked
        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      }
    </button>
  );
}

/* ── Floating bar ── */
export function ComparadorBar() {
  const { selected, clear } = useComparador();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  if (selected.length < 2) return null;

  return (
    <>
      <div style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        background: '#0a1628', border: '1px solid #3b82f6',
        borderRadius: 20, padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: '0 8px 32px rgba(59,130,246,0.25)',
        zIndex: 8000, backdropFilter: 'blur(8px)',
        animation: 'slideUp 0.3s ease',
      }}>
        <style>{`@keyframes slideUp{from{transform:translateX(-50%) translateY(20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}`}</style>
        <div style={{ display: 'flex', gap: 8 }}>
          {selected.map(c => (
            <img key={c.id} src={cloudinaryResize(c.imageUrl, 64) || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&q=60'}
              alt={c.name} loading="lazy" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', border: '2px solid #3b82f6' }} />
          ))}
        </div>
        <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.88rem' }}>
          Comparar ({selected.length})
        </span>
        <button onClick={() => setShowModal(true)}
          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10, padding: '7px 16px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
          Ver comparación
        </button>
        <button onClick={clear}
          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>✕</button>
      </div>

      {showModal && <ComparadorModal courts={selected} onClose={() => setShowModal(false)} onBook={id => { setShowModal(false); navigate(`/reservar/${id}`); }} />}
    </>
  );
}

/* ── Comparison modal ── */
function ComparadorModal({ courts, onClose, onBook }) {
  const rows = [
    { label: 'Deporte',     key: c => c.sportType },
    { label: 'Precio/hora', key: c => `S/ ${parseFloat(c.pricePerHour).toFixed(0)}` },
    { label: 'Distrito',    key: c => c.district || c.city || '—' },
    { label: 'Rating',      key: c => c.averageRating ? `⭐ ${c.averageRating.toFixed(1)} (${c.reviewCount})` : 'Sin reseñas' },
    { label: 'Propietario', key: c => c.ownerName || '—' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9500, padding: '20px' }}>
      <div style={{ background: '#0a1628', border: '1px solid #1e293b', borderRadius: 20, width: '100%', maxWidth: 820, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#f1f5f9', fontWeight: 900, fontSize: '1.2rem' }}>Comparar canchas</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.3rem' }}>✕</button>
        </div>

        <div style={{ padding: '20px 24px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                <th style={{ width: 120, padding: '10px 0', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', textAlign: 'left' }}>Característica</th>
                {courts.map(c => (
                  <th key={c.id} style={{ padding: '0 12px 16px', textAlign: 'center', verticalAlign: 'top' }}>
                    <div style={{ background: '#030712', borderRadius: 14, overflow: 'hidden', border: '1px solid #1e293b' }}>
                      <img src={cloudinaryResize(c.imageUrl, 220) || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=300&q=60'}
                        alt={c.name} loading="lazy" style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                      <div style={{ padding: '10px 12px 14px' }}>
                        <p style={{ margin: '0 0 4px', color: '#f1f5f9', fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.2 }}>{c.name}</p>
                        <button onClick={() => onBook(c.id)}
                          style={{ marginTop: 6, padding: '7px 14px', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', width: '100%' }}>
                          Reservar →
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ label, key }) => (
                <tr key={label}>
                  <td style={{ padding: '12px 0', color: '#64748b', fontSize: '0.82rem', fontWeight: 700, borderTop: '1px solid #1e293b', verticalAlign: 'middle' }}>{label}</td>
                  {courts.map(c => (
                    <td key={c.id} style={{ padding: '12px 12px', textAlign: 'center', borderTop: '1px solid #1e293b', color: '#f1f5f9', fontWeight: 600, fontSize: '0.88rem', verticalAlign: 'middle' }}>
                      {key(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
