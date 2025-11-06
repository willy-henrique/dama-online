import Game from '../models/Game.js';

/**
 * Controlador de Jogos
 * Gerencia múltiplas partidas simultâneas
 */
export default class GameController {
  constructor() {
    this.games = new Map(); // roomId -> Game
    this.playerToRoom = new Map(); // playerId -> roomId
  }

  /**
   * Cria uma nova sala de jogo
   */
  createRoom() {
    const roomId = this.generateRoomId();
    const game = new Game(roomId);
    this.games.set(roomId, game);
    return roomId;
  }

  /**
   * Gera um ID único para a sala
   */
  generateRoomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomId = '';
    for (let i = 0; i < 6; i++) {
      roomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Garante que o ID é único
    if (this.games.has(roomId)) {
      return this.generateRoomId();
    }
    
    return roomId;
  }

  /**
   * Verifica se uma sala existe
   */
  roomExists(roomId) {
    return this.games.has(roomId);
  }

  /**
   * Obtém um jogo por roomId
   */
  getGame(roomId) {
    return this.games.get(roomId);
  }

  /**
   * Adiciona um jogador a uma sala
   */
  addPlayerToRoom(roomId, playerId, nickname) {
    const game = this.getGame(roomId);
    if (!game) return null;

    const color = game.addPlayer(playerId, nickname);
    if (color) {
      this.playerToRoom.set(playerId, roomId);
    }
    return color;
  }

  /**
   * Remove um jogador de uma sala
   */
  removePlayer(playerId) {
    const roomId = this.playerToRoom.get(playerId);
    if (roomId) {
      const game = this.getGame(roomId);
      if (game) {
        game.removePlayer(playerId);
        // Se não há mais jogadores, remove a sala após um tempo
        if (!game.players.white && !game.players.black) {
          setTimeout(() => {
            if (!game.players.white && !game.players.black) {
              this.games.delete(roomId);
            }
          }, 60000); // Remove após 1 minuto
        }
      }
      this.playerToRoom.delete(playerId);
    }
    return roomId;
  }

  /**
   * Obtém a sala de um jogador
   */
  getPlayerRoom(playerId) {
    return this.playerToRoom.get(playerId);
  }

  /**
   * Limpa salas vazias
   */
  cleanupEmptyRooms() {
    for (const [roomId, game] of this.games.entries()) {
      if (!game.players.white && !game.players.black) {
        this.games.delete(roomId);
      }
    }
  }
}

