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
    if (gameStatus === 'finished') return;

    // Se não é o turno do jogador, não permite movimentos
    if (currentPlayer !== playerColor) return;

    const piece = board[row][col];

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
        onMove(selectedPiece, { row, col });
        setSelectedPiece(null);
        setValidMoves([]);
        setHighlightedCells([]);
      } else {
        // Clicou em célula inválida, deseleciona
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
    <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
      {gameStatus === 'finished' && (
        <div className="mb-4 p-4 bg-gradient-to-r from-accent-cyan to-accent-orange rounded-lg text-center">
          <p className="text-xl font-bold">
            {winner === playerColor ? '🎉 Você venceu!' : '😔 Você perdeu!'}
          </p>
        </div>
      )}

      {mustContinueCapture && (
        <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 text-center">
          Você deve continuar capturando!
        </div>
      )}

      <div className="flex justify-center">
        <div className="grid grid-cols-8 gap-0 border-4 border-dark-700 shadow-2xl">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const cellColor = getCellColor(rowIndex, colIndex);
              const isHighlighted = isCellHighlighted(rowIndex, colIndex);
              const isSelected = isCellSelected(rowIndex, colIndex);
              const canMove = currentPlayer === playerColor && gameStatus === 'playing';

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`
                    w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20
                    ${cellColor}
                    ${isSelected ? 'ring-4 ring-accent-cyan' : ''}
                    ${isHighlighted ? 'ring-2 ring-accent-orange' : ''}
                    ${canMove && cell && cell.color === playerColor ? 'cursor-pointer hover:opacity-80' : ''}
                    ${canMove && isHighlighted ? 'cursor-pointer hover:bg-accent-orange/30' : ''}
                    ${!canMove ? 'cursor-not-allowed opacity-50' : ''}
                    transition-all duration-200
                    flex items-center justify-center
                    relative
                  `}
                >
                  {cell && renderPiece(cell)}
                  {isHighlighted && !cell && (
                    <div className="absolute w-3 h-3 bg-accent-orange rounded-full"></div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-400">
        <p>Turno: {currentPlayer === 'white' ? 'Brancas' : 'Pretas'}</p>
      </div>
    </div>
  );
}

