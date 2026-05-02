import React from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Marcas from './components/Marcas.jsx';
import Caracteristicas from './components/Caracteristicas.jsx';
import ParaClubes from './components/ParaClubes.jsx';
import Precios from './components/Precios.jsx';
import CallToAction from './components/CallToAction.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div style={{ fontFamily: '"Inter", system-ui, -apple-system, sans-serif', color: '#111827', margin: 0, padding: 0, backgroundColor: '#ffffff' }}>
      <Navbar />
      <Hero />
      <Marcas />
      <Caracteristicas />
      <ParaClubes />
      <Precios />
      <CallToAction />
      <Footer />
    </div>
  );
}

export default App;