import OrderRotatingProxyPage from '@/views/Client/OrderRotatingProxy/OrderRotatingProxyPage'

import './styles.css'

import { Globe } from 'lucide-react'
import type { Metadata } from 'next'
import axios from 'axios'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Đơn hàng proxy xoay`,
  description: 'Mô tả ngắn gọn về trang web.'
}

async function getProxyOrders(token: string) {
  try {
    const api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_APP_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const res = await api.post('/api/get-order-proxy-rotating')

    return res.data?.data
  } catch (err) {
    console.error('Error fetching proxy orders:', err)

    return []
  }
}

export default async function OrderRotatingProxy() {
  const session = await getServerSession(authOptions)

  const token = session?.access_token || '' // access_token do bạn set khi login next-auth
  const proxyOrders = await getProxyOrders(token)

  return (
    <div className='main-page'>
      <OrderRotatingProxyPage data={proxyOrders} />
    </div>
  )
}
