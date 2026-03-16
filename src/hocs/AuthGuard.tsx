'use client'

import { useRef } from 'react'

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

  // Public routes: luôn render content, không cần auth
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.endsWith(route))

  if (isPublicRoute) {
    return <>{children}</>
  }

  // Track trạng thái đã từng authenticated
  if (status === 'authenticated') {
    wasAuthenticatedRef.current = true
  }

  // Đang loading session — nếu đã authenticated trước đó thì giữ content, không flash trắng
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

  // Chưa đăng nhập → hiện EmptyAuthPage
  wasAuthenticatedRef.current = false

  return <EmptyAuthPage lang={locale} />
}
