import { Grid2 } from '@mui/material'
import { User, DollarSign, AlertCircle } from 'lucide-react'

function StatCard({
  title,
  value,
  icon: Icon,
  bgColor,
  iconColor
}: {
  title: string
  value: string | number
  icon: any
  bgColor: string
  iconColor: string
}) {
  return (
    <div className='bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-gray-600 mb-1'>{title}</p>
          <h3 className='text-3xl font-bold text-gray-800'>{value}</h3>
        </div>
        <div className={`${bgColor} ${iconColor} rounded-xl p-4`}>
          <Icon className='w-8 h-8' />
        </div>
      </div>
    </div>
  )
}

interface StatsOverviewProps {
  data?: {
    active_proxies?: number
    completed_orders?: number
    total_deposit?: number
    total_orders?: number
    total_proxies?: number
    total_revenue?: number
    total_sales?: number
    total_users?: number
    refunded_orders?: number
    total_price_cost?: number
  }
}

export default function StatsOverview({ data }: StatsOverviewProps) {

  return (
    <div className=''>
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>Thống kê</h2>
      <Grid2 container spacing={2}></Grid2>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title='Tổng User'
            value={data?.total_users?.toLocaleString('vi-VN') || '0'}
            icon={User}
            bgColor='bg-blue-100'
            iconColor='text-blue-600'
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title='Tổng doanh thu'
            icon={DollarSign}
            value={data?.total_revenue?.toLocaleString('vi-VN') || '0'}
            bgColor='bg-green-100'
            iconColor='text-green-600'
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title='User đã nạp'
            icon={DollarSign}
            value={data?.total_deposit?.toLocaleString('vi-VN') || '0'}
            bgColor='bg-green-100'
            iconColor='text-green-600'
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title='Tổng tiền nhập'
            value={data?.total_price_cost?.toLocaleString('vi-VN') || '0'}
            icon={AlertCircle}
            bgColor='bg-red-100'
            iconColor='text-red-600'
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title='Tổng đơn hàng'
            value={data?.total_orders?.toLocaleString('vi-VN') || '0'}
            icon={AlertCircle}
            bgColor='bg-red-100'
            iconColor='text-red-600'
          />
        </Grid2>
      </Grid2>
    </div>
  )
}
