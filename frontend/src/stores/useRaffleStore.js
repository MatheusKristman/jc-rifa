import { create } from "zustand";

const useRaffleStore = create((set) => ({
  raffles: [],
  setRaffles: (value) => set(() => ({ raffles: value })),
  idSelected: "",
  setIdSelected: (id) => set(() => ({ idSelected: id })),
  progress: 0,
  setProgress: (value, full) => set(() => ({ progress: (100 * value) / full })),
  isDeleteConfirmationOpen: false,
  openDeleteConfirmation: () => set(() => ({ isDeleteConfirmationOpen: true })),
  closeDeleteConfirmation: () =>
    set(() => ({ isDeleteConfirmationOpen: false })),
  isDeleteConfirmationAnimated: false,
  activateDeleteConfirmationAnimation: () =>
    set(() => ({ isDeleteConfirmationAnimated: true })),
  deactivateDeleteConfirmationAnimation: () =>
    set(() => ({ isDeleteConfirmationAnimated: false })),
}));

export default useRaffleStore;
