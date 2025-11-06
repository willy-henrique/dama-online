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
    const isCapture = Math.abs(to.row - from.row) === 2 && Math.abs(to.col - from.col) === 2;

    if (possibleCaptures.length > 0 && !isCapture) {
      return { valid: false, error: 'Captura obrigatória' };
    }

    // Valida movimento de captura
    if (isCapture) {
      const middleRow = (from.row + to.row) / 2;
      const middleCol = (from.col + to.col) / 2;
      const middlePiece = this.board[middleRow][middleCol];

      if (!middlePiece || middlePiece.color === playerColor) {
        return { valid: false, error: 'Captura inválida' };
      }

      // Executa captura
      this.board[middleRow][middleCol] = null;
      this.board[to.row][to.col] = piece;
      this.board[from.row][from.col] = null;

      // Verifica promoção
      this.checkPromotion(to.row, to.col, playerColor);

      // Verifica se há mais capturas possíveis
      const moreCaptures = this.getCapturesForPiece(to.row, to.col, playerColor);
      if (moreCaptures.length > 0) {
        this.lastMove = { from, to, captured: { row: middleRow, col: middleCol } };
        return { valid: true, mustContinue: true, captured: { row: middleRow, col: middleCol } };
      }

      // Troca de turno
      this.currentPlayer = playerColor === 'white' ? 'black' : 'white';
      this.lastMove = { from, to, captured: { row: middleRow, col: middleCol } };
      return { valid: true, captured: { row: middleRow, col: middleCol } };
    }

    // Valida movimento simples
    const rowDiff = to.row - from.row;
    const colDiff = Math.abs(to.col - from.col);

    if (piece.type === 'pawn') {
      const validDirection = playerColor === 'white' ? rowDiff === -1 : rowDiff === 1;
      if (!validDirection || colDiff !== 1) {
        return { valid: false, error: 'Movimento inválido' };
      }
    } else {
      // Dama pode se mover em qualquer diagonal
      if (Math.abs(rowDiff) !== Math.abs(colDiff)) {
        return { valid: false, error: 'Movimento inválido' };
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

