import { useState, useEffect, useCallback } from 'react';
import { TimerCircle, PowerUpButton, AnswerButton, Toast } from '../components/UI';
import { powerUpInfo } from '../data/mockData';

export function GameScreen({ question, language, onAnswer, onNavigate }) {
  const [timeLeft, setTimeLeft] = useState(question.timeLimit);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [currentScore, setCurrentScore] = useState(question.baseScore);
  const [usedPowerups, setUsedPowerups] = useState([]);
  const [activePowerup, setActivePowerup] = useState(null); // { type, content }
  const [toasts, setToasts] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const totalQuestions = 5;

  // Timer
  useEffect(() => {
    if (answered) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); handleTimeUp(); return 0; }
        return t - 1;
      });
      setCurrentScore(s => Math.max(s - 2, 0));
    }, 1000);
    return () => clearInterval(id);
  }, [answered]);

  const handleTimeUp = useCallback(() => {
    setAnswered(true);
    addToast('⏰ Time\'s up!', 'error');
  }, []);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
  };

  const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  const handlePowerup = (pu) => {
    if (usedPowerups.includes(pu.id)) {
      addToast('Already used!', 'info'); return;
    }
    setUsedPowerups(prev => [...prev, pu.id]);
    setCurrentScore(s => Math.max(s + pu.scoreImpact, 0));
    setActivePowerup(null);

    setTimeout(() => {
      let content;
      const h = question.hints;
      switch (pu.id) {
        case 'lexicon':
          content = { type: 'lexicon', data: h.lexicon };
          break;
        case 'pattern':
          content = { type: 'pattern', data: h.patternWords };
          addToast(`📍 Marked ${h.patternWords.length} known words`, 'success');
          return;
        case 'grammar':
          content = { type: 'grammar', text: h.grammar };
          break;
        case 'contextual':
          content = { type: 'contextual', text: h.contextualClue };
          break;
        case 'partial':
          content = { type: 'partial', text: h.partialTranslation };
          break;
        case 'full':
          content = { type: 'full', text: h.fullTranslation };
          break;
        default:
          return;
      }
      setActivePowerup(content);
    }, 150);
  };

  const handleAnswer = (answer) => {
    if (answered) return;
    setSelectedAnswer(answer);
    setAnswered(true);

    if (answer.isCorrect) {
      addToast(`✅ Correct! +${currentScore} points`, 'success');
    } else {
      addToast('❌ Not quite — check the explanation!', 'error');
      setCurrentScore(0);
    }

    setTimeout(() => {
      onAnswer({ answer, score: answer.isCorrect ? currentScore : 0, hintsUsed: usedPowerups.length });
    }, 2500);
  };

  // Highlight pattern words
  const renderQuestion = () => {
    const words = question.translatedContent.split(' ');
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {words.map((word, i) => {
          const cleanWord = word.replace(/[?¿!¡.,;:]/g, '');
          const isKnown = usedPowerups.includes('pattern') && question.hints.patternWords.includes(cleanWord);
          return (
            <span
              key={i}
              style={{
                fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                fontFamily: 'var(--font-mono)',
                color: isKnown ? 'var(--clr-accent)' : 'var(--clr-text-primary)',
                background: isKnown ? 'rgba(0,229,255,0.08)' : 'transparent',
                padding: isKnown ? '2px 8px' : '2px 0',
                borderRadius: isKnown ? '6px' : '0',
                borderBottom: isKnown ? '2px solid var(--clr-accent)' : '2px solid transparent',
                transition: 'all 0.3s ease',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="screen" style={{ padding: '90px 0 40px', position: 'relative' }}>
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>

      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(124,58,255,0.08) 0%, transparent 70%), var(--clr-bg-deep)',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '860px' }}>
        {/* Header: Progress + Timer + Score */}
        <div className="flex items-center justify-between" style={{ marginBottom: '24px', animation: 'fadeIn 0.4s ease' }}>
          {/* Left: Question progress */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {language?.flag} {language?.name} · Question {questionNumber}/{totalQuestions}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <div key={i} style={{
                  height: 4, width: 48, borderRadius: 'var(--radius-full)',
                  background: i < questionNumber - 1 ? 'var(--clr-success)' : i === questionNumber - 1 ? 'var(--clr-primary)' : 'rgba(255,255,255,0.1)',
                }} />
              ))}
            </div>
          </div>

          {/* Center: Timer */}
          <TimerCircle timeLeft={timeLeft} totalTime={question.timeLimit} />

          {/* Right: Score */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Potential Score</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 700,
              color: currentScore > 500 ? 'var(--clr-gold)' : currentScore > 200 ? 'var(--clr-warning)' : 'var(--clr-danger)',
            }}>
              {currentScore.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Category + Difficulty */}
        <div className="flex items-center gap-3" style={{ marginBottom: '20px', animation: 'fadeIn 0.4s ease 0.1s both' }}>
          <div className="badge badge-primary" style={{ fontSize: '0.8rem', padding: '4px 14px' }}>
            {question.categoryIcon} {question.category}
          </div>
          <div className={`badge ${question.difficulty === 'EASY' ? 'badge-success' : question.difficulty === 'MEDIUM' ? 'badge-accent' : 'badge-danger'}`}>
            {question.difficulty}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', marginLeft: 'auto' }}>
            🎯 Guess the language to earn bonus points
          </div>
        </div>

        {/* Question Card */}
        <div className="card" style={{
          marginBottom: '20px',
          padding: '36px 32px',
          textAlign: 'center',
          background: 'rgba(22,24,48,0.9)',
          borderColor: 'rgba(124,58,255,0.3)',
          boxShadow: '0 0 40px rgba(124,58,255,0.08)',
          animation: 'fadeInScale 0.5s ease 0.2s both',
        }}>
          <div style={{ marginBottom: '12px', fontSize: '0.75rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Decipher this question
          </div>
          {renderQuestion()}

          {/* Power-up result panel */}
          {activePowerup && (
            <div style={{
              marginTop: '24px', padding: '16px 20px',
              background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.08)',
              animation: 'slideInUp 0.3s ease',
              textAlign: 'left',
            }}>
              {activePowerup.type === 'lexicon' && (
                <>
                  <div style={{ fontSize: '0.75rem', color: 'var(--clr-primary-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>📖 Lexicon</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {activePowerup.data.map((entry, i) => (
                      <div key={i} style={{
                        padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                        background: 'rgba(124,58,255,0.1)', border: '1px solid rgba(124,58,255,0.2)',
                      }}>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--clr-accent)', fontWeight: 600 }}>{entry.word}</span>
                        <span style={{ color: 'var(--clr-text-muted)', margin: '0 6px' }}>→</span>
                        <span style={{ color: 'var(--clr-text-secondary)', fontSize: '0.85rem' }}>{entry.meaning}</span>
                        <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>[{entry.pos}]</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {(activePowerup.type === 'grammar' || activePowerup.type === 'contextual') && (
                <>
                  <div style={{ fontSize: '0.75rem', color: activePowerup.type === 'grammar' ? 'var(--clr-success)' : '#ff9f1c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    {activePowerup.type === 'grammar' ? '🏗️ Grammar Decoder' : '💡 Contextual Clue'}
                  </div>
                  <p style={{ color: 'var(--clr-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{activePowerup.text}</p>
                </>
              )}
              {(activePowerup.type === 'partial' || activePowerup.type === 'full') && (
                <>
                  <div style={{ fontSize: '0.75rem', color: activePowerup.type === 'partial' ? '#ff6b9d' : 'var(--clr-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    {activePowerup.type === 'partial' ? '📝 Partial Translation' : '🌐 Full Translation'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', color: activePowerup.type === 'full' ? 'var(--clr-gold)' : 'var(--clr-text-primary)', fontSize: '1rem', fontStyle: 'italic' }}>
                    "{activePowerup.text}"
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Power-ups Row */}
        <div style={{ animation: 'fadeIn 0.4s ease 0.3s both' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
            Power-ups
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {powerUpInfo.map(pu => (
              <PowerUpButton
                key={pu.id}
                powerup={pu}
                onClick={handlePowerup}
                used={usedPowerups.includes(pu.id)}
                disabled={answered}
              />
            ))}
          </div>
        </div>

        {/* Answers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeIn 0.4s ease 0.4s both' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
            Your Answer
          </div>
          {question.answers.map((ans, i) => {
            let state = null;
            if (answered) {
              if (ans.isCorrect) state = 'correct';
              else if (selectedAnswer?.id === ans.id) state = 'wrong';
            }
            return (
              <AnswerButton
                key={ans.id}
                answer={ans}
                index={i}
                onClick={handleAnswer}
                state={state}
              />
            );
          })}
        </div>

        {/* Post-answer explanation */}
        {answered && (
          <div className="card" style={{
            marginTop: '20px',
            background: selectedAnswer?.isCorrect
              ? 'rgba(16,217,120,0.05)'
              : 'rgba(255,77,109,0.05)',
            borderColor: selectedAnswer?.isCorrect ? 'rgba(16,217,120,0.3)' : 'rgba(255,77,109,0.3)',
            animation: 'slideInUp 0.4s ease',
          }}>
            <div style={{ fontWeight: 700, marginBottom: '8px', color: selectedAnswer?.isCorrect ? 'var(--clr-success)' : 'var(--clr-danger)' }}>
              {selectedAnswer?.isCorrect ? '🎉 Excellent! ' : '📚 '}
              {selectedAnswer?.isCorrect ? `You earned ${currentScore} points!` : `The correct answer was: ${question.answers.find(a => a.isCorrect)?.content}`}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-secondary)' }}>{question.explanation}</p>
            <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
              Original: <em style={{ color: 'var(--clr-text-secondary)' }}>"{question.originalContent}"</em>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
