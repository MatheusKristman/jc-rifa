import { create } from "zustand";

const useRequestNewPasswordStore = create((set) => ({
    email: "",
    setEmail: (e) => set(() => ({ email: e.target.value })),
    isSubmitting: false,
    submitting: () => set(() => ({ isSubmitting: true })),
    notSubmitting: () => set(() => ({ isSubmitting: false })),
    isEmailSended: false,
    emailSuccess: () => set(() => ({ isEmailSended: true })),
    emailFail: () => set(() => ({ isEmailSended: false })),
    submitError: false,
    errorExist: () => set(() => ({ submitError: true })),
    errorDontExist: () => set(() => ({ submitError: false })),
    alertMessage: "",
    setAlertMessage: (value) => set(() => ({ alertMessage: value })),
}));

export default useRequestNewPasswordStore;
