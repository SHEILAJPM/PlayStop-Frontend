import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const C = this.props.C || {};
    return (
      <div style={{
        padding: '40px 24px', textAlign: 'center',
        background: C.cardBg || '#0f172a',
        border: `1px solid ${C.cardBorder || '#1e293b'}`,
        borderRadius: '20px', margin: '16px 0',
      }}>
        <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '2.5rem', color: '#ef4444', display: 'block', marginBottom: 16 }} />
        <p style={{ color: C.textPrimary || '#f1f5f9', fontWeight: 800, fontSize: '1rem', margin: '0 0 8px' }}>
          Algo salió mal en esta sección
        </p>
        <p style={{ color: C.textMuted || '#64748b', fontSize: '0.85rem', margin: '0 0 20px' }}>
          {this.state.error?.message || 'Error inesperado'}
        </p>
        <button
          onClick={() => this.setState({ hasError: false, error: null })}
          style={{ padding: '10px 24px', background: '#1e293b', border: '1px solid #334155', borderRadius: 10, color: '#f1f5f9', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
          Reintentar
        </button>
      </div>
    );
  }
}
