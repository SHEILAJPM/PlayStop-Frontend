
const Caracteristicas = () => (
  <section id="soluciones" style={{ padding: '120px 5%', backgroundColor: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
    {/* Decoraciones de fondo (Luces de neón desenfocadas) */}
    <div style={{ position: 'absolute', top: '-5%', left: '-5%', width: '400px', height: '400px', backgroundColor: '#00d084', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.2, zIndex: 0 }}></div>
    <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: '400px', height: '400px', backgroundColor: '#3b82f6', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.2, zIndex: 0 }}></div>
    <div style={{ position: 'absolute', top: '30%', left: '35%', width: '300px', height: '300px', backgroundColor: '#eab308', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.15, zIndex: 0 }}></div>

    <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 80px auto', position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'inline-block', padding: '6px 18px', background: 'linear-gradient(90deg, rgba(0,208,132,0.1), rgba(59,130,246,0.1))', border: '1px solid rgba(0,208,132,0.2)', color: '#0f172a', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', marginBottom: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>Nuestra Promesa</div>
      <h2 style={{ fontSize: '3.5rem', color: '#0f172a', fontWeight: '900', marginBottom: '24px', letterSpacing: '-1.5px', lineHeight: '1.1' }}>Todo el ciclo, <span style={{ background: 'linear-gradient(90deg, #00d084, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>digitalizado</span></h2>
      <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: '1.7' }}>Desarrollamos una herramienta pensada para brindar máxima transparencia y garantizar una experiencia de usuario insuperable de principio a fin.</p>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
      
      {/* Tarjeta 1 - Seguridad */}
      <div 
        style={{ padding: '50px 40px', background: 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)', borderRadius: '24px', border: '1px solid #e2e8f0', borderTop: '4px solid #00d084', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 208, 132, 0.25)'; e.currentTarget.style.borderColor = '#00d084'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05)'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.borderTopColor = '#00d084'; }}
      >
        <div style={{ width: '64px', height: '64px', backgroundColor: '#ffffff', border: '1px solid #d1fae5', color: '#00d084', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', boxShadow: '0 8px 16px -4px rgba(0,208,132,0.3)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px', fontWeight: '800', letterSpacing: '-0.5px' }}>Cero Informalidad</h3>
        <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '1.05rem', margin: 0 }}>Garantizamos reservas seguras. Olvídate de los dobles turnos, la desorganización o las cancelaciones de último minuto por WhatsApp.</p>
      </div>

      {/* Tarjeta 2 - Transparencia */}
      <div 
        style={{ padding: '50px 40px', background: 'linear-gradient(145deg, #ffffff 0%, #eff6ff 100%)', borderRadius: '24px', border: '1px solid #e2e8f0', borderTop: '4px solid #3b82f6', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(59, 130, 246, 0.25)'; e.currentTarget.style.borderColor = '#3b82f6'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05)'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.borderTopColor = '#3b82f6'; }}
      >
        <div style={{ width: '64px', height: '64px', backgroundColor: '#ffffff', border: '1px solid #dbeafe', color: '#3b82f6', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', boxShadow: '0 8px 16px -4px rgba(59,130,246,0.3)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        </div>
        <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px', fontWeight: '800', letterSpacing: '-0.5px' }}>Transparencia Total</h3>
        <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '1.05rem', margin: 0 }}>Compara opciones en tiempo real, revisa precios exactos y lee valoraciones verificadas de otros deportistas antes de reservar.</p>
      </div>

      {/* Tarjeta 3 - Tecnología */}
      <div 
        style={{ padding: '50px 40px', background: 'linear-gradient(145deg, #ffffff 0%, #fef3c7 100%)', borderRadius: '24px', border: '1px solid #e2e8f0', borderTop: '4px solid #eab308', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(234, 179, 8, 0.25)'; e.currentTarget.style.borderColor = '#eab308'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05)'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.borderTopColor = '#eab308'; }}
      >
        <div style={{ width: '64px', height: '64px', backgroundColor: '#ffffff', border: '1px solid #fef3c7', color: '#eab308', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', boxShadow: '0 8px 16px -4px rgba(234,179,8,0.3)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
        </div>
        <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '16px', fontWeight: '800', letterSpacing: '-0.5px' }}>Tecnología Escalable</h3>
        <p style={{ color: '#64748b', lineHeight: '1.7', fontSize: '1.05rem', margin: 0 }}>Desde la búsqueda hasta la pasarela de pagos, todo funciona en un ecosistema rápido, intuitivo y disponible 24/7.</p>
      </div>
    </div>
  </section>
);

export default Caracteristicas;