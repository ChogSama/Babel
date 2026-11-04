import { useState, useEffect, useRef } from 'react';

// ── Star Background ──────────────────────────────────────────────
export function StarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }));

    let animId;
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(s => {
        const alpha = 0.3 + 0.5 * Math.abs(Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 255, ${alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}

// ── Navbar ───────────────────────────────────────────────────────
export function Navbar({ currentScreen, onNavigate, player }) {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'game-mode', icon: '⚔️', label: 'Play' },
    { id: 'notebook', icon: '📓', label: 'Notebook' },
    { id: 'dashboard', icon: '📊', label: 'Progress' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo" style={{ cursor: 'pointer' }} onClick={() => onNavigate('home')}>
        BABEL
      </div>
      <div className="navbar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.4rem' }}>{player?.avatar || '👤'}</span>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-text-primary)' }}>{player?.username}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--clr-gold)' }}>Lv.{player?.level} {player?.rank}</div>
          </div>
        </div>
        <div className="flex items-center gap-2" style={{ padding: '4px 12px', background: 'rgba(255,215,0,0.1)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,215,0,0.2)' }}>
          <span style={{ fontSize: '0.9rem' }}>🔥</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--clr-gold)' }}>{player?.streak}</span>
        </div>
      </div>
    </nav>
  );
}

// ── Score Badge ──────────────────────────────────────────────────
export function ScoreBadge({ score }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 16px',
      background: 'rgba(255,215,0,0.12)',
      border: '1px solid rgba(255,215,0,0.25)',
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-mono)',
      fontSize: '1rem',
      fontWeight: 700,
      color: 'var(--clr-gold)',
    }}>
      ⭐ {score.toLocaleString()}
    </div>
  );
}

// ── Progress Circle ──────────────────────────────────────────────
export function ProgressCircle({ value, max, label, color = 'var(--clr-primary)', size = 80 }) {
  const pct = Math.min(value / max, 1);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
          <circle
            cx={size/2} cy={size/2} r={r}
            fill="none" stroke={color} strokeWidth={8}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size < 70 ? '0.75rem' : '0.9rem', fontWeight: 700, color: 'var(--clr-text-primary)',
        }}>
          {Math.round(pct * 100)}%
        </div>
      </div>
      {label && <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', textAlign: 'center' }}>{label}</div>}
    </div>
  );
}

