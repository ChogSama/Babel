import { useState } from 'react';
import { StarBackground, ProgressCircle, LanguageCard } from '../components/UI';
import { achievements, gameHistory } from '../data/mockData';

const AVATAR_OPTIONS = ['🗺️', '🧙‍♂️', '🦉', '🦊', '🧭', '📜', '👑', '🚀', '🌟', '💎'];

export function DashboardScreen({ player, languages, onNavigate, onUpdatePlayer }) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(player.username);
  const [avatar, setAvatar] = useState(player.avatar);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (onUpdatePlayer) {
      onUpdatePlayer({ username: username.trim() || player.username, avatar });
    }
    setIsEditing(false);
  };

  const rarityColors = {
    Common: 'var(--clr-text-muted)',
    Uncommon: 'var(--clr-success)',
    Rare: 'var(--clr-accent)',
    Epic: 'var(--clr-primary-light)',
    Legendary: 'var(--clr-gold)',
  };

  return (
    <div className="screen" style={{ padding: '100px 0 60px' }}>
      <StarBackground />
      <div className="bg-animated" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', animation: 'fadeIn 0.5s ease' }}>
          <h1>Progress Dashboard</h1>
          <p style={{ color: 'var(--clr-text-muted)' }}>Your language deciphering journey at a glance</p>
        </div>

        {/* Player Profile Card */}
        <div className="card" style={{
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(124,58,255,0.08), rgba(0,229,255,0.04))',
          borderColor: 'rgba(124,58,255,0.3)',
          animation: 'fadeIn 0.5s ease 0.1s both',
        }}>
          <div className="flex items-center gap-6">
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--clr-primary), var(--clr-accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem',
              boxShadow: '0 0 24px var(--clr-primary-glow)',
            }}>
              {player.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h2 style={{ fontSize: '1.5rem' }}>{player.username}</h2>
                  <div className="badge badge-gold">{player.rank}</div>
                  <div className="badge badge-primary">Lv.{player.level}</div>
                </div>
                <button
                  id="btn-edit-profile"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setUsername(player.username);
                    setAvatar(player.avatar);
                    setIsEditing(true);
                  }}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  ✏️ Edit Profile
                </button>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>🔥 {player.streak}-day streak</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>⭐ {player.totalScore.toLocaleString()} total score</span>
              </div>
              <div>
                <div className="flex justify-between" style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginBottom: '4px' }}>
                  <span>XP Progress</span>
                  <span>{player.experience.toLocaleString()} / {player.experienceToNext.toLocaleString()}</span>
                </div>
                <div className="progress-bar" style={{ height: '8px' }}>
                  <div className="progress-fill progress-fill-gold" style={{ width: `${(player.experience / player.experienceToNext) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px', animation: 'fadeIn 0.5s ease 0.2s both' }}>
          {[
            { label: 'Questions', value: player.questionsCompleted, icon: '❓', color: 'var(--clr-primary-light)' },
            { label: 'Accuracy', value: `${player.accuracyRate}%`, icon: '🎯', color: 'var(--clr-success)' },
            { label: 'Languages', value: player.languagesExplored, icon: '🌐', color: 'var(--clr-accent)' },
            { label: 'Words', value: player.wordsDiscovered, icon: '📚', color: '#ff9f1c' },
            { label: 'Avg Decode', value: `${player.avgDecodeTime}s`, icon: '⚡', color: 'var(--clr-gold)' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '20px 12px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Language Proficiency Radar */}
          <div className="card" style={{ animation: 'fadeIn 0.5s ease 0.3s both' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '24px' }}>Language Proficiency</h3>
            {languages.filter(l => l.unlocked && l.wordsDiscovered > 0).map(lang => {
              const avg = Math.round((lang.proficiency.vocabulary + lang.proficiency.grammar + lang.proficiency.comprehension) / 3);
              return (
                <div key={lang.id} style={{ marginBottom: '20px' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                      {lang.flag} {lang.name}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ProgressCircle value={lang.proficiency.vocabulary} max={100} label="Vocab" color={lang.color} size={56} />
                      <ProgressCircle value={lang.proficiency.grammar} max={100} label="Grammar" color={lang.color} size={56} />
                      <ProgressCircle value={lang.proficiency.comprehension} max={100} label="Comprehension" color={lang.color} size={56} />
                    </div>
                  </div>
                  <div className="progress-bar" style={{ height: '4px' }}>
                    <div className="progress-fill" style={{ width: `${avg}%`, background: `linear-gradient(90deg, ${lang.color}88, ${lang.color})` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Game History */}
          <div className="card" style={{ animation: 'fadeIn 0.5s ease 0.3s both' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Recent Sessions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {gameHistory.map((session, i) => {
                const accuracy = Math.round((session.correct / session.total) * 100);
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--clr-border)',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{session.mode}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>{session.language} · {session.date}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--clr-gold)' }}>
                        {session.score.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: accuracy >= 80 ? 'var(--clr-success)' : accuracy >= 60 ? 'var(--clr-warning)' : 'var(--clr-danger)' }}>
                        {session.correct}/{session.total} · {accuracy}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card" style={{ marginBottom: '32px', animation: 'fadeIn 0.5s ease 0.4s both' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem' }}>Achievements</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
              {achievements.filter(a => a.earned).length}/{achievements.length} unlocked
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {achievements.map(ach => (
              <div key={ach.id} style={{
                padding: '16px 12px', borderRadius: 'var(--radius-md)', textAlign: 'center',
                background: ach.earned ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${ach.earned ? rarityColors[ach.rarity] + '40' : 'var(--clr-border)'}`,
                opacity: ach.earned ? 1 : 0.5,
                transition: 'all 0.2s ease',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '6px', filter: ach.earned ? 'none' : 'grayscale(1)' }}>{ach.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: ach.earned ? rarityColors[ach.rarity] : 'var(--clr-text-muted)', marginBottom: '2px' }}>
                  {ach.name}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--clr-text-muted)', lineHeight: 1.4 }}>{ach.description}</div>
                <div style={{ marginTop: '6px', fontSize: '0.6rem', color: rarityColors[ach.rarity], textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {ach.rarity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Collection */}
        <div style={{ animation: 'fadeIn 0.5s ease 0.5s both' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem' }}>Language Collection</h3>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigate('language-select')}>
              + Explore More
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {languages.map(lang => (
              <LanguageCard key={lang.id} language={lang} compact onClick={() => onNavigate('language-select')} />
            ))}
          </div>
        </div>

        {/* Profile Edit Modal */}
        {isEditing && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}>
            <div className="card-glass" style={{ width: '100%', maxWidth: '440px', padding: '32px', animation: 'fadeInScale 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Edit Profile</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--clr-text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="label" style={{ marginBottom: '8px', display: 'block' }}>Choose Avatar</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                    {AVATAR_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setAvatar(opt)}
                        style={{
                          fontSize: '1.8rem',
                          padding: '8px',
                          borderRadius: 'var(--radius-sm)',
                          border: avatar === opt ? '2px solid var(--clr-primary)' : '1px solid var(--clr-border)',
                          background: avatar === opt ? 'rgba(124,58,255,0.2)' : 'rgba(255,255,255,0.03)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="label" style={{ marginBottom: '8px', display: 'block' }}>Explorer Name</label>
                  <input
                    id="input-edit-username"
                    className="input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="submit" id="btn-save-profile" className="btn btn-primary" style={{ flex: 1 }}>
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setIsEditing(false)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
