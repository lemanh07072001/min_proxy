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
  // Chờ session ổn định — tránh flash login khi reload
  // NextAuth có thể trả 'unauthenticated' thoáng qua trước khi sync cookie → authenticated
  const [settled, setSettled] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (status === 'authenticated') {
      // Authenticated ngay → clear timer, settled
      clearTimeout(timerRef.current)
      setSettled(true)
    } else if (status === 'unauthenticated') {
      // Chờ 500ms trước khi kết luận thật sự unauthenticated
      // Đủ để NextAuth sync session từ cookie nếu có
      timerRef.current = setTimeout(() => setSettled(true), 500)
    }

    return () => clearTimeout(timerRef.current)
  }, [status])

  // Public routes: luôn render content, không cần auth
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.endsWith(route))

  if (isPublicRoute) {
    return <>{children}</>
  }

  // Track trạng thái đã từng authenticated
  if (status === 'authenticated') {
    wasAuthenticatedRef.current = true
  }

  // Đang loading session — giữ content cũ hoặc chờ
  if (status === 'loading') {
    if (wasAuthenticatedRef.current) {
      return <>{children}</>
    }

    return null
  }

  // Đã đăng nhập → render content
  if (status === 'authenticated') {
    return <>{children}</>
  }

  // Session chưa ổn định (vừa mount, status chớp unauthenticated) → chờ
  if (!settled) {
    return null
  }

  // Chắc chắn unauthenticated → hiện login
  wasAuthenticatedRef.current = false

  return <EmptyAuthPage lang={locale} />
}
