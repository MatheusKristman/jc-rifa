import { create } from "zustand";

const useHeaderStore = create((set) => ({
  isMenuOpen: false,
  openMenu: () => set(() => ({ isMenuOpen: true })),
  closeMenu: () => set(() => ({ isMenuOpen: false })),
  isLoginModalOpen: false,
  openLogin: () => set(() => ({ isLoginModalOpen: true })),
  closeLogin: () => set(() => ({ isLoginModalOpen: false })),
  logoutConfirmation: false,
  setToConfirmLogout: () => set(() => ({ logoutConfirmation: true })),
  setToNotConfirmLogout: () => set(() => ({ logoutConfirmation: false })),
  logoutBoxAppears: false,
  setToLogoutBoxAppear: () => set(() => ({ logoutBoxAppears: true })),
  setToLogoutBoxDontAppear: () => set(() => ({ logoutBoxAppears: false })),
}));

export default useHeaderStore;
