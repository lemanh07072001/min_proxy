'use client' // RẤT QUAN TRỌNG: Đánh dấu đây là Client Component

import { useContext, useState } from 'react'

import { Plus, Wallet } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Session } from 'next-auth' // Import kiểu Session

// Import các dialog của bạn
import { SessionContext, useSession } from 'next-auth/react'

import { useQuery } from '@tanstack/react-query'

import RechargeInputDialog from '@/app/[lang]/(private)/(client)/components/wallet/RechargeInputDialog'
import QrCodeDisplayDialog from '@/app/[lang]/(private)/(client)/components/wallet/QrCodeDisplayDialog'
import { useModalContext } from '@/app/contexts/ModalContext'
import axiosInstance from '@/libs/axios'
import useAxiosAuth from '@/hocs/useAxiosAuth'

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

  const axiosAuth = useAxiosAuth()
  const session = useSession()

  const { openAuthModal } = useModalContext()

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

  // Hàm để fetch dữ liệu.
  const fetchUser = async () => {
    const { data } = await axiosAuth.post('/me')

    return data
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ['userData'], // Đặt tên cho query
    queryFn: fetchUser, // Cung cấp hàm fetch
    enabled: !!session?.data?.access_token ,
  })

  console.log('da',data)
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
            <div className='bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 rounded-2xl mt-4'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center space-x-2'>
                  <Wallet className='w-5 h-5' />
                  <span className='text-orange-100'>Ví của bạn</span>
                </div>
              </div>
              <div className='text-3xl font-bold mb-2'>
                {isLoading
                  ? new Intl.NumberFormat('vi-VN').format(0)
                  : new Intl.NumberFormat('vi-VN').format(data?.sodu ?? 0)}{' '}
                VNĐ
              </div>
              <div className='text-orange-100 text-sm'>
                {session.status === 'authenticated' ? (
                  <button
                    className='bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
                    onClick={() => setIsInputOpen(true)}
                  >
                    <Plus size={16} />
                    Nạp tiền
                  </button>
                ) : (
                  <button
                    className='bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
                    onClick={() => openAuthModal('login')}
                  >
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
