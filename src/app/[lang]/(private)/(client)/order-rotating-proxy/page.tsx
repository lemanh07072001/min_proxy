import OrderRotatingProxyPage from '@/views/Client/OrderRotatingProxy/OrderRotatingProxyPage'

import './styles.css'

import { Globe } from 'lucide-react'

export default function OrderRotatingProxy() {
  const proxyOrders = [
    {
      id: 1,
      orderId: '30851',
      provider: 'viettel',
      proxy: '171.246.183.233:35403:ava634:oqg3mjczruu0ng==',
      ip: '171.246.183.233',
      port: '35403',
      username: 'ava634',
      password: 'oqg3mjczruu0ng==',
      protocol: 'HTTP',
      status: 'actives',
      expiryDate: '19-08-2025 09:39:44',
      remainingDays: 0,
      note: ''
    },
    {
      id: 2,
      orderId: '30852',
      provider: 'fpt',
      proxy: '192.168.1.100:8080:user123:pass456',
      ip: '192.168.1.100',
      port: '8080',
      username: 'user123',
      password: 'pass456',
      protocol: 'HTTP',
      status: 'active',
      expiryDate: '20-08-2025 10:15:30',
      remainingDays: 1,
      note: 'Test proxy'
    },
    {
      id: 3,
      orderId: '30853',
      provider: 'vnpt',
      proxy: '172.16.0.50:3128:vnpt_user:vnpt_pass',
      ip: '172.16.0.50',
      port: '3128',
      username: 'vnpt_user',
      password: 'vnpt_pass',
      protocol: 'SOCKS5',
      status: 'expired',
      expiryDate: '15-08-2025 14:22:15',
      remainingDays: -3,
      note: 'Expired proxy'
    }
  ]

  return (
    <div className='proxy-orders-page'>
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
      <OrderRotatingProxyPage data={proxyOrders} />
    </div>
  )
}
