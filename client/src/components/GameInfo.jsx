export default function GameInfo({ 
  gameState, 
  playerColor, 
  playerNickname, 
  opponentNickname,
  error,
  mustContinueCapture,
  onReset 
}) {
  const getPlayerInfo = (color) => {
    if (color === 'white') {
      return {
        nickname: gameState.players.white?.nickname || 'Aguardando...',
        isCurrent: gameState.currentPlayer === 'white',
        isPlayer: playerColor === 'white'
      };
    } else {
      return {
        nickname: gameState.players.black?.nickname || 'Aguardando...',
        isCurrent: gameState.currentPlayer === 'black',
        isPlayer: playerColor === 'black'
      };
    }
  };

  const whitePlayer = getPlayerInfo('white');
  const blackPlayer = getPlayerInfo('black');

  const countPieces = (color) => {
    let count = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (gameState.board[row][col]?.color === color) {
          count++;
        }
      }
    }
    return count;
  };

  return (
    <div className="bg-dark-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-dark-700 space-y-3 sm:space-y-4">
      <h2 className="text-base sm:text-xl font-bold text-accent-cyan mb-2 sm:mb-4">Informações do Jogo</h2>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {gameState.gameStatus === 'waiting' && (
        <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 text-center">
          <p className="font-semibold">Aguardando outro jogador...</p>
        </div>
      )}

      <div className="space-y-3">
        <div className={`p-2 sm:p-3 rounded-lg border-2 ${
          whitePlayer.isCurrent && gameState.gameStatus === 'playing'
            ? 'border-accent-cyan bg-accent-cyan/10' 
            : 'border-dark-600 bg-dark-700'
        }`}>
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full border-2 border-gray-300"></div>
              <span className="font-semibold text-xs sm:text-sm">Brancas</span>
              {whitePlayer.isPlayer && (
                <span className="text-xs bg-accent-cyan text-dark-900 px-1.5 sm:px-2 py-0.5 rounded">Você</span>
              )}
            </div>
            {whitePlayer.isCurrent && gameState.gameStatus === 'playing' && (
              <span className="text-xs text-accent-cyan">●</span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-300 truncate">{whitePlayer.nickname}</p>
          <p className="text-xs text-gray-400 mt-1">Peças: {countPieces('white')}</p>
        </div>

        <div className={`p-2 sm:p-3 rounded-lg border-2 ${
          blackPlayer.isCurrent && gameState.gameStatus === 'playing'
            ? 'border-accent-cyan bg-accent-cyan/10' 
            : 'border-dark-600 bg-dark-700'
        }`}>
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-900 rounded-full border-2 border-gray-700"></div>
              <span className="font-semibold text-xs sm:text-sm">Pretas</span>
              {blackPlayer.isPlayer && (
                <span className="text-xs bg-accent-cyan text-dark-900 px-1.5 sm:px-2 py-0.5 rounded">Você</span>
              )}
            </div>
            {blackPlayer.isCurrent && gameState.gameStatus === 'playing' && (
              <span className="text-xs text-accent-cyan">●</span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-300 truncate">{blackPlayer.nickname}</p>
          <p className="text-xs text-gray-400 mt-1">Peças: {countPieces('black')}</p>
        </div>
      </div>

      {gameState.gameStatus === 'playing' && (
        <button
          onClick={onReset}
          className="w-full bg-dark-700 hover:bg-dark-600 text-white font-semibold py-2 rounded-lg transition border border-dark-600"
        >
          Reiniciar Partida
        </button>
      )}

      {gameState.gameStatus === 'finished' && (
        <div className="p-4 bg-gradient-to-r from-accent-cyan/20 to-accent-orange/20 border border-accent-cyan/50 rounded-lg text-center">
          <p className="font-bold text-lg mb-2">
            {gameState.winner === playerColor ? '🎉 Vitória!' : '😔 Derrota'}
          </p>
          <p className="text-sm text-gray-300">
            Vencedor: {gameState.winner === 'white' ? whitePlayer.nickname : blackPlayer.nickname}
          </p>
        </div>
      )}
    </div>
  );
}

