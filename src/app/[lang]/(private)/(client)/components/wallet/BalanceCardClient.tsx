'use client'

import { Wallet } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useModalContext } from '@/app/contexts/ModalContext'
import { useUser } from '@/app/contexts/UserContext'

interface BalanceCardClientProps {
  isWalletVisible: boolean
  isInitialLoad: boolean
  initialBalance: number
}

export default function BalanceCardClient({
  isWalletVisible,
  isInitialLoad,
  initialBalance
}: BalanceCardClientProps) {
  const { user } = useUser()
  const session = useSession()
  const { openAuthModal } = useModalContext()


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
            <div className='bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 rounded-2xl'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center space-x-2'>
                  <Wallet className='w-5 h-5' />
                  <span className='text-orange-100'>Ví của bạn</span>
                </div>
              </div>
              <div className='text-2xl font-bold mb-2'>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user?.sodu ?? 0)}
              </div>
              <div className='text-orange-100 text-sm'>
                {session.status === 'authenticated' ? (
                  null
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
    </>
  )
}
