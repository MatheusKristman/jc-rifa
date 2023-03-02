import { create } from 'zustand';

const useQueryNumbersStore = create((set) => ({
  isQueryNumbersModalOpen: false,
  openModal: () => set(() => ({ isQueryNumbersModalOpen: true })),
  closeModal: () => set(() => ({ isQueryNumbersModalOpen: false })),
}));

export default useQueryNumbersStore;
