import { StarBackground } from '../components/UI';

export function ResultScreen({ result, language, onPlayAgain, onNavigate }) {
  const { score, correct, total, hintsUsed, timeBonus = 0 } = result;
  const accuracy = Math.round((correct / total) * 100);
  const grade = accuracy >= 80 ? 'S' : accuracy >= 60 ? 'A' : accuracy >= 40 ? 'B' : 'C';
  const gradeColors = { S: 'var(--clr-gold)', A: 'var(--clr-success)', B: 'var(--clr-accent)', C: 'var(--clr-warning)' };

  const scoreItems = [
    { label: 'Base Score', value: score, color: 'var(--clr-text-primary)' },
    { label: 'Accuracy Bonus', value: Math.round(accuracy * 8), color: 'var(--clr-success)' },
    { label: 'Speed Bonus', value: timeBonus, color: 'var(--clr-accent)' },
    { label: 'Hints Used', value: `-${hintsUsed * 50}`, color: 'var(--clr-danger)' },
  ];
  const finalScore = Math.max(score + Math.round(accuracy * 8) + timeBonus - hintsUsed * 50, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
      <StarBackground />
      <div className="bg-animated" />

      <div style={{ width: '100%', maxWidth: '600px', position: 'relative', zIndex: 1, animation: 'fadeInScale 0.5s ease' }}>
        {/* Grade Circle */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: `radial-gradient(circle, ${gradeColors[grade]}22, transparent)`,
            border: `3px solid ${gradeColors[grade]}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: `0 0 40px ${gradeColors[grade]}44`,
            animation: 'glow 2s ease-in-out infinite',
          }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 900,
              color: gradeColors[grade],
            }}>{grade}</span>
          </div>
          <h2 style={{ marginBottom: '4px' }}>
            {grade === 'S' ? '🏆 Legendary!' : grade === 'A' ? '⭐ Excellent!' : grade === 'B' ? '👍 Good Job!' : '📚 Keep Going!'}
          </h2>
          <p style={{ color: 'var(--clr-text-muted)' }}>
            You decoded {language?.name || 'a foreign language'} like a true linguist
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="card-glass" style={{ marginBottom: '24px', padding: '28px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '20px', color: 'var(--clr-text-secondary)' }}>Score Breakdown</h3>
          {scoreItems.map((item, i) => (
            <div key={i} className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
              <span style={{ color: 'var(--clr-text-secondary)', fontSize: '0.9rem' }}>{item.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: item.color }}>
                {typeof item.value === 'number' && item.value > 0 ? '+' : ''}{item.value}
              </span>
            </div>
          ))}
          <div style={{ height: 1, background: 'var(--clr-border)', margin: '16px 0' }} />
          <div className="flex justify-between items-center">
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total Score</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 900,
              color: 'var(--clr-gold)',
            }}>
              {finalScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {[
            { label: 'Accuracy', value: `${accuracy}%`, icon: '🎯' },
            { label: 'Correct', value: `${correct}/${total}`, icon: '✅' },
            { label: 'Hints Used', value: hintsUsed, icon: '💡' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--clr-text-primary)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* XP Bar */}
        <div className="card" style={{ marginBottom: '24px', background: 'rgba(255,215,0,0.05)', borderColor: 'rgba(255,215,0,0.15)' }}>
          <div className="flex justify-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--clr-gold)', fontWeight: 600 }}>XP Gained: +{Math.round(finalScore / 10)}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>Level 7 → 7</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill progress-fill-gold" style={{ width: '70%' }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            id="btn-play-again"
            className="btn btn-primary"
            style={{ flex: 1, padding: '14px' }}
            onClick={onPlayAgain}
          >
            ⚔️ Play Again
          </button>
          <button
            className="btn btn-outline"
            style={{ flex: 1, padding: '14px' }}
            onClick={() => onNavigate('notebook')}
          >
            📓 View Notebook
          </button>
        </div>
        <button
          className="btn btn-ghost"
          style={{ width: '100%', marginTop: '12px' }}
          onClick={() => onNavigate('home')}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
