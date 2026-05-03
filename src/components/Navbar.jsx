import  { useState } from 'react';

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
          <img src="/favicon.svg" alt="PlayStop" style={{ width: '32px', height: '32px' }} />
          <h1 style={{ margin: 0, fontSize: '24px', color: '#111827', fontWeight: '800', letterSpacing: '-0.5px' }}>PlayStop</h1>
        </div>
        
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Inicio</a>
          <a href="#soluciones" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Soluciones</a>
          <a href="#clubes" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Para Clubes</a>
          <a href="#jugadores" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Para Jugadores</a>
          <a href="#testimonios" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Testimonios</a>
          <a href="#precios" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Precios</a>
        </nav>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => openModal('login')} style={{ backgroundColor: 'transparent', color: '#111827', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Iniciar Sesión</button>
          <button onClick={() => openModal('register')} style={{ backgroundColor: '#00d084', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 208, 132, 0.3)' }}>Comenzar Gratis</button>
        </div>
      </header>

      {/* Ventana Emergente (Modal) */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '420px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            
            {/* Elemento decorativo */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, #00d084, #3b82f6)' }}></div>

            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s ease' }} onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#e5e7eb'; e.currentTarget.style.color = '#111827'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#64748b'}}>✖</button>
            
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <img src="/favicon.svg" alt="PlayStop" style={{ width: '48px', height: '48px', margin: '0 auto 20px auto', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 208, 132, 0.3)' }} />
              <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                {modalType === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                {modalType === 'login' ? 'Ingresa tus datos para continuar' : 'Comienza a gestionar tus partidos hoy mismo'}
              </p>
            </div>
            
            {/* Social Logins */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
               <button style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}>
                 <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" style={{ width: '18px', height: '18px' }} /> Google
               </button>
               <button style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}>
                 <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Apple" style={{ width: '18px', height: '18px' }} /> Apple
               </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
               <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
               <span style={{ padding: '0 10px', fontWeight: '600' }}>O con email</span>
               <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={(e) => e.preventDefault()}>
              {modalType === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Nombre completo</label>
                  <input type="text" placeholder="Ej. Juan Pérez" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#00d084'} onBlur={(e) => e.currentTarget.style.borderColor = '#cbd5e1'} />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Correo electrónico</label>
                <input type="email" placeholder="tu@correo.com" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#00d084'} onBlur={(e) => e.currentTarget.style.borderColor = '#cbd5e1'} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Contraseña</label>
                  {modalType === 'login' && <span style={{ fontSize: '0.8rem', color: '#00d084', fontWeight: '600', cursor: 'pointer' }}>¿Olvidaste tu contraseña?</span>}
                </div>
                <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#00d084'} onBlur={(e) => e.currentTarget.style.borderColor = '#cbd5e1'} />
              </div>
              
              <button type="submit" style={{ backgroundColor: '#0f172a', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', marginTop: '8px', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.2)' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}>
                {modalType === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </button>
            </form>
            
            <p style={{ textAlign: 'center', marginTop: '25px', color: '#64748b', fontSize: '0.95rem' }}>
              {modalType === 'login' ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
              <span onClick={() => setModalType(modalType === 'login' ? 'register' : 'login')} style={{ color: '#00d084', fontWeight: '700', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#059669'} onMouseOut={(e) => e.currentTarget.style.color = '#00d084'}>{modalType === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;