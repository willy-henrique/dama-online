export default function Piece({ piece, isSelected }) {
  if (!piece) return null;

  const baseClasses = `
    w-full h-full
    rounded-full
    border-2
    flex items-center justify-center
    transition-all duration-200
    shadow-lg
  `;
  
  const colorClasses = piece.color === 'white'
    ? 'bg-white border-gray-300'
    : 'bg-gray-900 border-gray-700';
  
  const kingClasses = piece.type === 'king'
    ? 'ring-2 ring-yellow-400 ring-offset-1'
    : '';
  
  const selectedClasses = isSelected
    ? 'ring-2 ring-accent-cyan scale-110'
    : '';

  return (
    <div className={`${baseClasses} ${colorClasses} ${kingClasses} ${selectedClasses}`}>
      {/* Coroa para dama */}
      {piece.type === 'king' && (
        <div className={`
          w-3 h-3 sm:w-4 sm:h-4
          rounded-full
          ${piece.color === 'white' ? 'bg-yellow-400' : 'bg-yellow-500'}
          shadow-inner
        `}></div>
      )}
    </div>
  );
}

