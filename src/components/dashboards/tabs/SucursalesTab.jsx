import { useState, useEffect } from 'react';
import EmptyState from '../shared/EmptyState.jsx';
import { api } from '../../../services/api.js';

const emptyForm = { name: '', address: '', city: '', district: '' };

const SucursalesTab = ({ darkMode, C }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.getMyBranches()
      .then(data => setBranches(Array.isArray(data) ? data : []))
      .catch(() => setBranches([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true); };
  const openEdit = (branch) => {
    setEditing(branch);
    setForm({ name: branch.name, address: branch.address || '', city: branch.city || '', district: branch.district || '' });
    setError('');
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setError('');
    try {
      if (editing) await api.updateBranch(editing.id, form);
      else await api.createBranch(form);
      closeForm();
      load();
    } catch (err) {
      setError(err.message || 'No se pudo guardar la sucursal');
    } finally {
      setSaving(false);
    }
  };

  const eliminar = async (branch) => {
    if (!window.confirm(`¿Eliminar la sucursal "${branch.name}"?`)) return;
    try {
      await api.deleteBranch(branch.id);
      load();
    } catch (err) {
      alert(err.message || 'No se pudo eliminar la sucursal');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, color: C.textPrimary, fontSize: '1.3rem', fontWeight: '800' }}>Sucursales</h3>
        <button onClick={openCreate} className="btn-dark-ps">+ Nueva Sucursal</button>
      </div>

      {loading ? (
        <p style={{ color: C.textSecondary, fontSize: '0.9rem' }}>Cargando sucursales...</p>
      ) : branches.length === 0 ? (
        <EmptyState icon="bi-building" title="Sin sucursales aún" message="Crea tu primera sucursal para agrupar canchas y asignar empleados." darkMode={darkMode} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {branches.map(branch => (
            <div key={branch.id} className="card-hover" style={{ backgroundColor: C.cardBg, borderRadius: 20, border: `1px solid ${C.cardBorder}`, padding: 20 }}>
              <h4 style={{ margin: '0 0 6px', color: C.textPrimary, fontSize: '1.05rem', fontWeight: 800 }}>{branch.name}</h4>
              {branch.address && (
                <p style={{ margin: '0 0 4px', color: C.textSecondary, fontSize: '0.85rem' }}>
                  <i className="bi bi-geo-alt-fill" /> {branch.address}{branch.district ? `, ${branch.district}` : ''}
                </p>
              )}
              <div style={{ display: 'flex', gap: 16, margin: '12px 0', color: C.textMuted, fontSize: '0.85rem' }}>
                <span><i className="bi bi-geo-alt" /> {branch.courtCount} cancha{branch.courtCount === 1 ? '' : 's'}</span>
                <span><i className="bi bi-people" /> {branch.employeeCount} empleado{branch.employeeCount === 1 ? '' : 's'}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, borderTop: `1px solid ${C.cardBorder}`, paddingTop: 14 }}>
                <button onClick={() => eliminar(branch)} className="btn-delete-ps">Eliminar</button>
                <button onClick={() => openEdit(branch)} className="btn-edit-ps">Editar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={closeForm}>
          <form onSubmit={submit} onClick={e => e.stopPropagation()} style={{ background: C.cardBg, borderRadius: 20, padding: 28, width: '90%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ margin: 0, color: C.textPrimary, fontWeight: 800 }}>{editing ? 'Editar sucursal' : 'Nueva sucursal'}</h3>
            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 10, color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>
                {error}
              </div>
            )}
            <input className="modal-ps-input" required placeholder="Nombre de la sucursal" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input className="modal-ps-input" placeholder="Dirección" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            <div style={{ display: 'flex', gap: 12 }}>
              <input className="modal-ps-input" placeholder="Ciudad" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              <input className="modal-ps-input" placeholder="Distrito" value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" onClick={closeForm} className="btn-secondary-ps">Cancelar</button>
              <button type="submit" disabled={saving} className="btn-primary-ps">{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SucursalesTab;
