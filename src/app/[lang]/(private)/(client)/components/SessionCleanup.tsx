'use client'

import { useEffect, useRef } from 'react'

import { useRouter, usePathname } from 'next/navigation'

import { useSession, signOut } from 'next-auth/react'

/**
 * Component tối ưu để cleanup session cũ khi vào client private pages
 * Chạy ngay lập tức khi component mount
 */
const SessionCleanup = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const hasCheckedRef = useRef(false)

  useEffect(() => {
    // Chỉ kiểm tra một lần khi component mount
    if (status === 'authenticated' && !hasCheckedRef.current) {
      hasCheckedRef.current = true
      console.log('🧹 [SessionCleanup] Checking session validity on mount...')

      const cleanupSession = async () => {
        try {
          // Kiểm tra nếu session có error
          if (session?.error === 'TokenExpiredError') {
            console.log('🧹 [SessionCleanup] Found invalid session with error, cleaning up...')
            await signOut({ redirect: false })
            const lang = pathname.split('/')[1] || 'vi'

            router.push(`/${lang}`)
            
return
          }

          // Kiểm tra nếu không có access_token
          if (!session?.access_token) {
            console.log('🧹 [SessionCleanup] Found session without access_token, cleaning up...')
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
            console.log('🧹 [SessionCleanup] Token is invalid, cleaning up...')
            await signOut({ redirect: false })
            const lang = pathname.split('/')[1] || 'vi'

            router.push(`/${lang}`)
            
return
          }

          console.log('✅ [SessionCleanup] Session is valid')
        } catch (error) {
          console.error('❌ [SessionCleanup] Error during cleanup:', error)

          // Nếu có lỗi, cũng cleanup session để đảm bảo
          await signOut({ redirect: false })
          const lang = pathname.split('/')[1] || 'vi'

          router.push(`/${lang}`)
        }
      }

      cleanupSession()
    }
  }, [session, status, router, pathname])

  // Component này không render gì, chỉ để chạy logic cleanup
  return null
}

export default SessionCleanup
