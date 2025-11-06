import { useGameStore } from '../store/useGameStore';
import { getSocket } from '../utils/socket';

export default function Controls() {
  const { roomId } = useGameStore();

  const handleReset = () => {
    const socket = getSocket();
    if (socket && roomId) {
      socket.emit('reset-game');
    }
  };

  return (
    <div className="mt-4 text-center">
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg text-white font-semibold transition text-sm sm:text-base"
      >
        Reiniciar Partida
      </button>
    </div>
  );
}

