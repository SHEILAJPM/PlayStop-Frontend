import { useState } from 'react';
import { DashboardLayout, MetricCard } from './DashboardLayout.jsx';

const SuperAdminDashboard = ({ user, onLogout, darkMode, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('Global');
  const [logSearch, setLogSearch] = useState('');

  // Mock Data para Métricas Financieras
  const [transactions] = useState([
    { id: 'SUB-1029', club: 'DeporPlaza Miraflores', amount: '$ 120.00', plan: 'PRO', date: '24 Oct 2023', status: 'Completado' },
    { id: 'SUB-1030', club: 'Canchas del Norte', amount: '$ 40.00', plan: 'Básico', date: '23 Oct 2023', status: 'Completado' },
    { id: 'SUB-1031', club: 'Pádel Center Surco', amount: '$ 120.00', plan: 'PRO', date: '22 Oct 2023', status: 'Pendiente' },
    { id: 'SUB-1032', club: 'Tenis Club San Isidro', amount: '$ 120.00', plan: 'PRO', date: '21 Oct 2023', status: 'Completado' },
  ]);

  // Mock Data para Seguridad y Logs
  const [logs] = useState([
    { id: 1, time: '10:45:21', level: 'INFO', user: 'system', action: 'Database backup completed automatically.' },
    { id: 2, time: '10:48:02', level: 'ERROR', user: 'api_gateway', action: 'Payment gateway timeout for transaction TRX-992.' },
    { id: 3, time: '10:50:11', level: 'INFO', user: 'admin_root', action: 'Deployed new version v2.4.1 to production.' },
    { id: 4, time: '10:55:09', level: 'WARN', user: 'monitor', action: 'High memory usage detected on node-3 (85%).' },
    { id: 5, time: '11:01:23', level: 'INFO', user: 'auth_service', action: 'Abnormal login spike detected (+45 users in 1 min).' },
  ]);

  // Mock Data para Gestión de Planes
  const [planes] = useState([
    { id: 1, name: 'Básico', type: 'Freemium', price: 'S/ 0', fee: '3.5%', status: 'Activo' },
    { id: 2, name: 'PRO', type: 'Suscripción', price: 'S/ 150/mes', fee: '1.5%', status: 'Activo' },
    { id: 3, name: 'Enterprise', type: 'Personalizado', price: 'A Medida', fee: '1.0%', status: 'Borrador' }
  ]);

  // Mock Data para Integraciones API
  const [integrations] = useState([
    { id: 1, provider: 'Culqi Pasarela', category: 'Pagos', status: 'Conectado', lastSync: 'Hace 5 min' },
    { id: 2, provider: 'Twilio SMS', category: 'Notificaciones', status: 'Conectado', lastSync: 'Hace 1 hora' },
    { id: 3, provider: 'SendGrid', category: 'Correos Automáticos', status: 'Conectado', lastSync: 'Hace 2 min' },
    { id: 4, provider: 'AWS S3', category: 'Almacenamiento', status: 'Error', lastSync: 'Hace 2 días' }
  ]);

  // Mock Data para Promociones
  const [promociones] = useState([
    { id: 1, code: 'PLAYSTOP20', type: 'Descuento', value: '20%', usage: '342 / 500', status: 'Activo' },
    { id: 2, code: 'BIENVENIDA', type: 'Crédito', value: 'S/ 15.00', usage: '1205 / ∞', status: 'Activo' },
    { id: 3, code: 'INVIERNO', type: 'Descuento', value: '10%', usage: '500 / 500', status: 'Agotado' }
  ]);

  // Mock Data para CMS
  const [contenidos] = useState([
    { id: 1, title: '5 Consejos para mejorar tu saque en Pádel', category: 'Blog', author: 'Equipo PlayStop', status: 'Publicado' },
    { id: 2, title: 'Torneo Nacional 2024', category: 'Evento', author: 'Marketing', status: 'Borrador' },
    { id: 3, title: 'Términos y Condiciones actualizados', category: 'Legal', author: 'Legal', status: 'Publicado' }
  ]);

  const [modal, setModal] = useState({ show: false, action: null, payload: null });
  const openModal = (action, payload = null) => setModal({ show: true, action, payload });
  const closeModal = () => setModal({ show: false, action: null, payload: null });

  const filteredLogs = logs.filter(l => l.action.toLowerCase().includes(logSearch.toLowerCase()) || l.level.toLowerCase().includes(logSearch.toLowerCase()) || l.user.toLowerCase().includes(logSearch.toLowerCase()));

  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <>
    <DashboardLayout user={user} onLogout={onLogout} darkMode={darkMode} toggleTheme={toggleTheme} title={activeTab === 'Global' ? 'Centro de Control (Root)' : activeTab} activeTab={activeTab} onTabChange={setActiveTab} menuItems={[
      { icon: '👑', label: 'Global' },
      { icon: '📈', label: 'Métricas Financieras' },
      { icon: '💎', label: 'Gestión de Planes' },
      { icon: '📢', label: 'Promociones' },
      { icon: '📝', label: 'Contenido (CMS)' },
      { icon: '', label: 'Integraciones API' },
      { icon: '⚙️', label: 'Configuración del Sistema' },
      { icon: '🛡️', label: 'Seguridad y Logs' },
      { icon: '👤', label: 'Mi Perfil' },
    ]}>
      {activeTab === 'Global' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '30px' }}>
            <MetricCard title="MRR (Ingreso Mensual)" value="$ 45,200" subtitle="24% vs mes anterior" color="#00d084" trend="up" />
            <MetricCard title="Estado del Servidor" value="99.9%" subtitle="Todo funcionando" color="#3b82f6" trend="up" />
            <MetricCard title="Transacciones Fallidas" value="0.02%" subtitle="Salud óptima" color="#00d084" trend="down" />
            <MetricCard title="Clubes Totales" value="342" subtitle="Activos en 4 países" color="#8b5cf6" trend="up" />
          </div>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div className="dashboard-card" style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: '0', color: '#0f172a', fontSize: '1.2rem', fontWeight: '800' }}>Crecimiento de Ingresos</h3>
            <button onClick={() => openModal('DESCARGAR_REPORTE')} className="action-btn btn-primary-dark" style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(15,23,42,0.2)' }}>Descargar Reporte</button>
          </div>
              
              {/* Simulación de Gráfico Vectorial (Area Chart) */}
              <div style={{ flex: 1, minHeight: '250px', position: 'relative', borderBottom: '1px dashed #e2e8f0', borderLeft: '1px dashed #e2e8f0' }}>
                <svg viewBox="0 0 500 150" style={{ width: '100%', height: '100%', position: 'absolute', bottom: 0, left: 0 }} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(0, 208, 132, 0.4)"/>
                        <stop offset="100%" stopColor="rgba(0, 208, 132, 0)"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,150 L0,110 C50,120 100,70 150,90 C200,110 250,50 300,60 C350,70 400,30 500,20 L500,150 Z" fill="url(#mrrGrad)" />
                    <path d="M0,110 C50,120 100,70 150,90 C200,110 250,50 300,60 C350,70 400,30 500,20" fill="none" stroke="#00d084" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            
            {/* Terminal de Logs */}
            <div style={{ flex: '1 1 300px', backgroundColor: '#020617', borderRadius: '24px', padding: '28px', border: '1px solid #1e293b', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #3b82f6, #00d084)' }}></div>
              <h3 style={{ margin: '0 0 20px 0', color: '#f8fafc', fontSize: '1.2rem', fontWeight: '800' }}>System Logs</h3>
              <div style={{ fontFamily: 'monospace', color: '#34d399', fontSize: '0.85rem', lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 8px 0' }}>[10:45:21] <span style={{ color: '#60a5fa' }}>INFO:</span> Database backup completed.</p>
                <p style={{ margin: '0 0 8px 0', color: '#94a3b8' }}>[10:48:02] <span style={{ color: '#f87171' }}>ERR:</span> Payment gateway timeout.</p>
                <p style={{ margin: '0 0 8px 0' }}>[10:50:11] <span style={{ color: '#60a5fa' }}>INFO:</span> New deployment v2.4.1 OK.</p>
                <p style={{ margin: '0 0 8px 0', color: '#94a3b8' }}>[10:55:09] <span style={{ color: '#facc15' }}>WARN:</span> High memory usage node-3.</p>
                <p style={{ margin: 0 }}>[11:01:23] <span style={{ color: '#60a5fa' }}>INFO:</span> 45 new users registered.</p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'Métricas Financieras' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '30px' }}>
            <MetricCard title="Ingresos Totales (Mes)" value="$ 128,450" subtitle="15% más que mes anterior" color="#00d084" trend="up" />
            <MetricCard title="Comisiones Generadas" value="$ 14,200" subtitle="Basado en 2.5% de fee" color="#3b82f6" trend="up" />
            <MetricCard title="Suscripciones PRO" value="842" subtitle="24 nuevas esta semana" color="#8b5cf6" trend="up" />
          </div>
          <div className="dashboard-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Últimas Facturaciones a Clubes</h3>
              <button onClick={() => openModal('DESCARGAR_REPORTE')} className="action-btn btn-secondary" style={{ backgroundColor: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Exportar CSV</button>
            </div>
            <div style={{ overflowX: 'auto', padding: '10px 0' }}>
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>ID Factura</th>
                    <th>Fecha</th>
                    <th>Club</th>
                    <th>Plan</th>
                    <th>Monto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} className="table-row">
                      <td style={{ fontWeight: '700', color: '#64748b' }}>{t.id}</td>
                      <td style={{ color: '#475569' }}>{t.date}</td>
                      <td style={{ fontWeight: '700', color: '#0f172a' }}>{t.club}</td>
                      <td><span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: t.plan==='PRO'?'#ede9fe':'#f1f5f9', color: t.plan==='PRO'?'#6d28d9':'#475569' }}>{t.plan}</span></td>
                      <td style={{ fontWeight: '800', color: '#0f172a' }}>{t.amount}</td>
                      <td><span className="status-badge" style={{ backgroundColor: t.status==='Completado'?'#d1fae5':'#fef3c7', color: t.status==='Completado'?'#047857':'#b45309' }}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'Gestión de Planes' && (
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Tiers de Suscripción (SaaS)</h3>
            <button onClick={() => openModal('NUEVO_PLAN')} className="action-btn btn-primary-dark" style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>+ Crear Plan</button>
          </div>
          <div style={{ overflowX: 'auto', padding: '10px 0' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Nombre del Plan</th>
                  <th>Modelo</th>
                  <th>Precio</th>
                  <th>Fee (Comisión)</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {planes.map(p => (
                  <tr key={p.id} className="table-row">
                    <td style={{ fontWeight: '800', color: '#0f172a' }}>{p.name}</td>
                    <td style={{ color: '#64748b', fontWeight: '600' }}>{p.type}</td>
                    <td style={{ fontWeight: '700', color: '#0f172a' }}>{p.price}</td>
                    <td style={{ fontWeight: '700', color: '#047857' }}>{p.fee}</td>
                    <td><span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: p.status === 'Activo' ? '#d1fae5' : '#f1f5f9', color: p.status === 'Activo' ? '#047857' : '#64748b' }}>{p.status}</span></td>
                    <td>
                      <button onClick={() => openModal('EDITAR_PLAN', p)} className="action-btn btn-edit" style={{ backgroundColor: '#eff6ff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', color: '#3b82f6' }}>Editar Plan</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Promociones' && (
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Cupones y Campañas</h3>
            <button onClick={() => openModal('NUEVA_PROMO')} className="action-btn btn-primary-dark" style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>+ Crear Cupón</button>
          </div>
          <div style={{ overflowX: 'auto', padding: '10px 0' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Uso</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {promociones.map(p => (
                  <tr key={p.id} className="table-row">
                    <td style={{ fontWeight: '900', color: '#0f172a', letterSpacing: '1px' }}>{p.code}</td>
                    <td style={{ color: '#64748b' }}>{p.type}</td>
                    <td style={{ fontWeight: '800', color: '#00d084' }}>{p.value}</td>
                    <td style={{ color: '#475569' }}>{p.usage}</td>
                    <td><span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: p.status === 'Activo' ? '#d1fae5' : '#fee2e2', color: p.status === 'Activo' ? '#047857' : '#ef4444' }}>{p.status}</span></td>
                    <td>
                      <button onClick={() => openModal('EDITAR_PROMO', p)} className="action-btn btn-edit" style={{ backgroundColor: '#eff6ff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', color: '#3b82f6' }}>Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Contenido (CMS)' && (
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Gestor de Artículos y Páginas</h3>
            <button onClick={() => openModal('NUEVO_ARTICULO')} className="action-btn btn-primary-dark" style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>+ Escribir Post</button>
          </div>
          <div style={{ overflowX: 'auto', padding: '10px 0' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Autor</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {contenidos.map(c => (
                  <tr key={c.id} className="table-row">
                    <td style={{ fontWeight: '700', color: '#0f172a' }}>{c.title}</td>
                    <td style={{ color: '#64748b' }}>{c.category}</td>
                    <td style={{ color: '#475569' }}>{c.author}</td>
                    <td><span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: c.status === 'Publicado' ? '#d1fae5' : '#f1f5f9', color: c.status === 'Publicado' ? '#047857' : '#64748b' }}>{c.status}</span></td>
                    <td>
                      <button className="action-btn btn-edit" style={{ backgroundColor: '#eff6ff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', color: '#3b82f6' }}>Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Integraciones API' && (
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Servicios de Terceros (Webhooks & Keys)</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {integrations.map(api => (
              <div key={api.id} className="card-hover" style={{ padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: api.status === 'Conectado' ? '#10b981' : '#ef4444' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '1.1rem', fontWeight: '800' }}>{api.provider}</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{api.category}</p>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', padding: '4px 8px', borderRadius: '8px', backgroundColor: api.status === 'Conectado' ? '#d1fae5' : '#fee2e2', color: api.status === 'Conectado' ? '#047857' : '#991b1b' }}>{api.status}</span>
                </div>
                <p style={{ margin: '0 0 16px 0', color: '#94a3b8', fontSize: '0.85rem' }}>Última sincronización: {api.lastSync}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => openModal('CONFIGURAR_API', api)} className="action-btn btn-secondary" style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: '700', cursor: 'pointer' }}>Configurar</button>
                  <button onClick={() => alert('Generando nuevos tokens de acceso...')} className="action-btn btn-secondary" style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#ef4444', fontWeight: '700', cursor: 'pointer' }}>Rotar Keys</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Configuración del Sistema' && (
        <div className="dashboard-card" style={{ maxWidth: '800px' }}>
          <h3 style={{ margin: '0 0 24px 0', color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Ajustes Globales</h3>
          <form onSubmit={(e) => { e.preventDefault(); openModal('GUARDAR_CONFIG'); }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155' }}>Comisión por Reserva (%)</label>
                  <input type="number" step="0.1" defaultValue="2.5" className="modal-input" style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155' }}>Días de Prueba Gratis (Clubes)</label>
                  <input type="number" defaultValue="14" className="modal-input" style={{ padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                </div>
              </div>
              <div className="modal-warning" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', padding: '20px', backgroundColor: '#fef2f2', borderRadius: '16px', border: '1px dashed #fca5a5' }}>
                <input type="checkbox" id="maintenance" style={{ width: '22px', height: '22px', accentColor: '#ef4444', cursor: 'pointer' }} />
                <label htmlFor="maintenance" style={{ fontWeight: '700', color: '#991b1b', cursor: 'pointer', fontSize: '1.05rem' }}>Activar Modo Mantenimiento <span style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', color: '#b91c1c' }}>(Desactiva temporalmente el acceso a jugadores y clubes)</span></label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="action-btn btn-primary-dark" style={{ backgroundColor: '#00d084', color: '#0f172a', border: 'none', padding: '14px 28px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>Guardar Configuración</button>
              </div>
          </form>
        </div>
      )}

      {activeTab === 'Seguridad y Logs' && (
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Registro de Auditoría (Audit Trail)</h3>
            <input type="text" value={logSearch} onChange={(e) => setLogSearch(e.target.value)} placeholder="Buscar en logs (ej. error)..." className="modal-input" style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', minWidth: '250px' }} />
          </div>
          <div style={{ overflowX: 'auto', padding: '10px 0' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Nivel</th>
                  <th>Usuario / Servicio</th>
                  <th>Acción Registrada</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(l => (
                  <tr key={l.id} className="table-row">
                    <td style={{ fontWeight: '600', color: '#64748b' }}>{l.time}</td>
                    <td>
                      <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', backgroundColor: l.level === 'INFO' ? '#eff6ff' : l.level === 'WARN' ? '#fef3c7' : '#fee2e2', color: l.level === 'INFO' ? '#3b82f6' : l.level === 'WARN' ? '#d97706' : '#ef4444' }}>
                        {l.level}
                      </span>
                    </td>
                    <td style={{ color: '#475569', fontWeight: '600' }}>{l.user}</td>
                    <td style={{ color: '#0f172a' }}>{l.action}</td>
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
            .modal-close:hover { background-color: #f1f5f9; color: #ef4444 !important; }
          `}
        </style>
        <div className="dashboard-modal" style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '28px', width: '90%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
                {modal.action === 'GUARDAR_CONFIG' ? 'Confirmar Ajustes' : modal.action === 'NUEVO_PLAN' || modal.action === 'EDITAR_PLAN' ? 'Configurar Plan' : modal.action === 'CONFIGURAR_API' ? 'Configuración de API' : modal.action?.includes('PROMO') ? 'Configurar Cupón' : modal.action === 'NUEVO_ARTICULO' ? 'Nuevo Artículo' : 'Exportar Reporte'}
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                {modal.action === 'GUARDAR_CONFIG' ? 'Asegúrate de revisar los cambios antes de aplicar.' : modal.action === 'NUEVO_PLAN' || modal.action === 'EDITAR_PLAN' ? 'Define las características y precios del tier.' : modal.action === 'CONFIGURAR_API' ? `Establece los webhooks y keys para ${modal.payload?.provider}.` : modal.action?.includes('PROMO') ? 'Establece el código, descuento y límite de uso.' : modal.action === 'NUEVO_ARTICULO' ? 'Redacta un nuevo post para el CMS.' : 'Selecciona el formato para descargar el reporte financiero actual.'}
              </p>
            </div>
            <button onClick={closeModal} className="modal-close" style={{ background: 'transparent', border: 'none', fontSize: '1.75rem', cursor: 'pointer', color: '#94a3b8', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', marginTop: '-4px' }}>&times;</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {modal.action === 'GUARDAR_CONFIG' ? (
              <div className="modal-info-box" style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  ¿Estás seguro de aplicar estos cambios globales? Esto afectará a todos los clubes y usuarios de la plataforma inmediatamente.
                </p>
              </div>
            ) : modal.action === 'NUEVO_PLAN' || modal.action === 'EDITAR_PLAN' ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre del Tier</label>
                  <input type="text" defaultValue={modal.payload?.name} className="modal-input" required placeholder="Ej. Pro Plus" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Precio Mensual</label>
                    <input type="text" defaultValue={modal.payload?.price} className="modal-input" required placeholder="S/ 0.00" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Comisión (%)</label>
                    <input type="text" defaultValue={modal.payload?.fee} className="modal-input" required placeholder="Ej. 2.5%" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem' }} />
                  </div>
                </div>
              </>
            ) : modal.action === 'CONFIGURAR_API' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>API Key / Secret</label>
                <input type="password" defaultValue="************************" className="modal-input" required style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem' }} />
              </div>
            ) : modal.action?.includes('PROMO') ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Código Promocional</label>
                  <input type="text" defaultValue={modal.payload?.code} className="modal-input" required placeholder="Ej. PLAYSTOP20" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', textTransform: 'uppercase' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Valor</label>
                    <input type="text" defaultValue={modal.payload?.value} className="modal-input" required placeholder="Ej. 20% o S/ 15" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem' }} />
                  </div>
                </div>
              </div>
            ) : modal.action === 'NUEVO_ARTICULO' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Título del Artículo</label>
                <input type="text" className="modal-input" required placeholder="Escribe el título aquí..." style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem' }} />
              </div>
            ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Formato de archivo</label>
              <select className="modal-input" required style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s', cursor: 'pointer' }}>
                <option value="pdf">Documento PDF (.pdf)</option>
                <option value="csv">Hoja de Cálculo (.csv)</option>
                <option value="json">Archivo JSON (.json)</option>
              </select>
            </div>
            )}

            <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
              <button type="button" onClick={closeModal} className="modal-btn-cancel" style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                Cancelar
              </button>
              <button type="submit" className="modal-btn-submit" style={{ flex: 1, padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#00d084', color: '#fff', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                {modal.action === 'GUARDAR_CONFIG' ? 'Aplicar Cambios' : modal.action === 'NUEVO_PLAN' || modal.action === 'EDITAR_PLAN' || modal.action === 'CONFIGURAR_API' || modal.action?.includes('PROMO') ? 'Guardar Cambios' : modal.action === 'NUEVO_ARTICULO' ? 'Crear Borrador' : 'Descargar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default SuperAdminDashboard;