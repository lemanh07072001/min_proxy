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
import PartnersBannerInline from '@/components/PartnersBannerInline'
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
  const isUnauthenticated = session.status === 'unauthenticated'
  const { data: pendingData } = usePendingBankQr(isAuthenticated)
  const pendingRecord = pendingData?.data ?? null
  const hasPending = (isAuthenticated || !isUnauthenticated) && !!pendingRecord

  const handleOpenLoginModal = () => {
    openAuthModal('login')
  }

  const handleNavigateRecharge = () => {
    router.push(`/${locale}/recharge`)
  }

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between is-full')} style={{ height: '100%', gap: 8, overflow: 'hidden' }}>
      {/* Phần trái: toggle + banner — ẩn banner mobile khi có pending */}
      <div className='flex items-center gap-2' style={{ minWidth: 0, flexShrink: 1, height: '100%', overflow: 'hidden' }}>
        <NavToggle />
        <Box sx={{ display: hasPending ? { xs: 'none', sm: 'block' } : 'block', overflow: 'hidden', minWidth: 0 }}>
          <PartnersBannerInline />
        </Box>
      </div>

      {/* Phần phải: actions */}
      <div className='flex items-center' style={{ flexShrink: 0, gap: 6 }}>
        {/* Chờ thanh toán — mobile: compact (icon+tiền), tablet: 1 dòng, desktop: đầy đủ */}
        {hasPending && (
          <Box
            onClick={handleNavigateRecharge}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: '4px', md: '10px' },
              background: '#fffbeb',
              border: '1px solid #f59e0b',
              borderRadius: { xs: '8px', md: '10px' },
              padding: { xs: '4px 8px', md: '6px 14px' },
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
            <Clock size={16} color='#d97706' style={{ flexShrink: 0 }} />
            {/* Mobile: chỉ số tiền */}
            <Typography sx={{ display: { xs: 'block', md: 'none' }, fontWeight: 700, fontSize: '0.7rem', color: '#92400e', whiteSpace: 'nowrap' }}>
              {Number(pendingRecord!.amount).toLocaleString('vi-VN')}đ
            </Typography>
            {/* Desktop: đầy đủ */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: '1px', lineHeight: 1.3 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#92400e' }}>
                Chờ thanh toán: {Number(pendingRecord!.amount).toLocaleString('vi-VN')}đ
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#b45309' }}>
                {pendingRecord!.transaction_code} • {new Date(pendingRecord!.created_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Nạp tiền */}
        <Button
          variant='outlined'
          onClick={handleNavigateRecharge}
          sx={{
            padding: { xs: '5px 8px', sm: '7px 10px' },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            minWidth: 0,
            display: isUnauthenticated ? 'none' : 'flex',
            gap: '6px',
            borderColor: primaryHover,
            color: primaryHover,
            whiteSpace: 'nowrap',
            '&:hover': {
              borderColor: primaryHover,
              backgroundColor: `${primaryHover}14`,
            }
          }}
        >
          <Wallet size={16} />
          <Box component='span' sx={{ display: { xs: 'none', sm: 'inline' } }}>Nạp tiền</Box>
        </Button>

        <LanguageDropdown />

        {/* Auth area */}
        <div style={{ display: isUnauthenticated ? 'none' : 'flex' }}>
          <UserDropdown />
        </div>
        <Button
          onClick={handleOpenLoginModal}
          className='px-4 py-2 text-sm text-white rounded-lg h transition-colors'
          sx={{
            display: isUnauthenticated ? 'inline-flex' : 'none',
            '&.MuiButtonBase-root': {
              background: 'var(--primary-gradient)'
            }
          }}
        >
          Đăng nhập
        </Button>
      </div>

      {/* AuthModal - Render trong Portal để tránh constraints */}
      {typeof window !== 'undefined' && createPortal(<AuthModal />, document.body)}
    </div>
  )
}

export default NavbarContent
