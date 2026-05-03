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
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#111827', border: '1px solid #1e293b', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.color = '#00d084'; e.currentTarget.style.borderColor = '#00d084'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#111827'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#1e293b'; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#111827', border: '1px solid #1e293b', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.borderColor = '#3b82f6'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#111827'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#1e293b'; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#111827', border: '1px solid #1e293b', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.color = '#0077b5'; e.currentTarget.style.borderColor = '#0077b5'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#111827'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#1e293b'; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </div>
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