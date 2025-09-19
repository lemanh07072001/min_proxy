'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useRef } from 'react'

/**
 * Hook đơn giản để kiểm tra authentication trên client-side
 * Tránh infinite loop bằng cách chỉ kiểm tra một lần
 */
export const useClientAuthGuard = () => {
  const { data: session, status, update: updateSession } = useSession()
  const hasCheckedRef = useRef(false)

  useEffect(() => {
    // Chỉ kiểm tra một lần khi component mount và user đã authenticated
    if (status === 'authenticated' && session?.access_token && !hasCheckedRef.current) {
      hasCheckedRef.current = true
      console.log('🔍 [useClientAuthGuard] Checking token validity...')
      
      // Kiểm tra token bằng cách gọi API /api/me
      const checkToken = async () => {
        try {
          const response = await fetch('/api/me', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            }
          })

          if (response.status === 401) {
            console.log('⚠️ [useClientAuthGuard] Token expired, attempting to refresh...')
            
            try {
              // Thử refresh token trước khi logout
              const refreshedSession = await updateSession()
              
              if (refreshedSession?.access_token) {
                console.log('✅ [useClientAuthGuard] Token refreshed successfully')
                return
              } else {
                throw new Error('Failed to refresh token: no access_token')
              }
            } catch (refreshError) {
              console.error('❌ [useClientAuthGuard] Token refresh failed:', refreshError)
              console.log('🚪 [useClientAuthGuard] Signing out user')
              await signOut({ redirect: false })
            }
          } else if (response.ok) {
            console.log('✅ [useClientAuthGuard] Token is still valid')
          }
        } catch (error) {
          console.error('❌ [useClientAuthGuard] Error checking token:', error)
        }
      }

      // Kiểm tra ngay lập tức
      checkToken()
    }

    // Reset flag khi session thay đổi
    if (status !== 'authenticated') {
      hasCheckedRef.current = false
    }
  }, [session?.access_token, status, updateSession])

  return {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    session
  }
}

export default useClientAuthGuard
