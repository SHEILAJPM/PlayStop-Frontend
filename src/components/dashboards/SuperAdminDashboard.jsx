import { useState } from 'react';
import { DashboardLayout, MetricCard } from './DashboardLayout.jsx';

const SuperAdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Global');

  const [modal, setModal] = useState({ show: false, action: null, payload: null });
  const openModal = (action, payload = null) => setModal({ show: true, action, payload });
  const closeModal = () => setModal({ show: false, action: null, payload: null });

  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <>
    <DashboardLayout user={user} onLogout={onLogout} title={activeTab === 'Global' ? 'Centro de Control (Root)' : activeTab} activeTab={activeTab} onTabChange={setActiveTab} menuItems={[
      { icon: '👑', label: 'Global' },
      { icon: '📈', label: 'Métricas Financieras' },
      { icon: '⚙️', label: 'Configuración del Sistema' },
      { icon: '🛡️', label: 'Seguridad y Logs' },
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
            <div style={{ flex: '2 1 400px', backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: '0', color: '#0f172a', fontSize: '1.2rem', fontWeight: '800' }}>Crecimiento de Ingresos</h3>
            <button onClick={() => openModal('DESCARGAR_REPORTE')} className="action-btn" style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(15,23,42,0.2)' }}>Descargar Reporte</button>
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
            <div style={{ flex: '1 1 300px', backgroundColor: '#0f172a', borderRadius: '20px', padding: '24px', border: '1px solid #1e293b', boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.5)' }}>
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
      {activeTab !== 'Global' && (
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
            .modal-close:hover { background-color: #f1f5f9; color: #ef4444 !important; }
          `}
        </style>
        <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '28px', width: '90%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
                Exportar Reporte
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                Selecciona el formato para descargar el reporte financiero actual.
              </p>
            </div>
            <button onClick={closeModal} className="modal-close" style={{ background: 'transparent', border: 'none', fontSize: '1.75rem', cursor: 'pointer', color: '#94a3b8', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', marginTop: '-4px' }}>&times;</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Formato de archivo</label>
              <select className="modal-input" required style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s', cursor: 'pointer' }}>
                <option value="pdf">Documento PDF (.pdf)</option>
                <option value="csv">Hoja de Cálculo (.csv)</option>
                <option value="json">Archivo JSON (.json)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
              <button type="button" onClick={closeModal} className="modal-btn-cancel" style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                Cancelar
              </button>
              <button type="submit" className="modal-btn-submit" style={{ flex: 1, padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#00d084', color: '#fff', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                Descargar
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