import { useState } from 'react';

// --- PLANTILLA PRINCIPAL (Layout) ---
export const DashboardLayout = ({ user, onLogout, title, menuItems, activeTab, onTabChange, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f8fafc', overflow: 'hidden', fontFamily: '"Inter", system-ui, -apple-system, sans-serif' }}>
      
      {/* Estilos dinámicos para los dashboards */}
      <style>
        {`
          .nav-item:hover { background-color: rgba(255,255,255,0.05); color: #ffffff !important; }
          .action-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
          .table-row:hover { background-color: #f1f5f9; }
          .card-hover:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); border-color: #cbd5e1 !important; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          
          .sidebar {
            width: 260px;
            background-color: #0f172a;
            display: flex;
            flex-direction: column;
            border-right: 1px solid #1e293b;
            transition: transform 0.3s ease;
            z-index: 40;
          }
          
          .menu-btn { display: none; background: none; border: none; font-size: 1.5rem; cursor: pointer; margin-right: 15px; color: #0f172a; }
          .overlay { display: none; }

          @media (max-width: 768px) {
            .sidebar { position: fixed; height: 100vh; left: 0; transform: translateX(${isSidebarOpen ? '0' : '-100%'}); }
            .menu-btn { display: block; }
            .overlay { display: ${isSidebarOpen ? 'block' : 'none'}; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); z-index: 30; backdrop-filter: blur(4px); }
          }
        `}
      </style>

      {/* Overlay para móvil */}
      <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>

      {/* Barra Lateral (Sidebar) */}
      <aside className="sidebar">
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <img src="/favicon.svg" alt="Logo" style={{ width: '32px', height: '32px' }} />
          <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>PlayStop</h2>
        </div>
        
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item, idx) => (
            <a key={idx} href="#" onClick={(e) => { e.preventDefault(); onTabChange(item.label); setIsSidebarOpen(false); }} className={activeTab === item.label ? '' : 'nav-item'} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: activeTab === item.label ? '#ffffff' : '#94a3b8', backgroundColor: activeTab === item.label ? 'rgba(0, 208, 132, 0.15)' : 'transparent', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'all 0.2s' }}>
              <span>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ padding: '20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, color: '#f8fafc', fontWeight: '700', fontSize: '0.95rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user.name}</p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>{user.role}</p>
            </div>
          </div>
          <button onClick={onLogout} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ height: '80px', minHeight: '80px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
            <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>{title}</h1>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="action-btn" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>🔔</button>
          </div>
        </header>
        
        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

// --- COMPONENTES DE TARJETA (Reutilizables) ---
export const MetricCard = ({ title, value, subtitle, color, trend }) => (
  <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', borderTop: `4px solid ${color}`, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <h3 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
    <p style={{ margin: '0 0 8px 0', fontSize: '2.2rem', fontWeight: '900', color: '#0f172a' }}>{value}</p>
    {subtitle && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
        {trend === 'up' && <span style={{ color: '#00d084', backgroundColor: '#d1fae5', padding: '2px 6px', borderRadius: '6px' }}>↑</span>}
        {trend === 'down' && <span style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '2px 6px', borderRadius: '6px' }}>↓</span>}
        <span>{subtitle}</span>
      </div>
    )}
  </div>
);