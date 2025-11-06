/**
 * Utilitários para o jogo de damas
 */

/**
 * Verifica se uma casa é escura (onde as peças podem ficar)
 */
export const isDarkSquare = (row, col) => {
  return (row + col) % 2 === 1;
};

/**
 * Converte coordenadas de exibição para coordenadas reais (para tabuleiro invertido)
 */
export const getActualCoordinates = (displayRow, displayCol, isFlipped) => {
  if (isFlipped) {
    return {
      row: 7 - displayRow,
      col: 7 - displayCol
    };
  }
  return {
    row: displayRow,
    col: displayCol
  };
};

/**
 * Converte coordenadas reais para coordenadas de exibição
 */
export const getDisplayCoordinates = (actualRow, actualCol, isFlipped) => {
  if (isFlipped) {
    return {
      row: 7 - actualRow,
      col: 7 - actualCol
    };
  }
  return {
    row: actualRow,
    col: actualCol
  };
};

/**
 * Formata o nome da cor
 */
export const formatColorName = (color) => {
  return color === 'white' ? 'Brancas' : 'Pretas';
};

/**
 * Verifica se é o turno do jogador
 */
export const isMyTurn = (currentTurn, myColor) => {
  return currentTurn === myColor;
};

/**
 * Verifica se uma peça pertence ao jogador
 */
export const isMyPiece = (piece, myColor) => {
  return piece && piece.color === myColor;
};

/**
 * Verifica se uma posição está nos movimentos válidos
 */
export const isValidMove = (row, col, legalMoves) => {
  return legalMoves.some(move => move.to.row === row && move.to.col === col);
};

/**
 * Obtém o movimento válido para uma posição
 */
export const getValidMove = (row, col, legalMoves) => {
  return legalMoves.find(move => move.to.row === row && move.to.col === col);
};

