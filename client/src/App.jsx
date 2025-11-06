import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    // Conecta ao servidor Socket.IO
    const newSocket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      extraHeaders: {
        'ngrok-skip-browser-warning': 'true'
      }
    });

    newSocket.on('connect', () => {
      console.log('✅ Conectado ao servidor');
      console.log('Server URL:', SERVER_URL);
      console.log('Socket ID:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Desconectado do servidor');
    });

    newSocket.on('error', (error) => {
      console.error('❌ Erro Socket.IO:', error);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão:', error);
      console.error('Tentando conectar em:', SERVER_URL);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleCreateRoom = (roomId) => {
    setGameData({ roomId, socket });
    setCurrentPage('game');
  };

  const handleJoinRoom = (roomId, color, nickname) => {
    setGameData({ roomId, color, nickname, socket });
    setCurrentPage('game');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setGameData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
      {currentPage === 'home' ? (
        <HomePage 
          socket={socket} 
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onBackToHome={handleBackToHome}
        />
      ) : (
        <GamePage 
          socket={socket}
          gameData={gameData}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;

