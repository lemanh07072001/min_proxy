'use client'

import Image from 'next/image'

import { useParams, usePathname } from 'next/navigation'

import useMenuLandingPage from '@/app/data/MenuLandingPage'
import Link from '@components/Link'
import { useModalContext } from '@/app/contexts/ModalContext'

interface MenuMobileProps {
  onClose?: () => void
}

export default function MenuMobile({ onClose }: MenuMobileProps) {
  const { openAuthModal } = useModalContext()
  const MenuLandingPage = useMenuLandingPage()

  const pathname = usePathname()
  const params = useParams()

  const { lang: locale } = params

  return (
    <div className='menu-container'>
      <div className='mobile-header'>
        <div className='mobile-logo'>
          <Image src='/images/logo/Logo_MKT_Proxy.png' alt='Logo_MKT_Proxy' width={180} height={50} />
        </div>
        {/* Close Button */}
        <button className='btn-close-menu' onClick={onClose} aria-label='Đóng menu'>
          ✕
        </button>
      </div>

      <ul className='navbar-nav mx-auto menu-mobile'>
        {MenuLandingPage.map((page, key) => {
          const isActive = pathname === `/${locale}${page.href}`

          return (
            <li key={key} className='nav-item'>
              <Link
                className={`nav-link nav-link-custom ${isActive ? 'active' : ''}`}
                href={`/${locale}${page.href}`}
                target={page.target}
                rel={page.target === '_blank' ? 'noopener noreferrer' : undefined}
                onClick={onClose}
              >
                {page.label}
              </Link>
            </li>
          )
        })}
      </ul>

      {/*<div className='d-flex align-items-center gap-2 flex-column flex-lg-row'>*/}
      {/*  <button className='btn btn-gradient-primary me-lg-2 ' onClick={handleRegister}>*/}
      {/*    Đăng ký*/}
      {/*  </button>*/}
      {/*  <button className='btn btn-gradient-primary' onClick={handleLogin}>*/}
      {/*    Đăng nhập*/}
      {/*  </button>*/}
      {/*</div>*/}
    </div>
  )
}
