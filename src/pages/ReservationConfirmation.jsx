import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { BookingSuccess, fmtPrice } from './BookingFlow.jsx';

const POLL_INTERVAL_MS = 2500;
const MAX_ATTEMPTS = 24; // ~1 minuto

export default function ReservationConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reservation, setReservation] = useState(null);
  const [status, setStatus] = useState('polling'); // polling | confirmed | cancelled | timeout | error
  const attemptsRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer;

    const poll = async () => {
      try {
        const data = await api.getReservationById(id);
        if (cancelled) return;
        setReservation(data);

        if (data.status === 'CONFIRMED') { setStatus('confirmed'); return; }
        if (data.status === 'CANCELLED') { setStatus('cancelled'); return; }

        attemptsRef.current += 1;
        if (attemptsRef.current >= MAX_ATTEMPTS) { setStatus('timeout'); return; }
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    poll();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [id]);

  if (status === 'polling') {
    return (
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32, textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #1e293b', borderTop: '3px solid #2563eb', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#94a3b8', fontWeight: 700 }}>Verificando tu pago...</p>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Esto puede tardar unos segundos.</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === 'confirmed' && reservation) {
    return (
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '0 0 40px' }}>
        <div style={{ width: '100%', maxWidth: 480, minHeight: '100vh' }}>
          <BookingSuccess
            court={{ name: reservation.courtName, pricePerHour: reservation.totalAmount }}
            booking={{ date: reservation.date, slot: String(reservation.slotHour) }}
            reservationId={reservation.id}
            userEmail={user?.email}
            onDone={() => navigate('/dashboard', { state: { tab: 'Mis Reservas' } })}
          />
        </div>
      </div>
    );
  }

  const messages = {
    cancelled: { title: 'El pago no se completó', body: 'Tu reserva fue liberada. Puedes intentarlo de nuevo cuando quieras.' },
    timeout: { title: 'Estamos confirmando tu pago', body: 'Está tardando más de lo normal. Si el cargo se realizó, la reserva se confirmará en unos minutos y te llegará un correo — revisa "Mis Reservas" más tarde.' },
    error: { title: 'No pudimos verificar tu reserva', body: 'Ocurrió un error al consultar el estado del pago. Revisa "Mis Reservas" o intenta de nuevo.' },
  };
  const { title, body } = messages[status] || messages.error;

  return (
    <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32, textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem' }}><i className="bi bi-info-circle-fill" style={{ color: '#f59e0b' }} /></div>
      <h2 style={{ color: '#f1f5f9', margin: 0 }}>{title}</h2>
      <p style={{ color: '#94a3b8', maxWidth: 360, lineHeight: 1.6 }}>{body}</p>
      {reservation && <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Total: {fmtPrice(reservation.totalAmount)}</p>}
      <button onClick={() => navigate('/dashboard', { state: { tab: 'Mis Reservas' } })}
        style={{ padding: '12px 24px', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>
        Ir a Mis Reservas
      </button>
    </div>
  );
}
