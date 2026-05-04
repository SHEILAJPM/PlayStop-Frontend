import { useState } from 'react';

// --- PLANTILLA PRINCIPAL (Layout) ---
export const DashboardLayout = ({ user, onLogout, title, menuItems, activeTab, onTabChange, children, darkMode, toggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="layout-container">
      
      {/* Estilos dinámicos para los dashboards */}
      <style>
        {`
          @keyframes contentFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          .tab-content { animation: contentFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

          .layout-container {
            display: flex;
            height: 100vh;
            width: 100vw;
            background-color: #f1f5f9;
            background-image: radial-gradient(#cbd5e1 1px, transparent 0);
            background-size: 32px 32px;
            padding: 20px;
            gap: 24px;
            box-sizing: border-box;
            font-family: "Inter", system-ui, -apple-system, sans-serif;
          }

          /* Floating Sidebar */
          .sidebar {
            width: 280px;
            background-color: #0f172a;
            border-radius: 24px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
            z-index: 40;
            transition: transform 0.3s ease;
            overflow: hidden;
          }

          .nav-item {
            display: block;
            padding: 14px 20px;
            color: #94a3b8;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            border-radius: 12px;
            margin-bottom: 6px;
            transition: all 0.2s ease;
          }
          .nav-item:hover { background-color: #1e293b; color: #f8fafc; }
          .nav-item.active { background-color: #00d084; color: #0f172a; font-weight: 700; box-shadow: 0 4px 14px rgba(0, 208, 132, 0.3); }

          /* Floating Header */
          .header-bar {
            height: 80px;
            min-height: 80px;
            background-color: #ffffff;
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 32px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
            margin-bottom: 24px;
            z-index: 20;
          }

          .action-btn { transition: all 0.2s ease; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .action-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
          .card-hover:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); border-color: #cbd5e1 !important; }
          
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          
          /* Clean Cards */
          .dashboard-card {
            background-color: #ffffff;
            border-radius: 24px;
            padding: 32px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
            transition: all 0.3s ease;
          }
          .dashboard-card:hover { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); transform: translateY(-2px); }
          
          /* Minimalist Tables */
          .premium-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            white-space: nowrap;
          }
          .premium-table th { padding: 16px 20px; font-weight: 700; color: #64748b; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #f1f5f9; }
          .premium-table td { padding: 20px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9; transition: background-color 0.2s ease; }
          .table-row:hover td { background-color: #f8fafc; }
          
          .status-badge {
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 0.8rem;
            font-weight: 800;
            display: inline-flex;
            align-items: center;
          }

          .menu-btn { display: none; background: none; border: none; font-size: 1.5rem; cursor: pointer; margin-right: 15px; color: #0f172a; }

          @media (max-width: 768px) {
            .layout-container { padding: 12px; gap: 12px; display: block; }
            .sidebar { position: fixed; height: calc(100vh - 24px); top: 12px; left: 12px; transform: translateX(calc(-100% - 24px)); }
            .sidebar.open { transform: translateX(0); }
            .header-bar { padding: 0 20px; margin-bottom: 16px; }
            .menu-btn { display: block; }
            .overlay { display: ${isSidebarOpen ? 'block' : 'none'}; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); z-index: 30; backdrop-filter: blur(4px); }
          }

          /* DASHBOARD DARK MODE STYLES */
          .dark-mode .layout-container { background-color: #020617 !important; background-image: radial-gradient(#1e293b 1px, transparent 0) !important; }
          .dark-mode .sidebar { background-color: #0b1120 !important; border-right: 1px solid #1e293b !important; box-shadow: none !important; }
          .dark-mode .sidebar h2 { color: #f8fafc !important; }
          .dark-mode .header-bar { background-color: #0f172a !important; border-bottom: 1px solid #1e293b !important; box-shadow: none !important; }
          .dark-mode .header-bar h1 { color: #f8fafc !important; }
          .dark-mode .menu-btn { color: #f8fafc !important; }
          .dark-mode .dashboard-card { background-color: #0f172a !important; border-color: #1e293b !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.4) !important; }
          .dark-mode .dashboard-card h3, .dark-mode .dashboard-card h4 { color: #f8fafc !important; }
          .dark-mode .dashboard-card p { color: #94a3b8 !important; }
          .dark-mode .metric-title { color: #94a3b8 !important; }
          .dark-mode .metric-value { color: #f8fafc !important; }
          .dark-mode .premium-table th { color: #cbd5e1 !important; border-bottom-color: #1e293b !important; }
          .dark-mode .premium-table td { background-color: #0f172a !important; border-bottom-color: #1e293b !important; color: #f8fafc !important; }
          .dark-mode .table-row:hover td { background-color: #1e293b !important; }
          .dark-mode .modal-input { background-color: #020617 !important; border-color: #1e293b !important; color: #f8fafc !important; }
          .dark-mode .modal-input:focus { background-color: #0b1120 !important; border-color: #00d084 !important; }
          .dark-mode .card-hover { background-color: #0f172a !important; border-color: #1e293b !important; }
          .dark-mode .card-hover:hover { background-color: #1e293b !important; border-color: #334155 !important; }
          .dark-mode .dashboard-modal { background-color: #0f172a !important; border: 1px solid #1e293b !important; }
          .dark-mode .dashboard-modal h2 { color: #f8fafc !important; }
          .dark-mode .dashboard-modal p { color: #94a3b8 !important; }
          .dark-mode .dashboard-modal label { color: #cbd5e1 !important; }
          .dark-mode .modal-close { color: #cbd5e1 !important; }
          .dark-mode .modal-close:hover { background-color: #1e293b !important; color: #ef4444 !important; }
          .dark-mode .modal-btn-cancel { background-color: #1e293b !important; border-color: #334155 !important; color: #f8fafc !important; }
          .dark-mode .modal-btn-cancel:hover { background-color: #334155 !important; }
          .dark-mode .overlay { background: rgba(2, 6, 23, 0.8) !important; }
          .dark-mode .btn-edit { background-color: rgba(59, 130, 246, 0.15) !important; color: #60a5fa !important; }
          .dark-mode .btn-delete { background-color: rgba(239, 68, 68, 0.15) !important; color: #f87171 !important; }
          .dark-mode .btn-secondary { background-color: rgba(255, 255, 255, 0.05) !important; color: #f8fafc !important; border-color: #334155 !important; }
          .dark-mode .btn-primary-dark { background-color: #f8fafc !important; color: #0f172a !important; }
          .dark-mode .modal-warning { background-color: rgba(239, 68, 68, 0.1) !important; border-color: rgba(239, 68, 68, 0.2) !important; }
          .dark-mode .modal-info-box { background-color: #1e293b !important; border-color: #334155 !important; }
        `}
      </style>

      {/* Overlay para móvil */}
      <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>

      {/* Barra Lateral (Sidebar) */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #1e293b' }}>
          <img src="/favicon.svg" alt="Logo" style={{ width: '32px', height: '32px' }} />
          <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.5px' }}>PlayStop</h2>
        </div>
        
        <nav style={{ flex: 1, padding: '24px 12px', display: 'flex', flexDirection: 'column' }}>
          {menuItems.map((item, idx) => (
            <a key={idx} href="#" onClick={(e) => { e.preventDefault(); onTabChange(item.label); setIsSidebarOpen(false); }} className={`nav-item ${activeTab === item.label ? 'active' : ''}`}>
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid #1e293b', backgroundColor: '#0b1120' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0f172a', fontWeight: '900', fontSize: '1.2rem' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, color: '#f8fafc', fontWeight: '700', fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name || 'Usuario'}</p>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem', fontWeight: '500' }}>{user?.role || ''}</p>
            </div>
          </div>
          <button onClick={onLogout} className="action-btn" style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#1e293b', color: '#f8fafc', border: 'none', fontWeight: '600', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ef4444'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header className="header-bar">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
            <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>{title}</h1>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px' }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="action-btn btn-secondary" style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
          </div>
        </header>
        
        <div className="tab-content" key={activeTab} style={{ flex: 1, paddingBottom: '32px', overflowY: 'auto', paddingRight: '8px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

// --- COMPONENTES DE TARJETA (Reutilizables) ---
export const MetricCard = ({ title, value, subtitle, color, trend }) => (
  <div className="dashboard-card card-hover" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
      </div>
      {trend && (
        <div style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: trend === 'up' ? '#d1fae5' : '#fee2e2', color: trend === 'up' ? '#047857' : '#be123c', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {trend === 'up' ? '↗' : '↘'}
        </div>
      )}
    </div>
    <div>
          <h3 className="metric-title" style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#64748b', fontWeight: '600' }}>{title}</h3>
          <p className="metric-value" style={{ margin: '0', fontSize: '2.4rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px' }}>{value}</p>
    </div>
    {subtitle && (
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }}></span>
        {subtitle}
      </div>
    )}
  </div>
);