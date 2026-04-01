'use client'

import React, { useState, useEffect, useContext, useCallback } from 'react'

import Image from 'next/image'
import dynamic from 'next/dynamic'

import Box from '@mui/material/Box'

import { SessionContext, useSession } from 'next-auth/react'

import { User } from 'lucide-react'

import { useBranding } from '@/app/contexts/BrandingContext'

import MenuDesktop from './menus/MenuDesktop'
import MenuMobile from './menus/MenuMobile'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

const AuthModal = dynamic(() => import('@/components/modals/AuthModal'), { ssr: false })

import { useModalContext } from '@/app/contexts/ModalContext'
import { useResponsive } from '@/app/hooks/useResponsive'

import CustomIconButton from '@core/components/mui/IconButton'

interface MainHeaderProps {
  serverLogo?: string
  serverName?: string
}

const MainHeader = ({ serverLogo, serverName }: MainHeaderProps) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isMobile } = useResponsive()
  const { openAuthModal } = useModalContext()
  const sessionContext = useContext(SessionContext)
  const session = useSession()
  const { logo: clientLogo, logoIcon: clientLogoIcon, name: clientName } = useBranding()

  const { isChild } = useBranding()

  // Ưu tiên server logo → client logo → file mặc định (site mẹ)
  const logo = serverLogo || clientLogo || (!isChild ? '/images/logo/Logo_MKT_Proxy.png' : '')
  const logoIcon = clientLogoIcon || ''
  const name = serverName || clientName

  const isUnauthenticated = session?.status === 'unauthenticated'

  // Lightweight scroll listener thay cho framer-motion
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Đóng menu mobile khi bấm ra ngoài
  useEffect(() => {
    if (!isOpenMenu) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element

      if (!target.closest('.navbar-collapse') && !target.closest('.navbar-toggler')) {
        setIsOpenMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpenMenu])

  // Chặn scroll khi menu mobile mở
  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpenMenu)

    return () => document.body.classList.remove('menu-open')
  }, [isOpenMenu])

  const handleCloseMenu = useCallback(() => setIsOpenMenu(false), [])
  const toggleMobileMenu = useCallback(() => setIsOpenMenu(prev => !prev), [])
  const handleOpenModalLogin = useCallback(() => openAuthModal('login'), [openAuthModal])

  return (
    <>
      <nav
        className='navbar navbar-expand-lg navbar-light navbar-custom sticky-top'
        style={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.92)',
          boxShadow: scrolled
            ? '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.03)'
            : 'none',
          height: scrolled ? 62 : 72,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            margin: '0 auto',
            width: '100%',
            padding: { xs: '0 12px', sm: '0 20px', md: '0 28px' },
            display: 'flex',
            alignItems: 'center',
            height: '100%'
          }}
        >
          {/* Logo — mobile: icon thu gọn, desktop: full logo */}
          <a href='#' style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            {/* Mobile: logo icon thu gọn */}
            {logoIcon && (
              <Box
                component='img'
                src={logoIcon}
                alt={name}
                sx={{
                  display: { xs: 'block', lg: 'none' },
                  objectFit: 'contain',
                  width: 32, height: 32,
                }}
              />
            )}
            {/* Mobile fallback: full logo thu nhỏ nếu không có icon */}
            {!logoIcon && logo && (
              <Box
                component='img'
                src={logo}
                alt={name}
                sx={{
                  display: { xs: 'block', lg: 'none' },
                  objectFit: 'contain',
                  maxHeight: 32, width: 'auto', maxWidth: 100,
                }}
              />
            )}
            {/* Desktop: full logo */}
            {logo ? (
              <Box
                component='img'
                src={logo}
                alt={name}
                sx={{
                  display: { xs: 'none', lg: 'block' },
                  objectFit: 'contain',
                  maxHeight: 42, width: 'auto', maxWidth: 150,
                }}
              />
            ) : (
              <Box component='span' sx={{ display: { xs: 'none', lg: 'block' }, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{name}</Box>
            )}
            {/* Mobile fallback: tên nếu không có cả logo lẫn icon */}
            {!logoIcon && !logo && name && (
              <Box component='span' sx={{ display: { xs: 'block', lg: 'none' }, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{name}</Box>
            )}
          </a>

          {/* Mobile: hamburger cạnh logo, actions bên phải */}
          <div className='header-mobile'>
            <button
              className='navbar-toggler'
              type='button'
              style={{ border: 'none', boxShadow: 'none', padding: '4px 6px', marginLeft: 4 }}
              onClick={toggleMobileMenu}
            >
              <span className='navbar-toggler-icon' style={{ width: 20, height: 20 }}></span>
            </button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', ml: 'auto' }}>
              <LanguageDropdown />
              <div style={{ display: isUnauthenticated ? 'none' : 'flex' }}>
                <UserDropdown />
              </div>
              {isUnauthenticated && (
                <CustomIconButton aria-label='login' color='primary' size='small' onClick={handleOpenModalLogin}>
                  <User />
                </CustomIconButton>
              )}
            </Box>
          </div>

          {/* Desktop/Mobile nav content */}
          <div className={`navbar-collapse ${isOpenMenu ? 'show' : ''}`} id='navbarNav' style={{ flex: 1 }}>
            {isMobile ? <MenuMobile onClose={handleCloseMenu} /> : <MenuDesktop />}
          </div>
        </Box>
      </nav>

      <AuthModal />
    </>
  )
}

export default MainHeader
