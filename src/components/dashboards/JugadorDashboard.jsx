import { useState } from 'react';
import { DashboardLayout, MetricCard } from './DashboardLayout.jsx';

const JugadorDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Inicio');

  // Estado simulado para Mis Reservas
  const [reservas, setReservas] = useState([
    { id: 1, court: 'Cancha El Clásico', date: 'Hoy, 20:00', status: 'Confirmada', color: '#00d084', bg: '#d1fae5' },
    { id: 2, court: 'Pádel Center Surco', date: '28 Oct, 18:00', status: 'Pendiente', color: '#f59e0b', bg: '#fef3c7' },
  ]);

  // Estado simulado para Mis Amigos
  const [amigos, setAmigos] = useState([
    { id: 1, name: 'Martín Fernández', img: 'https://randomuser.me/api/portraits/men/44.jpg', level: 'Intermedio', lastMatch: 'Ayer' },
    { id: 2, name: 'Lucía Gómez', img: 'https://randomuser.me/api/portraits/women/68.jpg', level: 'Avanzado', lastMatch: 'Hace 3 días' },
    { id: 3, name: 'Carlos Ramírez', img: 'https://randomuser.me/api/portraits/men/32.jpg', level: 'Principiante', lastMatch: 'Hace 1 semana' },
    { id: 4, name: 'Valeria Castro', img: 'https://randomuser.me/api/portraits/women/44.jpg', level: 'Intermedio', lastMatch: 'Hace 2 semanas' },
  ]);

  const [modal, setModal] = useState({ show: false, action: null, payload: null });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const openModal = (action, payload = null) => setModal({ show: true, action, payload });
  const closeModal = () => {
    setModal({ show: false, action: null, payload: null });
    setAcceptedTerms(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    // Interceptar el primer paso de reserva para enviarlo al pago
    if (modal.action === 'RESERVAR_CANCHA') {
      setModal({ show: true, action: 'PAGO_CULQI', payload: { ...modal.payload, selectedDate: fd.get('date') } });
      return; // Detenemos la ejecución para que no se cierre el modal
    }

    if (modal.action === 'CANCELAR_RESERVA') {
      setReservas(reservas.filter(r => r.id !== modal.payload.id));
    } else if (modal.action === 'EDITAR_RESERVA') {
      setReservas(reservas.map(r => r.id === modal.payload.id ? { ...r, date: fd.get('date') } : r));
    } else if (modal.action === 'AÑADIR_AMIGO') {
      setAmigos([{ id: Date.now(), name: fd.get('name'), img: `https://ui-avatars.com/api/?name=${fd.get('name')}&background=0f172a&color=fff`, level: 'Principiante', lastMatch: 'Nuevo' }, ...amigos]);
    } else if (modal.action === 'PAGO_CULQI') {
      // Finalizamos el flujo: Guardamos la reserva tras "pagar"
      const formattedDate = modal.payload.selectedDate ? new Date(modal.payload.selectedDate).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Próximamente';
      setReservas([{ id: Date.now(), court: modal.payload.name, date: formattedDate, status: 'Confirmada', color: '#00d084', bg: '#d1fae5' }, ...reservas]);
    }
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

      {activeTab === 'Buscar Canchas' && (
        <div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Buscar por nombre o distrito..." style={{ flex: 1, minWidth: '200px', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }} />
            <select style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', backgroundColor: '#fff', cursor: 'pointer' }}>
              <option>Todos los deportes</option>
              <option>Fútbol 7</option>
              <option>Pádel</option>
              <option>Tenis</option>
            </select>
            <button className="action-btn" style={{ backgroundColor: '#00d084', color: '#fff', border: 'none', padding: '14px 24px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,208,132,0.2)' }}>Buscar</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80', name: 'Cancha El Clásico', type: 'Fútbol 7 • Sintética', price: 'S/ 80', rating: '4.9' },
              { img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&q=80', name: 'Pádel Center Surco', type: 'Pádel • Cristal', price: 'S/ 60', rating: '4.7' },
              { img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80', name: 'Tenis Club San Isidro', type: 'Tenis • Arcilla', price: 'S/ 100', rating: '5.0' },
              { img: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=500&q=80', name: 'DeporPlaza Norte', type: 'Fútbol 5 • Sintética', price: 'S/ 70', rating: '4.5' },
              { img: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=500&q=80', name: 'Vóley Playa Costa Verde', type: 'Vóley • Arena', price: 'S/ 50', rating: '4.8' },
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
      )}

      {activeTab === 'Mis Reservas' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Mis Próximos Partidos</h3>
          
          {reservas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No tienes reservas activas en este momento.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Fecha y Hora</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Cancha</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Estado</th>
                    <th style={{ padding: '12px 16px', fontWeight: '700' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((row) => (
                    <tr key={row.id} className="table-row" style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '16px', fontWeight: '700', color: '#0f172a' }}>{row.date}</td>
                      <td style={{ padding: '16px', color: '#475569' }}>{row.court}</td>
                      <td style={{ padding: '16px' }}><span style={{ color: row.color, backgroundColor: row.bg, padding: '4px 10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '800' }}>{row.status}</span></td>
                      <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                        <button onClick={() => openModal('EDITAR_RESERVA', row)} className="action-btn" style={{ backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Editar</button>
                        <button onClick={() => openModal('CANCELAR_RESERVA', row)} className="action-btn" style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Cancelar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Mis Amigos' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.3rem', fontWeight: '800' }}>Lista de Jugadores</h3>
            <button onClick={() => openModal('AÑADIR_AMIGO')} className="action-btn" style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>+ Añadir Amigo</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {amigos.map((amigo) => (
              <div key={amigo.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '16px', transition: 'all 0.2s' }} className="card-hover">
                <img src={amigo.img} alt={amigo.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: '700' }}>{amigo.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Nivel {amigo.level} • {amigo.lastMatch === 'Nuevo' ? 'Nuevo amigo' : `Jugó ${amigo.lastMatch.toLowerCase()}`}</p>
                </div>
              </div>
            ))}
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
        <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '28px', width: '90%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
                {modal.action === 'CANCELAR_RESERVA' ? 'Cancelar Reserva' : modal.action === 'EDITAR_RESERVA' ? 'Editar Reserva' : modal.action === 'AÑADIR_AMIGO' ? 'Añadir Nuevo Amigo' : modal.action === 'PAGO_CULQI' ? 'Pago Seguro Culqi' : 'Confirmar Reserva'}
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                {modal.action === 'CANCELAR_RESERVA' ? '¿Estás seguro de que deseas cancelar este partido?' : modal.action === 'EDITAR_RESERVA' ? `Modifica la fecha de tu reserva en ${modal.payload?.court}.` : modal.action === 'AÑADIR_AMIGO' ? 'Ingresa el nombre o correo de tu amigo para buscarlo e invitarlo.' : modal.action === 'PAGO_CULQI' ? 'Ingresa los datos de tu tarjeta para completar la transacción.' : `Estás a punto de reservar ${modal.payload?.name}.`}
              </p>
            </div>
            <button onClick={closeModal} className="modal-close" style={{ background: 'transparent', border: 'none', fontSize: '1.75rem', cursor: 'pointer', color: '#94a3b8', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', marginTop: '-4px' }}>&times;</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {modal.action === 'CANCELAR_RESERVA' && (
              <div style={{ padding: '20px', backgroundColor: '#fef2f2', borderRadius: '16px', border: '1px solid #fecaca' }}>
                <p style={{ margin: 0, color: '#991b1b', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  Se cancelará tu reserva en <strong style={{ color: '#7f1d1d' }}>{modal.payload?.court}</strong>.<br/><br/>
                  Esta acción <span style={{ textDecoration: 'underline' }}>no se puede deshacer</span>.
                </p>
              </div>
            )}

            {modal.action === 'EDITAR_RESERVA' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nueva Fecha y Hora</label>
                <input name="date" type="text" className="modal-input" required defaultValue={modal.payload?.date} placeholder="Ej. 30 Oct, 19:00" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
              </div>
            )}

            {modal.action === 'AÑADIR_AMIGO' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre o Correo</label>
                <input name="name" type="text" className="modal-input" required placeholder="Ej. Juan Pérez" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
              </div>
            )}

            {modal.action === 'RESERVAR_CANCHA' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha y Hora</label>
                  <input type="datetime-local" name="date" className="modal-input" required style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
                </div>

                <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '600', color: '#475569' }}>Total a pagar:</span>
                  <span style={{ fontWeight: '900', color: '#0f172a', fontSize: '1.1rem' }}>{modal.payload?.price}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#00d084' }} />
                  <label htmlFor="terms" style={{ fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>
                    Acepto los <span style={{ color: '#3b82f6', textDecoration: 'underline' }}>Términos y Condiciones</span>.
                  </label>
                </div>
              </>
            )}

            {modal.action === 'PAGO_CULQI' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                 <h3 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <img src="https://github.com/culqi.png" alt="Culqi Logo" style={{ height: '32px', borderRadius: '6px', marginRight: '8px' }} />
                 <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900', fontSize: '28px', color: '#0f172a', letterSpacing: '-1.5px' }}>culqi</span>
                   </h3>
                   <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Pagando <strong style={{ color: '#0f172a' }}>{modal.payload?.price}</strong> a PlayStop</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#334155' }}>Número de Tarjeta</label>
                  <input name="cardNumber" type="text" className="modal-input" required placeholder="0000 0000 0000 0000" maxLength="19" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#334155' }}>Vencimiento</label>
                    <input name="exp" type="text" className="modal-input" required placeholder="MM/AA" maxLength="5" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#334155' }}>CVC</label>
                    <input name="cvc" type="password" className="modal-input" required placeholder="123" maxLength="4" style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1.05rem', transition: 'all 0.3s' }} />
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                   <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '700' }}>Pago 100% seguro y encriptado</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
              <button type="button" onClick={closeModal} className="modal-btn-cancel" style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                Cancelar
              </button>
              <button type="submit" disabled={modal.action === 'RESERVAR_CANCHA' && !acceptedTerms} className={modal.action === 'CANCELAR_RESERVA' ? 'modal-btn-delete' : 'modal-btn-submit'} style={{ flex: 1, padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: modal.action === 'CANCELAR_RESERVA' ? '#ef4444' : '#00d084', color: '#fff', fontWeight: '800', fontSize: '1.05rem', cursor: (modal.action === 'RESERVAR_CANCHA' && !acceptedTerms) ? 'not-allowed' : 'pointer', opacity: (modal.action === 'RESERVAR_CANCHA' && !acceptedTerms) ? 0.5 : 1, transition: 'all 0.2s' }}>
                {modal.action === 'CANCELAR_RESERVA' ? 'Sí, Cancelar' : modal.action === 'EDITAR_RESERVA' ? 'Guardar Cambios' : modal.action === 'AÑADIR_AMIGO' ? 'Enviar Solicitud' : modal.action === 'PAGO_CULQI' ? `Procesar ${modal.payload?.price}` : 'Pagar'}
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