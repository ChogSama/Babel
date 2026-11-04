import { useState } from 'react';
import { StarBackground } from '../components/UI';

export function HomeScreen({ onNavigate, player, dailyChallenge }) {
  const [hoverMode, setHoverMode] = useState(null);

  const modes = [
    {
      id: 'expedition',
      icon: '🗺️',
      title: 'Language Expedition',
      desc: 'Journey through one language, 5–10 questions, increasing difficulty',
      color: 'var(--clr-primary)',
      glow: 'var(--clr-primary-glow)',
    },
    {
      id: 'random',
      icon: '🎲',
      title: 'Random Challenge',
      desc: 'Surprise questions from languages you have unlocked',
      color: 'var(--clr-accent)',
      glow: 'var(--clr-accent-glow)',
    },
    {
      id: 'daily',
      icon: '📅',
      title: 'Daily Challenge',
      desc: 'One special question shared by all players today',
      color: 'var(--clr-gold)',
      glow: 'var(--clr-gold-glow)',
    },
  ];

  return (
    <div className="screen" style={{ padding: '100px 0 60px' }}>
      <StarBackground />
      <div className="bg-animated" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '64px', animation: 'fadeIn 0.6s ease' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 20px',
            background: 'rgba(255,215,0,0.08)',
            border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: 'var(--radius-full)',
            marginBottom: '24px',
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--clr-gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              🔥 {player.streak}-Day Streak
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 900,
            letterSpacing: '0.12em',
            background: 'linear-gradient(135deg, #ffd700 0%, #a855f7 50%, #00e5ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '16px',
            lineHeight: 1,
          }}>
            BABEL
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--clr-text-secondary)', maxWidth: '500px', margin: '0 auto 32px' }}>
            Decode questions written in foreign languages. Unravel their meaning — then answer with your knowledge.
          </p>

          <div className="flex justify-center gap-4">
            <button
              id="btn-play-now"
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('game-mode')}
            >
              ⚔️ Play Now
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => onNavigate('dashboard')}
            >
              📊 My Progress
            </button>
          </div>
        </div>

        {/* Player Stats Banner */}
        <div className="card-glass" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0',
          marginBottom: '48px',
          padding: '0',
          overflow: 'hidden',
          animation: 'fadeIn 0.8s ease 0.2s both',
        }}>
          {[
            { label: 'Level', value: `Lv.${player.level}`, icon: '⭐', color: 'var(--clr-gold)' },
            { label: 'Score', value: player.totalScore.toLocaleString(), icon: '🏆', color: 'var(--clr-primary-light)' },
            { label: 'Questions', value: player.questionsCompleted, icon: '❓', color: 'var(--clr-accent)' },
            { label: 'Accuracy', value: `${player.accuracyRate}%`, icon: '🎯', color: 'var(--clr-success)' },
            { label: 'Words', value: player.wordsDiscovered, icon: '📚', color: '#ff9f1c' },
          ].map((stat, i) => (
            <div key={i} style={{
              textAlign: 'center',
              padding: '20px 16px',
              borderRight: i < 4 ? '1px solid var(--clr-border)' : 'none',
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Game Mode Cards */}
        <div style={{ marginBottom: '48px', animation: 'fadeIn 0.8s ease 0.3s both' }}>
          <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Choose Your Challenge</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {modes.map(mode => (
              <div
                key={mode.id}
                id={`mode-card-${mode.id}`}
                className="card"
                onClick={() => onNavigate(mode.id === 'expedition' ? 'language-select' : mode.id === 'random' ? 'game' : 'game')}
                style={{
                  cursor: 'pointer',
                  borderColor: hoverMode === mode.id ? mode.color : 'var(--clr-border)',
                  boxShadow: hoverMode === mode.id ? `0 0 24px ${mode.glow}` : 'none',
                  transition: 'all 0.25s ease',
                  textAlign: 'center',
                  padding: '32px 24px',
                }}
                onMouseEnter={() => setHoverMode(mode.id)}
                onMouseLeave={() => setHoverMode(null)}
              >
                <div style={{ fontSize: '3rem', marginBottom: '16px', animation: hoverMode === mode.id ? 'float 2s ease-in-out infinite' : 'none' }}>
                  {mode.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: hoverMode === mode.id ? mode.color : 'var(--clr-text-primary)' }}>
                  {mode.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', lineHeight: 1.5 }}>
                  {mode.desc}
                </p>
                {mode.id === 'daily' && (
                  <div style={{ marginTop: '16px', padding: '8px 16px', background: 'rgba(255,215,0,0.08)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--clr-gold)' }}>
                    {dailyChallenge.completedBy.toLocaleString()} players completed today
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Daily Challenge Preview */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(255,215,0,0.05), rgba(124,58,255,0.05))',
          borderColor: 'rgba(255,215,0,0.2)',
          animation: 'fadeIn 0.8s ease 0.4s both',
        }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3" style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>📅</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--clr-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    Daily Challenge · {dailyChallenge.date}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 600 }}>Today's Mystery Language</div>
                </div>
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.1rem',
                color: 'var(--clr-accent)',
                padding: '12px 16px',
                background: 'rgba(0,229,255,0.05)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(0,229,255,0.1)',
                letterSpacing: '0.03em',
              }}>
                "{dailyChallenge.question.translatedContent}"
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '32px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginBottom: '8px' }}>
                {dailyChallenge.completedBy.toLocaleString()} completed · avg {dailyChallenge.avgScore}pts
              </div>
              <button
                id="btn-daily-challenge"
                className="btn btn-gold"
                onClick={() => onNavigate('game')}
              >
                🎯 Take Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
