import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = ({ type, onLogin }) => {
  const navigate = useNavigate();

  // 1. ESTADOS DEL FORMULARIO
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para Recuperación (2 pasos)
  const [step, setStep] = useState(1); 
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // 2. EFECTO DE LIMPIEZA (Optimizado para evitar errores de linter)
  useEffect(() => {
    if (email !== '' || password !== '' || code !== '' || newPassword !== '') {
      // eslint-disable-next-line
      setEmail('');
      setPassword('');
      setCode('');
      setNewPassword('');
      setStep(1);
      setShowPassword(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // 3. LÓGICA DE ENVÍO Y REDIRECCIÓN
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (type === 'forgot') {
        // FLUJO DE RECUPERACIÓN
        const endpoint = step === 1 ? '/api/auth/forgot-password' : '/api/auth/reset-password';
        const body = step === 1 ? { email } : { email, code, newPassword };

        const response = await fetch(`http://localhost:8080${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (response.ok) {
          if (step === 1) {
            alert(`Código enviado a: ${email}`);
            setStep(2); 
          } else {
            alert("¡Contraseña actualizada con éxito!");
            navigate('/login');
          }
        } else {
          const data = await response.json();
          alert(data.message || "Error en el proceso.");
        }
      } else {
        // FLUJO DE LOGIN NORMAL
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          if (data.token) localStorage.setItem('token', data.token);
          if (onLogin) onLogin(data);

          // REDIRECCIÓN BASADA EN TUS ARCHIVOS DE DASHBOARDS
          const role = data.role.toUpperCase();
          
          if (role === 'ADMIN') {
            navigate('/super-admin-dashboard'); 
          } else if (role === 'OWNER' || role === 'PROPIETARIO') {
            navigate('/propietario-dashboard');
          } else if (role === 'USER' || role === 'JUGADOR') {
            navigate('/jugador-dashboard');
          } else {
            navigate('/explore');
          }
        } else {
          alert(data.message || "Credenciales incorrectas.");
        }
      }
    } catch (error) {
      console.error("Error capturado:", error); //
      alert("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.9)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' }}>
      <style>{`
        .auth-input { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 12px; font-size: 1rem; box-sizing: border-box; }
        .auth-btn { width: 100%; background-color: #0f172a; color: white; padding: 14px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .link-text { color: #00d084; font-size: 0.85rem; cursor: pointer; font-weight: 600; }
        .admin-section { margin-top: 25px; padding-top: 15px; border-top: 1px solid #f1f5f9; text-align: center; }
      `}</style>

      <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '400px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
        
        <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>✕</button>

        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#0f172a', fontWeight: '800' }}>
          {type === 'login' ? 'Iniciar Sesión' : (step === 1 ? 'Recuperar Cuenta' : 'Nueva Contraseña')}
        </h2>

        <form onSubmit={handleFormSubmit}>
          {type === 'login' ? (
            <>
              <input className="auth-input" type="email" placeholder="Correo electrónico" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="auth-input" type={showPassword ? 'text' : 'password'} placeholder="Contraseña" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <span className="link-text" onClick={() => navigate('/forgot')}>¿Olvidaste tu contraseña?</span>
              </div>
            </>
          ) : (
            step === 1 ? (
              <input className="auth-input" type="email" placeholder="Correo para el código" required value={email} onChange={(e) => setEmail(e.target.value)} />
            ) : (
              <>
                <input className="auth-input" type="text" placeholder="Código de 6 dígitos" required value={code} onChange={(e) => setCode(e.target.value)} style={{ textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold' }} />
                <input className="auth-input" type="password" placeholder="Nueva contraseña" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </>
            )
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Procesando...' : (type === 'login' ? 'Entrar' : 'Confirmar')}
          </button>
        </form>

        {type === 'login' && (
          <div className="admin-section">
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '5px' }}>Acceso administrativo</p>
            <span className="link-text" style={{ color: '#3b82f6' }} onClick={() => { setEmail('admin@playstop.com'); setStep(1); }}>Panel de Gestión</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;