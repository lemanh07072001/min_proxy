'use client' // RẤT QUAN TRỌNG: Đánh dấu đây là Client Component

import { useState } from 'react'

import { Plus, Wallet } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Session } from 'next-auth' // Import kiểu Session

// Import các dialog của bạn
import RechargeInputDialog from '@/app/[lang]/(private)/(client)/components/wallet/RechargeInputDialog'
import QrCodeDisplayDialog from '@/app/[lang]/(private)/(client)/components/wallet/QrCodeDisplayDialog'

// Interface để định nghĩa cấu trúc dữ liệu giao dịch
interface TransactionData {
  qrUrl: string | null
  amount: string
  rechargeAmount: string
}

interface BalanceCardClientProps {
  isWalletVisible: boolean
  isInitialLoad: boolean
  session: Session | null // Nhận session từ Server Component cha
  initialBalance: number // Giả sử bạn cũng lấy số dư từ server
}

export default function BalanceCardClient({
  isWalletVisible,
  isInitialLoad,
  session,
  initialBalance
}: BalanceCardClientProps) {
  // Toàn bộ state và logic được chuyển vào đây
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

  // Chào mừng người dùng nếu có session
  console.log('Client Component received session for:', session?.user?.name)

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
                <button className='btn-primary' onClick={() => setIsInputOpen(true)}>
                  <Plus size={16} />
                  Nạp tiền
                </button>
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
