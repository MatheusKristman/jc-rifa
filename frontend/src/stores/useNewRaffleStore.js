import { create } from "zustand";

const useNewRaffleStore = create((set) => ({
  resetValues: () =>
    set(() => ({
      raffleImage: "",
      title: "",
      subtitle: "",
      description: "",
      price: "",
      raffleNumbers: 25,
    })),
}));

export default useNewRaffleStore;
