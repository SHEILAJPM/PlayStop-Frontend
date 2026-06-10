import { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from './context/AuthContext.jsx';
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
import ChatBot from './components/ChatBot.jsx';
import { ComparadorProvider, ComparadorBar } from './components/ComparadorCanchas.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';

const JugadorDashboard    = lazy(() => import('./components/dashboards/JugadorDashboard.jsx'));
const PropietarioDashboard = lazy(() => import('./components/dashboards/PropietarioDashboard.jsx'));
const AdminDashboard      = lazy(() => import('./components/dashboards/AdminDashboard.jsx'));
const SuperAdminDashboard = lazy(() => import('./components/dashboards/SuperAdminDashboard.jsx'));
const Login               = lazy(() => import('./components/Login.jsx'));
const Register            = lazy(() => import('./components/Register.jsx'));
const BookingFlow         = lazy(() => import('./pages/BookingFlow.jsx'));
const CourtPublicPage     = lazy(() => import('./pages/CourtPublicPage.jsx'));
const MapaCanchas         = lazy(() => import('./pages/MapaCanchas.jsx'));
const Matchmaking         = lazy(() => import('./pages/Matchmaking.jsx'));

function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #1e293b', borderTop: '3px solid #00d084', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color: '#475569', fontWeight: 600, margin: 0 }}>Cargando...</p>
    </div>
  );
}

// Layout que envuelve la Landing Page
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
      <Outlet /> 
    </>
  );
}

function AppContent() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('playspot-theme');
    return saved === null ? true : saved === 'dark';
  });

  const handleThemeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('playspot-theme', newMode ? 'dark' : 'light');
    document.body.classList.toggle('dark', newMode);
    document.body.classList.toggle('light', !newMode);
  };

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    document.body.classList.toggle('light', !darkMode);
  }, [darkMode]);

  // Aquí es donde se usa el useEffect para las animaciones
  useEffect(() => {
    if (user) return; 

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [user]);

  const handleLogin = (loggedInUser) => {
    login(loggedInUser);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Normalización de roles para asegurar que las direcciones funcionen
  const getRole = () => user?.role?.toUpperCase() || '';

  return (
    <div className={darkMode ? 'dark-mode' : ''} style={{ minHeight: '100vh' }}>
      <ChatBot darkMode={darkMode} />
      <ComparadorBar />
      <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={!user ? <LandingLayout darkMode={darkMode} toggleTheme={handleThemeToggle} /> : <Navigate to="/dashboard" replace />}>
          <Route path="login" element={<Login type="login" onLogin={handleLogin} darkMode={darkMode} />} />
          <Route path="register" element={<Register onLogin={handleLogin} />} />
          <Route path="forgot" element={<Login type="forgot" onLogin={handleLogin} darkMode={darkMode} />} />
        </Route>
        
        {/* RUTA MAESTRA DE DASHBOARD */}
        <Route path="/dashboard" element={
          user ? (
            <>
              {(getRole() === 'USER' || getRole() === 'JUGADOR') && <JugadorDashboard user={user} onLogout={handleLogout} darkMode={darkMode} toggleTheme={handleThemeToggle} />}
              {(getRole() === 'OWNER' || getRole() === 'PROPIETARIO') && <PropietarioDashboard user={user} onLogout={handleLogout} darkMode={darkMode} toggleTheme={handleThemeToggle} />}
              {(getRole() === 'ADMIN' || getRole() === 'ADMINISTRADOR') && <AdminDashboard user={user} onLogout={handleLogout} darkMode={darkMode} toggleTheme={handleThemeToggle} />}
              {(getRole() === 'SUPER ADMIN') && <SuperAdminDashboard user={user} onLogout={handleLogout} darkMode={darkMode} toggleTheme={handleThemeToggle} />}
            </>
          ) : <Navigate to="/login" replace />
        } />

        {/* RUTAS DIRECTAS (Para los navigate del Login.jsx) */}
        <Route path="/super-admin-dashboard" element={user && getRole() === 'SUPER ADMIN' ? <SuperAdminDashboard user={user} onLogout={handleLogout} darkMode={darkMode} toggleTheme={handleThemeToggle} /> : <Navigate to="/login" />} />
        <Route path="/admin-dashboard" element={user && (getRole() === 'ADMIN' || getRole() === 'ADMINISTRADOR') ? <AdminDashboard user={user} onLogout={handleLogout} darkMode={darkMode} toggleTheme={handleThemeToggle} /> : <Navigate to="/login" />} />
        <Route path="/propietario-dashboard" element={user && (getRole() === 'OWNER' || getRole() === 'PROPIETARIO') ? <PropietarioDashboard user={user} onLogout={handleLogout} darkMode={darkMode} toggleTheme={handleThemeToggle} /> : <Navigate to="/login" />} />
        <Route path="/jugador-dashboard" element={user && (getRole() === 'USER' || getRole() === 'JUGADOR') ? <JugadorDashboard user={user} onLogout={handleLogout} darkMode={darkMode} toggleTheme={handleThemeToggle} /> : <Navigate to="/login" />} />

        {/* FLUJO DE RESERVA */}
        <Route path="/reservar/:courtId" element={
          user ? <BookingFlow user={user} darkMode={darkMode} /> : <Navigate to="/login" replace />
        } />

        {/* Paginas Publicas */}
        <Route path="/cancha/:slug" element={<CourtPublicPage />} />
        <Route path="/mapa" element={<MapaCanchas />} />
        <Route path="/matchmaking" element={<Matchmaking />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ComparadorProvider>
        <AppContent />
      </ComparadorProvider>
    </Router>
  );
}

export default App;