import type { Metadata } from 'next'

import HistoryOrderPage from '@/views/Client/HistoryOrder/HistoryOrderPage'

import './styles.css'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Lịch sử đơn hàng`
}

export default function HistoryOrder() {
  return (
    <div className='main-page'>
      <HistoryOrderPage />
    </div>
  )
}
