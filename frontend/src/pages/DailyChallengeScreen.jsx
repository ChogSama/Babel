import { useState } from 'react';
import { StarBackground } from '../components/UI';

export function DailyChallengeScreen({ dailyChallenge, player, onStart, onNavigate }) {
  const [starting, setStarting] = useState(false);

  const handleStart = () => {
    setStarting(true);
    setTimeout(() => onStart(), 200);
  };

  const question = dailyChallenge?.question;
  const languageFlags = { fi: '🇫🇮', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', en: '🇬🇧' };
  const languageNames = { fi: 'Finnish', es: 'Spanish', fr: 'French', de: 'German', en: 'English' };
  const langId = question?.languageId;

  return (
    <div className="screen" style={{ padding: '100px 0 60px', position: 'relative' }}>
      <StarBackground />
      <div className="bg-animated" />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '680px' }}>
        {/* Header badge */}
        <div style={{ textAlign: 'center', marginBottom: '40px', animation: 'fadeIn 0.5s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 20px',
            background: 'rgba(255,215,0,0.08)',
            border: '1px solid rgba(255,215,0,0.25)',
            borderRadius: 'var(--radius-full)',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--clr-gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              📅 Daily Challenge · {dailyChallenge?.date}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, #ffd700 0%, #a855f7 60%, #00e5ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '12px',
          }}>
            Today's Challenge
          </h1>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '1rem', maxWidth: '460px', margin: '0 auto' }}>
            One question. One chance. Shared by all players today — come back tomorrow for a new one.
          </p>
        </div>

        {/* Streak + community stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px',
          marginBottom: '28px', animation: 'fadeIn 0.5s ease 0.1s both',
        }}>
          {[
            { icon: '🔥', label: 'Your Streak', value: `${player?.streak ?? 0} days` },
            { icon: '👥', label: 'Completed Today', value: (dailyChallenge?.completedBy ?? 0).toLocaleString() },
            { icon: '📊', label: 'Avg Score', value: `${dailyChallenge?.avgScore ?? 0} pts` },
          ].map((s, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--clr-gold)' }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mystery question card */}
        <div className="card" style={{
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(255,215,0,0.04), rgba(124,58,255,0.04))',
          borderColor: 'rgba(255,215,0,0.2)',
          boxShadow: '0 0 40px rgba(255,215,0,0.06)',
          animation: 'fadeInScale 0.5s ease 0.2s both',
        }}>
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Mystery Question
            </div>
            {langId && (
              <div style={{
                fontSize: '0.72rem', fontWeight: 700, color: 'var(--clr-gold)',
                background: 'rgba(255,215,0,0.08)',
                border: '1px solid rgba(255,215,0,0.2)',
                borderRadius: 'var(--radius-full)',
                padding: '2px 10px',
              }}>
                {languageFlags[langId]} {languageNames[langId]}
              </div>
            )}
          </div>

          {/* Blurred/revealed question */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(1rem, 3vw, 1.4rem)',
            fontWeight: 600,
            color: 'var(--clr-accent)',
            letterSpacing: '0.03em',
            lineHeight: 1.6,
            padding: '16px',
            background: 'rgba(0,229,255,0.04)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(0,229,255,0.1)',
            textAlign: 'center',
            filter: 'blur(0px)',
          }}>
            "{question?.translatedContent}"
          </div>

          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {question && (
              <>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                  {question.categoryIcon} {question.category}
                </span>
                <span className={`badge ${question.difficulty === 'EASY' ? 'badge-success' : question.difficulty === 'MEDIUM' ? 'badge-accent' : 'badge-danger'}`}>
                  {question.difficulty}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', alignSelf: 'center', marginLeft: 'auto' }}>
                  ⏱️ {question.timeLimit}s to answer
                </span>
              </>
            )}
          </div>
        </div>

        {/* Rules */}
        <div className="card" style={{
          marginBottom: '32px',
          background: 'rgba(124,58,255,0.04)',
          borderColor: 'rgba(124,58,255,0.15)',
          animation: 'fadeIn 0.5s ease 0.3s both',
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--clr-primary-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            ⚔️ Challenge Rules
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              '📖 Use Power-ups to decode the foreign-language question',
              '🎯 Answer correctly for maximum points',
              '⚡ Faster answers earn more score — time is ticking!',
              '💡 Each Power-up used reduces your potential score',
              '🏆 Score counts toward your daily streak bonus',
            ].map((rule, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: 'var(--clr-text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ flexShrink: 0 }}>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.5s ease 0.4s both' }}>
          <button
            id="btn-start-daily"
            className="btn btn-gold btn-lg"
            style={{ width: '100%', opacity: starting ? 0.7 : 1, transition: 'opacity 0.2s' }}
            onClick={handleStart}
            disabled={starting}
          >
            {starting ? '⚡ Loading...' : '🎯 Start Challenge'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('game-mode')}>
            ← Back to Mode Selection
          </button>
        </div>
      </div>
    </div>
  );
}
