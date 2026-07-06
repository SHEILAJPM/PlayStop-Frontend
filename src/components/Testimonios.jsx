
const testimonios = [
  {
    id: 1,
    text: "PlayStop nos cambió la vida. La gestión de reservas es automática y los ingresos de nuestro club subieron un 40%.",
    author: "Carlos R.",
    role: "Administrador de Club",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    text: "Nunca fue tan fácil armar un partido. En 2 minutos ya tenemos cancha y todos pagaron su parte sin excusas.",
    author: "Martín F.",
    role: "Jugador Amateur",
    image: "https://randomuser.me/api/portraits/men/44.jpg"
  },
  {
    id: 3,
    text: "El panel de control es increíble. Podemos ver qué horarios son más rentables y crear promociones en segundos.",
    author: "Lucía G.",
    role: "Gerente de Complejo",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: 4,
    text: "Ya no peleo por cobrarle a mis amigos. El pago dividido automatizado es literalmente el mejor invento.",
    author: "Diego A.",
    role: "Jugador Frecuente",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    id: 5,
    text: "Cero ausentismo. Como los jugadores pagan por adelantado, la rentabilidad de las canchas está al máximo.",
    author: "Andrés V.",
    role: "Dueño de Club",
    image: "https://randomuser.me/api/portraits/men/55.jpg"
  },
  {
    id: 6,
    text: "La interfaz es hermosa y muy rápida. Encuentro canchas de pádel disponibles en cualquier distrito en segundos.",
    author: "Valeria C.",
    role: "Jugadora de Pádel",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

const Testimonios = () => {
  return (
    <section id="testimonios" className="reveal" style={{ scrollMarginTop: '80px', padding: '120px 0', backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url("https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1920&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', overflow: 'hidden', position: 'relative' }}>
      
      {/* Animación infinita calculada matemáticamente para coincidir con los espacios */}
      <style>
        {`
          @keyframes scrollCarousel {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 15px)); }
          }
          .carousel-track:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 60px auto', padding: '0 5%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '36px', height: '3px', borderRadius: '2px', background: 'linear-gradient(90deg, transparent, #2563eb)' }} />
          <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '2.5px', textTransform: 'uppercase' }}>Comunidad PlayStop</span>
          <div style={{ width: '36px', height: '3px', borderRadius: '2px', background: 'linear-gradient(90deg, #2563eb, transparent)' }} />
        </div>
        <h2 style={{ fontSize: '3.5rem', color: '#ffffff', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1.5px', lineHeight: '1.1' }}>Lo que dicen <span style={{ color: '#f59e0b' }}>nuestros usuarios</span></h2>
        <p style={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: '1.7' }}>Miles de jugadores y administradores ya están revolucionando su forma de vivir y gestionar el deporte.</p>
      </div>

      {/* Contenedor del Carrusel con Máscaras de Gradiente para los bordes */}
      <div style={{ position: 'relative', width: '100%', display: 'flex', overflow: 'hidden' }}>
        
        {/* Sombras laterales de desvanecimiento */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '150px', height: '100%', background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, transparent 100%)', zIndex: 10, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '100%', background: 'linear-gradient(to left, rgba(15, 23, 42, 0.95) 0%, transparent 100%)', zIndex: 10, pointerEvents: 'none' }}></div>

        {/* Track animado. Duplicamos las tarjetas para crear la ilusión de scroll infinito */}
        <div className="carousel-track" style={{ display: 'flex', gap: '30px', width: 'max-content', animation: 'scrollCarousel 80s linear infinite', padding: '20px 0' }}>
          {[...testimonios, ...testimonios].map((testimonio, index) => (
            <div 
              key={index} 
              style={{ width: '380px', padding: '40px', background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.5) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', borderTop: '1px solid rgba(255, 255, 255, 0.15)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} 
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-12px)'; e.currentTarget.style.background = 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%)'; e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.4)'; e.currentTarget.style.boxShadow = '0 30px 60px -15px rgba(37, 99, 235, 0.25)'; }} 
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.5) 100%)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderTopColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.5)'; }}
            >
              {/* Comilla Decorativa de Marca de Agua */}
              <div style={{ position: 'absolute', top: '15px', right: '25px', fontSize: '7rem', color: 'rgba(255, 255, 255, 0.04)', fontFamily: 'Georgia, serif', lineHeight: 1, pointerEvents: 'none', zIndex: 0 }}>"</div>
              
              {/* Calificación (5 Estrellas SVG) */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '25px', position: 'relative', zIndex: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.4))' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>

              <p style={{ color: '#f8fafc', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '35px', fontWeight: '400', position: 'relative', zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>"{testimonio.text}"</p>
              
              {/* Información del Usuario */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                <img src={testimonio.image} alt={testimonio.author} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb', boxShadow: '0 0 12px rgba(37, 99, 235, 0.4)' }} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#ffffff', fontWeight: '800', letterSpacing: '-0.3px' }}>{testimonio.author}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{testimonio.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonios;