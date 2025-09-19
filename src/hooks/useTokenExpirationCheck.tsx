'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Hook để kiểm tra token expiration trên landing page
 * Có logic refresh token tương tự như useAxiosAuth
 */
export const useTokenExpirationCheck = () => {
  const { data: session, status, update: updateSession } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Chỉ kiểm tra khi user đã authenticated
    if (status === 'authenticated' && session?.access_token) {
      console.log('🔍 [useTokenExpirationCheck] Checking token validity...')
      
      // Kiểm tra token expiration trước khi gọi API
      const checkToken = async () => {
        // Kiểm tra nếu session có error (refresh token đã thất bại)
        if (session?.error === 'RefreshAccessTokenError') {
          console.log('⚠️ [useTokenExpirationCheck] Session has refresh error, signing out...')
          await signOut({ redirect: false })
          const lang = pathname.split('/')[1] || 'vi'
          router.push(`/${lang}`)
          return
        }
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
              
              // Kiểm tra nếu có lỗi refresh token hoặc không có access_token
              if (refreshedSession?.error === 'RefreshAccessTokenError' || !refreshedSession?.access_token) {
                console.error('❌ [useTokenExpirationCheck] Token refresh failed:', refreshedSession?.error || 'no access_token')
                throw new Error('Failed to refresh token: ' + (refreshedSession?.error || 'no access_token'))
              }
              
              console.log('✅ [useTokenExpirationCheck] Token refreshed successfully')
              return
            } catch (refreshError) {
              console.error('❌ [useTokenExpirationCheck] Token refresh failed:', refreshError)
              console.log('🚪 [useTokenExpirationCheck] Signing out user')
              await signOut({ redirect: false })
              
              // Redirect về trang chủ landing page sau khi logout
              const lang = pathname.split('/')[1] || 'vi'
              router.push(`/${lang}`)
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
  }, [session?.access_token, status, updateSession, router, pathname])

  return {
    isAuthenticated: status === 'authenticated',
    session
  }
}

export default useTokenExpirationCheck
