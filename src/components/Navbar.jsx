import  { useState } from 'react';
import { testCredentials } from './data/credentials.js';

const Navbar = ({ onLogin, darkMode, toggleTheme }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('login'); // 'login', 'register' o 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Contenido de la sección "Cómo Funciona"
  const steps = [
    {
      id: 1,
      icon: "🔍",
      title: "Encuentra tu cancha",
      description: "Filtra por deporte, ubicación y fecha. Explora y compara cientos de complejos deportivos."
    },
    {
      id: 2,
      icon: "💳",
      title: "Reserva y divide",
      description: "Olvídate de cobrar. Reserva la cancha y comparte un enlace para el pago dividido automático."
    },
    {
      id: 3,
      icon: "🏆",
      title: "¡A jugar!",
      description: "Preséntate con tu reserva digital. Disfruta del partido, suma puntos y sube en el ranking."
    }
  ];

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setEmail('');
    setPassword('');
    setSelectedRole(null);
  };

  const handleRoleSelect = (cred) => {
    setSelectedRole(cred);
    setEmail(''); // Aseguramos que los campos estén en blanco
    setPassword('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'forgot') {
      alert(`Se ha enviado un enlace seguro de recuperación a:\n${email}`);
      setModalType('login');
      return;
    }

    let roleToLogin = 'Jugador';
    if (selectedRole) {
      roleToLogin = selectedRole.role;
    } else {
      const cred = testCredentials.find((c) => c.email === email);
      if (cred) roleToLogin = cred.role;
    }
    
    if (onLogin) onLogin({ email, role: roleToLogin, name: email.split('@')[0] });
    setShowModal(false);
  };

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
          <a href="#" onClick={(e) => { e.preventDefault(); openModal('como-funciona'); }} style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#4b5563'}>Cómo Funciona</a>
          <a href="#soluciones" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#4b5563'}>Soluciones</a>
          <a href="#jugadores" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#4b5563'}>Para Jugadores</a>
          <a href="#clubes" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#4b5563'}>Para Clubes</a>
          <a href="#precios" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color='#00d084'} onMouseOut={(e) => e.currentTarget.style.color='#4b5563'}>Precios</a>
        </nav>
        
        <div className="desktop-nav" style={{ display: 'flex', gap: '15px' }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className="nav-login-btn" onClick={() => openModal('login')} style={{ backgroundColor: 'transparent', color: '#111827', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Iniciar Sesión</button>
          <button onClick={() => openModal('register')} style={{ backgroundColor: '#00d084', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0, 208, 132, 0.3)' }}>Comenzar Gratis</button>
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
          <button onClick={() => { setIsMobileMenuOpen(false); openModal('login'); }} className="modal-demo-btn" style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#0f172a', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '1rem' }}>Iniciar Sesión</button>
          <button onClick={() => { setIsMobileMenuOpen(false); openModal('register'); }} style={{ width: '100%', backgroundColor: '#00d084', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', boxShadow: '0 4px 10px rgba(0,208,132,0.3)' }}>Comenzar Gratis</button>
        </div>
      )}

      {/* Ventana Emergente (Modal) */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease' }}>
          <style>
            {`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
              .auth-input { width: 100%; padding: 14px 18px; border-radius: 12px; border: 2px solid #e2e8f0; background-color: #f8fafc; font-size: 1.05rem; transition: all 0.3s; box-sizing: border-box; }
              .auth-input:focus { border-color: #00d084 !important; box-shadow: 0 0 0 4px rgba(0, 208, 132, 0.15) !important; outline: none; background-color: #ffffff !important; }
              .auth-btn-submit { background-color: #0f172a; color: white; padding: 16px; border-radius: 14px; border: none; font-weight: 800; font-size: 1.05rem; cursor: pointer; margin-top: 8px; transition: all 0.2s; }
              .auth-btn-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.3); background-color: #1e293b; }
            `}
          </style>
          <div className="modal-container" style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '28px', width: '90%', maxWidth: modalType === 'como-funciona' ? '960px' : '440px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)', overflow: 'hidden', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)', transition: 'max-width 0.3s ease' }}>
            
            {/* Elemento decorativo */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, #00d084, #3b82f6)' }}></div>

            {/* Botón de retroceso al seleccionar un rol */}
            {selectedRole && modalType !== 'como-funciona' && (
              <button onClick={() => setSelectedRole(null)} style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', fontSize: '0.9rem', cursor: 'pointer', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ← Volver
              </button>
            )}

            <button onClick={() => setShowModal(false)} className="modal-close-btn" style={{ position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s ease' }} onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#e5e7eb'; e.currentTarget.style.color = '#111827'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#64748b'}}>✖</button>
            
            {modalType === 'como-funciona' ? (
              <div style={{ padding: '10px 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(0, 208, 132, 0.1)', border: '1px solid rgba(0, 208, 132, 0.3)', color: '#00d084', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Simple y Rápido</div>
                  <h2 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' }}>
                    Reserva en <span style={{ color: '#00d084' }}>3 simples pasos</span>
                  </h2>
                  <p style={{ margin: '0 auto', color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6' }}>
                    Diseñamos PlayStop para que no pierdas tiempo organizando. En menos de 2 minutos estarás listo para entrar a la cancha con tu equipo.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                  {steps.map((step) => (
                    <div key={step.id} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px 24px', textAlign: 'center', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#00d084'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 208, 132, 0.15)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div style={{ position: 'absolute', top: '-15px', right: '-10px', fontSize: '8rem', fontWeight: '900', color: '#f1f5f9', zIndex: 0, lineHeight: 1, pointerEvents: 'none' }}>{step.id}</div>
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ width: '70px', height: '70px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(0, 208, 132, 0.15), rgba(59, 130, 246, 0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 20px auto', border: '1px solid rgba(0, 208, 132, 0.2)' }}>{step.icon}</div>
                        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.5px' }}>{step.id}. {step.title}</h3>
                        <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6', margin: 0, fontWeight: '500' }}>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <button onClick={() => setModalType('register')} style={{ backgroundColor: '#0f172a', color: 'white', padding: '16px 36px', borderRadius: '14px', border: 'none', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.2)' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    Comenzar Gratis
                  </button>
                </div>
              </div>
            ) : (
              <>
                {selectedRole ? (
                  <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '10px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>{selectedRole.icon}</div>
                    <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                      Acceso {selectedRole.role}
                    </h2>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                      Estás iniciando sesión como {selectedRole.role.toLowerCase()}
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <img src="/favicon.svg" alt="PlayStop" style={{ width: '48px', height: '48px', margin: '0 auto 20px auto', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 208, 132, 0.3)' }} />
                    <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                      {modalType === 'login' ? 'Bienvenido de nuevo' : modalType === 'register' ? 'Crea tu cuenta' : 'Recuperar contraseña'}
                    </h2>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                      {modalType === 'login' ? 'Ingresa tus datos para continuar' : modalType === 'register' ? 'Comienza a gestionar tus partidos hoy mismo' : 'Ingresa tu correo y te enviaremos un enlace seguro'}
                    </p>
                  </div>
                )}
            
            {/* Social Logins */}
            {!selectedRole && modalType !== 'forgot' && (
              <>
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
              </>
            )}

            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleFormSubmit}>
              {modalType === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Nombre completo</label>
                  <input className="modal-input" type="text" placeholder="Ej. Juan Pérez" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#00d084'} onBlur={(e) => e.currentTarget.style.borderColor = '#cbd5e1'} />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Correo electrónico</label>
                <input className="modal-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#00d084'} onBlur={(e) => e.currentTarget.style.borderColor = '#cbd5e1'} />
              </div>
              
              {modalType !== 'forgot' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Contraseña</label>
                    {modalType === 'login' && <span onClick={() => setModalType('forgot')} style={{ fontSize: '0.8rem', color: '#00d084', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#059669'} onMouseOut={(e) => e.currentTarget.style.color = '#00d084'}>¿Olvidaste tu contraseña?</span>}
                  </div>
                  <input className="modal-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#00d084'} onBlur={(e) => e.currentTarget.style.borderColor = '#cbd5e1'} />
                </div>
              )}
              
              <button type="submit" style={{ backgroundColor: '#0f172a', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', marginTop: '8px', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.2)' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}>
                {modalType === 'login' ? 'Iniciar Sesión' : modalType === 'register' ? 'Crear Cuenta' : 'Enviar Enlace'}
              </button>
            </form>

            {/* Credenciales de Prueba (Demo Roles) */}
            {!selectedRole && modalType === 'login' && (
              <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Acceso Rápido (Demo)</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {testCredentials.map((cred) => (
                    <button className="modal-demo-btn" key={cred.id} type="button" onClick={() => handleRoleSelect(cred)} style={{ fontSize: '0.8rem', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', cursor: 'pointer', fontWeight: '600', color: '#475569', transition: 'all 0.2s' }} onMouseOver={(e) => {e.currentTarget.style.borderColor='#00d084'; e.currentTarget.style.color='#0f172a'}} onMouseOut={(e) => {e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.color='#475569'}}>
                      {cred.icon} {cred.role}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {!selectedRole && (
              <p style={{ textAlign: 'center', marginTop: '25px', color: '#64748b', fontSize: '0.95rem' }}>
                {modalType === 'forgot' ? (
                  <span onClick={() => setModalType('login')} style={{ color: '#00d084', fontWeight: '700', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#059669'} onMouseOut={(e) => e.currentTarget.style.color = '#00d084'}>Volver a Iniciar Sesión</span>
                ) : (
                  <>
                    {modalType === 'login' ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
                    <span onClick={() => setModalType(modalType === 'login' ? 'register' : 'login')} style={{ color: '#00d084', fontWeight: '700', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#059669'} onMouseOut={(e) => e.currentTarget.style.color = '#00d084'}>{modalType === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}</span>
                  </>
                )}
              </p>
            )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;