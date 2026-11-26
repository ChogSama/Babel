import { useState } from 'react';
import './index.css';
import { Navbar, AchievementToastOverlay } from './components/UI';
import { evaluateAchievements } from './data/achievementsData';
import { AuthScreen } from './pages/AuthScreen';
import { HomeScreen } from './pages/HomeScreen';
import { LanguageSelectScreen } from './pages/LanguageSelectScreen';
import { GameScreen } from './pages/GameScreen';
import { ResultScreen } from './pages/ResultScreen';
import { NotebookScreen } from './pages/NotebookScreen';
import { DashboardScreen } from './pages/DashboardScreen';
import { GameModeScreen } from './pages/GameModeScreen';
import { DailyChallengeScreen } from './pages/DailyChallengeScreen';
import { SpacedRepetitionScreen } from './pages/SpacedRepetitionScreen';
import { LeaderboardScreen } from './pages/LeaderboardScreen';
import {
  languages,
  questions,
  player as defaultPlayer,
  vocabularyNotebook as defaultVocab,
  dailyChallenge,
} from './data/mockData';

export default function App() {
  const [screen, setScreen] = useState('auth'); // auth | home | game-mode | daily | language-select | game | result | notebook | dashboard | review | leaderboard
  const [player, setPlayer] = useState(defaultPlayer);
  const [vocab, setVocab] = useState(defaultVocab);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [newAchievements, setNewAchievements] = useState([]);      // sprint-6: newly unlocked this session
  const [achievementQueue, setAchievementQueue] = useState([]);    // sprint-6: live toast queue

  const navigate = (to) => {
    if (to === 'home' && !isAuthenticated) { setScreen('auth'); return; }
    setScreen(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (userData) => {
    setPlayer(p => ({ ...p, username: userData.username || p.username }));
    setIsAuthenticated(true);
    setScreen('home');
  };

  // Start an Expedition session for a chosen language (up to 5 Qs)
  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    const qs = questions.filter(q => q.languageId === lang.id);
    const session = qs.length > 0 ? qs.slice(0, 5) : [questions[0]];
    setSessionQuestions(session);
    setSessionIndex(0);
    setSessionResults([]);
    setScreen('game');
  };

  // Start a Random session (pick 5 random questions from all)
  const handleRandomStart = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    const session = shuffled.slice(0, 5);
    const firstLang = languages.find(l => l.id === session[0].languageId) || languages[0];
    setSelectedLanguage(firstLang);
    setSessionQuestions(session);
    setSessionIndex(0);
    setSessionResults([]);
    setScreen('game');
  };

  // Start a Daily session (single question)
  const handleDailyStart = () => {
    const q = dailyChallenge.question;
    const lang = languages.find(l => l.id === q.languageId) || languages[0];
    setSelectedLanguage(lang);
    setSessionQuestions([q]);
    setSessionIndex(0);
    setSessionResults([]);
    setScreen('game');
  };

  const handleExitGame = () => {
    setSessionResults([]);
    setSelectedLanguage(null);
    setSessionQuestions([]);
    setSessionIndex(0);
    setScreen('game-mode');
  };

  const handleAnswer = ({ answer, score, hintsUsed }) => {
    const result = {
      answer,
      score,
      hintsUsed,
      correct: answer.isCorrect,
    };
    const newResults = [...sessionResults, result];
    setSessionResults(newResults);

    const nextIndex = sessionIndex + 1;

    // If more questions remain in the session, advance
    if (nextIndex < sessionQuestions.length) {
      setTimeout(() => {
        setSessionIndex(nextIndex);
        // Update language for new question (relevant in Random mode)
        const nextQ = sessionQuestions[nextIndex];
        const nextLang = languages.find(l => l.id === nextQ.languageId) || selectedLanguage;
        setSelectedLanguage(nextLang);
        // Force GameScreen re-mount by briefly going to a transition state then back
        setScreen('transitioning');
        setTimeout(() => setScreen('game'), 50);
      }, 2600);
    } else {
      // Session over — calculate score, XP, and update player profile
      setTimeout(() => {
        const totalScore = newResults.reduce((s, r) => s + r.score, 0);
        const correct = newResults.filter(r => r.correct).length;
        const hintsUsed = newResults.reduce((s, r) => s + r.hintsUsed, 0);
        const timeBonus = Math.round(Math.random() * 200);
        const accuracy = Math.round((correct / newResults.length) * 100);
        const finalScore = Math.max(totalScore + Math.round(accuracy * 8) + timeBonus - hintsUsed * 50, 0);
        const xpGained = Math.round(finalScore / 10);

        setPlayer(prev => {
          const newExp = prev.experience + xpGained;
          let newLevel = prev.level;
          let newExpToNext = prev.experienceToNext;
          if (newExp >= newExpToNext) {
            newLevel += 1;
            newExpToNext += 2000;
          }
          const totalQuestions = prev.questionsCompleted + newResults.length;
          const totalCorrect = prev.correctAnswers + correct;
          const updatedPlayer = {
            ...prev,
            totalScore: prev.totalScore + finalScore,
            experience: newExp,
            level: newLevel,
            experienceToNext: newExpToNext,
            questionsCompleted: totalQuestions,
            correctAnswers: totalCorrect,
            accuracyRate: Math.round((totalCorrect / totalQuestions) * 100),
          };

          // Sprint 6: evaluate achievements with the updated player state
          const unlocked = evaluateAchievements(updatedPlayer, prev.achievements || [], newResults);
          if (unlocked.length > 0) {
            const unlockedIds = unlocked.map(a => a.id);
            updatedPlayer.achievements = [...(prev.achievements || []), ...unlockedIds];
            setNewAchievements(unlocked);
            setAchievementQueue(unlocked);
          } else {
            setNewAchievements([]);
          }

          return updatedPlayer;
        });

        setLastResult({
          score: totalScore,
          correct,
          total: newResults.length,
          hintsUsed,
          timeBonus,
        });
        setScreen('result');
      }, 2600);
    }
  };

  const handleReviewComplete = ({ xpEarned, updatedVocab }) => {
    if (updatedVocab) {
      setVocab(updatedVocab);
    }
    if (xpEarned > 0) {
      setPlayer(prev => {
        const newExp = prev.experience + xpEarned;
        let newLevel = prev.level;
        let newExpToNext = prev.experienceToNext;
        if (newExp >= newExpToNext) {
          newLevel += 1;
          newExpToNext += 2000;
        }
        return {
          ...prev,
          experience: newExp,
          level: newLevel,
          experienceToNext: newExpToNext,
        };
      });
    }
    setScreen('notebook');
  };

  const handleUpdatePlayer = (updatedFields) => {
    setPlayer(prev => ({ ...prev, ...updatedFields }));
  };

  const handlePlayAgain = () => {
    // Go back to mode selection
    setSessionResults([]);
    setSessionQuestions([]);
    setSessionIndex(0);
    setScreen('game-mode');
  };

  const currentQuestion = sessionQuestions[sessionIndex] || questions[0];
  const currentLang = selectedLanguage || languages.find(l => l.id === currentQuestion.languageId) || languages[0];

  const showNavbar = isAuthenticated && !['auth', 'game', 'result', 'transitioning', 'review'].includes(screen);

  return (
    <>
      {/* Sprint 6: Global achievement toast overlay — visible on any authenticated screen */}
      <AchievementToastOverlay
        queue={achievementQueue}
        onDismiss={(id) => setAchievementQueue(q => q.filter(a => a.id !== id))}
      />

      {showNavbar && (
        <Navbar
          currentScreen={screen}
          onNavigate={navigate}
          player={player}
        />
      )}

      {screen === 'auth' && (
        <AuthScreen onLogin={handleLogin} />
      )}

      {screen === 'home' && (
        <HomeScreen
          player={player}
          dailyChallenge={dailyChallenge}
          onNavigate={navigate}
        />
      )}

      {screen === 'game-mode' && (
        <GameModeScreen
          onNavigate={navigate}
          onRandomStart={handleRandomStart}
          dailyChallenge={dailyChallenge}
        />
      )}

      {screen === 'daily' && (
        <DailyChallengeScreen
          dailyChallenge={dailyChallenge}
          player={player}
          onStart={handleDailyStart}
          onNavigate={navigate}
        />
      )}

      {screen === 'language-select' && (
        <LanguageSelectScreen
          languages={languages}
          onSelect={handleLanguageSelect}
          onBack={() => navigate('game-mode')}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          question={currentQuestion}
          language={currentLang}
          questionNumber={sessionIndex + 1}
          totalQuestions={sessionQuestions.length || 1}
          onAnswer={handleAnswer}
          onNavigate={navigate}
          onExit={handleExitGame}
        />
      )}

      {screen === 'result' && lastResult && (
        <ResultScreen
          result={lastResult}
          language={currentLang}
          newAchievements={newAchievements}
          onPlayAgain={handlePlayAgain}
          onNavigate={navigate}
        />
      )}

      {screen === 'notebook' && (
        <NotebookScreen
          vocabulary={vocab}
          languages={languages}
          onNavigate={navigate}
        />
      )}

      {screen === 'review' && (
        <SpacedRepetitionScreen
          vocabulary={vocab}
          onComplete={handleReviewComplete}
          onNavigate={navigate}
        />
      )}

      {screen === 'dashboard' && (
        <DashboardScreen
          player={player}
          languages={languages}
          onNavigate={navigate}
          onUpdatePlayer={handleUpdatePlayer}
        />
      )}

      {screen === 'leaderboard' && (
        <LeaderboardScreen
          player={player}
          onNavigate={navigate}
        />
      )}
    </>
  );
}
