import { create } from "zustand";

const useBuyNumbersStore = create((set) => ({
  numberQuant: 0,
  incrementNumberQuant: (value) => set((state) => ({ numberQuant: state.numberQuant + value })),
  decrementNumberQuant: (value) => set((state) => ({ numberQuant: state.numberQuant - value })),
}));

export default useBuyNumbersStore;