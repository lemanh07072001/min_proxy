'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Hook để cleanup session cũ khi login mới
 * Kiểm tra và clear session không hợp lệ
 */
export const useSessionCleanup = () => {
  const { data: session, status, update: updateSession } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const hasCheckedRef = useRef(false)

  useEffect(() => {
    // Chỉ kiểm tra khi user đã authenticated
    if (status === 'authenticated') {
      console.log('🧹 [useSessionCleanup] Checking session validity...')

      const cleanupSession = async () => {
        try {
          // Kiểm tra nếu session có error
          if (session?.error === 'RefreshAccessTokenError') {
            console.log('🧹 [useSessionCleanup] Found invalid session with error, cleaning up...')
            await signOut({ redirect: false })
            const lang = pathname.split('/')[1] || 'vi'
            router.push(`/${lang}`)
            return
          }

          // Kiểm tra nếu không có access_token
          if (!session?.access_token) {
            console.log('🧹 [useSessionCleanup] Found session without access_token, cleaning up...')
            await signOut({ redirect: false })
            const lang = pathname.split('/')[1] || 'vi'
            router.push(`/${lang}`)
            return
          }

          // Kiểm tra token validity bằng cách gọi API (chỉ khi chưa check)
          if (!hasCheckedRef.current) {
            hasCheckedRef.current = true
            
            const response = await fetch('/api/me', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
              }
            })

            if (response.status === 401) {
              console.log('🧹 [useSessionCleanup] Token is invalid, cleaning up...')
              await signOut({ redirect: false })
              const lang = pathname.split('/')[1] || 'vi'
              router.push(`/${lang}`)
              return
            }

            console.log('✅ [useSessionCleanup] Session is valid')
          }
        } catch (error) {
          console.error('❌ [useSessionCleanup] Error during cleanup:', error)
          // Nếu có lỗi, cũng cleanup session để đảm bảo
          await signOut({ redirect: false })
          const lang = pathname.split('/')[1] || 'vi'
          router.push(`/${lang}`)
        }
      }

      cleanupSession()
    }

    // Reset flag khi session thay đổi
    if (status !== 'authenticated') {
      hasCheckedRef.current = false
    }
  }, [session, status, router, pathname])

  return {
    isSessionValid: status === 'authenticated' && session?.access_token && !session?.error
  }
}

export default useSessionCleanup
