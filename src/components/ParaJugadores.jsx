
const ParaJugadores = () => (
  <section id="jugadores" className="jugadores-section reveal" style={{ scrollMarginTop: '80px', padding: '120px 5%', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap-reverse', gap: '80px', overflow: 'hidden', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
    
    {/* Luces de fondo sutiles */}
    <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '500px', height: '500px', backgroundColor: '#2563eb', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.08, zIndex: 0 }}></div>
    <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '500px', height: '500px', backgroundColor: '#06b6d4', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.08, zIndex: 0 }}></div>

    {/* Animación flotante exclusiva para la App */}
    <style>
      {`
        @keyframes floatApp {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes touchMove {
          0%, 5% { transform: translate(160px, 600px); opacity: 0; }
          8% { opacity: 1; }
          10%, 12% { transform: translate(160px, 480px); } /* Va a Reservar */
          13% { transform: translate(160px, 480px) scale(0.85); } /* Clic Reservar */
          14% { transform: translate(160px, 480px) scale(1); }
          20%, 22% { transform: translate(45px, 455px); } /* Va a Checkbox TyC */
          23% { transform: translate(45px, 455px) scale(0.85); } /* Clic Checkbox */
          24% { transform: translate(45px, 455px) scale(1); }
          30%, 32% { transform: translate(160px, 520px); } /* Va a Pagar */
          33% { transform: translate(160px, 520px) scale(0.85); } /* Clic Pagar */
          34% { transform: translate(160px, 520px) scale(1); }
          44%, 46% { transform: translate(160px, 545px); } /* Va a Procesar Culqi */
          47% { transform: translate(160px, 545px) scale(0.85); } /* Clic Procesar */
          48% { transform: translate(160px, 545px) scale(1); }
          55%, 100% { transform: translate(160px, 600px); opacity: 0; }
        }
        @keyframes tapRipple1 {
          0%, 12% { transform: scale(0); opacity: 0; }
          13% { transform: scale(1); opacity: 0.6; }
          16%, 100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes tapRipple2 {
          0%, 22% { transform: scale(0); opacity: 0; }
          23% { transform: scale(1); opacity: 0.6; }
          26%, 100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes tapRipple3 {
          0%, 32% { transform: scale(0); opacity: 0; }
          33% { transform: scale(1); opacity: 0.6; }
          36%, 100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes tapRipple4 {
          0%, 46% { transform: scale(0); opacity: 0; }
          47% { transform: scale(1); opacity: 0.6; }
          50%, 100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes bottomSheet1Show {
          0%, 13% { transform: translateY(100%); }
          15%, 33% { transform: translateY(0); }
          35%, 100% { transform: translateY(100%); }
        }
        @keyframes bottomSheet2Show {
          0%, 33% { transform: translateY(100%); }
          35%, 50% { transform: translateY(0); }
          52%, 100% { transform: translateY(100%); }
        }
        @keyframes sheetBackdrop {
          0%, 13% { opacity: 0; visibility: hidden; }
          15%, 50% { opacity: 1; visibility: visible; }
          52%, 100% { opacity: 0; visibility: hidden; }
        }
        @keyframes toastMobile {
          0%, 52% { transform: translateY(-50px) translateX(-50%); opacity: 0; visibility: hidden; }
          55%, 85% { transform: translateY(35px) translateX(-50%); opacity: 1; visibility: visible; }
          90%, 100% { transform: translateY(-50px) translateX(-50%); opacity: 0; visibility: hidden; }
        }
        @keyframes floatingCardShow {
          0%, 60% { opacity: 0; transform: translateX(20px) scale(0.9); visibility: hidden; }
          65%, 90% { opacity: 1; transform: translateX(0) scale(1); visibility: visible; }
          95%, 100% { opacity: 0; transform: translateX(20px) scale(0.9); visibility: hidden; }
        }
        @keyframes btnPressMobile {
          0%, 12% { background-color: #2563eb; transform: scale(1); }
          13% { background-color: #1d4ed8; transform: scale(0.95); }
          14%, 100% { background-color: #2563eb; transform: scale(1); }
        }
        @keyframes btnPressPay {
          0%, 32% { background-color: #2563eb; opacity: 0.5; transform: scale(1); }
          33% { background-color: #2563eb; opacity: 1; transform: scale(0.95); }
          34%, 100% { background-color: #2563eb; opacity: 1; transform: scale(1); }
        }
        @keyframes btnPressProcesar {
          0%, 46% { background-color: #2563eb; transform: scale(1); }
          47% { background-color: #1d4ed8; transform: scale(0.95); }
          48%, 100% { background-color: #2563eb; transform: scale(1); }
        }
        @keyframes termsCheckAnim {
          0%, 23% { background-color: transparent; border-color: #cbd5e1; }
          24%, 100% { background-color: #2563eb; border-color: #2563eb; }
        }
        @keyframes termsCheckMarkAnim {
          0%, 23% { opacity: 0; }
          24%, 100% { opacity: 1; }
        }
        @media (max-width: 768px) {
          .jugadores-section { padding: 60px 5% !important; flex-direction: column !important; text-align: center; gap: 40px !important; }
          .jugadores-title { font-size: 2.5rem !important; }
          .mockup-phone-wrapper { transform: scale(0.85); transform-origin: top center; height: 560px; }
          .jugadores-features { text-align: left; }
        }
      `}
    </style>
    
    <div className="mockup-phone-wrapper" style={{ flex: '1 1 350px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
       
       {/* Círculo decorativo de fondo */}
       <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '320px', height: '320px', background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }}></div>

       {/* Marco del Teléfono */}
       <div style={{ width: '100%', maxWidth: '320px', height: '640px', backgroundColor: '#ffffff', borderRadius: '45px', boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.25), 0 0 0 10px #0f172a, inset 0 0 0 2px #334155', position: 'relative', overflow: 'hidden', zIndex: 10, animation: 'floatApp 6s ease-in-out infinite' }}>
          
          {/* Notch / Cámara */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '110px', height: '28px', backgroundColor: '#0f172a', borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px', zIndex: 20 }}></div>
          
          {/* Toast de Confirmación (Dinámico) */}
          <div style={{ position: 'absolute', top: 0, left: '50%', backgroundColor: '#ffffff', borderRadius: '20px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 30, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0', animation: 'toastMobile 14s infinite cubic-bezier(0.16, 1, 0.3, 1)', whiteSpace: 'nowrap' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>Reserva confirmada</span>
          </div>

          {/* Contenido Simulado de la App */}
          <div style={{ paddingTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', backgroundColor: '#f8fafc' }}>
            
            {/* Cabecera de la App */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
              <div>
                <p style={{ margin: '0 0 2px 0', fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Ubicación actual</p>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> Lima, PE
                </p>
              </div>
              <div style={{ width: '42px', height: '42px', backgroundColor: '#dbeafe', color: '#2563eb', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 6px rgba(37,99,235,0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
            </div>

            {/* Buscador */}
            <div style={{ margin: '0 20px', backgroundColor: '#ffffff', borderRadius: '14px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '0.9rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg> 
              Buscar canchas...
            </div>

            {/* Categorías (Píldoras) */}
            <div style={{ display: 'flex', gap: '10px', padding: '0 20px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', boxShadow: '0 4px 6px rgba(15,23,42,0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 12l3.5 2 1.5-4.5-4-2.5-4 2.5 1.5 4.5z"></path></svg> Fútbol</div>
              <div style={{ backgroundColor: '#ffffff', color: '#64748b', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid #e2e8f0' }}>Tenis</div>
              <div style={{ backgroundColor: '#ffffff', color: '#64748b', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid #e2e8f0' }}>Pádel</div>
            </div>

            {/* Tarjeta de Cancha */}
            <div style={{ margin: '0 20px', backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '100%', height: '140px', backgroundImage: 'url(https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Cancha El Clásico</h4>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#047857', backgroundColor: '#d1fae5', padding: '4px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#047857" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> 4.9
                  </span>
                </div>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Sintética • 7 vs 7 • Luces LED</p>
                <button style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem', animation: 'btnPressMobile 14s infinite ease-in-out' }}>Reservar S/ 80</button>
              </div>
            </div>
          </div>

          {/* Capa borrosa del Bottom Sheet */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 40, animation: 'sheetBackdrop 14s infinite ease-in-out' }}></div>

          {/* Bottom Sheet 1 (Confirmar Reserva) */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: '#ffffff', borderRadius: '24px 24px 0 0', padding: '24px 20px', zIndex: 50, boxShadow: '0 -10px 25px rgba(0,0,0,0.1)', animation: 'bottomSheet1Show 14s infinite cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ width: '40px', height: '5px', backgroundColor: '#e2e8f0', borderRadius: '3px', margin: '0 auto 20px auto' }}></div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '900', color: '#0f172a', textAlign: 'center' }}>Confirmar Reserva</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase' }}>Fecha y Hora</label>
              <div style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>Hoy, 20:00</div>
            </div>
            <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontWeight: '600', color: '#475569', fontSize: '0.85rem' }}>Total a pagar:</span>
              <span style={{ fontWeight: '900', color: '#0f172a', fontSize: '1rem' }}>S/ 80.00</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '2px solid', display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'termsCheckAnim 14s infinite ease-in-out' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'termsCheckMarkAnim 14s infinite ease-in-out' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Acepto los Términos y Condiciones.</span>
            </div>
            <button style={{ width: '100%', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '1.05rem', animation: 'btnPressPay 14s infinite ease-in-out' }}>Pagar</button>
          </div>

          {/* Bottom Sheet 2 (Culqi) */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: '#ffffff', borderRadius: '24px 24px 0 0', padding: '24px 20px', zIndex: 50, boxShadow: '0 -10px 25px rgba(0,0,0,0.1)', animation: 'bottomSheet2Show 14s infinite cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ width: '40px', height: '5px', backgroundColor: '#e2e8f0', borderRadius: '3px', margin: '0 auto 20px auto' }}></div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
               <h3 style={{ margin: '0 0 4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <img src="https://github.com/culqi.png" alt="Culqi Logo" style={{ height: '24px', borderRadius: '4px', marginRight: '6px' }} />
                 <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '900', fontSize: '20px', color: '#0f172a', letterSpacing: '-1px' }}>culqi</span>
               </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
               <input type="text" placeholder="0000 0000 0000 0000" disabled style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }} />
               <div style={{ display: 'flex', gap: '12px' }}>
                 <input type="text" placeholder="MM/AA" disabled style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }} />
                 <input type="password" placeholder="123" disabled style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }} />
               </div>
            </div>
            <button style={{ width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '1.05rem', animation: 'btnPressProcesar 14s infinite ease-in-out' }}>Procesar S/ 80.00</button>
          </div>

          {/* Indicador Táctil (Dedo) */}
          <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 100, animation: 'touchMove 14s infinite cubic-bezier(0.25, 1, 0.5, 1)', pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* Ondas expansivas de Clic */}
            <div style={{ position: 'absolute', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.15)', animation: 'tapRipple1 14s infinite ease-out' }}></div>
            <div style={{ position: 'absolute', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.15)', animation: 'tapRipple2 14s infinite ease-out' }}></div>
            <div style={{ position: 'absolute', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.15)', animation: 'tapRipple3 14s infinite ease-out' }}></div>
            <div style={{ position: 'absolute', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.15)', animation: 'tapRipple4 14s infinite ease-out' }}></div>
            {/* "Huella" Táctil */}
            <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)', border: '2px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', backdropFilter: 'blur(2px)' }}></div>
          </div>

          {/* Barra de Navegación Inferior de la App */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '70px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 20, color: '#94a3b8' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
       </div>
       
       {/* Tarjeta Flotante superpuesta */}
       <div style={{ position: 'absolute', top: '150px', right: '-40px', backgroundColor: '#ffffff', padding: '14px 20px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15), 0 0 0 1px rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', gap: '14px', zIndex: 30, animation: 'floatingCardShow 14s infinite ease-in-out' }}>
         <div style={{ width: '36px', height: '36px', backgroundColor: '#d1fae5', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
         </div>
         <div>
           <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Pago dividido</p>
           <p style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: '800' }}>¡Tu grupo pagó!</p>
         </div>
       </div>
    </div>

    {/* Textos y Beneficios */}
    <div style={{ flex: '1 1 450px', maxWidth: '600px', zIndex: 10, position: 'relative' }} className="jugadores-text">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ width: '36px', height: '3px', borderRadius: '2px', background: 'linear-gradient(90deg, #2563eb, transparent)' }} />
        <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '2.5px', textTransform: 'uppercase' }}>Para Jugadores</span>
      </div>
      <h2 className="jugadores-title" style={{ fontSize: '3.5rem', color: '#ffffff', fontWeight: '900', marginBottom: '20px', lineHeight: '1.1', letterSpacing: '-1.5px' }}>Tu partido, <span style={{ background: 'linear-gradient(90deg, #2563eb, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>sin estrés.</span></h2>
      <p style={{ color: '#4b5563', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '40px' }}>Olvídate de perseguir a tus amigos para que paguen o de llamar a 10 complejos distintos buscando un horario libre. PlaySpot hace el trabajo duro por ti.</p>
      
      <div className="jugadores-features" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
           <div style={{ width: '60px', height: '60px', backgroundColor: '#ffffff', border: '1px solid #dbeafe', color: '#2563eb', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, boxShadow: '0 8px 16px -4px rgba(37,99,235,0.2)' }}>
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
           </div>
           <div>
             <h4 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', color: '#0f172a', fontWeight: '800', letterSpacing: '-0.5px' }}>Reserva en segundos</h4>
             <p style={{ margin: 0, color: '#64748b', lineHeight: '1.6', fontSize: '1.05rem' }}>Encuentra canchas disponibles en tiempo real, compara precios y confirma tu reserva al instante.</p>
           </div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
           <div style={{ width: '60px', height: '60px', backgroundColor: '#ffffff', border: '1px solid #d1fae5', color: '#2563eb', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.2)' }}>
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
           </div>
           <div>
             <h4 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', color: '#0f172a', fontWeight: '800', letterSpacing: '-0.5px' }}>Divide y vencerás</h4>
             <p style={{ margin: 0, color: '#64748b', lineHeight: '1.6', fontSize: '1.05rem' }}>Paga solo tu parte. Envía un link a tus amigos y nosotros nos encargamos de cobrarles el resto de forma automática.</p>
           </div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
           <div style={{ width: '60px', height: '60px', backgroundColor: '#ffffff', border: '1px solid #fef3c7', color: '#f59e0b', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, boxShadow: '0 8px 16px -4px rgba(245,158,11,0.2)' }}>
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
           </div>
           <div>
             <h4 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', color: '#0f172a', fontWeight: '800', letterSpacing: '-0.5px' }}>Gana recompensas</h4>
             <p style={{ margin: 0, color: '#64748b', lineHeight: '1.6', fontSize: '1.05rem' }}>Acumula puntos por cada partido jugado y canjéalos por descuentos exclusivos en tus próximas reservas.</p>
           </div>
        </div>
      </div>

      <button onClick={() => document.getElementById('canchas-destacadas').scrollIntoView()} style={{ marginTop: '40px', backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '16px 36px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(15,23,42,0.3)', transition: 'background-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}>
        Explorar canchas
      </button>
    </div>
  </section>
);

export default ParaJugadores;