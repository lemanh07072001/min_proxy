'use client'

import { useContext } from 'react'

import { useParams, usePathname } from 'next/navigation'

import { SessionContext } from 'next-auth/react'

import { useTranslation } from 'react-i18next'

import useMenuLandingPage from '@/app/data/MenuLandingPage'

import LanguageSelect from '@components/language-selector/LanguageSelect'

import Link from '@components/Link'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import { useModalContext } from '@/app/contexts/ModalContext'

import UserDropdown from '@components/layout/shared/UserDropdown'

export default function MenuDesktop() {
  const pathname = usePathname()
  const params = useParams()
  const { openAuthModal } = useModalContext()
  const { data } = useContext(SessionContext)
  const { t } = useTranslation()
  const MenuLandingPage = useMenuLandingPage()

  const { lang: locale } = params

  const handleOpenModalLogin = () => {
    openAuthModal('login')
  }

  const handleOpenModalRegister = () => {
    openAuthModal('register')
  }

  return (
    <>
      <ul className='navbar-nav mx-auto'>
        {MenuLandingPage.map((item, index) => {
          const isActive = pathname === `/${locale}${item.href}`

          return (
            <li key={index} className='nav-item'>
              <Link
                href={`/${locale}${item.href}`}
                className={`nav-link nav-link-custom ${isActive ? 'active' : ''}`}
                target={item.target}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>

      <div className='flex items-center gap-2'>
        <LanguageDropdown />

        {data ? (
          <UserDropdown session={data} />
        ) : (
          <div className='d-flex align-items-center gap-2'>
            <button
              className='btn btn-gradient-primary me-2'
              style={{ padding: '5px 20px' }}
              onClick={handleOpenModalRegister}
            >
              {t('landing.header.auth.register')}
            </button>
            <button className='btn btn-gradient-primary' style={{ padding: '5px 20px' }} onClick={handleOpenModalLogin}>
              {t('landing.header.auth.login')}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
