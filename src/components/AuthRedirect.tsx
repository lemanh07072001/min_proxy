'use client'

// Type Imports
import type { Locale } from '@configs/i18n'

// Component Imports
import EmptyAuthPage from './EmptyAuthPage'

const AuthRedirect = ({ lang }: { lang: Locale }) => {
  // Thay vì redirect, hiển thị EmptyAuthPage ngay tại route hiện tại
  return <EmptyAuthPage lang={lang} />
}

export default AuthRedirect
