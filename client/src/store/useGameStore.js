import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  // Estado do jogo
  board: [],
  turn: 'white',
  myColor: null,
  opponentColor: null,
  roomId: null,
  gameStatus: 'waiting', // 'waiting', 'playing', 'finished'
  winner: null,
  lastMove: null, // Último movimento realizado
  
  // Estado da UI
  selected: null,
  legalMoves: [],
  mustContinueCapture: null,
  error: '',
  
  // Informações dos jogadores
  myNickname: '',
  opponentNickname: '',
  
  // Socket
  socket: null,
  
  // Ações
  setState: (data) => set((state) => ({ ...state, ...data })),
  
  setBoard: (board) => set({ board }),
  
  setTurn: (turn) => set({ turn }),
  
  setMyColor: (color) => set({ myColor: color }),
  
  setSelected: (selected) => set({ selected }),
  
  setLegalMoves: (moves) => set({ legalMoves: moves }),
  
  setMustContinueCapture: (capture) => set({ mustContinueCapture: capture }),
  
  setError: (error) => set({ error }),
  
  clearSelection: () => set({ selected: null, legalMoves: [] }),
  
  reset: () => set({
    board: [],
    turn: 'white',
    myColor: null,
    opponentColor: null,
    roomId: null,
    gameStatus: 'waiting',
    winner: null,
    lastMove: null,
    selected: null,
    legalMoves: [],
    mustContinueCapture: null,
    error: '',
    myNickname: '',
    opponentNickname: ''
  })
}));

