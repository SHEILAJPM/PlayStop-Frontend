import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const isNative = Capacitor.isNativePlatform();

const Login = ({ type, onLogin, darkMode = true }) => {
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [step, setStep]             = useState(1);
  const [code, setCode]             = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError]           = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmail(''); setPassword(''); setCode(''); setNewPassword('');
    setStep(1); setShowPassword(false); setError('');
  }, [type]);

  const handleGoogleCredential = useCallback(async (response) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: response.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) localStorage.setItem('token', data.token);
        if (onLogin) onLogin(data);
        const role = data.role?.toUpperCase();
        if (role === 'ADMIN') navigate('/super-admin-dashboard');
        else if (role === 'OWNER' || role === 'PROPIETARIO') navigate('/propietario-dashboard');
        else navigate('/jugador-dashboard');
      } else {
        setError(data.message || 'Error al iniciar sesión con Google.');
      }
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  }, [navigate, onLogin]);

  useEffect(() => {
    if (type !== 'login' || !GOOGLE_CLIENT_ID || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
    });
    if (googleBtnRef.current) {
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: darkMode ? 'filled_black' : 'outline',
        size: 'large',
        width: googleBtnRef.current.offsetWidth || 348,
        text: 'continue_with',
        locale: 'es',
      });
    }
  }, [type, darkMode, handleGoogleCredential]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      if (type === 'forgot') {
        const endpoint = step === 1 ? '/api/auth/forgot-password' : '/api/auth/reset-password';
        const body     = step === 1 ? { email } : { email, code, newPassword };
        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (res.ok) { step === 1 ? setStep(2) : navigate('/login'); }
        else        { const d = await res.json(); setError(d.message || 'Error en el proceso.'); }
      } else {
        const res  = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
          if (data.token) localStorage.setItem('token', data.token);
          if (onLogin) onLogin(data);
          const role = data.role?.toUpperCase();
          if (role === 'ADMIN')                         navigate('/super-admin-dashboard');
          else if (role === 'OWNER' || role === 'PROPIETARIO') navigate('/propietario-dashboard');
          else                                          navigate('/jugador-dashboard');
        } else {
          setError(data.message || 'Credenciales incorrectas.');
        }
      }
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const title = type === 'login'
    ? 'Bienvenido de vuelta'
    : step === 1 ? 'Recuperar cuenta' : 'Nueva contraseña';

  const subtitle = type === 'login'
    ? 'Inicia sesión para continuar'
    : step === 1 ? 'Te enviamos un código a tu correo' : 'Ingresa el código y tu nueva contraseña';

  const dk = darkMode;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: dk
        ? 'linear-gradient(135deg, #020b18 0%, #07111f 50%, #030c1a 100%)'
        : 'linear-gradient(135deg, #e8f0fe 0%, #f0f4f8 50%, #eaf1fb 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes loginFadeUp {
          from { opacity: 0; transform: translateY(20px) scale(.97); }
          to   { opacity: 1; transform: none; }
        }
        .login-card { animation: loginFadeUp .38s cubic-bezier(.16,1,.3,1) forwards; }
        .dk-input {
          width: 100%; padding: 13px 16px;
          background: ${dk ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'};
          border: 1px solid ${dk ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.12)'};
          border-radius: 12px; color: ${dk ? '#f1f5f9' : '#0f172a'};
          font-size: .95rem; font-family: inherit;
          transition: all .18s; outline: none; box-sizing: border-box;
        }
        .dk-input::placeholder { color: ${dk ? 'rgba(255,255,255,.28)' : 'rgba(0,0,0,.35)'}; }
        .dk-input:focus {
          border-color: #00d084;
          background: rgba(0,208,132,.04);
          box-shadow: 0 0 0 3px rgba(0,208,132,.12);
        }
        .dk-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg,#00d084,#00b875);
          color: #0a1628; font-weight: 800; font-size: .97rem;
          border: none; border-radius: 12px; cursor: pointer;
          transition: all .2s; box-shadow: 0 4px 20px rgba(0,208,132,.28);
          font-family: inherit;
        }
        .dk-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(0,208,132,.42); }
        .dk-btn:disabled { opacity: .5; cursor: wait; }
        .dk-link { color: #00d084; font-size: .85rem; font-weight: 600; cursor: pointer; background: none; border: none; font-family: inherit; transition: opacity .15s; padding: 0; }
        .dk-link:hover { opacity: .75; }
        .dk-label { color: ${dk ? 'rgba(255,255,255,.55)' : '#475569'}; font-size: .82rem; font-weight: 600; }
      `}</style>

      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '8%', left: '15%', width: 480, height: 480, background: 'radial-gradient(circle, rgba(0,208,132,.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '12%', width: 360, height: 360, background: `radial-gradient(circle, ${dk ? 'rgba(59,130,246,.05)' : 'rgba(59,130,246,.08)'} 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div className="login-card" style={{
        width: '90%', maxWidth: 420, position: 'relative',
        background: dk ? 'rgba(15,23,42,0.75)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: dk ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        borderRadius: 24,
        padding: '40px 36px',
        boxShadow: dk
          ? '0 32px 64px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.06)'
          : '0 32px 64px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.9)',
      }}>
        {/* Close — solo en web, no en app nativa */}
        {!isNative && (
          <button
            onClick={() => navigate('/')}
            style={{
              position: 'absolute', top: 14, right: 14,
              background: dk ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)',
              border: dk ? '1px solid rgba(255,255,255,.09)' : '1px solid rgba(0,0,0,.1)',
              width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: dk ? 'rgba(255,255,255,.45)' : 'rgba(0,0,0,.4)', fontSize: '1rem', transition: 'all .18s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = dk ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.1)'; e.currentTarget.style.color = dk ? '#fff' : '#0f172a'; }}
            onMouseOut={e => { e.currentTarget.style.background = dk ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)'; e.currentTarget.style.color = dk ? 'rgba(255,255,255,.45)' : 'rgba(0,0,0,.4)'; }}
          >✕</button>
        )}

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{
            width: 50, height: 50, borderRadius: 14, margin: '0 auto 14px',
            background: 'linear-gradient(135deg,#00d084,#00b875)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '1.35rem', color: '#0a1628',
            boxShadow: '0 0 28px rgba(0,208,132,.4)',
          }}>P</div>
          <h2 style={{ margin: '0 0 6px', color: dk ? '#f1f5f9' : '#0f172a', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-.5px' }}>{title}</h2>
          <p style={{ margin: 0, color: dk ? 'rgba(255,255,255,.4)' : 'rgba(15,23,42,.55)', fontSize: '.88rem' }}>{subtitle}</p>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{ marginBottom: 16, padding: '11px 15px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.22)', borderRadius: 10, color: '#f87171', fontSize: '.88rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {type === 'login' ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label className="dk-label">Correo electrónico</label>
                <input className="dk-input" type="email" placeholder="tu@correo.com" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="dk-label">Contraseña</label>
                  <button type="button" className="dk-link" onClick={() => navigate('/forgot')}>¿Olvidaste tu contraseña?</button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    className="dk-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ paddingRight: 52 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: dk ? 'rgba(255,255,255,.38)' : 'rgba(0,0,0,.35)', cursor: 'pointer', fontSize: '.8rem', fontFamily: 'inherit', fontWeight: 600, transition: 'color .15s' }}
                    onMouseOver={e => e.currentTarget.style.color = dk ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.7)'}
                    onMouseOut={e => e.currentTarget.style.color = dk ? 'rgba(255,255,255,.38)' : 'rgba(0,0,0,.35)'}
                  >
                    {showPassword ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
              </div>
            </>
          ) : step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label className="dk-label">Correo para el código</label>
              <input className="dk-input" type="email" placeholder="tu@correo.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label className="dk-label">Código de 6 dígitos</label>
                <input className="dk-input" type="text" placeholder="000000" required maxLength={6} value={code} onChange={e => setCode(e.target.value)} style={{ textAlign: 'center', letterSpacing: 8, fontWeight: 800, fontSize: '1.2rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label className="dk-label">Nueva contraseña</label>
                <input className="dk-input" type="password" placeholder="••••••••" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
            </>
          )}

          <button type="submit" className="dk-btn" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? 'Procesando...' : type === 'login' ? 'Iniciar Sesión' : 'Confirmar'}
          </button>
        </form>

        {type === 'login' && GOOGLE_CLIENT_ID && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0 0' }}>
              <div style={{ flex: 1, height: 1, background: dk ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)' }} />
              <span style={{ fontSize: '.78rem', color: dk ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.35)', fontWeight: 600 }}>o continúa con</span>
              <div style={{ flex: 1, height: 1, background: dk ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)' }} />
            </div>
            <div ref={googleBtnRef} style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }} />
          </>
        )}

        {type === 'login' && (
          <p style={{ textAlign: 'center', margin: '20px 0 0', color: dk ? 'rgba(255,255,255,.38)' : 'rgba(15,23,42,.5)', fontSize: '.88rem' }}>
            ¿No tienes cuenta?{' '}
            <button className="dk-link" onClick={() => navigate('/register')}>Crear cuenta gratis</button>
          </p>
        )}

        {type === 'forgot' && (
          <p style={{ textAlign: 'center', margin: '20px 0 0' }}>
            <button
              className="dk-link"
              onClick={() => navigate('/login')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              ← Volver al inicio de sesión
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
