import { create } from 'zustand';

const useRaffleStore = create((set) => ({
  raffles: [],
  setRaffles: (value) => set(() => ({ raffles: value })),
  raffleSelected: {},
  setRaffleSelected: (value) => set(() => ({ raffleSelected: value })),
  progress: 0,
  setProgress: (value, full) => set(() => ({ progress: (100 * value) / full })),
  participants: [],
  setParticipants: (value) => set(() => ({ participants: value })),
  finishNumber: '',
  setFinishNumber: (e) => set(() => ({ finishNumber: e.target.value })),
  winner: {},
  setWinner: (value) => set(() => ({ winner: value })),
  finishNumberError: '',
  setFinishNumberError: (value) => set(() => ({ finishNumberError: value })),
}));

export default useRaffleStore;