import { useState } from 'react';
import { DashboardLayout, MetricCard } from './DashboardLayout.jsx';

const AdminDashboard = ({ user, onLogout, darkMode, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('Resumen');
  const [ticketFilter, setTicketFilter] = useState('Todos los estados');
  const [userSearch, setUserSearch] = useState('');
  const [clubSearch, setClubSearch] = useState('');

  // Estado para manejar el CRUD de los Clubes
  const [clubes, setClubes] = useState([
    { id: 1, name: 'DeporPlaza Miraflores', location: 'Lima, Perú', plan: 'PRO' },
    { id: 2, name: 'Canchas del Norte', location: 'Trujillo, Perú', plan: 'Básico' },
  ]);

  // Estado simulado para Usuarios
  const [usuarios] = useState([
    { id: 1, name: 'Martín Fernández', email: 'martin@example.com', role: 'Jugador', status: 'Activo' },
    { id: 2, name: 'Lucía Gómez', email: 'lucia@playstop.com', role: 'Propietario', status: 'Activo' },
    { id: 3, name: 'Carlos Ramírez', email: 'carlos@demo.com', role: 'Jugador', status: 'Suspendido' },
    { id: 4, name: 'Valeria Castro', email: 'valeria@test.com', role: 'Jugador', status: 'Activo' },
  ]);

  // Estado simulado para Tickets de Soporte
  const [tickets] = useState([
    { id: 'TCK-001', user: 'Lucía Gómez', subject: 'Problema con pago de reserva', status: 'Abierto', priority: 'Alta', date: 'Hoy, 10:30' },
    { id: 'TCK-002', user: 'Martín Fernández', subject: 'Error al añadir amigos', status: 'En Progreso', priority: 'Media', date: 'Ayer, 15:45' },
    { id: 'TCK-003', user: 'DeporPlaza Miraflores', subject: 'Actualización de cuenta bancaria', status: 'Cerrado', priority: 'Baja', date: '24 Oct, 09:15' },
  ]);

  // Estado del Modal
  const [modal, setModal] = useState({ show: false, action: null, payload: null });
  const openModal = (action, payload = null) => setModal({ show: true, action, payload });
  const closeModal = () => setModal({ show: false, action: null, payload: null });

  const filteredTickets = tickets.filter(t => {
    if (ticketFilter === 'Todos los estados') return true;
    return t.status === ticketFilter;
  });

  const filteredUsuarios = usuarios.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredClubes = clubes.filter(c => 
    c.name.toLowerCase().includes(clubSearch.toLowerCase()) || 
    c.location.toLowerCase().includes(clubSearch.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    switch(modal.action) {
      case 'AGREGAR_CLUB':
        setClubes([...clubes, { id: Date.now(), name: fd.get('name'), location: fd.get('location') || 'Desconocida', plan: fd.get('plan') }]);
        break;
      case 'EDITAR_CLUB':
        setClubes(clubes.map(c => c.id === modal.payload.id ? { ...c, plan: fd.get('plan') } : c));
        break;
      case 'ELIMINAR_CLUB':
        setClubes(clubes.filter(c => c.id !== modal.payload.id));
        break;
      default: break;
    }
    closeModal();
  };

  return (
    <>
    <DashboardLayout user={user} onLogout={onLogout} darkMode={darkMode} toggleTheme={toggleTheme} title={activeTab === 'Resumen' ? 'Administración Central' : activeTab} activeTab={activeTab} onTabChange={setActiveTab} menuItems={[
      { icon: '⚡', label: 'Resumen' },
      { icon: '🏢', label: 'Clubes Afiliados' },
      { icon: '🧑', label: 'Usuarios' },
      { icon: '🎧', label: 'Soporte y Tickets' },
      { icon: '👤', label: 'Mi Perfil' },
    ]}>
      {activeTab === 'Resumen' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '30px' }}>
            <MetricCard title="Nuevos Clubes" value="12" subtitle="Pendientes de aprobación" color="#f59e0b" trend="up" />
            <MetricCard title="Usuarios Activos" value="4,521" subtitle="8% más esta semana" color="#00d084" trend="up" />
            <MetricCard title="Tickets Abiertos" value="5" subtitle="3 de prioridad alta" color="#ef4444" trend="down" />
          </div>
          
          <div className="dashboard-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: '800' }}>Solicitudes de Clubes</h3>
              <button onClick={() => openModal('AGREGAR_CLUB')} className="action-btn btn-primary-dark" style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(15,23,42,0.2)' }}>+ Registrar Club</button>
            </div>
            
            {/* Simulación de Tabla Admin */}
            <div style={{ overflowX: 'auto', padding: '10px 0' }}>
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Complejo Deportivo</th>
                    <th>Ubicación</th>
                    <th>Plan Solicitado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {clubes.map((row) => (
                    <tr key={row.id} className="table-row">
                      <td style={{ fontWeight: '700', color: '#0f172a' }}>{row.name}</td>
                      <td style={{ color: '#475569' }}>{row.location}</td>
                      <td><span className="status-badge" style={{ color: '#3b82f6', backgroundColor: '#eff6ff' }}>{row.plan}</span></td>
                      <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button onClick={() => openModal('EDITAR_CLUB', row)} className="action-btn btn-edit" style={{ backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Editar</button>
                        <button onClick={() => openModal('ELIMINAR_CLUB', row)} className="action-btn btn-delete" style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {activeTab === 'Clubes Afiliados' && (
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Directorio de Clubes</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
               <input type="text" value={clubSearch} onChange={(e) => setClubSearch(e.target.value)} placeholder="Buscar club..." className="modal-input" style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
               <button onClick={() => openModal('AGREGAR_CLUB')} className="action-btn btn-primary-dark" style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>+ Añadir Club</button>
            </div>
          </div>
          <div style={{ overflowX: 'auto', padding: '10px 0' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Complejo Deportivo</th>
                  <th>Ubicación</th>
                  <th>Plan Actual</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredClubes.map((row) => (
                  <tr key={row.id} className="table-row">
                    <td style={{ fontWeight: '700', color: '#0f172a' }}>{row.name}</td>
                    <td style={{ color: '#475569' }}>{row.location}</td>
                    <td><span className="status-badge" style={{ color: row.plan === 'PRO' ? '#047857' : '#3b82f6', backgroundColor: row.plan === 'PRO' ? '#d1fae5' : '#eff6ff' }}>{row.plan}</span></td>
                    <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button onClick={() => openModal('EDITAR_CLUB', row)} className="action-btn btn-edit" style={{ backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Editar</button>
                      <button onClick={() => openModal('ELIMINAR_CLUB', row)} className="action-btn btn-delete" style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Usuarios' && (
        <div className="dashboard-card">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Gestión de Usuarios</h3>
            <input type="text" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Buscar por nombre o correo..." className="modal-input" style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', minWidth: '250px' }} />
          </div>
          <div style={{ overflowX: 'auto', padding: '10px 0' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map(u => (
                  <tr key={u.id} className="table-row">
                    <td style={{ fontWeight: '700', color: '#0f172a' }}>{u.name}</td>
                    <td style={{ color: '#475569' }}>{u.email}</td>
                    <td><span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: u.role==='Propietario'?'#e0e7ff':'#f1f5f9', color: u.role==='Propietario'?'#1d4ed8':'#475569' }}>{u.role}</span></td>
                    <td><span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: u.status==='Activo'?'#d1fae5':'#fee2e2', color: u.status==='Activo'?'#047857':'#ef4444' }}>{u.status}</span></td>
                    <td>
                      <button onClick={() => alert('Función de suspensión en desarrollo')} className="action-btn btn-secondary" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', color: '#475569' }}>Suspender</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Soporte y Tickets' && (
         <div className="dashboard-card">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Bandeja de Soporte</h3>
            <select value={ticketFilter} onChange={(e) => setTicketFilter(e.target.value)} className="modal-input" style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', cursor: 'pointer' }}>
              <option value="Todos los estados">Todos los estados</option>
              <option value="Abierto">Abiertos</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Cerrado">Cerrados</option>
            </select>
          </div>
          <div style={{ overflowX: 'auto', padding: '10px 0' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>ID Ticket</th>
                  <th>Asunto</th>
                  <th>Usuario / Club</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                 {filteredTickets.map(t => (
                  <tr key={t.id} className="table-row">
                    <td style={{ fontWeight: '700', color: '#64748b' }}>{t.id}</td>
                    <td style={{ fontWeight: '700', color: '#0f172a' }}>{t.subject}</td>
                    <td style={{ color: '#475569' }}>{t.user}</td>
                    <td><span style={{ color: t.priority==='Alta'?'#ef4444':t.priority==='Media'?'#f59e0b':'#10b981', fontWeight: '800', fontSize: '0.85rem' }}>{t.priority}</span></td>
                    <td><span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: t.status==='Abierto'?'#fee2e2':t.status==='En Progreso'?'#fef3c7':'#f1f5f9', color: t.status==='Abierto'?'#ef4444':t.status==='En Progreso'?'#b45309':'#64748b' }}>{t.status}</span></td>
                    <td>
                      <button onClick={() => alert('Chat de soporte en desarrollo')} className="action-btn btn-edit" style={{ backgroundColor: '#eff6ff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', color: '#3b82f6' }}>Responder</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
         </div>
      )}

      {activeTab === 'Mi Perfil' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', alignItems: 'start' }}>
          <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '120px', background: 'linear-gradient(135deg, rgba(0, 208, 132, 0.8) 0%, rgba(59, 130, 246, 0.8) 100%)' }}></div>
            <div style={{ padding: '0 32px 32px 32px', marginTop: '-40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e2e8f0', backgroundImage: `url(https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0f172a&color=fff&size=150)`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}></div>
                <div>
                  <label htmlFor="profile-pic" className="action-btn btn-secondary" style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    Cambiar Foto
                  </label>
                  <input type="file" id="profile-pic" accept="image/*" style={{ display: 'none' }} onChange={() => alert('Foto seleccionada exitosamente.')} />
                </div>
              </div>
              <h3 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '1.4rem', fontWeight: '800' }}>Información Personal</h3>
              <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '0.95rem' }}>Actualiza tus datos y cómo te ven los demás.</p>

              <form onSubmit={(e) => { e.preventDefault(); alert('Perfil actualizado con éxito'); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155' }}>Nombre Completo</label>
                    <input type="text" defaultValue={user?.name} className="modal-input" required style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155' }}>Teléfono</label>
                    <input type="tel" defaultValue="+51 987 654 321" className="modal-input" style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155' }}>Correo Electrónico</label>
                  <input type="email" defaultValue={user?.email} className="modal-input" required style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button type="submit" className="action-btn btn-primary-dark" style={{ backgroundColor: '#00d084', color: '#0f172a', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>Guardar Cambios</button>
                </div>
              </form>
            </div>
          </div>

          <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.4rem', fontWeight: '800' }}>Seguridad</h3>
              </div>
              <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '0.95rem' }}>Protege tu cuenta con una contraseña segura.</p>
              
              <form onSubmit={(e) => { e.preventDefault(); alert('Contraseña actualizada con éxito'); e.target.reset(); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155' }}>Contraseña Actual</label>
                  <input type="password" required className="modal-input" placeholder="••••••••" style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155' }}>Nueva Contraseña</label>
                    <input type="password" required minLength="6" className="modal-input" placeholder="••••••••" style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155' }}>Confirmar Nueva</label>
                    <input type="password" required minLength="6" className="modal-input" placeholder="••••••••" style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
                  </div>
                </div>
                
                <div className="modal-info-box" style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <span style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}><span style={{ color: '#00d084', fontSize: '1.2rem' }}>✓</span> Mínimo 8 caracteres</span>
                  <span style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}><span style={{ color: '#00d084', fontSize: '1.2rem' }}>✓</span> Al menos un número y un símbolo especial</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button type="submit" className="action-btn btn-primary-dark" style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>Actualizar Contraseña</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>

    {/* MODAL GLOBAL DEL DASHBOARD */}
    {modal.show && (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease' }}>
        <style>
          {`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            .modal-input:focus { border-color: #00d084 !important; box-shadow: 0 0 0 4px rgba(0, 208, 132, 0.15) !important; outline: none; background-color: #ffffff !important; }
            .modal-btn-cancel:hover { background-color: #e2e8f0 !important; color: #0f172a !important; }
            .modal-btn-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 208, 132, 0.3); background-color: #00b875 !important; }
            .modal-btn-delete:hover { background-color: #dc2626 !important; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3); }
            .modal-close:hover { background-color: #f1f5f9; color: #ef4444 !important; }
          `}
        </style>
        <div className="dashboard-modal" style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '28px', width: '90%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
                {modal.action?.includes('AGREGAR') ? 'Registrar Nuevo Club' : modal.action?.includes('EDITAR') ? 'Editar Información' : 'Confirmar Acción'}
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                {modal.action?.includes('AGREGAR') ? 'Ingresa los datos del nuevo complejo deportivo.' : modal.action?.includes('EDITAR') ? 'Actualiza los datos del club seleccionado.' : 'Por favor, confirma si deseas proceder con esta acción.'}
              </p>
            </div>
            <button onClick={closeModal} className="modal-close" style={{ background: 'transparent', border: 'none', fontSize: '1.75rem', cursor: 'pointer', color: '#94a3b8', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', marginTop: '-4px' }}>&times;</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {modal.action === 'AGREGAR_CLUB' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre del Complejo</label>
                  <input name="name" className="modal-input" required placeholder="Ej. DeporPlaza Miraflores" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ubicación Completa</label>
                  <input name="location" className="modal-input" required placeholder="Ej. Av. Larco 123, Miraflores, Lima" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Plan de Suscripción</label>
                  <select name="plan" className="modal-input" required style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s', cursor: 'pointer' }}>
                    <option value="Básico">Plan Básico</option>
                    <option value="PRO">Plan PRO</option>
                  </select>
                </div>
              </>
            )}

            {modal.action === 'EDITAR_CLUB' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actualizar Plan</label>
                <select name="plan" className="modal-input" required defaultValue={modal.payload?.plan} style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s', cursor: 'pointer' }}>
                  <option value="Básico">Plan Básico</option>
                  <option value="PRO">Plan PRO</option>
                </select>
              </div>
            )}

            {modal.action === 'ELIMINAR_CLUB' && (
              <div className="modal-warning" style={{ padding: '20px', backgroundColor: '#fef2f2', borderRadius: '16px', border: '1px solid #fecaca' }}>
                <p style={{ margin: 0, color: '#991b1b', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  ¿Estás seguro de eliminar el club <strong style={{ color: '#7f1d1d' }}>{modal.payload?.name}</strong> de forma permanente?<br/><br/>
                  Esta acción eliminará todos sus datos y <span style={{ textDecoration: 'underline' }}>no se puede deshacer</span>.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
              <button type="button" onClick={closeModal} className="modal-btn-cancel" style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                Cancelar
              </button>
              <button type="submit" className={modal.action?.includes('ELIMINAR') ? 'modal-btn-delete' : 'modal-btn-submit'} style={{ flex: 1, padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: modal.action?.includes('ELIMINAR') ? '#ef4444' : '#00d084', color: '#fff', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                {modal.action?.includes('ELIMINAR') ? 'Sí, eliminar club' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default AdminDashboard;