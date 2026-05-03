
// --- PLANTILLA PRINCIPAL (Layout) ---
const DashboardLayout = ({ user, onLogout, title, menuItems, children }) => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      {/* Barra Lateral (Sidebar) */}
      <aside style={{ width: '260px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1e293b' }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <img src="/favicon.svg" alt="Logo" style={{ width: '32px', height: '32px' }} />
          <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>PlayStop</h2>
        </div>
        
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item, idx) => (
            <a key={idx} href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: item.active ? '#ffffff' : '#94a3b8', backgroundColor: item.active ? 'rgba(0, 208, 132, 0.15)' : 'transparent', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', transition: 'all 0.2s' }}>
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
        <header style={{ height: '80px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.5px' }}>{title}</h1>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer' }}>🔔</button>
          </div>
        </header>
        
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

// --- COMPONENTES DE TARJETA (Reutilizables) ---
const MetricCard = ({ title, value, subtitle, color }) => (
  <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
    <h3 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{title}</h3>
    <p style={{ margin: '0 0 8px 0', fontSize: '2.2rem', fontWeight: '900', color: '#0f172a' }}>{value}</p>
    {subtitle && <p style={{ margin: 0, fontSize: '0.85rem', color, fontWeight: '600' }}>{subtitle}</p>}
  </div>
);

// --- VISTAS ESPECÍFICAS DE CADA ROL ---

export const JugadorDashboard = ({ user, onLogout }) => (
  <DashboardLayout user={user} onLogout={onLogout} title="Mi Resumen Deportivo" menuItems={[
    { icon: '🏠', label: 'Inicio', active: true },
    { icon: '🔍', label: 'Buscar Canchas' },
    { icon: '📅', label: 'Mis Reservas' },
    { icon: '👥', label: 'Mis Amigos' },
  ]}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '30px' }}>
      <MetricCard title="Próximo Partido" value="Hoy, 8:00 PM" subtitle="Fútbol 7 • Cancha El Clásico" color="#3b82f6" />
      <MetricCard title="Puntos PlayStop" value="1,250 pts" subtitle="Tienes S/ 15 de descuento" color="#00d084" />
      <MetricCard title="Partidos Jugados" value="24" subtitle="+3 este mes" color="#f59e0b" />
    </div>
    <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#0f172a' }}>Canchas recomendadas para ti</h3>
      <div style={{ height: '200px', backgroundColor: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>[Mapa o Lista de Canchas aquí]</div>
    </div>
  </DashboardLayout>
);

export const PropietarioDashboard = ({ user, onLogout }) => (
  <DashboardLayout user={user} onLogout={onLogout} title="Panel del Complejo" menuItems={[
    { icon: '📊', label: 'Dashboard', active: true },
    { icon: '📅', label: 'Calendario de Reservas' },
    { icon: '🏟️', label: 'Mis Canchas' },
    { icon: '💰', label: 'Finanzas' },
  ]}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '30px' }}>
      <MetricCard title="Ingresos de Hoy" value="S/ 1,450" subtitle="↑ 12% vs ayer" color="#00d084" />
      <MetricCard title="Reservas Activas" value="18" subtitle="4 pendientes de pago" color="#f59e0b" />
      <MetricCard title="Ocupación" value="85%" subtitle="Casi lleno" color="#3b82f6" />
    </div>
    <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#0f172a' }}>Calendario de Ocupación</h3>
      <div style={{ height: '300px', backgroundColor: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>[Gráfico de Calendario aquí]</div>
    </div>
  </DashboardLayout>
);

export const AdminDashboard = ({ user, onLogout }) => (
  <DashboardLayout user={user} onLogout={onLogout} title="Administración Central" menuItems={[
    { icon: '⚡', label: 'Resumen', active: true },
    { icon: '🏢', label: 'Clubes Afiliados' },
    { icon: '🧑', label: 'Usuarios' },
    { icon: '🎧', label: 'Soporte y Tickets' },
  ]}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '30px' }}>
      <MetricCard title="Nuevos Clubes" value="12" subtitle="Pendientes de aprobación" color="#f59e0b" />
      <MetricCard title="Usuarios Activos" value="4,521" subtitle="↑ 8% esta semana" color="#00d084" />
      <MetricCard title="Tickets Abiertos" value="5" subtitle="3 de prioridad alta" color="#ef4444" />
    </div>
    <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#0f172a' }}>Últimas transacciones en la plataforma</h3>
      <div style={{ height: '300px', backgroundColor: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>[Tabla de Transacciones aquí]</div>
    </div>
  </DashboardLayout>
);

export const SuperAdminDashboard = ({ user, onLogout }) => (
  <DashboardLayout user={user} onLogout={onLogout} title="Centro de Control (Root)" menuItems={[
    { icon: '👑', label: 'Global', active: true },
    { icon: '📈', label: 'Métricas Financieras' },
    { icon: '⚙️', label: 'Configuración del Sistema' },
    { icon: '🛡️', label: 'Seguridad y Logs' },
  ]}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '30px' }}>
      <MetricCard title="MRR (Ingreso Mensual)" value="$ 45,200" subtitle="↑ 24% vs mes anterior" color="#00d084" />
      <MetricCard title="Estado del Servidor" value="99.9%" subtitle="Todo funcionando" color="#3b82f6" />
      <MetricCard title="Transacciones Fallidas" value="0.02%" subtitle="Salud óptima" color="#00d084" />
      <MetricCard title="Clubes Totales" value="342" subtitle="En 4 países" color="#8b5cf6" />
    </div>
    <div style={{ display: 'flex', gap: '24px' }}>
      <div style={{ flex: 2, backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#0f172a' }}>Crecimiento de Ingresos</h3>
        <div style={{ height: '300px', backgroundColor: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>[Gráfico de Crecimiento aquí]</div>
      </div>
      <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#0f172a' }}>Alertas del Sistema</h3>
        <div style={{ height: '300px', backgroundColor: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>[Log de Errores]</div>
      </div>
    </div>
  </DashboardLayout>
);