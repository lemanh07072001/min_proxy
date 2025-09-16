'use client'

import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'

import i18n from '@/configs/i18n'

export default function I18nProvider({ 
  children, 
  locale 
}: { 
  children: React.ReactNode
  locale?: string 
}) {
  useEffect(() => {
    if (locale && i18n.isInitialized && i18n.language !== locale) {
      i18n.changeLanguage(locale)
    }
  }, [locale])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
