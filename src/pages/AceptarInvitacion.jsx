import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';

export default function AceptarInvitacion({ onLogin, darkMode = true }) {
  const { token } = useParams();
  const navigate = useNavigate();
  const dk = darkMode;

  const [info, setInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [infoError, setInfoError] = useState('');

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getInvitationInfo(token)
      .then(setInfo)
      .catch(err => setInfoError(err.message || 'Invitación inválida o expirada'))
      .finally(() => setLoadingInfo(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await api.registerEmployee({ token, name, password, phone });
      if (onLogin) onLogin(response);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'No se pudo crear tu cuenta');
    } finally {
      setSubmitting(false);
    }
  };

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
        .inv-input {
          width: 100%; padding: 13px 16px;
          background: ${dk ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'};
          border: 1px solid ${dk ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.12)'};
          border-radius: 12px; color: ${dk ? '#f1f5f9' : '#0f172a'};
          font-size: .95rem; font-family: inherit;
          outline: none; box-sizing: border-box;
        }
        .inv-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg,#2563eb,#1d4ed8);
          color: #fff; font-weight: 800; font-size: .97rem;
          border: none; border-radius: 12px; cursor: pointer;
          font-family: inherit;
        }
        .inv-btn:disabled { opacity: .5; cursor: wait; }
        .inv-label { color: ${dk ? 'rgba(255,255,255,.55)' : '#475569'}; font-size: .82rem; font-weight: 600; }
      `}</style>

      <div style={{
        width: '90%', maxWidth: 440,
        background: dk ? 'rgba(15,23,42,0.75)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        border: dk ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        borderRadius: 24, padding: '40px 36px',
        boxShadow: dk ? '0 32px 64px rgba(0,0,0,.65)' : '0 32px 64px rgba(0,0,0,.12)',
      }}>
        {loadingInfo ? (
          <p style={{ textAlign: 'center', color: dk ? '#f1f5f9' : '#0f172a' }}>Cargando invitación...</p>
        ) : infoError ? (
          <>
            <h2 style={{ margin: '0 0 12px', color: dk ? '#f1f5f9' : '#0f172a', fontSize: '1.3rem', fontWeight: 900 }}>Invitación no válida</h2>
            <p style={{ margin: '0 0 20px', color: dk ? 'rgba(255,255,255,.6)' : 'rgba(15,23,42,.6)' }}>{infoError}</p>
            <button type="button" className="inv-btn" onClick={() => navigate('/login')}>Ir al inicio de sesión</button>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 26 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 14, margin: '0 auto 14px',
                background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '1.35rem', color: '#0a1628',
              }}>P</div>
              <h2 style={{ margin: '0 0 6px', color: dk ? '#f1f5f9' : '#0f172a', fontSize: '1.4rem', fontWeight: 900 }}>
                Únete al equipo de {info?.branchName}
              </h2>
              <p style={{ margin: 0, color: dk ? 'rgba(255,255,255,.4)' : 'rgba(15,23,42,.55)', fontSize: '.88rem' }}>
                {info?.ownerName} te invitó a PlayStop · {info?.email}
              </p>
            </div>

            {error && (
              <div style={{ marginBottom: 16, padding: '11px 15px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.22)', borderRadius: 10, color: '#f87171', fontSize: '.88rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label className="inv-label">Nombre completo</label>
                <input className="inv-input" required value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label className="inv-label">Teléfono (opcional)</label>
                <input className="inv-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="999 999 999" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <label className="inv-label">Contraseña</label>
                <input className="inv-input" type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />
              </div>
              <button type="submit" className="inv-btn" disabled={submitting} style={{ marginTop: 4 }}>
                {submitting ? 'Creando cuenta...' : 'Crear mi cuenta'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
