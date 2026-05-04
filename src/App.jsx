import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Marcas from './components/Marcas.jsx';
import CanchasDestacadas from './components/CanchasDestacadas.jsx';
import Soluciones from './components/Soluciones.jsx';
import ParaClubes from './components/ParaClubes.jsx';
import ParaJugadores from './components/ParaJugadores.jsx';
import Testimonios from './components/Testimonios.jsx';
import Precios from './components/Precios.jsx';
import Faq from './components/Faq.jsx';
import Blog from './components/Blog.jsx';
import Contacto from './components/Contacto.jsx';
import Legal from './components/Legal.jsx';
import Footer from "./components/Footer.jsx";
import JugadorDashboard from './components/dashboards/JugadorDashboard.jsx';
import PropietarioDashboard from './components/dashboards/PropietarioDashboard.jsx';
import AdminDashboard from './components/dashboards/AdminDashboard.jsx';
import SuperAdminDashboard from './components/dashboards/SuperAdminDashboard.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';

// Layout que envuelve la Landing Page para permitir que el modal se renderice en una sub-ruta
function LandingLayout({ darkMode, toggleTheme }) {
  return (
    <>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <Hero />
      <Marcas />
      <CanchasDestacadas />
      <Soluciones />
      <ParaJugadores />
      <ParaClubes />
      <Testimonios />
      <Precios />
      <Faq />
      <Blog />
      <Contacto />
      <Legal />
      <Footer />
      <Outlet /> {/* Aquí se renderizará el Login si coincide con las rutas /login, /register, etc. */}
    </>
  );
}

