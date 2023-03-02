import { create } from 'zustand';

const useHeaderStore = create((set) => ({
  isMenuOpen: false,
  openMenu: () => set(() => ({ isMenuOpen: true })),
  closeMenu: () => set(() => ({ isMenuOpen: false })),
  isLoginModalOpen: false,
  openLogin: () => set(() => ({ isLoginModalOpen: true })),
  closeLogin: () => set(() => ({ isLoginModalOpen: false })),
  usernameValue: '',
  handleUsernameValue: (e) => set(() => ({ usernameValue: e.target.value })),
  passwordValue: '',
  handlePasswordValue: (e) => set(() => ({ passwordValue: e.target.value })),
  isUsernameSelected: false,
  selectUsername: () => set(() => ({ isUsernameSelected: true })),
  unselectUsername: () => set(() => ({ isUsernameSelected: false })),
  isPasswordSelected: false,
  selectPassword: () => set(() => ({ isPasswordSelected: true })),
  unselectPassword: () => set(() => ({ isPasswordSelected: false })),
}));

export default useHeaderStore;