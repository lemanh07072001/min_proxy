// src/app/[lang]/(private)/(client)/components/wallet/BalanceCard.tsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/libs/auth'
import BalanceCardClient from './BalanceCardClient'

interface BalanceCardProps {
  isWalletVisible: boolean
  isInitialLoad: boolean
}

export default function BalanceCard({
                                            isWalletVisible,
                                            isInitialLoad
                                          }: BalanceCardProps) {


  // Lấy số dư từ DB hoặc API
  const initialBalance = 0

  return (
    <BalanceCardClient
      isWalletVisible={isWalletVisible}
      isInitialLoad={isInitialLoad}
      initialBalance={initialBalance}
    />
  )
}
