import { useState } from 'react';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      target: 'Jugadores',
      color: '#00d084',
      bg: 'rgba(0, 208, 132, 0.05)',
      question: "¿Cómo funciona el pago dividido?",
      answer: "Es muy fácil. Al hacer una reserva, pagas solo tu parte de la cuota. PlayStop generará un enlace único que podrás enviar a tus amigos por WhatsApp. Ellos tendrán hasta 2 horas antes del partido para entrar al enlace y pagar su parte correspondiente. ¡Adiós a perseguir a los deudores!"
    },
    {
      target: 'Jugadores',
      color: '#00d084',
      bg: 'rgba(0, 208, 132, 0.05)',
      question: "¿Qué pasa si llueve o no podemos ir?",
      answer: "Puedes cancelar o reprogramar tu reserva desde la app sin ninguna penalidad hasta 12 horas antes del partido. Si el complejo deportivo cancela la reserva por motivos de fuerza mayor (como clima extremo), recibirás un reembolso automático del 100%."
    },
    {
      target: 'Clubes',
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.05)',
      question: "¿Cuándo y cómo recibo mis ingresos?",
      answer: "Todas las transacciones procesadas a través de PlayStop se depositan automáticamente en la cuenta bancaria de tu complejo en un plazo máximo de 24 a 48 horas hábiles. Podrás ver el detalle y descargar comprobantes desde tu panel financiero."
    },
    {
      target: 'Clubes',
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.05)',
      question: "¿Qué ocurre si un grupo no completa el pago dividido?",
      answer: "Si el grupo no completa el 100% del pago en el tiempo límite, la reserva se cancela automáticamente y la cancha se libera en el sistema para que alguien más pueda tomarla. El cobro retenido inicialmente se reembolsa a la persona que hizo la reserva (menos la comisión operativa, según tu política)."
    },
    {
      target: 'General',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.05)',
      question: "¿La plataforma tiene algún costo?",
      answer: "Para los jugadores, descargar la app y buscar canchas es 100% gratis; solo pagan el alquiler de la cancha. Para los complejos deportivos, ofrecemos un modelo sin costo de afiliación, donde solo cobramos una pequeña comisión por reserva exitosa en nuestro Plan Básico, o una cuota fija mensual en nuestros planes PRO."
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section reveal" id="faq" style={{ scrollMarginTop: '80px', padding: '100px 5%', backgroundColor: '#f8fafc', position: 'relative' }}>
      <style>
        {`
          @media (max-width: 768px) {
            .faq-section { padding: 60px 5% !important; }
            .faq-title { font-size: 2.2rem !important; }
          }
        `}
      </style>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(15, 23, 42, 0.1)', border: '1px solid rgba(15, 23, 42, 0.2)', color: '#0f172a', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Preguntas Frecuentes
          </div>
          <h2 className="faq-title" style={{ fontSize: '3rem', color: '#0f172a', fontWeight: '900', margin: '0 0 16px 0', letterSpacing: '-1px' }}>
            Resolvemos tus <span style={{ color: '#00d084' }}>dudas</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: '1.6' }}>
            Todo lo que necesitas saber sobre PlayStop, ya seas un jugador buscando cancha o un club optimizando sus reservas.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} style={{ backgroundColor: '#ffffff', border: '1px solid', borderColor: isOpen ? faq.color : '#e2e8f0', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: isOpen ? `0 10px 25px -5px ${faq.color}20` : '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div onClick={() => toggleFaq(index)} style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: isOpen ? faq.bg : '#ffffff', transition: 'background-color 0.3s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: faq.color, border: `1px solid ${faq.color}50`, padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase', backgroundColor: '#ffffff', display: window.innerWidth > 600 ? 'block' : 'none' }}>
                      {faq.target}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', paddingRight: '20px' }}>{faq.question}</h3>
                  </div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0f172a', fontWeight: 'bold', fontSize: '1.5rem', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', border: '1px solid #e2e8f0', flexShrink: 0, lineHeight: 0 }}>
                    +
                  </div>
                </div>
                <div style={{ maxHeight: isOpen ? '500px' : '0', opacity: isOpen ? 1 : 0, transition: 'all 0.3s ease-in-out', overflow: 'hidden' }}>
                  <div style={{ padding: '0 24px 24px 24px' }}>
                    <div style={{ height: '1px', backgroundColor: '#e2e8f0', marginBottom: '20px', marginTop: isOpen && faq.bg !== '#ffffff' ? '0' : '20px' }}></div>
                    <p style={{ margin: 0, color: '#475569', lineHeight: '1.7', fontSize: '1.05rem' }}>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;