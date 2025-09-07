import React from 'react'
import './styles.css'

import type { Metadata } from 'next'

import RotatingProxyPage from '@views/Client/RotatingProxy/RotatingProxyPage'
import axiosInstance from '@/libs/axios'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Proxy Xoay`,
  description: 'Mô tả ngắn gọn về trang web.'
}

export default async function RotatingProxy() {
  let proxyPlans = []

  try {
    const response = await axiosInstance.get('/get-proxy-rotating', {
      timeout: 10000 // Timeout 10 giây
    })

    proxyPlans = response.data.data
  } catch (error) {
    console.log(error)
  }

  const proxyTemplate = {
    features: [
      { label: 'Kiểu mạng', value: 'Cáp quang', status: 'success' },
      { label: 'IPv4 sạch-Unlimited Bandwidth', value: '', status: 'success' },
      { label: 'Nhà mạng', value: 'Viettel, FPT, VNPT', status: 'success' },
      { label: 'Thời gian đổi IP tối thiểu', value: '60 giây / lần', status: 'success' },
      { label: 'Giữ IP / Xoay IP', value: '', status: 'success' },
      { label: 'Vị trí', value: 'Ngẫu nhiên', status: 'success' },
      { label: 'Số lượng', status: 'input', inputType: 'number', field: 'quantity' },
      { label: 'Ngày sử dụng', status: 'input', inputType: 'number', field: 'time' }
    ]
  }

  const mergedPlans = proxyPlans.map(plan => ({
    id: plan.id,
    title: plan.name,
    price: parseInt(plan.price),
    api_body: plan.api_body,
    partner: plan.partner,
    features: proxyTemplate.features.map(f => ({ ...f }))
  }))

  return (
    <div className='proxy-xoay-page'>
      <div className='page-header'>
        <div className='header-content'>
          <h1 className='page-title'>Proxy Dân Cư</h1>
          <p className='page-subtitle'>Chọn gói proxy phù hợp với nhu cầu của bạn</p>
        </div>
      </div>
      <div className='plans-container'>
        <RotatingProxyPage data={mergedPlans} />
      </div>
    </div>
  )
}
