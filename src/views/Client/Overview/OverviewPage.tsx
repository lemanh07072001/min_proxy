'use client'

import { useEffect } from 'react'

import { useSearchParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import useAxiosAuth from '@/hocs/useAxiosAuth'

import { formatDateTimeLocal } from '@/utils/formatDate'

import { useModalContext } from '@/app/contexts/ModalContext'
import HistoryLoginPage from '../HistoryLogin/HistoryLoginPage'

export function OverviewPage() {
  const { openAuthModal } = useModalContext()
  const axiosAuth = useAxiosAuth()

  // Hiện thông báo khi đổi mật khẩu thành công
  const searchParams = useSearchParams()

  console.log(searchParams.get('resetSuccess'))
  useEffect(() => {
    if (searchParams.get('resetSuccess') === 'true') {
      console.log('da')
      toast.success('Đổi mật khẩu thành công!')
      openAuthModal('login')
    }
  }, [searchParams, openAuthModal])

  const { data: dataOverview = [], isLoading } = useQuery({
    queryKey: ['getOverview'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-overview')

      return res.data ?? []
    }
  })

  const proxys = dataOverview?.proxys ?? []

  if (isLoading) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-white'>
        <div className='animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-orange-500' />
      </div>
    )
  }

  return (
    <>
      <div className='flex-1 p-6 space-y-6'>
        {/* Thông tin tài khoản */}
        <div className='grid gap-4 md:grid-cols-3'>
          <div className='bg-card rounded-lg p-6 border' style={{ background: 'white' }}>
            <h3 className='text-sm font-medium text-muted-foreground'>Số dư tài khoản</h3>
            <p className='text-2xl font-bold text-orange-600'>
              {' '}
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                dataOverview?.total_amount ?? 0
              )}
            </p>
          </div>
          <div className='bg-card rounded-lg p-6 border' style={{ background: 'white' }}>
            <h3 className='text-sm font-medium text-muted-foreground'>Proxy đang sử dụng</h3>
            <p className='text-2xl font-bold'>{dataOverview?.total_proxy || 0}</p>
          </div>
          <div className='bg-card rounded-lg p-6 border' style={{ background: 'white' }}>
            <h3 className='text-sm font-medium text-muted-foreground'>Proxy sắp hết hạn</h3>
            <p className='text-2xl font-bold text-red-600'>{dataOverview?.near_expiry || 0}</p>
          </div>
        </div>

        <div className='bg-card rounded-lg border ' style={{ background: 'white' }}>
          <HistoryLoginPage />
        </div>
      </div>
    </>
  )
}
