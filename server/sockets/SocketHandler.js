/**
 * Handler de Socket.IO
 * Gerencia todas as conexões e eventos em tempo real
 */
export default class SocketHandler {
  constructor(io, gameController) {
    this.io = io;
    this.gameController = gameController;
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log(`✅ Cliente conectado: ${socket.id}`);

      // Criar sala
      socket.on('create-room', (nickname) => {
        const roomId = this.gameController.createRoom();
        const game = this.gameController.getGame(roomId);
        socket.join(roomId);
        
        // Adiciona o jogador que criou a sala
        const color = this.gameController.addPlayerToRoom(roomId, socket.id, nickname);
        console.log(`🏠 Sala criada: ${roomId} por ${nickname} (${color})`);
        
        socket.emit('room-created', { roomId });
        
        // Envia o estado atual do jogo (aguardando segundo jogador)
        const gameState = game.getState();
        gameState.roomId = roomId;
        socket.emit('game-state', gameState);
      });

      // Entrar em sala
      socket.on('join-room', ({ roomId, nickname }) => {
        if (!this.gameController.roomExists(roomId)) {
          socket.emit('room-error', { message: 'Sala não encontrada' });
          return;
        }

        const game = this.gameController.getGame(roomId);
        if (game.gameStatus === 'playing' && game.players.white && game.players.black) {
          socket.emit('room-error', { message: 'Sala cheia' });
          return;
        }

        socket.join(roomId);
        const color = this.gameController.addPlayerToRoom(roomId, socket.id, nickname);

        if (color) {
          socket.emit('room-joined', { roomId, color, nickname });
          
          // Se ambos os jogadores estão na sala, inicia o jogo
          if (game.canStart()) {
            game.start();
            this.io.to(roomId).emit('game-started', game.getState());
            console.log(`🎮 Jogo iniciado na sala: ${roomId}`);
          } else {
            // Notifica o jogador que está aguardando
            this.io.to(roomId).emit('game-state', game.getState());
          }
        } else {
          socket.emit('room-error', { message: 'Sala cheia' });
        }
      });

      // Fazer movimento
      socket.on('make-move', ({ from, to }) => {
        const roomId = this.gameController.getPlayerRoom(socket.id);
        if (!roomId) {
          socket.emit('move-error', { message: 'Você não está em uma sala' });
          return;
        }

        const game = this.gameController.getGame(roomId);
        if (!game || game.gameStatus !== 'playing') {
          socket.emit('move-error', { message: 'Jogo não está em andamento' });
          return;
        }

        // Determina a cor do jogador
        let playerColor = null;
        if (game.players.white?.id === socket.id) {
          playerColor = 'white';
        } else if (game.players.black?.id === socket.id) {
          playerColor = 'black';
        } else {
          socket.emit('move-error', { message: 'Você não é um jogador nesta partida' });
          return;
        }

        // Valida e executa o movimento
        const result = game.makeMove(from, to, playerColor);

        if (result.valid) {
          // Envia atualização para todos na sala
          const gameState = game.getState();
          gameState.roomId = roomId;
          this.io.to(roomId).emit('move-made', {
            from,
            to,
            captured: result.captured,
            mustContinue: result.mustContinue,
            gameState: gameState
          });

          // Se há captura obrigatória e o jogador deve continuar
          if (result.mustContinue) {
            socket.emit('must-continue-capture', { from: { row: to.row, col: to.col } });
          }
        } else {
          socket.emit('move-error', { message: result.error });
        }
      });

      // Reiniciar partida
      socket.on('reset-game', () => {
        const roomId = this.gameController.getPlayerRoom(socket.id);
        if (!roomId) return;

        const game = this.gameController.getGame(roomId);
        if (game) {
          game.reset();
          const gameState = game.getState();
          gameState.roomId = roomId;
          this.io.to(roomId).emit('game-reset', gameState);
        }
      });

      // Solicitar estado do jogo
      socket.on('get-game-state', ({ roomId }) => {
        const game = this.gameController.getGame(roomId);
        if (game) {
          const gameState = game.getState();
          gameState.roomId = roomId;
          socket.emit('game-state', gameState);
          console.log(`📡 Estado do jogo enviado para ${socket.id} na sala ${roomId}`);
        }
      });

      // Sair da sala
      socket.on('leave-room', ({ roomId }) => {
        console.log(`🚪 Jogador ${socket.id} saiu da sala ${roomId}`);
        socket.leave(roomId);
        this.gameController.removePlayer(socket.id);
      });

      // Desconexão
      socket.on('disconnect', () => {
        console.log(`❌ Cliente desconectado: ${socket.id}`);
        const roomId = this.gameController.removePlayer(socket.id);
        if (roomId) {
          const game = this.gameController.getGame(roomId);
          if (game) {
            this.io.to(roomId).emit('player-disconnected', {
              message: 'Um jogador desconectou. Aguardando reconexão...'
            });
          }
        }
      });
    });
  }
}

