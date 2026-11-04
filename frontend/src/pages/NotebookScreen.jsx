import { useState } from 'react';
import { VocabRow, StarBackground } from '../components/UI';

export function NotebookScreen({ vocabulary, languages, onNavigate }) {
  const [filterLang, setFilterLang] = useState('all');
  const [filterPOS, setFilterPOS] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const dueToday = vocabulary.filter(w => new Date(w.nextReview) <= new Date());

  const filtered = vocabulary
    .filter(w => filterLang === 'all' || w.languageId === filterLang)
    .filter(w => filterPOS === 'all' || w.pos === filterPOS)
    .filter(w => !search || w.word.includes(search) || w.meaning.includes(search))
    .sort((a, b) => {
      if (sortBy === 'memory') return a.memoryScore - b.memoryScore;
      if (sortBy === 'alpha') return a.word.localeCompare(b.word);
      return b.id.localeCompare(a.id);
    });

  const posTypes = ['all', ...new Set(vocabulary.map(w => w.pos))];
  const langOptions = [{ id: 'all', name: 'All Languages', flag: '🌐' }, ...languages.filter(l => l.unlocked)];

  return (
    <div className="screen" style={{ padding: '100px 0 60px' }}>
      <StarBackground />
      <div className="bg-animated" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', animation: 'fadeIn 0.5s ease' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
            <h1>Language Notebook</h1>
            {dueToday.length > 0 && (
              <div className="badge badge-primary" style={{ padding: '6px 16px', fontSize: '0.85rem', animation: 'pulse 2s ease-in-out infinite' }}>
                📚 {dueToday.length} words due for review
              </div>
            )}
          </div>
          <p style={{ color: 'var(--clr-text-muted)' }}>
            {vocabulary.length} words discovered across {languages.filter(l => l.unlocked).length} languages
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px', animation: 'fadeIn 0.5s ease 0.1s both' }}>
          {[
            { label: 'Total Words', value: vocabulary.length, icon: '📚', color: 'var(--clr-primary-light)' },
            { label: 'Mastered (≥80%)', value: vocabulary.filter(w => w.memoryScore >= 0.8).length, icon: '⭐', color: 'var(--clr-gold)' },
            { label: 'Learning', value: vocabulary.filter(w => w.memoryScore >= 0.4 && w.memoryScore < 0.8).length, icon: '🔄', color: 'var(--clr-accent)' },
            { label: 'Need Review', value: dueToday.length, icon: '⏰', color: 'var(--clr-danger)' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Due Today Banner */}
        {dueToday.length > 0 && (
          <div className="card" style={{
            marginBottom: '24px',
            background: 'rgba(124,58,255,0.05)',
            borderColor: 'rgba(124,58,255,0.3)',
            animation: 'fadeIn 0.5s ease 0.2s both',
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>⏰ Spaced Repetition Review</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>
                  {dueToday.length} vocabulary words are scheduled for review today
                </p>
              </div>
              <button
                id="btn-start-review"
                className="btn btn-primary"
                onClick={() => onNavigate('game')}
              >
                Start Review
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card-glass" style={{ marginBottom: '24px', padding: '20px 24px', animation: 'fadeIn 0.5s ease 0.3s both' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <input
              id="notebook-search"
              className="input"
              placeholder="🔍 Search words..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: '220px' }}
            />

            {/* Language Filter */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {langOptions.map(l => (
                <button
                  key={l.id}
                  id={`filter-lang-${l.id}`}
                  onClick={() => setFilterLang(l.id)}
                  style={{
                    padding: '5px 12px',
                    border: `1px solid ${filterLang === l.id ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                    borderRadius: 'var(--radius-full)',
                    background: filterLang === l.id ? 'rgba(124,58,255,0.15)' : 'transparent',
                    color: filterLang === l.id ? 'var(--clr-primary-light)' : 'var(--clr-text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {l.flag} {l.name}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              id="notebook-sort"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--clr-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--clr-text-secondary)',
                padding: '6px 12px',
                fontSize: '0.8rem',
                marginLeft: 'auto',
                cursor: 'pointer',
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="memory">Needs Review</option>
              <option value="alpha">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Word List */}
        <div style={{ animation: 'fadeIn 0.5s ease 0.4s both' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px', color: 'var(--clr-text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
              <p>No words found. Play more games to discover vocabulary!</p>
            </div>
          ) : (
            filtered.map(word => <VocabRow key={word.id} word={word} />)
          )}
        </div>

        {/* Language Coverage */}
        <div className="card" style={{ marginTop: '32px', animation: 'fadeIn 0.5s ease 0.5s both' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Language Coverage</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {languages.filter(l => l.unlocked && l.wordsDiscovered > 0).map(lang => {
              const langWords = vocabulary.filter(w => w.languageId === lang.id);
              const avgMemory = langWords.length ? Math.round(langWords.reduce((s, w) => s + w.memoryScore, 0) / langWords.length * 100) : 0;
              return (
                <div key={lang.id}>
                  <div className="flex justify-between" style={{ marginBottom: '6px', fontSize: '0.85rem' }}>
                    <span>{lang.flag} {lang.name}</span>
                    <span style={{ color: 'var(--clr-text-muted)' }}>{langWords.length} words · {avgMemory}% avg memory</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${avgMemory}%`, background: `linear-gradient(90deg, ${lang.color}88, ${lang.color})` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
