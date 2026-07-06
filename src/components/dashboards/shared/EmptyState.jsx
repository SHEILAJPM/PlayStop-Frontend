const EmptyState = ({ icon, title, message, darkMode = false, cta }) => (
  <div style={{
    gridColumn: '1 / -1', textAlign: 'center', padding: '64px 32px',
    background: darkMode ? '#0f172a' : '#fff',
    borderRadius: 24,
    border: `1px dashed ${darkMode ? '#1e293b' : '#e2e8f0'}`,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
  }}>
    <div style={{
      width: 88, height: 88, borderRadius: '50%',
      background: darkMode ? 'rgba(255,255,255,0.04)' : '#f8fafc',
      border: `2px dashed ${darkMode ? '#1e293b' : '#e2e8f0'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '2.6rem', marginBottom: 20,
      boxShadow: darkMode ? '0 0 40px rgba(37, 99, 235, 0.04)' : '0 4px 20px rgba(0,0,0,0.04)',
    }}>
      <i className={`bi ${icon}`} />
    </div>
    <h3 style={{ margin: '0 0 8px', color: darkMode ? '#f8fafc' : '#0f172a', fontWeight: 800, fontSize: '1.1rem' }}>{title}</h3>
    <p style={{ margin: 0, color: '#94a3b8', maxWidth: 300, marginInline: 'auto', fontSize: '.9rem', lineHeight: 1.6 }}>{message}</p>
    {cta && (
      <button
        onClick={cta.onClick}
        style={{ marginTop: 20, padding: '10px 22px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#ffffff', fontWeight: 800, fontSize: '.9rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(37, 99, 235, 0.25)' }}
      >
        {cta.label}
      </button>
    )}
  </div>
);

export default EmptyState;
