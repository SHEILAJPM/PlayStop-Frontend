const Contacto = () => (
  <section id="contacto" className="reveal" style={{ scrollMarginTop: '80px', padding: '100px 5%', backgroundColor: '#f8fafc', position: 'relative' }}>
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <div className="section-badge" style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', marginBottom: '16px', textTransform: 'uppercase' }}>Contacto & Soporte</div>
      <h2 style={{ fontSize: '3rem', color: '#0f172a', fontWeight: '900', margin: '0 0 16px 0', letterSpacing: '-1px' }}>¿Hablamos?</h2>
      <p style={{ color: '#64748b', fontSize: '1.15rem', marginBottom: '40px' }}>Estamos aquí para ayudarte a digitalizar tu complejo o resolver cualquier duda sobre la plataforma.</p>
      <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }} className="cancha-card">
        <form onSubmit={(e) => { e.preventDefault(); alert('¡Mensaje enviado con éxito! Te contactaremos pronto.'); }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Nombre completo" required className="modal-input" style={{ flex: 1, minWidth: '200px', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }} />
            <input type="email" placeholder="Correo electrónico" required className="modal-input" style={{ flex: 1, minWidth: '200px', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }} />
          </div>
          <textarea placeholder="¿En qué te podemos ayudar?" required className="modal-input" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', height: '120px', resize: 'none', marginBottom: '20px', boxSizing: 'border-box', outline: 'none' }}></textarea>
          <button type="submit" style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}>Enviar Mensaje</button>
        </form>
      </div>
    </div>
  </section>
);

export default Contacto;