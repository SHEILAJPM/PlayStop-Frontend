import React from 'react';

const Caracteristicas = () => (
  <section id="soluciones" style={{ padding: '100px 5%', backgroundColor: '#f9fafb' }}>
    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px auto' }}>
      <h2 style={{ fontSize: '3rem', color: '#111827', fontWeight: '800', marginBottom: '20px', letterSpacing: '-1px' }}>Todo el ciclo, digitalizado</h2>
      <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6' }}>Desarrollamos una herramienta pensada para brindar máxima transparencia y garantizar una experiencia de usuario insuperable.</p>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ padding: '40px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ width: '56px', height: '56px', backgroundColor: '#d1fae5', color: '#00d084', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', marginBottom: '24px' }}>🛡️</div>
        <h3 style={{ fontSize: '1.4rem', color: '#111827', marginBottom: '15px', fontWeight: '800' }}>Cero Informalidad</h3>
        <p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '1.05rem' }}>Garantizamos reservas seguras. Olvídate de los dobles turnos, la desorganización o las cancelaciones de último minuto por WhatsApp.</p>
      </div>
      <div style={{ padding: '40px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ width: '56px', height: '56px', backgroundColor: '#d1fae5', color: '#00d084', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', marginBottom: '24px' }}>🔍</div>
        <h3 style={{ fontSize: '1.4rem', color: '#111827', marginBottom: '15px', fontWeight: '800' }}>Transparencia Total</h3>
        <p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '1.05rem' }}>Compara opciones en tiempo real, revisa precios exactos y lee valoraciones verificadas de otros deportistas antes de reservar.</p>
      </div>
      <div style={{ padding: '40px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ width: '56px', height: '56px', backgroundColor: '#d1fae5', color: '#00d084', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', marginBottom: '24px' }}>⚡</div>
        <h3 style={{ fontSize: '1.4rem', color: '#111827', marginBottom: '15px', fontWeight: '800' }}>Tecnología Escalable</h3>
        <p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '1.05rem' }}>Desde la búsqueda hasta la pasarela de pagos, todo funciona en un ecosistema rápido, intuitivo y disponible 24/7.</p>
      </div>
    </div>
  </section>
);

export default Caracteristicas;