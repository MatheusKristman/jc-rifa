import { create } from "zustand";

const useWinnerStore = create((set) => ({
    winners: [],
    setWinners: (value) => set(() => ({ winners: value })),
}));

export default useWinnerStore;
