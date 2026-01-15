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

  const mergedPlans = proxyPlans.map((plan: any) => {
    // Tạo features từ multi_inputs của API
    const features: any[] = []

    // Thêm các mô tả từ multi_inputs
    if (plan.multi_inputs && Array.isArray(plan.multi_inputs)) {
      plan.multi_inputs.forEach((input: any) => {
        features.push({
          label: input.key,
          value: input.value,
          status: 'success'
        })
      })
    }

    // Thêm input số lượng
    features.push({
      label: dictionary.rotatingProxy.quantity,
      status: 'input',
      inputType: 'number',
      field: 'quantity',
      min: 1,
      max: 100
    })

    // Xử lý time: chuyển sang radio buttons với options từ price_by_duration
    if (plan.price_by_duration) {
      const priceDurations =
        typeof plan.price_by_duration === 'string' ? JSON.parse(plan.price_by_duration) : plan.price_by_duration

      const timeOptions = priceDurations.map((item: any) => ({
        key: item.duration || item.key,
        label: item.duration || item.key,
        value: item.price || item.value,
        discount: item.discount || '0'
      }))

      features.push({
        label:
          plan.time_type === '1'
            ? dictionary.rotatingProxy.days || 'Ngày sử dụng'
            : plan.time_type === '7'
              ? 'Tuần sử dụng'
              : plan.time_type === '30'
                ? 'Tháng sử dụng'
                : 'Thời gian sử dụng',
        status: 'radio',
        field: 'time',
        options: timeOptions
      })
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
