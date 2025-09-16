'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { getCurrentLocale } from '@/utils/languageUtils'

export const useLanguageSync = () => {
  const pathname = usePathname()
  const { i18n } = useTranslation()
  const [isSynced, setIsSynced] = useState(false)
  
  const currentLocale = getCurrentLocale(pathname)
  
  useEffect(() => {
    console.log('useLanguageSync effect:', {
      isInitialized: i18n.isInitialized,
      currentLocale,
      i18nLanguage: i18n.language,
      pathname
    })
    
    if (i18n.isInitialized && currentLocale && currentLocale !== i18n.language) {
      console.log('Changing language from', i18n.language, 'to', currentLocale)
      i18n.changeLanguage(currentLocale).then(() => {
        console.log('Language changed successfully to', currentLocale)
        setIsSynced(true)
      }).catch((error) => {
        console.error('Failed to change language:', error)
        setIsSynced(false)
      })
    } else if (i18n.isInitialized && currentLocale && currentLocale === i18n.language) {
      setIsSynced(true)
    }
  }, [pathname, currentLocale, i18n])
  
  return {
    currentLocale,
    i18nLanguage: i18n.language,
    isSynced,
    isLoading: !i18n.isInitialized
  }
}
