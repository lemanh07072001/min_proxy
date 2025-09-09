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

      // { label: 'IPv4 sạch-Unlimited Bandwidth', value: '', status: 'success' },
      { label: 'Nhà mạng', value: 'Viettel, FPT, VNPT', status: 'success' },
      { label: 'Thời gian đổi IP tối thiểu', value: '60 giây / lần', status: 'success' },
      { label: 'Thời gian sống tối thiểu', value: '15 phút', status: 'success' },
      { label: 'Thời gian sống tối đa', value: '30 phút', status: 'success' },
      { label: 'Vị trí', value: 'Ngẫu nhiên', status: 'success' },
      { label: 'Số lượng', status: 'input', inputType: 'number', field: 'quantity', min: 1, max: 100 },
      { label: 'Ngày sử dụng', status: 'input', inputType: 'number', field: 'time', min: 1, max: 100 }
    ]
  }

  const mergedPlans = proxyPlans.map(plan => {
    // copy features từ template
    const features = proxyTemplate.features.map(f => ({ ...f }))

    // tìm vị trí của "Kiểu mạng"
    const index = features.findIndex(f => f.label === 'Kiểu mạng')

    // chèn ip_version ngay sau vị trí đó
    features.splice(index + 1, 0, {
      label: 'IP Version',
      value: plan.ip_version,
      status: 'success'
    })

    return {
      id: plan.id,
      title: plan.name,
      price: parseInt(plan.price),
      api_body: plan.api_body,
      partner: plan.partner,
      ip_version: plan.ip_version,
      features
    }
  })

  return (
    <div className='proxy-xoay-page'>
      <div className='plans-container'>
        <RotatingProxyPage data={mergedPlans} />
      </div>
    </div>
  )
}
