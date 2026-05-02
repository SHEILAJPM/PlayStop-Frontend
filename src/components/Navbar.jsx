import React, { useState } from 'react';

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('login'); // 'login' o 'register'

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#00d084', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#ffffff' }}>P</div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#111827', fontWeight: '800', letterSpacing: '-0.5px' }}>PlayStop</h1>
        </div>
        
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <a href="#soluciones" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Soluciones</a>
          <a href="#clubes" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Para Clubes</a>
          <a href="#jugadores" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Para Jugadores</a>
          <a href="#precios" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Precios</a>
        </nav>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => openModal('login')} style={{ backgroundColor: 'transparent', color: '#111827', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Iniciar Sesión</button>
          <button onClick={() => openModal('register')} style={{ backgroundColor: '#00d084', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 208, 132, 0.3)' }}>Comenzar Gratis</button>
        </div>
      </header>

      {/* Ventana Emergente (Modal) */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '400px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' }}>✖</button>
            
            <h2 style={{ textAlign: 'center', margin: '0 0 25px 0', color: '#111827', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
              {modalType === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta gratis'}
            </h2>
            
            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={(e) => e.preventDefault()}>
              {modalType === 'register' && <input type="text" placeholder="Nombre completo" style={{ padding: '14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none' }} />}
              <input type="email" placeholder="Correo electrónico" style={{ padding: '14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none' }} />
              <input type="password" placeholder="Contraseña" style={{ padding: '14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none' }} />
              
              <button type="submit" style={{ backgroundColor: '#111827', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer', marginTop: '10px' }}>
                {modalType === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            </form>
            
            <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280', fontSize: '0.95rem' }}>
              {modalType === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <span onClick={() => setModalType(modalType === 'login' ? 'register' : 'login')} style={{ color: '#00d084', fontWeight: '700', cursor: 'pointer' }}>{modalType === 'login' ? 'Regístrate' : 'Inicia sesión'}</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;