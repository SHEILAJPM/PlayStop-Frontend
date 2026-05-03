
const Footer = () => (
  <footer style={{ padding: '80px 5% 30px 5%', backgroundColor: '#0a0f1c', color: '#94a3b8', borderTop: '1px solid #1e293b' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto', gap: '50px' }}>
      
      {/* Columna 1: Logo, Descripción y Newsletter */}
      <div style={{ flex: '2 1 350px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#00d084', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#ffffff', fontSize: '16px' }}>P</div>
          <h2 style={{ color: '#ffffff', fontWeight: '800', margin: 0, fontSize: '24px', letterSpacing: '-0.5px' }}>PlayStop</h2>
        </div>
        <p style={{ lineHeight: '1.7', marginBottom: '20px', maxWidth: '380px', fontSize: '0.95rem', color: '#94a3b8' }}>
          Digitalizando el ecosistema deportivo. Encuentra tu cancha ideal o gestiona tu complejo con la mejor tecnología del mercado.
        </p>
        
        {/* Mini formulario de Newsletter (Estilo Píldora) */}
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '100px', padding: '6px', marginBottom: '30px', maxWidth: '380px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
          <input type="email" placeholder="Tu correo electrónico" style={{ flex: 1, padding: '10px 16px', backgroundColor: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.9rem' }} />
          <button style={{ backgroundColor: '#00d084', color: '#0f172a', border: 'none', padding: '10px 24px', borderRadius: '100px', fontWeight: '700', cursor: 'pointer' }}>Suscribirse</button>
        </div>

        {/* Redes Sociales */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#111827', border: '1px solid #1e293b', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#e2e8f0', fontSize: '1.2rem' }}>📷</div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#111827', border: '1px solid #1e293b', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#e2e8f0', fontSize: '1.2rem' }}>🐦</div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#111827', border: '1px solid #1e293b', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#e2e8f0', fontSize: '1.2rem' }}>💼</div>
        </div>
      </div>

      {/* Columna 2: Producto */}
      <div style={{ flex: '1 1 150px' }}>
        <h3 style={{ color: '#f8fafc', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '24px' }}>Producto</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <li><a href="#jugadores" style={{ color: '#94a3b8', textDecoration: 'none', cursor: 'pointer', fontSize: '0.95rem', transition: 'color 0.2s' }}>Buscar Canchas</a></li>
          <li><a href="#clubes" style={{ color: '#94a3b8', textDecoration: 'none', cursor: 'pointer', fontSize: '0.95rem', transition: 'color 0.2s' }}>Para Clubes</a></li>
          <li><a href="#testimonios" style={{ color: '#94a3b8', textDecoration: 'none', cursor: 'pointer', fontSize: '0.95rem', transition: 'color 0.2s' }}>Testimonios</a></li>
          <li><a href="#precios" style={{ color: '#94a3b8', textDecoration: 'none', cursor: 'pointer', fontSize: '0.95rem', transition: 'color 0.2s' }}>Planes y Precios</a></li>
        </ul>
      </div>

      {/* Columna 3: Soporte */}
      <div style={{ flex: '1 1 150px' }}>
        <h3 style={{ color: '#f8fafc', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '24px' }}>Soporte</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', cursor: 'pointer', fontSize: '0.95rem', transition: 'color 0.2s' }}>Centro de Ayuda</a></li>
          <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', cursor: 'pointer', fontSize: '0.95rem', transition: 'color 0.2s' }}>Contacto</a></li>
          <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', cursor: 'pointer', fontSize: '0.95rem', transition: 'color 0.2s' }}>Comunidad</a></li>
        </ul>
      </div>

      {/* Columna 4: Legal */}
      <div style={{ flex: '1 1 150px' }}>
        <h3 style={{ color: '#f8fafc', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '24px' }}>Legal</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', cursor: 'pointer', fontSize: '0.95rem', transition: 'color 0.2s' }}>Términos de Servicio</a></li>
          <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', cursor: 'pointer', fontSize: '0.95rem', transition: 'color 0.2s' }}>Privacidad</a></li>
          <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', cursor: 'pointer', fontSize: '0.95rem', transition: 'color 0.2s' }}>Cookies</a></li>
        </ul>
      </div>

    </div>
    
    {/* Barra Inferior */}
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', maxWidth: '1200px', margin: '60px auto 0 auto', paddingTop: '30px', borderTop: '1px solid #1e293b', fontSize: '0.9rem' }}>
      <p style={{ margin: 0, color: '#64748b' }}>© {new Date().getFullYear()} PlayStop. Todos los derechos reservados.</p>
      <div style={{ display: 'flex', gap: '20px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>🌍 Español (PE)</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>🛡️ Sistema Seguro</span>
      </div>
    </div>
  </footer>
);

export default Footer;