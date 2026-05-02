import React from 'react';

const Footer = () => (
  <footer style={{ padding: '60px 5% 40px 5%', backgroundColor: '#ffffff', color: '#4b5563', borderTop: '1px solid #e5e7eb' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto', gap: '40px' }}>
      <div style={{ flex: '1 1 300px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '24px', height: '24px', backgroundColor: '#00d084', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#ffffff', fontSize: '12px' }}>P</div>
          <h2 style={{ color: '#111827', fontWeight: '800', margin: 0, fontSize: '20px' }}>PlayStop</h2>
        </div>
        <p style={{ lineHeight: '1.6' }}>Optimizando la experiencia deportiva de inicio a fin con la mejor tecnología.</p>
      </div>
    </div>
    <div style={{ textAlign: 'center', marginTop: '60px', paddingTop: '30px', borderTop: '1px solid #f3f4f6', fontSize: '0.9rem' }}>
      <p style={{ margin: 0 }}>© {new Date().getFullYear()} PlayStop. Todos los derechos reservados.</p>
    </div>
  </footer>
);

export default Footer;