import { useState, useEffect } from 'react';
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
import JugadorDashboard from './components/dashboards/JugadorDashboard.jsx';
import PropietarioDashboard from './components/dashboards/PropietarioDashboard.jsx';
import AdminDashboard from './components/dashboards/AdminDashboard.jsx';
import SuperAdminDashboard from './components/dashboards/SuperAdminDashboard.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import ChatBot from './components/ChatBot.jsx';
import BookingFlow from './pages/BookingFlow.jsx';
import CourtPublicPage from './pages/CourtPublicPage.jsx';
import MapaCanchas from './pages/MapaCanchas.jsx';
import Matchmaking from './pages/Matchmaking.jsx';
import { ComparadorProvider, ComparadorBar } from './components/ComparadorCanchas.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';

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