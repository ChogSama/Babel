import { useState } from 'react';
import { StarBackground } from '../components/UI';

const MODES = [
  {
    id: 'expedition',
    icon: '🗺️',
    title: 'Language Expedition',
    subtitle: 'Structured Journey',
    desc: 'Journey through one language with 5–10 progressively harder questions. Build vocabulary and comprehension stage by stage.',
    stages: ['Discovery', 'Recognition', 'Comprehension', 'Independence', 'Mastery'],
    color: 'var(--clr-primary)',
    glow: 'var(--clr-primary-glow)',
    badge: 'Recommended',
    badgeColor: 'var(--clr-primary)',
    navigateTo: 'language-select',
  },
  {
    id: 'random',
    icon: '🎲',
    title: 'Random Challenge',
    subtitle: 'Wild Card Mode',
    desc: 'Surprise questions drawn from all unlocked languages. Test your adaptability across Finnish, Spanish, French, and more.',
    stages: null,
    color: 'var(--clr-accent)',
    glow: 'var(--clr-accent-glow)',
    badge: 'Unlocked',
    badgeColor: 'var(--clr-accent)',
    navigateTo: 'game',
  },
  {
    id: 'daily',
    icon: '📅',
    title: 'Daily Challenge',
    subtitle: 'One Per Day',
    desc: 'A single curated question shared by all players today. Come back every day to maintain your streak and earn bonus XP.',
    stages: null,
    color: 'var(--clr-gold)',
    glow: 'var(--clr-gold-glow)',
    badge: 'New Today',
    badgeColor: 'var(--clr-gold)',
    navigateTo: 'game',
  },
];

export function GameModeScreen({ onNavigate, dailyChallenge }) {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleSelect = (mode) => {
    setSelected(mode.id);
    setTimeout(() => onNavigate(mode.navigateTo), 180);
  };

  return (
    <div className="screen" style={{ padding: '100px 0 60px', position: 'relative' }}>
      <StarBackground />
      <div className="bg-animated" />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px', animation: 'fadeIn 0.5s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 18px',
            background: 'rgba(124,58,255,0.08)',
            border: '1px solid rgba(124,58,255,0.2)',
            borderRadius: 'var(--radius-full)',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--clr-primary-light)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ⚔️ Choose Your Mode
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 900,
            letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, #fff 0%, var(--clr-primary-light) 60%, var(--clr-accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '12px',
          }}>
            Select Challenge Mode
          </h1>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
            Each mode offers a different way to decode, discover, and conquer foreign languages.
          </p>
        </div>

        {/* Mode Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '48px',
          animation: 'fadeIn 0.6s ease 0.1s both',
        }}>
          {MODES.map((mode) => {
            const isHovered = hovered === mode.id;
            const isSelected = selected === mode.id;
            return (
              <div
                key={mode.id}
                id={`mode-card-${mode.id}`}
                className="card"
                onClick={() => handleSelect(mode)}
                onMouseEnter={() => setHovered(mode.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  cursor: 'pointer',
                  padding: '32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderColor: isHovered || isSelected ? mode.color : 'var(--clr-border)',
                  boxShadow: isHovered || isSelected ? `0 0 32px ${mode.glow}` : 'none',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  transition: 'all 0.25s ease',
                  background: isHovered
                    ? `radial-gradient(ellipse at 50% 0%, ${mode.color}0d, transparent 70%), rgba(16,18,38,0.95)`
                    : 'rgba(16,18,38,0.95)',
                }}
              >
                {/* Badge */}
                <div style={{
                  alignSelf: 'flex-end',
                  fontSize: '0.65rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: mode.badgeColor,
                  background: `${mode.badgeColor}18`,
                  border: `1px solid ${mode.badgeColor}40`,
                  borderRadius: 'var(--radius-full)',
                  padding: '3px 10px',
                  marginBottom: '16px',
                }}>
                  {mode.badge}
                </div>

                {/* Icon */}
                <div style={{
                  fontSize: '3.2rem',
                  marginBottom: '16px',
                  animation: isHovered ? 'float 2s ease-in-out infinite' : 'none',
                }}>
                  {mode.icon}
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.1rem', fontWeight: 700,
                  color: isHovered ? mode.color : 'var(--clr-text-primary)',
                  marginBottom: '4px',
                  transition: 'color 0.2s',
                }}>
                  {mode.title}
                </h3>
                <div style={{
                  fontSize: '0.72rem', color: mode.color,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  fontWeight: 600, marginBottom: '12px',
                }}>
                  {mode.subtitle}
                </div>

                {/* Description */}
                <p style={{
                  fontSize: '0.83rem', color: 'var(--clr-text-muted)',
                  lineHeight: 1.6, marginBottom: '16px', flexGrow: 1,
                }}>
                  {mode.desc}
                </p>

                {/* Stages (Expedition only) */}
                {mode.stages && (
                  <div style={{ width: '100%', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      Expedition Stages
                    </div>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      {mode.stages.map((stage, i) => (
                        <span key={i} style={{
                          fontSize: '0.65rem', padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: `${mode.color}18`,
                          border: `1px solid ${mode.color}30`,
                          color: mode.color,
                        }}>
                          {stage}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Daily stats */}
                {mode.id === 'daily' && dailyChallenge && (
                  <div style={{
                    width: '100%', fontSize: '0.75rem',
                    color: 'var(--clr-gold)',
                    background: 'rgba(255,215,0,0.06)',
                    border: '1px solid rgba(255,215,0,0.15)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px',
                    marginBottom: '12px',
                  }}>
                    🏆 {dailyChallenge.completedBy.toLocaleString()} players completed · avg {dailyChallenge.avgScore}pts
                  </div>
                )}

                {/* CTA */}
                <button
                  id={`btn-select-${mode.id}`}
                  className="btn btn-sm"
                  style={{
                    width: '100%',
                    background: isHovered ? mode.color : 'transparent',
                    border: `1px solid ${mode.color}`,
                    color: isHovered ? '#fff' : mode.color,
                    transition: 'all 0.2s ease',
                    marginTop: 'auto',
                  }}
                  onClick={(e) => { e.stopPropagation(); handleSelect(mode); }}
                >
                  {mode.id === 'expedition' ? '🗺️ Select Language →' : mode.id === 'random' ? '🎲 Start Random →' : '📅 Take Challenge →'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Back button */}
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.6s ease 0.3s both' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('home')}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