// ── Language Card ────────────────────────────────────────────────
export function LanguageCard({ language, onClick, compact = false }) {
  const pct = language.unlocked
    ? Math.round((language.proficiency.vocabulary + language.proficiency.grammar + language.proficiency.comprehension) / 3)
    : 0;

  return (
    <div
      id={`lang-card-${language.id}`}
      className="card card-glow"
      onClick={() => language.unlocked && onClick && onClick(language)}
      style={{
        cursor: language.unlocked ? 'pointer' : 'default',
        opacity: language.unlocked ? 1 : 0.5,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        borderColor: language.unlocked ? language.color : 'var(--clr-border)',
      }}
    >
      {/* Glow top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, transparent, ${language.color}, transparent)`,
        opacity: language.unlocked ? 0.8 : 0.3,
      }} />

      {!language.unlocked && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          fontSize: '1.2rem', opacity: 0.6,
        }}>🔒</div>
      )}

      <div className="flex items-center gap-4" style={{ marginBottom: compact ? 0 : '16px' }}>
        <div style={{ fontSize: compact ? '2rem' : '2.8rem', lineHeight: 1 }}>{language.flag}</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: compact ? '1rem' : '1.2rem' }}>
            {language.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
            {language.nativeName} · {language.family}
          </div>
        </div>
        {language.unlocked && (
          <div style={{ marginLeft: 'auto' }}>
            <div style={{
              padding: '2px 10px',
              background: `${language.color}22`,
              border: `1px solid ${language.color}44`,
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: language.color,
            }}>Lv.{language.expeditionLevel}</div>
          </div>
        )}
      </div>

      {!compact && language.unlocked && (
        <>
          <div className="progress-bar" style={{ marginBottom: '8px' }}>
            <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${language.color}88, ${language.color})` }} />
          </div>
          <div className="flex justify-between" style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>
            <span>📚 {language.wordsDiscovered} words</span>
            <span>✅ {language.questionsCompleted} questions</span>
            <span style={{ color: language.color }}>{pct}% mastery</span>
          </div>
        </>
      )}
    </div>
  );
}

// ── Power-up Button ──────────────────────────────────────────────
export function PowerUpButton({ powerup, onClick, used, disabled }) {
  return (
    <button
      id={`powerup-${powerup.id}`}
      className={`powerup-btn ${powerup.color}`}
      onClick={() => !disabled && !used && onClick && onClick(powerup)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '10px 8px',
        background: used
          ? 'rgba(255,255,255,0.03)'
          : `rgba(var(--pu-rgb, 124,58,255), 0.08)`,
        border: `1px solid ${used ? 'rgba(255,255,255,0.08)' : 'var(--pu-color)'}`,
        borderRadius: 'var(--radius-md)',
        cursor: disabled || used ? 'not-allowed' : 'pointer',
        opacity: used ? 0.4 : disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        minWidth: '72px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <span style={{ fontSize: '1.4rem' }}>{used ? '✓' : powerup.icon}</span>
      <span style={{
        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.03em',
        color: used ? 'var(--clr-text-muted)' : 'var(--clr-text-secondary)',
        textTransform: 'uppercase',
      }}>
        {powerup.name}
      </span>
      <span style={{
        fontSize: '0.6rem', color: used ? 'var(--clr-text-muted)' : 'var(--clr-text-muted)',
        fontFamily: 'var(--font-mono)',
      }}>
        {used ? 'used' : `-${powerup.scoreImpact * -1}`}
      </span>
    </button>
  );
}

// ── Timer Circle ─────────────────────────────────────────────────
export function TimerCircle({ timeLeft, totalTime }) {
  const pct = timeLeft / totalTime;
  const color = pct > 0.5 ? 'var(--clr-success)' : pct > 0.25 ? 'var(--clr-warning)' : 'var(--clr-danger)';
  const size = 72;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'all 1s linear' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontWeight: 700,
        fontSize: '1.1rem', color,
      }}>
        {timeLeft}
      </div>
    </div>
  );
}

// ── Answer Button ────────────────────────────────────────────────
export function AnswerButton({ answer, onClick, state, index }) {
  const letters = ['A', 'B', 'C', 'D'];
  const stateStyles = {
    correct: { background: 'rgba(16,217,120,0.15)', borderColor: 'var(--clr-success)', color: 'var(--clr-success)' },
    wrong:   { background: 'rgba(255,77,109,0.15)',  borderColor: 'var(--clr-danger)',   color: 'var(--clr-danger)' },
    default: { background: 'rgba(255,255,255,0.03)', borderColor: 'var(--clr-border)',   color: 'var(--clr-text-primary)' },
  };
  const s = stateStyles[state] || stateStyles.default;

  return (
    <button
      id={`answer-${answer.id}`}
      onClick={() => onClick && onClick(answer)}
      style={{
        width: '100%',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: s.background,
        border: `1px solid ${s.borderColor}`,
        borderRadius: 'var(--radius-md)',
        cursor: state ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
      }}
      onMouseEnter={e => { if (!state) e.currentTarget.style.borderColor = 'var(--clr-primary)'; }}
      onMouseLeave={e => { if (!state) e.currentTarget.style.borderColor = 'var(--clr-border)'; }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: state ? 'transparent' : 'rgba(124,58,255,0.15)',
        border: `1px solid ${s.borderColor}`,
        fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem',
        color: s.color, flexShrink: 0,
      }}>
        {state === 'correct' ? '✓' : state === 'wrong' ? '✗' : letters[index]}
      </div>
      <span style={{ fontSize: '1rem', color: s.color, fontWeight: state ? 600 : 400 }}>
        {answer.content}
      </span>
    </button>
  );
}

// ── Toast ────────────────────────────────────────────────────────
export function Toast({ message, type = 'info', onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = { success: '✅', error: '❌', info: '💬' };

  return (
    <div className={`toast toast-${type}`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}

// ── Vocabulary Row ───────────────────────────────────────────────
export function VocabRow({ word }) {
  const dueToday = new Date(word.nextReview) <= new Date();
  const memPct = Math.round(word.memoryScore * 100);
  const memColor = memPct >= 70 ? 'var(--clr-success)' : memPct >= 40 ? 'var(--clr-warning)' : 'var(--clr-danger)';

  return (
    <div className="card" style={{ padding: '12px 20px', marginBottom: '8px' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span style={{ fontSize: '1.4rem' }}>{word.flag}</span>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '1rem', color: 'var(--clr-accent)' }}>
              {word.word}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>
              {word.lemma !== word.word && `↩ ${word.lemma} · `}{word.pos}
            </div>
          </div>
          <div style={{ color: 'var(--clr-text-secondary)', fontSize: '0.9rem' }}>→ <em>{word.meaning}</em></div>
        </div>
        <div className="flex items-center gap-6">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Memory</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: memColor }}>{memPct}%</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Seen</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700 }}>{word.encounters}×</div>
          </div>
          {dueToday && (
            <div className="badge badge-primary" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
              Review Due
            </div>
          )}
        </div>
      </div>
      {word.example && (
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--clr-border)', fontSize: '0.8rem', color: 'var(--clr-text-muted)', fontStyle: 'italic' }}>
          "{word.example}"
        </div>
      )}
    </div>
  );
}
