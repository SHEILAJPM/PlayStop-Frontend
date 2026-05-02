import React from 'react';

const Marcas = () => (
  <div style={{ padding: '50px 5%', textAlign: 'center', backgroundColor: '#ffffff', borderBottom: '1px solid #f3f4f6' }}>
    <p style={{ color: '#6b7280', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '30px' }}>Centros deportivos que confían en nosotros</p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap', filter: 'grayscale(100%) opacity(0.6)' }}>
      <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#111827' }}>⚽ SportClub</h3>
      <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#111827' }}>🎾 La Cancha 5</h3>
      <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#111827' }}>🏀 Padel Pro</h3>
      <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#111827' }}>🏐 Arena Center</h3>
    </div>
  </div>
);

export default Marcas;