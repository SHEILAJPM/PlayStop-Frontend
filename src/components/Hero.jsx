import { useState, useEffect } from 'react';
import CanchasDestacadas from './CanchasDestacadas';

const Hero = () => {
  const backgroundImages = [
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1920&auto=format&fit=crop'
  ];

  const [currentImage, setCurrentImage] = useState(0);
  
  // Estados para los menús desplegables
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedSport, setSelectedSport] = useState({ icon: '⚽', text: '¿Qué deporte buscas?' });
  const [selectedLocation, setSelectedLocation] = useState({ icon: '📍', text: '¿En qué ciudad?' });
  const [selectedDistrict, setSelectedDistrict] = useState({ icon: '🏘️', text: '¿En qué distrito?' });
  const [selectedDate, setSelectedDate] = useState({ icon: '📅', text: 'Fecha y hora' });

  // Opciones de sugerencia para cada menú
  const sports = [
    { icon: '⚽', text: 'Fútbol' },
    { icon: '🎾', text: 'Tenis' },
    { icon: '🏸', text: 'Pádel' },
    { icon: '🏀', text: 'Baloncesto' }
  ];
  const locations = [
    { icon: '📍', text: 'Lima' },
    { icon: '📍', text: 'Arequipa' },
    { icon: '📍', text: 'Cusco' },
    { icon: '📍', text: 'Trujillo' }
  ];
  
  // Mapeo de los distritos según la ciudad seleccionada
  const districtsMap = {
    'Lima': [
      { icon: '🏘️', text: 'Miraflores' },
      { icon: '🏘️', text: 'San Isidro' },
      { icon: '🏘️', text: 'Santiago de Surco' },
      { icon: '🏘️', text: 'San Borja' }
    ],
    'Arequipa': [
      { icon: '🏘️', text: 'Cayma' },
      { icon: '🏘️', text: 'Yanahuara' },
      { icon: '🏘️', text: 'Cerro Colorado' }
    ],
    'Cusco': [
      { icon: '🏘️', text: 'Wanchaq' },
      { icon: '🏘️', text: 'San Sebastián' },
      { icon: '🏘️', text: 'San Jerónimo' }
    ],
    'Trujillo': [
      { icon: '🏘️', text: 'Víctor Larco' },
      { icon: '🏘️', text: 'Huanchaco' },
      { icon: '🏘️', text: 'El Porvenir' }
    ]
  };
  
  const currentDistricts = districtsMap[selectedLocation.text] || [];

  const dates = [
    { icon: '📅', text: 'Hoy' },
    { icon: '📅', text: 'Mañana' },
    { icon: '📅', text: 'Este fin de semana' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <>
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '80px 5%', minHeight: '85vh', position: 'relative', overflow: 'hidden' }}>
      {/* Estilos CSS integrados para animaciones */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>

      {backgroundImages.map((img, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: currentImage === index ? 1 : 0,
            transform: currentImage === index ? 'scale(1.05)' : 'scale(1)',
            transition: 'opacity 1.5s ease-in-out, transform 6s linear',
            zIndex: 0
          }}
        />
      ))}

      {/* Capa oscura con gradiente para mejorar lectura y lucir la imagen */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(90deg, rgba(17,24,39,0.95) 0%, rgba(17,24,39,0.8) 40%, rgba(17,24,39,0.3) 100%)', zIndex: 1 }}></div>
      
      <div style={{ flex: '1', maxWidth: '650px', zIndex: 10, position: 'relative' }}>
        <div style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: 'rgba(0, 208, 132, 0.15)', color: '#34d399', border: '1px solid rgba(0, 208, 132, 0.3)', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem', marginBottom: '24px' }}>
          El ecosistema deportivo definitivo
        </div>
        <h2 style={{ fontSize: '4.2rem', margin: '0 0 24px 0', color: '#ffffff', fontWeight: '900', lineHeight: '1.05', letterSpacing: '-2px' }}>
          Digitaliza tu pasión, <br/><span style={{ color: '#00d084' }}>erradica la informalidad</span>
        </h2>
        <p style={{ fontSize: '1.25rem', margin: '0 0 40px 0', color: '#d1d5db', lineHeight: '1.6' }}>
          La plataforma más robusta para buscar, comparar y reservar infraestructuras deportivas. Toma el control de tu club y mejora la experiencia de tus jugadores.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <button style={{ backgroundColor: '#00d084', color: '#ffffff', border: 'none', padding: '16px 36px', fontSize: '1.1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 8px 20px -4px rgba(0, 208, 132, 0.4)' }}>
            Reservar una cancha
          </button>
          <button style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '16px 36px', fontSize: '1.1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', backdropFilter: 'blur(4px)' }}>
            Gestionar mi Club
          </button>
        </div>
      </div>

      <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', zIndex: 10, position: 'relative', animation: 'float 6s ease-in-out infinite' }}>
        
        {/* Widget de Búsqueda Rápida (Glassmorphism) */}
        <div style={{ width: '100%', maxWidth: '420px', backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(16px)', borderRadius: '24px', padding: '35px', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <h3 style={{ color: 'white', fontSize: '1.6rem', fontWeight: '800', marginBottom: '25px', letterSpacing: '-0.5px' }}>Encuentra tu partido</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Selector de Deporte */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setOpenDropdown(openDropdown === 'sport' ? null : 'sport')}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '14px 18px', color: selectedSport.text.includes('¿') ? '#d1d5db' : '#ffffff', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <span style={{ fontSize: '1.2rem' }}>{selectedSport.icon}</span> <span style={{ opacity: 0.9, fontWeight: '500' }}>{selectedSport.text}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
              </div>
              {openDropdown === 'sport' && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '5px', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', zIndex: 50, overflow: 'hidden' }}>
                  {sports.map((item, i) => (
                    <div key={i} onClick={() => { setSelectedSport(item); setOpenDropdown(null); }} style={{ padding: '12px 18px', color: 'white', display: 'flex', gap: '12px', cursor: 'pointer', borderBottom: i < sports.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
                      <span>{item.icon}</span> <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selector de Ubicación */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '14px 18px', color: selectedLocation.text.includes('¿') ? '#d1d5db' : '#ffffff', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <span style={{ fontSize: '1.2rem' }}>{selectedLocation.icon}</span> <span style={{ opacity: 0.9, fontWeight: '500' }}>{selectedLocation.text}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
              </div>
              {openDropdown === 'location' && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '5px', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', zIndex: 50, overflow: 'hidden' }}>
                  {locations.map((item, i) => (
                    <div key={i} onClick={() => { setSelectedLocation(item); setSelectedDistrict({ icon: '🏘️', text: '¿En qué distrito?' }); setOpenDropdown(null); }} style={{ padding: '12px 18px', color: 'white', display: 'flex', gap: '12px', cursor: 'pointer', borderBottom: i < locations.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
                      <span>{item.icon}</span> <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selector de Distrito (Depende de la ciudad) */}
            <div style={{ position: 'relative', transition: 'all 0.3s ease', opacity: selectedLocation.text.includes('¿') ? 0.6 : 1 }}>
              <div 
                onClick={() => !selectedLocation.text.includes('¿') && setOpenDropdown(openDropdown === 'district' ? null : 'district')}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '14px 18px', color: selectedDistrict.text.includes('¿') ? '#d1d5db' : '#ffffff', display: 'flex', alignItems: 'center', gap: '12px', cursor: selectedLocation.text.includes('¿') ? 'not-allowed' : 'pointer' }}>
                <span style={{ fontSize: '1.2rem' }}>{selectedDistrict.icon}</span> <span style={{ opacity: 0.9, fontWeight: '500' }}>{selectedDistrict.text}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
              </div>
              {openDropdown === 'district' && currentDistricts.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '5px', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', zIndex: 50, overflow: 'hidden' }}>
                  {currentDistricts.map((item, i) => (
                    <div key={i} onClick={() => { setSelectedDistrict(item); setOpenDropdown(null); }} style={{ padding: '12px 18px', color: 'white', display: 'flex', gap: '12px', cursor: 'pointer', borderBottom: i < currentDistricts.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
                      <span>{item.icon}</span> <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selector de Fecha */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '14px 18px', color: selectedDate.text === 'Fecha y hora' ? '#d1d5db' : '#ffffff', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <span style={{ fontSize: '1.2rem' }}>{selectedDate.icon}</span> <span style={{ opacity: 0.9, fontWeight: '500' }}>{selectedDate.text}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
              </div>
              {openDropdown === 'date' && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '5px', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', zIndex: 50, overflow: 'hidden' }}>
                  {dates.map((item, i) => (
                    <div key={i} onClick={() => { setSelectedDate(item); setOpenDropdown(null); }} style={{ padding: '12px 18px', color: 'white', display: 'flex', gap: '12px', cursor: 'pointer', borderBottom: i < dates.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
                      <span>{item.icon}</span> <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Botón Buscar */}
            <button style={{ marginTop: '10px', backgroundColor: '#00d084', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 20px -4px rgba(0, 208, 132, 0.4)' }}>
              Buscar Canchas
            </button>
          </div>

          {/* Estadísticas Rápidas */}
          <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-around', color: 'white', textAlign: 'center' }}>
            <div>
              <div style={{ fontWeight: '900', fontSize: '1.4rem', color: '#00d084' }}>+500</div>
              <div style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: '500' }}>Canchas</div>
            </div>
            <div>
              <div style={{ fontWeight: '900', fontSize: '1.4rem', color: '#00d084' }}>10k</div>
              <div style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: '500' }}>Jugadores</div>
            </div>
          </div>
        </div>
      </div>
    </main>
      <CanchasDestacadas />
    </>
  );
};

export default Hero;