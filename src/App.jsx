import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import CanchasDestacadas from './components/CanchasDestacadas.jsx';
import Soluciones from './components/Soluciones.jsx';
import ParaClubes from './components/ParaClubes.jsx';
import ParaJugadores from './components/ParaJugadores.jsx';
import Testimonios from './components/Testimonios.jsx';
import Precios from './components/Precios.jsx';
import Faq from './components/Faq.jsx';
import Footer from "./components/Footer.jsx";
import JugadorDashboard from './components/dashboards/JugadorDashboard.jsx';
import PropietarioDashboard from './components/dashboards/PropietarioDashboard.jsx';
import AdminDashboard from './components/dashboards/AdminDashboard.jsx';
import SuperAdminDashboard from './components/dashboards/SuperAdminDashboard.jsx';

function App() {
  const [user, setUser] = useState(null); // null = No logueado

  // Renderizado Condicional: Si hay usuario, mostrar su panel respectivo
  if (user) {
    if (user.role === 'Jugador') return <JugadorDashboard user={user} onLogout={() => setUser(null)} />;
    if (user.role === 'Propietario') return <PropietarioDashboard user={user} onLogout={() => setUser(null)} />;
    if (user.role === 'Administrador') return <AdminDashboard user={user} onLogout={() => setUser(null)} />;
    if (user.role === 'Super Admin') return <SuperAdminDashboard user={user} onLogout={() => setUser(null)} />;
  }

  return (
    <div style={{ fontFamily: '"Inter", system-ui, -apple-system, sans-serif', color: '#111827', margin: 0, padding: 0, backgroundColor: '#ffffff' }}>
      <Navbar onLogin={setUser} />
      <Hero />
      <CanchasDestacadas />
      <Soluciones />
      <ParaJugadores />
      <ParaClubes />
      <Testimonios />
      <Precios />
      <Faq />
      <Footer />
    </div>
  );
}

export default App;