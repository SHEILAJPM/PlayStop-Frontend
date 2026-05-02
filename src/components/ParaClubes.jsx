import React from 'react';

const ParaClubes = () => (
  <section id="clubes" style={{ padding: '100px 5%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '50px' }}>
    <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
      <div style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: '#d1fae5', color: '#047857', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem', marginBottom: '24px' }}>Exclusivo para Administradores</div>
      <h2 style={{ fontSize: '3rem', color: '#111827', fontWeight: '800', marginBottom: '20px', letterSpacing: '-1px' }}>El software que tu complejo necesita</h2>
      <p style={{ color: '#4b5563', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '30px' }}>Automatiza tus reservas, cobra por adelantado y reduce el ausentismo al 0%. PlayStop te da las herramientas de una gran empresa, fáciles de usar desde tu celular.</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#111827', lineHeight: '2.5', fontWeight: '600', fontSize: '1.1rem' }}>
        <li>🔥 Panel de control en tiempo real</li>
        <li>💳 Pasarela de pagos integrada para abonos</li>
        <li>📊 Reportes de ingresos automatizados</li>
      </ul>
    </div>
    <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
       <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', padding: '25px' }}>
          {/* Simulación de un Dashboard de Administrador */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
            <div style={{ width: '40%', height: '24px', backgroundColor: '#e5e7eb', borderRadius: '6px' }}></div>
            <div style={{ width: '20%', height: '24px', backgroundColor: '#d1fae5', borderRadius: '6px' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <div style={{ flex: 1, height: '90px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6', borderLeft: '4px solid #00d084' }}></div>
            <div style={{ flex: 1, height: '90px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6', borderLeft: '4px solid #3b82f6' }}></div>
          </div>
          <div style={{ width: '100%', height: '180px', backgroundColor: '#f3f4f6', borderRadius: '12px' }}></div>
       </div>
    </div>
  </section>
);

export default ParaClubes;