import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { initSocket, getSocket } from '../utils/socket';

export default function Home({ onStartGame }) {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState(null); // 'create' ou 'join'
  const [createdRoomId, setCreatedRoomId] = useState(null);
  const [joinedRoomId, setJoinedRoomId] = useState(null);
  const [waitingForPlayer, setWaitingForPlayer] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const { setState, reset } = useGameStore();

  useEffect(() => {
    // Carrega nickname do localStorage
    const savedNickname = localStorage.getItem('dama-nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }

    // Inicializa socket
    const socket = initSocket();

    // Eventos do Socket.IO
    socket.on('room-created', ({ roomId }) => {
      console.log('✅ Sala criada! Room ID:', roomId);
      setCreatedRoomId(roomId);
      setWaitingForPlayer(true);
      setStatus('Aguardando outro jogador...');
    });

    socket.on('room-joined', ({ roomId, color, nickname }) => {
      console.log('✅ Entrou na sala! Room:', roomId, 'Color:', color);
      setJoinedRoomId(roomId);
      setState({ roomId, myColor: color, myNickname: nickname });
      setWaitingForPlayer(true);
      setStatus('Aguardando outro jogador...');
      // Não vai para o jogo ainda, espera o game-started
    });

    socket.on('game-started', (gameState) => {
      console.log('🎮 Jogo iniciado!', gameState);
      
      const playerColor = gameState.players.white?.id === socket.id ? 'white' : 
                         gameState.players.black?.id === socket.id ? 'black' : null;
      
      if (playerColor) {
        const opponentColor = playerColor === 'white' ? 'black' : 'white';
        setState({
          roomId: gameState.roomId || createdRoomId || joinedRoomId,
          myColor: playerColor,
          opponentColor,
          myNickname: gameState.players[playerColor]?.nickname || nickname,
          opponentNickname: gameState.players[opponentColor]?.nickname || '',
          board: gameState.board,
          turn: gameState.currentPlayer,
          gameStatus: gameState.gameStatus,
          socket
        });
        
        setWaitingForPlayer(false);
        setStatus('Iniciando jogo...');
        
        // Pequeno delay para mostrar "Iniciando jogo..."
        setTimeout(() => {
          onStartGame();
        }, 500);
      }
    });

    socket.on('room-error', ({ message }) => {
      setError(message);
      setStatus('');
    });

    return () => {
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('game-started');
      socket.off('room-error');
    };
  }, [createdRoomId, joinedRoomId, roomId, nickname, setState, onStartGame]);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Digite um nickname');
      return;
    }

    const socket = getSocket();
    if (!socket || !socket.connected) {
      setError('Aguardando conexão com o servidor...');
      return;
    }

    localStorage.setItem('dama-nickname', nickname);
    setError('');
    setStatus('Criando sala...');
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

    const socket = getSocket();
    if (!socket || !socket.connected) {
      setError('Aguardando conexão com o servidor...');
      return;
    }

    localStorage.setItem('dama-nickname', nickname);
    setError('');
    setStatus('Entrando na sala...');
    socket.emit('join-room', { roomId: roomId.toUpperCase(), nickname });
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(createdRoomId);
    // Apenas copia, sem feedback visual
  };

  const shareRoomId = async () => {
    const shareData = {
      title: 'Jogue Damas Online comigo!',
      text: `Entre na minha sala de damas! Código: ${createdRoomId}`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        copyRoomId();
      }
    } catch (err) {
      copyRoomId();
    }
  };

  // Tela de sala criada ou aguardando jogador
  if (createdRoomId || (joinedRoomId && waitingForPlayer)) {
    const isCreator = !!createdRoomId;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
        <div className="bg-dark-800 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-md w-full border border-dark-700">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <button
              onClick={() => {
                setCreatedRoomId(null);
                setJoinedRoomId(null);
                setWaitingForPlayer(false);
                reset();
              }}
              className="text-gray-400 hover:text-white transition text-sm sm:text-base flex items-center gap-1"
            >
              ← Sair da Sala
            </button>
            <p className="text-xs text-gray-500">WillTech - Solução web</p>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-accent-cyan">
            {isCreator ? 'Sala Criada!' : 'Aguardando Jogador'}
          </h2>
          
          <div className="space-y-3 sm:space-y-4">
            {isCreator && (
              <>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                    Código da Sala
                  </label>
                  <div className="bg-dark-700 border-2 border-accent-cyan/50 rounded-lg px-3 sm:px-4 py-3 sm:py-4 mb-3">
                    <input
                      type="text"
                      value={createdRoomId}
                      readOnly
                      className="w-full bg-transparent text-xl sm:text-3xl font-bold text-center text-accent-cyan tracking-wider focus:outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={copyRoomId}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-accent-cyan text-dark-900 rounded-lg font-semibold hover:bg-accent-cyan/80 transition text-xs sm:text-sm active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copiar
                    </button>
                    <button
                      onClick={shareRoomId}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-accent-orange text-white rounded-lg font-semibold hover:bg-accent-orange/80 transition text-xs sm:text-sm active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Compartilhar
                    </button>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-400 text-center mb-3 sm:mb-4">
                  Compartilhe este código com seu oponente
                </p>
              </>
            )}
            
            <div className="bg-dark-700 rounded-lg p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="animate-pulse w-2 h-2 bg-accent-cyan rounded-full"></div>
                <p className="text-sm sm:text-base text-gray-300">{status || 'Aguardando outro jogador...'}</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {isCreator 
                  ? 'Quando alguém entrar, o jogo começará automaticamente'
                  : 'Aguardando o criador da sala...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-accent-cyan to-accent-orange bg-clip-text text-transparent">
            Damas Online
          </h1>
          <p className="text-sm sm:text-base text-gray-400">Jogue damas em tempo real</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-4">WillTech - Solução web</p>
        </div>

        <div className="bg-dark-800 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-dark-700">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {status && !error && (
            <div className="mb-4 p-3 bg-accent-cyan/20 border border-accent-cyan/50 rounded-lg text-accent-cyan text-sm">
              {status}
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
                Ir para a Sala
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
                <div className="bg-dark-700 border-2 border-accent-orange/50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 mb-3">
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Digite o código"
                    className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-center text-lg sm:text-2xl font-bold tracking-wider uppercase"
                    maxLength={6}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-accent-orange to-accent-orange/80 text-white font-bold py-3 sm:py-4 rounded-lg hover:from-accent-orange/90 hover:to-accent-orange/70 transition text-sm sm:text-base active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Ir para a Sala
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

