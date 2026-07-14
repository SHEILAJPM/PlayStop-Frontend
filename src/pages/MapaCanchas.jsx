import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { cloudinaryResize } from '../utils/cloudinary.js';

// Fix Leaflet default marker icon missing in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 11.314 16 26 16 26S32 27.314 32 16C32 7.163 24.837 0 16 0z" fill="#2563eb" stroke="#009f65" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="7" fill="white"/>
      <circle cx="16" cy="16" r="4" fill="#2563eb"/>
    </svg>`),
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
});

const SPORT_FILTERS = ['Todos', 'Fútbol', 'Pádel', 'Tenis', 'Baloncesto', 'Vóley'];
const RADIUS_OPTIONS = [
  { label: '1 km',  value: 1000 },
  { label: '3 km',  value: 3000 },
  { label: '5 km',  value: 5000 },
  { label: '10 km', value: 10000 },
];

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function FlyToUser({ pos }) {
  const map = useMap();
  useEffect(() => { if (pos) map.flyTo(pos, 14, { animate: true, duration: 1.2 }); }, [pos, map]);
  return null;
}

export default function MapaCanchas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPos, setUserPos] = useState(null);
  const [sportFilter, setSportFilter] = useState('Todos');
  const [maxPrice, setMaxPrice] = useState(300);
  const [radius, setRadius] = useState(null);
  const [selected, setSelected] = useState(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    api.getAllCourts()
      .then(data => setCourts(Array.isArray(data) ? data.filter(c => c.latitude && c.longitude) : []))
      .catch(() => setCourts([]))
      .finally(() => setLoading(false));
  }, []);

  const locateMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setUserPos([pos.coords.latitude, pos.coords.longitude]); setLocating(false); },
      ()  => setLocating(false),
      { timeout: 8000 }
    );
  };

  const filtered = courts.filter(c => {
    if (sportFilter !== 'Todos' && !c.sportType?.toLowerCase().includes(sportFilter.toLowerCase())) return false;
    if (parseFloat(c.pricePerHour) > maxPrice) return false;
    if (radius && userPos) {
      const dist = haversineKm(userPos[0], userPos[1], c.latitude, c.longitude) * 1000;
      if (dist > radius) return false;
    }
    return true;
  });

  const DEFAULT_CENTER = [-12.046374, -77.042793]; // Lima
  const mapCenter = userPos || DEFAULT_CENTER;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#030712' }}>
      <style>{`
        .court-sidebar {
          width: 300px; background: #0a1628; border-left: 1px solid #1e293b;
          overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px;
        }
        @media (max-width: 768px) {
          .court-sidebar {
            position: fixed; left: 0; right: 0; bottom: 0; width: auto; max-height: 65vh;
            border-left: none; border-top: 1px solid #1e293b; border-radius: 20px 20px 0 0;
            box-shadow: 0 -8px 24px rgba(0,0,0,0.4); z-index: 1000;
          }
        }
      `}</style>

      {/* Top bar */}
      <div style={{ background: '#0a1628', borderBottom: '1px solid #1e293b', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', zIndex: 1000 }}>
        <Link to="/" style={{ color: '#2563eb', fontWeight: 900, fontSize: '1.1rem', textDecoration: 'none', marginRight: 8 }}>PlayStop</Link>
        <span style={{ color: '#475569', fontSize: '0.85rem' }}>/ Mapa de Canchas</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>{filtered.length} canchas</span>
        <button onClick={locateMe} disabled={locating}
          style={{ background: locating ? '#1e293b' : 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.3)', color: '#2563eb', borderRadius: 10, padding: '7px 14px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="bi bi-geo-alt-fill" />
          {locating ? 'Localizando...' : 'Mi ubicación'}
        </button>
      </div>

      {/* Filters bar */}
      <div style={{ background: '#0a1628', borderBottom: '1px solid #1e293b', padding: '10px 20px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', zIndex: 999 }}>
        {/* Sport filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SPORT_FILTERS.map(s => (
            <button key={s} onClick={() => setSportFilter(s)}
              style={{ padding: '5px 12px', borderRadius: 20, border: sportFilter === s ? '1px solid #2563eb' : '1px solid #1e293b', background: sportFilter === s ? 'rgba(37, 99, 235, 0.15)' : 'transparent', color: sportFilter === s ? '#2563eb' : '#64748b', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
              {s}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 24, background: '#1e293b' }} />

        {/* Price filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap' }}>Hasta S/ {maxPrice}</span>
          <input type="range" min={20} max={300} step={10} value={maxPrice}
            onChange={e => setMaxPrice(+e.target.value)}
            style={{ width: 100, accentColor: '#2563eb' }} />
        </div>

        <div style={{ width: 1, height: 24, background: '#1e293b' }} />

        {/* Radius filter — only when user located */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700 }}>Radio:</span>
          {RADIUS_OPTIONS.map(r => (
            <button key={r.value} onClick={() => setRadius(radius === r.value ? null : r.value)}
              disabled={!userPos}
              style={{ padding: '5px 10px', borderRadius: 20, border: radius === r.value ? '1px solid #3b82f6' : '1px solid #1e293b', background: radius === r.value ? 'rgba(59,130,246,0.15)' : 'transparent', color: radius === r.value ? '#3b82f6' : userPos ? '#64748b' : '#334155', fontSize: '0.78rem', fontWeight: 700, cursor: userPos ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map + sidebar */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          {loading ? (
            <div style={{ position: 'absolute', inset: 0, background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
              <div style={{ width: 40, height: 40, border: '3px solid #1e293b', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <p style={{ color: '#64748b', margin: 0 }}>Cargando canchas...</p>
            </div>
          ) : (
            <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyToUser pos={userPos} />

              {userPos && radius && (
                <Circle center={userPos} radius={radius}
                  pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.06, weight: 1.5 }} />
              )}

              {userPos && (
                <Marker position={userPos} icon={new L.Icon({
                  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
                      <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
                      <circle cx="12" cy="12" r="4" fill="white"/>
                    </svg>`),
                  iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -14]
                })}>
                  <Popup><b>Tu ubicación</b></Popup>
                </Marker>
              )}

              {filtered.map(c => (
                <Marker key={c.id} position={[c.latitude, c.longitude]} icon={greenIcon}
                  eventHandlers={{ click: () => setSelected(c) }}>
                  <Popup>
                    <div style={{ minWidth: 180 }}>
                      {c.imageUrl && <img src={cloudinaryResize(c.imageUrl, 200)} alt={c.name} loading="lazy" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />}
                      <strong>{c.name}</strong><br />
                      <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{c.sportType} · {c.district}</span><br />
                      <span style={{ fontWeight: 700, color: '#2563eb' }}>S/ {parseFloat(c.pricePerHour).toFixed(0)}/hr</span>
                      {c.averageRating && <span style={{ marginLeft: 8, color: '#f59e0b' }}>⭐ {c.averageRating.toFixed(1)}</span>}
                      <div style={{ marginTop: 8 }}>
                        <button onClick={() => navigate(user ? `/reservar/${c.id}` : '/login')}
                          style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: 6, padding: '5px 12px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', marginRight: 6 }}>
                          Reservar
                        </button>
                        {c.slug && (
                          <a href={`/cancha/${c.slug}`}
                            style={{ color: '#3b82f6', fontSize: '0.78rem', fontWeight: 600 }}>Ver detalles</a>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Selected court sidebar */}
        {selected && (
          <div className="court-sidebar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cancha seleccionada</p>
              <button onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
            </div>
            <img src={cloudinaryResize(selected.imageUrl, 300) || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&q=60'}
              alt={selected.name} loading="lazy" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12 }} />
            <div>
              <span style={{ background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.3)', color: '#2563eb', borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                {selected.sportType}
              </span>
              <h3 style={{ margin: '10px 0 4px', color: '#f1f5f9', fontWeight: 800, fontSize: '1.1rem' }}>{selected.name}</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.82rem' }}>
                <i className="bi bi-geo-alt-fill" style={{ marginRight: 4 }} />
                {selected.district ? `${selected.district}, ` : ''}{selected.city || 'Lima'}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#030712', borderRadius: 12, padding: '14px 16px', border: '1px solid #1e293b' }}>
              <div>
                <p style={{ margin: '0 0 2px', color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Precio</p>
                <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 900, fontSize: '1.2rem' }}>S/ {parseFloat(selected.pricePerHour).toFixed(0)}<span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>/hr</span></p>
              </div>
              {selected.averageRating && (
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 2px', color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Rating</p>
                  <p style={{ margin: 0, color: '#f59e0b', fontWeight: 900, fontSize: '1.2rem' }}>⭐ {selected.averageRating.toFixed(1)}</p>
                </div>
              )}
            </div>
            <button onClick={() => navigate(user ? `/reservar/${selected.id}` : '/login')}
              style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)' }}>
              Reservar →
            </button>
            {selected.slug && (
              <Link to={`/cancha/${selected.slug}`}
                style={{ textAlign: 'center', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                Ver página completa →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
