import { useState, useEffect } from 'react';
import EmptyState from '../shared/EmptyState.jsx';
import { api } from '../../../services/api.js';

const EmpleadosTab = ({ darkMode, C }) => {
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [selectedBranchId, setSelectedBranchId] = useState('');

  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const [email, setEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState(null);

  useEffect(() => {
    api.getMyBranches()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setBranches(list);
        if (list.length > 0) setSelectedBranchId(list[0].id);
      })
      .catch(() => setBranches([]))
      .finally(() => setLoadingBranches(false));
  }, []);

  const loadEmployees = (branchId) => {
    if (!branchId) return;
    setLoadingEmployees(true);
    api.getBranchEmployees(branchId)
      .then(data => setEmployees(Array.isArray(data) ? data : []))
      .catch(() => setEmployees([]))
      .finally(() => setLoadingEmployees(false));
  };

  useEffect(() => { loadEmployees(selectedBranchId); }, [selectedBranchId]);

  useEffect(() => {
    if (!inviteMsg) return;
    const t = setTimeout(() => setInviteMsg(null), 4000);
    return () => clearTimeout(t);
  }, [inviteMsg]);

  const invitar = async () => {
    const trimmed = email.trim();
    if (!trimmed || !selectedBranchId) return;
    setInviting(true);
    setInviteMsg(null);
    try {
      await api.inviteEmployee(selectedBranchId, trimmed);
      setInviteMsg({ type: 'success', text: `Invitación enviada a ${trimmed}.` });
      setEmail('');
    } catch (err) {
      setInviteMsg({ type: 'error', text: err.message || 'No se pudo enviar la invitación' });
    } finally {
      setInviting(false);
    }
  };

  const quitar = async (employee) => {
    if (!window.confirm(`¿Quitar a ${employee.name} de esta sucursal?`)) return;
    try {
      await api.removeEmployee(selectedBranchId, employee.employeeId);
      loadEmployees(selectedBranchId);
    } catch (err) {
      alert(err.message || 'No se pudo quitar al empleado');
    }
  };

  if (loadingBranches) {
    return <p style={{ color: C.textSecondary, fontSize: '0.9rem' }}>Cargando sucursales...</p>;
  }

  if (branches.length === 0) {
    return (
      <EmptyState
        icon="bi-people-fill"
        title="Crea una sucursal primero"
        message="Los empleados se asignan a una sucursal. Crea una en la sección Sucursales."
        darkMode={darkMode}
      />
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, color: C.textPrimary, fontSize: '1.3rem', fontWeight: '800' }}>Empleados</h3>
        <select
          className="modal-ps-input"
          style={{ minWidth: '220px', width: 'auto' }}
          value={selectedBranchId}
          onChange={e => setSelectedBranchId(e.target.value)}
        >
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      <div className="dashboard-card-ps" style={{ marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 6px', color: C.textPrimary, fontSize: '1.05rem', fontWeight: '800' }}>Invitar empleado</h4>
        <p style={{ margin: '0 0 16px', color: C.textSecondary, fontSize: '0.88rem' }}>
          Le enviaremos un correo con un enlace para crear su cuenta y unirse a esta sucursal.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="email"
            className="modal-ps-input"
            style={{ flex: 1, minWidth: '220px' }}
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && invitar()}
          />
          <button onClick={invitar} disabled={inviting || !email.trim()} className="btn-primary-ps" style={{ padding: '13px 22px', opacity: !email.trim() ? 0.5 : 1 }}>
            {inviting ? 'Enviando...' : 'Invitar'}
          </button>
        </div>
        {inviteMsg && (
          <div style={{
            marginTop: 14, padding: '12px 16px', borderRadius: 12,
            background: inviteMsg.type === 'success' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${inviteMsg.type === 'success' ? 'rgba(37, 99, 235, 0.35)' : 'rgba(239,68,68,0.3)'}`,
            color: inviteMsg.type === 'success' ? '#2563eb' : '#ef4444',
            fontWeight: 700, fontSize: '0.88rem',
          }}>
            {inviteMsg.text}
          </div>
        )}
      </div>

      <div className="dashboard-card-ps">
        <h4 style={{ margin: '0 0 18px', color: C.textPrimary, fontSize: '1.05rem', fontWeight: '800' }}>
          Equipo de esta sucursal ({employees.length})
        </h4>
        {loadingEmployees ? (
          <p style={{ color: C.textSecondary, fontSize: '0.9rem' }}>Cargando empleados...</p>
        ) : employees.length === 0 ? (
          <p style={{ color: C.textMuted, fontSize: '0.9rem' }}>Aún no hay empleados en esta sucursal.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {employees.map(emp => (
              <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', border: `1px solid ${C.cardBorder}`, borderRadius: '16px', backgroundColor: C.cardBg }} className="card-hover">
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, flexShrink: 0 }}>
                  {emp.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: '0 0 2px', fontSize: '0.95rem', color: C.textPrimary, fontWeight: '800', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: C.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.email}</p>
                </div>
                <button
                  onClick={() => quitar(emp)}
                  aria-label="Quitar empleado"
                  style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '1.1rem', padding: '4px', borderRadius: '8px', flexShrink: 0 }}
                  onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseOut={e => e.currentTarget.style.color = '#cbd5e1'}
                >✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpleadosTab;
