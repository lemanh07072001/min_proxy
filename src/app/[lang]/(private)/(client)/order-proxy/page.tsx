import OrderProxyPage from '@/views/Client/OrderProxy/OrderProxyPage'

import './styles.css'

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Đơn hàng proxy`,
  description: 'Mô tả ngắn gọn về trang web.'
}

export default async function OrderProxy() {

  return (
    <div className='main-page'>
      <OrderProxyPage  />
    </div>
  )
}
