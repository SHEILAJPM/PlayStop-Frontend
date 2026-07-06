import { useEffect, useState } from 'react';

export default function AppSplash({ onFinish }) {
  const [phase, setPhase] = useState('in'); // 'in' | 'hold' | 'out'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 600);
    const t2 = setTimeout(() => setPhase('out'),  2200);
    const t3 = setTimeout(() => onFinish(),        2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  const visible = phase !== 'out';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#030712',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 28,
      opacity: phase === 'out' ? 0 : 1,
      transition: phase === 'out' ? 'opacity 0.65s ease' : 'none',
    }}>
      <style>{`
        @keyframes splashPop {
          0%   { transform: scale(0.3) rotate(-15deg); opacity: 0; }
          60%  { transform: scale(1.12) rotate(4deg);  opacity: 1; }
          80%  { transform: scale(0.95) rotate(-2deg); }
          100% { transform: scale(1)   rotate(0deg);   opacity: 1; }
        }
        @keyframes splashFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(37, 99, 235, .45); }
          50%       { box-shadow: 0 0 55px rgba(37, 99, 235, .75); }
        }
        @keyframes splashDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      {/* Logo */}
      <div style={{
        width: 96, height: 96, borderRadius: 26,
        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: '2.8rem', color: '#0a1628',
        animation: 'splashPop 0.6s cubic-bezier(.16,1,.3,1) forwards, splashPulse 2s ease-in-out 0.6s infinite',
      }}>
        P
      </div>

      {/* Nombre y tagline */}
      <div style={{
        textAlign: 'center',
        opacity: visible && phase !== 'in' ? 1 : 0,
        animation: phase === 'hold' ? 'splashFadeUp 0.5s ease forwards' : 'none',
      }}>
        <div style={{
          fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px',
          color: '#f1f5f9', fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          Play<span style={{ color: '#2563eb' }}>Stop</span>
        </div>
        <div style={{
          fontSize: '0.88rem', color: 'rgba(255,255,255,.4)',
          marginTop: 6, fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 500, letterSpacing: '0.3px',
        }}>
          Reserva canchas en segundos
        </div>
      </div>

      {/* Indicador de carga */}
      <div style={{
        display: 'flex', gap: 8, marginTop: 12,
        opacity: visible && phase !== 'in' ? 1 : 0,
        transition: 'opacity 0.3s',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#2563eb',
            animation: `splashDot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}
