const Soluciones = () => {
  return (
    <section className="soluciones-section" id="soluciones" style={{ scrollMarginTop: '80px', padding: '100px 5%', backgroundColor: '#f8fafc', position: 'relative' }}>
      <style>
        {`
          @media (max-width: 768px) {
            .soluciones-section { padding: 60px 5% !important; }
            .soluciones-title { font-size: 2.2rem !important; }
            .soluciones-card { padding: 32px 20px !important; }
          }
        `}
      </style>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#8b5cf6', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Doble Beneficio
          </div>
          <h2 className="soluciones-title" style={{ fontSize: '3rem', color: '#0f172a', fontWeight: '900', margin: '0 0 16px 0', letterSpacing: '-1px' }}>
            Una plataforma, <span style={{ color: '#8b5cf6' }}>dos soluciones</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Ya sea que busques jugar o administrar, PlayStop tiene las herramientas exactas para llevar tu experiencia al siguiente nivel.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          
          {/* Tarjeta para Jugadores */}
          <div className="soluciones-card" id="solucion-jugadores" style={{ scrollMarginTop: '100px', backgroundColor: '#ffffff', borderRadius: '32px', padding: '48px 40px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, #00d084, #3b82f6)' }}></div>
            
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(0, 208, 132, 0.1)', color: '#00d084', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '24px' }}>
              🏃‍♂️
            </div>
            
            <h3 style={{ fontSize: '2rem', color: '#0f172a', fontWeight: '900', marginBottom: '12px', letterSpacing: '-0.5px' }}>Para Jugadores</h3>
            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '32px' }}>
              Organizar el partido perfecto nunca fue tan fácil. Encuentra dónde jugar y olvídate de las deudas entre amigos.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              {[
                'Búsqueda en tiempo real por ciudad y distrito.',
                'Pago dividido automatizado (cada quien paga lo suyo).',
                'Encuentra rivales y únete a partidos abiertos.',
                'Gana puntos, sube de nivel y obtén descuentos.'
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#00d084', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span style={{ color: '#334155', fontWeight: '600', fontSize: '1rem', lineHeight: '1.5' }}>{item}</span>
                </li>
              ))}
            </ul>

            <button style={{ width: '100%', padding: '16px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '16px', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(15, 23, 42, 0.2)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              Comenzar a jugar <span style={{ fontSize: '1.2rem' }}>→</span>
            </button>
          </div>

          {/* Tarjeta para Clubes */}
          <div className="soluciones-card" id="solucion-clubes" style={{ scrollMarginTop: '100px', backgroundColor: '#0f172a', borderRadius: '32px', padding: '48px 40px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Elemento decorativo de luz de fondo */}
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
            
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '24px' }}>
              🏟️
            </div>
            
            <h3 style={{ fontSize: '2rem', color: '#ffffff', fontWeight: '900', marginBottom: '12px', letterSpacing: '-0.5px' }}>Para Clubes</h3>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '32px' }}>
              Digitaliza tu infraestructura. Aumenta tus ingresos, reduce el ausentismo y toma el control total de tu complejo.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              {[
                'Gestión de calendario 100% automatizada.',
                'Cero ausentismo: reservas garantizadas con pagos previos.',
                'Reportes financieros y analíticas en tiempo real.',
                'Soporte técnico premium 24/7.'
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1rem', lineHeight: '1.5' }}>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ flex: 2, padding: '16px', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '16px', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.3)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                Afiliar mi Club
              </button>
              <button style={{ flex: 1, padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#ffffff', borderRadius: '16px', fontWeight: '700', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}>
                Planes
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Soluciones;