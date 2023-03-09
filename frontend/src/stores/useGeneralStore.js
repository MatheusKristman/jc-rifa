import { create } from 'zustand';

const useGeneralStore = create((set) => ({
  isRaffleLoading: false,
  setToRaffleLoad: () => set(() => ({ isRaffleLoading: true })),
  setToRaffleNotLoad: () => set(() => ({ isRaffleLoading: false })),
}));

export default useGeneralStore;