'use client'

import { useEffect, useRef } from 'react'

import { usePathname } from 'next/navigation'

import { useSession } from 'next-auth/react'

import type { Locale } from '@/configs/configi18n'
import type { ChildrenType } from '@core/types'

import EmptyAuthPage from '@/components/EmptyAuthPage'

// Routes cho phép truy cập không cần đăng nhập
const PUBLIC_ROUTES = ['/home', '/proxy-tinh', '/proxy-xoay', '/check-proxy', '/docs-api']

export default function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const wasAuthenticatedRef = useRef(false)

  useEffect(() => {
    if (status === 'authenticated') {
      wasAuthenticatedRef.current = true
    }
  }, [status])

  // Public routes: luôn render content
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.endsWith(route))
  if (isPublicRoute) return <>{children}</>

  // Đã đăng nhập → render content
  if (status === 'authenticated') return <>{children}</>

  // Đã từng authenticated trong session này → LUÔN giữ content
  // Nếu token chết thật → axios interceptor gặp 401 → refresh fail → signOut()
  // AuthGuard KHÔNG tự quyết định logout — chỉ BE mới xác nhận được token hết hạn
  if (wasAuthenticatedRef.current) return <>{children}</>

  // Đang loading lần đầu → chờ, không hiện gì
  if (status === 'loading') return null

  // Chưa bao giờ authenticated + BE xác nhận không có session → hiện login
  return <EmptyAuthPage lang={locale} />
}
