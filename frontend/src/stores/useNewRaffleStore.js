import { create } from "zustand";

const useNewRaffleStore = create((set) => ({
  raffleImage: null,
  setRaffleImage: (file) => set(() => ({ raffleImage: file })),
  actualRaffleImageUrl: "",
  setActualRaffleImageUrl: (url) => set(() => ({ actualRaffleImageUrl: url })),
  title: "",
  setTitle: (e) => set(() => ({ title: e.target.value })),
  setTitleFromFetch: (value) => set(() => ({ title: value })),
  subtitle: "",
  setSubtitle: (e) => set(() => ({ subtitle: e.target.value })),
  setSubtitleFromFetch: (value) => set(() => ({ subtitle: value })),
  description: "",
  setDescription: (e) => set(() => ({ description: e.target.value })),
  setDescriptionFromFetch: (value) => set(() => ({ description: value })),
  price: "",
  setPrice: (value) => set(() => ({ price: value })),
  raffleNumbers: 25,
  setRaffleNumbers: (e) =>
    set(() => ({ raffleNumbers: Number(e.target.value) })),
  setRaffleNumbersFromFetch: (value) => set(() => ({ raffleNumbers: value })),
  numbersOptions: [
    25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700,
    750, 800, 850, 900, 950, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000,
    9000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000,
    1000000,
  ],
  isSubmitting: false,
  submitConfirm: () => set(() => ({ isSubmitting: true })),
  submitCancel: () => set(() => ({ isSubmitting: false })),
  isRaffleCreated: false,
  raffleCreatedSuccess: () => set(() => ({ isRaffleCreated: true })),
  raffleCreatedCancel: () => set(() => ({ isRaffleCreated: false })),
  submitError: false,
  errorExist: () => set(() => ({ submitError: true })),
  errorDontExist: () => set(() => ({ submitError: false })),
  raffleCreatedMessage: "",
  setRaffleCreatedMessage: (value) =>
    set(() => ({ raffleCreatedMessage: value })),
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
