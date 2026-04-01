'use client'

import { useEffect, useRef, useState } from 'react'

import { usePathname } from 'next/navigation'

import { useSession } from 'next-auth/react'

import type { Locale } from '@/configs/configi18n'
import type { ChildrenType } from '@core/types'

import EmptyAuthPage from '@/components/EmptyAuthPage'

// Routes cho phép truy cập không cần đăng nhập
const PUBLIC_ROUTES = ['/home', '/proxy-tinh', '/proxy-xoay', '/check-proxy', '/docs-api']

export default function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const pathname = usePathname()
  const { status } = useSession()
  const wasAuthenticatedRef = useRef(false)
  const [settled, setSettled] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (status === 'authenticated') {
      clearTimeout(timerRef.current)
      wasAuthenticatedRef.current = true
      setSettled(true)
    } else if (status === 'unauthenticated') {
      // Chờ 800ms trước khi kết luận thật sự unauthenticated
      // NextAuth có thể trả 'unauthenticated' thoáng qua khi client navigation
      timerRef.current = setTimeout(() => setSettled(true), 800)
    }

    return () => clearTimeout(timerRef.current)
  }, [status])

  // Public routes: luôn render content
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.endsWith(route))
  if (isPublicRoute) return <>{children}</>

  // Đã đăng nhập → render content
  if (status === 'authenticated') return <>{children}</>

  // Loading hoặc chưa settled → LUÔN giữ content cũ nếu đã từng authenticated
  // Tránh flash trắng / flash login khi client navigation
  if (status === 'loading' || !settled) {
    if (wasAuthenticatedRef.current) return <>{children}</>
    return null
  }

  // Chắc chắn unauthenticated (settled = true, đợi đủ 800ms)
  wasAuthenticatedRef.current = false
  return <EmptyAuthPage lang={locale} />
}
