'use client'

import { useEffect, useRef } from 'react'

import { useRouter, usePathname } from 'next/navigation'

import { useSession, signOut } from 'next-auth/react'

/**
 * Component global để cleanup session cũ trên toàn bộ ứng dụng
 * Chạy ngay lập tức khi component mount và kiểm tra định kỳ
 */
const GlobalSessionCleanup = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const hasCheckedRef = useRef(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Chỉ kiểm tra khi có session
    if (status === 'authenticated' && session) {
      console.log('🧹 [GlobalSessionCleanup] Checking session validity...')

      const cleanupSession = async () => {
        try {
          // Kiểm tra nếu session có error
          if (session?.error === 'TokenExpiredError') {
            console.log('🧹 [GlobalSessionCleanup] Found invalid session with error, cleaning up...')
            await signOut({ redirect: false })
            const lang = pathname.split('/')[1] || 'vi'

            router.push(`/${lang}`)
            
return
          }

          // Kiểm tra nếu không có access_token
          if (!session?.access_token) {
            console.log('🧹 [GlobalSessionCleanup] Found session without access_token, cleaning up...')
            await signOut({ redirect: false })
            const lang = pathname.split('/')[1] || 'vi'

            router.push(`/${lang}`)
            
return
          }

          // Kiểm tra token validity bằng cách gọi API
          const response = await fetch('/api/me', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            }
          })

          if (response.status === 401) {
            console.log('🧹 [GlobalSessionCleanup] Token is invalid, cleaning up...')
            await signOut({ redirect: false })
            const lang = pathname.split('/')[1] || 'vi'

            router.push(`/${lang}`)
            
return
          }

          console.log('✅ [GlobalSessionCleanup] Session is valid')
        } catch (error) {
          console.error('❌ [GlobalSessionCleanup] Error during cleanup:', error)

          // Nếu có lỗi, cũng cleanup session để đảm bảo
          await signOut({ redirect: false })
          const lang = pathname.split('/')[1] || 'vi'

          router.push(`/${lang}`)
        }
      }

      // Chạy cleanup ngay lập tức
      if (!hasCheckedRef.current) {
        hasCheckedRef.current = true
        cleanupSession()
      }

      // Thiết lập interval để kiểm tra định kỳ (mỗi 5 phút)
      if (!intervalRef.current) {
        intervalRef.current = setInterval(cleanupSession, 5 * 60 * 1000)
      }
    }

    // Cleanup interval khi component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [session, status, router, pathname])

  // Component này không render gì, chỉ để chạy logic cleanup
  return null
}

export default GlobalSessionCleanup

