import { create } from "zustand";

const useBuyNumbersStore = create((set) => ({
    numberQuant: 0,
    incrementNumberQuant: (value) => set((state) => ({ numberQuant: state.numberQuant + value })),
    decrementNumberQuant: (value) => set((state) => ({ numberQuant: state.numberQuant - value })),
    isBuying: false,
    setToBuy: () => set(() => ({ isBuying: true })),
    setToNotBuy: () => set(() => ({ isBuying: false })),
    isMessageBoxDisplaying: false,
    setToMessageBoxDisplay: () => set(() => ({ isMessageBoxDisplaying: true })),
    setToMessageBoxDontDisplay: () => set(() => ({ isMessageBoxDisplaying: false })),
    isErrorBoxDisplaying: false,
    setToErrorBoxDisplay: () => set(() => ({ isErrorBoxDisplaying: true })),
    setToErrorBoxDontDisplay: () => set(() => ({ isErrorBoxDisplaying: false })),
    messageText: "",
    setMessageText: (value) => set(() => ({ messageText: value })),
    isPaymentModalOpen: false,
    openPaymentModal: () => set(() => ({ isPaymentModalOpen: true })),
    closePaymentModal: () => set(() => ({ isPaymentModalOpen: false })),
    qrCodePayment: "",
    setQrCodePayment: (value) => set(() => ({ qrCodePayment: value })),
    paymentLink: "",
    setPaymentLink: (value) => set(() => ({ paymentLink: value })),
}));

export default useBuyNumbersStore;
