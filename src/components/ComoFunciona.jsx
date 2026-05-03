import { useState } from 'react';

const ComoFunciona = () => {
  const steps = [
    {
      id: 1,
      icon: "🔍",
      title: "Encuentra tu cancha ideal",
      description: "Filtra por deporte, ubicación y fecha. Explora cientos de complejos deportivos, compara precios y elige el mejor para tu equipo."
    },
    {
      id: 2,
      icon: "💳",
      title: "Reserva y divide el pago",
      description: "Olvídate de cobrarle a tus amigos. Reserva la cancha y comparte un enlace para que cada jugador pague su parte automáticamente."
    },
    {
      id: 3,
      icon: "🏆",
      title: "¡A jugar!",
      description: "Preséntate en el club con tu reserva digital. Disfruta del partido, suma puntos PlayStop y sube de nivel en nuestro ranking."
    }
  ];

  return (
    <section id="como-funciona" style={{ padding: '120px 5%', backgroundColor: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
      <style>
        {`
          .step-card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            padding: 40px 32px;
            position: relative;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 2;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
            overflow: hidden;
          }
          .step-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 25px 50px -12px rgba(0, 208, 132, 0.25);
            border-color: rgba(0, 208, 132, 0.4);
          }
          .step-icon-container {
            width: 72px;
            height: 72px;
            border-radius: 20px;
            background: linear-gradient(135deg, rgba(0, 208, 132, 0.15), rgba(59, 130, 246, 0.05));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.2rem;
            margin-bottom: 28px;
            border: 1px solid rgba(0, 208, 132, 0.2);
          }
          .step-bg-number {
            position: absolute;
            top: -20px;
            right: -10px;
            font-size: 10rem;
            font-weight: 900;
            color: #f1f5f9;
            z-index: -1;
            line-height: 1;
            pointer-events: none;
            transition: all 0.4s ease;
          }
          .step-card:hover .step-bg-number {
            color: rgba(0, 208, 132, 0.05);
            transform: scale(1.1) rotate(-5deg);
          }
        `}
      </style>

      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 60px auto' }}>
        <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(0, 208, 132, 0.1)', border: '1px solid rgba(0, 208, 132, 0.3)', color: '#00d084', borderRadius: '30px', fontWeight: '800', fontSize: '0.85rem', marginBottom: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Simple y Rápido
        </div>
        <h2 style={{ fontSize: '3.2rem', color: '#0f172a', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1.5px', lineHeight: '1.1' }}>
          Reserva tu próxima partida en <span style={{ color: '#00d084' }}>3 simples pasos</span>
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: '1.7' }}>
          Diseñamos PlayStop para que no pierdas tiempo organizando. En menos de 2 minutos estarás listo para entrar a la cancha con tu equipo.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {steps.map((step) => (
          <div key={step.id} className="step-card">
            <div className="step-bg-number">{step.id}</div>
            <div className="step-icon-container">{step.icon}</div>
            <h3 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.5px' }}>{step.id}. {step.title}</h3>
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.6', margin: 0, fontWeight: '500' }}>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComoFunciona;