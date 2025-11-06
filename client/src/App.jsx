import { useState } from 'react';
import { useGameStore } from './store/useGameStore';
import Home from './pages/Home';
import Game from './pages/Game';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { reset } = useGameStore();

  const handleStartGame = () => {
    setCurrentPage('game');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
      {currentPage === 'home' ? (
        <Home onStartGame={handleStartGame} />
      ) : (
        <Game onBackToHome={handleBackToHome} />
      )}
    </div>
  );
}

export default App;

