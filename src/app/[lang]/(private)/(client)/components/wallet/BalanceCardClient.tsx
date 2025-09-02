'use client' // RẤT QUAN TRỌNG: Đánh dấu đây là Client Component

import { useContext, useState } from 'react'

import { Plus, Wallet } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Session } from 'next-auth' // Import kiểu Session

// Import các dialog của bạn
import RechargeInputDialog from '@/app/[lang]/(private)/(client)/components/wallet/RechargeInputDialog'
import QrCodeDisplayDialog from '@/app/[lang]/(private)/(client)/components/wallet/QrCodeDisplayDialog'
import { SessionContext, useSession } from 'next-auth/react'
import { useModalContext } from '@/app/contexts/ModalContext'

// Interface để định nghĩa cấu trúc dữ liệu giao dịch
interface TransactionData {
  qrUrl: string | null
  amount: string
  rechargeAmount: string
}

interface BalanceCardClientProps {
  isWalletVisible: boolean
  isInitialLoad: boolean

  initialBalance: number // Giả sử bạn cũng lấy số dư từ server
}

export default function BalanceCardClient({
  isWalletVisible,
  isInitialLoad,

  initialBalance
}: BalanceCardClientProps) {
  // Toàn bộ state và logic được chuyển vào đây
  const [isInputOpen, setIsInputOpen] = useState(false)
  const [isQrOpen, setIsQrOpen] = useState(false)

  const session = useSession()

  const { openAuthModal } = useModalContext();

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



  return (
    <>
      <AnimatePresence>
        {isWalletVisible && (
          <motion.div
            initial={isInitialLoad ? { opacity: 1, maxHeight: 300 } : { opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 300 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', padding: '0 1rem' }}
          >
            <div className='wallet-card'>
              <div className='wallet-header'>
                <Wallet className='wallet-icon' size={20} />
                <span className='wallet-title'>Ví của bạn</span>
              </div>
              <div className='wallet-balance'>
                {/* Hiển thị số dư được truyền từ server */}
                <span className='balance-amount'>{initialBalance.toLocaleString('vi-VN')}</span>
                <span className='balance-currency'>VNĐ</span>
              </div>
              <div className='wallet-actions'>
                {session.status === 'authenticated' ? (
                    <button className='btn-primary' onClick={() => setIsInputOpen(true)}>
                      <Plus size={16} />
                      Nạp tiền
                    </button>

                ):(
                  <button className='btn-primary' onClick={() => openAuthModal('login')}>
                    Đăng nhập
                  </button>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </>
  )
}
