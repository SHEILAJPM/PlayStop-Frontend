import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ darkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'Soluciones', href: '#soluciones' },
    { label: 'Para Jugadores', href: '#jugadores' },
    { label: 'Para Clubes', href: '#clubes' },
    { label: 'Precios', href: '#precios' },
  ];

  return (
    <>
      <style>{`
        .nav-link {
          font-size: .9rem; font-weight: 500;
          padding: 7px 13px; border-radius: 8px;
          transition: all .18s; text-decoration: none; display: inline-block;
        }
        body.dark  .nav-link { color: rgba(255,255,255,.6); }
        body.light .nav-link { color: #475569; }
        body.dark  .nav-link:hover { color: #fff; background: rgba(255,255,255,.07); }
        body.light .nav-link:hover { color: #0f172a; background: rgba(0,0,0,.05); }
        .nav-cta {
          background: linear-gradient(135deg,#00d084,#00b875);
          color: #0a1628; font-weight: 800; font-size: .88rem;
          padding: 9px 20px; border-radius: 10px; border: none;
          cursor: pointer; transition: all .2s;
          box-shadow: 0 0 20px rgba(0,208,132,.25); font-family: inherit;
        }
        .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(0,208,132,.4); }
        body.dark  .nav-login { color: rgba(255,255,255,.7); background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); }
        body.light .nav-login { color: #334155; background: rgba(0,0,0,.04); border: 1px solid rgba(0,0,0,.1); }
        .nav-login {
          font-weight: 600; font-size: .88rem;
          padding: 9px 18px; border-radius: 10px;
          cursor: pointer; transition: all .18s; font-family: inherit;
        }
        body.dark  .nav-login:hover { color: #fff; background: rgba(255,255,255,.11); }
        body.light .nav-login:hover { color: #0f172a; background: rgba(0,0,0,.08); }
        body.dark  .nav-theme-btn { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); }
        body.light .nav-theme-btn { background: rgba(0,0,0,.04); border: 1px solid rgba(0,0,0,.1); }
        .nav-theme-btn {
          width: 36px; height: 36px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .18s; font-size: .95rem;
        }
        body.dark  .nav-theme-btn:hover { background: rgba(255,255,255,.12); }
        body.light .nav-theme-btn:hover { background: rgba(0,0,0,.09); }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-toggle { display: none !important; }
          .nav-mobile-menu  { display: none !important; }
        }
      `}</style>

      <header style={{
        position: 'sticky', top: 0, zIndex: 999,
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%',
        background: darkMode ? 'rgba(9,12,22,0.9)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: darkMode ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
        transition: 'background .3s ease, border-color .3s ease',
      }}>
        {/* Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg,#00d084,#00b875)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, color: '#0a1628', fontSize: '.95rem',
            boxShadow: '0 0 16px rgba(0,208,132,.4)',
          }}>P</div>
          <span style={{ color: darkMode ? '#fff' : '#0f172a', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-.5px', transition: 'color .3s' }}>
            Play<span style={{ color: '#00d084' }}>Stop</span>
          </span>
        </div>

        {/* Desktop links */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {links.map(l => (
            <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="nav-theme-btn" onClick={toggleTheme} title={darkMode ? 'Modo claro' : 'Modo oscuro'} style={{ color: darkMode ? 'rgba(255,255,255,.7)' : '#475569' }}>
            {darkMode
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            }
          </button>
          <button className="nav-login" onClick={() => navigate('/login')}>Iniciar Sesión</button>
          <button className="nav-cta" onClick={() => navigate('/register')}>Comenzar Gratis</button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMenuOpen(o => !o)}
          style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', color: '#fff', width: 38, height: 38, borderRadius: 9, fontSize: '1.1rem', cursor: 'pointer', display: 'none', alignItems: 'center', justifyContent: 'center' }}
        >
          {menuOpen ? '✖' : '☰'}
        </button>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nav-mobile-menu" style={{
          position: 'fixed', top: '64px', left: 0, right: 0,
          background: 'rgba(9,12,22,0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,.08)',
          zIndex: 998, padding: '16px 5% 24px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {links.map(l => (
            <a key={l.label} href={l.href} className="nav-link" onClick={() => setMenuOpen(false)} style={{ fontSize: '1rem', padding: '12px 14px' }}>
              {l.label}
            </a>
          ))}
          <div style={{ height: 1, background: 'rgba(255,255,255,.08)', margin: '6px 0' }} />
          <button className="nav-login" onClick={() => { setMenuOpen(false); navigate('/login'); }} style={{ width: '100%', padding: 13 }}>
            Iniciar Sesión
          </button>
          <button className="nav-cta" onClick={() => { setMenuOpen(false); navigate('/register'); }} style={{ width: '100%', padding: 13, fontSize: '1rem' }}>
            Comenzar Gratis
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
