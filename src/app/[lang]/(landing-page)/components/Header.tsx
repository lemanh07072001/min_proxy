'use client'

import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { useLanguageSync } from '@/hooks/useLanguageSync'

import MainHeader from '@/app/[lang]/(landing-page)/components/MainHeader'

interface HeaderProps {
  onToggleSidebar?: () => void
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { t } = useTranslation()

  useLanguageSync() // Sync language with URL
  
return (
    <>
      {/* Promotional Banner */}
      {/* <div className='promo-banner'>
        <div className='container-lg'>
          <div className='d-flex align-items-center justify-content-center flex-wrap py-2'>
            <span className='me-2'>🔥</span>
            <span className='me-3'>
              {t('landing.header.promoBanner.text', { appName: process.env.NEXT_PUBLIC_APP_NAME })}
            </span>
            <button className='promo-btn'>{t('landing.header.promoBanner.button')}</button>
          </div>
        </div>
      </div> */}

      {/* Main Header */}
      <MainHeader />
    </>
  )
}

export default Header
