// File này bây giờ là một Server Component thuần túy để fetch dữ liệu

import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'
import BalanceCardClient from './BalanceCardClient' // Import Client Component vừa tạo

// Giả sử bạn có một hàm để lấy số dư của người dùng
async function getUserBalance(userId: string): Promise<number> {
  // Logic gọi database hoặc API để lấy số dư
  // Ví dụ: const balance = await db.user.findUnique({ where: { id: userId } }).select('balance')
  return 1234567 // Giá trị giả
}

interface BalanceCardProps {
  isWalletVisible: boolean
  isInitialLoad: boolean
}

export default  function BalanceCard({ isWalletVisible, isInitialLoad }: BalanceCardProps) {
  // Lấy dữ liệu trên server


  // Bạn cũng nên lấy số dư ban đầu ở đây
  const initialBalance =  0


  // Render Client Component và truyền dữ liệu đã lấy được xuống làm props
  return (
    <BalanceCardClient
      isWalletVisible={isWalletVisible}
      isInitialLoad={isInitialLoad}

      initialBalance={initialBalance}
    />
  )
}
