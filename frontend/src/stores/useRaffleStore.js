import { create } from 'zustand';

const useRaffleStore = create((set) => ({
  raffles: [],
  setRaffles: (value) => set(() => ({ raffles: value })),
}));

export default useRaffleStore;