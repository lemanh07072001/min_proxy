'use client'

import { DollarSign, Clock, BanknoteArrowDown, Package } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import BoxCustom from '@/components/UI/BoxCustom'
import useAxiosAuth from '@/hooks/useAxiosAuth'

interface AffiliateStatsCardsProps {
  dictionary: any
}

export default function AffiliateStatsCards({ dictionary }: AffiliateStatsCardsProps) {
  const axiosAuth = useAxiosAuth()
  const t = dictionary.adminAffiliatePage?.stats || {}

  const { data: statsResponse, isLoading } = useQuery({
    queryKey: ['admin-affiliate-stats'],
    queryFn: async () => {
      const response = await axiosAuth.get('/admin/get-affiliate')

      return response.data
    }
  })

  const stats = statsResponse?.data

  const statsData = [
    {
      title: t.totalAffiliateEarnings || 'Tổng số tiền affiliate',
      value: new Intl.NumberFormat('vi-VN').format(stats?.total || 0) + ' đ',
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: t.totalPendingWithdrawal || 'Tổng tiền chưa rút',
      value: new Intl.NumberFormat('vi-VN').format(stats?.pending_withdrawal || 0) + ' đ',
      icon: Clock,
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
    {
      title: t.totalWithdrawn || 'Tổng tiền đã rút',
      value: new Intl.NumberFormat('vi-VN').format(stats?.total_withdrawn || 0) + ' đ',
      icon: BanknoteArrowDown,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: t.totalWithdrawalRequests || 'Tổng số lượng yêu cầu rút',
      value: stats?.total_withdrawal_requests || 0,
      icon: Package,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    }
  ]

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {statsData.map((stat, index) => (
        <BoxCustom key={index}>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-500 mb-1'>{stat.title}</p>
              <p className='text-2xl font-bold text-gray-900'>
                {isLoading ? '...' : stat.value}
              </p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
        </BoxCustom>
      ))}
    </div>
  )
}
