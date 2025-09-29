'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

import type { Locale } from '@/configs/configi18n'
import EmptyAuthPage from './EmptyAuthPage'

const AuthRedirect = ({ lang, children }: { lang: Locale; children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Nếu đã có session thì chuyển hướng về overview
    if (status === 'authenticated') {
      router.push(`/${lang}/overview`)
    }
  }, [status, router, lang])

  // Khi chưa xác định trạng thái, có thể hiển thị loading hoặc rỗng
  if (status === 'loading') {
    return null
  }

  // Nếu chưa login => hiện EmptyAuthPage
  if (!session) {
    return <EmptyAuthPage lang={lang} />
  }

  // Nếu đã login nhưng bạn muốn render children ngay khi redirect xong
  return <>{children}</>
}

export default AuthRedirect
