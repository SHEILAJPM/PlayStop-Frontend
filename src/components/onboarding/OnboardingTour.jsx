import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OnboardingTour = ({ steps, onComplete, onSkip, onHighlight, isDark }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const step = steps[current];
  const isFirst = current === 0;
  const isLast = current === steps.length - 1;
  const progress = ((current + 1) / steps.length) * 100;

  useEffect(() => {
    onHighlight?.(step.highlight ?? null);
  }, [current, step.highlight, onHighlight]);

  const goNext = () => {
    if (isLast) {
      onHighlight?.(null);
      onComplete();
    } else {
      setDirection(1);
      setCurrent(c => c + 1);
    }
  };

  const goBack = () => {
    setDirection(-1);
    setCurrent(c => c - 1);
  };

  const handleSkip = () => {
    onHighlight?.(null);
    onSkip();
  };

  const bg        = isDark ? 'rgba(9,9,11,0.97)'          : '#ffffff';
  const border    = isDark ? 'rgba(255,255,255,0.08)'      : '#e2e8f0';
  const titleC    = isDark ? '#f8fafc'                     : '#0f172a';
  const descC     = isDark ? '#94a3b8'                     : '#475569';
  const trackC    = isDark ? 'rgba(255,255,255,0.07)'      : '#f1f5f9';
  const dotInactC = isDark ? 'rgba(255,255,255,0.15)'      : '#cbd5e1';

  const variants = {
    enter:  (d) => ({ opacity: 0, x: d * 40, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit:   (d) => ({ opacity: 0, x: d * -40, scale: 0.97 }),
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleSkip}
        style={{
          position: 'fixed', inset: 0,
          background: isDark ? 'rgba(0,0,0,0.72)' : 'rgba(15,23,42,0.55)',
          backdropFilter: 'blur(6px)',
          zIndex: 9970,
        }}
      />

      {/* Card wrapper — centers via flexbox instead of transform, since Framer
          Motion owns the `transform` property for the animated scale/y below
          and would silently clobber a manual translate(-50%,-50%) offset. */}
      <div
        onClick={handleSkip}
        style={{
          position: 'fixed', inset: 0, zIndex: 9975,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
        }}
      >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 28 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 440,
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          background: bg,
          borderRadius: 28,
          border: `1px solid ${border}`,
          boxShadow: isDark
            ? '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)'
            : '0 32px 80px rgba(15,23,42,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {/* Progress bar */}
        <div style={{ height: 3, background: trackC, flexShrink: 0 }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{ height: '100%', background: 'linear-gradient(90deg,#2563eb,#3b82f6)', borderRadius: 99 }}
          />
        </div>

        <div style={{ padding: 'clamp(20px, 5vw, 32px) clamp(20px, 5vw, 32px) clamp(16px, 4vw, 28px)', overflowY: 'auto', minHeight: 0 }}>

          {/* Step counter top-right */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <span style={{
              padding: '4px 12px', borderRadius: 99,
              background: isDark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.08)',
              color: '#2563eb', fontSize: '.75rem', fontWeight: 800, letterSpacing: '.4px',
            }}>
              {current + 1} / {steps.length}
            </span>
            {!isLast && (
              <button
                onClick={handleSkip}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: isDark ? '#64748b' : '#94a3b8',
                  fontSize: '.82rem', fontWeight: 600, padding: '4px 8px',
                  borderRadius: 8, transition: 'color .18s',
                }}
                onMouseOver={e => e.currentTarget.style.color = isDark ? '#94a3b8' : '#475569'}
                onMouseOut={e => e.currentTarget.style.color = isDark ? '#64748b' : '#94a3b8'}
              >
                Saltar tour →
              </button>
            )}
          </div>

          {/* Animated step content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Icon */}
              <div style={{
                width: 80, height: 80, borderRadius: 22,
                background: step.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.2rem', marginBottom: 22,
                boxShadow: `0 12px 32px ${step.shadowColor || 'rgba(37, 99, 235, 0.3)'}`,
              }}>
                <i className={`bi ${step.icon}`} style={{ fontSize: '2.2rem', color: '#fff' }} />
              </div>

              {/* Title */}
              <h2 style={{
                margin: '0 0 12px', fontSize: '1.45rem', fontWeight: 900,
                letterSpacing: '-.4px', color: titleC, lineHeight: 1.2,
              }}>
                {step.title}
              </h2>

              {/* Description */}
              <p style={{
                margin: 0, fontSize: '.97rem', color: descC,
                lineHeight: 1.65, fontWeight: 450,
              }}>
                {step.description}
              </p>

              {/* Tip (optional) */}
              {step.tip && (
                <div style={{
                  marginTop: 18, padding: '12px 16px',
                  background: isDark ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.06)',
                  border: `1px solid ${isDark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.25)'}`,
                  borderRadius: 12,
                  fontSize: '.84rem', color: '#2563eb', fontWeight: 600,
                  display: 'flex', gap: 8, alignItems: 'flex-start',
                }}>
                  <i className="bi bi-lightbulb-fill" style={{ flexShrink: 0, color: '#2563eb' }} />
                  {step.tip}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 28, marginBottom: 24 }}>
            {steps.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === current ? 20 : 7,
                  background: i === current ? '#2563eb' : dotInactC,
                }}
                transition={{ duration: 0.25 }}
                style={{ height: 7, borderRadius: 99, cursor: 'pointer' }}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {!isFirst && (
              <button
                onClick={goBack}
                style={{
                  flex: 1, padding: '13px 0', borderRadius: 13, cursor: 'pointer',
                  border: `1.5px solid ${border}`,
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                  color: descC, fontWeight: 700, fontSize: '.95rem',
                  transition: 'all .18s', fontFamily: 'inherit',
                }}
                onMouseOver={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.09)' : '#f1f5f9'}
                onMouseOut={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'}
              >
                ← Anterior
              </button>
            )}
            <button
              onClick={goNext}
              style={{
                flex: 2, padding: '13px 0', borderRadius: 13, cursor: 'pointer',
                border: 'none',
                background: isLast
                  ? 'linear-gradient(135deg,#2563eb,#1d4ed8)'
                  : 'linear-gradient(135deg,#2563eb,#3b82f6)',
                color: '#fff', fontWeight: 800, fontSize: '.95rem',
                boxShadow: '0 4px 18px rgba(37, 99, 235, 0.32)',
                transition: 'all .2s', fontFamily: 'inherit',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(37, 99, 235, 0.45)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 18px rgba(37, 99, 235, 0.32)'; }}
            >
              {isLast ? '¡Empezar ahora!' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </motion.div>
      </div>
    </>
  );
};

export default OnboardingTour;
