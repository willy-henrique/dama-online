import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export default function HomePage({ socket, onCreateRoom, onJoinRoom }) {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState(null); // 'create' ou 'join'
  const [createdRoomId, setCreatedRoomId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Carrega nickname do localStorage
    const savedNickname = localStorage.getItem('dama-nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }

    if (!socket) return;

    socket.on('room-created', ({ roomId }) => {
      setCreatedRoomId(roomId);
      onCreateRoom(roomId);
    });

    socket.on('room-joined', ({ roomId, color, nickname }) => {
      onJoinRoom(roomId, color, nickname);
    });

    socket.on('room-error', ({ message }) => {
      setError(message);
    });

    return () => {
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('room-error');
    };
  }, [socket, onCreateRoom, onJoinRoom]);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Digite um nickname');
      return;
    }
    localStorage.setItem('dama-nickname', nickname);
    setError('');
    socket.emit('create-room', nickname);
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
    alert('Código copiado!');
  };

  if (createdRoomId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-dark-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-dark-700">
          <div className="text-center mb-2">
            <p className="text-xs text-gray-500">WillTech - Solução web</p>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-accent-cyan">
            Sala Criada!
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Código da Sala
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={createdRoomId}
                  readOnly
                  className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-2xl font-bold text-center text-accent-cyan tracking-wider"
                />
                <button
                  onClick={copyRoomId}
                  className="px-4 py-3 bg-accent-cyan text-dark-900 rounded-lg font-semibold hover:bg-accent-cyan/80 transition"
                >
                  Copiar
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-400 text-center">
              Compartilhe este código com seu oponente
            </p>
            <div className="text-center text-gray-500">
              Aguardando outro jogador...
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Seu Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                  maxLength={20}
                />
              </div>

              <button
                onClick={() => setMode('create')}
                className="w-full bg-gradient-to-r from-accent-cyan to-accent-cyan/80 text-dark-900 font-bold py-4 rounded-lg hover:from-accent-cyan/90 hover:to-accent-cyan/70 transition shadow-lg"
              >
                Criar Sala
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-dark-800 text-gray-400">ou</span>
                </div>
              </div>

              <button
                onClick={() => setMode('join')}
                className="w-full bg-gradient-to-r from-accent-orange to-accent-orange/80 text-white font-bold py-4 rounded-lg hover:from-accent-orange/90 hover:to-accent-orange/70 transition shadow-lg"
              >
                Entrar na Sala
              </button>
            </div>
          ) : mode === 'create' ? (
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <button
                type="button"
                onClick={() => setMode(null)}
                className="text-gray-400 hover:text-white mb-4"
              >
                ← Voltar
              </button>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Seu Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                  maxLength={20}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent-cyan text-dark-900 font-bold py-4 rounded-lg hover:bg-accent-cyan/80 transition"
              >
                Criar Sala
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <button
                type="button"
                onClick={() => setMode(null)}
                className="text-gray-400 hover:text-white mb-4"
              >
                ← Voltar
              </button>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Seu Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Código da Sala
                </label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  placeholder="Digite o código"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-orange text-center text-2xl font-bold tracking-wider"
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent-orange text-white font-bold py-4 rounded-lg hover:bg-accent-orange/80 transition"
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

