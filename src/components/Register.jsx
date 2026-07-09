import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCsrfHeader } from '../services/api.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const Register = () => {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para el rol (por defecto seleccionamos 'Jugador')
  const [role, setRole] = useState('Jugador'); 
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [serverMsg, setServerMsg] = useState('');

  const fetchWithTimeout = (url, options, ms = 60000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!navigator.onLine) {
      alert("Sin conexión a internet. Conéctate e intenta de nuevo.");
      return;
    }

    setLoading(true);
    setServerMsg('Conectando...');

    const endpoint = role === 'Jugador'
      ? `${API_URL}/api/auth/register/player`
      : `${API_URL}/api/auth/register/owner`;

    const body = { name, email, password, phone };
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getCsrfHeader() },
      credentials: 'include',
      body: JSON.stringify(body),
    };

    const attemptRegister = async (isRetry = false) => {
      if (isRetry) setServerMsg('El servidor tardó en responder. Reintentando...');
      try {
        const response = await fetchWithTimeout(endpoint, options, 60000);
        const data = await response.json();
        if (response.ok) {
          alert("¡Cuenta creada con éxito! Por favor, inicia sesión.");
          navigate('/login');
        } else {
          alert(data.message || "No se pudo registrar la cuenta. Verifica los datos.");
        }
      } catch (error) {
        if (error.name === 'AbortError' && !isRetry) {
          setServerMsg('El servidor está iniciando (plan gratuito). Esperando...');
          await new Promise(r => setTimeout(r, 5000));
          return attemptRegister(true);
        }
        alert("Error de red: No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.");
      }
    };

    try {
      await attemptRegister();
    } finally {
      setLoading(false);
      setServerMsg('');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease' }}>
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
          .auth-input { width: 100%; padding: 14px 18px; border-radius: 12px; border: 1px solid #cbd5e1; font-size: 1rem; transition: all 0.2s; box-sizing: border-box; }
          .auth-input:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); outline: none; }
          
          /* Estilos para el selector de roles */
          .role-toggle-btn { flex: 1; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
          .role-active { background-color: #0f172a; color: white; border: 2px solid #0f172a; box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.2); }
          .role-inactive { background-color: #f8fafc; color: #64748b; border: 2px solid #e2e8f0; }
          .role-inactive:hover { background-color: #f1f5f9; border-color: #cbd5e1; }
        `}
      </style>
      
      <div className="modal-container" style={{ backgroundColor: '#ffffff', padding: '48px 40px', borderRadius: '28px', width: '90%', maxWidth: '460px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)', overflowY: 'auto', maxHeight: '90vh' }}>
        
        {/* Borde superior degradado */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, #2563eb, #3b82f6)' }}></div>
        
        {/* Botón Cerrar */}
        <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '24px', right: '24px', background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>✖</button>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.8rem', fontWeight: '900' }}>Crea tu cuenta</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Únete a la mejor comunidad deportiva</p>
        </div>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleFormSubmit}>
          
          {/* SELECTOR DE ROL */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>¿Cómo usarás PlaySpot?</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className={`role-toggle-btn ${role === 'Jugador' ? 'role-active' : 'role-inactive'}`}
                onClick={() => setRole('Jugador')}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Jugador
              </button>
              <button
                type="button"
                className={`role-toggle-btn ${role === 'Propietario' ? 'role-active' : 'role-inactive'}`}
                onClick={() => setRole('Propietario')}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                Propietario
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            <span style={{ padding: '0 10px', fontWeight: '600' }}>Tus datos</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Nombre completo</label>
            <input className="auth-input" type="text" placeholder="Ej. Juan Pérez" value={name}
              onChange={e => setName(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, ''))}
              required style={{ color: '#0f172a' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Correo electrónico</label>
            <input className="auth-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" style={{ color: '#0f172a' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Teléfono <span style={{ color: '#94a3b8', fontWeight: '400' }}>(opcional)</span></label>
            <input className="auth-input" type="tel" placeholder="Ej. 999888777" value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
              maxLength={9} style={{ color: '#0f172a' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input className="auth-input" type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingRight: '40px', color: '#0f172a' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0', display: 'flex', alignItems: 'center' }}>
                {showPassword
                  ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>
          
          <button type="submit" disabled={loading} style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', marginTop: '8px', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)' }}>
            {loading ? (serverMsg || 'Procesando...') : `Registrarme como ${role}`}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '0.95rem' }}>
          ¿Ya tienes una cuenta? <span onClick={() => navigate('/login')} style={{ color: '#2563eb', fontWeight: '700', cursor: 'pointer' }}>Inicia sesión</span>
        </p>

      </div>
    </div>
  );
};

export default Register;