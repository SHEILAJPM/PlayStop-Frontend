import { useState, useEffect } from 'react';
import { api } from '../../../services/api.js';

const PerfilTab = ({ user, avatarUrl, setAvatarUrl, darkMode, C }) => {
  const [profileData, setProfileData] = useState({ nombre: user?.name || '', telefono: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [pwdData, setPwdData] = useState({ contrasenaActual: '', nuevaContrasena: '', confirmarContrasena: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);

  useEffect(() => {
    api.getMe()
      .then(data => {
        setProfileData({ nombre: data.name || '', telefono: data.phone || data.telefono || data.phoneNumber || '' });
        if (data.profileImageUrl) {
          setAvatarUrl(data.profileImageUrl);
          localStorage.setItem('playspot-avatar', data.profileImageUrl);
        }
      })
      .catch(() => {});
  }, [setAvatarUrl]);

  useEffect(() => {
    if (!profileMsg) return;
    const t = setTimeout(() => setProfileMsg(null), 3500);
    return () => clearTimeout(t);
  }, [profileMsg]);

  useEffect(() => {
    if (!pwdMsg) return;
    const t = setTimeout(() => setPwdMsg(null), 3500);
    return () => clearTimeout(t);
  }, [pwdMsg]);

  const msgStyle = (msg) => ({
    padding: '12px 16px', borderRadius: '12px',
    background: msg.type === 'success' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(239,68,68,0.1)',
    border: `1px solid ${msg.type === 'success' ? 'rgba(37, 99, 235, 0.35)' : 'rgba(239,68,68,0.3)'}`,
    color: msg.type === 'success' ? '#2563eb' : '#ef4444',
    fontWeight: '700', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8, animation: 'slideUp 0.3s ease',
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', alignItems: 'start' }}>
      {/* Personal info card */}
      <div className="dashboard-card-ps" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ height: '120px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.8) 0%, rgba(59,130,246,0.8) 100%)' }} />
        <div style={{ padding: '0 32px 32px 32px', marginTop: '-40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#0f172a',
              backgroundImage: `url(${avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.nombre || user?.name || 'U')}&background=0f172a&color=fff&size=150`})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)', border: '3px solid #2563eb',
            }} />
            <div>
              <label htmlFor="profile-pic" className="btn-secondary-ps" style={{ padding: '8px 16px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                Cambiar Foto
              </label>
              <input type="file" id="profile-pic" accept="image/*" style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setAvatarUrl(URL.createObjectURL(file));
                  setProfileMsg({ type: 'success', text: 'Foto actualizada correctamente' });
                  try {
                    const { url } = await api.uploadImage(file);
                    await api.updateAvatar(url);
                    setAvatarUrl(url);
                    localStorage.setItem('playspot-avatar', url);
                  } catch { /* preview ya visible */ }
                }} />
            </div>
          </div>
          <h3 style={{ margin: '0 0 4px 0', color: C.textPrimary, fontSize: '1.4rem', fontWeight: '800' }}>Información Personal</h3>
          <p style={{ margin: '0 0 24px 0', color: C.textSecondary, fontSize: '0.95rem' }}>Actualiza tus datos y cómo te ven los demás.</p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setProfileSaving(true); setProfileMsg(null);
            try {
              await api.updateMe({ nombre: profileData.nombre, telefono: profileData.telefono });
              setProfileMsg({ type: 'success', text: '¡Perfil actualizado con éxito!' });
            } catch (err) {
              setProfileMsg({ type: 'error', text: err.message || 'Error al guardar' });
            } finally { setProfileSaving(false); }
          }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary }}>Nombre Completo</label>
                <input type="text" value={profileData.nombre} onChange={e => setProfileData(p => ({ ...p, nombre: e.target.value }))} className="modal-ps-input" required />
              </div>
              <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary }}>Teléfono</label>
                <input type="tel" value={profileData.telefono} onChange={e => setProfileData(p => ({ ...p, telefono: e.target.value }))} className="modal-ps-input" />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary }}>Correo Electrónico</label>
              <input type="email" value={user?.email || ''} className="modal-ps-input" disabled style={{ opacity: 0.6 }} />
            </div>
            {profileMsg && <div style={msgStyle(profileMsg)}><i className={`bi ${profileMsg.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`} />{profileMsg.text}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="submit" className="btn-primary-ps" style={{ padding: '12px 24px' }} disabled={profileSaving}>
                {profileSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Security card */}
      <div className="dashboard-card-ps" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 style={{ margin: 0, color: C.textPrimary, fontSize: '1.4rem', fontWeight: '800' }}>Seguridad</h3>
          </div>
          <p style={{ margin: '0 0 24px 0', color: C.textSecondary, fontSize: '0.95rem' }}>Protege tu cuenta con una contraseña segura.</p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setPwdSaving(true); setPwdMsg(null);
            try {
              await api.changePassword(pwdData);
              setPwdMsg({ type: 'success', text: 'Contraseña actualizada correctamente' });
              setPwdData({ contrasenaActual: '', nuevaContrasena: '', confirmarContrasena: '' });
            } catch (err) {
              setPwdMsg({ type: 'error', text: err.message || 'Error al cambiar contraseña' });
            } finally { setPwdSaving(false); }
          }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary }}>Contraseña Actual</label>
              <input type="password" required className="modal-ps-input" placeholder="••••••••" value={pwdData.contrasenaActual} onChange={e => setPwdData(p => ({ ...p, contrasenaActual: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary }}>Nueva Contraseña</label>
                <input type="password" required minLength="8" className="modal-ps-input" placeholder="••••••••" value={pwdData.nuevaContrasena} onChange={e => setPwdData(p => ({ ...p, nuevaContrasena: e.target.value }))} />
              </div>
              <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', color: C.textSecondary }}>Confirmar Nueva</label>
                <input type="password" required minLength="8" className="modal-ps-input" placeholder="••••••••" value={pwdData.confirmarContrasena} onChange={e => setPwdData(p => ({ ...p, confirmarContrasena: e.target.value }))} />
              </div>
            </div>
            {pwdMsg && <div style={msgStyle(pwdMsg)}><i className={`bi ${pwdMsg.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`} />{pwdMsg.text}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: C.infoBg, padding: '16px', borderRadius: '12px', border: `1px dashed ${C.infoBorder}` }}>
              <span style={{ fontSize: '0.85rem', color: C.textSecondary, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}><span style={{ color: '#2563eb', fontSize: '1.2rem' }}>✓</span> Mínimo 8 caracteres</span>
              <span style={{ fontSize: '0.85rem', color: C.textSecondary, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}><span style={{ color: '#2563eb', fontSize: '1.2rem' }}>✓</span> Al menos un número y un símbolo especial</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="submit" className="btn-dark-ps" style={{ padding: '12px 24px' }} disabled={pwdSaving}>
                {pwdSaving ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerfilTab;
