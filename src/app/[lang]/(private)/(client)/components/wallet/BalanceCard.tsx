
import {  Plus, Wallet } from 'lucide-react'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import RechargeDialog from '@/app/[lang]/(private)/(client)/components/wallet/RechargeDialog'


interface BalanceCardProps {
  isWalletVisible : boolean,
  isInitialLoad : boolean,
}

export default function BalanceCard({isWalletVisible, isInitialLoad} :BalanceCardProps){
  const [isRechanrged, setIsRechanrged] = useState<boolean>(false)

  const handleRechanrgeOpenDialog = () => {
    setIsRechanrged(true)
  }

  const handleRechanrgeCloneDialog = () => {
    setIsRechanrged(false)
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
                <span className='balance-amount'>2,450,000</span>
                <span className='balance-currency'>VNĐ</span>
              </div>
              <div className='wallet-actions'>
                <button className='btn-primary' onClick={handleRechanrgeOpenDialog}>
                  <Plus size={16} />
                  Nạp tiền
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RechargeDialog isOpen={isRechanrged} handleClose={handleRechanrgeCloneDialog}/>
    </>
  )
}