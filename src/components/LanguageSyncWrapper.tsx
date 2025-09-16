'use client'

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'next/navigation'

interface LanguageSyncWrapperProps {
  children: React.ReactNode
}

export default function LanguageSyncWrapper({ children }: LanguageSyncWrapperProps) {
  const { i18n } = useTranslation()
  const { lang } = useParams()

  useEffect(() => {
    // Sync i18n với URL language khi component mount
    if (i18n.isInitialized && lang && lang !== i18n.language) {
      console.log('Syncing i18n language from', i18n.language, 'to', lang)
      i18n.changeLanguage(lang as string)
    }
  }, [i18n, lang])

  return <>{children}</>
}
