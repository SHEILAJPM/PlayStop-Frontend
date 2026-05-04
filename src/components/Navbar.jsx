import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ darkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <style>
        {`
          html { scroll-behavior: smooth; }
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .mobile-toggle { display: block !important; }
            .navbar-header { padding: 15px 20px !important; }
          }
          @media (min-width: 769px) {
            .mobile-toggle, .mobile-menu { display: none !important; }
          }
        `}
      </style>
      <header className="navbar-header" style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/favicon.svg" alt="PlayStop" style={{ width: '32px', height: '32px' }} />
          <h1 style={{ margin: 0, fontSize: '24px', color: '#111827', fontWeight: '800', letterSpacing: '-0.5px' }}>PlayStop</h1>
        </div>
        
        <nav className="desktop-nav" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo(0,0); }} style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#4b5563'}>Inicio</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/como-funciona'); }} style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#4b5563'}>Cómo Funciona</a>
          <a href="#soluciones" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#4b5563'}>Soluciones</a>
          <a href="#jugadores" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#4b5563'}>Para Jugadores</a>
          <a href="#clubes" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#4b5563'}>Para Clubes</a>
          <a href="#precios" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#4b5563'}>Precios</a>
        </nav>
        
        <div className="desktop-nav" style={{ display: 'flex', gap: '15px' }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className="nav-login-btn" onClick={() => navigate('/login')} style={{ backgroundColor: 'transparent', color: '#111827', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Iniciar Sesión</button>
          <button onClick={() => navigate('/register')} style={{ backgroundColor: '#00d084', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 208, 132, 0.3)' }}>Comenzar Gratis</button>
        </div>

        {/* Botón Hamburguesa Móvil */}
        <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#0f172a' }}>
          {isMobileMenuOpen ? '✖' : '☰'}
        </button>
      </header>

      {/* Menú Desplegable Móvil */}
      {isMobileMenuOpen && (
        <div className="mobile-menu" style={{ position: 'fixed', top: '65px', left: 0, width: '100%', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', zIndex: 49, padding: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <a href="#soluciones" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem' }}>Soluciones</a>
          <a href="#jugadores" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem' }}>Para Jugadores</a>
          <a href="#clubes" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem' }}>Para Clubes</a>
          <a href="#precios" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem' }}>Precios</a>
          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '10px 0' }} />
          <button onClick={() => { setIsMobileMenuOpen(false); toggleTheme(); }} style={{ width: '100%', backgroundColor: 'transparent', color: '#0f172a', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {darkMode ? '☀️ Cambiar a Modo Claro' : '🌙 Cambiar a Modo Oscuro'}
          </button>
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="modal-demo-btn" style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '1rem' }}>Iniciar Sesión</button>
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/register'); }} style={{ width: '100%', backgroundColor: '#00d084', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', boxShadow: '0 4px 10px rgba(0,208,132,0.3)' }}>Comenzar Gratis</button>
        </div>
      )}
    </>
  );
};

export default Navbar;