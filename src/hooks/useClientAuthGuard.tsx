'use client'

import { useEffect, useState } from 'react'

import { useRouter, usePathname } from 'next/navigation'

import { useSession, signOut } from 'next-auth/react'

/**
 * Hook để kiểm tra authentication trên client-side
 * Tự động logout khi token hết hạn hoặc không hợp lệ
 */
export const useClientAuthGuard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthentication = async () => {
      // Nếu đang loading, chờ
      if (status === 'loading') {
        setIsLoading(true)
        
return
      }

      // Nếu không có session
      if (!session) {
        setIsAuthenticated(false)
        setIsLoading(false)
        
return
      }

      // Kiểm tra nếu session có error (token hết hạn)
      if (session.error === 'TokenExpiredError') {
        await signOut({ redirect: false })
        setIsAuthenticated(false)
        setIsLoading(false)
        
return
      }

      // Kiểm tra nếu không có access_token
      if (!session.access_token) {
        await signOut({ redirect: false })
        setIsAuthenticated(false)
        setIsLoading(false)
        
return
      }

      // Kiểm tra token validity bằng cách gọi API
      try {
        const response = await fetch('/api/me', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          }
        })

        if (response.status === 401) {
          await signOut({ redirect: false })
          setIsAuthenticated(false)
          setIsLoading(false)
          
return
        }

        if (!response.ok) {
          await signOut({ redirect: false })
          setIsAuthenticated(false)
          setIsLoading(false)
          
return
        }

        // Token hợp lệ
        setIsAuthenticated(true)
        setIsLoading(false)
      } catch (error) {
        console.error('🔒 [useClientAuthGuard] Error checking token:', error)
        await signOut({ redirect: false })
        setIsAuthenticated(false)
        setIsLoading(false)
      }
    }

    checkAuthentication()
  }, [session, status, router, pathname])

  return {
    isAuthenticated,
    isLoading,
    session
  }
}

