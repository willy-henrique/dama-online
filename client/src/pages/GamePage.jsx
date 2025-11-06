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

    // Eventos do Socket.IO
    socket.on('game-started', (state) => {
      console.log('🎮 Jogo iniciado!', state);
      setGameState(state);
      // Determina a cor do jogador baseado no socket.id
      if (state.players.white?.id === socket.id) {
        setPlayerColor('white');
        setPlayerNickname(state.players.white.nickname);
        if (state.players.black) {
          setOpponentNickname(state.players.black.nickname);
        }
      } else if (state.players.black?.id === socket.id) {
        setPlayerColor('black');
        setPlayerNickname(state.players.black.nickname);
        if (state.players.white) {
          setOpponentNickname(state.players.white.nickname);
        }
      } else if (gameData.color) {
        // Fallback: usa a cor do gameData se disponível
        setPlayerColor(gameData.color);
      }
    });

    socket.on('game-state', (state) => {
      setGameState(state);
      // Determina a cor do jogador baseado no socket.id
      if (state.players.white?.id === socket.id) {
        setPlayerColor('white');
        setPlayerNickname(state.players.white.nickname);
        if (state.players.black) {
          setOpponentNickname(state.players.black.nickname);
        }
      } else if (state.players.black?.id === socket.id) {
        setPlayerColor('black');
        setPlayerNickname(state.players.black.nickname);
        if (state.players.white) {
          setOpponentNickname(state.players.white.nickname);
        }
      } else if (gameData.color) {
        setPlayerColor(gameData.color);
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
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="text-gray-400 hover:text-white transition"
          >
            ← Voltar ao menu
          </button>
          <p className="text-xs text-gray-500">WillTech - Solução web</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
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

          <div className="lg:col-span-3">
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
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">WillTech - Solução web</p>
        </div>
      </div>
    </div>
  );
}

