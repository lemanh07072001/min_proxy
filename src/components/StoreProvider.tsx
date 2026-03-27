'use client'

import { useEffect } from 'react'

import { Provider } from 'react-redux'
import { useSession } from 'next-auth/react'

import { store } from '@/store'
import { setUser } from '@/store/userSlice'

function SessionSync() {
  const { data: session } = useSession()
  const sessionUser = session?.user as any

  // Sync session → Redux mỗi khi sodu hoặc role thay đổi
  useEffect(() => {
    if (sessionUser?.id) {
      store.dispatch(setUser(sessionUser))
    }
  }, [sessionUser?.sodu, sessionUser?.role, sessionUser?.id])

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
