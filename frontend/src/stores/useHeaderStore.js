import { create } from 'zustand';

const useHeaderStore = create((set) => ({
    isMenuOpen: false,
    openMenu: () => set(() => ({ isMenuOpen: true })),
    closeMenu: () => set(() => ({ isMenuOpen: false })),
    isLoginModalOpen: false,
    openLogin: () => set(() => ({ isLoginModalOpen: true })),
    closeLogin: () => set(() => ({ isLoginModalOpen: false })),
    usernameValue: '',
    handleUsernameValue: (value) => set(() => ({ usernameValue: value })),
    isUsernameSelected: false,
    selectUsername: () => set(() => ({ isUsernameSelected: true })),
    unselectUsername: () => set(() => ({ isUsernameSelected: false })),
    logoutConfirmation: false,
    setToConfirmLogout: () => set(() => ({ logoutConfirmation: true })),
    setToNotConfirmLogout: () => set(() => ({ logoutConfirmation: false })),
    logoutBoxAppears: false,
    setToLogoutBoxAppear: () => set(() => ({ logoutBoxAppears: true })),
    setToLogoutBoxDontAppear: () => set(() => ({ logoutBoxAppears: false })),
    isSubmitting: false,
    submitting: () => set(() => ({ isSubmitting: true })),
    notSubmitting: () => set(() => ({ isSubmitting: false })),
    doesLoginHappened: false,
    loginSuccess: () => set(() => ({ doesLoginHappened: true })),
    loginFailed: () => set(() => ({ doesLoginHappened: false })),
    submitError: false,
    errorExist: () => set(() => ({ submitError: true })),
    errorDontExist: () => set(() => ({ submitError: false })),
    loginMessage: '',
    setLoginMessage: (value) => set(() => ({ loginMessage: value })),
}));

export default useHeaderStore;
