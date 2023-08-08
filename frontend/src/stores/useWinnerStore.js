import { create } from "zustand";

const useWinnerStore = create((set) => ({
  winners: [],
  setWinners: (value) => set(() => ({ winners: value })),
  winnersImagesUrls: [],
  setWinnersImagesUrls: (url) => set(() => ({ winnersImagesUrls: url })),
  winnersRafflesImagesUrls: [],
  setWinnersRafflesImagesUrls: (urls) =>
    set(() => ({ winnersRafflesImagesUrls: urls })),
}));

export default useWinnerStore;
