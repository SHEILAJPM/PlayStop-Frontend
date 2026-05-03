import { useState } from 'react';
import { DashboardLayout, MetricCard } from './DashboardLayout.jsx';

const PropietarioDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // Estado para manejar el CRUD de las Canchas
  const [canchas, setCanchas] = useState([
    { id: 1, img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80', name: 'Cancha 1 - Principal', type: 'Fútbol 7 • Sintética', price: 'S/ 80', status: 'Operativa', color: '#00d084' },
    { id: 2, img: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=500&q=80', name: 'Cancha 2', type: 'Fútbol 7 • Sintética', price: 'S/ 80', status: 'Operativa', color: '#00d084' },
    { id: 3, img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&q=80', name: 'Pádel A', type: 'Pádel • Cristal', price: 'S/ 60', status: 'En Mantenimiento', color: '#f59e0b' },
  ]);

  // Estado para manejar el CRUD de las Reservas
  const [reservas, setReservas] = useState([
    { id: 1, time: '18:00 - 19:00', court: 'Cancha 1 (Fútbol 7)', client: 'Juan Pérez', amount: 'S/ 80.00', status: 'Pagado', color: '#00d084', bg: '#d1fae5' },
    { id: 2, time: '19:00 - 20:00', court: 'Cancha 2 (Fútbol 7)', client: 'Carlos Ruiz', amount: 'S/ 100.00', status: 'Pendiente', color: '#f59e0b', bg: '#fef3c7' },
    { id: 3, time: '20:00 - 21:00', court: 'Cancha Padel A', client: 'Lucía Gómez', amount: 'S/ 60.00', status: 'Pagado', color: '#00d084', bg: '#d1fae5' },
  ]);

  // Estado del Modal
  const [modal, setModal] = useState({ show: false, action: null, payload: null });
  const openModal = (action, payload = null) => setModal({ show: true, action, payload });
  const closeModal = () => setModal({ show: false, action: null, payload: null });

  const handleToggleEstadoReserva = (id) => {
    setReservas(reservas.map(r => r.id === id 
      ? { ...r, status: r.status === 'Pagado' ? 'Pendiente' : 'Pagado', color: r.status === 'Pagado' ? '#f59e0b' : '#00d084', bg: r.status === 'Pagado' ? '#fef3c7' : '#d1fae5' } 
      : r));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    switch(modal.action) {
      case 'AGREGAR_CANCHA': {
        const file = fd.get('image');
        const imageUrl = file && file.size > 0 ? URL.createObjectURL(file) : 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80';
        setCanchas([...canchas, { id: Date.now(), img: imageUrl, name: fd.get('name'), type: 'Nueva Cancha', price: fd.get('price') || 'S/ 80', status: 'Operativa', color: '#00d084' }]);
        break;
      }
      case 'EDITAR_CANCHA':
        setCanchas(canchas.map(c => c.id === modal.payload.id ? { ...c, price: fd.get('price') } : c));
        break;
      case 'ELIMINAR_CANCHA':
        setCanchas(canchas.filter(c => c.id !== modal.payload.id));
        break;
      case 'AGREGAR_RESERVA':
        setReservas([...reservas, { id: Date.now(), time: fd.get('time'), court: fd.get('court'), client: fd.get('client'), amount: 'S/ 80.00', status: 'Pendiente', color: '#f59e0b', bg: '#fef3c7' }]);
        break;
      case 'EDITAR_RESERVA':
        setReservas(reservas.map(r => r.id === modal.payload.id ? { ...r, time: fd.get('time') } : r));
        break;
      case 'ELIMINAR_RESERVA':
        setReservas(reservas.filter(r => r.id !== modal.payload.id));
        break;
      default: break;
    }
    closeModal();
  };

  return (
    <>
    <DashboardLayout user={user} onLogout={onLogout} title={activeTab === 'Dashboard' ? 'Panel del Complejo' : activeTab} activeTab={activeTab} onTabChange={setActiveTab} menuItems={[
      { icon: '📊', label: 'Dashboard' },
      { icon: '📅', label: 'Calendario de Reservas' },
      { icon: '🏟️', label: 'Mis Canchas' },
      { icon: '💰', label: 'Finanzas' },
    ]}>
      {activeTab === 'Dashboard' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '30px' }}>
            <MetricCard title="Ingresos de Hoy" value="S/ 1,450" subtitle="12% más que ayer" color="#00d084" trend="up" />
            <MetricCard title="Reservas Activas" value="18" subtitle="4 pendientes de pago" color="#f59e0b" trend="down" />
            <MetricCard title="Ocupación Horaria" value="85%" subtitle="Pico a las 8:00 PM" color="#3b82f6" trend="up" />
          </div>
          
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: '800' }}>Últimas Reservas</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => openModal('AGREGAR_RESERVA')} style={{ backgroundColor: '#0f172a', border: 'none', padding: '8px 16px', borderRadius: '8px', color: '#fff', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>+ Nueva Reserva</button>
                <button onClick={() => setActiveTab('Calendario de Reservas')} style={{ backgroundColor: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '8px', color: '#475569', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Ver calendario</button>
              </div>
            </div>
            
            {/* Simulación de Tabla de Reservas */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Hora</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Cancha</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Cliente</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Monto</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Estado</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((row) => (
                    <tr key={row.id} className="table-row" style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{row.time}</td>
                      <td style={{ padding: '16px', color: '#475569' }}>{row.court}</td>
                      <td style={{ padding: '16px', color: '#475569', fontWeight: '500' }}>{row.client}</td>
                      <td style={{ padding: '16px', color: '#0f172a', fontWeight: '700' }}>{row.amount}</td>
                      <td style={{ padding: '16px', cursor: 'pointer' }} onClick={() => handleToggleEstadoReserva(row.id)} title="Clic para cambiar estado"><span style={{ color: row.color, backgroundColor: row.bg, padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800' }}>{row.status}</span></td>
                      <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                        <button onClick={() => openModal('EDITAR_RESERVA', row)} className="action-btn" style={{ backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Editar</button>
                        <button onClick={() => openModal('ELIMINAR_RESERVA', row)} className="action-btn" style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Cancelar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {activeTab === 'Calendario de Reservas' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
            <h3 style={{ margin: '0', color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Horarios de Hoy</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="action-btn" style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600', color: '#475569', transition: 'all 0.2s' }}>&lt; Ayer</button>
              <button className="action-btn" style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', backgroundColor: '#00d084', color: '#0f172a', cursor: 'pointer', fontWeight: '800', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,208,132,0.2)' }}>Hoy, 24 Oct</button>
              <button className="action-btn" style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '600', color: '#475569', transition: 'all 0.2s' }}>Mañana &gt;</button>
            </div>
          </div>
          
          {/* Simulación de Grid de Calendario */}
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: '700px', display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: '1px', backgroundColor: '#e2e8f0', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px 12px', textAlign: 'center', fontWeight: '800', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Hora</div>
              <div style={{ backgroundColor: '#ffffff', padding: '16px 12px', textAlign: 'center', fontWeight: '800', color: '#0f172a' }}>Cancha 1 (F7)</div>
              <div style={{ backgroundColor: '#ffffff', padding: '16px 12px', textAlign: 'center', fontWeight: '800', color: '#0f172a' }}>Cancha 2 (F7)</div>
              <div style={{ backgroundColor: '#ffffff', padding: '16px 12px', textAlign: 'center', fontWeight: '800', color: '#0f172a' }}>Cancha Padel A</div>

              <div style={{ backgroundColor: '#f8fafc', padding: '16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#475569' }}>18:00</div>
              <div className="card-hover" style={{ backgroundColor: '#d1fae5', padding: '12px', borderLeft: '4px solid #00d084', color: '#047857', cursor: 'pointer' }}>
                <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>Reservado (Pagado)</div>
                <div style={{ fontWeight: '500', fontSize: '0.8rem', color: '#065f46' }}>👤 Juan Pérez • S/ 80</div>
              </div>
              <div onClick={() => openModal('AGREGAR_RESERVA')} style={{ backgroundColor: '#ffffff', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer' }} className="table-row">
                + Añadir Reserva
              </div>
              <div className="card-hover" style={{ backgroundColor: '#fef3c7', padding: '12px', borderLeft: '4px solid #f59e0b', color: '#b45309', cursor: 'pointer' }}>
                <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>Mantenimiento</div>
                <div style={{ fontWeight: '500', fontSize: '0.8rem', color: '#92400e' }}>Limpieza de cristales</div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#475569' }}>19:00</div>
              <div className="card-hover" style={{ backgroundColor: '#eff6ff', padding: '12px', borderLeft: '4px solid #3b82f6', color: '#1d4ed8', cursor: 'pointer' }}>
                <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>Reservado (Pendiente)</div>
                <div style={{ fontWeight: '500', fontSize: '0.8rem', color: '#1e40af' }}>👤 Carlos Ruiz • S/ 100</div>
              </div>
              <div className="card-hover" style={{ backgroundColor: '#d1fae5', padding: '12px', borderLeft: '4px solid #00d084', color: '#047857', cursor: 'pointer' }}>
                <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>Reservado (Pagado)</div>
                <div style={{ fontWeight: '500', fontSize: '0.8rem', color: '#065f46' }}>👤 Equipo Norte • S/ 80</div>
              </div>
              <div className="card-hover" style={{ backgroundColor: '#d1fae5', padding: '12px', borderLeft: '4px solid #00d084', color: '#047857', cursor: 'pointer' }}>
                <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>Reservado (Pagado)</div>
                <div style={{ fontWeight: '500', fontSize: '0.8rem', color: '#065f46' }}>👤 Lucía Gómez • S/ 60</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Mis Canchas' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: '0', color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Gestión de Infraestructura</h3>
            <button onClick={() => openModal('AGREGAR_CANCHA')} className="action-btn" style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(15,23,42,0.2)' }}>
              + Nueva Cancha
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {canchas.map((cancha) => (
              <div key={cancha.id} className="card-hover" style={{ backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'all 0.3s ease' }}>
                <div style={{ height: '160px', backgroundImage: `url(${cancha.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', color: cancha.color, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    ● {cancha.status}
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>{cancha.name}</h4>
                  <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>{cancha.type}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0f172a' }}>{cancha.price}<span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>/hora</span></span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openModal('ELIMINAR_CANCHA', cancha)} className="action-btn" style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Eliminar</button>
                      <button onClick={() => openModal('EDITAR_CANCHA', cancha)} className="action-btn" style={{ backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Editar</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Finanzas' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '30px' }}>
            <MetricCard title="Balance Disponible" value="S/ 3,240.50" subtitle="Listo para retirar" color="#00d084" />
            <MetricCard title="Ingresos Brutos (Mes)" value="S/ 12,450.00" subtitle="Octubre 2023" color="#3b82f6" trend="up" />
            <MetricCard title="Comisiones PlayStop" value="S/ 0.00" subtitle="Plan Pro Activo" color="#f59e0b" />
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: '0', color: '#0f172a', fontSize: '1.2rem', fontWeight: '800' }}>Historial de Retiros</h3>
              <button className="action-btn" style={{ backgroundColor: '#00d084', color: '#0f172a', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,208,132,0.2)' }}>Retirar Fondos</button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>ID Transacción</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Fecha</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Cuenta Destino</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Monto</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'TRX-9823', date: '22 Oct 2023', account: 'BCP ****4567', amount: 'S/ 2,500.00', status: 'Completado', color: '#00d084', bg: '#d1fae5' },
                    { id: 'TRX-8741', date: '15 Oct 2023', account: 'BCP ****4567', amount: 'S/ 3,100.00', status: 'Completado', color: '#00d084', bg: '#d1fae5' },
                    { id: 'TRX-7102', date: '08 Oct 2023', account: 'BCP ****4567', amount: 'S/ 2,850.00', status: 'Completado', color: '#00d084', bg: '#d1fae5' },
                  ].map((row, i) => (
                    <tr key={i} className="table-row" style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#64748b', fontSize: '0.9rem' }}>{row.id}</td>
                      <td style={{ padding: '16px', color: '#0f172a', fontWeight: '500' }}>{row.date}</td>
                      <td style={{ padding: '16px', color: '#475569' }}>{row.account}</td>
                      <td style={{ padding: '16px', color: '#0f172a', fontWeight: '800' }}>{row.amount}</td>
                      <td style={{ padding: '16px' }}><span style={{ color: row.color, backgroundColor: row.bg, padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800' }}>{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!['Dashboard', 'Calendario de Reservas', 'Mis Canchas', 'Finanzas'].includes(activeTab) && (
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
            
            /* Estilos profesionales para el input de tipo archivo */
            .modal-input[type="file"] { padding: 8px 12px !important; color: #64748b; font-weight: 500; }
            .modal-input[type="file"]::file-selector-button {
              margin-right: 12px;
              padding: 6px 14px;
              font-size: 0.85rem;
              border: none;
              background-color: #0f172a;
              color: #ffffff;
              border-radius: 6px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.2s;
            }
            .modal-input[type="file"]::file-selector-button:hover { background-color: #1e293b; transform: translateY(-1px); box-shadow: 0 4px 6px rgba(15, 23, 42, 0.2); }
          `}
        </style>
        <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '28px', width: '90%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
                {modal.action?.includes('AGREGAR') ? 'Registrar Nuevo' : modal.action?.includes('EDITAR') ? 'Editar Información' : 'Confirmar Acción'}
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                {modal.action?.includes('AGREGAR') ? 'Ingresa los datos para realizar un nuevo registro.' : modal.action?.includes('EDITAR') ? 'Actualiza los datos del registro seleccionado.' : 'Por favor, confirma si deseas proceder con esta acción.'}
              </p>
            </div>
            <button onClick={closeModal} className="modal-close" style={{ background: 'transparent', border: 'none', fontSize: '1.75rem', cursor: 'pointer', color: '#94a3b8', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', marginTop: '-4px' }}>&times;</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {modal.action === 'AGREGAR_CANCHA' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre de la Cancha</label>
                  <input name="name" className="modal-input" required placeholder="Ej. Cancha 3" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Precio por hora</label>
                  <input name="price" className="modal-input" required placeholder="Ej. S/ 80" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
                </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Foto de la Cancha</label>
                <input name="image" type="file" accept="image/*" className="modal-input" style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', transition: 'all 0.3s', cursor: 'pointer' }} />
              </div>
              </>
            )}

            {modal.action === 'EDITAR_CANCHA' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actualizar Precio</label>
                <input name="price" className="modal-input" required defaultValue={modal.payload?.price} placeholder="Ej. S/ 80" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
              </div>
            )}

            {modal.action === 'AGREGAR_RESERVA' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre del Cliente</label>
                  <input name="client" className="modal-input" required placeholder="Ej. Juan Pérez" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cancha Asignada</label>
                  <input name="court" className="modal-input" required placeholder="Ej. Cancha 1" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Horario</label>
                  <input name="time" className="modal-input" required placeholder="Ej. 21:00 - 22:00" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
                </div>
              </>
            )}

            {modal.action === 'EDITAR_RESERVA' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actualizar Horario</label>
                <input name="time" className="modal-input" required defaultValue={modal.payload?.time} placeholder="Ej. 18:00 - 19:00" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
              </div>
            )}

            {modal.action?.includes('ELIMINAR') && (
              <div style={{ padding: '20px', backgroundColor: '#fef2f2', borderRadius: '16px', border: '1px solid #fecaca' }}>
                <p style={{ margin: 0, color: '#991b1b', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  ¿Estás seguro de eliminar de forma permanente <strong style={{ color: '#7f1d1d' }}>{modal.payload?.name || modal.payload?.client}</strong>?<br/><br/>
                  Esta acción <span style={{ textDecoration: 'underline' }}>no se puede deshacer</span>.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
              <button type="button" onClick={closeModal} className="modal-btn-cancel" style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                Cancelar
              </button>
              <button type="submit" className={modal.action?.includes('ELIMINAR') ? 'modal-btn-delete' : 'modal-btn-submit'} style={{ flex: 1, padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: modal.action?.includes('ELIMINAR') ? '#ef4444' : '#00d084', color: '#fff', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                {modal.action?.includes('ELIMINAR') ? 'Sí, eliminar' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default PropietarioDashboard;