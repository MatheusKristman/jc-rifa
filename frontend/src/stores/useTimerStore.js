import { create } from "zustand";

const useTimerStore = create((set) => ({
  intervalId: null,
  setIntervalId: (id) => set(() => ({ intervalId: id })),
}));

export default useTimerStore;
