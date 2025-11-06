/**
 * Utilitários de lógica do jogo de damas
 */

/**
 * Obtém todas as capturas possíveis para um jogador
 */
export function getPossibleCaptures(board, playerColor) {
  const captures = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === playerColor) {
        const pieceCaptures = getCapturesForPiece(board, row, col, playerColor);
        captures.push(...pieceCaptures);
      }
    }
  }

  return captures;
}

/**
 * Obtém capturas possíveis para uma peça específica
 */
export function getCapturesForPiece(board, row, col, playerColor) {
  const captures = [];
  const piece = board[row][col];
  if (!piece || piece.color !== playerColor) return captures;

  const directions = piece.type === 'king' 
    ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    : playerColor === 'white' 
      ? [[-1, -1], [-1, 1]]
      : [[1, -1], [1, 1]];

  for (const [dr, dc] of directions) {
    if (piece.type === 'king') {
      // Dama pode capturar em múltiplas casas de distância
      let checkRow = row + dr;
      let checkCol = col + dc;
      let foundEnemy = false;
      let enemyRow = -1;
      let enemyCol = -1;
      
      // Procura por uma peça inimiga na direção
      while (isValidPosition(checkRow, checkCol)) {
        if (board[checkRow][checkCol] !== null) {
          if (board[checkRow][checkCol].color === playerColor) {
            // Encontrou peça própria, para a busca
            break;
          } else {
            // Encontrou peça inimiga
            foundEnemy = true;
            enemyRow = checkRow;
            enemyCol = checkCol;
            break;
          }
        }
        checkRow += dr;
        checkCol += dc;
      }
      
      // Se encontrou peça inimiga, verifica se pode pular sobre ela
      if (foundEnemy) {
        const jumpRow = enemyRow + dr;
        const jumpCol = enemyCol + dc;
        
        // Continua procurando casas livres após a captura
        let currentJumpRow = jumpRow;
        let currentJumpCol = jumpCol;
        
        while (isValidPosition(currentJumpRow, currentJumpCol) && 
               board[currentJumpRow][currentJumpCol] === null) {
          captures.push({
            from: { row, col },
            to: { row: currentJumpRow, col: currentJumpCol },
            captured: { row: enemyRow, col: enemyCol }
          });
          currentJumpRow += dr;
          currentJumpCol += dc;
        }
      }
    } else {
      // Peça normal só captura pulando uma casa
      const jumpRow = row + dr * 2;
      const jumpCol = col + dc * 2;
      const middleRow = row + dr;
      const middleCol = col + dc;

      if (isValidPosition(jumpRow, jumpCol) && 
          board[jumpRow][jumpCol] === null &&
          isValidPosition(middleRow, middleCol) &&
          board[middleRow][middleCol] !== null &&
          board[middleRow][middleCol].color !== playerColor) {
        captures.push({
          from: { row, col },
          to: { row: jumpRow, col: jumpCol },
          captured: { row: middleRow, col: middleCol }
        });
      }
    }
  }

  return captures;
}

/**
 * Obtém movimentos simples possíveis para uma peça
 */
export function getSimpleMovesForPiece(board, row, col, playerColor) {
  const moves = [];
  const piece = board[row][col];
  if (!piece || piece.color !== playerColor) return moves;

  const directions = piece.type === 'king' 
    ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    : playerColor === 'white' 
      ? [[-1, -1], [-1, 1]]
      : [[1, -1], [1, 1]];

  for (const [dr, dc] of directions) {
    if (piece.type === 'king') {
      // Dama pode se mover múltiplas casas em qualquer diagonal
      let newRow = row + dr;
      let newCol = col + dc;
      
      while (isValidPosition(newRow, newCol) && board[newRow][newCol] === null) {
        moves.push({
          from: { row, col },
          to: { row: newRow, col: newCol }
        });
        newRow += dr;
        newCol += dc;
      }
    } else {
      // Peça normal só se move uma casa
      const newRow = row + dr;
      const newCol = col + dc;

      if (isValidPosition(newRow, newCol) && 
          board[newRow][newCol] === null) {
        moves.push({
          from: { row, col },
          to: { row: newRow, col: newCol }
        });
      }
    }
  }

  return moves;
}

/**
 * Obtém todos os movimentos válidos para uma peça
 */
export function getValidMoves(board, row, col, playerColor, mustContinueCapture = null) {
  const piece = board[row][col];
  if (!piece || piece.color !== playerColor) return [];

  // Se há captura obrigatória, só retorna capturas da peça específica
  if (mustContinueCapture) {
    const fromPos = mustContinueCapture.from;
    if (row === fromPos.row && col === fromPos.col) {
      return getCapturesForPiece(board, row, col, playerColor);
    }
    return [];
  }

  // Verifica se há capturas obrigatórias no tabuleiro
  const allCaptures = getPossibleCaptures(board, playerColor);
  if (allCaptures.length > 0) {
    // Só retorna capturas desta peça específica
    return getCapturesForPiece(board, row, col, playerColor);
  }

  // Se não há capturas, retorna movimentos simples
  return getSimpleMovesForPiece(board, row, col, playerColor);
}

/**
 * Verifica se uma posição é válida
 */
export function isValidPosition(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

/**
 * Verifica se um movimento é válido
 */
export function isValidMove(board, from, to, playerColor, mustContinueCapture = null) {
  const moves = getValidMoves(board, from.row, from.col, playerColor, mustContinueCapture);
  return moves.some(move => move.to.row === to.row && move.to.col === to.col);
}

