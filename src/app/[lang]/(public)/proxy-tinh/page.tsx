import '@/app/[lang]/(public)/proxy-tinh/styles.css'

import type { Metadata } from 'next'

import StaticProxyPage from '@views/Client/StaticProxy/StaticProxyPage'
import axiosInstance from '@/libs/axios'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Proxy Tĩnh`,
  description: 'Mô tả ngắn gọn về trang web.'
}

export default async function StaticProxy() {
  let proxyPlans = []

  try {
    const response = await axiosInstance.get('/get-proxy-static', {
      timeout: 10000 // Timeout 10 giây
    })

    proxyPlans = response.data.data

    console.log('proxyPlans', proxyPlans)
  } catch (error) {
    console.log(error)
  }

  const proxyProviders = {
    features: [
      {
        title: 'Tốc độ cao',
        class: 'success'
      },
      {
        title: 'Ổn định',
        class: 'info'
      }
    ]
  }

  const mergedPlans = proxyPlans.map(plan => ({
    id: plan.id,
    title: plan.name,
    price: parseInt(plan.price),
    image: plan?.image ?? '',
    api_body: plan.api_body,
    partner: plan.partner,
    features: proxyProviders.features.map(f => ({ ...f }))
  }))

  return (
    <div className='main-content-modern'>

      {/* Proxy Cards */}
      <div className='proxy-grid'>
        <StaticProxyPage data={mergedPlans} />
      </div>
    </div>
  )
}
