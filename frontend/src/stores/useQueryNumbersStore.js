import { create } from "zustand";

const useQueryNumbersStore = create((set) => ({
    isQueryNumbersModalOpen: false,
    openModal: () => set(() => ({ isQueryNumbersModalOpen: true })),
    closeModal: () => set(() => ({ isQueryNumbersModalOpen: false })),
    cpf: "",
    setCpf: (e) => set(() => ({ cpf: e.target.value })),
    userRafflesBuyed: [],
    setUserRafflesBuyed: (value) => set(() => ({ userRafflesBuyed: value })),
    rafflesConcluded: [],
    setRafflesConcluded: (value) => set(() => ({ rafflesConcluded: value })),
}));

export default useQueryNumbersStore;
