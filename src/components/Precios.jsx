import React from 'react';

const Precios = () => (
  <section id="precios" style={{ padding: '100px 5%', backgroundColor: '#ffffff' }}>
    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px auto' }}>
      <h2 style={{ fontSize: '3rem', color: '#111827', fontWeight: '800', marginBottom: '20px', letterSpacing: '-1px' }}>Planes simples y transparentes</h2>
      <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6' }}>Elige el plan que mejor se adapte al tamaño de tu complejo deportivo.</p>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
      {/* Plan Básico */}
      <div style={{ flex: '1 1 300px', maxWidth: '350px', padding: '40px', backgroundColor: '#f9fafb', borderRadius: '16px', border: '1px solid #f3f4f6' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#111827', fontWeight: '800', margin: 0 }}>Básico</h3>
        <div style={{ fontSize: '3rem', fontWeight: '900', color: '#111827', margin: '15px 0' }}>Gratis<span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: '500' }}>/siempre</span></div>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#4b5563', lineHeight: '2.2' }}>
          <li>✅ Hasta 2 canchas</li>
          <li>✅ Gestión de reservas manual</li>
          <li>❌ Pagos en línea</li>
        </ul>
        <button style={{ width: '100%', backgroundColor: '#ffffff', color: '#111827', border: '1px solid #e5e7eb', padding: '14px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Empezar Gratis</button>
      </div>
      {/* Plan Pro */}
      <div style={{ flex: '1 1 300px', maxWidth: '350px', padding: '40px', backgroundColor: '#111827', borderRadius: '16px', border: '2px solid #00d084', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#00d084', color: '#ffffff', padding: '6px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem' }}>Más Popular</div>
        <h3 style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: '800', margin: 0 }}>Pro</h3>
        <div style={{ fontSize: '3rem', fontWeight: '900', color: '#ffffff', margin: '15px 0' }}>S/ 99<span style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: '500' }}>/mes</span></div>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#d1d5db', lineHeight: '2.2' }}>
          <li>✅ Canchas ilimitadas</li>
          <li>✅ Pagos en línea (0% comisión)</li>
          <li>✅ Estadísticas financieras avanzadas</li>
        </ul>
        <button style={{ width: '100%', backgroundColor: '#00d084', color: '#111827', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>Probar 14 días gratis</button>
      </div>
    </div>
  </section>
);

export default Precios;