import { create } from "zustand";

const useNewPasswordStore = create((set) => ({
    newPassword: "",
    setNewPassword: (event) => set(() => ({ newPassword: event.target.value })),
    confirmNewPassword: "",
    setConfirmNewPassword: (event) => set(() => ({ confirmNewPassword: event.target.value })),
    isSubmitting: false,
    submitting: () => set(() => ({ isSubmitting: true })),
    notSubmitting: () => set(() => ({ isSubmitting: false })),
    isChangeCompleted: false,
    changeComplete: () => set(() => ({ isChangeCompleted: true })),
    changeNotComplete: () => set(() => ({ isChangeCompleted: false })),
    submitError: false,
    errorExist: () => set(() => ({ submitError: true })),
    errorDontExist: () => set(() => ({ submitError: false })),
    registerMessage: "",
    setRegisterMessage: (value) => set(() => ({ registerMessage: value })),
}));

export default useNewPasswordStore;
