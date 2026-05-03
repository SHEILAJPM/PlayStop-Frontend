import { useState } from 'react';
import { DashboardLayout, MetricCard } from './DashboardLayout.jsx';

const JugadorDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Inicio');

  const [modal, setModal] = useState({ show: false, action: null, payload: null });
  const openModal = (action, payload = null) => setModal({ show: true, action, payload });
  const closeModal = () => setModal({ show: false, action: null, payload: null });

  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <>
    <DashboardLayout user={user} onLogout={onLogout} title={activeTab === 'Inicio' ? 'Mi Resumen Deportivo' : activeTab} activeTab={activeTab} onTabChange={setActiveTab} menuItems={[
      { icon: '🏠', label: 'Inicio' },
      { icon: '🔍', label: 'Buscar Canchas' },
      { icon: '📅', label: 'Mis Reservas' },
      { icon: '👥', label: 'Mis Amigos' },
    ]}>
      {activeTab === 'Inicio' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '30px' }}>
            <MetricCard title="Próximo Partido" value="Hoy, 8:00 PM" subtitle="Fútbol 7 • Cancha El Clásico" color="#3b82f6" trend="up" />
            <MetricCard title="Puntos PlayStop" value="1,250 pts" subtitle="Tienes S/ 15 de descuento" color="#00d084" trend="up" />
            <MetricCard title="Partidos Jugados" value="24" subtitle="Este mes llevas 3" color="#f59e0b" />
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Canchas recomendadas para ti</h3>
              <span style={{ color: '#3b82f6', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>Ver todas →</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {[
                { img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80', name: 'Cancha El Clásico', type: 'Fútbol 7 • Sintética', price: 'S/ 80', rating: '4.9' },
                { img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&q=80', name: 'Pádel Center Surco', type: 'Pádel • Cristal', price: 'S/ 60', rating: '4.7' },
                { img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80', name: 'Tenis Club San Isidro', type: 'Tenis • Arcilla', price: 'S/ 100', rating: '5.0' },
              ].map((cancha, i) => (
                <div key={i} className="card-hover" style={{ backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                  <div style={{ height: '160px', backgroundImage: `url(${cancha.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>{cancha.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#047857', backgroundColor: '#d1fae5', padding: '4px 8px', borderRadius: '8px', fontWeight: '800' }}>⭐ {cancha.rating}</span>
                    </div>
                    <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>{cancha.type}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0f172a' }}>{cancha.price}<span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>/hora</span></span>
                      <button onClick={() => openModal('RESERVAR_CANCHA', cancha)} className="action-btn" style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Reservar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {activeTab !== 'Inicio' && (
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
                Confirmar Reserva
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                Estás a punto de reservar <strong>{modal.payload?.name}</strong>.
              </p>
            </div>
            <button onClick={closeModal} className="modal-close" style={{ background: 'transparent', border: 'none', fontSize: '1.75rem', cursor: 'pointer', color: '#94a3b8', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', marginTop: '-4px' }}>&times;</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha y Hora</label>
              <input type="datetime-local" className="modal-input" required style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
            </div>

            <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '600', color: '#475569' }}>Total a pagar:</span>
              <span style={{ fontWeight: '900', color: '#0f172a', fontSize: '1.1rem' }}>{modal.payload?.price}</span>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
              <button type="button" onClick={closeModal} className="modal-btn-cancel" style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                Cancelar
              </button>
              <button type="submit" className="modal-btn-submit" style={{ flex: 1, padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#00d084', color: '#fff', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                Confirmar Reserva
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default JugadorDashboard;