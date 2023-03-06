import { create } from 'zustand';

const useChangePasswordStore = create((set) => ({
  password: '',
  setPassword: (e) => set(() => ({ password: e.target.value })),
  newPassword: '',
  setNewPassword: (e) => set(() => ({ newPassword: e.target.value })),
  confirmNewPassword: '',
  setConfirmNewPassword: (e) => set(() => ({ confirmNewPassword: e.target.value })),
  isSubmitting: false,
  submitting: () => set(() => ({ isSubmitting: true })),
  notSubmitting: () => set(() => ({ isSubmitting: false })),
  isChangeCompleted: false,
  changeComplete: () => set(() => ({ isChangeCompleted: true })),
  changeNotComplete: () => set(() => ({ isChangeCompleted: false })),
  submitError: false,
  errorExist: () => set(() => ({ submitError: true })),
  errorDontExist: () => set(() => ({ submitError: false })),
  registerMessage: '',
  setRegisterMessage: (value) => set(() => ({ registerMessage: value })),
}));

export default useChangePasswordStore;