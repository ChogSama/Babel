import { useState } from 'react';
import { StarBackground } from '../components/UI';
import { leaderboard } from '../data/leaderboardData';

const FILTERS = ['All Time', 'This Week', 'Today'];
const LANG_FILTERS = ['All Languages', 'Finnish 🇫🇮', 'Spanish 🇪🇸', 'French 🇫🇷', 'German 🇩🇪'];

const TIER_COLORS = {
  'Grandmaster': 'var(--clr-gold)',
  'Master':      '#c084fc',
  'Expert':      'var(--clr-accent)',
  'Advanced':    'var(--clr-success)',
  'Intermediate':'var(--clr-primary-light)',
  'Beginner':    'var(--clr-text-muted)',
};

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

export function LeaderboardScreen({ player, onNavigate }) {
  const [period, setPeriod] = useState('All Time');
  const [langFilter, setLangFilter] = useState('All Languages');
  const [hovered, setHovered] = useState(null);

  // Filter & rank entries
  const filtered = leaderboard
    .filter(e => langFilter === 'All Languages' || e.topLanguage === langFilter.split(' ')[0])
    .sort((a, b) => b.score - a.score)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  // Find current player's entry
  const myEntry = filtered.find(e => e.username === player.username);

  return (
    <div className="screen" style={{ padding: '100px 0 60px' }}>
      <StarBackground />
      <div className="bg-animated" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: '32px', animation: 'fadeIn 0.5s ease' }}>
          <h1>🏆 Global Leaderboard</h1>
          <p style={{ color: 'var(--clr-text-muted)' }}>
            The world's greatest language decipherers ranked by score
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap', animation: 'fadeIn 0.5s ease 0.1s both' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`btn btn-sm ${period === f ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setPeriod(f)}
                style={{ fontSize: '0.78rem' }}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {LANG_FILTERS.map(f => (
              <button
                key={f}
                className={`btn btn-sm ${langFilter === f ? 'btn-accent' : 'btn-ghost'}`}
                onClick={() => setLangFilter(f)}
                style={{ fontSize: '0.75rem' }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        {filtered.length >= 3 && (
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
            gap: '16px', marginBottom: '36px',
            animation: 'fadeIn 0.6s ease 0.15s both',
          }}>
            {/* 2nd Place */}
            <PodiumCard entry={filtered[1]} height={130} />
            {/* 1st Place */}
            <PodiumCard entry={filtered[0]} height={170} />
            {/* 3rd Place */}
            <PodiumCard entry={filtered[2]} height={100} />
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', animation: 'fadeIn 0.5s ease 0.2s both' }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '56px 1fr 100px 100px 80px',
            padding: '12px 20px',
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid var(--clr-border)',
            fontSize: '0.72rem', color: 'var(--clr-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700,
          }}>
            <span>#</span>
            <span>Player</span>
            <span style={{ textAlign: 'right' }}>Score</span>
            <span style={{ textAlign: 'right' }}>Accuracy</span>
            <span style={{ textAlign: 'right' }}>Streak</span>
          </div>

          {filtered.slice(0, 20).map(entry => {
            const isMe = entry.username === player.username;
            const isHovered = hovered === entry.rank;
            return (
              <div
                key={entry.username}
                onMouseEnter={() => setHovered(entry.rank)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'grid', gridTemplateColumns: '56px 1fr 100px 100px 80px',
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--clr-border)',
                  alignItems: 'center',
                  background: isMe
                    ? 'linear-gradient(90deg, rgba(124,58,255,0.12), rgba(0,229,255,0.04))'
                    : isHovered
                      ? 'rgba(255,255,255,0.03)'
                      : 'transparent',
                  transition: 'background 0.2s',
                  cursor: 'default',
                  outline: isMe ? '1px solid rgba(124,58,255,0.3)' : 'none',
                }}
              >
                {/* Rank */}
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: MEDAL[entry.rank] ? 'transparent' : 'var(--clr-text-muted)' }}>
                  {MEDAL[entry.rank] || entry.rank}
                </div>

                {/* Player Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--clr-primary), var(--clr-accent))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem',
                    boxShadow: isMe ? '0 0 12px var(--clr-primary-glow)' : 'none',
                    flexShrink: 0,
                  }}>
                    {entry.avatar}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: isMe ? 'var(--clr-primary-light)' : 'var(--clr-text-primary)' }}>
                        {entry.username}
                        {isMe && <span style={{ fontSize: '0.7rem', color: 'var(--clr-accent)', marginLeft: 6 }}>YOU</span>}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 700,
                        color: TIER_COLORS[entry.tier] || 'var(--clr-text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>
                        {entry.tier}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)' }}>• {entry.topLanguage}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)' }}>• Lv.{entry.level}</span>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--clr-gold)', fontSize: '0.95rem' }}>
                  {entry.score.toLocaleString()}
                </div>

                {/* Accuracy */}
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: entry.accuracy >= 80 ? 'var(--clr-success)' : entry.accuracy >= 60 ? 'var(--clr-accent)' : 'var(--clr-warning)' }}>
                    {entry.accuracy}%
                  </span>
                </div>

                {/* Streak */}
                <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                  🔥 {entry.streak}d
                </div>
              </div>
            );
          })}
        </div>

        {/* My rank callout (if not in top 20) */}
        {myEntry && myEntry.rank > 20 && (
          <div className="card" style={{
            marginTop: '16px',
            background: 'linear-gradient(90deg, rgba(124,58,255,0.12), rgba(0,229,255,0.04))',
            borderColor: 'rgba(124,58,255,0.3)',
            display: 'grid', gridTemplateColumns: '56px 1fr 100px 100px 80px',
            padding: '14px 20px', alignItems: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: 'var(--clr-text-muted)' }}>{myEntry.rank}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--clr-primary), var(--clr-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 0 12px var(--clr-primary-glow)', flexShrink: 0 }}>
                {player.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--clr-primary-light)' }}>
                  {player.username} <span style={{ fontSize: '0.7rem', color: 'var(--clr-accent)' }}>YOU</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)' }}>Lv.{player.level}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--clr-gold)' }}>{player.totalScore.toLocaleString()}</div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--clr-success)' }}>{player.accuracyRate}%</div>
            <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>🔥 {player.streak}d</div>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '36px', animation: 'fadeIn 0.5s ease 0.4s both' }}>
          <p style={{ color: 'var(--clr-text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>
            Climb the ranks — play more expeditions to earn score
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('game-mode')}>⚔️ Play Now</button>
            <button className="btn btn-outline" onClick={() => onNavigate('dashboard')}>📊 My Progress</button>
          </div>
        </div>

      </div>
    </div>
  );
}

