import { useNavigate } from 'react-router-dom';

const CanchasDestacadas = () => {
  const navigate = useNavigate();
  const canchas = [
    { 
      id: 1, 
      img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80', 
      name: 'Cancha El Clásico', 
      type: 'Fútbol 7 • Sintética', 
      price: 'S/ 80', 
      rating: '4.9' 
    },
    { 
      id: 2, 
      img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80', 
      name: 'Pádel Center Surco', 
      type: 'Pádel • Cristal', 
      price: 'S/ 60', 
      rating: '4.8' 
    },
    { 
      id: 3, 
      img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', 
      name: 'Tenis Club San Isidro', 
      type: 'Tenis • Arcilla', 
      price: 'S/ 100', 
      rating: '5.0' 
    },
    { 
      id: 4, 
      img: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80', 
      name: 'DeporPlaza Norte', 
      type: 'Fútbol 5 • Sintética', 
      price: 'S/ 70', 
      rating: '4.7' 
    },
    { 
      id: 5, 
      img: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80', 
      name: 'Complejo La 10', 
      type: 'Fútbol 11 • Césped Natural', 
      price: 'S/ 150', 
      rating: '4.9' 
    },
    { 
      id: 6, 
      img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80', 
      name: 'Padel Pro Elite', 
      type: 'Pádel • Indoor', 
      price: 'S/ 90', 
      rating: '4.9' 
    },
    { 
      id: 7, 
      img: 'https://images.unsplash.com/photo-1542652694-40abf526446e?w=800&q=80', 
      name: 'Basket City Sur', 
      type: 'Baloncesto • Coliseo', 
      price: 'S/ 75', 
      rating: '4.6' 
    },
    { 
      id: 8, 
      img: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80', 
      name: 'Vóley Arena Costa', 
      type: 'Vóley Playa • Arena', 
      price: 'S/ 50', 
      rating: '4.8' 
    },
  ];

  return (
    <section id="canchas-destacadas" className="reveal" style={{ padding: '100px 0', backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden' }}>
      
      <style>
        {`
          @keyframes scrollCanchas {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 15px)); } /* -15px ajusta el gap para un loop perfecto */
          }
          .canchas-track {
            display: flex;
            gap: 30px;
            width: max-content;
            animation: scrollCanchas 60s linear infinite;
            padding: 20px 0;
          }
          .canchas-track:hover {
            animation-play-state: paused;
          }
          .cancha-card {
            width: 340px;
            flex-shrink: 0;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          }
          .cancha-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
            border-color: #cbd5e1;
          }
        `}
      </style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="section-badge" style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3b82f6', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Top Valoradas</div>
            <h2 style={{ fontSize: '3rem', color: '#0f172a', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>
              Canchas <span style={{ color: '#3b82f6' }}>Destacadas</span>
            </h2>
          </div>
          <button onClick={() => document.getElementById('jugadores').scrollIntoView()} style={{ padding: '12px 24px', backgroundColor: '#f1f5f9', color: '#0f172a', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}>
            Ver todas las canchas →
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', display: 'flex', overflow: 'hidden' }}>
        
        {/* Máscaras de desvanecimiento lateral (Glass edges) */}
        <div className="fade-left" style={{ position: 'absolute', top: 0, left: 0, width: '150px', height: '100%', background: 'linear-gradient(to right, #ffffff 0%, transparent 100%)', zIndex: 10, pointerEvents: 'none' }}></div>
        <div className="fade-right" style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '100%', background: 'linear-gradient(to left, #ffffff 0%, transparent 100%)', zIndex: 10, pointerEvents: 'none' }}></div>

        <div className="canchas-track">
          {/* Duplicamos el array para crear el loop infinito sin cortes */}
          {[...canchas, ...canchas].map((cancha, i) => (
            <div key={`${cancha.id}-${i}`} className="cancha-card">
              <div style={{ height: '220px', backgroundImage: `url(${cancha.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '800', color: '#047857', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  {cancha.rating}
                </div>
              </div>
              <div style={{ padding: '24px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cancha.type}</p>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>{cancha.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Precio</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a' }}>{cancha.price}<span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>/hr</span></span>
                  </div>
                  <button onClick={() => navigate(`/reservar/${cancha.id}`)} style={{ backgroundColor: '#00d084', color: '#0a1628', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,208,132,0.3)' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,208,132,0.4)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,208,132,0.3)'; }}>
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