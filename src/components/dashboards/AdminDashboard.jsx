import { useState } from 'react';
import { DashboardLayout, MetricCard } from './DashboardLayout.jsx';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Resumen');

  // Estado para manejar el CRUD de los Clubes
  const [clubes, setClubes] = useState([
    { id: 1, name: 'DeporPlaza Miraflores', location: 'Lima, Perú', plan: 'PRO' },
    { id: 2, name: 'Canchas del Norte', location: 'Trujillo, Perú', plan: 'Básico' },
  ]);

  // Estado del Modal
  const [modal, setModal] = useState({ show: false, action: null, payload: null });
  const openModal = (action, payload = null) => setModal({ show: true, action, payload });
  const closeModal = () => setModal({ show: false, action: null, payload: null });

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
    <DashboardLayout user={user} onLogout={onLogout} title={activeTab === 'Resumen' ? 'Administración Central' : activeTab} activeTab={activeTab} onTabChange={setActiveTab} menuItems={[
      { icon: '⚡', label: 'Resumen' },
      { icon: '🏢', label: 'Clubes Afiliados' },
      { icon: '🧑', label: 'Usuarios' },
      { icon: '🎧', label: 'Soporte y Tickets' },
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
              <button onClick={() => openModal('AGREGAR_CLUB')} className="action-btn" style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(15,23,42,0.2)' }}>+ Registrar Club</button>
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
                        <button onClick={() => openModal('EDITAR_CLUB', row)} className="action-btn" style={{ backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Editar</button>
                        <button onClick={() => openModal('ELIMINAR_CLUB', row)} className="action-btn" style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {activeTab !== 'Resumen' && (
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '20px', textAlign: 'center', border: '1px solid #e2e8f0', marginTop: '20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚧</div>
          <h2 style={{ color: '#0f172a', margin: '0 0 10px 0' }}>Módulo en Construcción</h2>
          <p style={{ color: '#64748b', margin: 0 }}>La vista de "{activeTab}" estará disponible en la próxima actualización.</p>
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
        <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '28px', width: '90%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          
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
              <div style={{ padding: '20px', backgroundColor: '#fef2f2', borderRadius: '16px', border: '1px solid #fecaca' }}>
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