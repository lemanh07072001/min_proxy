import HistoryOrderPage from '@/views/Client/HistoryOrder/HistoryOrderPage'

import './styles.css'

import { Globe } from 'lucide-react'

export default function HistoryOrder() {
  const purchaseHistory = [
    {
      id: 1,
      orderId: '35cabd1936',
      account: '+84335641332',
      amount: '1000',
      description: 'Đơn giá 1000 VNĐ',
      mst: 'MST',
      provider: 'viettel',
      content: 'Hộ Mỹ',
      status: 'completed',
      date: '18-08-2025 09:39:44'
    },
    {
      id: 2,
      orderId: '35cabd1937',
      account: '+84335641333',
      amount: '2500',
      description: 'Đơn giá 2500 VNĐ',
      mst: 'MST',
      provider: 'fpt',
      content: 'Hộ Mỹ',
      status: 'pending',
      date: '17-08-2025 14:22:15'
    },
    {
      id: 3,
      orderId: '35cabd1938',
      account: '+84335641334',
      amount: '1500',
      description: 'Đơn giá 1500 VNĐ',
      mst: 'MST',
      provider: 'vnpt',
      content: 'Hộ Mỹ',
      status: 'failed',
      date: '16-08-2025 11:15:30'
    }
  ]

  return (
    <div className='main-page'>
      {/* Page Header */}
      <div className='page-header-orders'>
        <div className='header-content'>
          <div className='header-left'>
            <div className='page-icon'>
              <Globe size={32} />
            </div>
            <div>
              <h1>Danh sách proxy</h1>
              <p className='page-subtitle'>Quản lý và theo dõi các proxy đã mua</p>
            </div>
          </div>
        </div>
      </div>
      <HistoryOrderPage data={purchaseHistory} />
    </div>
  )
}
