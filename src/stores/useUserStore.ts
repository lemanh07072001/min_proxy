import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id?: number
  name?: string
  email?: string
  sodu?: number
}

interface UserState {
  user: User | null
  sodu: number
  setUser: (user: User) => void
  setBalance: (balance: number) => void
  addBalance: (amount: number) => void
  subtractBalance: (amount: number) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      sodu: 0,
      setUser: (user) =>
        set((state) => ({
          user,
          sodu: user.sodu !== undefined ? user.sodu : state.sodu
        })),
      setBalance: (sodu) => set({ sodu }),
      addBalance: (amount) => set((state) => ({ sodu: state.sodu + amount })),
      subtractBalance: (amount) => set((state) => ({ sodu: state.sodu - amount })),
      clearUser: () => set({ user: null, sodu: 0 })
    }),
    {
      name: 'user-storage'
    }
  )
)
