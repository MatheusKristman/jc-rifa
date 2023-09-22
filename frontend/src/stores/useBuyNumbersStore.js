import { create } from "zustand";

const useBuyNumbersStore = create((set) => ({
  isPaymentModalOpen: false,
  openPaymentModal: () => set(() => ({ isPaymentModalOpen: true })),
  closePaymentModal: () => set(() => ({ isPaymentModalOpen: false })),
  qrCodePayment: "",
  setQrCodePayment: (value) => set(() => ({ qrCodePayment: value })),
  paymentLink: "",
  setPaymentLink: (value) => set(() => ({ paymentLink: value })),
  numberQuant: 0,
  setNumberQuant: (quant) => set(() => ({ numberQuant: quant })),
}));

export default useBuyNumbersStore;
