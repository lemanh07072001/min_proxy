"use client"

import {useSelectedLayoutSegment} from 'next/navigation';

import MenuLandingPage from '@/app/data/MenuLandingPage'
import { Link } from '@/i18n/navigation'

import LanguageSelect from '@components/language-selector/LanguageSelect'

type AuthProps = {
  setIsOpen: (value: boolean) => void
  setMode: (value: string) => void
}

export default function MenuDesktop({ setIsOpen, setMode }: AuthProps) {

  const selectedLayoutSegment = useSelectedLayoutSegment();

  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/';

  const handleOpenModalLogin = () => {
    setIsOpen(true)
    setMode('login')
  }

  const handleOpenModalRegister = () => {
    setIsOpen(true)
    setMode('register')
  }

  return (
    <>
      <ul className='navbar-nav mx-auto'>
        {MenuLandingPage.map((item, index) => {

          const isActive = pathname === item.href

          return (
            <li key={index} className='nav-item'>
              <Link href={item.href} className={`nav-link nav-link-custom ${isActive ? 'active' : ''}`}>
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>

      <LanguageSelect />

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
