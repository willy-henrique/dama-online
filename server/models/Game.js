/**
 * Modelo de Jogo de Damas
 * Gerencia o estado do tabuleiro e valida movimentos
 */
export default class Game {
  constructor(roomId) {
    this.roomId = roomId;
    this.board = this.initializeBoard();
    this.currentPlayer = 'white'; // 'white' ou 'black'
    this.players = {
      white: null,
      black: null
    };
    this.gameStatus = 'waiting'; // 'waiting', 'playing', 'finished'
    this.winner = null;
    this.lastMove = null;
  }

  /**
   * Inicializa o tabuleiro 8x8 com peças nas posições iniciais
   */
  initializeBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));

    // Peças pretas (topo)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = { type: 'pawn', color: 'black' };
        }
      }
    }

    // Peças brancas (base)
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = { type: 'pawn', color: 'white' };
        }
      }
    }

    return board;
  }

  /**
   * Adiciona um jogador ao jogo
   */
  addPlayer(playerId, nickname) {
    if (!this.players.white) {
      this.players.white = { id: playerId, nickname };
      return 'white';
    } else if (!this.players.black) {
      this.players.black = { id: playerId, nickname };
      return 'black';
    }
    return null;
  }

  /**
   * Remove um jogador do jogo
   */
  removePlayer(playerId) {
    if (this.players.white?.id === playerId) {
      this.players.white = null;
    }
    if (this.players.black?.id === playerId) {
      this.players.black = null;
    }
  }

  /**
   * Verifica se o jogo pode começar
   */
  canStart() {
    return this.players.white && this.players.black && this.gameStatus === 'waiting';
  }

  /**
   * Inicia o jogo
   */
  start() {
    if (this.canStart()) {
      this.gameStatus = 'playing';
      this.currentPlayer = 'white';
      return true;
    }
    return false;
  }

  /**
   * Obtém todas as capturas possíveis para um jogador
   */
  getPossibleCaptures(playerColor) {
    const captures = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === playerColor) {
          const pieceCaptures = this.getCapturesForPiece(row, col, playerColor);
          captures.push(...pieceCaptures);
        }
      }
    }

    return captures;
  }

  /**
   * Obtém capturas possíveis para uma peça específica
   */
  getCapturesForPiece(row, col, playerColor) {
    const captures = [];
    const piece = this.board[row][col];
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
        while (this.isValidPosition(checkRow, checkCol)) {
          if (this.board[checkRow][checkCol] !== null) {
            if (this.board[checkRow][checkCol].color === playerColor) {
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
          
          while (this.isValidPosition(currentJumpRow, currentJumpCol) && 
                 this.board[currentJumpRow][currentJumpCol] === null) {
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

        if (this.isValidPosition(jumpRow, jumpCol) && 
            this.board[jumpRow][jumpCol] === null &&
            this.isValidPosition(middleRow, middleCol) &&
            this.board[middleRow][middleCol] !== null &&
            this.board[middleRow][middleCol].color !== playerColor) {
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
  getSimpleMovesForPiece(row, col, playerColor) {
    const moves = [];
    const piece = this.board[row][col];
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
        
        while (this.isValidPosition(newRow, newCol) && this.board[newRow][newCol] === null) {
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

        if (this.isValidPosition(newRow, newCol) && 
            this.board[newRow][newCol] === null) {
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
   * Valida e executa um movimento
   */
  makeMove(from, to, playerColor) {
    // Verifica se é o turno do jogador
    if (this.currentPlayer !== playerColor) {
      return { valid: false, error: 'Não é seu turno' };
    }

    // Verifica se a posição de origem tem uma peça válida
    const piece = this.board[from.row][from.col];
    if (!piece || piece.color !== playerColor) {
      return { valid: false, error: 'Peça inválida' };
    }

    // Verifica se há capturas obrigatórias
    const possibleCaptures = this.getPossibleCaptures(playerColor);
    
    // Verifica se é uma captura (movimento diagonal de mais de 1 casa ou exatamente 2 casas)
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    const isCapture = (piece.type === 'king' && rowDiff >= 2 && rowDiff === colDiff) ||
                      (piece.type === 'pawn' && rowDiff === 2 && colDiff === 2);

    if (possibleCaptures.length > 0 && !isCapture) {
      // Verifica se o movimento está na lista de capturas válidas
      const isValidCapture = possibleCaptures.some(capture => 
        capture.from.row === from.row && 
        capture.from.col === from.col &&
        capture.to.row === to.row && 
        capture.to.col === to.col
      );
      
      if (!isValidCapture) {
        return { valid: false, error: 'Captura obrigatória' };
      }
    }

    // Valida movimento de captura
    if (isCapture) {
      // Para damas, encontra a peça capturada no caminho
      let capturedRow = -1;
      let capturedCol = -1;
      let foundEnemy = false;
      
      const rowStep = to.row > from.row ? 1 : -1;
      const colStep = to.col > from.col ? 1 : -1;
      let checkRow = from.row + rowStep;
      let checkCol = from.col + colStep;
      
      // Procura pela peça inimiga no caminho
      while (checkRow !== to.row && checkCol !== to.col) {
        if (this.board[checkRow][checkCol] !== null) {
          if (this.board[checkRow][checkCol].color === playerColor) {
            return { valid: false, error: 'Não pode capturar peça própria' };
          } else {
            if (foundEnemy) {
              return { valid: false, error: 'Só pode capturar uma peça por vez' };
            }
            foundEnemy = true;
            capturedRow = checkRow;
            capturedCol = checkCol;
          }
        }
        checkRow += rowStep;
        checkCol += colStep;
      }
      
      // Verifica se a captura é válida
      if (!foundEnemy) {
        return { valid: false, error: 'Captura inválida - nenhuma peça no caminho' };
      }
      
      // Verifica se o movimento está na lista de capturas válidas
      const isValidCaptureMove = possibleCaptures.some(capture => 
        capture.from.row === from.row && 
        capture.from.col === from.col &&
        capture.to.row === to.row && 
        capture.to.col === to.col &&
        capture.captured.row === capturedRow &&
        capture.captured.col === capturedCol
      );
      
      if (possibleCaptures.length > 0 && !isValidCaptureMove) {
        return { valid: false, error: 'Captura inválida' };
      }

      // Executa captura
      this.board[capturedRow][capturedCol] = null;
      this.board[to.row][to.col] = piece;
      this.board[from.row][from.col] = null;

      // Verifica promoção
      this.checkPromotion(to.row, to.col, playerColor);

      // Verifica se há mais capturas possíveis
      const moreCaptures = this.getCapturesForPiece(to.row, to.col, playerColor);
      if (moreCaptures.length > 0) {
        this.lastMove = { from, to, captured: { row: capturedRow, col: capturedCol } };
        return { valid: true, mustContinue: true, captured: { row: capturedRow, col: capturedCol } };
      }

      // Troca de turno
      this.currentPlayer = playerColor === 'white' ? 'black' : 'white';
      this.lastMove = { from, to, captured: { row: capturedRow, col: capturedCol } };
      return { valid: true, captured: { row: capturedRow, col: capturedCol } };
    }

    // Valida movimento simples
    const simpleRowDiff = to.row - from.row;
    const simpleColDiff = to.col - from.col;

    if (piece.type === 'pawn') {
      const validDirection = playerColor === 'white' ? simpleRowDiff === -1 : simpleRowDiff === 1;
      if (!validDirection || Math.abs(simpleColDiff) !== 1) {
        return { valid: false, error: 'Movimento inválido' };
      }
    } else {
      // Dama pode se mover em qualquer diagonal (múltiplas casas)
      if (Math.abs(simpleRowDiff) !== Math.abs(simpleColDiff)) {
        return { valid: false, error: 'Movimento inválido' };
      }
      
      // Verifica se o caminho está livre
      const rowStep = simpleRowDiff > 0 ? 1 : -1;
      const colStep = simpleColDiff > 0 ? 1 : -1;
      let checkRow = from.row + rowStep;
      let checkCol = from.col + colStep;
      
      while (checkRow !== to.row && checkCol !== to.col) {
        if (this.board[checkRow][checkCol] !== null) {
          return { valid: false, error: 'Caminho bloqueado' };
        }
        checkRow += rowStep;
        checkCol += colStep;
      }
    }

    // Executa movimento simples
    this.board[to.row][to.col] = piece;
    this.board[from.row][from.col] = null;

    // Verifica promoção
    this.checkPromotion(to.row, to.col, playerColor);

    // Troca de turno
    this.currentPlayer = playerColor === 'white' ? 'black' : 'white';
    this.lastMove = { from, to };

    // Verifica fim de jogo
    this.checkGameOver();

    return { valid: true };
  }

  /**
   * Verifica e promove peça a dama
   */
  checkPromotion(row, col, playerColor) {
    const piece = this.board[row][col];
    if (piece && piece.type === 'pawn') {
      if ((playerColor === 'white' && row === 0) || 
          (playerColor === 'black' && row === 7)) {
        piece.type = 'king';
      }
    }
  }

  /**
   * Verifica se a posição é válida
   */
  isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  /**
   * Verifica se o jogo acabou
   */
  checkGameOver() {
    const whitePieces = this.countPieces('white');
    const blackPieces = this.countPieces('black');
    const whiteMoves = this.hasValidMoves('white');
    const blackMoves = this.hasValidMoves('black');

    if (whitePieces === 0 || !whiteMoves) {
      this.gameStatus = 'finished';
      this.winner = 'black';
    } else if (blackPieces === 0 || !blackMoves) {
      this.gameStatus = 'finished';
      this.winner = 'white';
    }
  }

  /**
   * Conta peças de uma cor
   */
  countPieces(color) {
    let count = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col]?.color === color) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * Verifica se há movimentos válidos para uma cor
   */
  hasValidMoves(color) {
    const captures = this.getPossibleCaptures(color);
    if (captures.length > 0) return true;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === color) {
          const moves = this.getSimpleMovesForPiece(row, col, color);
          if (moves.length > 0) return true;
        }
      }
    }

    return false;
  }

  /**
   * Reinicia o jogo
   */
  reset() {
    this.board = this.initializeBoard();
    this.currentPlayer = 'white';
    this.gameStatus = 'playing';
    this.winner = null;
    this.lastMove = null;
  }

  /**
   * Retorna o estado do jogo para serialização
   */
  getState() {
    return {
      roomId: this.roomId,
      board: this.board,
      currentPlayer: this.currentPlayer,
      players: this.players,
      gameStatus: this.gameStatus,
      winner: this.winner,
      lastMove: this.lastMove
    };
  }
}