function PodiumCard({ entry, height }) {
  const medalColors = { 1: 'var(--clr-gold)', 2: '#94a3b8', 3: '#cd7c3a' };
  const color = medalColors[entry.rank];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: 170 }}>
      {/* Avatar + name */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div style={{
          width: entry.rank === 1 ? 64 : 50,
          height: entry.rank === 1 ? 64 : 50,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--clr-primary), var(--clr-accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: entry.rank === 1 ? '2rem' : '1.5rem',
          margin: '0 auto 6px',
          boxShadow: `0 0 20px ${color}66`,
          border: `2px solid ${color}`,
        }}>
          {entry.avatar}
        </div>
        {entry.rank === 1 && <div style={{ fontSize: '1.4rem' }}>👑</div>}
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clr-text-primary)', marginTop: 2 }}>{entry.username}</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)' }}>{entry.topLanguage}</div>
      </div>
      {/* Podium block */}
      <div style={{
        width: '100%', height: `${height}px`,
        background: `linear-gradient(180deg, ${color}22, ${color}08)`,
        border: `1px solid ${color}44`,
        borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '4px',
      }}>
        <div style={{ fontSize: entry.rank === 1 ? '1.6rem' : '1.3rem' }}>{MEDAL[entry.rank]}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color, fontSize: entry.rank === 1 ? '1rem' : '0.85rem' }}>
          {entry.score.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)' }}>{entry.accuracy}% acc</div>
      </div>
    </div>
  );
}
