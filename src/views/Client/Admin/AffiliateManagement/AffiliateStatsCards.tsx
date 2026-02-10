'use client'

import { Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import BoxCustom from '@/components/UI/BoxCustom'
import useAxiosAuth from '@/hooks/useAxiosAuth'

interface AffiliateStatsCardsProps {
  dictionary: any
}

export default function AffiliateStatsCards({ dictionary }: AffiliateStatsCardsProps) {
  const axiosAuth = useAxiosAuth()
  const t = dictionary.adminAffiliatePage?.stats || {}

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-affiliate-stats'],
    queryFn: async () => {
      const response = await axiosAuth.get('/admin/affiliate-stats')
      return response.data
    }
  })

  const statsData = [
    {
      title: t.totalAffiliates || 'Tổng Affiliates',
      value: stats?.total_affiliates || 0,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: t.totalCommission || 'Tổng hoa hồng',
      value: new Intl.NumberFormat('vi-VN').format(stats?.total_commission || 0) + ' đ',
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: t.pendingWithdrawals || 'Yêu cầu rút tiền chờ',
      value: stats?.pending_withdrawals || 0,
      icon: AlertCircle,
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
    {
      title: t.monthlyGrowth || 'Tăng trưởng tháng này',
      value: `+${stats?.monthly_growth || 0}%`,
      icon: TrendingUp,
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
