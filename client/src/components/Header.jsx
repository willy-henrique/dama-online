export default function Header({ onBack }) {
  return (
    <div className="mb-2 sm:mb-4 flex items-center justify-between text-xs sm:text-sm">
      <button
        onClick={onBack}
        className="text-gray-400 hover:text-white transition px-2 py-1 sm:px-4 sm:py-2"
      >
        ← Voltar
      </button>
      <p className="text-xs text-gray-500 hidden sm:block">WillTech - Solução web</p>
    </div>
  );
}

