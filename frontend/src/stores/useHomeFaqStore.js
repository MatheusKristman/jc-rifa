import { create } from 'zustand';

const useHomeFaqStore = create((set) => ({
  isFaqOpen1: false,
  isFaqOpen2: false,
  isFaqOpen3: false,
  openFaq1: () => set(() => ({ isFaqOpen1: true, isFaqOpen2: false, isFaqOpen3: false })),
  openFaq2: () => set(() => ({ isFaqOpen2: true, isFaqOpen3: false, isFaqOpen1: false })),
  openFaq3: () => set(() => ({ isFaqOpen3: true, isFaqOpen1: false, isFaqOpen2: false })),
  closeFaq1: () => set(() => ({ isFaqOpen1: false })),
  closeFaq2: () => set(() => ({ isFaqOpen2: false })),
  closeFaq3: () => set(() => ({ isFaqOpen3: false })),
}));

export default useHomeFaqStore;