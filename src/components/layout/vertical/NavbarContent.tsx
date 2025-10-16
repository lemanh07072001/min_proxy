'use client'

// React Imports
import { useContext, useState } from 'react'

import { createPortal } from 'react-dom'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import { SessionContext, useSession } from 'next-auth/react'

import Button from '@mui/material/Button'

import { useQuery } from '@tanstack/react-query'

import { Plus, Wallet } from 'lucide-react'

import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import AuthModal from '@/components/modals/AuthModal'
import { useModalContext } from '@/app/contexts/ModalContext'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import RechargeInputDialog from '@/app/[lang]/(private)/(client)/components/wallet/RechargeInputDialog'
import QrCodeDisplayDialog from '@/app/[lang]/(private)/(client)/components/wallet/QrCodeDisplayDialog'

// Interface để định nghĩa cấu trúc dữ liệu giao dịch
interface TransactionData {
  qrUrl: string | null
  amount: string
  rechargeAmount: string
}

const NavbarContent = () => {
  const data = null
  const session = useSession()

  const { openAuthModal } = useModalContext()
  const [isInputOpen, setIsInputOpen] = useState(false)
  const [isQrOpen, setIsQrOpen] = useState(false)

  const [transactionData, setTransactionData] = useState<TransactionData>({
    qrUrl: null,
    amount: '',
    rechargeAmount: ''
  })

  const handleGenerateQr = (data: { qrUrl: string; amount: string; rechargeAmount: string }) => {
    setTransactionData(data)
    setIsInputOpen(false)
    setIsQrOpen(true)
  }

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
            <span className='text-gray-700'>{data?.user?.name || data?.user?.email || 'User'}</span>
          </div>
        )}
      </div>
      <div className='flex items-center gap-2'>
        {session.status === 'authenticated' ? (
          <Button
            variant='outlined'
            onClick={() => setIsInputOpen(true)}
            sx={{
              padding: '7px 10px',
              fontSize: '0.875rem',
              display: 'flex',
              gap: '10px'
            }}
          >
            <Wallet size={16} />
            Nạp tiền
          </Button>
        ) : null}

        <LanguageDropdown />

        {/* Hiển thị UserDropdown nếu đã đăng nhập, button đăng nhập nếu chưa */}

        {session.status === 'authenticated' ? (
          <UserDropdown session={data} />
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

      <RechargeInputDialog
        isOpen={isInputOpen}
        handleClose={() => setIsInputOpen(false)}
        onGenerateQr={handleGenerateQr}
      />

      <QrCodeDisplayDialog
        isOpen={isQrOpen}
        handleClose={() => setIsQrOpen(false)}
        qrDataUrl={transactionData.qrUrl}
        amount={transactionData.amount}
        rechargeAmount={transactionData.rechargeAmount}
      />
    </div>
  )
}

export default NavbarContent
