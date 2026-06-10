import { useState, useEffect } from 'react';
import { api } from '../../../services/api.js';

const ReferidosTab = ({ user }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [applyMsg, setApplyMsg] = useState('');
  const [applying, setApplying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getReferralInfo()
      .then(setInfo)
      .catch(() => setInfo(null))
      .finally(() => setLoading(false));
  }, []);

  const copyCode = () => {
    if (!info?.referralCode) return;
    navigator.clipboard.writeText(info.referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setApplying(true); setApplyMsg('');
    try {
      await api.applyReferralCode(code.trim().toUpperCase());
      setApplyMsg('✅ ¡Código aplicado! Tu amigo ya sabe que te uniste.');
      setCode('');
    } catch (err) {
      setApplyMsg('❌ ' + (err.message || 'Código inválido o ya usado'));
    } finally { setApplying(false); }
  };

  const shareLink = `https://playstop.pe/register?ref=${info?.referralCode || ''}`;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.15),rgba(0,208,132,0.1))', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 20, padding: '28px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#00d084)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="bi bi-gift-fill" style={{ color: '#fff', fontSize: '1.4rem' }} />
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px', fontWeight: 900, fontSize: '1.3rem' }}>Programa de Referidos</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>Invita amigos y gana S/ 10 en créditos por cada uno que reserve</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { icon: 'bi-person-plus-fill', value: loading ? '...' : info?.totalReferrals ?? 0,       label: 'Amigos invitados' },
            { icon: 'bi-cash-stack',        value: loading ? '...' : `S/ ${info?.creditsEarned ?? 0}`, label: 'Créditos ganados' },
            { icon: 'bi-trophy-fill',       value: 'S/ 10',                                            label: 'Por cada reserva' },
          ].map(({ icon, value, label }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px', textAlign: 'center' }}>
              <i className={`bi ${icon}`} style={{ color: '#00d084', fontSize: '1.3rem', display: 'block', marginBottom: 6 }} />
              <p style={{ margin: '0 0 2px', fontWeight: 900, fontSize: '1.2rem' }}>{value}</p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid #1e293b', borderRadius: 18, padding: '22px', marginBottom: 20 }}>
        <p style={{ margin: '0 0 10px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tu código de referido</p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flex: 1, background: '#030712', border: '1px solid #334155', borderRadius: 12, padding: '14px 18px', fontFamily: 'monospace', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.2em', color: '#00d084', textAlign: 'center' }}>
            {loading ? '...' : info?.referralCode ?? '—'}
          </div>
          <button onClick={copyCode} aria-label="Copiar código"
            style={{ background: copied ? 'rgba(0,208,132,0.2)' : '#1e293b', border: `1px solid ${copied ? '#00d084' : '#334155'}`, color: copied ? '#00d084' : '#94a3b8', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`} />
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <a href={`https://wa.me/?text=${encodeURIComponent(`🏟️ Reserva canchas en PlayStop y recibe S/ 10 de descuento con mi código *${info?.referralCode}*. Regístrate aquí: ${shareLink}`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 14px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, minWidth: 120 }}>
            <i className="bi bi-whatsapp" /> Compartir por WhatsApp
          </a>
          <button onClick={() => navigator.share?.({ title: 'PlayStop', text: `Usa mi código ${info?.referralCode} y obtén S/ 10 de descuento`, url: shareLink }) || copyCode()}
            style={{ flex: 1, background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: 10, padding: '10px 14px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, minWidth: 120 }}>
            <i className="bi bi-share-fill" /> Compartir enlace
          </button>
        </div>
      </div>

      <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid #1e293b', borderRadius: 18, padding: '22px' }}>
        <p style={{ margin: '0 0 6px', color: '#f1f5f9', fontWeight: 800, fontSize: '0.95rem' }}>¿Tienes un código de amigo?</p>
        <p style={{ margin: '0 0 14px', color: '#64748b', fontSize: '0.82rem' }}>Aplica un código para obtener S/ 10 de créditos en tu primera reserva</p>
        <form onSubmit={handleApply} style={{ display: 'flex', gap: 10 }}>
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="XXXXXXXX"
            maxLength={12} style={{ flex: 1, background: '#030712', border: '1px solid #1e293b', borderRadius: 10, color: '#f1f5f9', padding: '11px 14px', fontSize: '1rem', fontFamily: 'monospace', letterSpacing: '0.1em', outline: 'none', boxSizing: 'border-box', fontWeight: 700 }} />
          <button type="submit" disabled={applying || !code.trim()}
            style={{ background: code.trim() ? 'linear-gradient(135deg,#00d084,#00b875)' : '#1e293b', color: code.trim() ? '#0a1628' : '#475569', border: 'none', borderRadius: 10, padding: '11px 18px', fontWeight: 800, cursor: code.trim() ? 'pointer' : 'not-allowed', fontSize: '0.88rem' }}>
            {applying ? 'Aplicando...' : 'Aplicar'}
          </button>
        </form>
        {applyMsg && <p style={{ margin: '10px 0 0', fontSize: '0.85rem', fontWeight: 700 }}>{applyMsg}</p>}
      </div>
    </div>
  );
};

export default ReferidosTab;
