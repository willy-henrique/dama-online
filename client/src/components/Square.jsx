import { isDarkSquare } from '../utils/helpers';
import Piece from './Piece';

export default function Square({ 
  row, 
  col, 
  piece, 
  isSelected, 
  isHighlighted, 
  isValidMove, 
  isLastMove,
  isLastMoveFrom,
  isLastMoveTo,
  canMove,
  onClick 
}) {
  const isDark = isDarkSquare(row, col);
  
  const baseClasses = `
    w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20
    flex items-center justify-center
    transition-all duration-200
    relative
    touch-none select-none
  `;
  
  const colorClasses = isDark 
    ? 'bg-amber-800' 
    : 'bg-amber-100';
  
  const interactiveClasses = canMove && (piece || isValidMove)
    ? 'cursor-pointer hover:opacity-80 active:scale-95'
    : canMove
    ? 'cursor-not-allowed opacity-50'
    : '';
  
  const selectedClasses = isSelected
    ? 'ring-2 sm:ring-4 ring-accent-cyan ring-offset-1'
    : '';
  
  const highlightedClasses = isHighlighted
    ? 'ring-1 sm:ring-2 ring-accent-orange'
    : '';
  
  // Destaque para o último movimento do oponente
  const lastMoveClasses = isLastMove
    ? isLastMoveFrom
      ? 'ring-2 sm:ring-3 ring-blue-400 ring-offset-1 bg-blue-500/20'
      : isLastMoveTo
      ? 'ring-2 sm:ring-3 ring-green-400 ring-offset-1 bg-green-500/20'
      : ''
    : '';

  return (
    <div
      className={`
        ${baseClasses}
        ${colorClasses}
        ${selectedClasses}
        ${highlightedClasses}
        ${lastMoveClasses}
        ${interactiveClasses}
      `}
      onClick={onClick}
    >
      {piece && (
        <Piece 
          piece={piece} 
          isSelected={isSelected}
        />
      )}
      {/* Indicador de movimento válido */}
      {isValidMove && !piece && (
        <div className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-accent-orange rounded-full animate-pulse"></div>
      )}
      {/* Indicador visual do último movimento */}
      {isLastMoveFrom && !piece && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-400 rounded-full animate-pulse"></div>
        </div>
      )}
      {isLastMoveTo && !piece && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-green-400 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
}

