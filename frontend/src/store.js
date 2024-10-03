import { create } from "zustand";
import {persist} from 'zustand/middleware'

const useStore = create(persist((set) => ({
    currentUser: null,
    setCurrentUser: (state) => set({currentUser:state})
}),{
    name: 'currentUser-storage',
    getStorage: () => localStorage,
}))

export default useStore