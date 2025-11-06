import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

let socketInstance = null;

export const initSocket = () => {
  if (socketInstance) {
    return socketInstance;
  }

  socketInstance = io(SERVER_URL, {
    transports: ['websocket', 'polling'],
    extraHeaders: {
      'ngrok-skip-browser-warning': 'true'
    }
  });

  socketInstance.on('connect', () => {
    console.log('✅ Conectado ao servidor');
    console.log('Server URL:', SERVER_URL);
    console.log('Socket ID:', socketInstance.id);
  });

  socketInstance.on('disconnect', () => {
    console.log('❌ Desconectado do servidor');
  });

  socketInstance.on('error', (error) => {
    console.error('❌ Erro Socket.IO:', error);
  });

  socketInstance.on('connect_error', (error) => {
    console.error('❌ Erro de conexão:', error);
    console.error('Tentando conectar em:', SERVER_URL);
  });

  return socketInstance;
};

export const getSocket = () => {
  if (!socketInstance) {
    return initSocket();
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.close();
    socketInstance = null;
  }
};

