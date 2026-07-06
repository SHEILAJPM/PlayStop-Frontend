const CONFETTI_COLORS = ['#2563eb','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4'];

const Confetti = () => {
  const pieces = Array.from({ length: 72 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2.2 + Math.random() * 1.6,
    size: 7 + Math.random() * 7,
    rotate: Math.random() * 360,
    drift: (Math.random() - 0.5) * 120,
  }));
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:99999, overflow:'hidden' }}>
      <style>{`
        @keyframes cfall {
          0%   { transform: translateY(-30px) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) translateX(var(--drift)) rotate(var(--rotate)); opacity: 0; }
        }
      `}</style>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:'absolute', left:`${p.x}%`, top:0,
          width:p.size, height:p.size * 0.55,
          background:p.color, borderRadius:2,
          '--drift':`${p.drift}px`, '--rotate':`${p.rotate + 540}deg`,
          animation:`cfall ${p.duration}s ease-in ${p.delay}s forwards`,
        }} />
      ))}
    </div>
  );
};

export default Confetti;
