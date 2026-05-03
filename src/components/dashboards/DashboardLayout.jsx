import { useState } from 'react';

// --- PLANTILLA PRINCIPAL (Layout) ---
export const DashboardLayout = ({ user, onLogout, title, menuItems, activeTab, onTabChange, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f1f5f9', backgroundImage: 'radial-gradient(circle at top right, #e2e8f0 0%, transparent 600px)', overflow: 'hidden', fontFamily: '"Inter", system-ui, -apple-system, sans-serif' }}>
      
      {/* Estilos dinámicos para los dashboards */}
      <style>
        {`
          @keyframes contentFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          .tab-content { animation: contentFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

          .nav-item { position: relative; overflow: hidden; transition: all 0.3s ease; border-left: 3px solid transparent; margin: 2px 12px; border-radius: 8px; }
          .nav-item:hover { background-color: rgba(255,255,255,0.03); color: #ffffff !important; transform: translateX(4px); border-left-color: rgba(255,255,255,0.2); }
          .nav-item.active { background: linear-gradient(90deg, rgba(0, 208, 132, 0.1) 0%, transparent 100%); border-left-color: #00d084; color: #ffffff !important; transform: translateX(4px); }
          .action-btn { transition: all 0.2s ease; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .action-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); filter: brightness(1.05); }
          .card-hover:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); border-color: #cbd5e1 !important; }
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          
          /* Global Premium Styles for Dashboards */
          .dashboard-card {
            background-color: #ffffff;
            border-radius: 20px;
            padding: 28px;
            border: 1px solid rgba(226, 232, 240, 0.8);
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.04), 0 4px 10px -2px rgba(15, 23, 42, 0.02);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .dashboard-card:hover { box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.08); transform: translateY(-2px); }
          
          .premium-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 10px;
            text-align: left;
            white-space: nowrap;
          }
          .premium-table th { padding: 12px 20px; font-weight: 800; color: #94a3b8; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; border: none; }
          .premium-table td { padding: 18px 20px; background-color: #ffffff; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; transition: all 0.2s ease; }
          .premium-table td:first-child { border-left: 1px solid #f1f5f9; border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
          .premium-table td:last-child { border-right: 1px solid #f1f5f9; border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
          
          .table-row:hover td { background-color: #f8fafc; border-color: #e2e8f0; transform: scale(1.001); }
          
          .status-badge {
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 800;
            display: inline-flex;
            align-items: center;
            letter-spacing: 0.3px;
          }

          .sidebar {
            width: 260px;
            background-color: #020617;
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
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
          <div style={{ position: 'absolute', width: '80px', height: '80px', background: '#00d084', filter: 'blur(60px)', opacity: 0.15, top: 0, left: 0, pointerEvents: 'none' }}></div>
          <img src="/favicon.svg" alt="Logo" style={{ width: '32px', height: '32px' }} />
          <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>PlayStop</h2>
        </div>
        
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item, idx) => (
            <a key={idx} href="#" onClick={(e) => { e.preventDefault(); onTabChange(item.label); setIsSidebarOpen(false); }} className={`nav-item ${activeTab === item.label ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#94a3b8', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>
              <span>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ padding: '20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #00d084, #3b82f6)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontWeight: '900', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, color: '#f8fafc', fontWeight: '700', fontSize: '0.95rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user.name}</p>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user.role}</p>
            </div>
          </div>
          <button onClick={onLogout} className="action-btn" style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.1)', fontWeight: '700', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = '#ffffff'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'; e.currentTarget.style.color = '#f87171'; }}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ height: '80px', minHeight: '80px', backgroundColor: 'rgba(241, 245, 249, 0.7)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(226, 232, 240, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', zIndex: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
            <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>{title}</h1>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="action-btn" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>🔔</button>
          </div>
        </header>
        
        <div className="tab-content" key={activeTab} style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

// --- COMPONENTES DE TARJETA (Reutilizables) ---
export const MetricCard = ({ title, value, subtitle, color, trend }) => (
  <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', padding: '28px' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: color }}></div>
    <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }}></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
      <h3 style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h3>
      <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: `${color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, fontWeight: '900', fontSize: '1.1rem' }}>
        {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '•'}
      </div>
    </div>
    <p style={{ margin: '0 0 10px 0', fontSize: '2.2rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px' }}>{value}</p>
    {subtitle && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
        <span style={{ color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#64748b' }}>{subtitle}</span>
      </div>
    )}
  </div>
);