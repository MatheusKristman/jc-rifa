import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: {},
  isUserLogged: false,
  setUser: (data) => set(() => ({ user: data })),
  userLogged: () => set(() => ({ isUserLogged: true })),
  userNotLogged: () => set(() => ({ isUserLogged: false })),
}));

export default useUserStore;