import { useGameStore } from '../store/useGameStore';
import { formatColorName } from '../utils/helpers';

export default function GameStatus() {
  const {
    gameStatus,
    winner,
    myColor,
    turn,
    myNickname,
    opponentNickname,
    mustContinueCapture,
    error
  } = useGameStore();

  if (gameStatus === 'finished') {
    return (
      <div className="mb-2 sm:mb-4 p-2 sm:p-4 bg-gradient-to-r from-accent-cyan to-accent-orange rounded-lg text-center">
        <p className="text-base sm:text-xl font-bold">
          {winner === myColor ? '🎉 Você venceu!' : '😔 Você perdeu!'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-dark-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-dark-700">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-accent-cyan">
        Informações do Jogo
      </h2>

      {error && (
        <div className="mb-3 p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {mustContinueCapture && (
        <div className="mb-3 p-2 sm:p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 text-center text-xs sm:text-sm">
          Você deve continuar capturando!
        </div>
      )}

      <div className="space-y-3">
        {/* Jogador Branco */}
        <div className="bg-dark-700 rounded-lg p-3 border border-dark-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${turn === 'white' ? 'bg-accent-cyan' : 'bg-gray-600'}`}></div>
              <span className="text-white font-semibold">Brancas</span>
            </div>
            {myColor === 'white' && (
              <span className="px-2 py-1 bg-accent-cyan text-dark-900 rounded text-xs font-semibold">
                Você
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {myColor === 'white' ? myNickname : opponentNickname || 'Aguardando...'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Peças: {countPieces('white')}
          </p>
        </div>

        {/* Jogador Preto */}
        <div className="bg-dark-700 rounded-lg p-3 border border-dark-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${turn === 'black' ? 'bg-accent-cyan' : 'bg-gray-600'}`}></div>
              <span className="text-white font-semibold">Pretas</span>
            </div>
            {myColor === 'black' && (
              <span className="px-2 py-1 bg-accent-cyan text-dark-900 rounded text-xs font-semibold">
                Você
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {myColor === 'black' ? myNickname : opponentNickname || 'Aguardando...'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Peças: {countPieces('black')}
          </p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          Vez de: <span className="text-accent-cyan font-semibold">{formatColorName(turn)}</span>
        </p>
      </div>
    </div>
  );
}

function countPieces(color) {
  const board = useGameStore.getState().board;
  if (!board || board.length === 0) return 0;
  
  let count = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row]?.[col]?.color === color) {
        count++;
      }
    }
  }
  return count;
}

