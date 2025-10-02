'use client'

import { useState, useEffect } from 'react'
import './styles.css'

import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'

import ProxyCard from '@/app/[lang]/(private)/(client)/components/proxy-card/ProxyCard'
import OrderProxyPage from './OrderProxyPage'

interface StaticProxyPageProps {
  data: any
}

export default function StaticProxyPage({ data }: StaticProxyPageProps) {
  const [currentView, setCurrentView] = useState<'form' | 'table'>('form')
  const { data: session, status } = useSession()
  const queryClient = useQueryClient()

  // Hàm xử lý chuyển tab sau khi mua hàng
  const handlePurchaseSuccess = () => {
    // Chuyển từ tab mua hàng sang tab danh sách đơn hàng
    setCurrentView('table')
  }

  // Refetch data khi chuyển sang tab table để đảm bảo hiển thị đơn hàng mới nhất
  useEffect(() => {
    if (currentView === 'table' && status === 'authenticated') {
      // Invalidate và refetch query để đảm bảo data mới nhất
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
    }
  }, [currentView, status, queryClient])

  return (
    <div className='flex flex-col'>
      <div className='mb-2'>
        <div className='flex items-center justify-start'>
          <div className='flex bg-gray-100 rounded-lg p-1'>
            <button
              onClick={() => setCurrentView('form')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                currentView === 'form' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mua hàng
            </button>
            <button
              disabled={status === 'unauthenticated'}
              onClick={() => setCurrentView('table')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${status === 'unauthenticated' ? 'cursor-not-allowed' : ''} ${
                currentView === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Danh sách
            </button>
          </div>
        </div>
      </div>

      {currentView === 'form' && (
        <div className='proxy-grid'>
          {data?.map((provider: any, index: any) => {
            return (
              <ProxyCard
                onPurchaseSuccess={handlePurchaseSuccess}
                key={index}
                provider={provider}
                logo={provider.logo}
                color={provider.color}
                price={provider.price}
                features={provider.features}
                {...provider}
              />
            )
          })}
        </div>
      )}

      {currentView === 'table' && <OrderProxyPage />}
    </div>
  )
}
