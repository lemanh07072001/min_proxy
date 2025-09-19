'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface ClientSessionGuardProps {
  children: React.ReactNode
}

/**
 * Component guard để kiểm tra session ngay khi vào trang
 * Tự động logout nếu session không hợp lệ
 */
const ClientSessionGuard = ({ children }: ClientSessionGuardProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const hasCheckedRef = useRef(false)

  useEffect(() => {
    // Chỉ kiểm tra một lần khi component mount
    if (status === 'authenticated' && !hasCheckedRef.current) {
      hasCheckedRef.current = true
      console.log('🛡️ [ClientSessionGuard] Checking session validity...')

      const checkSession = async () => {
        try {
          // Kiểm tra nếu session có error
          if (session?.error === 'RefreshAccessTokenError') {
            console.log('🛡️ [ClientSessionGuard] Session has refresh error, signing out...')
            await signOut({ redirect: false })
            const lang = pathname.split('/')[1] || 'vi'
            router.push(`/${lang}`)
            return
          }

          // Kiểm tra nếu không có access_token
          if (!session?.access_token) {
            console.log('🛡️ [ClientSessionGuard] No access_token, signing out...')
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
            console.log('🛡️ [ClientSessionGuard] Token is invalid, signing out...')
            await signOut({ redirect: false })
            const lang = pathname.split('/')[1] || 'vi'
            router.push(`/${lang}`)
            return
          }

          console.log('✅ [ClientSessionGuard] Session is valid')
        } catch (error) {
          console.error('❌ [ClientSessionGuard] Error checking session:', error)
          // Nếu có lỗi, cũng logout để đảm bảo
          await signOut({ redirect: false })
          const lang = pathname.split('/')[1] || 'vi'
          router.push(`/${lang}`)
        }
      }

      checkSession()
    }
  }, [session, status, router, pathname])

  // Hiển thị loading khi đang kiểm tra
  if (status === 'loading') {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-white'>
        <div className='animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-orange-500' />
      </div>
    )
  }

  // Nếu không authenticated, không render children
  if (status !== 'authenticated') {
    return null
  }

  // Nếu authenticated, render children
  return <>{children}</>
}

export default ClientSessionGuard
