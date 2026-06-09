const Marcas = () => {
  const marcas = [
    { name: "DeporPlaza", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg> },
    { name: "PadelCenter", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg> },
    { name: "SoccerCity", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> },
    { name: "Club San Isidro", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> },
    { name: "La 10 FC", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg> },
    { name: "Arena Sur", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> },
    { name: "Tennis Pro", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg> },
  ];

  return (
    <section id="marcas" className="reveal" style={{ padding: '40px 0', backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
      <p style={{ fontSize: '0.85rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '30px' }}>
        Complejos deportivos que confían en PlaySpot
      </p>
      
      <style>
        {`
          @keyframes scrollTrust {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 30px)); }
          }
          .trust-track {
            display: flex;
            gap: 60px;
            width: max-content;
            animation: scrollTrust 35s linear infinite;
          }
          .trust-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.4rem;
            font-weight: 900;
            color: #94a3b8;
            letter-spacing: -0.5px;
            filter: grayscale(100%) opacity(0.5);
            transition: all 0.3s ease;
            cursor: default;
          }
          .trust-logo:hover {
            filter: grayscale(0%) opacity(1);
            color: #0f172a;
          }
        `}
      </style>

      <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', display: 'flex', overflow: 'hidden' }}>
        {/* Máscaras difuminadas a los lados para un fundido elegante */}
        <div className="fade-left" style={{ position: 'absolute', top: 0, left: 0, width: '120px', height: '100%', background: 'linear-gradient(to right, #ffffff 0%, transparent 100%)', zIndex: 10, pointerEvents: 'none' }}></div>
        <div className="fade-right" style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '100%', background: 'linear-gradient(to left, #ffffff 0%, transparent 100%)', zIndex: 10, pointerEvents: 'none' }}></div>
        
        <div className="trust-track">
          {/* Duplicamos el array para que el scroll sea infinito sin cortes bruscos */}
          {[...marcas, ...marcas].map((marca, index) => (
            <div key={index} className="trust-logo">
              <div style={{ color: '#00d084' }}>{marca.icon}</div>
              {marca.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marcas;