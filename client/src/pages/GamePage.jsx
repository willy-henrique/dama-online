import { useState, useEffect } from 'react';
import GameBoard from '../components/GameBoard';
import GameInfo from '../components/GameInfo';

export default function GamePage({ socket, gameData, onBackToHome }) {
  const [gameState, setGameState] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [playerNickname, setPlayerNickname] = useState('');
  const [opponentNickname, setOpponentNickname] = useState('');
  const [error, setError] = useState('');
  const [mustContinueCapture, setMustContinueCapture] = useState(null);

  useEffect(() => {
    if (!socket || !gameData) return;

    console.log('🎮 GamePage montado. Socket:', socket.id, 'GameData:', gameData);

    // Solicita o estado atual do jogo ao entrar na página
    if (gameData.roomId) {
      console.log('📡 Solicitando estado do jogo para a sala:', gameData.roomId);
      socket.emit('get-game-state', { roomId: gameData.roomId });
    }

    // Eventos do Socket.IO
    socket.on('game-started', (state) => {
      console.log('🎮 Jogo iniciado!', state);
      console.log('Socket ID:', socket.id);
      console.log('White player ID:', state.players.white?.id);
      console.log('Black player ID:', state.players.black?.id);
      setGameState(state);
      
      // Determina a cor do jogador baseado no socket.id
      let detectedColor = null;
      if (state.players.white?.id === socket.id) {
        detectedColor = 'white';
        setPlayerColor('white');
        setPlayerNickname(state.players.white.nickname);
        if (state.players.black) {
          setOpponentNickname(state.players.black.nickname);
        }
      } else if (state.players.black?.id === socket.id) {
        detectedColor = 'black';
        setPlayerColor('black');
        setPlayerNickname(state.players.black.nickname);
        if (state.players.white) {
          setOpponentNickname(state.players.white.nickname);
        }
      }
      
      // Fallback: usa a cor do gameData se não detectou
      if (!detectedColor && gameData.color) {
        console.log('⚠️ Usando cor do gameData como fallback:', gameData.color);
        setPlayerColor(gameData.color);
        if (gameData.nickname) {
          setPlayerNickname(gameData.nickname);
        }
      }
      
      console.log('✅ Cor do jogador definida:', detectedColor || gameData.color);
    });

    socket.on('game-state', (state) => {
      console.log('📊 Estado do jogo atualizado:', state);
      setGameState(state);
      
      // Determina a cor do jogador baseado no socket.id
      let detectedColor = null;
      if (state.players.white?.id === socket.id) {
        detectedColor = 'white';
        setPlayerColor('white');
        setPlayerNickname(state.players.white.nickname);
        if (state.players.black) {
          setOpponentNickname(state.players.black.nickname);
        }
      } else if (state.players.black?.id === socket.id) {
        detectedColor = 'black';
        setPlayerColor('black');
        setPlayerNickname(state.players.black.nickname);
        if (state.players.white) {
          setOpponentNickname(state.players.white.nickname);
        }
      }
      
      // Fallback: usa a cor do gameData se não detectou
      if (!detectedColor && gameData.color) {
        console.log('⚠️ Usando cor do gameData como fallback:', gameData.color);
        setPlayerColor(gameData.color);
        if (gameData.nickname) {
          setPlayerNickname(gameData.nickname);
        }
      }
      
      // Se ainda não tem cor, tenta determinar pelo estado
      if (!detectedColor && !gameData.color) {
        if (state.players.white && !state.players.black) {
          // Só tem jogador branco, então este deve ser o preto
          console.log('⚠️ Determinando cor pelo estado: black');
          setPlayerColor('black');
        } else if (state.players.black && !state.players.white) {
          // Só tem jogador preto, então este deve ser o branco
          console.log('⚠️ Determinando cor pelo estado: white');
          setPlayerColor('white');
        }
      }
    });

    socket.on('move-made', ({ from, to, captured, mustContinue, gameState: newState }) => {
      setGameState(newState);
      setError('');
      if (mustContinue) {
        // Se deve continuar, a peça está na posição 'to'
        setMustContinueCapture({ from: { row: to.row, col: to.col } });
      } else {
        setMustContinueCapture(null);
      }
    });

    socket.on('move-error', ({ message }) => {
      setError(message);
    });

    socket.on('must-continue-capture', ({ from }) => {
      setMustContinueCapture({ from });
    });

    socket.on('game-reset', (state) => {
      setGameState(state);
      setError('');
      setMustContinueCapture(null);
    });

    socket.on('player-disconnected', ({ message }) => {
      setError(message);
    });

    return () => {
      socket.off('game-started');
      socket.off('game-state');
      socket.off('move-made');
      socket.off('move-error');
      socket.off('must-continue-capture');
      socket.off('game-reset');
      socket.off('player-disconnected');
    };
  }, [socket, gameData]);

  const handleMove = (from, to) => {
    if (!socket || !gameData?.roomId) return;
    socket.emit('make-move', { from, to });
  };

  const handleReset = () => {
    if (!socket) return;
    socket.emit('reset-game');
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan mx-auto mb-4"></div>
          <p className="text-gray-400">Aguardando outro jogador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-2 sm:mb-4 flex items-center justify-between text-xs sm:text-sm">
          <button
            onClick={onBackToHome}
            className="text-gray-400 hover:text-white transition px-2 py-1 sm:px-4 sm:py-2"
          >
            ← Voltar
          </button>
          <p className="text-xs text-gray-500 hidden sm:block">WillTech - Solução web</p>
        </div>

        {/* Mobile: Tabuleiro primeiro, depois info */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-2 sm:gap-4">
          {/* Tabuleiro - Mobile primeiro, Desktop depois */}
          <div className="order-1 lg:order-2 lg:col-span-3">
            <GameBoard
              board={gameState.board}
              currentPlayer={gameState.currentPlayer}
              playerColor={playerColor}
              gameStatus={gameState.gameStatus}
              winner={gameState.winner}
              onMove={handleMove}
              mustContinueCapture={mustContinueCapture}
            />
          </div>

          {/* Info - Mobile depois, Desktop primeiro */}
          <div className="order-2 lg:order-1 lg:col-span-1">
            <GameInfo
              gameState={gameState}
              playerColor={playerColor}
              playerNickname={playerNickname}
              opponentNickname={opponentNickname}
              error={error}
              mustContinueCapture={mustContinueCapture}
              onReset={handleReset}
            />
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs text-gray-500">WillTech - Solução web</p>
        </div>
      </div>
    </div>
  );
}

