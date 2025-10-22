import React from 'react'
import './styles.css'

import type { Metadata } from 'next'

import type { Locale } from '@/configs/configi18n'
import { getDictionary } from '@/utils/getDictionary'
import ProxyPlansClient from '@/components/ProxyPlansClient'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Proxy Xoay`
}

// Fetch data on server-side
async function getProxyPlans() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-proxy-rotating`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Ensure fresh data on each request
    })

    if (!response.ok) {
      throw new Error('Failed to fetch proxy plans')
    }

    const data = await response.json()

    console.log(data)

    return data.data || []
  } catch (error) {
    console.error('Error fetching proxy plans:', error)

    return []
  }
}

export default async function RotatingProxy({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params

  // Fetch data and dictionary in parallel
  const [proxyPlans, dictionary] = await Promise.all([getProxyPlans(), getDictionary(lang)])

  console.log(dictionary)

  // Create proxy template using server-side translations
  const proxyTemplate = {
    features: [
      { label: dictionary.rotatingProxy.networkType, value: dictionary.rotatingProxy.fiberOptic, status: 'success' },
      { label: dictionary.rotatingProxy.provider, value: dictionary.rotatingProxy.providers, status: 'success' },
      {
        label: dictionary.rotatingProxy.minChangeTime,
        value: dictionary.rotatingProxy.changeTimeValue,
        status: 'success'
      },
      {
        label: dictionary.rotatingProxy.minLifetime,
        value: dictionary.rotatingProxy.minLifetimeValue,
        status: 'success'
      },
      {
        label: dictionary.rotatingProxy.maxLifetime,
        value: dictionary.rotatingProxy.maxLifetimeValue,
        status: 'success'
      },
      { label: dictionary.rotatingProxy.location, value: dictionary.rotatingProxy.randomLocation, status: 'success' },
      {
        label: dictionary.rotatingProxy.quantity,
        status: 'input',
        inputType: 'number',
        field: 'quantity',
        min: 1,
        max: 100
      },
      { label: dictionary.rotatingProxy.days, status: 'input', inputType: 'number', field: 'time', min: 1, max: 100 },
      { label: dictionary.rotatingProxy.protocol_type, value: 'HTTP(S), SOCKS5', status: 'success' }
    ]
  }

  const mergedPlans = proxyPlans.map((plan: any) => {
    // copy features từ template
    const features = proxyTemplate.features.map(f => ({ ...f }))

    // tìm vị trí của networkType
    const index = features.findIndex(f => f.label === dictionary.rotatingProxy.networkType)

    // chèn ip_version ngay sau vị trí đó
    features.splice(index + 1, 0, {
      label: 'IP Version',
      value: plan.ip_version,
      status: 'success'
    })

    const protocolIndex = features.findIndex(f => f.label === dictionary.rotatingProxy.protocol_type)

    if (protocolIndex !== -1) {
      if (plan.protocol_type === 1) {
        // ✅ Hiển thị select
        features[protocolIndex] = {
          ...features[protocolIndex],
          label: 'Giao thức',
          status: 'select',
          options: [
            { label: 'HTTP', value: 'http' },
            { label: 'SOCKS5', value: 'socks5' }
          ],
          field: 'protocol_type' // để client biết field này là gì
        }
      } else {
        // ❌ Không hiển thị gì — xóa dòng protocol_type khỏi danh sách
        features.splice(protocolIndex, 1)
      }
    }

    // 👉 xử lý cột time: nếu time_type = 1 -> Ngày sử dụng, nếu = 7 -> Tuần sử dụng
    const timeIndex = features.findIndex(f => f.field === 'time')

    if (timeIndex !== -1) {
      features[timeIndex] = {
        ...features[timeIndex],
        label:
          plan.time_type === '1'
            ? 'Ngày sử dụng'
            : plan.time_type === '7'
              ? 'Tuần sử dụng'
              : plan.time_type === '30' // hoặc giá trị bạn định nghĩa cho tháng
                ? 'Tháng sử dụng'
                : 'Không xác định'
      }
    }

    return {
      id: plan.id,
      title: plan.name,
      price: parseInt(plan.price),
      api_body: plan.api_body,
      partner: plan.partner,
      ip_version: plan.ip_version,
      time_type: plan.time_type, // lưu nếu cần dùng nơi khác
      protocol_type: plan.protocol_type,
      features
    }
  })

  return <ProxyPlansClient data={mergedPlans} />
}
