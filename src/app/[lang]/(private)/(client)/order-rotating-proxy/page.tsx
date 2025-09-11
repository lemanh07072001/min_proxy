import OrderRotatingProxyPage from '@/views/Client/OrderRotatingProxy/OrderRotatingProxyPage'

import './styles.css'

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Đơn hàng proxy xoay`,
  description: 'Mô tả ngắn gọn về trang web.'
}



export default async function OrderRotatingProxy() {


  return (
    <div className='main-page'>
      <OrderRotatingProxyPage />
    </div>
  )
}
