import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testCredentials } from './data/credentials.js';

const Login = ({ type, onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

useEffect(() => {
    // Si hay datos escritos, los limpiamos
    if (email !== '' || password !== '' || selectedRole !== null) {
      // eslint-disable-next-line
      setEmail('');
      setPassword('');
      setSelectedRole(null);
      setShowPassword(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const steps = [
    { id: 1, icon: "🔍", title: "Encuentra tu cancha", description: "Filtra por deporte, ubicación y fecha. Explora y compara cientos de complejos deportivos." },
    { id: 2, icon: "💳", title: "Reserva y divide", description: "Olvídate de cobrar. Reserva la cancha y comparte un enlace para el pago dividido automático." },
    { id: 3, icon: "🏆", title: "¡A jugar!", description: "Preséntate con tu reserva digital. Disfruta del partido, suma puntos y sube en el ranking." }
  ];

  const handleRoleSelect = (cred) => {
    setSelectedRole(cred);
    setEmail(cred.email);
    setPassword(cred.password);
  };

  const mapRole = (backendRole) => {
    const roles = { 'USER': 'Jugador', 'OWNER': 'Propietario', 'ADMIN': 'Administrador' };
    return roles[backendRole] || 'Jugador';
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (type === 'forgot') {
        const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (response.ok) {
          alert(`Se ha enviado un código de verificación a:\n${email}`);
          navigate('/login');
        } else {
          const data = await response.json();
          alert(data.message || "Error al enviar el correo.");
        }
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) localStorage.setItem('token', data.token);

        const mappedRole = mapRole(data.role);

        if (onLogin) {
          onLogin({
            email: data.email || email,
            role: mappedRole,
            name: data.name || email.split('@')[0]
          });
        }
      } else {
        alert(data.message || "Credenciales incorrectas.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .auth-input { width: 100%; padding: 14px 18px; border-radius: 12px; border: 2px solid #e2e8f0; background-color: #f8fafc; font-size: 1.05rem; transition: all 0.3s; box-sizing: border-box; }
        .auth-input:focus { border-color: #00d084 !important; box-shadow: 0 0 0 4px rgba(0,208,132,0.15) !important; outline: none; background-color: #ffffff !important; }
        .auth-btn-submit { width: 100%; background-color: #0f172a; color: white; padding: 16px; border-radius: 14px; border: none; font-weight: 800; font-size: 1.05rem; cursor: pointer; margin-top: 8px; transition: all 0.2s; }
        .auth-btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(15,23,42,0.3); background-color: #1e293b; }
        .auth-btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      <div className="modal-container" style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '28px', width: '90%', maxWidth: type === 'como-funciona' ? '960px' : '440px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden', animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
        
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, #00d084, #3b82f6)' }} />

        {selectedRole && type !== 'como-funciona' && (
          <button onClick={() => setSelectedRole(null)} style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', fontSize: '0.9rem', cursor: 'pointer', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>← Volver</button>
        )}

        <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e5e7eb'; e.currentTarget.style.color = '#111827'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#64748b'; }}>✖</button>

        {type === 'como-funciona' ? (
          <div style={{ padding: '10px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(0,208,132,0.1)', border: '1px solid rgba(0,208,132,0.3)', color: '#00d084', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Simple y Rápido</div>
              <h2 style={{ margin: '0 0 16px', color: '#0f172a', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' }}>Reserva en <span style={{ color: '#00d084' }}>3 simples pasos</span></h2>
              <p style={{ margin: '0 auto', color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6' }}>Diseñamos PlayStop para que no pierdas tiempo organizando.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
              {steps.map((step) => (
                <div key={step.id} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px 24px', textAlign: 'center', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-15px', right: '-10px', fontSize: '8rem', fontWeight: '900', color: '#f1f5f9', zIndex: 0, lineHeight: 1, pointerEvents: 'none' }}>{step.id}</div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(0,208,132,0.15), rgba(59,130,246,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 20px', border: '1px solid rgba(0,208,132,0.2)' }}>{step.icon}</div>
                    <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>{step.id}. {step.title}</h3>
                    <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button onClick={() => navigate('/register')} style={{ backgroundColor: '#0f172a', color: 'white', padding: '16px 36px', borderRadius: '14px', border: 'none', fontWeight: '800', fontSize: '1.1rem', cursor: 'pointer' }}>Comenzar Gratis</button>
            </div>
          </div>
        ) : (
          <>
            {selectedRole ? (
              <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '10px' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>{selectedRole.icon}</div>
                <h2 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '1.6rem', fontWeight: '800' }}>Acceso {selectedRole.role}</h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Iniciando sesión como {selectedRole.role.toLowerCase()}</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <img src="/favicon.svg" alt="PlayStop" style={{ width: '48px', height: '48px', margin: '0 auto 20px', display: 'block', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,208,132,0.3)' }} />
                <h2 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '1.8rem', fontWeight: '800' }}>
                  {type === 'login' ? 'Bienvenido de nuevo' : 'Recuperar contraseña'}
                </h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                  {type === 'login' ? 'Ingresa tus datos' : 'Te enviaremos un código'}
                </p>
              </div>
            )}

            {!selectedRole && type !== 'forgot' && (
              <>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <button type="button" style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#0f172a', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" style={{ width: '18px', height: '18px' }} /> Google
                  </button>
                  <button type="button" style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#0f172a', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Apple" style={{ width: '18px', height: '18px' }} /> Apple
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: '#94a3b8', fontSize: '0.82rem' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                  <span style={{ padding: '0 10px', fontWeight: '600' }}>O CON EMAIL</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                </div>
              </>
            )}

            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleFormSubmit}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Correo electrónico</label>
                <input className="auth-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
              </div>

              {type !== 'forgot' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Contraseña</label>
                    {type === 'login' && (
                      <span onClick={() => navigate('/forgot')} style={{ fontSize: '0.8rem', color: '#00d084', fontWeight: '600', cursor: 'pointer' }}>
                        ¿Olvidaste tu contraseña?
                      </span>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input className="auth-input" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingRight: '44px' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
              )}

              <button type="submit" className="auth-btn-submit" disabled={loading}>
                {loading ? 'Procesando...' : (selectedRole ? `Iniciar como ${selectedRole.role}` : type === 'login' ? 'Iniciar Sesión' : 'Enviar Código')}
              </button>
            </form>

            {!selectedRole && type === 'login' && (
              <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <p style={{ margin: '0 0 12px', fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textAlign: 'center' }}>ACCESO RÁPIDO (DEMO)</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {testCredentials.map((cred) => (
                    <button key={cred.id} type="button" onClick={() => handleRoleSelect(cred)} style={{ fontSize: '0.8rem', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>
                      {cred.icon} {cred.role}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!selectedRole && (
              <p style={{ textAlign: 'center', marginTop: '25px', color: '#64748b', fontSize: '0.95rem' }}>
                {type === 'forgot' ? (
                  <span onClick={() => navigate('/login')} style={{ color: '#00d084', fontWeight: '700', cursor: 'pointer' }}>Volver a Iniciar Sesión</span>
                ) : (
                  <>
                    {type === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                    <span onClick={() => navigate(type === 'login' ? '/register' : '/login')} style={{ color: '#00d084', fontWeight: '700', cursor: 'pointer' }}>
                      {type === 'login' ? 'Regístrate' : 'Inicia sesión'}
                    </span>
                  </>
                )}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;