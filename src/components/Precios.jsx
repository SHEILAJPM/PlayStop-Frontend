
const Precios = () => (
  <section className="precios-section reveal" id="precios" style={{ scrollMarginTop: '80px', padding: '100px 5%', backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <style>
      {`
        @media (max-width: 768px) {
          .precios-section { padding: 60px 5% !important; }
          .precios-title { font-size: 2.5rem !important; }
          .precio-card { padding: 32px 20px !important; }
          .precio-valor { font-size: 2.8rem !important; }
        }
      `}
    </style>
    
    {/* Decoraciones de fondo (Luces suaves) */}
    <div style={{ position: 'absolute', top: '-10%', left: '30%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,208,132,0.05) 0%, rgba(255,255,255,0) 70%)', zIndex: 0, pointerEvents: 'none' }}></div>
    <div style={{ position: 'absolute', top: '20%', right: '-20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(255,255,255,0) 70%)', zIndex: 0, pointerEvents: 'none' }}></div>

    <div style={{ textAlign: 'center', width: '100%', maxWidth: '750px', margin: '0 auto 80px auto', position: 'relative', zIndex: 10 }}>
      <div className="section-badge" style={{ display: 'inline-block', padding: '6px 18px', background: 'linear-gradient(90deg, rgba(37,99,235,0.1), rgba(0,208,132,0.1))', color: '#0f172a', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', marginBottom: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>Planes a tu medida</div>
      <h2 className="precios-title" style={{ fontSize: '3.5rem', color: '#0f172a', fontWeight: '900', marginBottom: '24px', letterSpacing: '-1.5px', lineHeight: '1.1' }}>Precios <span style={{ background: 'linear-gradient(90deg, #3b82f6, #00d084)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>transparentes</span></h2>
      <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: '1.7' }}>Empieza gratis y escala a medida que tu complejo deportivo crece. Sin comisiones ocultas ni sorpresas.</p>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', position: 'relative', zIndex: 10, alignItems: 'center', width: '100%' }}>
      
      {/* Plan Básico */}
      <div 
        className="precio-card" style={{ flex: '1 1 320px', maxWidth: '380px', padding: '40px', backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s ease', cursor: 'default', display: 'flex', flexDirection: 'column', textAlign: 'center' }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
      >
        <h3 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: '800', margin: '0 0 10px 0' }}>Plan Básico</h3>
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 20px 0', lineHeight: '1.5' }}>Ideal para complejos que recién empiezan.</p>
        <div className="precio-valor" style={{ fontSize: '3.5rem', fontWeight: '900', color: '#0f172a', margin: '0 0 30px 0', letterSpacing: '-2px' }}>$0<span style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: '600', letterSpacing: '0' }}>/siempre</span></div>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 auto 40px auto', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', width: 'fit-content' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d084" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Hasta 2 canchas</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d084" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Gestión de reservas manual</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', fontWeight: '500' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <span>Pagos en línea divididos</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', fontWeight: '500' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <span>Estadísticas avanzadas</span>
          </li>
        </ul>
        <button style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}>
          Comenzar gratis
        </button>
      </div>
      
      {/* Plan Pro */}
      <div className="precio-card" style={{ flex: '1 1 320px', maxWidth: '380px', padding: '40px', background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)', borderRadius: '24px', border: '2px solid #00d084', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 208, 132, 0.25)', transition: 'all 0.3s ease', cursor: 'default', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, #00d084, #059669)', color: '#ffffff', padding: '6px 20px', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 4px 10px rgba(0,208,132,0.4)' }}>Recomendado</div>
        <h3 style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: '800', margin: '0 0 10px 0' }}>Plan Pro</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 20px 0', lineHeight: '1.5' }}>Todo lo que necesitas para automatizar tu negocio.</p>
        <div className="precio-valor" style={{ fontSize: '3.5rem', fontWeight: '900', color: '#ffffff', margin: '0 0 30px 0', letterSpacing: '-2px' }}>S/ 99<span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '600', letterSpacing: '0' }}>/mes</span></div>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 auto 40px auto', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', width: 'fit-content' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d084" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Canchas ilimitadas</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d084" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Pagos en línea (0% de comisión)</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d084" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Cobro dividido automático</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d084" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Estadísticas y reportes financieros</span>
          </li>
        </ul>
        <button style={{ width: '100%', backgroundColor: '#00d084', color: '#0f172a', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 15px -3px rgba(0,208,132,0.3)' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#34d399'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#00d084'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          Probar 14 días gratis
        </button>
      </div>

      {/* Plan Enterprise */}
      <div 
        className="precio-card" style={{ flex: '1 1 320px', maxWidth: '380px', padding: '40px', backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s ease', cursor: 'default', display: 'flex', flexDirection: 'column', textAlign: 'center' }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
      >
        <h3 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: '800', margin: '0 0 10px 0' }}>Plan Enterprise</h3>
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 20px 0', lineHeight: '1.5' }}>Para cadenas deportivas y clubes de alto rendimiento.</p>
        <div className="precio-valor" style={{ fontSize: '3.5rem', fontWeight: '900', color: '#0f172a', margin: '0 0 30px 0', letterSpacing: '-2px' }}>S/ 199<span style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: '600', letterSpacing: '0' }}>/mes</span></div>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 auto 40px auto', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', width: 'fit-content' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Canchas y sucursales ilimitadas</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Plataforma Marca Blanca</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Soporte prioritario 24/7</span>
          </li>
        </ul>
        <button style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}>
          Contactar ventas
        </button>
      </div>
    </div>
  </section>
);

export default Precios;