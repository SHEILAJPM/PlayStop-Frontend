import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { DashboardLayout, MetricCard } from './DashboardLayout.jsx';
import { api } from '../../services/api.js';

// ── constants ─────────────────────────────────────────────────────────────────
const STATUS_META = {
  PENDING:   { label: 'Pendiente',  bg: '#fef3c7', color: '#b45309', dot: '#f59e0b' },
  CONFIRMED: { label: 'Confirmada', bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  CANCELLED: { label: 'Cancelada',  bg: '#fee2e2', color: '#dc2626', dot: '#ef4444' },
  COMPLETED: { label: 'Completada', bg: '#d1fae5', color: '#047857', dot: '#10b981' },
  ATTENDED:  { label: 'Asistió',    bg: '#ede9fe', color: '#6d28d9', dot: '#8b5cf6' },
};
const SPORT_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316'];
const PAGE_SIZE = 12;

// ── helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtCurrency = (n) =>
  `S/ ${Number(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const exportCSV = (rows, filename) => {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(','), ...rows.map(r =>
    keys.map(k => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(',')
  )].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' }));
  a.download = filename; a.click();
};

// ── shared styles ─────────────────────────────────────────────────────────────
const card  = { backgroundColor:'#fff', borderRadius:18, padding:'24px 28px', boxShadow:'0 1px 4px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)', border:'1px solid #f1f5f9' };
const thSt  = { padding:'12px 16px', textAlign:'left', fontSize:'0.74rem', fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.6px', borderBottom:'2px solid #f1f5f9', whiteSpace:'nowrap', backgroundColor:'#f8fafc', userSelect:'none' };
const tdSt  = { padding:'14px 16px', borderBottom:'1px solid #f8fafc', verticalAlign:'middle' };
const btn   = (bg, fg) => ({ padding:'5px 13px', borderRadius:8, border:'none', fontWeight:700, cursor:'pointer', fontSize:'0.8rem', backgroundColor:bg, color:fg, transition:'opacity 0.15s' });
const input = { padding:'9px 14px 9px 36px', borderRadius:10, border:'1.5px solid #e2e8f0', outline:'none', fontSize:'0.88rem', backgroundColor:'#fff' };
const sel   = { padding:'9px 14px', borderRadius:10, border:'1.5px solid #e2e8f0', outline:'none', fontSize:'0.88rem', cursor:'pointer', backgroundColor:'#fff' };

// ── small reusable components ─────────────────────────────────────────────────
const StatusBadge = memo(({ status }) => {
  const m = STATUS_META[status] || { label: status, bg:'#f1f5f9', color:'#475569', dot:'#94a3b8' };
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px',
      borderRadius:8, fontSize:'0.74rem', fontWeight:700, backgroundColor:m.bg, color:m.color, whiteSpace:'nowrap' }}>
      <span style={{ width:6, height:6, borderRadius:'50%', backgroundColor:m.dot, flexShrink:0 }} />{m.label}
    </span>
  );
});

const EnabledBadge = memo(({ enabled }) => (
  <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px',
    borderRadius:8, fontSize:'0.74rem', fontWeight:700,
    backgroundColor:enabled?'#d1fae5':'#fee2e2', color:enabled?'#047857':'#ef4444' }}>
    <span style={{ width:6, height:6, borderRadius:'50%', backgroundColor:enabled?'#10b981':'#ef4444', flexShrink:0 }} />
    {enabled ? 'Activo' : 'Suspendido'}
  </span>
));

const Avatar = memo(({ name, bg = '6366f1', size = 34 }) => (
  <div style={{ width:size, height:size, borderRadius:'50%', flexShrink:0,
    backgroundImage:`url(https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=${size*2})`,
    backgroundSize:'cover' }} />
));

const SearchInput = memo(({ value, onChange, placeholder }) => (
  <div style={{ position:'relative', display:'inline-flex', alignItems:'center' }}>
    <span style={{ position:'absolute', left:10, color:'#94a3b8', fontSize:'0.85rem', pointerEvents:'none' }}>🔍</span>
    <input type="text" value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} style={{ ...input, minWidth:220 }}
      onFocus={e => e.target.style.borderColor='#6366f1'}
      onBlur={e  => e.target.style.borderColor='#e2e8f0'} />
  </div>
));

const SortTh = memo(({ k, label, sortKey, sortDir, onToggle }) => (
  <th onClick={() => onToggle(k)} style={{ ...thSt, cursor:'pointer' }}>
    <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
      {label}
      <span style={{ fontSize:'0.6rem', color:sortKey===k?'#6366f1':'#cbd5e1' }}>
        {sortKey===k ? (sortDir==='asc'?'▲':'▼') : '⇅'}
      </span>
    </span>
  </th>
));

const SkeletonRow = ({ cols }) => (
  <tr>
    {Array(cols).fill(0).map((_, i) => (
      <td key={i} style={{ padding:'14px 16px' }}>
        <div style={{ height:13, borderRadius:7, backgroundColor:'#f1f5f9', width:i===0?'65%':'50%',
          animation:'adminPulse 1.4s ease infinite' }} />
      </td>
    ))}
  </tr>
);

// ── SVG Bar Chart ─────────────────────────────────────────────────────────────
const BarChart = memo(({ data, valueKey, labelKey, color = '#6366f1', height = 200 }) => {
  if (!data?.length) return (
    <div style={{ height, display:'flex', alignItems:'center', justifyContent:'center', color:'#cbd5e1', fontSize:'0.85rem' }}>
      Sin datos aún
    </div>
  );
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  const W = 400, cw = W / data.length, bw = Math.max(cw - 14, 10), ch = height - 36;
  const gradId = `bg${color.replace('#','')}`;
  return (
    <svg viewBox={`0 0 ${W} ${height}`} style={{ width:'100%', height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.85" />
          <stop offset="100%" stopColor={color} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {[0.25,0.5,0.75,1].map(p => (
        <line key={p} x1={0} y1={ch*(1-p)} x2={W} y2={ch*(1-p)} stroke="#f1f5f9" strokeWidth={1} />
      ))}
      {data.map((d, i) => {
        const bh = Math.max((d[valueKey] / max) * ch, 2);
        const x  = i * cw + (cw - bw) / 2;
        const y  = ch - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx={5} fill={`url(#${gradId})`} />
            <text x={x+bw/2} y={height-4} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="system-ui">
              {d[labelKey]}
            </text>
            {bh > 16 && (
              <text x={x+bw/2} y={y-5} textAnchor="middle" fontSize={9} fill="#475569" fontWeight="700" fontFamily="system-ui">
                {d[valueKey]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
});

// ── SVG Donut Chart ───────────────────────────────────────────────────────────
const DonutChart = memo(({ segments, size = 150 }) => {
  const total = segments.reduce((s, d) => s + (d.value || 0), 0);
  if (!total) return <div style={{ width:size, height:size, display:'flex', alignItems:'center', justifyContent:'center', color:'#cbd5e1', fontSize:'0.78rem' }}>Sin datos</div>;
  const cx = size/2, cy = size/2, r = size*0.38, ri = size*0.25;
  let angle = -Math.PI/2;
  return (
    <svg width={size} height={size}>
      {segments.map((seg, i) => {
        if (!seg.value) return null;
        const sweep = (seg.value / total) * 2 * Math.PI;
        const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
        angle += sweep;
        const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle);
        return (
          <path key={i} d={`M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${sweep>Math.PI?1:0} 1 ${x2} ${y2}Z`}
            fill={seg.color} opacity={0.9} />
        );
      })}
      <circle cx={cx} cy={cy} r={ri} fill="#fff" />
      <text x={cx} y={cy-5} textAnchor="middle" fontSize={19} fontWeight="900" fill="#0f172a" fontFamily="system-ui">{total}</text>
      <text x={cx} y={cy+13} textAnchor="middle" fontSize={8} fill="#94a3b8" fontFamily="system-ui">TOTAL</text>
    </svg>
  );
});

// ── Pagination ────────────────────────────────────────────────────────────────
const PaginationBar = memo(({ page, totalPages, setPage, total }) => {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:20, flexWrap:'wrap', gap:10 }}>
      <span style={{ fontSize:'0.8rem', color:'#94a3b8' }}>
        {Math.min((page-1)*PAGE_SIZE+1,total)}–{Math.min(page*PAGE_SIZE,total)} de {total} registros
      </span>
      <div style={{ display:'flex', gap:5 }}>
        {[
          { label:'‹', onClick:() => setPage(p => Math.max(p-1,1)), disabled:page<=1 },
          ...Array.from({length:Math.min(totalPages,5)},(_,i) => {
            const p = totalPages<=5 ? i+1 : page<=3 ? i+1 : page>=totalPages-2 ? totalPages-4+i : page-2+i;
            return { label:String(p), onClick:() => setPage(p), active:p===page };
          }),
          { label:'›', onClick:() => setPage(p => Math.min(p+1,totalPages)), disabled:page>=totalPages },
        ].map((b, i) => (
          <button key={i} onClick={b.onClick} disabled={b.disabled}
            style={{ ...btn(b.active?'#6366f1':'#f8fafc', b.active?'#fff':'#64748b'),
              border:`1.5px solid ${b.active?'#6366f1':'#e2e8f0'}`, minWidth:34, padding:'5px 8px',
              opacity:b.disabled?0.35:1 }}>
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
});

// ── Toast ─────────────────────────────────────────────────────────────────────
const ToastContainer = memo(({ toasts }) => (
  <div style={{ position:'fixed', bottom:24, right:24, zIndex:99999, display:'flex', flexDirection:'column', gap:8 }}>
    {toasts.map(t => (
      <div key={t.id} style={{ padding:'12px 20px', borderRadius:12, fontWeight:700, fontSize:'0.88rem',
        backgroundColor:t.type==='error'?'#ef4444':t.type==='warn'?'#f59e0b':'#10b981',
        color:'#fff', boxShadow:'0 8px 24px rgba(0,0,0,0.2)', animation:'slideInRight 0.3s ease', maxWidth:320 }}>
        {t.type==='error'?'✕ ':t.type==='warn'?'⚠ ':'✓ '}{t.msg}
      </div>
    ))}
  </div>
));

// ── custom hooks ──────────────────────────────────────────────────────────────
const useSortable = (items, defaultKey = '') => {
  const [sortKey, setSortKey] = useState(defaultKey);
  const [sortDir, setSortDir] = useState('asc');
  const toggle = useCallback((key) => {
    setSortDir(d => sortKey === key ? (d==='asc'?'desc':'asc') : 'asc');
    setSortKey(key);
  }, [sortKey]);
  const sorted = useMemo(() => {
    if (!sortKey) return items;
    return [...items].sort((a, b) => {
      const av = String(a[sortKey]??'').toLowerCase();
      const bv = String(b[sortKey]??'').toLowerCase();
      return sortDir==='asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [items, sortKey, sortDir]);
  return { sorted, sortKey, sortDir, toggle };
};

const usePagination = (items) => {
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [items.length]);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paged = items.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  return { paged, page, totalPages, setPage };
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const AdminDashboard = ({ user, onLogout, darkMode, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const [stats,        setStats]        = useState(null);
  const [analytics,    setAnalytics]    = useState(null);
  const [users,        setUsers]        = useState([]);
  const [owners,       setOwners]       = useState([]);
  const [courts,       setCourts]       = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [toasts,       setToasts]       = useState([]);
  const [modal,        setModal]        = useState({ show:false, type:null, payload:null });
  const [ownerCourtsData,    setOwnerCourtsData]    = useState([]);
  const [ownerCourtsLoading, setOwnerCourtsLoading] = useState(false);

  // search / filter
  const [userSearch,  setUserSearch]  = useState('');
  const [ownerSearch, setOwnerSearch] = useState('');
  const [courtSearch, setCourtSearch] = useState('');
  const [courtSport,  setCourtSport]  = useState('TODOS');
  const [courtStatus, setCourtStatus] = useState('TODOS');
  const [resSearch,   setResSearch]   = useState('');
  const [resStatus,   setResStatus]   = useState('TODOS');
  const [resDateFrom, setResDateFrom] = useState('');
  const [resDateTo,   setResDateTo]   = useState('');

  // ── toast ──
  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  // ── loader ──
  const load = useCallback(async (fn, setter, silent = false) => {
    if (!silent) setLoading(true);
    try { setter(await fn()); }
    catch (e) { toast(e.message, 'error'); }
    finally { if (!silent) setLoading(false); }
  }, [toast]);

  useEffect(() => {
    load(api.getAdminStats,     setStats,     true);
    load(api.getAdminAnalytics, setAnalytics, true);
  }, [load]);

  useEffect(() => {
    if (activeTab === 'Jugadores')    load(api.getAdminUsers,           setUsers);
    if (activeTab === 'Propietarios') load(api.getAdminOwners,          setOwners);
    if (activeTab === 'Canchas')      load(api.getAdminCourts,          setCourts);
    if (activeTab === 'Reservas')     load(api.getAdminAllReservations, setReservations);
  }, [activeTab, load]);

  // ── modal ──
  const openModal  = (type, payload = null) => setModal({ show:true, type, payload });
  const closeModal = () => { setModal({ show:false, type:null, payload:null }); setOwnerCourtsData([]); };

  const openOwnerCourts = async (owner) => {
    openModal('OWNER_COURTS', owner);
    setOwnerCourtsLoading(true);
    try { setOwnerCourtsData(await api.getOwnerCourts(owner.id)); }
    catch { setOwnerCourtsData([]); }
    finally { setOwnerCourtsLoading(false); }
  };

  // ── actions ──
  const handleToggleUser = async (u) => {
    try {
      const res = await api.toggleUserStatus(u.id);
      const patch = list => list.map(x => x.id===u.id ? {...x, enabled:res.enabled} : x);
      setUsers(patch); setOwners(patch);
      toast(`${u.name} ${res.enabled?'activado':'suspendido'}`);
    } catch(e) { toast(e.message,'error'); }
    closeModal();
  };

  const handleDeleteUser = async (u) => {
    try {
      await api.deleteAdminUser(u.id);
      setUsers(p => p.filter(x => x.id!==u.id));
      setOwners(p => p.filter(x => x.id!==u.id));
      toast(`Cuenta de ${u.name} eliminada`);
    } catch(e) { toast(e.message,'error'); }
    closeModal();
  };

  const handleToggleCourt = async (c) => {
    try {
      const res = await api.toggleCourtStatus(c.id);
      setCourts(p => p.map(x => x.id===c.id ? {...x, active:res.active} : x));
      toast(`Cancha ${c.name} ${res.active?'activada':'desactivada'}`);
    } catch(e) { toast(e.message,'error'); }
    closeModal();
  };

  // ── filtered lists ──
  const filteredUsers = useMemo(() => users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  ), [users, userSearch]);

  const filteredOwners = useMemo(() => owners.filter(o =>
    o.name.toLowerCase().includes(ownerSearch.toLowerCase()) ||
    o.email.toLowerCase().includes(ownerSearch.toLowerCase())
  ), [owners, ownerSearch]);

  const sportTypes = useMemo(() => ['TODOS', ...new Set(courts.map(c => c.sportType))], [courts]);

  const filteredCourts = useMemo(() => courts.filter(c => {
    const txt = c.name.toLowerCase().includes(courtSearch.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(courtSearch.toLowerCase()) ||
      (c.city||'').toLowerCase().includes(courtSearch.toLowerCase());
    const sp = courtSport  === 'TODOS' || c.sportType === courtSport;
    const st = courtStatus === 'TODOS' || (courtStatus==='ACTIVA' ? c.active : !c.active);
    return txt && sp && st;
  }), [courts, courtSearch, courtSport, courtStatus]);

  const filteredRes = useMemo(() => reservations.filter(r => {
    const txt = r.clientName.toLowerCase().includes(resSearch.toLowerCase()) ||
      r.courtName.toLowerCase().includes(resSearch.toLowerCase());
    const st  = resStatus === 'TODOS' || r.status === resStatus;
    const fr  = !resDateFrom || r.date >= resDateFrom;
    const to  = !resDateTo   || r.date <= resDateTo;
    return txt && st && fr && to;
  }), [reservations, resSearch, resStatus, resDateFrom, resDateTo]);

  // ── sort + paginate ──
  const uSort = useSortable(filteredUsers,  'name');
  const oSort = useSortable(filteredOwners, 'name');
  const cSort = useSortable(filteredCourts, 'name');
  const rSort = useSortable(filteredRes,    'date');
  const uPage = usePagination(uSort.sorted);
  const oPage = usePagination(oSort.sorted);
  const cPage = usePagination(cSort.sorted);
  const rPage = usePagination(rSort.sorted);

  // ── analytics data ──
  const statusSegments = useMemo(() =>
    Object.entries(stats?.byStatus || {}).map(([k,v]) => ({
      value:Number(v), color:STATUS_META[k]?.dot||'#94a3b8', label:STATUS_META[k]?.label||k
    })), [stats]);

  const sportSegments = useMemo(() =>
    Object.entries(analytics?.sportDistribution || {}).map(([k,v],i) => ({
      name:k, value:Number(v), color:SPORT_COLORS[i%SPORT_COLORS.length]
    })).sort((a,b) => b.value-a.value), [analytics]);

  // ── helper: section header ──
  const SectionHeader = ({ title, subtitle, count, onExport, exportFile }) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
      <div>
        <h3 style={{ margin:'0 0 3px', color:'#0f172a', fontSize:'1.1rem', fontWeight:800 }}>{title}</h3>
        {subtitle && <p style={{ margin:0, color:'#94a3b8', fontSize:'0.79rem' }}>{count} {subtitle}</p>}
      </div>
      {onExport && (
        <button onClick={onExport} style={{ ...btn('#f8fafc','#0f172a'), border:'1.5px solid #e2e8f0', fontSize:'0.82rem' }}>
          ⬇ Exportar CSV
        </button>
      )}
    </div>
  );

  // ── loading rows helper ──
  const Skeletons = ({ cols, n = 6 }) =>
    loading ? Array(n).fill(0).map((_,i) => <SkeletonRow key={i} cols={cols} />) : null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
    <style>{`
      @keyframes adminPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
      @keyframes slideInRight { from{opacity:0;transform:translateX(36px)} to{opacity:1;transform:translateX(0)} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
      .adm-row:hover td { background-color:#f8fafc; }
    `}</style>

    <DashboardLayout user={user} onLogout={onLogout} darkMode={darkMode} toggleTheme={toggleTheme}
      title={activeTab === 'Dashboard' ? 'Panel de Administración' : activeTab}
      activeTab={activeTab} onTabChange={setActiveTab}
      menuItems={[
        { icon:'⚡', label:'Dashboard'     },
        { icon:'📈', label:'Analíticas'    },
        { icon:'🧑', label:'Jugadores'     },
        { icon:'🏢', label:'Propietarios'  },
        { icon:'🏟️', label:'Canchas'       },
        { icon:'📅', label:'Reservas'      },
        { icon:'🔔', label:'Actividad'     },
        { icon:'👤', label:'Mi Perfil'     },
      ]}>

      {/* ══════════ DASHBOARD ══════════════════════════════════════════════════ */}
      {activeTab === 'Dashboard' && (
        <>
          {/* KPIs */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:22 }}>
            <MetricCard title="Jugadores"    value={String(stats?.totalUsers??'—')}        subtitle="Registrados" color="#6366f1" trend="up" />
            <MetricCard title="Propietarios" value={String(stats?.totalOwners??'—')}        subtitle="Gestores" color="#8b5cf6" trend="up" />
            <MetricCard title="Canchas"      value={String(stats?.totalCourts??'—')}        subtitle="Plataforma" color="#f59e0b" trend="up" />
            <MetricCard title="Reservas"     value={String(stats?.totalReservations??'—')}  subtitle="Total" color="#10b981" trend="up" />
            <MetricCard title="Ingresos"     value={fmtCurrency(analytics?.totalRevenue)}   subtitle="No canceladas" color="#0ea5e9" trend="up" />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:20, marginBottom:20 }}>

            {/* Estado reservas */}
            <div style={card}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
                <div>
                  <h3 style={{ margin:'0 0 3px', color:'#0f172a', fontSize:'1rem', fontWeight:800 }}>Estado de Reservas</h3>
                  <p style={{ margin:0, color:'#94a3b8', fontSize:'0.77rem' }}>Distribución actual</p>
                </div>
                <DonutChart segments={statusSegments} size={86} />
              </div>
              {statusSegments.map(s => {
                const pct = stats?.totalReservations ? Math.round(s.value/stats.totalReservations*100) : 0;
                return (
                  <div key={s.label} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:9 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', backgroundColor:s.color, flexShrink:0 }} />
                    <span style={{ flex:1, fontSize:'0.81rem', color:'#475569', fontWeight:600 }}>{s.label}</span>
                    <span style={{ fontWeight:800, color:'#0f172a', fontSize:'0.85rem', minWidth:24, textAlign:'right' }}>{s.value}</span>
                    <span style={{ fontSize:'0.74rem', color:'#94a3b8', minWidth:34, textAlign:'right' }}>{pct}%</span>
                  </div>
                );
              })}
            </div>

            {/* Top canchas */}
            <div style={card}>
              <h3 style={{ margin:'0 0 18px', color:'#0f172a', fontSize:'1rem', fontWeight:800 }}>Top Canchas más Reservadas</h3>
              {!(stats?.topCourts?.length) ? (
                <p style={{ color:'#94a3b8', fontSize:'0.85rem' }}>Sin datos aún</p>
              ) : stats.topCourts.map((c, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                  <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem',
                    backgroundColor:i===0?'#fef3c7':i===1?'#f1f5f9':'#f8fafc',
                    fontWeight:900, color:i===0?'#b45309':'#94a3b8' }}>
                    {i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:'#0f172a', fontSize:'0.87rem', marginBottom:4 }}>{c.name}</div>
                    <div style={{ height:5, borderRadius:4, backgroundColor:'#f1f5f9', overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:4, backgroundColor:'#6366f1',
                        width:`${Math.round(c.count/(stats.topCourts[0]?.count||1)*100)}%`, transition:'width 0.7s' }} />
                    </div>
                  </div>
                  <span style={{ fontWeight:800, color:'#0f172a', fontSize:'0.87rem', minWidth:24, textAlign:'right' }}>{c.count}</span>
                </div>
              ))}
            </div>

            {/* Nuevos jugadores */}
            <div style={card}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                <h3 style={{ margin:0, color:'#0f172a', fontSize:'1rem', fontWeight:800 }}>Nuevos Jugadores</h3>
                <button onClick={() => setActiveTab('Jugadores')} style={{ ...btn('#f0f0ff','#6366f1'), fontSize:'0.74rem' }}>Ver todos →</button>
              </div>
              {!(stats?.recentUsers?.length) ? <p style={{ color:'#94a3b8', fontSize:'0.85rem' }}>Sin datos</p>
              : stats.recentUsers.map((u,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:13 }}>
                  <Avatar name={u.name} bg="6366f1" size={36} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, color:'#0f172a', fontSize:'0.87rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name}</div>
                    <div style={{ fontSize:'0.74rem', color:'#94a3b8' }}>{fmtDate(u.createdAt)}</div>
                  </div>
                  <div style={{ width:7, height:7, borderRadius:'50%', backgroundColor:'#10b981', flexShrink:0 }} />
                </div>
              ))}
            </div>

            {/* Actividad reciente */}
            <div style={card}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                <h3 style={{ margin:0, color:'#0f172a', fontSize:'1rem', fontWeight:800 }}>Actividad Reciente</h3>
                <button onClick={() => setActiveTab('Actividad')} style={{ ...btn('#f0f0ff','#6366f1'), fontSize:'0.74rem' }}>Ver todo →</button>
              </div>
              {!(analytics?.recentActivity?.length) ? <p style={{ color:'#94a3b8', fontSize:'0.85rem' }}>Sin actividad</p>
              : analytics.recentActivity.slice(0,5).map((r,i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:13 }}>
                  <div style={{ width:34, height:34, borderRadius:9, backgroundColor:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', flexShrink:0 }}>📅</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, color:'#0f172a', fontSize:'0.85rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.clientName}</div>
                    <div style={{ fontSize:'0.74rem', color:'#94a3b8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.courtName} · {r.date}</div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Mini chart */}
          <div style={card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <div>
                <h3 style={{ margin:'0 0 3px', color:'#0f172a', fontSize:'1rem', fontWeight:800 }}>Reservas — Últimos 6 meses</h3>
                <p style={{ margin:0, color:'#94a3b8', fontSize:'0.77rem' }}>Tendencia de actividad mensual</p>
              </div>
              <button onClick={() => setActiveTab('Analíticas')} style={{ ...btn('#f0f0ff','#6366f1'), fontSize:'0.74rem' }}>Ver analíticas →</button>
            </div>
            <BarChart data={analytics?.monthly||[]} valueKey="count" labelKey="label" color="#6366f1" height={170} />
          </div>
        </>
      )}

      {/* ══════════ ANALÍTICAS ═════════════════════════════════════════════════ */}
      {activeTab === 'Analíticas' && (
        <>
          {/* ingreso hero */}
          <div style={{ ...card, background:'linear-gradient(135deg,#1a1a2e 0%,#1e3a5f 50%,#0f3460 100%)', border:'none', marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
              <div>
                <p style={{ margin:'0 0 6px', color:'rgba(255,255,255,0.45)', fontSize:'0.74rem', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' }}>Ingreso Total Generado</p>
                <h2 style={{ margin:'0 0 6px', color:'#fff', fontSize:'2.2rem', fontWeight:900 }}>{fmtCurrency(analytics?.totalRevenue)}</h2>
                <p style={{ margin:0, color:'rgba(255,255,255,0.35)', fontSize:'0.79rem' }}>Excluye reservas canceladas</p>
              </div>
              <div style={{ display:'flex', gap:28 }}>
                {[
                  ['Completadas', stats?.byStatus?.COMPLETED??0, '#10b981'],
                  ['Asistieron',  stats?.byStatus?.ATTENDED??0,  '#818cf8'],
                  ['Canceladas',  stats?.byStatus?.CANCELLED??0, '#f87171'],
                ].map(([l,v,c]) => (
                  <div key={l} style={{ textAlign:'center' }}>
                    <div style={{ fontSize:'1.5rem', fontWeight:900, color:c }}>{v}</div>
                    <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:20, marginBottom:20 }}>
            <div style={card}>
              <h3 style={{ margin:'0 0 3px', color:'#0f172a', fontSize:'1rem', fontWeight:800 }}>Reservas por mes</h3>
              <p style={{ margin:'0 0 16px', color:'#94a3b8', fontSize:'0.77rem' }}>Últimos 6 meses</p>
              <BarChart data={analytics?.monthly||[]} valueKey="count" labelKey="label" color="#6366f1" height={200} />
            </div>
            <div style={card}>
              <h3 style={{ margin:'0 0 3px', color:'#0f172a', fontSize:'1rem', fontWeight:800 }}>Ingresos por mes (S/)</h3>
              <p style={{ margin:'0 0 16px', color:'#94a3b8', fontSize:'0.77rem' }}>Sin reservas canceladas</p>
              <BarChart data={(analytics?.monthly||[]).map(m=>({...m,rev:Math.round(m.revenue)}))} valueKey="rev" labelKey="label" color="#10b981" height={200} />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:20 }}>
            {/* donut grande */}
            <div style={card}>
              <h3 style={{ margin:'0 0 20px', color:'#0f172a', fontSize:'1rem', fontWeight:800 }}>Distribución por estado</h3>
              <div style={{ display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
                <DonutChart segments={statusSegments} size={150} />
                <div style={{ flex:1, minWidth:130 }}>
                  {statusSegments.map(s => (
                    <div key={s.label} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                      <div style={{ width:10, height:10, borderRadius:3, backgroundColor:s.color, flexShrink:0 }} />
                      <span style={{ flex:1, fontSize:'0.81rem', color:'#475569', fontWeight:600 }}>{s.label}</span>
                      <span style={{ fontWeight:800, color:'#0f172a', fontSize:'0.85rem' }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* deportes */}
            <div style={card}>
              <h3 style={{ margin:'0 0 20px', color:'#0f172a', fontSize:'1rem', fontWeight:800 }}>Reservas por deporte</h3>
              {!sportSegments.length ? <p style={{ color:'#94a3b8', fontSize:'0.85rem' }}>Sin datos</p>
              : (() => {
                const maxV = Math.max(...sportSegments.map(s=>s.value),1);
                return sportSegments.map(s => (
                  <div key={s.name} style={{ marginBottom:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:'0.84rem', fontWeight:700, color:'#334155' }}>{s.name}</span>
                      <span style={{ fontSize:'0.84rem', fontWeight:800, color:'#0f172a' }}>{s.value}</span>
                    </div>
                    <div style={{ height:8, borderRadius:8, backgroundColor:'#f1f5f9', overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:8, backgroundColor:s.color, width:`${(s.value/maxV)*100}%`, transition:'width 0.7s' }} />
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* accesos rápidos analíticas */}
            <div style={card}>
              <h3 style={{ margin:'0 0 18px', color:'#0f172a', fontSize:'1rem', fontWeight:800 }}>Ir a sección</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  ['🧑','Jugadores','#6366f1'],['🏢','Propietarios','#8b5cf6'],
                  ['🏟️','Canchas','#f59e0b'],['📅','Reservas','#10b981'],['🔔','Actividad','#0ea5e9'],
                ].map(([ic,label,color]) => (
                  <button key={label} onClick={() => setActiveTab(label)}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 16px', borderRadius:10,
                      border:`1.5px solid ${color}20`, backgroundColor:`${color}0d`, cursor:'pointer',
                      fontWeight:700, color, fontSize:'0.88rem', transition:'all 0.2s' }}>
                    {ic} {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════ JUGADORES ══════════════════════════════════════════════════ */}
      {activeTab === 'Jugadores' && (
        <div style={card}>
          <SectionHeader title="Gestión de Jugadores" subtitle="jugadores" count={filteredUsers.length}
            onExport={() => exportCSV(filteredUsers,'jugadores.csv')} />
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:18 }}>
            <SearchInput value={userSearch} onChange={setUserSearch} placeholder="Buscar jugador..." />
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>
                {[['name','Jugador'],['email','Email'],['phone','Teléfono'],['createdAt','Registro']].map(([k,l]) =>
                  <SortTh key={k} k={k} label={l} sortKey={uSort.sortKey} sortDir={uSort.sortDir} onToggle={uSort.toggle} />)}
                <th style={thSt}>Estado</th><th style={thSt}>Acciones</th>
              </tr></thead>
              <tbody>
                <Skeletons cols={6} />
                {!loading && uPage.paged.map(u => (
                  <tr key={u.id} className="adm-row">
                    <td style={tdSt}><div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Avatar name={u.name} bg="6366f1" size={32} />
                      <span style={{ fontWeight:700, color:'#0f172a', fontSize:'0.88rem' }}>{u.name}</span>
                    </div></td>
                    <td style={{ ...tdSt, color:'#475569', fontSize:'0.85rem' }}>{u.email}</td>
                    <td style={{ ...tdSt, color:'#64748b', fontSize:'0.85rem' }}>{u.phone||'—'}</td>
                    <td style={{ ...tdSt, color:'#94a3b8', fontSize:'0.79rem', whiteSpace:'nowrap' }}>{fmtDate(u.createdAt)}</td>
                    <td style={tdSt}><EnabledBadge enabled={u.enabled} /></td>
                    <td style={tdSt}><div style={{ display:'flex', gap:5 }}>
                      <button onClick={() => openModal('TOGGLE_USER',u)} style={btn(u.enabled?'#fef3c7':'#d1fae5',u.enabled?'#b45309':'#047857')}>{u.enabled?'Suspender':'Activar'}</button>
                      <button onClick={() => openModal('DELETE_USER',u)} style={btn('#fee2e2','#dc2626')}>Eliminar</button>
                    </div></td>
                  </tr>
                ))}
                {!loading && !filteredUsers.length && <tr><td colSpan={6} style={{ textAlign:'center', color:'#94a3b8', padding:'36px' }}>Sin resultados</td></tr>}
              </tbody>
            </table>
          </div>
          <PaginationBar page={uPage.page} totalPages={uPage.totalPages} setPage={uPage.setPage} total={filteredUsers.length} />
        </div>
      )}

      {/* ══════════ PROPIETARIOS ═══════════════════════════════════════════════ */}
      {activeTab === 'Propietarios' && (
        <div style={card}>
          <SectionHeader title="Gestión de Propietarios" subtitle="propietarios" count={filteredOwners.length}
            onExport={() => exportCSV(filteredOwners,'propietarios.csv')} />
          <div style={{ marginBottom:18 }}>
            <SearchInput value={ownerSearch} onChange={setOwnerSearch} placeholder="Buscar propietario..." />
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>
                {[['name','Propietario'],['email','Email'],['phone','Teléfono']].map(([k,l]) =>
                  <SortTh key={k} k={k} label={l} sortKey={oSort.sortKey} sortDir={oSort.sortDir} onToggle={oSort.toggle} />)}
                <th style={thSt}>Canchas</th><th style={thSt}>Registro</th><th style={thSt}>Estado</th><th style={thSt}>Acciones</th>
              </tr></thead>
              <tbody>
                <Skeletons cols={7} />
                {!loading && oPage.paged.map(o => (
                  <tr key={o.id} className="adm-row">
                    <td style={tdSt}><div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Avatar name={o.name} bg="8b5cf6" size={32} />
                      <span style={{ fontWeight:700, color:'#0f172a', fontSize:'0.88rem' }}>{o.name}</span>
                    </div></td>
                    <td style={{ ...tdSt, color:'#475569', fontSize:'0.85rem' }}>{o.email}</td>
                    <td style={{ ...tdSt, color:'#64748b', fontSize:'0.85rem' }}>{o.phone||'—'}</td>
                    <td style={tdSt}>
                      <button onClick={() => openOwnerCourts(o)} style={{ ...btn('#ede9fe','#6d28d9'), display:'inline-flex', alignItems:'center', gap:4 }}>🏟️ {o.courts}</button>
                    </td>
                    <td style={{ ...tdSt, color:'#94a3b8', fontSize:'0.79rem', whiteSpace:'nowrap' }}>{fmtDate(o.createdAt)}</td>
                    <td style={tdSt}><EnabledBadge enabled={o.enabled} /></td>
                    <td style={tdSt}><div style={{ display:'flex', gap:5 }}>
                      <button onClick={() => openModal('TOGGLE_USER',o)} style={btn(o.enabled?'#fef3c7':'#d1fae5',o.enabled?'#b45309':'#047857')}>{o.enabled?'Suspender':'Activar'}</button>
                      <button onClick={() => openModal('DELETE_USER',o)} style={btn('#fee2e2','#dc2626')}>Eliminar</button>
                    </div></td>
                  </tr>
                ))}
                {!loading && !filteredOwners.length && <tr><td colSpan={7} style={{ textAlign:'center', color:'#94a3b8', padding:'36px' }}>Sin resultados</td></tr>}
              </tbody>
            </table>
          </div>
          <PaginationBar page={oPage.page} totalPages={oPage.totalPages} setPage={oPage.setPage} total={filteredOwners.length} />
        </div>
      )}

      {/* ══════════ CANCHAS ════════════════════════════════════════════════════ */}
      {activeTab === 'Canchas' && (
        <div style={card}>
          <SectionHeader title="Gestión de Canchas" subtitle="canchas" count={filteredCourts.length}
            onExport={() => exportCSV(filteredCourts,'canchas.csv')} />
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:18, padding:'14px 16px', backgroundColor:'#f8fafc', borderRadius:12 }}>
            <SearchInput value={courtSearch} onChange={setCourtSearch} placeholder="Nombre, propietario o ciudad..." />
            <select value={courtSport} onChange={e => setCourtSport(e.target.value)} style={sel}>
              {sportTypes.map(s => <option key={s} value={s}>{s==='TODOS'?'Todos los deportes':s}</option>)}
            </select>
            <select value={courtStatus} onChange={e => setCourtStatus(e.target.value)} style={sel}>
              <option value="TODOS">Todos los estados</option>
              <option value="ACTIVA">Activas</option>
              <option value="INACTIVA">Inactivas</option>
            </select>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>
                {[['name','Cancha'],['sportType','Deporte'],['pricePerHour','Precio/h'],['ownerName','Propietario'],['city','Ciudad']].map(([k,l]) =>
                  <SortTh key={k} k={k} label={l} sortKey={cSort.sortKey} sortDir={cSort.sortDir} onToggle={cSort.toggle} />)}
                <th style={thSt}>Estado</th><th style={thSt}>Acción</th>
              </tr></thead>
              <tbody>
                <Skeletons cols={7} />
                {!loading && cPage.paged.map(c => (
                  <tr key={c.id} className="adm-row">
                    <td style={{ ...tdSt, fontWeight:700, color:'#0f172a', fontSize:'0.88rem' }}>{c.name}</td>
                    <td style={tdSt}><span style={{ padding:'3px 8px', borderRadius:6, fontSize:'0.74rem', fontWeight:700, backgroundColor:'#eff6ff', color:'#3b82f6' }}>{c.sportType}</span></td>
                    <td style={{ ...tdSt, fontWeight:800, color:'#0f172a', whiteSpace:'nowrap' }}>S/ {Number(c.pricePerHour).toFixed(2)}</td>
                    <td style={{ ...tdSt, color:'#475569', fontSize:'0.85rem' }}>{c.ownerName}</td>
                    <td style={{ ...tdSt, color:'#64748b', fontSize:'0.85rem' }}>{c.city||'—'}</td>
                    <td style={tdSt}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:8, fontSize:'0.74rem', fontWeight:700,
                        backgroundColor:c.active?'#d1fae5':'#fee2e2', color:c.active?'#047857':'#dc2626' }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', backgroundColor:c.active?'#10b981':'#ef4444' }} />
                        {c.active?'Activa':'Inactiva'}
                      </span>
                    </td>
                    <td style={tdSt}>
                      <button onClick={() => openModal('TOGGLE_COURT',c)} style={btn(c.active?'#fef3c7':'#d1fae5',c.active?'#b45309':'#047857')}>
                        {c.active?'Desactivar':'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && !filteredCourts.length && <tr><td colSpan={7} style={{ textAlign:'center', color:'#94a3b8', padding:'36px' }}>Sin resultados</td></tr>}
              </tbody>
            </table>
          </div>
          <PaginationBar page={cPage.page} totalPages={cPage.totalPages} setPage={cPage.setPage} total={filteredCourts.length} />
        </div>
      )}

      {/* ══════════ RESERVAS ═══════════════════════════════════════════════════ */}
      {activeTab === 'Reservas' && (
        <div style={card}>
          <SectionHeader title="Todas las Reservas" subtitle="reservas" count={filteredRes.length}
            onExport={() => exportCSV(filteredRes,'reservas.csv')} />
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:18, padding:'14px 16px', backgroundColor:'#f8fafc', borderRadius:12 }}>
            <SearchInput value={resSearch} onChange={setResSearch} placeholder="Cliente o cancha..." />
            <select value={resStatus} onChange={e => setResStatus(e.target.value)} style={sel}>
              <option value="TODOS">Todos los estados</option>
              {Object.entries(STATUS_META).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <input type="date" value={resDateFrom} onChange={e => setResDateFrom(e.target.value)} style={{ ...sel, padding:'9px 12px' }} />
            <input type="date" value={resDateTo}   onChange={e => setResDateTo(e.target.value)}   style={{ ...sel, padding:'9px 12px' }} />
            {(resSearch||resStatus!=='TODOS'||resDateFrom||resDateTo) && (
              <button onClick={() => { setResSearch(''); setResStatus('TODOS'); setResDateFrom(''); setResDateTo(''); }} style={btn('#fee2e2','#dc2626')}>✕ Limpiar</button>
            )}
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>
                {[['clientName','Cliente'],['courtName','Cancha'],['ownerName','Propietario'],['date','Fecha'],['slot','Horario']].map(([k,l]) =>
                  <SortTh key={k} k={k} label={l} sortKey={rSort.sortKey} sortDir={rSort.sortDir} onToggle={rSort.toggle} />)}
                <th style={thSt}>Monto</th><th style={thSt}>Estado</th>
              </tr></thead>
              <tbody>
                <Skeletons cols={7} />
                {!loading && rPage.paged.map(r => (
                  <tr key={r.id} className="adm-row">
                    <td style={tdSt}>
                      <div style={{ fontWeight:700, color:'#0f172a', fontSize:'0.88rem' }}>{r.clientName}</div>
                      <div style={{ fontSize:'0.72rem', color:'#94a3b8' }}>{r.clientEmail}</div>
                    </td>
                    <td style={{ ...tdSt, fontWeight:600, color:'#0f172a', fontSize:'0.85rem' }}>{r.courtName}</td>
                    <td style={{ ...tdSt, color:'#475569', fontSize:'0.85rem' }}>{r.ownerName}</td>
                    <td style={{ ...tdSt, color:'#475569', whiteSpace:'nowrap', fontSize:'0.85rem' }}>{r.date}</td>
                    <td style={{ ...tdSt, color:'#475569', whiteSpace:'nowrap', fontSize:'0.85rem' }}>{r.slot}</td>
                    <td style={{ ...tdSt, fontWeight:800, color:'#0f172a', whiteSpace:'nowrap' }}>S/ {Number(r.amount).toFixed(2)}</td>
                    <td style={tdSt}><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
                {!loading && !filteredRes.length && <tr><td colSpan={7} style={{ textAlign:'center', color:'#94a3b8', padding:'36px' }}>Sin resultados</td></tr>}
              </tbody>
            </table>
          </div>
          <PaginationBar page={rPage.page} totalPages={rPage.totalPages} setPage={rPage.setPage} total={filteredRes.length} />
        </div>
      )}

      {/* ══════════ ACTIVIDAD ══════════════════════════════════════════════════ */}
      {activeTab === 'Actividad' && (
        <div style={card}>
          <div style={{ marginBottom:24 }}>
            <h3 style={{ margin:'0 0 3px', color:'#0f172a', fontSize:'1.1rem', fontWeight:800 }}>Feed de Actividad</h3>
            <p style={{ margin:0, color:'#94a3b8', fontSize:'0.79rem' }}>Últimas 20 transacciones registradas en la plataforma</p>
          </div>
          {!(analytics?.recentActivity?.length) && (
            <div style={{ textAlign:'center', padding:'48px 0', color:'#cbd5e1' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📋</div>
              <p style={{ margin:0, fontWeight:600 }}>Sin actividad registrada</p>
            </div>
          )}
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:17, top:0, bottom:0, width:2, backgroundColor:'#f1f5f9', zIndex:0 }} />
            {(analytics?.recentActivity||[]).map((r, i) => {
              const m = STATUS_META[r.status] || STATUS_META.PENDING;
              return (
                <div key={i} style={{ display:'flex', gap:18, marginBottom:16, position:'relative', animation:'fadeUp 0.4s ease both', animationDelay:`${i*0.04}s` }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', backgroundColor:m.bg, border:`2px solid ${m.dot}`,
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, zIndex:1, fontSize:'0.85rem' }}>
                    {r.status==='CANCELLED'?'✕':r.status==='ATTENDED'?'✓':r.status==='COMPLETED'?'★':'●'}
                  </div>
                  <div style={{ flex:1, backgroundColor:'#f8fafc', borderRadius:12, padding:'13px 18px', border:'1px solid #f1f5f9' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6, flexWrap:'wrap', gap:8 }}>
                      <div style={{ fontSize:'0.88rem' }}>
                        <span style={{ fontWeight:700, color:'#0f172a' }}>{r.clientName}</span>
                        <span style={{ color:'#94a3b8' }}> reservó en </span>
                        <span style={{ fontWeight:700, color:'#6366f1' }}>{r.courtName}</span>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                    <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                      <span style={{ fontSize:'0.77rem', color:'#64748b' }}>📅 {r.date}</span>
                      <span style={{ fontSize:'0.77rem', color:'#64748b', fontWeight:700 }}>S/ {Number(r.amount).toFixed(2)}</span>
                      <span style={{ fontSize:'0.77rem', color:'#94a3b8' }}>
                        🕐 {new Date(r.createdAt).toLocaleTimeString('es-PE',{hour:'2-digit',minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════ MI PERFIL ══════════════════════════════════════════════════ */}
      {activeTab === 'Mi Perfil' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(310px,1fr))', gap:20, maxWidth:820 }}>
          <div style={{ ...card, padding:0, overflow:'hidden' }}>
            <div style={{ height:110, background:'linear-gradient(135deg,#1a1a2e 0%,#1e3a5f 50%,#0f3460 100%)', position:'relative' }}>
              <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 75% 50%,rgba(99,102,241,0.35) 0%,transparent 60%)' }} />
            </div>
            <div style={{ padding:'0 28px 28px', marginTop:-50 }}>
              <div style={{ width:100, height:100, borderRadius:'50%', border:'4px solid #fff',
                backgroundImage:`url(https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'Admin')}&background=1e3a5f&color=fff&size=200)`,
                backgroundSize:'cover', marginBottom:16, boxShadow:'0 4px 18px rgba(0,0,0,0.25)' }} />
              <h3 style={{ margin:'0 0 4px', color:'#0f172a', fontSize:'1.25rem', fontWeight:800 }}>{user?.name}</h3>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 14px', borderRadius:20,
                backgroundColor:'#1a1a2e', color:'#fff', fontSize:'0.7rem', fontWeight:800, letterSpacing:'1.2px', marginBottom:24 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', backgroundColor:'#10b981' }} />
                ADMINISTRADOR
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[['✉️ Email',user?.email],['🔐 Rol','Administrador PlayStop'],['🌐 Acceso','Panel completo']].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px', backgroundColor:'#f8fafc', borderRadius:10 }}>
                    <span style={{ fontWeight:700, color:'#64748b', fontSize:'0.83rem' }}>{k}</span>
                    <span style={{ fontWeight:600, color:'#0f172a', fontSize:'0.83rem', maxWidth:'58%', textAlign:'right', wordBreak:'break-word' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={card}>
            <h3 style={{ margin:'0 0 4px', color:'#0f172a', fontSize:'1.1rem', fontWeight:800 }}>Resumen de la Plataforma</h3>
            <p style={{ margin:'0 0 20px', color:'#94a3b8', fontSize:'0.79rem' }}>Estadísticas en tiempo real</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              {[['Jugadores',stats?.totalUsers??0,'#6366f1'],['Propietarios',stats?.totalOwners??0,'#8b5cf6'],
                ['Canchas',stats?.totalCourts??0,'#f59e0b'],['Reservas',stats?.totalReservations??0,'#10b981']].map(([l,v,c]) => (
                <div key={l} style={{ padding:'16px', borderRadius:12, backgroundColor:'#f8fafc', border:'1px solid #f1f5f9' }}>
                  <div style={{ fontSize:'1.5rem', fontWeight:900, color:c, marginBottom:3 }}>{v}</div>
                  <div style={{ fontSize:'0.77rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.4px' }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ padding:'14px 16px', borderRadius:12, backgroundColor:'#f0f0ff', border:'1px solid #e0e7ff' }}>
              <p style={{ margin:0, fontSize:'0.83rem', color:'#4338ca', fontWeight:600 }}>
                💰 Ingreso total: <strong>{fmtCurrency(analytics?.totalRevenue)}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>

    {/* ══ TOASTS ══════════════════════════════════════════════════════════════ */}
    <ToastContainer toasts={toasts} />

    {/* ══ MODALES ═════════════════════════════════════════════════════════════ */}
    {modal.show && (
      <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(15,23,42,0.75)', zIndex:9999,
        display:'flex', justifyContent:'center', alignItems:'center', backdropFilter:'blur(6px)' }}>
        <style>{`@keyframes mUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`}</style>

        {/* Suspender / Activar */}
        {modal.type === 'TOGGLE_USER' && (
          <div style={{ backgroundColor:'#fff', padding:36, borderRadius:22, width:'90%', maxWidth:420, boxShadow:'0 24px 60px rgba(0,0,0,0.3)', animation:'mUp 0.28s ease' }}>
            <div style={{ width:52, height:52, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', marginBottom:16,
              backgroundColor:modal.payload.enabled?'#fef3c7':'#d1fae5' }}>
              {modal.payload.enabled?'⚠️':'✅'}
            </div>
            <h2 style={{ margin:'0 0 8px', color:'#0f172a', fontSize:'1.3rem', fontWeight:900 }}>
              {modal.payload.enabled?'Suspender usuario':'Activar usuario'}
            </h2>
            <p style={{ margin:'0 0 24px', color:'#64748b', lineHeight:1.65, fontSize:'0.92rem' }}>
              ¿Confirmas {modal.payload.enabled?'suspender':'activar'} a <strong>{modal.payload.name}</strong>?{' '}
              {modal.payload.enabled?'No podrá iniciar sesión hasta que se reactive.':'Recuperará acceso completo a la plataforma.'}
            </p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={closeModal} style={{ flex:1, padding:13, borderRadius:12, border:'2px solid #e2e8f0', backgroundColor:'#f8fafc', color:'#64748b', fontWeight:800, cursor:'pointer' }}>Cancelar</button>
              <button onClick={() => handleToggleUser(modal.payload)}
                style={{ flex:1, padding:13, borderRadius:12, border:'none', backgroundColor:modal.payload.enabled?'#f59e0b':'#22c55e', color:'#fff', fontWeight:800, cursor:'pointer' }}>
                {modal.payload.enabled?'Sí, suspender':'Sí, activar'}
              </button>
            </div>
          </div>
        )}

        {/* Eliminar */}
        {modal.type === 'DELETE_USER' && (
          <div style={{ backgroundColor:'#fff', padding:36, borderRadius:22, width:'90%', maxWidth:440, boxShadow:'0 24px 60px rgba(0,0,0,0.3)', animation:'mUp 0.28s ease' }}>
            <div style={{ width:52, height:52, borderRadius:14, backgroundColor:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', marginBottom:16 }}>🗑️</div>
            <h2 style={{ margin:'0 0 8px', color:'#0f172a', fontSize:'1.3rem', fontWeight:900 }}>Eliminar cuenta permanentemente</h2>
            <p style={{ margin:'0 0 12px', color:'#64748b', lineHeight:1.65, fontSize:'0.92rem' }}>
              ¿Eliminar la cuenta de <strong>{modal.payload.name}</strong>?
            </p>
            <div style={{ padding:'12px 16px', backgroundColor:'#fef2f2', borderRadius:10, marginBottom:24, fontSize:'0.82rem', color:'#b91c1c', lineHeight:1.55 }}>
              {modal.payload.courts !== undefined
                ? '⚠ Las canchas del propietario quedarán inactivas. El historial de reservas se preserva.'
                : '⚠ Las reservas activas del jugador serán eliminadas definitivamente.'}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={closeModal} style={{ flex:1, padding:13, borderRadius:12, border:'2px solid #e2e8f0', backgroundColor:'#f8fafc', color:'#64748b', fontWeight:800, cursor:'pointer' }}>Cancelar</button>
              <button onClick={() => handleDeleteUser(modal.payload)}
                style={{ flex:1, padding:13, borderRadius:12, border:'none', backgroundColor:'#ef4444', color:'#fff', fontWeight:800, cursor:'pointer' }}>
                Eliminar definitivamente
              </button>
            </div>
          </div>
        )}

        {/* Toggle cancha */}
        {modal.type === 'TOGGLE_COURT' && (
          <div style={{ backgroundColor:'#fff', padding:36, borderRadius:22, width:'90%', maxWidth:420, boxShadow:'0 24px 60px rgba(0,0,0,0.3)', animation:'mUp 0.28s ease' }}>
            <div style={{ width:52, height:52, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', marginBottom:16,
              backgroundColor:modal.payload.active?'#fef3c7':'#d1fae5' }}>
              {modal.payload.active?'🔒':'🔓'}
            </div>
            <h2 style={{ margin:'0 0 8px', color:'#0f172a', fontSize:'1.3rem', fontWeight:900 }}>
              {modal.payload.active?'Desactivar cancha':'Activar cancha'}
            </h2>
            <p style={{ margin:'0 0 24px', color:'#64748b', lineHeight:1.65, fontSize:'0.92rem' }}>
              {modal.payload.active
                ? <>¿Desactivar <strong>{modal.payload.name}</strong>? Dejará de aparecer en búsquedas y no podrá recibir reservas.</>
                : <>¿Activar <strong>{modal.payload.name}</strong>? Estará visible nuevamente para los jugadores.</>}
            </p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={closeModal} style={{ flex:1, padding:13, borderRadius:12, border:'2px solid #e2e8f0', backgroundColor:'#f8fafc', color:'#64748b', fontWeight:800, cursor:'pointer' }}>Cancelar</button>
              <button onClick={() => handleToggleCourt(modal.payload)}
                style={{ flex:1, padding:13, borderRadius:12, border:'none', backgroundColor:modal.payload.active?'#f59e0b':'#22c55e', color:'#fff', fontWeight:800, cursor:'pointer' }}>
                {modal.payload.active?'Sí, desactivar':'Sí, activar'}
              </button>
            </div>
          </div>
        )}

        {/* Canchas del propietario */}
        {modal.type === 'OWNER_COURTS' && (
          <div style={{ backgroundColor:'#fff', padding:36, borderRadius:22, width:'90%', maxWidth:560, boxShadow:'0 24px 60px rgba(0,0,0,0.3)', animation:'mUp 0.28s ease', maxHeight:'82vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:22 }}>
              <div>
                <h2 style={{ margin:'0 0 4px', color:'#0f172a', fontSize:'1.25rem', fontWeight:900 }}>Canchas de {modal.payload.name}</h2>
                <p style={{ margin:0, color:'#94a3b8', fontSize:'0.8rem' }}>{modal.payload.email}</p>
              </div>
              <button onClick={closeModal} style={{ background:'none', border:'none', fontSize:'1.4rem', cursor:'pointer', color:'#94a3b8' }}>✕</button>
            </div>
            {ownerCourtsLoading && <p style={{ textAlign:'center', color:'#94a3b8', padding:'24px 0' }}>Cargando canchas...</p>}
            {!ownerCourtsLoading && !ownerCourtsData.length && <p style={{ textAlign:'center', color:'#94a3b8' }}>Sin canchas registradas</p>}
            {!ownerCourtsLoading && ownerCourtsData.map(c => (
              <div key={c.id} style={{ padding:'14px 18px', borderRadius:12, border:'1px solid #f1f5f9', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontWeight:700, color:'#0f172a', marginBottom:3, fontSize:'0.9rem' }}>{c.name}</div>
                  <div style={{ fontSize:'0.77rem', color:'#64748b' }}>
                    {c.sportType} · S/ {Number(c.pricePerHour).toFixed(2)}/h{c.city&&` · ${c.city}`}{c.district&&`, ${c.district}`}
                  </div>
                </div>
                <span style={{ padding:'4px 10px', borderRadius:8, fontSize:'0.74rem', fontWeight:700, whiteSpace:'nowrap',
                  backgroundColor:c.active?'#d1fae5':'#fee2e2', color:c.active?'#047857':'#dc2626' }}>
                  {c.active?'Activa':'Inactiva'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
    </>
  );
};

export default AdminDashboard;
