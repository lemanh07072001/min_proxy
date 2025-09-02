'use client'

// React Imports
import { useContext, useState } from 'react'

import { createPortal } from 'react-dom'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import { SessionContext } from 'next-auth/react'

import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import AuthModal from '@/components/modals/AuthModal'

// Style Imports
import '@/app/[lang]/(landing-page)/main.css'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

import LanguageDropdown from '@components/layout/shared/LanguageDropdown'



const NavbarContent = () => {
  // States for AuthModal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  // Log session để debug
  const {data} = useContext(SessionContext);


  const handleOpenLoginModal = () => {
    setAuthMode('login')
    setIsAuthModalOpen(true)
  }

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        <ModeDropdown />

        {/* Hiển thị thông tin user khi đã đăng nhập - KHÔNG flicker */}
        {data && (
          <div className='hidden md:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm'>
            <span className='text-green-600'>●</span>
            <span className='text-gray-700'>{data.user?.name || data.user?.email || 'User'}</span>
          </div>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <LanguageDropdown />

        {/* Hiển thị UserDropdown nếu đã đăng nhập, button đăng nhập nếu chưa */}
        {data ? (
          <UserDropdown session={data} />
        ) : (
          <button
            onClick={handleOpenLoginModal}
            className='px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Đăng nhập
          </button>
        )}
      </div>

      {/* AuthModal - Render trong Portal để tránh constraints */}
      {typeof window !== 'undefined' &&
        createPortal(
          <AuthModal
            isOpen={isAuthModalOpen}
            isMode={authMode}
            onClose={handleCloseAuthModal}
            setMode={(mode: string) => setAuthMode(mode as 'login' | 'register')}
          />,
          document.body
        )}
    </div>
  )
}

export default NavbarContent
