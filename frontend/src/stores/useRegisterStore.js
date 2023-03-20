import { create } from "zustand";

const useRegisterStore = create((set) => ({
    profileImage: {},
    name: "",
    cpf: "",
    email: "",
    password: "",
    confirmPassword: "",
    tel: "",
    confirmTel: "",
    cep: "",
    address: "",
    number: "",
    neighborhood: "",
    complement: "",
    uf: "",
    city: "",
    reference: "",
    setProfileImage: (data) => set(() => ({ profileImage: data })),
    setName: (e) => set(() => ({ name: e.target.value })),
    setNameFromFetch: (value) => set(() => ({ name: value })),
    setCpfFromFetch: (value) => set(() => ({ cpf: value })),
    setEmail: (e) => set(() => ({ email: e.target.value })),
    setEmailFromFetch: (value) => set(() => ({ email: value })),
    setPassword: (e) => set(() => ({ password: e.target.value })),
    setConfirmPassword: (e) => set(() => ({ confirmPassword: e.target.value })),
    setTelFromFetch: (value) => set(() => ({ tel: value })),
    setConfirmTelFromFetch: (value) => set(() => ({ confirmTel: value })),
    setCepFromFetch: (value) => set(() => ({ cep: value })),
    setAddress: (e) => set(() => ({ address: e.target.value })),
    setAddressFromFetch: (value) => set(() => ({ address: value })),
    setNumber: (e) => set(() => ({ number: e.target.value })),
    setNumberFromFetch: (value) => set(() => ({ number: value })),
    setNeighborhood: (e) => set(() => ({ neighborhood: e.target.value })),
    setNeighborhoodFromFetch: (value) => set(() => ({ neighborhood: value })),
    setComplement: (e) => set(() => ({ complement: e.target.value })),
    setComplementFromFetch: (value) => set(() => ({ complement: value })),
    setUf: (e) => set(() => ({ uf: e.target.value })),
    setUfFromFetch: (value) => set(() => ({ uf: value })),
    setCity: (e) => set(() => ({ city: e.target.value })),
    setCityFromFetch: (value) => set(() => ({ city: value })),
    setReference: (e) => set(() => ({ reference: e.target.value })),
    setReferenceFromFetch: (value) => set(() => ({ reference: value })),
    isSubmitting: false,
    submitting: () => set(() => ({ isSubmitting: true })),
    notSubmitting: () => set(() => ({ isSubmitting: false })),
    isRegisterCompleted: false,
    registerComplete: () => set(() => ({ isRegisterCompleted: true })),
    registerNotComplete: () => set(() => ({ isRegisterCompleted: false })),
    errorSubmitting: false,
    errorExist: () => set(() => ({ errorSubmitting: true })),
    errorDontExist: () => set(() => ({ errorSubmitting: false })),
    registerMessage: "",
    setRegisterMessage: (value) => set(() => ({ registerMessage: value })),
    ufOptions: [],
    setUfOptions: (values) => set(() => ({ ufOptions: values })),
    cityOptions: [],
    setCityOptions: (values) => set(() => ({ cityOptions: values })),
}));

export default useRegisterStore;
