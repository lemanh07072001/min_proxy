'use client'

import { useEffect } from 'react'

import { useUserStore } from '@/stores'

export default function ZustandHydrator({ children, initialUser }: { children: React.ReactNode; initialUser: any }) {
  const setUser = useUserStore((state) => state.setUser)

  // Khi mount client, đưa user từ server vào Zustand
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser)
    }
  }, [initialUser, setUser])

  return <>{children}</>
}
