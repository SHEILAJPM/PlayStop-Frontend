const Contacto = () => {
  return (
    <section id="contacto" className="reveal" style={{ scrollMarginTop: '80px', padding: '100px 5%', backgroundColor: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
      <style>
        {`
          .dark-mode .contacto-h3 { color: #f8fafc !important; }
          .dark-mode .contacto-text { color: #cbd5e1 !important; }
          .dark-mode .contacto-icon-bg { background-color: #1e293b !important; border-color: #334155 !important; }
        `}
      </style>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="section-badge" style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', marginBottom: '16px', textTransform: 'uppercase' }}>Contacto & Soporte</div>
          <h2 style={{ fontSize: '3.2rem', color: '#0f172a', fontWeight: '900', margin: '0 0 16px 0', letterSpacing: '-1px' }}>¿Hablamos?</h2>
          <p style={{ color: '#64748b', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>Estamos aquí para ayudarte a digitalizar tu complejo o resolver cualquier duda sobre la plataforma. Escríbenos.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'stretch' }}>
          
          {/* Información de Contacto */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div className="contacto-icon-bg" style={{ width: '54px', height: '54px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', color: '#3b82f6' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <h4 className="contacto-h3" style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Correo electrónico</h4>
                <p className="contacto-text" style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>soporte@playspot.pe</p>
                <p className="contacto-text" style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>ventas@playspot.pe</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div className="contacto-icon-bg" style={{ width: '54px', height: '54px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', color: '#00d084' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div>
                <h4 className="contacto-h3" style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Teléfono / WhatsApp</h4>
                <p className="contacto-text" style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>+51 987 654 321</p>
                <p className="contacto-text" style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Lunes a Viernes, 9am - 6pm</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div className="contacto-icon-bg" style={{ width: '54px', height: '54px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', color: '#f59e0b' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <h4 className="contacto-h3" style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Oficinas</h4>
                <p className="contacto-text" style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Av. El Deporte 123, San Isidro</p>
                <p className="contacto-text" style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Lima, Perú</p>
              </div>
            </div>
          </div>

          {/* Formulario tradicional */}
          <div style={{ flex: '1 1 400px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 20 }} className="cancha-card">
            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }} className="contacto-h3">Déjanos un mensaje</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('¡Mensaje enviado con éxito! Te contactaremos pronto.'); }} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Nombre completo" required className="modal-input" style={{ flex: 1, minWidth: '150px', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }} />
                <input type="email" placeholder="Correo electrónico" required className="modal-input" style={{ flex: 1, minWidth: '150px', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }} />
              </div>
              <textarea placeholder="¿En qué te podemos ayudar?" required className="modal-input" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', height: '140px', resize: 'none', marginBottom: '20px', boxSizing: 'border-box', outline: 'none' }}></textarea>
              <button type="submit" style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}>
                Enviar Mensaje <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Contacto;