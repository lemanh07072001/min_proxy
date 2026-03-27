'use client'

import { useEffect } from 'react'

import { Provider } from 'react-redux'
import { useSession } from 'next-auth/react'

import { store } from '@/store'
import { setUser } from '@/store/userSlice'

function SessionSync() {
  const { data: session } = useSession()

  // Mỗi khi session refresh (4 phút) → sync userData (gồm sodu) vào Redux
  useEffect(() => {
    if (session?.user) {
      store.dispatch(setUser(session.user as any))
    }
  }, [session?.user])

  return null
}

export default function StoreProvider({ children, initialUser }: { children: React.ReactNode; initialUser: any }) {
  // Lần đầu: đưa user từ SSR vào Redux (số dư đã fresh từ JWT callback)
  useEffect(() => {
    if (initialUser) {
      store.dispatch(setUser(initialUser))
    }
  }, [initialUser])

  return (
    <Provider store={store}>
      <SessionSync />
      {children}
    </Provider>
  )
}
