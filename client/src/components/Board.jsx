import { useState, useEffect } from 'react';
import Square from './Square';
import Piece from './Piece';
import { useGameStore } from '../store/useGameStore';
import { getValidMoves } from '../utils/gameLogic';
import { 
  getActualCoordinates, 
  isValidMove as isValidMoveHelper,
  getValidMove,
  isMyPiece 
} from '../utils/helpers';

export default function Board() {
  const {
    board,
    turn,
    myColor,
    selected,
    legalMoves,
    mustContinueCapture,
    gameStatus,
    lastMove,
    setSelected,
    setLegalMoves,
    clearSelection
  } = useGameStore();

  const isFlipped = myColor === 'black';
  const canMove = gameStatus === 'playing' && turn === myColor;

  // Atualiza movimentos válidos quando uma peça é selecionada
  useEffect(() => {
    if (selected && board.length > 0) {
      const moves = getValidMoves(
        board,
        selected.row,
        selected.col,
        turn,
        mustContinueCapture
      );
      setLegalMoves(moves);
    } else {
      setLegalMoves([]);
    }
  }, [selected, board, turn, mustContinueCapture, setLegalMoves]);

  const handleSquareClick = (displayRow, displayCol) => {
    if (!canMove || gameStatus !== 'playing') return;

    const { row, col } = getActualCoordinates(displayRow, displayCol, isFlipped);
    const piece = board[row]?.[col];

    // Se clicou em uma peça do jogador
    if (piece && isMyPiece(piece, myColor)) {
      // Se há captura obrigatória, só permite selecionar a peça que deve continuar
      if (mustContinueCapture) {
        if (row === mustContinueCapture.from.row && col === mustContinueCapture.from.col) {
          setSelected({ row, col, piece });
        }
      } else {
        setSelected({ row, col, piece });
      }
      return;
    }

    // Se há uma peça selecionada e clicou em uma célula válida
    if (selected) {
      const move = getValidMove(row, col, legalMoves);
      
      if (move) {
        // Emite o movimento via socket (será tratado no Game.jsx)
        const event = new CustomEvent('make-move', {
          detail: {
            from: { row: selected.row, col: selected.col },
            to: { row, col }
          }
        });
        window.dispatchEvent(event);
        
        clearSelection();
      } else {
        // Clicou em célula inválida, deseleciona
        clearSelection();
      }
    }
  };

  if (!board || board.length === 0) {
    return (
      <div className="bg-dark-800 rounded-xl p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-cyan mx-auto mb-2"></div>
        <p className="text-gray-400">Carregando tabuleiro...</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-dark-700">
      <div className="flex justify-center p-2 sm:p-4">
        <div className="grid grid-cols-8 gap-0 border-2 sm:border-4 border-dark-700 shadow-2xl max-w-full aspect-square">
          {Array.from({ length: 8 }, (_, displayRow) =>
            Array.from({ length: 8 }, (_, displayCol) => {
              const { row, col } = getActualCoordinates(displayRow, displayCol, isFlipped);
              const cell = board[row]?.[col];
              const isSelectedCell = selected && selected.row === row && selected.col === col;
              const isValidMoveCell = isValidMoveHelper(row, col, legalMoves);
              
              // Verifica se esta célula faz parte do último movimento do oponente
              // Só mostra quando é meu turno (ou seja, o último movimento foi do oponente)
              const isOpponentMove = lastMove && turn === myColor;
              const isLastMoveFrom = isOpponentMove && lastMove.from.row === row && lastMove.from.col === col;
              const isLastMoveTo = isOpponentMove && lastMove.to.row === row && lastMove.to.col === col;
              const isLastMove = isLastMoveFrom || isLastMoveTo;
              
              return (
                <Square
                  key={`${displayRow}-${displayCol}`}
                  row={displayRow}
                  col={displayCol}
                  piece={cell}
                  isSelected={isSelectedCell}
                  isHighlighted={isValidMoveCell}
                  isValidMove={isValidMoveCell}
                  isLastMove={isLastMove}
                  isLastMoveFrom={isLastMoveFrom}
                  isLastMoveTo={isLastMoveTo}
                  canMove={canMove}
                  onClick={() => handleSquareClick(displayRow, displayCol)}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="mt-2 sm:mt-4 text-center text-xs sm:text-sm text-gray-400">
        <p>Turno: {turn === 'white' ? 'Brancas' : 'Pretas'}</p>
        {myColor && (
          <p className="mt-1 text-accent-cyan">
            Você joga com: {myColor === 'white' ? 'Brancas' : 'Pretas'}
          </p>
        )}
      </div>
    </div>
  );
}

