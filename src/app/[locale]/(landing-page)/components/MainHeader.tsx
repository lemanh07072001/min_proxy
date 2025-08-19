'use client'
import { useState, useEffect } from 'react'

import Image from 'next/image'

import { motion, useScroll, useTransform } from 'framer-motion'

import logo from '../../../../../public/images/logo/logo.png'

import { useResponsive } from '@/app/hooks/useResponsive'


import AuthModal from '@/app/[locale]/(landing-page)/components/modals/AuthModal'
import MenuDesktop from './menus/MenuDesktop'


export default function MainHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [mode, setMode] = useState<string>('login')
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  const { isMobile } = useResponsive()

  // Đổi màu nền khi scroll
  const bgColor = useTransform(scrollY, [0, 80], ['#f9fafc', '#ffffff'])
  const shadow = useTransform(scrollY, [0, 80], ['0px 0px 0px rgba(0,0,0,0)', '0px 2px 8px rgba(0,0,0,0.1)'])
  const height = useTransform(scrollY, [0, 80], ['80px', '65px'])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        className='navbar navbar-expand-lg navbar-light navbar-custom sticky-top'
        style={{
          backgroundColor: bgColor,
          boxShadow: shadow,
          height: height,
          transition: 'all 0.3s ease'
        }}
      >
        <div className='container'>
          {/* Logo */}
          <a className='navbar-brand navbar-brand-custom d-flex align-items-center' href='#'>
            {/* <motion.div
              className='me-2 p-2 rounded'
              style={{
                background: 'linear-gradient(135deg, #ef4444, #f97316)',
                scale: scrolled ? 0.9 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              <Shield size={24} color='white' />
            </motion.div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1f2937', lineHeight: '1' }}>HOME</div>
              <div
                style={{ fontSize: '1rem', fontWeight: '700', color: '#ef4444', lineHeight: '1', marginTop: '-2px' }}
              >
                PROXY
              </div>
            </div> */}
            <Image src={logo} alt="dsa"width={80} height={80} />
          </a>

          {/* Mobile Toggle */}
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
            style={{ border: 'none', boxShadow: 'none' }}
          >
            <span className='navbar-toggler-icon'></span>
          </button>

          {/* Navigation */}
          <div className='collapse navbar-collapse' id='navbarNav'>
            {isMobile ? null : <MenuDesktop setIsOpen={setIsOpen} setMode={setMode} />}
          </div>
        </div>
      </motion.nav>

      <AuthModal isOpen={isOpen} isMode={mode} setMode={setMode} onClose={() => setIsOpen(false)} />
    </>
  )
}
