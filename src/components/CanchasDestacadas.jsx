import { useNavigate } from 'react-router-dom';

const CanchasDestacadas = () => {
  const navigate = useNavigate();
  const canchas = [
    { id: 1, img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80', name: 'Cancha El Clásico', type: 'Fútbol 7 • Sintética', price: 'S/ 80', rating: '4.9' },
    { id: 2, img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80', name: 'Pádel Center Surco', type: 'Pádel • Cristal', price: 'S/ 60', rating: '4.8' },
    { id: 3, img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', name: 'Tenis Club San Isidro', type: 'Tenis • Arcilla', price: 'S/ 100', rating: '5.0' },
    { id: 4, img: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80', name: 'DeporPlaza Norte', type: 'Fútbol 5 • Sintética', price: 'S/ 70', rating: '4.7' },
    { id: 5, img: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80', name: 'Complejo La 10', type: 'Fútbol 11 • Césped Natural', price: 'S/ 150', rating: '4.9' },
    { id: 6, img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80', name: 'Padel Pro Elite', type: 'Pádel • Indoor', price: 'S/ 90', rating: '4.9' },
    { id: 7, img: 'https://images.unsplash.com/photo-1542652694-40abf526446e?w=800&q=80', name: 'Basket City Sur', type: 'Baloncesto • Coliseo', price: 'S/ 75', rating: '4.6' },
    { id: 8, img: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80', name: 'Vóley Arena Costa', type: 'Vóley Playa • Arena', price: 'S/ 50', rating: '4.8' },
  ];

  return (
    <section id="canchas-destacadas" className="reveal" style={{
      padding: '100px 0',
      background: 'linear-gradient(180deg, #030712 0%, #0f172a 50%, #030712 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>

      <style>{`
        @keyframes scrollCanchas {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 15px)); }
        }
        .canchas-track {
          display: flex;
          gap: 30px;
          width: max-content;
          animation: scrollCanchas 60s linear infinite;
          padding: 20px 0;
        }
        .canchas-track:hover { animation-play-state: paused; }
        .cancha-card {
          width: 340px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
          cursor: pointer;
          backdrop-filter: blur(12px);
        }
        .cancha-card:hover {
          transform: translateY(-10px);
          border-color: rgba(0,208,132,0.35);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,208,132,0.15), 0 0 40px -10px rgba(0,208,132,0.2);
          background: rgba(255,255,255,0.07);
        }
        .cancha-btn {
          background: linear-gradient(135deg, #00d084 0%, #00b875 100%);
          color: #0a1628;
          border: none;
          padding: 11px 22px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(0,208,132,0.35);
          font-size: 0.9rem;
        }
        .cancha-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(0,208,132,0.5);
        }
        .ver-todas-btn {
          padding: 12px 24px;
          background: rgba(255,255,255,0.06);
          color: #e2e8f0;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          font-size: 0.95rem;
        }
        .ver-todas-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(0,208,132,0.4);
          color: #00d084;
        }
      `}</style>

      {/* Orbs de fondo decorativos */}
      <div style={{
        position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(0,208,132,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%', width: '350px', height: '350px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            {/* Label decorativo con línea verde */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '3px', borderRadius: '2px', background: 'linear-gradient(90deg, #00d084, transparent)' }} />
              <span style={{ color: '#00d084', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                Top Valoradas
              </span>
            </div>
            <h2 style={{ fontSize: '3rem', color: '#f1f5f9', fontWeight: '900', margin: 0, letterSpacing: '-1.5px', lineHeight: 1.1 }}>
              Canchas <span style={{
                background: 'linear-gradient(90deg, #00d084 0%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Destacadas</span>
            </h2>
          </div>
          <button className="ver-todas-btn" onClick={() => document.getElementById('jugadores')?.scrollIntoView()}>
            Ver todas las canchas →
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', display: 'flex', overflow: 'hidden' }}>
        {/* Máscaras laterales adaptadas al fondo dark */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '160px', height: '100%', background: 'linear-gradient(to right, #030712 0%, transparent 100%)', zIndex: 10, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '160px', height: '100%', background: 'linear-gradient(to left, #030712 0%, transparent 100%)', zIndex: 10, pointerEvents: 'none' }} />

        <div className="canchas-track">
          {[...canchas, ...canchas].map((cancha, i) => (
            <div key={`${cancha.id}-${i}`} className="cancha-card">
              <div style={{ height: '220px', backgroundImage: `url(${cancha.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                {/* Overlay degradado en la imagen */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,7,18,0.6) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', top: '14px', right: '14px', backgroundColor: 'rgba(3,7,18,0.75)', backdropFilter: 'blur(8px)', padding: '5px 11px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: '800', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid rgba(251,191,36,0.25)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {cancha.rating}
                </div>
              </div>
              <div style={{ padding: '22px' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.78rem', color: '#00d084', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{cancha.type}</p>
                <h3 style={{ margin: '0 0 18px 0', fontSize: '1.2rem', fontWeight: '800', color: '#f1f5f9', letterSpacing: '-0.3px' }}>{cancha.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Precio</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#f1f5f9' }}>{cancha.price}<span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '500' }}>/hr</span></span>
                  </div>
                  <button className="cancha-btn" onClick={() => navigate(`/reservar/${cancha.id}`)}>
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CanchasDestacadas;
