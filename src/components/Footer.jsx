const Footer = () => {
  return (
    <footer className="footer-section reveal" style={{ backgroundColor: '#0b1120', paddingTop: '80px', paddingBottom: '30px', borderTop: '1px solid #1e293b', color: '#94a3b8' }}>
      <style>
        {`
          @media (max-width: 768px) {
            .footer-links-container { flex-direction: column; gap: 40px !important; }
            .footer-bottom-bar { flex-direction: column; text-align: center; gap: 15px !important; }
            .footer-section { paddingTop: 60px !important; }
          }
        `}
      </style>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%' }}>
        
        <div className="footer-links-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between', marginBottom: '60px' }}>
          
          {/* Marca y Descripción */}
          <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <img src="/favicon.svg" alt="PlayStop" style={{ width: '32px', height: '32px', filter: 'grayscale(1) brightness(2)' }} />
              <span style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: '900', letterSpacing: '-0.5px' }}>PlayStop</span>
            </div>
            <p style={{ lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '24px' }}>
              El ecosistema digital definitivo para el deporte amateur. Conectamos a jugadores apasionados con las mejores infraestructuras deportivas, erradicando la informalidad.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8', transition: 'all 0.2s', textDecoration: 'none' }} onMouseOver={(e) => {e.currentTarget.style.backgroundColor='#1e293b'; e.currentTarget.style.color='#ffffff'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#94a3b8'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8', transition: 'all 0.2s', textDecoration: 'none' }} onMouseOver={(e) => {e.currentTarget.style.backgroundColor='#1e293b'; e.currentTarget.style.color='#ffffff'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#94a3b8'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8', transition: 'all 0.2s', textDecoration: 'none' }} onMouseOver={(e) => {e.currentTarget.style.backgroundColor='#1e293b'; e.currentTarget.style.color='#ffffff'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#94a3b8'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '700', marginBottom: '20px' }}>Producto</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><a href="#como-funciona" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#94a3b8'}>Cómo funciona</a></li>
              <li><a href="#jugadores" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#94a3b8'}>Para Jugadores</a></li>
              <li><a href="#clubes" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#94a3b8'}>Para Clubes</a></li>
              <li><a href="#precios" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#94a3b8'}>Planes y Precios</a></li>
            </ul>
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '700', marginBottom: '20px' }}>Soporte</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><a href="#faq" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#94a3b8'}>Preguntas Frecuentes</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#94a3b8'}>Centro de Ayuda</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#94a3b8'}>Contacto</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#94a3b8'}>Blog</a></li>
            </ul>
          </div>

          <div style={{ flex: '1 1 150px' }}>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '700', marginBottom: '20px' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#94a3b8'}>Términos de Servicio</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#94a3b8'}>Política de Privacidad</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#94a3b8'}>Política de Cookies</a></li>
              <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.95rem' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#94a3b8'}>Aviso Legal</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar" style={{ paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>&copy; {new Date().getFullYear()} PlayStop Inc. Todos los derechos reservados.</p>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
               <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00d084' }}></span> Sistemas Operativos
             </span>
             <span style={{ color: '#cbd5e1' }}>Español (PE)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;