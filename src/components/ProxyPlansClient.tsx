'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

import { useQueryClient } from '@tanstack/react-query'

import RotatingProxyPage from '@views/Client/RotatingProxy/RotatingProxyPage'
import OrderRotatingProxyPage from '@/views/Client/OrderRotatingProxy/OrderRotatingProxyPage'

interface ProxyPlansClientProps {
  data: any[]
}

export default function ProxyPlansClient({ data }: ProxyPlansClientProps) {
  const [currentView, setCurrentView] = useState<'form' | 'table'>('form')
  const { data: session, status } = useSession()
  const queryClient = useQueryClient()
  const router = useRouter()
  const params = useParams()

  // Refetch data khi chuyển sang tab table để đảm bảo hiển thị đơn hàng mới nhất
  useEffect(() => {
    if (currentView === 'table' && status === 'authenticated') {
      // Invalidate và refetch query để đảm bảo data mới nhất
      queryClient.invalidateQueries({ queryKey: ['proxyData'] })
    }
  }, [currentView, status, queryClient])

  // Hàm xử lý chuyển tab sau khi mua hàng
  const handlePurchaseSuccess = () => {
    const { lang } = params as { lang: string }
    router.push(`/${lang}/history-order`)
  }

  return (
    <>
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
        <div className='proxy-xoay-page'>
          <div className='plans-container'>
            <RotatingProxyPage data={data} onPurchaseSuccess={handlePurchaseSuccess} />
          </div>
        </div>
      )}

      {currentView === 'table' && <OrderRotatingProxyPage />}
    </>
  )
}
