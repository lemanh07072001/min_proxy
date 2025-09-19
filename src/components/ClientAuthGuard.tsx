'use client'

import { useClientAuthGuard } from '@/hooks/useClientAuthGuard'
import type { Locale } from '@/configs/configi18n'
import EmptyAuthPage from './EmptyAuthPage'

interface ClientAuthGuardProps {
  children: React.ReactNode
  locale: Locale
}

/**
 * Component wrapper để kiểm tra authentication trên client-side
 * Tự động hiển thị EmptyAuthPage khi token hết hạn
 */
const ClientAuthGuard = ({ children, locale }: ClientAuthGuardProps) => {
  const { isAuthenticated, isLoading } = useClientAuthGuard()

  // Hiển thị loading khi đang kiểm tra
  if (isLoading) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-white'>
        <div className='animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-orange-500' />
      </div>
    )
  }

  // Nếu không authenticated, hiển thị EmptyAuthPage
  if (!isAuthenticated) {
    return <EmptyAuthPage lang={locale} />
  }

  // Nếu authenticated, hiển thị children
  return <>{children}</>
}

export default ClientAuthGuard
