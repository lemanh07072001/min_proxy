'use client'

import { useParams, useRouter } from 'next/navigation'

import { createPortal } from 'react-dom'

import classnames from 'classnames'

import { useSession } from 'next-auth/react'

import Button from '@mui/material/Button'

import { Clock, Wallet } from 'lucide-react'

import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'

import { useBranding } from '@/app/contexts/BrandingContext'

import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import AuthModal from '@/components/modals/AuthModal'
import { useModalContext } from '@/app/contexts/ModalContext'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'


import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import { usePendingBankQr } from '@/hooks/apis/useBankQr'

const NavbarContent = () => {
  const session = useSession()
  const router = useRouter()
  const params = useParams()
  const locale = params.lang || 'vi'

  const { openAuthModal } = useModalContext()
  const { primaryHover } = useBranding()

  const isAuthenticated = session.status === 'authenticated'
  const { data: pendingData } = usePendingBankQr(isAuthenticated)
  const pendingRecord = pendingData?.data ?? null

  const handleOpenLoginModal = () => {
    openAuthModal('login')
  }

  const handleNavigateRecharge = () => {
    router.push(`/${locale}/recharge`)
  }

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        <ModeDropdown />

      </div>
      <div className='flex items-center gap-2'>
        {isAuthenticated && pendingRecord && (
          <Box
            onClick={handleNavigateRecharge}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#fffbeb',
              border: '1px solid #f59e0b',
              borderRadius: '10px',
              padding: '6px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              animation: 'pulse-border 2s infinite',
              '@keyframes pulse-border': {
                '0%, 100%': { borderColor: '#f59e0b' },
                '50%': { borderColor: '#fbbf24' }
              },
              '&:hover': {
                background: '#fef3c7',
                borderColor: '#d97706'
              }
            }}
          >
            <Clock size={18} color='#d97706' />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', lineHeight: 1.3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#92400e' }}>
                Chờ thanh toán: {Number(pendingRecord.amount).toLocaleString('vi-VN')}đ
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#b45309' }}>
                {pendingRecord.transaction_code} • {new Date(pendingRecord.created_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Box>
        )}

        {isAuthenticated ? (
          <Button
            variant='outlined'
            onClick={handleNavigateRecharge}
            sx={{
              padding: '7px 10px',
              fontSize: '0.875rem',
              display: 'flex',
              gap: '10px',
              borderColor: primaryHover,
              color: primaryHover,
              '&:hover': {
                borderColor: primaryHover,
                backgroundColor: `${primaryHover}14`,
              }
            }}
          >
            <Wallet size={16} />
            Nạp tiền
          </Button>
        ) : null}

        <LanguageDropdown />

        {/* Hiển thị UserDropdown nếu đã đăng nhập, button đăng nhập nếu chưa */}

        {session.status === 'authenticated' ? (
          <UserDropdown />
        ) : (
          <Button
            onClick={handleOpenLoginModal}
            className='px-4 py-2 text-sm  text-white rounded-lg h transition-colors'
            sx={{
              '&.MuiButtonBase-root': {
                background: 'var(--primary-gradient)'
              }
            }}
          >
            Đăng nhập
          </Button>
        )}
      </div>

      {/* AuthModal - Render trong Portal để tránh constraints */}
      {typeof window !== 'undefined' && createPortal(<AuthModal />, document.body)}
    </div>
  )
}

export default NavbarContent
