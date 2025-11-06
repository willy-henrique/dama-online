import { useState, useEffect } from 'react';
import { getValidMoves, isValidMove } from '../utils/gameLogic';

export default function GameBoard({ 
  board, 
  currentPlayer, 
  playerColor, 
  gameStatus,
  winner,
  onMove,
  mustContinueCapture 
}) {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);

  // Inverte o tabuleiro se o jogador for preto (para ver do seu lado)
  const shouldFlipBoard = playerColor === 'black';
  
  // Função para inverter coordenadas
  const getDisplayRow = (row) => shouldFlipBoard ? 7 - row : row;
  const getDisplayCol = (col) => shouldFlipBoard ? 7 - col : col;
  const getActualRow = (displayRow) => shouldFlipBoard ? 7 - displayRow : displayRow;
  const getActualCol = (displayCol) => shouldFlipBoard ? 7 - displayCol : displayCol;

  useEffect(() => {
    if (selectedPiece) {
      const moves = getValidMoves(board, selectedPiece.row, selectedPiece.col, currentPlayer, mustContinueCapture);
      setValidMoves(moves);
      setHighlightedCells(moves.map(m => ({ row: m.to.row, col: m.to.col })));
    } else {
      setValidMoves([]);
      setHighlightedCells([]);
    }
  }, [selectedPiece, board, currentPlayer, mustContinueCapture]);

  const handleCellClick = (row, col) => {
    // Se o jogo acabou, não permite movimentos
    if (gameStatus === 'finished') {
      console.log('❌ Jogo acabou, não pode mover');
      return;
    }

    // Se não tem cor definida, não permite movimentos
    if (!playerColor) {
      console.log('❌ Cor do jogador não definida');
      return;
    }

    // Se não é o turno do jogador, não permite movimentos
    if (currentPlayer !== playerColor) {
      console.log(`❌ Não é seu turno. Turno atual: ${currentPlayer}, Você: ${playerColor}`);
      return;
    }

    // Usa coordenadas reais (não invertidas)
    const piece = board[row][col];
    console.log('🖱️ Célula clicada:', { row, col, piece, playerColor });

    // Se clicou em uma peça do jogador
    if (piece && piece.color === playerColor) {
      // Se há captura obrigatória, só permite selecionar a peça que deve continuar
      if (mustContinueCapture) {
        if (row === mustContinueCapture.from.row && col === mustContinueCapture.from.col) {
          setSelectedPiece({ row, col, piece });
        }
      } else {
        setSelectedPiece({ row, col, piece });
      }
      return;
    }

    // Se há uma peça selecionada e clicou em uma célula válida
    if (selectedPiece) {
      const move = validMoves.find(
        m => m.to.row === row && m.to.col === col
      );

      if (move) {
        // Usa coordenadas reais para o movimento
        console.log('✅ Movimento válido:', { from: selectedPiece, to: { row, col } });
        onMove(selectedPiece, { row, col });
        setSelectedPiece(null);
        setValidMoves([]);
        setHighlightedCells([]);
      } else {
        // Clicou em célula inválida, deseleciona
        console.log('❌ Movimento inválido');
        setSelectedPiece(null);
      }
    }
  };

  const isCellHighlighted = (row, col) => {
    return highlightedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isCellSelected = (row, col) => {
    return selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
  };

  const getCellColor = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    return isLight ? 'bg-amber-100' : 'bg-amber-800';
  };

  const renderPiece = (piece) => {
    if (!piece) return null;

    const baseClasses = 'w-full h-full rounded-full border-2 flex items-center justify-center';
    const colorClasses = piece.color === 'white' 
      ? 'bg-white border-gray-300' 
      : 'bg-gray-900 border-gray-700';
    
    const kingClasses = piece.type === 'king' 
      ? 'ring-2 ring-yellow-400 ring-offset-1' 
      : '';

    return (
      <div className={`${baseClasses} ${colorClasses} ${kingClasses}`}>
        {piece.type === 'king' && (
          <div className={`w-3 h-3 rounded-full ${piece.color === 'white' ? 'bg-yellow-400' : 'bg-yellow-500'}`}></div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-dark-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-dark-700">
      {gameStatus === 'finished' && (
        <div className="mb-2 sm:mb-4 p-2 sm:p-4 bg-gradient-to-r from-accent-cyan to-accent-orange rounded-lg text-center">
          <p className="text-base sm:text-xl font-bold">
            {winner === playerColor ? '🎉 Você venceu!' : '😔 Você perdeu!'}
          </p>
        </div>
      )}

      {mustContinueCapture && (
        <div className="mb-2 sm:mb-4 p-2 sm:p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 text-center text-xs sm:text-sm">
          Você deve continuar capturando!
        </div>
      )}

      <div className="flex justify-center p-2 sm:p-4">
        <div className="grid grid-cols-8 gap-0 border-2 sm:border-4 border-dark-700 shadow-2xl max-w-full">
          {/* Renderiza o tabuleiro invertido se necessário */}
          {Array.from({ length: 8 }, (_, displayRow) => 
            Array.from({ length: 8 }, (_, displayCol) => {
              // Converte coordenadas de exibição para reais
              const actualRow = getActualRow(displayRow);
              const actualCol = getActualCol(displayCol);
              const cell = board[actualRow][actualCol];
              const cellColor = getCellColor(displayRow, displayCol);
              const isHighlighted = isCellHighlighted(actualRow, actualCol);
              const isSelected = isCellSelected(actualRow, actualCol);
              const canMove = currentPlayer === playerColor && gameStatus === 'playing';

              return (
                <div
                  key={`${displayRow}-${displayCol}`}
                  onClick={() => handleCellClick(actualRow, actualCol)}
                  className={`
                    w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20
                    ${cellColor}
                    ${isSelected ? 'ring-2 sm:ring-4 ring-accent-cyan' : ''}
                    ${isHighlighted ? 'ring-1 sm:ring-2 ring-accent-orange' : ''}
                    ${canMove && cell && cell.color === playerColor ? 'cursor-pointer hover:opacity-80 active:scale-95' : ''}
                    ${canMove && isHighlighted ? 'cursor-pointer hover:bg-accent-orange/30' : ''}
                    ${!canMove ? 'cursor-not-allowed opacity-50' : ''}
                    transition-all duration-200
                    flex items-center justify-center
                    relative
                    touch-none
                    select-none
                  `}
                >
                  {cell && renderPiece(cell)}
                  {isHighlighted && !cell && (
                    <div className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-accent-orange rounded-full"></div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-2 sm:mt-4 text-center text-xs sm:text-sm text-gray-400">
        <p>Turno: {currentPlayer === 'white' ? 'Brancas' : 'Pretas'}</p>
        {playerColor && (
          <p className="mt-1 text-accent-cyan">
            Você joga com: {playerColor === 'white' ? 'Brancas' : 'Pretas'}
          </p>
        )}
      </div>
    </div>
  );
}

