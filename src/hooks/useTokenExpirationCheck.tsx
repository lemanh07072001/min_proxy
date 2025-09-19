'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'

/**
 * Hook để kiểm tra token expiration trên landing page
 * Có logic refresh token tương tự như useAxiosAuth
 */
export const useTokenExpirationCheck = () => {
  const { data: session, status, update: updateSession } = useSession()

  useEffect(() => {
    // Chỉ kiểm tra khi user đã authenticated
    if (status === 'authenticated' && session?.access_token) {
      console.log('🔍 [useTokenExpirationCheck] Checking token validity...')
      
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
            console.log('⚠️ [useTokenExpirationCheck] Token expired, attempting to refresh...')
            
            try {
              // Thử refresh token trước khi logout
              const refreshedSession = await updateSession()
              
              if (refreshedSession?.access_token) {
                console.log('✅ [useTokenExpirationCheck] Token refreshed successfully')
                return
              } else {
                throw new Error('Failed to refresh token: no access_token')
              }
            } catch (refreshError) {
              console.error('❌ [useTokenExpirationCheck] Token refresh failed:', refreshError)
              console.log('🚪 [useTokenExpirationCheck] Signing out user')
              await signOut({ redirect: false })
            }
          } else if (response.ok) {
            console.log('✅ [useTokenExpirationCheck] Token is still valid')
          }
        } catch (error) {
          console.error('❌ [useTokenExpirationCheck] Error checking token:', error)
        }
      }

      // Kiểm tra ngay lập tức
      checkToken()
    }
  }, [session?.access_token, status, updateSession])

  return {
    isAuthenticated: status === 'authenticated',
    session
  }
}

export default useTokenExpirationCheck
