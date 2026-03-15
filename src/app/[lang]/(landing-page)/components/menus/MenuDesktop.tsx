'use client'

import { useContext } from 'react'

import { useParams, usePathname } from 'next/navigation'

import { SessionContext, useSession } from 'next-auth/react'

import { useTranslation } from 'react-i18next'

import { ArrowUpRight } from 'lucide-react'

import useMenuLandingPage from '@/app/data/MenuLandingPage'

import Link from '@components/Link'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import { useModalContext } from '@/app/contexts/ModalContext'

const navLinkBase: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: '#64748b',
  textDecoration: 'none',
  padding: '6px 14px',
  borderRadius: 8,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  whiteSpace: 'nowrap'
}

const navLinkActive: React.CSSProperties = {
  ...navLinkBase,
  color: 'var(--primary-hover, #ef4444)',
  fontWeight: 600
}

const ctaPillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  textDecoration: 'none',
  background: 'var(--primary-gradient, linear-gradient(135deg, #ef4444, #f97316))',
  color: 'white',
  padding: '8px 22px',
  borderRadius: 50,
  fontWeight: 600,
  fontSize: 13,
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap'
}

const textBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#475569',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  padding: '8px 16px',
  borderRadius: 8,
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap'
}

export default function MenuDesktop() {
  const pathname = usePathname()
  const params = useParams()
  const { openAuthModal } = useModalContext()
  const sessionContext = useContext(SessionContext)
  const { data } = sessionContext ?? {}
  const session = useSession()
  const { t } = useTranslation()
  const MenuLandingPage = useMenuLandingPage()

  const { lang: locale } = params

  const handleOpenModalLogin = () => openAuthModal('login')
  const handleOpenModalRegister = () => openAuthModal('register')

  return (
    <>
      {/* Nav Links — centered */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flex: 1,
          justifyContent: 'center'
        }}
      >
        {MenuLandingPage.map((item, index) => {
          const isActive = pathname === `/${locale}${item.href}`

          return (
            <Link
              key={index}
              href={`/${locale}${item.href}`}
              target={item.target}
              rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
              style={isActive ? navLinkActive : navLinkBase}
              onMouseEnter={e => {
                if (!isActive) {
                  ;(e.target as HTMLElement).style.color = '#0f172a'
                  ;(e.target as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.03)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  ;(e.target as HTMLElement).style.color = '#64748b'
                  ;(e.target as HTMLElement).style.backgroundColor = 'transparent'
                }
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <LanguageDropdown />

        {session && session.status === 'authenticated' ? (
          <Link href={`/${locale}/home`} target='_blank' style={ctaPillStyle}>
            Trang chủ
            <ArrowUpRight size={14} />
          </Link>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={handleOpenModalLogin}
              style={textBtnStyle}
              onMouseEnter={e => {
                ;(e.target as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.04)'
                ;(e.target as HTMLElement).style.color = '#0f172a'
              }}
              onMouseLeave={e => {
                ;(e.target as HTMLElement).style.backgroundColor = 'transparent'
                ;(e.target as HTMLElement).style.color = '#475569'
              }}
            >
              {t('landing.header.auth.login')}
            </button>
            <button
              onClick={handleOpenModalRegister}
              style={ctaPillStyle}
              onMouseEnter={e => {
                ;(e.target as HTMLElement).style.transform = 'translateY(-1px)'
                ;(e.target as HTMLElement).style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.2)'
              }}
              onMouseLeave={e => {
                ;(e.target as HTMLElement).style.transform = 'translateY(0)'
                ;(e.target as HTMLElement).style.boxShadow = 'none'
              }}
            >
              {t('landing.header.auth.register')}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
