import { useState, useEffect } from 'react';

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
  const [selectedSport, setSelectedSport] = useState({ icon: 'bi-dribbble', text: '¿Qué deporte buscas?' });
  const [selectedLocation, setSelectedLocation] = useState({ icon: 'bi-geo-alt-fill', text: '¿En qué ciudad?' });
  const [selectedDistrict, setSelectedDistrict] = useState({ icon: 'bi-house-fill', text: '¿En qué distrito?' });
  const [selectedDate, setSelectedDate] = useState({ icon: 'bi-calendar3', text: 'Fecha y hora' });
  const [locatingStatus, setLocatingStatus] = useState('');

  // Opciones de sugerencia para cada menú
  const sports = [
    { icon: 'bi-dribbble',          text: 'Fútbol' },
    { icon: 'bi-circle-fill',       text: 'Tenis' },
    { icon: 'bi-record-circle',     text: 'Pádel' },
    { icon: 'bi-circle-half',       text: 'Baloncesto' },
  ];
  const locations = [
    { icon: 'bi-geo-alt-fill', text: 'Lima' },
    { icon: 'bi-geo-alt-fill', text: 'Arequipa' },
    { icon: 'bi-geo-alt-fill', text: 'Cusco' },
    { icon: 'bi-geo-alt-fill', text: 'Trujillo' },
  ];
  
  // Mapeo de los distritos según la ciudad seleccionada
  const districtsMap = {
    'Lima': [
      { icon: 'bi-house-fill', text: 'Miraflores' },
      { icon: 'bi-house-fill', text: 'San Isidro' },
      { icon: 'bi-house-fill', text: 'Santiago de Surco' },
      { icon: 'bi-house-fill', text: 'San Borja' },
    ],
    'Arequipa': [
      { icon: 'bi-house-fill', text: 'Cayma' },
      { icon: 'bi-house-fill', text: 'Yanahuara' },
      { icon: 'bi-house-fill', text: 'Cerro Colorado' },
    ],
    'Cusco': [
      { icon: 'bi-house-fill', text: 'Wanchaq' },
      { icon: 'bi-house-fill', text: 'San Sebastián' },
      { icon: 'bi-house-fill', text: 'San Jerónimo' },
    ],
    'Trujillo': [
      { icon: 'bi-house-fill', text: 'Víctor Larco' },
      { icon: 'bi-house-fill', text: 'Huanchaco' },
      { icon: 'bi-house-fill', text: 'El Porvenir' },
    ]
  };
  
  const currentDistricts = districtsMap[selectedLocation.text] || [];

  const dates = [
    { icon: 'bi-calendar3', text: 'Hoy' },
    { icon: 'bi-calendar3', text: 'Mañana' },
    { icon: 'bi-calendar3', text: 'Este fin de semana' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Función para detectar la ubicación real del usuario
  const handleDetectLocation = () => {
    setLocatingStatus('ciudad');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Usamos la API gratuita de OpenStreetMap para convertir coordenadas a ciudad
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            
            const city = data.address?.city || data.address?.town || data.address?.state || data.address?.region || 'Lima';
            const district = data.address?.suburb || data.address?.neighbourhood || data.address?.city_district || data.address?.county || '';
            
            // 1. Mostrar ciudad y cambiar estado a buscando distrito
            setTimeout(() => {
              setSelectedLocation({ icon: '📍', text: city });
              setLocatingStatus('distrito');
              
              // 2. Mostrar distrito y cerrar dropdown
              setTimeout(() => {
                if (district) {
                  setSelectedDistrict({ icon: 'bi-house-fill', text: district });
                } else {
                  setSelectedDistrict({ icon: 'bi-house-fill', text: '¿En qué distrito?' });
                }
                setLocatingStatus('');
                setOpenDropdown(null);
              }, 1200); // Pequeña pausa para que el usuario vea el cambio
            }, 500);
          } catch (error) {
            console.error("Error obteniendo ubicación", error);
            alert("Hubo un problema al detectar tu ciudad exacta.");
            setLocatingStatus('');
          }
        },
        (error) => {
          console.error("Error de geolocalización", error);
          setLocatingStatus('');
          alert("No pudimos detectar tu ubicación. Por favor, asegúrate de dar los permisos en tu navegador o selecciona una ciudad manualmente.");
        }
      );
    } else {
      setLocatingStatus('');
      alert("Tu navegador no soporta geolocalización.");
    }
  };

  return (
    <main className="hero-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '80px 5%', minHeight: '85vh', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      {/* Estilos CSS integrados para animaciones */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          @keyframes pulseLocation {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
          @media (max-width: 768px) {
            .hero-container { flex-direction: column !important; padding: 120px 5% 60px 5% !important; text-align: center; gap: 40px !important; }
            .hero-text-container { flex: 1 1 100% !important; max-width: 100% !important; }
            .hero-title { font-size: 2.6rem !important; }
            .hero-subtitle { font-size: 1.05rem !important; margin-bottom: 30px !important; }
            .hero-buttons { justify-content: center !important; flex-direction: column !important; gap: 15px !important; }
            .hero-buttons button { width: 100% !important; flex: none !important; }
            .hero-floating-anim { justify-content: center !important; width: 100% !important; animation: none !important; margin-top: 10px; }
            .hero-widget { width: 100% !important; max-width: 100% !important; padding: 25px 20px !important; box-sizing: border-box !important; }
            .widget-stats { flex-direction: row !important; gap: 10px !important; }
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
      
      <div className="hero-text-container" style={{ flex: '1', maxWidth: '650px', zIndex: 10, position: 'relative' }}>
        <div style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: 'rgba(0, 208, 132, 0.15)', color: '#34d399', border: '1px solid rgba(0, 208, 132, 0.3)', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem', marginBottom: '24px' }}>
          El ecosistema deportivo definitivo
        </div>
        <h2 className="hero-title" style={{ fontSize: '4.2rem', margin: '0 0 24px 0', color: '#ffffff', fontWeight: '900', lineHeight: '1.05', letterSpacing: '-2px' }}>
          Digitaliza tu pasión, <br/><span style={{ color: '#00d084' }}>erradica la informalidad</span>
        </h2>
        <p className="hero-subtitle" style={{ fontSize: '1.25rem', margin: '0 0 40px 0', color: '#d1d5db', lineHeight: '1.6' }}>
          La plataforma más robusta para buscar, comparar y reservar infraestructuras deportivas. Toma el control de tu club y mejora la experiencia de tus jugadores.
        </p>
        
        <div className="hero-buttons" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <button onClick={() => document.getElementById('canchas-destacadas').scrollIntoView()} style={{ backgroundColor: '#00d084', color: '#ffffff', border: 'none', padding: '16px 36px', fontSize: '1.1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 8px 20px -4px rgba(0, 208, 132, 0.4)' }}>
            Reservar una cancha
          </button>
          <button onClick={() => document.getElementById('clubes').scrollIntoView()} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '16px 36px', fontSize: '1.1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', backdropFilter: 'blur(4px)' }}>
            Gestionar mi Club
          </button>
        </div>
      </div>

        <div className="hero-floating-anim" style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', zIndex: 10, position: 'relative', animation: 'float 6s ease-in-out infinite' }}>
        
        {/* Widget de Búsqueda Rápida (Glassmorphism) */}
        <div className="hero-widget" style={{ width: '100%', maxWidth: '420px', backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(16px)', borderRadius: '24px', padding: '35px', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <h3 style={{ color: 'white', fontSize: '1.6rem', fontWeight: '800', marginBottom: '25px', letterSpacing: '-0.5px' }}>Encuentra tu partido</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Selector de Deporte */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setOpenDropdown(openDropdown === 'sport' ? null : 'sport')}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '14px 18px', color: selectedSport.text.includes('¿') ? '#d1d5db' : '#ffffff', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <i className={`bi ${selectedSport.icon}`} style={{ fontSize: '1.2rem' }} /> <span style={{ opacity: 0.9, fontWeight: '500' }}>{selectedSport.text}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
              </div>
              {openDropdown === 'sport' && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '5px', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', zIndex: 50, overflow: 'hidden' }}>
                  {sports.map((item, i) => (
                    <div key={i} onClick={() => { setSelectedSport(item); setOpenDropdown(null); }} style={{ padding: '12px 18px', color: 'white', display: 'flex', gap: '12px', cursor: 'pointer', borderBottom: i < sports.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
                      <i className={`bi ${item.icon}`} /> <span>{item.text}</span>
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
                <i className={`bi ${selectedLocation.icon}`} style={{ fontSize: '1.2rem' }} /> <span style={{ opacity: 0.9, fontWeight: '500' }}>{selectedLocation.text}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
              </div>
              {openDropdown === 'location' && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '5px', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', zIndex: 50, overflow: 'hidden' }}>
                  <div onClick={(e) => { e.stopPropagation(); handleDetectLocation(); }} style={{ padding: '12px 18px', color: '#00d084', display: 'flex', gap: '12px', cursor: 'pointer', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(0, 208, 132, 0.1)', fontWeight: '700', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 208, 132, 0.2)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 208, 132, 0.1)'}>
                    <i className={`bi ${locatingStatus !== '' ? 'bi-hourglass-split' : 'bi-crosshair2'}`} style={{ animation: locatingStatus !== '' ? 'pulseLocation 1s infinite' : 'none', display: 'inline-block' }} /> <span>{locatingStatus === 'ciudad' ? 'Detectando ciudad...' : locatingStatus === 'distrito' ? 'Detectando distrito...' : 'Usar mi ubicación actual'}</span>
                  </div>
                  {locations.map((item, i) => (
                    <div key={i} onClick={() => { setSelectedLocation(item); setSelectedDistrict({ icon: 'bi-house-fill', text: '¿En qué distrito?' }); setOpenDropdown(null); }} style={{ padding: '12px 18px', color: 'white', display: 'flex', gap: '12px', cursor: 'pointer', borderBottom: i < locations.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
                      <i className={`bi ${item.icon}`} /> <span>{item.text}</span>
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
                <i className={`bi ${selectedDistrict.icon}`} style={{ fontSize: '1.2rem' }} /> <span style={{ opacity: 0.9, fontWeight: '500' }}>{selectedDistrict.text}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
              </div>
              {openDropdown === 'district' && currentDistricts.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '5px', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', zIndex: 50, overflow: 'hidden' }}>
                  {currentDistricts.map((item, i) => (
                    <div key={i} onClick={() => { setSelectedDistrict(item); setOpenDropdown(null); }} style={{ padding: '12px 18px', color: 'white', display: 'flex', gap: '12px', cursor: 'pointer', borderBottom: i < currentDistricts.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
                      <i className={`bi ${item.icon}`} /> <span>{item.text}</span>
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
                <i className={`bi ${selectedDate.icon}`} style={{ fontSize: '1.2rem' }} /> <span style={{ opacity: 0.9, fontWeight: '500' }}>{selectedDate.text}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
              </div>
              {openDropdown === 'date' && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '5px', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', zIndex: 50, overflow: 'hidden' }}>
                  {dates.map((item, i) => (
                    <div key={i} onClick={() => { setSelectedDate(item); setOpenDropdown(null); }} style={{ padding: '12px 18px', color: 'white', display: 'flex', gap: '12px', cursor: 'pointer', borderBottom: i < dates.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
                      <i className={`bi ${item.icon}`} /> <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Botón Buscar */}
            <button onClick={() => document.getElementById('canchas-destacadas').scrollIntoView()} style={{ marginTop: '10px', backgroundColor: '#00d084', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 20px -4px rgba(0, 208, 132, 0.4)' }}>
              Buscar Canchas
            </button>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="widget-stats" style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-around', color: 'white', textAlign: 'center' }}>
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
  );
};

export default Hero;