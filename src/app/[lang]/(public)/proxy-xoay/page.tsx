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
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch proxy plans')
    }

    const data = await response.json()

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
      { label: dictionary.rotatingProxy.protocol, value: 'HTTP(S), SOCKS5', status: 'success' }
    ]
  }

  const mergedPlans = proxyPlans.map((plan: any) => {
    // copy features từ template
    const features: any[] = proxyTemplate.features.map(f => ({ ...f }))

    // tìm vị trí của networkType
    const index = features.findIndex(f => f.label === dictionary.rotatingProxy.networkType)

    // chèn ip_version ngay sau vị trí đó
    features.splice(index + 1, 0, {
      label: 'IP Version',
      value: plan.ip_version,
      status: 'success'
    })

    const protocolIndex = features.findIndex(f => f.label === dictionary.rotatingProxy.protocol)

    if (protocolIndex !== -1) {
      if (plan.protocol_type === 1) {
        // ✅ Hiển thị radio buttons giống như input Thời gian
        features[protocolIndex] = {
          ...features[protocolIndex],
          label: 'Giao thức',
          status: 'radio',
          uppercaseLabel: false, // Giữ label không uppercase
          options: [
            { key: 'http', label: 'HTTP' },
            { key: 'socks5', label: 'SOCKS5' }
          ],
          field: 'protocol' // để client biết field này là gì
        }
      } else {
        // ❌ Không hiển thị gì — xóa dòng protocol khỏi danh sách
        features.splice(protocolIndex, 1)
      }
    }

    // 👉 xử lý cột time: chuyển sang radio buttons với options từ price_by_duration
    const timeIndex = features.findIndex(f => f.field === 'time')

    if (timeIndex !== -1 && plan.price_by_duration) {
      // Parse price_by_duration nếu là string JSON
      const priceDurations =
        typeof plan.price_by_duration === 'string' ? JSON.parse(plan.price_by_duration) : plan.price_by_duration

      // Chuyển đổi thành options cho radio buttons
      const timeOptions = priceDurations.map((item: any) => ({
        key: item.duration || item.key,
        label: item.duration || item.key,
        value: item.price || item.value,
        discount: item.discount || '0'
      }))

      features[timeIndex] = {
        label:
          plan.time_type === '1'
            ? 'Ngày sử dụng'
            : plan.time_type === '7'
              ? 'Tuần sử dụng'
              : plan.time_type === '30'
                ? 'Tháng sử dụng'
                : 'Không xác định',
        status: 'radio',
        field: 'time',
        options: timeOptions
      }
    }

    return {
      id: plan.id,
      title: plan.code,
      price: parseInt(plan.price),
      api_body: plan.api_body,
      partner: plan.partner,
      ip_version: plan.ip_version,
      time_type: plan.time_type,
      protocol: plan.protocol,
      price_by_duration: plan.price_by_duration,
      proxy_type: plan.proxy_type,
      country: plan.country,
      protocols: plan.protocols,
      features
    }
  })
  console.log(mergedPlans)
  return <ProxyPlansClient data={mergedPlans} />
}
