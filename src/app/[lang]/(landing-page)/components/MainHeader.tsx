'use client'

import React, { useState, useEffect, useContext } from 'react'

import Image from 'next/image'

import { motion, useScroll, useTransform } from 'framer-motion'

import Box from '@mui/material/Box'

import { SessionContext, useSession } from 'next-auth/react'

import { User } from 'lucide-react'

import VuexyLogo from '@core/svg/Logo'

import logo from '../../../../../public/images/logo/logo-minsoftware-new-small.png'
import MenuDesktop from './menus/MenuDesktop'
import MenuMobile from './menus/MenuMobile'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import AuthModal from '@/components/modals/AuthModal'
import { useModalContext } from '@/app/contexts/ModalContext'
import { useResponsive } from '@/app/hooks/useResponsive'

import CustomAvatar from '@core/components/mui/Avatar'
import CustomIconButton from '@core/components/mui/IconButton'

const MainHeader = () => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
  const { scrollY } = useScroll()
  const { isMobile } = useResponsive()
  const { openAuthModal } = useModalContext()
  const { data } = useContext(SessionContext)
  const session = useSession()

  // 1. ĐÃ XÓA: state `scrolled` và useEffect theo dõi scroll thủ công.
  //    Tất cả hiệu ứng scroll giờ đây đều do Framer Motion xử lý.

  // Đổi màu nền và các hiệu ứng khác khi scroll bằng Framer Motion
  const bgColor = useTransform(scrollY, [0, 80], ['#f9fafc', '#ffffff'])
  const shadow = useTransform(scrollY, [0, 80], ['0px 0px 0px rgba(0,0,0,0)', '0px 2px 8px rgba(0,0,0,0.1)'])
  const height = useTransform(scrollY, [0, 80], ['80px', '65px'])

  // Đóng menu mobile khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element

      if (isOpenMenu && !target.closest('.navbar-collapse') && !target.closest('.navbar-toggler')) {
        setIsOpenMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpenMenu])

  // Chặn scroll của body khi menu mobile mở
  useEffect(() => {
    if (isOpenMenu) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }

    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [isOpenMenu])

  // Hàm để đóng menu (được truyền xuống cho MenuMobile)
  const handleCloseMenu = () => {
    setIsOpenMenu(false)
  }

  // Hàm để bật/tắt menu mobile
  const toggleMobileMenu = () => {
    setIsOpenMenu(!isOpenMenu)
  }

  const handleOpenModalLogin = () => {
    openAuthModal('login')
  }

  const handleOpenModalRegister = () => {
    openAuthModal('register')
  }

  return (
    <>
      <motion.nav
        className='navbar navbar-expand-lg navbar-light navbar-custom sticky-top'
        style={{
          backgroundColor: bgColor,
          boxShadow: shadow,
          height: height
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className='container-lg'>
          {/* Logo */}
          <a className='navbar-brand navbar-brand-custom d-flex align-items-center logo' href='#'>
            <Image src='/images/logo/Logo_MKT_Proxy.png' alt='Logo_MKT_Proxy' width={180} height={50} />
          </a>

          <div className='header-mobile'>
            {/* Mobile Toggle */}
            <button
              className='navbar-toggler'
              type='button'
              style={{ border: 'none', boxShadow: 'none' }}
              onClick={toggleMobileMenu}
            >
              <span className='navbar-toggler-icon'></span>
            </button>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LanguageDropdown />
              {session && session.status === 'authenticated' ? (
                <UserDropdown />
              ) : (
                <CustomIconButton
                  aria-label='capture screenshot'
                  color='primary'
                  size='small'
                  onClick={handleOpenModalLogin}
                >
                  <User />
                </CustomIconButton>
              )}
            </Box>
          </div>

          <div className={` navbar-collapse ${isOpenMenu ? 'show' : ''}`} id='navbarNav'>
            {isMobile ? <MenuMobile onClose={handleCloseMenu} /> : <MenuDesktop />}
          </div>
        </div>
      </motion.nav>

      <AuthModal />
    </>
  )
}

export default MainHeader
