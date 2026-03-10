'use client'

import { useEffect, useState } from 'react'

import { useSession, signOut } from 'next-auth/react'

/**
 * Hook để kiểm tra authentication trên client-side.
 *
 * Không cần gọi /api/me ở đây vì:
 * - middleware.ts đã check JWT server-side cho mọi route
 * - useAxiosAuth interceptor tự logout khi API trả 401
 * - NextAuth JWT callback tự refresh token trước khi hết hạn
 */
export const useClientAuthGuard = () => {
  const { data: session, status } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
      
return
    }

    if (!session || session.error === 'TokenExpiredError' || !session.access_token) {
      setIsAuthenticated(false)
      setIsLoading(false)

      if (session?.error === 'TokenExpiredError' || (session && !session.access_token)) {
        signOut({ redirect: false })
      }

      return
    }

    setIsAuthenticated(true)
    setIsLoading(false)
  }, [status])

  return {
    isAuthenticated,
    isLoading,
    session
  }
}

