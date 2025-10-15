'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { Provider } from 'react-redux'

import { store } from '@/store'
import { setUser } from '@/store/userSlice' // slice đã tạo

export default function StoreProvider({ children, initialUser }: { children: React.ReactNode; initialUser: any }) {
  const { data: session, status } = useSession()

  // Khi mount client, đưa user từ server vào Redux
  useEffect(() => {
    if (initialUser) {
      console.log('🔍 [StoreProvider] Set user từ server:', initialUser?.email || 'No email')
      store.dispatch(setUser(initialUser))
    }
  }, [initialUser])

  // Fallback: Nếu initialUser null nhưng có session, thử lấy user data từ session
  useEffect(() => {
    if (!initialUser && session?.user && status === 'authenticated') {
      console.log('🔍 [StoreProvider] Fallback: Set user từ session:', session.user)
      store.dispatch(setUser(session.user))
    }
  }, [initialUser, session, status])

  return <Provider store={store}>{children}</Provider>
}
