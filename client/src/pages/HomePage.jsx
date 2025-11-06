import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

// Configuração do Socket.IO para pular aviso do ngrok
const socketOptions = {
  transports: ['websocket', 'polling'],
  extraHeaders: {
    'ngrok-skip-browser-warning': 'true'
  }
};

export default function HomePage({ socket, onCreateRoom, onJoinRoom, onBackToHome }) {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState(null); // 'create' ou 'join'
  const [createdRoomId, setCreatedRoomId] = useState(null);
  const [joinedRoomId, setJoinedRoomId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Carrega nickname do localStorage
    const savedNickname = localStorage.getItem('dama-nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }

    if (!socket) return;

    socket.on('room-created', ({ roomId }) => {
      console.log('✅ Sala criada! Room ID:', roomId);
      if (roomId) {
        setCreatedRoomId(roomId);
        // Não chama onCreateRoom aqui, deixa mostrar o ID primeiro
      }
    });

    socket.on('room-joined', ({ roomId, color, nickname }) => {
      console.log('✅ Entrou na sala! Room:', roomId, 'Color:', color);
      setJoinedRoomId(roomId);
      // Quando alguém entrar na sala, vai para o jogo imediatamente
      onJoinRoom(roomId, color, nickname);
    });

    socket.on('game-started', (gameState) => {
      console.log('🎮 Jogo iniciado!', gameState);
      console.log('Socket ID:', socket.id);
      // Quando o jogo começar (2 jogadores), ambos vão para a página do jogo
      const currentRoomId = createdRoomId || joinedRoomId;
      if (currentRoomId) {
        // Determina a cor do jogador baseado no socket.id
        const playerColor = gameState.players.white?.id === socket.id ? 'white' : 
                           gameState.players.black?.id === socket.id ? 'black' : null;
        
        if (playerColor) {
          console.log('🎯 Jogador identificado:', playerColor);
          if (createdRoomId) {
            // Jogador que criou a sala
            onCreateRoom(createdRoomId);
          } else {
            // Jogador que entrou na sala
            onJoinRoom(currentRoomId, playerColor, nickname);
          }
        } else {
          console.error('❌ Não foi possível identificar a cor do jogador');
        }
      }
    });

    socket.on('room-error', ({ message }) => {
      setError(message);
    });

    return () => {
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('room-error');
      socket.off('game-started');
    };
  }, [socket, onCreateRoom, onJoinRoom]);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Digite um nickname');
      return;
    }
    
    if (!socket) {
      setError('Aguardando conexão com o servidor...');
      console.error('Socket não está disponível');
      return;
    }

    if (!socket.connected) {
      setError('Não conectado ao servidor. Aguarde...');
      console.error('Socket não está conectado. Status:', socket.connected);
      return;
    }

    console.log('🔄 Criando sala para:', nickname);
    console.log('Socket conectado?', socket.connected);
    localStorage.setItem('dama-nickname', nickname);
    setError('');
    socket.emit('create-room', nickname);
    console.log('📤 Evento create-room enviado');
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Digite um nickname');
      return;
    }
    if (!roomId.trim()) {
      setError('Digite o código da sala');
      return;
    }
    localStorage.setItem('dama-nickname', nickname);
    setError('');
    socket.emit('join-room', { roomId: roomId.toUpperCase(), nickname });
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(createdRoomId);
    // Melhor feedback visual
    const button = document.activeElement;
    const originalText = button.textContent;
    button.textContent = '✓ Copiado!';
    button.classList.add('bg-green-500');
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('bg-green-500');
    }, 2000);
  };

  const handleLeaveRoom = () => {
    if (socket && createdRoomId) {
      // Sai da sala no servidor
      socket.emit('leave-room', { roomId: createdRoomId });
    }
    setCreatedRoomId(null);
    setJoinedRoomId(null);
    setMode(null);
    if (onBackToHome) {
      onBackToHome();
    }
  };

  if (createdRoomId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
        <div className="bg-dark-800 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-md w-full border border-dark-700">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <button
              onClick={handleLeaveRoom}
              className="text-gray-400 hover:text-white transition text-sm sm:text-base flex items-center gap-1"
            >
              ← Sair da Sala
            </button>
            <p className="text-xs text-gray-500">WillTech - Solução web</p>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-accent-cyan">
            Sala Criada!
          </h2>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Código da Sala
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={createdRoomId}
                  readOnly
                  className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-lg sm:text-2xl font-bold text-center text-accent-cyan tracking-wider"
                />
                <button
                  onClick={copyRoomId}
                  className="px-4 py-2 sm:py-3 bg-accent-cyan text-dark-900 rounded-lg font-semibold hover:bg-accent-cyan/80 transition text-sm sm:text-base"
                >
                  Copiar
                </button>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-400 text-center mb-3 sm:mb-4">
              Compartilhe este código com seu oponente
            </p>
            
            <div className="bg-dark-700 rounded-lg p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="animate-pulse w-2 h-2 bg-accent-cyan rounded-full"></div>
                <p className="text-sm sm:text-base text-gray-300">Aguardando outro jogador...</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Quando alguém entrar, o jogo começará automaticamente
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-accent-cyan to-accent-orange bg-clip-text text-transparent">
            Damas Online
          </h1>
          <p className="text-gray-400">Jogue damas em tempo real</p>
          <p className="text-sm text-gray-500 mt-4">WillTech - Solução web</p>
        </div>

        <div className="bg-dark-800 rounded-2xl shadow-2xl p-8 border border-dark-700">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {!mode ? (
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Seu Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                  maxLength={20}
                />
              </div>

              <button
                onClick={() => setMode('create')}
                className="w-full bg-gradient-to-r from-accent-cyan to-accent-cyan/80 text-dark-900 font-bold py-3 sm:py-4 rounded-lg hover:from-accent-cyan/90 hover:to-accent-cyan/70 transition shadow-lg text-sm sm:text-base"
              >
                Criar Sala
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-600"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 bg-dark-800 text-gray-400">ou</span>
                </div>
              </div>

              <button
                onClick={() => setMode('join')}
                className="w-full bg-gradient-to-r from-accent-orange to-accent-orange/80 text-white font-bold py-3 sm:py-4 rounded-lg hover:from-accent-orange/90 hover:to-accent-orange/70 transition shadow-lg text-sm sm:text-base"
              >
                Entrar na Sala
              </button>
            </div>
          ) : mode === 'create' ? (
            <form onSubmit={handleCreateRoom} className="space-y-3 sm:space-y-4">
              <button
                type="button"
                onClick={() => setMode(null)}
                className="text-gray-400 hover:text-white mb-2 sm:mb-4 text-sm sm:text-base flex items-center gap-1"
              >
                ← Voltar
              </button>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Seu Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                  maxLength={20}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent-cyan text-dark-900 font-bold py-3 sm:py-4 rounded-lg hover:bg-accent-cyan/80 transition text-sm sm:text-base"
              >
                Criar Sala
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoinRoom} className="space-y-3 sm:space-y-4">
              <button
                type="button"
                onClick={() => setMode(null)}
                className="text-gray-400 hover:text-white mb-2 sm:mb-4 text-sm sm:text-base flex items-center gap-1"
              >
                ← Voltar
              </button>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Seu Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Código da Sala
                </label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  placeholder="Digite o código"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-orange text-center text-lg sm:text-2xl font-bold tracking-wider uppercase"
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent-orange text-white font-bold py-3 sm:py-4 rounded-lg hover:bg-accent-orange/80 transition text-sm sm:text-base active:scale-95"
              >
                Entrar na Sala
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

