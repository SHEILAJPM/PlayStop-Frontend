
const CallToAction = () => (
  <section style={{ padding: '100px 5%', backgroundColor: '#0a0f1c', textAlign: 'center', position: 'relative', borderTop: '1px solid #1e293b' }}>
    
    <style>
      {`
        @keyframes pulseButton {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 208, 132, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(0, 208, 132, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 208, 132, 0); }
        }
      `}
    </style>

    <h2 style={{ fontSize: '3rem', color: '#ffffff', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px' }}>¿Listo para modernizar tus partidos?</h2>
    <p style={{ color: '#9ca3af', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px auto' }}>Únete a la revolución y deja atrás el estrés de coordinar tus canchas deportivas manualmente.</p>
    
    <button style={{ backgroundColor: '#00d084', color: '#0f172a', border: 'none', padding: '18px 48px', fontSize: '1.2rem', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', animation: 'pulseButton 2s infinite', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#34d399'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00d084'}>
      Crear mi cuenta gratis
    </button>
  </section>
);

export default CallToAction;