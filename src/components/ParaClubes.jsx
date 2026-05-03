
const ParaClubes = () => (
  <section id="clubes" style={{ padding: '120px 5%', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '60px', position: 'relative', overflow: 'hidden' }}>
    
    {/* Background Glows */}
    <div style={{ position: 'absolute', top: '10%', right: '5%', width: '500px', height: '500px', backgroundColor: '#00d084', borderRadius: '50%', filter: 'blur(180px)', opacity: 0.15, zIndex: 0 }}></div>
    <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px', backgroundColor: '#3b82f6', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.15, zIndex: 0 }}></div>

    <style>
      {`
        @keyframes floatDashboard {
          0% { transform: translateY(0px) rotateX(0deg); }
          50% { transform: translateY(-15px) rotateX(2deg); }
          100% { transform: translateY(0px) rotateX(0deg); }
        }
      `}
    </style>

    <div style={{ flex: '1 1 400px', maxWidth: '600px', zIndex: 10 }}>
      <div style={{ display: 'inline-block', padding: '6px 18px', background: 'linear-gradient(90deg, rgba(0,208,132,0.15), rgba(0,208,132,0.05))', border: '1px solid rgba(0,208,132,0.3)', color: '#34d399', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', marginBottom: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>Para Clubes</div>
      <h2 style={{ fontSize: '3.8rem', color: '#ffffff', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1.5px', lineHeight: '1.1' }}>El software que tu complejo <span style={{ background: 'linear-gradient(90deg, #34d399, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>necesita</span></h2>
      <p style={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '40px' }}>Automatiza tus reservas, cobra por adelantado y reduce el ausentismo al 0%. PlayStop te da las herramientas de una gran empresa, fáciles de usar desde cualquier dispositivo.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '45px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #00d084 0%, #059669 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(0,208,132,0.3)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          <span style={{ color: '#f8fafc', fontWeight: '600', fontSize: '1.15rem' }}>Panel de control en tiempo real</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(59,130,246,0.3)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          <span style={{ color: '#f8fafc', fontWeight: '600', fontSize: '1.15rem' }}>Pasarela de pagos 0% comisión</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(245,158,11,0.3)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          <span style={{ color: '#f8fafc', fontWeight: '600', fontSize: '1.15rem' }}>Reportes de ingresos automatizados</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <button style={{ backgroundColor: '#00d084', color: '#0f172a', border: 'none', padding: '16px 32px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(0,208,132,0.4)', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(0,208,132,0.5)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,208,132,0.4)'; }}>
          Agendar demostración
        </button>
        <button style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}>
          Ver planes
        </button>
      </div>
    </div>
    
    <div style={{ flex: '1 1 450px', display: 'flex', justifyContent: 'center', zIndex: 10 }}>
       {/* Simulación de Dashboard Glassmorphism */}
       <div style={{ width: '100%', maxWidth: '650px', background: 'linear-gradient(145deg, rgba(30,41,59,0.85) 0%, rgba(15,23,42,0.95) 100%)', borderRadius: '24px', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)', overflow: 'hidden', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', animation: 'floatDashboard 8s ease-in-out infinite', transformStyle: 'preserve-3d', perspective: '1000px' }}>
          
          {/* Barra de Ventana estilo macOS */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444', opacity: 0.8 }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#eab308', opacity: 0.8 }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e', opacity: 0.8 }}></div>
            </div>
            <div style={{ width: '140px', height: '8px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          </div>

          <div style={{ display: 'flex', height: '320px' }}>
            {/* Sidebar Mockup */}
            <div style={{ width: '80px', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#00d084', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontWeight: 'bold' }}>P</div>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg></div>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></div>
            </div>
            
            {/* Contenido Principal */}
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Tarjetas KPI */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, height: '80px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '3px' }}></div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00d084" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                  </div>
                  <div style={{ width: '80%', height: '20px', backgroundColor: '#f8fafc', borderRadius: '4px' }}></div>
                </div>
                <div style={{ flex: 1, height: '80px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '50px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '3px' }}></div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                  <div style={{ width: '70%', height: '20px', backgroundColor: '#f8fafc', borderRadius: '4px' }}></div>
                </div>
                <div style={{ flex: 1, height: '80px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '70px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '3px' }}></div>
                  </div>
                  <div style={{ width: '90%', height: '20px', backgroundColor: '#f8fafc', borderRadius: '4px' }}></div>
                </div>
              </div>

              {/* Gráfico Simulado Avanzado */}
              <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                 
                 <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', zIndex: 10, position: 'relative' }}>
                    <div style={{ width: '100px', height: '10px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '5px' }}></div>
                    <div style={{ width: '60px', height: '16px', borderRadius: '8px', background: 'linear-gradient(90deg, rgba(0,208,132,0.2), rgba(0,208,132,0.1))', border: '1px solid rgba(0,208,132,0.4)' }}></div>
                 </div>

                 {/* Simulación de gráfico curvo SVG */}
                 <svg viewBox="0 0 500 120" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '85%' }}>
                    <defs>
                      <linearGradient id="chartGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#00d084" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#00d084" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,120 L0,80 C50,90 100,30 150,50 C200,70 250,20 300,40 C350,60 400,10 450,30 C480,40 500,20 500,10 L500,120 Z" fill="url(#chartGlow)" />
                    <path d="M0,80 C50,90 100,30 150,50 C200,70 250,20 300,40 C350,60 400,10 450,30 C480,40 500,20 500,10" fill="none" stroke="#00d084" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    
                    {/* Puntos de datos */}
                    <circle cx="150" cy="50" r="4" fill="#0f172a" stroke="#00d084" strokeWidth="2" />
                    <circle cx="300" cy="40" r="4" fill="#0f172a" stroke="#00d084" strokeWidth="2" />
                    <circle cx="450" cy="30" r="4" fill="#ffffff" stroke="#00d084" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 6px rgba(0,208,132,0.8))' }} />
                 </svg>
              </div>
            </div>
          </div>
       </div>
    </div>
  </section>
);

export default ParaClubes;