'use client'

import { useEffect } from 'react'

import { Provider } from 'react-redux'

import { store } from '@/store'
import { setUser } from '@/store/userSlice' // slice đã tạo

export default function StoreProvider({ children, initialUser }: { children: React.ReactNode; initialUser: any }) {
  // Khi mount client, đưa user từ server vào Redux
  useEffect(() => {
    if (initialUser) {
      store.dispatch(setUser(initialUser))

      // nếu có số dư trong user: store.dispatch(setBalance(initialUser.balance))
    }
  }, [initialUser])

  return <Provider store={store}>{children}</Provider>
}
