'use client'

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

  // Public routes: luôn render content, không cần auth
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.endsWith(route))

  if (isPublicRoute) {
    return <>{children}</>
  }

  // Đang loading session → không render gì (tránh flash)
  if (status === 'loading') {
    return null
  }

  // Đã đăng nhập → render content
  if (status === 'authenticated') {
    return <>{children}</>
  }

  // Chưa đăng nhập → hiện EmptyAuthPage (form login trong content area)
  return <EmptyAuthPage lang={locale} />
}
