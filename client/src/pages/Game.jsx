import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { getSocket } from '../utils/socket';
import Board from '../components/Board';
import Header from '../components/Header';
import GameStatus from '../components/GameStatus';
import Controls from '../components/Controls';

export default function Game({ onBackToHome }) {
  const {
    board,
    turn,
    myColor,
    roomId,
    gameStatus,
    setState,
    setError,
    setMustContinueCapture,
    clearSelection
  } = useGameStore();

  const moveHandlerRef = useRef(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !roomId) return;

    // Solicita o estado atual do jogo
    socket.emit('get-game-state', { roomId });

    // Eventos do Socket.IO
    socket.on('game-started', (state) => {
      console.log('🎮 Jogo iniciado!', state);
      updateGameState(state, socket);
    });

    socket.on('game-state', (state) => {
      console.log('📊 Estado do jogo atualizado:', state);
      updateGameState(state, socket);
    });

    socket.on('move-made', ({ from, to, captured, mustContinue, gameState: newState }) => {
      console.log('📥 Movimento recebido:', { from, to, captured, mustContinue });
      updateGameState(newState, socket);
      setError('');
      clearSelection();
      
      if (mustContinue) {
        setMustContinueCapture({ from: { row: to.row, col: to.col } });
      } else {
        setMustContinueCapture(null);
      }
    });

    socket.on('move-error', ({ message }) => {
      console.error('❌ Erro no movimento:', message);
      setError(message);
    });

    socket.on('must-continue-capture', ({ from }) => {
      setMustContinueCapture({ from });
    });

    socket.on('game-reset', (state) => {
      updateGameState(state, socket);
      setError('');
      setMustContinueCapture(null);
      clearSelection();
    });

    socket.on('player-disconnected', ({ message }) => {
      setError(message);
    });

    // Handler para movimentos locais
    moveHandlerRef.current = (event) => {
      const { from, to } = event.detail;
      console.log('📤 Enviando movimento:', { from, to, roomId });
      socket.emit('make-move', { from, to });
    };

    window.addEventListener('make-move', moveHandlerRef.current);

    return () => {
      socket.off('game-started');
      socket.off('game-state');
      socket.off('move-made');
      socket.off('move-error');
      socket.off('must-continue-capture');
      socket.off('game-reset');
      socket.off('player-disconnected');
      window.removeEventListener('make-move', moveHandlerRef.current);
    };
  }, [roomId, setState, setError, setMustContinueCapture, clearSelection]);

  const updateGameState = (state, socket) => {
    const playerColor = state.players.white?.id === socket.id ? 'white' : 
                       state.players.black?.id === socket.id ? 'black' : null;
    
    if (playerColor) {
      const opponentColor = playerColor === 'white' ? 'black' : 'white';
      setState({
        board: state.board,
        turn: state.currentPlayer,
        gameStatus: state.gameStatus,
        winner: state.winner,
        myColor: playerColor,
        opponentColor,
        myNickname: state.players[playerColor]?.nickname || '',
        opponentNickname: state.players[opponentColor]?.nickname || '',
        socket
      });
    }
  };

  if (!board || board.length === 0 || !myColor) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando jogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <Header onBack={onBackToHome} />

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-2 sm:gap-4">
          {/* Tabuleiro - Mobile primeiro, Desktop depois */}
          <div className="order-1 lg:order-2 lg:col-span-3">
            <Board />
          </div>

          {/* Info - Mobile depois, Desktop primeiro */}
          <div className="order-2 lg:order-1 lg:col-span-1">
            <GameStatus />
            <Controls />
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs text-gray-500">WillTech - Solução web</p>
        </div>
      </div>
    </div>
  );
}

