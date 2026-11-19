import { useState } from 'react';
import './index.css';
import { Navbar } from './components/UI';
import { AuthScreen } from './pages/AuthScreen';
import { HomeScreen } from './pages/HomeScreen';
import { LanguageSelectScreen } from './pages/LanguageSelectScreen';
import { GameScreen } from './pages/GameScreen';
import { ResultScreen } from './pages/ResultScreen';
import { NotebookScreen } from './pages/NotebookScreen';
import { DashboardScreen } from './pages/DashboardScreen';
import { GameModeScreen } from './pages/GameModeScreen';
import { DailyChallengeScreen } from './pages/DailyChallengeScreen';
import {
  languages,
  questions,
  player as defaultPlayer,
  vocabularyNotebook,
  dailyChallenge,
} from './data/mockData';

export default function App() {
  const [screen, setScreen] = useState('auth'); // auth | home | game-mode | daily | language-select | game | result | notebook | dashboard
  const [player, setPlayer] = useState(defaultPlayer);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);
  const [lastResult, setLastResult] = useState(null);

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
      // Session over — show result
      setTimeout(() => {
        const totalScore = newResults.reduce((s, r) => s + r.score, 0);
        const correct = newResults.filter(r => r.correct).length;
        setLastResult({
          score: totalScore,
          correct,
          total: newResults.length,
          hintsUsed: newResults.reduce((s, r) => s + r.hintsUsed, 0),
          timeBonus: Math.round(Math.random() * 200),
        });
        setScreen('result');
      }, 2600);
    }
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

  const showNavbar = isAuthenticated && !['auth', 'game', 'result', 'transitioning'].includes(screen);

  return (
    <>
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
          onPlayAgain={handlePlayAgain}
          onNavigate={navigate}
        />
      )}

      {screen === 'notebook' && (
        <NotebookScreen
          vocabulary={vocabularyNotebook}
          languages={languages}
          onNavigate={navigate}
        />
      )}

      {screen === 'dashboard' && (
        <DashboardScreen
          player={player}
          languages={languages}
          onNavigate={navigate}
        />
      )}
    </>
  );
}
