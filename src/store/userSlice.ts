import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface User {
  id?: number
  name?: string
  email?: string
  sodu?: number
}

interface UserState {
  user: User | null
  sodu: number
}

const initialState: UserState = {
  user: null,
  sodu: 0
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload

      if (action.payload.sodu !== undefined) {
        state.sodu = action.payload.sodu
      }
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.sodu = action.payload
    },
    addBalance: (state, action: PayloadAction<number>) => {
      state.sodu += action.payload
    },
    subtractBalance: (state, action: PayloadAction<number>) => {
      state.sodu -= action.payload
    },
    clearUser: (state) => {
      state.user = null
      state.sodu = 0
    }
  }
})

export const { setUser, setBalance, addBalance, subtractBalance, clearUser } = userSlice.actions
export default userSlice.reducer
