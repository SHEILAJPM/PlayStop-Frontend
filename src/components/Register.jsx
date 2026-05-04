import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleSelect = (roleInfo) => {
    setSelectedRole(roleInfo);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Simulamos el registro y el inicio de sesión inmediato
    if (onLogin) {
      onLogin({ 
        email, 
        role: selectedRole.role, 
        name: name || email.split('@')[0] 
      });
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease' }}>
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
          .auth-input { width: 100%; padding: 14px 18px; border-radius: 12px; border: 2px solid #e2e8f0; background-color: #f8fafc; font-size: 1.05rem; transition: all 0.3s; box-sizing: border-box; }
          .auth-input:focus { border-color: #00d084 !important; box-shadow: 0 0 0 4px rgba(0, 208, 132, 0.15) !important; outline: none; background-color: #ffffff !important; }
          .role-card:hover { border-color: #00d084 !important; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 208, 132, 0.15); }
        `}
      </style>
      
      <div className="modal-container" style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '28px', width: '90%', maxWidth: '440px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)', overflow: 'hidden', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)', transition: 'max-width 0.3s ease' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, #00d084, #3b82f6)' }}></div>
        
        {selectedRole && (
          <button onClick={() => setSelectedRole(null)} style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', fontSize: '0.9rem', cursor: 'pointer', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>← Volver</button>
        )}
        <button onClick={() => navigate('/')} className="modal-close-btn" style={{ position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s ease' }} onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#e5e7eb'; e.currentTarget.style.color = '#111827'}} onMouseOut={(e) => {e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#64748b'}}>✖</button>
        
        {!selectedRole ? (
          <div style={{ padding: '10px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <img src="/favicon.svg" alt="PlayStop" style={{ width: '48px', height: '48px', margin: '0 auto 20px auto', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 208, 132, 0.3)' }} />
              <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Únete a PlayStop</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Elige cómo quieres usar la plataforma</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button className="role-card" onClick={() => handleRoleSelect({ role: 'Jugador', icon: '⚽' })} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '2.5rem', width: '60px', height: '60px', backgroundColor: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>⚽</div>
                <div><h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: '800' }}>Soy Jugador</h3><p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Quiero buscar canchas y organizar partidos.</p></div>
              </button>
              <button className="role-card" onClick={() => handleRoleSelect({ role: 'Propietario', icon: '🏟️' })} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '2.5rem', width: '60px', height: '60px', backgroundColor: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>🏟️</div>
                <div><h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#0f172a', fontWeight: '800' }}>Soy Propietario</h3><p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Quiero gestionar mi complejo deportivo.</p></div>
              </button>
            </div>
            <p style={{ textAlign: 'center', marginTop: '25px', color: '#64748b', fontSize: '0.95rem' }}>¿Ya tienes una cuenta? <span onClick={() => navigate('/login')} style={{ color: '#00d084', fontWeight: '700', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#059669'} onMouseOut={(e) => e.currentTarget.style.color = '#00d084'}>Inicia sesión</span></p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '10px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>{selectedRole.icon}</div>
              <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Registro de {selectedRole.role}</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Crea tu cuenta como {selectedRole.role.toLowerCase()}</p>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
              <button style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}><img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" style={{ width: '18px', height: '18px' }} /> Google</button>
              <button style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}><img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Apple" style={{ width: '18px', height: '18px' }} /> Apple</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}><div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div><span style={{ padding: '0 10px', fontWeight: '600' }}>O con email</span><div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div></div>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleFormSubmit}>
              <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Nombre completo</label><input className="modal-input" type="text" placeholder="Ej. Juan Pérez" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#00d084'} onBlur={(e) => e.currentTarget.style.borderColor = '#cbd5e1'} /></div>
              <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Correo electrónico</label><input className="modal-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#00d084'} onBlur={(e) => e.currentTarget.style.borderColor = '#cbd5e1'} /></div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}><label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Contraseña</label></div>
                <div style={{ position: 'relative' }}>
                  <input className="modal-input" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px 40px 12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }} onFocus={(e) => e.currentTarget.style.borderColor = '#00d084'} onBlur={(e) => e.currentTarget.style.borderColor = '#cbd5e1'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>
              <button type="submit" style={{ backgroundColor: '#0f172a', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', marginTop: '8px', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.2)' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}>Crear Cuenta</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;