import { create } from "zustand";

const useRaffleStore = create((set) => ({
  raffles: [],
  setRaffles: (value) => set(() => ({ raffles: value })),
  rafflesImagesUrls: [],
  setRafflesImagesUrls: (urls) => set(() => ({ rafflesImagesUrls: urls })),
  raffleSelected: {},
  setRaffleSelected: (value) => set(() => ({ raffleSelected: value })),
  raffleSelectedImageUrl: "",
  setRaffleSelectedImageUrl: (url) =>
    set(() => ({ raffleSelectedImageUrl: url })),
  progress: 0,
  setProgress: (value, full) => set(() => ({ progress: (100 * value) / full })),
  participants: [],
  setParticipants: (value) => set(() => ({ participants: value })),
  finishNumber: "",
  setFinishNumber: (e) => set(() => ({ finishNumber: e.target.value })),
  setFinishNumberFromFetch: (value) => set(() => ({ finishNumber: value })),
  winner: {},
  setWinner: (value) => set(() => ({ winner: value })),
  finishNumberError: "",
  setFinishNumberError: (value) => set(() => ({ finishNumberError: value })),
  isActiveOn: true,
  setActiveOn: () => set(() => ({ isActiveOn: true })),
  setActiveOff: () => set(() => ({ isActiveOn: false })),
  isConcludedOn: false,
  setConcludedOn: () => set(() => ({ isConcludedOn: true })),
  setConcludedOff: () => set(() => ({ isConcludedOn: false })),
  sliceBegin: 0,
  sliceEnd: 10,
  pageMultiplier: 1,
  sliceEndBiggerThanRaffles: (value) => set(() => ({ sliceEnd: value })),
  setSliceBegin: () => set((state) => ({ sliceBegin: state.sliceEnd - 10 })),
  setSliceEnd: () => set((state) => ({ sliceEnd: 10 * state.pageMultiplier })),
  setNextPage: () =>
    set((state) => ({ pageMultiplier: state.pageMultiplier + 1 })),
  setPreviousPage: () =>
    set((state) => ({ pageMultiplier: state.pageMultiplier - 1 })),
  resetPageMultiplier: () => set(() => ({ pageMultiplier: 1 })),
  resetSliceBegin: () => set(() => ({ sliceBegin: 0 })),
  resetSliceEnd: () => set(() => ({ sliceEnd: 10 })),
  rafflesDisplaying: [],
  setRafflesDisplaying: (value) => set(() => ({ rafflesDisplaying: value })),
  isPreviousPageBtnDisplayed: false,
  showPreviousPageBtn: () => set(() => ({ isPreviousPageBtnDisplayed: true })),
  hidePreviousPageBtn: () => set(() => ({ isPreviousPageBtnDisplayed: false })),
  isNextPageBtnDisplayed: false,
  showNextPageBtn: () => set(() => ({ isNextPageBtnDisplayed: true })),
  hideNextPageBtn: () => set(() => ({ isNextPageBtnDisplayed: false })),
  isUsersNumberBuyedLoading: true,
  setToLoadUsersNumberBuyed: () =>
    set(() => ({ isUsersNumberBuyedLoading: true })),
  setNotToLoadUsersNumberBuyed: () =>
    set(() => ({ isUsersNumberBuyedLoading: false })),
  isChoosingWinner: false,
  setToChooseWinner: () => set(() => ({ isChoosingWinner: true })),
  setNotToChooseWinner: () => set(() => ({ isChoosingWinner: false })),
  isFetchingWinner: false,
  setToFetchWinner: () => set(() => ({ isFetchingWinner: true })),
  setNotToFetchWinner: () => set(() => ({ isFetchingWinner: false })),
  isDeleteConfirmationOpen: false,
  openDeleteConfirmation: () => set(() => ({ isDeleteConfirmationOpen: true })),
  closeDeleteConfirmation: () =>
    set(() => ({ isDeleteConfirmationOpen: false })),
  isDeleteConfirmationAnimated: false,
  activateDeleteConfirmationAnimation: () =>
    set(() => ({ isDeleteConfirmationAnimated: true })),
  deactivateDeleteConfirmationAnimation: () =>
    set(() => ({ isDeleteConfirmationAnimated: false })),
  isDeleteButtonEnabled: false,
  enableDeleteButton: () => set(() => ({ isDeleteButtonEnabled: true })),
  disableDeleteButton: () => set(() => ({ isDeleteButtonEnabled: false })),
  resetOnEditRaffle: () =>
    set(() => ({ winner: {}, participants: [], raffleSelected: {} })),
}));

export default useRaffleStore;
