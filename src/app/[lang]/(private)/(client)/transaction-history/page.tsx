import { Globe } from 'lucide-react'

import TransactionHistoryPage from '@views/Client/ TransactionHistory/TransactionHistoryPage'

export default function TransactionHistory() {
  const transactionHistory = [
    {
      id: 'tc37d0617-24ca-46cb-871b-7919a43255af',
      type: 'spend',
      amount: '1000',
      description: 'Thanh toán đơn hàng #1f7cca71-4f16-4d53-b943-e387fb4f7f79',
      status: 'completed',
      date: '18-08-2025 09:39:44'
    },
    {
      id: 'tf48ea740-9acf-4ad2-ac89-273d15cad026',
      type: 'spend',
      amount: '1000',
      description: 'Thanh toán đơn hàng #daa0e108-8985-41f1-a961-9335cebd1936',
      status: 'completed',
      date: '18-08-2025 09:39:44'
    },
    {
      id: '714b94a6-c831-4a3a-a448-66788bf2bc2c',
      type: 'wallet',
      amount: '1000',
      description: 'ck 0335641332',
      status: 'truncate',
      date: '18-08-2025 09:39:44'
    }
  ]

  return (
    <div className='main-page'>
      <TransactionHistoryPage data={transactionHistory} />
    </div>
  )
}
