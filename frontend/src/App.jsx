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
import {
  languages,
  questions,
  player as defaultPlayer,
  vocabularyNotebook,
  dailyChallenge,
} from './data/mockData';

export default function App() {
  const [screen, setScreen] = useState('auth'); // auth | home | game-mode | language-select | game | result | notebook | dashboard
  const [player, setPlayer] = useState(defaultPlayer);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    // Pick a question for this language
    const q = questions.find(q => q.languageId === lang.id) || questions[0];
    setCurrentQuestionIndex(questions.indexOf(q));
    setSessionResults([]);
    setScreen('game');
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

    // After a short delay, show result screen
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
    }, 300);
  };

  const handlePlayAgain = () => {
    // Pick a random question
    const idx = Math.floor(Math.random() * questions.length);
    setCurrentQuestionIndex(idx);
    setSessionResults([]);
    setScreen('game');
  };

  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const currentLang = selectedLanguage || languages.find(l => l.id === currentQuestion.languageId) || languages[0];

  const showNavbar = isAuthenticated && !['auth', 'game', 'result'].includes(screen);

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

      {screen === 'language-select' && (
        <LanguageSelectScreen
          languages={languages}
          onSelect={handleLanguageSelect}
          onBack={() => navigate('home')}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          question={currentQuestion}
          language={currentLang}
          onAnswer={handleAnswer}
          onNavigate={navigate}
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
