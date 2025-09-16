'use client'

import { I18nextProvider } from 'react-i18next'

import i18n from '@/configs/i18n'

export default function I18nProvider({ 
  children, 
  locale 
}: { 
  children: React.ReactNode
  locale?: string 
}) {
  // Simple provider - let useLanguageSync handle the sync
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
