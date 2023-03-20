import { create } from "zustand";

const useGeneralStore = create((set) => ({
    isRaffleLoading: false,
    setToRaffleLoad: () => set(() => ({ isRaffleLoading: true })),
    setToRaffleNotLoad: () => set(() => ({ isRaffleLoading: false })),
    isLoading: false,
    setToLoad: () => set(() => ({ isLoading: true })),
    setNotToLoad: () => set(() => ({ isLoading: false })),
    loadingAnimation: true,
    setToAnimateFadeIn: () => set(() => ({ loadingAnimation: true })),
    setToAnimateFadeOut: () => set(() => ({ loadingAnimation: false })),
}));

export default useGeneralStore;
