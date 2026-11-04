import { useState } from 'react';
import { StarBackground } from '../components/UI';

export function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ username: form.username || 'BabelExplorer', email: form.email });
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
      <StarBackground />
      <div className="bg-animated" />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1, animation: 'fadeInScale 0.4s ease' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3rem',
            fontWeight: 900,
            letterSpacing: '0.12em',
            background: 'linear-gradient(135deg, #ffd700, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '8px',
          }}>BABEL</div>
          <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-muted)' }}>
            Language Deciphering & Knowledge Discovery
          </p>
        </div>

        <div className="card-glass" style={{ padding: '36px' }}>
          {/* Mode Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            marginBottom: '28px',
          }}>
            {['login', 'register'].map(m => (
              <button
                key={m}
                id={`tab-${m}`}
                onClick={() => setMode(m)}
                style={{
                  padding: '10px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: mode === m ? 'var(--clr-primary)' : 'transparent',
                  color: mode === m ? 'white' : 'var(--clr-text-muted)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize',
                }}
              >
                {m === 'login' ? '🔑 Sign In' : '✨ Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mode === 'register' && (
                <div className="form-group">
                  <label className="label">Username</label>
                  <input
                    id="input-username"
                    className="input"
                    type="text"
                    placeholder="Choose your explorer name"
                    value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="label">Email</label>
                <input
                  id="input-email"
                  className="input"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Password</label>
                <input
                  id="input-password"
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>

              <button
                id="btn-auth-submit"
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: '8px', width: '100%', padding: '14px' }}
                disabled={loading}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="animate-spin" style={{ fontSize: '0.9rem' }}>⟳</span>
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  mode === 'login' ? '🔑 Sign In' : '🚀 Start Exploring'
                )}
              </button>
            </div>
          </form>

          <div className="divider-text" style={{ margin: '24px 0' }}>
            <span>or continue as</span>
          </div>

          <button
            id="btn-guest"
            className="btn btn-outline"
            style={{ width: '100%' }}
            onClick={() => onLogin({ username: 'Guest Explorer', email: 'guest@babel.game' })}
          >
            👤 Guest Mode
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
          By playing, you agree to decode at least one foreign language today 🌐
        </p>
      </div>
    </div>
  );
}
