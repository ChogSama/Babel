import { useState, useCallback } from 'react';
import { StarBackground } from '../components/UI';

// SR interval steps in days (correct streak index)
const SR_INTERVALS = [1, 3, 7, 14, 30];

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Build 4 answer choices for a word (1 correct + 3 distractors from vocab pool)
function buildChoices(word, allWords) {
  const distractors = shuffleArray(
    allWords.filter(w => w.id !== word.id)
  ).slice(0, 3).map(w => w.meaning);

  const choices = shuffleArray([word.meaning, ...distractors]);
  return choices;
}

export function SpacedRepetitionScreen({ vocabulary, onComplete, onNavigate }) {
  const dueWords = vocabulary.filter(w => new Date(w.nextReview) <= new Date());

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState([]); // { word, correct, chosen }
  const [phase, setPhase] = useState('quiz'); // 'quiz' | 'done'
  const [updatedVocab, setUpdatedVocab] = useState(vocabulary);

  // Pre-build shuffled choices for each due word (stable per session)
  const [sessionCards] = useState(() =>
    dueWords.map(word => ({
      word,
      choices: buildChoices(word, vocabulary),
    }))
  );

  const currentCard = sessionCards[index];
  const totalCards = sessionCards.length;
  const correctCount = results.filter(r => r.correct).length;
  const xpEarned = correctCount * 50;

  const handleChoice = useCallback((choice) => {
    if (answered) return;
    const isCorrect = choice === currentCard.word.meaning;
    setSelected(choice);
    setAnswered(true);

    // Update memory score + nextReview using SR algorithm
    setUpdatedVocab(prev => prev.map(w => {
      if (w.id !== currentCard.word.id) return w;
      const newMemory = isCorrect
        ? Math.min(w.memoryScore + 0.15, 1.0)
        : Math.max(w.memoryScore - 0.2, 0.0);
      // Pick SR interval based on memory score band
      const band = newMemory >= 0.8 ? 4 : newMemory >= 0.6 ? 3 : newMemory >= 0.4 ? 2 : newMemory >= 0.2 ? 1 : 0;
      const intervalDays = isCorrect ? SR_INTERVALS[band] : 1;
      return {
        ...w,
        memoryScore: Math.round(newMemory * 100) / 100,
        encounters: w.encounters + 1,
        nextReview: addDays(intervalDays),
      };
    }));

    setResults(prev => [...prev, { word: currentCard.word, correct: isCorrect, chosen: choice }]);

    setTimeout(() => {
      if (index + 1 < totalCards) {
        setIndex(i => i + 1);
        setSelected(null);
        setAnswered(false);
      } else {
        setPhase('done');
      }
    }, 1500);
  }, [answered, currentCard, index, totalCards]);

  if (dueWords.length === 0) {
    return (
      <div className="screen" style={{ padding: '100px 0 60px', position: 'relative' }}>
        <StarBackground />
        <div className="bg-animated" />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '600px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🎉</div>
          <h1 style={{ marginBottom: '12px' }}>All Caught Up!</h1>
          <p style={{ color: 'var(--clr-text-muted)', marginBottom: '32px' }}>
            No vocabulary words are due for review right now. Keep playing to discover more words!
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('notebook')}>
            ← Back to Notebook
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    const accuracy = Math.round((correctCount / totalCards) * 100);
    const grade = accuracy >= 80 ? 'S' : accuracy >= 60 ? 'A' : accuracy >= 40 ? 'B' : 'C';
    const gradeColors = { S: 'var(--clr-gold)', A: 'var(--clr-success)', B: 'var(--clr-accent)', C: 'var(--clr-warning)' };

    return (
      <div className="screen" style={{ padding: '100px 0 60px', position: 'relative' }}>
        <StarBackground />
        <div className="bg-animated" />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '640px' }}>
          {/* Grade */}
          <div style={{ textAlign: 'center', marginBottom: '32px', animation: 'fadeInScale 0.5s ease' }}>
            <div style={{
              width: 110, height: 110, borderRadius: '50%',
              background: `radial-gradient(circle, ${gradeColors[grade]}22, transparent)`,
              border: `3px solid ${gradeColors[grade]}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: `0 0 40px ${gradeColors[grade]}44`,
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, color: gradeColors[grade] }}>
                {grade}
              </span>
            </div>
            <h2 style={{ marginBottom: '8px' }}>Review Complete!</h2>
            <p style={{ color: 'var(--clr-text-muted)' }}>
              You reviewed {totalCards} vocabulary {totalCards === 1 ? 'word' : 'words'}
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px', animation: 'fadeIn 0.5s ease 0.1s both' }}>
            {[
              { icon: '🎯', label: 'Accuracy', value: `${accuracy}%` },
              { icon: '✅', label: 'Correct', value: `${correctCount}/${totalCards}` },
              { icon: '⭐', label: 'XP Earned', value: `+${xpEarned}` },
            ].map((s, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--clr-gold)' }}>{s.value}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Word-by-word results */}
          <div className="card" style={{ marginBottom: '24px', animation: 'fadeIn 0.5s ease 0.2s both' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '16px' }}>Word Results</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {results.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  background: r.correct ? 'rgba(16,217,120,0.05)' : 'rgba(255,77,109,0.05)',
                  border: `1px solid ${r.correct ? 'rgba(16,217,120,0.2)' : 'rgba(255,77,109,0.2)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{r.word.flag}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--clr-accent)' }}>{r.word.word}</span>
                    <span style={{ color: 'var(--clr-text-muted)', fontSize: '0.85rem' }}>→ {r.word.meaning}</span>
                  </div>
                  <span style={{ fontSize: '1.1rem' }}>{r.correct ? '✅' : '❌'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', animation: 'fadeIn 0.5s ease 0.3s both' }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => onComplete({ xpEarned, correct: correctCount, total: totalCards, updatedVocab })}
            >
              ✅ Save Progress
            </button>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => onNavigate('notebook')}>
              📓 Back to Notebook
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === QUIZ PHASE ===
  const progress = ((index) / totalCards) * 100;

  return (
    <div className="screen" style={{ padding: '100px 0 60px', position: 'relative' }}>
      <StarBackground />
      <div className="bg-animated" />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '680px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', animation: 'fadeIn 0.4s ease' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              ⏰ Spaced Repetition Review
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {sessionCards.map((_, i) => (
                <div key={i} style={{
                  height: 4, width: 32, borderRadius: 'var(--radius-full)',
                  background: i < index ? 'var(--clr-success)' : i === index ? 'var(--clr-primary)' : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.3s ease',
                }} />
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--clr-gold)' }}>
              {index + 1} / {totalCards}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>words</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar" style={{ marginBottom: '32px', height: '4px' }}>
          <div className="progress-fill progress-fill-gold" style={{ width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>

        {/* Flashcard */}
        <div className="card" style={{
          marginBottom: '28px',
          padding: '40px 32px',
          textAlign: 'center',
          background: 'rgba(22,24,48,0.9)',
          borderColor: 'rgba(124,58,255,0.3)',
          boxShadow: '0 0 40px rgba(124,58,255,0.08)',
          animation: 'fadeInScale 0.4s ease',
        }}>
          <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>{currentCard.word.flag}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
            {currentCard.word.languageName} · {currentCard.word.pos}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            fontWeight: 700,
            color: 'var(--clr-accent)',
            letterSpacing: '0.03em',
            marginBottom: '8px',
          }}>
            {currentCard.word.word}
          </div>
          {currentCard.word.lemma !== currentCard.word.word && (
            <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>
              ↩ base form: <em>{currentCard.word.lemma}</em>
            </div>
          )}
          <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--clr-text-muted)', fontStyle: 'italic' }}>
            "{currentCard.word.example}"
          </div>
        </div>

        {/* Question prompt */}
        <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', textAlign: 'center' }}>
          What does this word mean?
        </div>

        {/* Answer choices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeIn 0.4s ease 0.1s both' }}>
          {currentCard.choices.map((choice, i) => {
            const isCorrect = choice === currentCard.word.meaning;
            const isSelected = choice === selected;
            let bg = 'rgba(255,255,255,0.03)';
            let border = 'var(--clr-border)';
            let color = 'var(--clr-text-primary)';

            if (answered) {
              if (isCorrect) { bg = 'rgba(16,217,120,0.12)'; border = 'var(--clr-success)'; color = 'var(--clr-success)'; }
              else if (isSelected) { bg = 'rgba(255,77,109,0.12)'; border = 'var(--clr-danger)'; color = 'var(--clr-danger)'; }
            }

            return (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                disabled={answered}
                style={{
                  width: '100%', padding: '14px 20px',
                  display: 'flex', alignItems: 'center', gap: '14px',
                  background: bg, border: `1px solid ${border}`,
                  borderRadius: 'var(--radius-md)', cursor: answered ? 'default' : 'pointer',
                  transition: 'all 0.2s ease', textAlign: 'left',
                  color,
                }}
                onMouseEnter={e => { if (!answered) e.currentTarget.style.borderColor = 'var(--clr-primary)'; }}
                onMouseLeave={e => { if (!answered) e.currentTarget.style.borderColor = 'var(--clr-border)'; }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(124,58,255,0.12)', border: `1px solid ${border}`,
                  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', color,
                }}>
                  {answered && isCorrect ? '✓' : answered && isSelected ? '✗' : ['A','B','C','D'][i]}
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: answered && isCorrect ? 600 : 400 }}>{choice}</span>
              </button>
            );
          })}
        </div>

        {/* Back button */}
        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('notebook')}>
            ← Exit Review
          </button>
        </div>
      </div>
    </div>
  );
}
