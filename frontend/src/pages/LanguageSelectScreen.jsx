import { StarBackground, LanguageCard } from '../components/UI';

export function LanguageSelectScreen({ languages, onSelect, onBack }) {
  const unlocked = languages.filter(l => l.unlocked);
  const locked = languages.filter(l => !l.unlocked);

  return (
    <div className="screen" style={{ padding: '100px 0 60px' }}>
      <StarBackground />
      <div className="bg-animated" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '32px', animation: 'fadeIn 0.5s ease' }}>
          <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: '16px' }}>
            ← Back
          </button>
          <h1 style={{ marginBottom: '8px' }}>Language Expedition</h1>
          <p style={{ color: 'var(--clr-text-muted)' }}>
            Select a language to begin your deciphering journey
          </p>
        </div>

        {/* Unlocked Languages */}
        <div style={{ marginBottom: '48px', animation: 'fadeIn 0.6s ease 0.1s both' }}>
          <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Available Languages</h2>
            <div className="badge badge-success">{unlocked.length} unlocked</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {unlocked.map(lang => (
              <LanguageCard key={lang.id} language={lang} onClick={onSelect} />
            ))}
          </div>
        </div>

        {/* Locked Languages */}
        {locked.length > 0 && (
          <div style={{ animation: 'fadeIn 0.6s ease 0.2s both' }}>
            <div className="flex items-center gap-3" style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--clr-text-muted)' }}>Coming Soon</h2>
              <div className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--clr-text-muted)' }}>
                {locked.length} locked
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {locked.map(lang => (
                <LanguageCard key={lang.id} language={lang} />
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="card" style={{
          marginTop: '48px',
          background: 'rgba(124,58,255,0.05)',
          borderColor: 'rgba(124,58,255,0.2)',
          animation: 'fadeIn 0.6s ease 0.3s both',
        }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--clr-primary-light)' }}>
            🗺️ How Language Expedition Works
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', textAlign: 'center' }}>
            {[
              { phase: 'Discovery', icon: '👁️', desc: 'First contact with the language' },
              { phase: 'Recognition', icon: '💡', desc: 'Identify familiar patterns' },
              { phase: 'Comprehension', icon: '🧠', desc: 'Understand sentence structure' },
              { phase: 'Independence', icon: '🔓', desc: 'Decode with less help' },
              { phase: 'Mastery', icon: '⭐', desc: 'Answer without assistance' },
            ].map((step, i) => (
              <div key={i} style={{
                padding: '12px 8px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.03)',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{step.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--clr-primary-light)', marginBottom: '4px' }}>
                  {step.phase}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