function AppContent() {
  // Leer el usuario del localStorage al iniciar la app
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('playstop-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();
  
  // Inicializar el estado de Modo Oscuro leyendo directamente el localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('playstop-theme') === 'dark';
  });

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('playstop-theme', !darkMode ? 'dark' : 'light');
  };

  // Intersection Observer para Animaciones de Scroll (Scroll Reveal)
  useEffect(() => {
    if (user) return; // Solo ejecutar en la landing page

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animar solo la primera vez
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [user]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('playstop-user', JSON.stringify(loggedInUser));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('playstop-user');
    navigate('/');
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''} style={{ fontFamily: '"Inter", system-ui, -apple-system, sans-serif', color: '#111827', margin: 0, padding: 0, backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <style>
        {`
          .reveal {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .reveal.visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* DARK MODE GLOBAL STYLES */
          .dark-mode { background-color: #020617 !important; color: #f8fafc !important; }
          .dark-mode section:not(#clubes):not(#testimonios) { background-color: #020617 !important; border-color: #1e293b !important; }
          .dark-mode #soluciones, .dark-mode #faq { background-color: #0b1120 !important; }
          
          .dark-mode section:not(#clubes):not(#testimonios) h2, 
          .dark-mode section:not(#clubes):not(#testimonios) h3, 
          .dark-mode section:not(#clubes):not(#testimonios) h4,
          .dark-mode .precio-valor { color: #f8fafc !important; }
          
          .dark-mode section:not(#clubes):not(#testimonios) p,
          .dark-mode .trust-logo { color: #94a3b8 !important; }
          .dark-mode .trust-logo:hover { color: #f8fafc !important; }
          
          /* Navbar Oscuro */
          .dark-mode .navbar-header { background-color: rgba(2, 6, 23, 0.85) !important; border-bottom: 1px solid #1e293b !important; }
          .dark-mode .desktop-nav a { color: #cbd5e1 !important; }
          .dark-mode .desktop-nav a:hover { color: #00d084 !important; }
          .dark-mode .mobile-toggle { color: #f8fafc !important; }
          .dark-mode .mobile-menu { background-color: #0f172a !important; border-bottom: 1px solid #1e293b !important; }
          .dark-mode .mobile-menu a { color: #f8fafc !important; }
          .dark-mode .nav-login-btn { color: #f8fafc !important; }
          
          /* Tarjetas y Acordeón Oscuros */
          .dark-mode .cancha-card, .dark-mode .soluciones-card, .dark-mode .precio-card:not([style*="linear-gradient"]), .dark-mode .faq-item { background-color: #0f172a !important; border-color: #1e293b !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.4) !important; }
          .dark-mode .fade-left { background: linear-gradient(to right, #020617 0%, transparent 100%) !important; }
          .dark-mode .fade-right { background: linear-gradient(to left, #020617 0%, transparent 100%) !important; }
          .dark-mode .faq-header { background-color: #0f172a !important; }
          .dark-mode .faq-header.open { background-color: #1e293b !important; }
          .dark-mode .faq-icon { background-color: #1e293b !important; color: #f8fafc !important; border-color: #334155 !important; }
          .dark-mode .faq-divider { background-color: #1e293b !important; }
          
          /* Modal de Autenticación Oscuro */
          .dark-mode .modal-container { background-color: #0f172a !important; border-color: #1e293b !important; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) !important; }
          .dark-mode .modal-container h2 { color: #f8fafc !important; }
          .dark-mode .modal-input { background-color: #020617 !important; border-color: #1e293b !important; color: #f8fafc !important; }
          .dark-mode .modal-input:focus { background-color: #0f172a !important; }
          .dark-mode .modal-close-btn { background-color: #1e293b !important; color: #cbd5e1 !important; }
          .dark-mode .modal-close-btn:hover { background-color: #334155 !important; color: #f8fafc !important; }
          .dark-mode .modal-demo-btn { background-color: #020617 !important; border-color: #1e293b !important; color: #cbd5e1 !important; }
          .dark-mode .modal-demo-btn:hover { border-color: #00d084 !important; color: #f8fafc !important; }
          
          /* --- CORRECCIONES DE VISIBILIDAD (LETRAS INVISIBLES) --- */
          /* 1. Logo del Navbar */
          .dark-mode .navbar-header h1 { color: #f8fafc !important; }
          .dark-mode .navbar-header img { filter: brightness(0) invert(1) !important; }
          
          /* 2. Textos de precios en Canchas Destacadas */
          .dark-mode .cancha-card span { color: #cbd5e1 !important; }
          
          /* 3. Listas de características en Soluciones y Precios */
          .dark-mode .soluciones-card li span,
          .dark-mode .precio-card li,
          .dark-mode .precio-card li span { color: #cbd5e1 !important; }
          
          /* 4. Etiquetas (Badges) de secciones oscuras */
          .dark-mode .section-badge { color: #f8fafc !important; border-color: rgba(255,255,255,0.2) !important; background: rgba(255,255,255,0.05) !important; }
        `}
      </style>
      <Routes>
        {/* RUTA PUBLICA: Landing Page y Rutas de Autenticación */}
        <Route path="/" element={!user ? <LandingLayout darkMode={darkMode} toggleTheme={handleThemeToggle} /> : <Navigate to="/dashboard" replace />}>
          <Route path="login" element={<Login type="login" onLogin={handleLogin} />} />
          <Route path="register" element={<Register onLogin={handleLogin} />} />
          <Route path="forgot" element={<Login type="forgot" onLogin={handleLogin} />} />
          <Route path="como-funciona" element={<Login type="como-funciona" onLogin={handleLogin} />} />
        </Route>
        
        {/* RUTA PRIVADA: Dashboards (Solo accesible si hay usuario) */}
        <Route path="/dashboard" element={
          user ? (
            <>
              {user.role === 'Jugador' && <JugadorDashboard user={user} onLogout={handleLogout} darkMode={darkMode} toggleTheme={handleThemeToggle} />}
              {user.role === 'Propietario' && <PropietarioDashboard user={user} onLogout={handleLogout} darkMode={darkMode} toggleTheme={handleThemeToggle} />}
              {user.role === 'Administrador' && <AdminDashboard user={user} onLogout={handleLogout} darkMode={darkMode} toggleTheme={handleThemeToggle} />}
              {user.role === 'Super Admin' && <SuperAdminDashboard user={user} onLogout={handleLogout} darkMode={darkMode} toggleTheme={handleThemeToggle} />}
            </>
          ) : <Navigate to="/" replace />
        } />
        
        {/* RUTA COMODÍN: Redirigir a inicio si la URL no existe */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;