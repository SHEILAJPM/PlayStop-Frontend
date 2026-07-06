
const Precios = () => (
  <section className="precios-section reveal" id="precios" style={{ scrollMarginTop: '80px', padding: '100px 5%', background: 'linear-gradient(180deg, #030712 0%, #0b1120 50%, #030712 100%)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

    {/* Orbs de fondo decorativos */}
    <div style={{ position: 'absolute', top: '-10%', left: '30%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }}></div>
    <div style={{ position: 'absolute', top: '20%', right: '-20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }}></div>

    <div style={{ textAlign: 'center', width: '100%', maxWidth: '750px', margin: '0 auto 80px auto', position: 'relative', zIndex: 10 }}>
      {/* Label decorativo con línea verde */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ width: '36px', height: '3px', borderRadius: '2px', background: 'linear-gradient(90deg, transparent, #2563eb)' }} />
        <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '2.5px', textTransform: 'uppercase' }}>Planes a tu medida</span>
        <div style={{ width: '36px', height: '3px', borderRadius: '2px', background: 'linear-gradient(90deg, #2563eb, transparent)' }} />
      </div>
      <h2 className="precios-title" style={{ fontSize: '3.5rem', color: '#f1f5f9', fontWeight: '900', marginBottom: '24px', letterSpacing: '-1.5px', lineHeight: '1.1' }}>Precios <span style={{ background: 'linear-gradient(90deg, #3b82f6, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>transparentes</span></h2>
      <p style={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: '1.7' }}>Empieza gratis y escala a medida que tu complejo deportivo crece. Sin comisiones ocultas ni sorpresas.</p>
    </div>

    <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', position: 'relative', zIndex: 10, alignItems: 'center', width: '100%' }}>

      {/* Plan Básico */}
      <div
        className="precio-card" style={{ flex: '1 1 320px', maxWidth: '380px', padding: '40px', background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', borderTop: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)', transition: 'all 0.3s ease', cursor: 'default', display: 'flex', flexDirection: 'column', textAlign: 'center' }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(37, 99, 235, 0.2)'; e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.35)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
      >
        <h3 style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: '800', margin: '0 0 10px 0' }}>Plan Básico</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 20px 0', lineHeight: '1.5' }}>Ideal para complejos que recién empiezan.</p>
        <div className="precio-valor" style={{ fontSize: '3.5rem', fontWeight: '900', color: '#ffffff', margin: '0 0 30px 0', letterSpacing: '-2px' }}>$0<span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '600', letterSpacing: '0' }}>/siempre</span></div>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 auto 40px auto', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', width: 'fit-content' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Hasta 2 canchas</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Gestión de reservas manual</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontWeight: '500' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <span>Pagos en línea divididos</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontWeight: '500' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <span>Estadísticas avanzadas</span>
          </li>
        </ul>
        <button
          onClick={() => document.getElementById('contacto').scrollIntoView()}
          style={{ width: '100%', background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)' }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.4)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
        >
          Comenzar gratis
        </button>
      </div>

      {/* Plan Pro */}
      <div className="precio-card" style={{ flex: '1 1 320px', maxWidth: '380px', padding: '40px', background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)', borderRadius: '24px', border: '2px solid #2563eb', position: 'relative', boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.25)', transition: 'all 0.3s ease', cursor: 'default', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, #2563eb, #1d4ed8)', color: '#ffffff', padding: '6px 20px', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.4)' }}>Recomendado</div>
        <h3 style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: '800', margin: '0 0 10px 0' }}>Plan Pro</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 20px 0', lineHeight: '1.5' }}>Todo lo que necesitas para automatizar tu negocio.</p>
        <div className="precio-valor" style={{ fontSize: '3.5rem', fontWeight: '900', color: '#ffffff', margin: '0 0 30px 0', letterSpacing: '-2px' }}>S/ 99<span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '600', letterSpacing: '0' }}>/mes</span></div>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 auto 40px auto', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', width: 'fit-content' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Canchas ilimitadas</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Pagos en línea (0% de comisión)</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Cobro dividido automático</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Estadísticas y reportes financieros</span>
          </li>
        </ul>
        <button onClick={() => document.getElementById('contacto').scrollIntoView()} style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          Probar 14 días gratis
        </button>
      </div>

      {/* Plan Enterprise */}
      <div
        className="precio-card" style={{ flex: '1 1 320px', maxWidth: '380px', padding: '40px', background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', borderTop: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)', transition: 'all 0.3s ease', cursor: 'default', display: 'flex', flexDirection: 'column', textAlign: 'center' }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(59,130,246,0.2)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
      >
        <h3 style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: '800', margin: '0 0 10px 0' }}>Plan Enterprise</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 20px 0', lineHeight: '1.5' }}>Para cadenas deportivas y clubes de alto rendimiento.</p>
        <div className="precio-valor" style={{ fontSize: '3.5rem', fontWeight: '900', color: '#ffffff', margin: '0 0 30px 0', letterSpacing: '-2px' }}>S/ 199<span style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: '600', letterSpacing: '0' }}>/mes</span></div>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 auto 40px auto', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', width: 'fit-content' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Canchas y sucursales ilimitadas</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Plataforma Marca Blanca</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontWeight: '600' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Soporte prioritario 24/7</span>
          </li>
        </ul>
        <button
          onClick={() => document.getElementById('contacto').scrollIntoView()}
          style={{ width: '100%', background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)' }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
        >
          Contactar ventas
        </button>
      </div>
    </div>
  </section>
);

export default Precios;
