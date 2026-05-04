
const ParaClubes = () => (
  <section id="clubes" style={{ scrollMarginTop: '80px', padding: '120px 5%', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '60px', position: 'relative', overflow: 'hidden' }}>
    
    {/* Background Glows */}
    <div style={{ position: 'absolute', top: '10%', right: '5%', width: '500px', height: '500px', backgroundColor: '#00d084', borderRadius: '50%', filter: 'blur(180px)', opacity: 0.15, zIndex: 0 }}></div>
    <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px', backgroundColor: '#3b82f6', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.15, zIndex: 0 }}></div>

    <style>
      {`
        @keyframes floatDashboard {
          0% { transform: translateY(0px) rotateX(1deg) rotateY(-1deg); boxShadow: 0 30px 60px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.2); }
          50% { transform: translateY(-15px) rotateX(3deg) rotateY(1deg); boxShadow: 0 45px 70px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.3); }
          100% { transform: translateY(0px) rotateX(1deg) rotateY(-1deg); boxShadow: 0 30px 60px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.2); }
        }
        @keyframes cursorMoveReal {
          0%, 5% { transform: translate(200px, 320px); opacity: 0; }
          10% { opacity: 1; }
          25%, 28% { transform: translate(520px, 160px); } /* Hover + Nueva Reserva */
          30% { transform: translate(520px, 160px) scale(0.85); } /* Clic */
          33% { transform: translate(520px, 160px) scale(1); }
          45%, 48% { transform: translate(410px, 235px); } /* Hover Guardar */
          50% { transform: translate(410px, 235px) scale(0.85); } /* Clic */
          53% { transform: translate(410px, 235px) scale(1); }
          65%, 100% { transform: translate(200px, 320px); opacity: 0; }
        }
        @keyframes rippleAction {
          0%, 28% { transform: scale(0); opacity: 0; }
          30% { transform: scale(1); opacity: 0.8; }
          35%, 100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes rippleAction2 {
          0%, 48% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1); opacity: 0.8; }
          55%, 100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes modalBackdrop {
          0%, 29% { opacity: 0; visibility: hidden; }
          32%, 53% { opacity: 1; visibility: visible; }
          56%, 100% { opacity: 0; visibility: hidden; }
        }
        @keyframes modalShow {
          0%, 29% { opacity: 0; transform: translate(-50%, -40%) scale(0.9); visibility: hidden; }
          32%, 53% { opacity: 1; transform: translate(-50%, -50%) scale(1); visibility: visible; }
          56%, 100% { opacity: 0; transform: translate(-50%, -60%) scale(0.95); visibility: hidden; }
        }
        @keyframes rowInsert {
          0%, 54% { opacity: 0; transform: translateX(-20px); background-color: #d1fae5; }
          58%, 70% { opacity: 1; transform: translateX(0); background-color: #d1fae5; }
          75%, 100% { opacity: 1; transform: translateX(0); background-color: #ffffff; }
        }
        @keyframes pushRowsDown {
          0%, 54% { transform: translateY(0); }
          58%, 100% { transform: translateY(42px); } /* Altura de la fila nueva */
        }
        @keyframes toastShow {
          0%, 55% { opacity: 0; transform: translateX(30px) scale(0.9); visibility: hidden; }
          60%, 85% { opacity: 1; transform: translateX(0) scale(1); visibility: visible; }
          90%, 100% { opacity: 0; transform: translateY(-20px) scale(0.9); visibility: hidden; }
        }
        @keyframes pulseMetric {
          0%, 57% { background-color: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.05); box-shadow: none; }
          60% { background-color: rgba(0,208,132,0.15); border-color: #00d084; transform: scale(1.05); box-shadow: 0 10px 25px -5px rgba(0,208,132,0.3); }
          75%, 100% { background-color: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.05); transform: scale(1); box-shadow: none; }
        }
        @keyframes updateBar {
          0%, 58% { opacity: 1; }
          59%, 100% { opacity: 0; }
        }
        @keyframes updateBarNew {
          0%, 58% { opacity: 0; transform: translateY(10px); }
          60%, 100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes btnClickStyle {
          0%, 26% { background-color: #0f172a; transform: scale(1); }
          30%, 33% { background-color: #1e293b; transform: scale(0.95); }
          35%, 100% { background-color: #0f172a; transform: scale(1); }
        }
      `}
    </style>

    <div style={{ flex: '1 1 400px', maxWidth: '600px', zIndex: 10 }}>
      <div style={{ display: 'inline-block', padding: '6px 18px', background: 'linear-gradient(90deg, rgba(0,208,132,0.15), rgba(0,208,132,0.05))', border: '1px solid rgba(0,208,132,0.3)', color: '#34d399', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', marginBottom: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>Para Clubes</div>
      <h2 style={{ fontSize: '3.8rem', color: '#ffffff', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1.5px', lineHeight: '1.1' }}>El software que tu complejo <span style={{ background: 'linear-gradient(90deg, #34d399, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>necesita</span></h2>
      <p style={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '40px' }}>Automatiza tus reservas, cobra por adelantado y reduce el ausentismo al 0%. PlayStop te da las herramientas de una gran empresa, fáciles de usar desde cualquier dispositivo.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '45px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #00d084 0%, #059669 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(0,208,132,0.3)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          <span style={{ color: '#f8fafc', fontWeight: '600', fontSize: '1.15rem' }}>Panel de control en tiempo real</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(59,130,246,0.3)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          <span style={{ color: '#f8fafc', fontWeight: '600', fontSize: '1.15rem' }}>Pasarela de pagos 0% comisión</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(245,158,11,0.3)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          <span style={{ color: '#f8fafc', fontWeight: '600', fontSize: '1.15rem' }}>Reportes de ingresos automatizados</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <button style={{ backgroundColor: '#00d084', color: '#0f172a', border: 'none', padding: '16px 32px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(0,208,132,0.4)', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(0,208,132,0.5)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,208,132,0.4)'; }}>
          Agendar demostración
        </button>
        <button style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}>
          Ver planes
        </button>
      </div>
    </div>
    
    <div style={{ flex: '1 1 450px', display: 'flex', justifyContent: 'center', zIndex: 10 }}>
       {/* RÉPLICA EXACTA DEL PROPIETARIO DASHBOARD */}
       <div style={{ width: '100%', maxWidth: '700px', background: '#f1f5f9', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.4)', overflow: 'hidden', animation: 'floatDashboard 8s ease-in-out infinite', transformStyle: 'preserve-3d', perspective: '1000px', display: 'flex', height: '420px', position: 'relative' }}>

          {/* Sidebar Realista */}
          <div style={{ width: '160px', backgroundColor: '#0f172a', padding: '20px 12px', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', paddingLeft: '8px' }}>
               <div style={{ width: '18px', height: '18px', backgroundColor: '#00d084', borderRadius: '4px' }}></div>
               <span style={{ color: '#fff', fontWeight: '900', fontSize: '1rem', letterSpacing: '-0.5px' }}>PlayStop</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
               <div style={{ backgroundColor: '#00d084', color: '#0f172a', padding: '8px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700' }}>📊 Dashboard</div>
               <div style={{ color: '#94a3b8', padding: '8px 12px', fontSize: '0.7rem', fontWeight: '600' }}>📅 Calendario</div>
               <div style={{ color: '#94a3b8', padding: '8px 12px', fontSize: '0.7rem', fontWeight: '600' }}>🏟️ Mis Canchas</div>
               <div style={{ color: '#94a3b8', padding: '8px 12px', fontSize: '0.7rem', fontWeight: '600' }}>💰 Finanzas</div>
            </div>
          </div>

          {/* Contenedor Derecho */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
            {/* Cursor SVG */}
            <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 100, animation: 'cursorMoveReal 9s infinite cubic-bezier(0.25, 1, 0.5, 1)', pointerEvents: 'none' }}>
               <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.2)', animation: 'rippleAction 9s infinite ease-out' }}></div>
               <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.2)', animation: 'rippleAction2 9s infinite ease-out' }}></div>
               <svg width="28" height="28" viewBox="0 0 24 24" fill="#0f172a" stroke="#ffffff" strokeWidth="2"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L6.35 3.21a.5.5 0 0 0-.85 0z"></path></svg>
            </div>

            {/* Header Realista */}
            <div style={{ backgroundColor: '#ffffff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', zIndex: 10 }}>
               <h3 style={{ margin: 0, color: '#0f172a', fontSize: '0.9rem', fontWeight: '800' }}>Panel del Complejo</h3>
               <div style={{ display: 'flex', gap: '10px' }}>
                 <div style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></div>
               </div>
            </div>

            {/* Vista Principal */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
              
              {/* Toast Confirmación */}
              <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#ffffff', padding: '10px 16px', borderRadius: '10px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 60, animation: 'toastShow 9s infinite ease-in-out' }}>
                 <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#00d084', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                 <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0f172a' }}>Reserva guardada</span>
              </div>

              {/* Métricas Reales */}
              <div style={{ display: 'flex', gap: '12px' }}>
                 <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', animation: 'pulseMetric 9s infinite ease-in-out' }}>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '6px' }}>Ingresos de Hoy</div>
                    <div style={{ position: 'relative', height: '28px' }}>
                       <div style={{ position: 'absolute', fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', animation: 'updateBar 9s infinite ease-in-out' }}>S/ 1,450</div>
                       <div style={{ position: 'absolute', fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', animation: 'updateBarNew 9s infinite ease-in-out' }}>S/ 1,530</div>
                    </div>
                 </div>
                 <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: '6px' }}>Reservas Activas</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a' }}>18</div>
                 </div>
              </div>

              {/* Tabla de Reservas Realista */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', flex: 1, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>Últimas Reservas</h4>
                    <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', animation: 'btnClickStyle 9s infinite ease-in-out' }}>+ Nueva Reserva</div>
                 </div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', overflow: 'hidden' }}>
                    {/* Fila animada insertada desde arriba */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '10px', fontSize: '0.7rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', alignItems: 'center', zIndex: 10, animation: 'rowInsert 9s infinite cubic-bezier(0.25, 1, 0.5, 1)' }}>
                       <div style={{ fontWeight: '700', color: '#0f172a' }}>20:00</div>
                       <div style={{ color: '#475569' }}>Cancha 1 (F7)</div>
                       <div style={{ fontWeight: '800', color: '#0f172a' }}>S/ 80.00</div>
                       <div><span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '4px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '0.6rem' }}>Pagado</span></div>
                    </div>

                    {/* Filas existentes que son empujadas hacia abajo */}
                    <div style={{ width: '100%', animation: 'pushRowsDown 9s infinite cubic-bezier(0.25, 1, 0.5, 1)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '10px', fontSize: '0.7rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '8px', alignItems: 'center' }}>
                         <div style={{ fontWeight: '700', color: '#0f172a' }}>18:00</div>
                         <div style={{ color: '#475569' }}>Cancha Padel A</div>
                         <div style={{ fontWeight: '800', color: '#0f172a' }}>S/ 60.00</div>
                         <div><span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '4px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '0.6rem' }}>Pagado</span></div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '10px', fontSize: '0.7rem', alignItems: 'center' }}>
                         <div style={{ fontWeight: '700', color: '#0f172a' }}>19:00</div>
                         <div style={{ color: '#475569' }}>Cancha 2 (F7)</div>
                         <div style={{ fontWeight: '800', color: '#0f172a' }}>S/ 100.00</div>
                         <div><span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: '6px', fontWeight: '800', fontSize: '0.6rem' }}>Pendiente</span></div>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Capa borrosa del Modal interactivo */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', zIndex: 40, borderRadius: '16px', animation: 'modalBackdrop 9s infinite ease-in-out' }}></div>
              
              {/* Modal Realista Centro */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: '280px', backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', zIndex: 50, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'modalShow 9s infinite cubic-bezier(0.16, 1, 0.3, 1)' }}>
                 <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: '900', color: '#0f172a' }}>Registrar Nueva</h4>
                 <div style={{ width: '100%', height: '32px', border: '2px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc', marginBottom: '12px' }}></div>
                 <div style={{ width: '100%', height: '32px', border: '2px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc', marginBottom: '20px' }}></div>
                 <div style={{ display: 'flex', gap: '10px' }}>
                   <div style={{ flex: 1, height: '32px', backgroundColor: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '8px' }}></div>
                   <div style={{ flex: 1, height: '32px', backgroundColor: '#00d084', color: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', animation: 'btnClickStyle 9s infinite ease-in-out' }}>Guardar</div>
                 </div>
              </div>

            </div>
          </div>
       </div>
    </div>
  </section>
);

export default ParaClubes;