'use client'

// React Imports
import { useContext } from 'react'

import { createPortal } from 'react-dom'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import { SessionContext, useSession } from 'next-auth/react'

import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import AuthModal from '@/components/modals/AuthModal'
import { useModalContext } from '@/app/contexts/ModalContext'

// Style Imports
import '@/app/[lang]/(landing-page)/main.css'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import Button from '@mui/material/Button'

const NavbarContent = () => {
  // Log session để debug
  const session = useSession()
  const { openAuthModal } = useModalContext();

  console.log(session)
  const handleOpenLoginModal = () => {
      openAuthModal('login')
  }

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        <ModeDropdown />

        {/* Hiển thị thông tin user khi đã đăng nhập - KHÔNG flicker */}
        {session.status === 'authenticated' && (
          <div className='hidden md:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm'>
            <span className='text-green-600'>●</span>
            <span className='text-gray-700'>{session?.user?.name || session?.user?.email || 'User'}</span>
          </div>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <LanguageDropdown />

        {/* Hiển thị UserDropdown nếu đã đăng nhập, button đăng nhập nếu chưa */}
        {session.status === 'authenticated' ? (
          <UserDropdown />
        ) : (
          <Button
            onClick={handleOpenLoginModal}
            sx={{
              '&.MuiButtonBase-root': {
                background: 'var(--primary-gradient)',
                color: 'var(--primary-color-main) !important',
              }

            }}
          >
            Đăng nhập
          </Button>
        )}
      </div>

      {/* AuthModal - Render trong Portal để tránh constraints */}
      {typeof window !== 'undefined' &&
        createPortal(
          <AuthModal />,
          document.body
        )}
    </div>
  )
}

export default NavbarContent
