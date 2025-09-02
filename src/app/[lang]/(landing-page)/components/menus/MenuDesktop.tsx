"use client"

import { useParams, usePathname } from 'next/navigation'

import MenuLandingPage from '@/app/data/MenuLandingPage'

import LanguageSelect from '@components/language-selector/LanguageSelect'

import Link from '@components/Link';
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import { useModalContext } from '@/app/contexts/ModalContext'

export default function MenuDesktop() {
  const pathname = usePathname()
  const params = useParams()
  const { openAuthModal } = useModalContext()

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

          const isActive = pathname === `/${locale }${item.href}`

          return (
            <li key={index} className='nav-item'>
              <Link
                href={`/${locale }${item.href}`}
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

      <div className="me-2">
        <LanguageDropdown />
      </div>

      <div className='d-flex align-items-center gap-2'>
        <button className='btn btn-gradient-primary me-2' onClick={handleOpenModalRegister}>
          Đăng ký
        </button>
        <button className='btn btn-gradient-primary' onClick={handleOpenModalLogin}>
          Đăng nhập
        </button>
      </div>
    </>
  )
}
