'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import KPICard from '@/components/UI/KPICard'
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Loader2,
  Receipt,
  RefreshCw,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  XCircle
} from 'lucide-react'
import AppReactDatepicker from '@/components/AppReactDatepicker'
import CustomTextField from '@/@core/components/mui/TextField'
import { useDashboardMonthly } from '@/hooks/apis/useDashboard'

interface DailyData {
  total_revenue?: number
  total_profit?: number
  total_cost?: number
  total_deposit?: number
  total_deposit_count?: number
  balance_remaining?: number
  total_orders?: number
  orders_success?: number
  orders_failed?: number
  orders_processing?: number
  total_refunds?: number
}

export default function DailyStats() {
  const [date, setDate] = useState<Date | null | undefined>(new Date())

  const { data: dashboardData } = useDashboardMonthly(
    {
      date: date || new Date() // Pass Date object, hook will format it
    },
    !!date
  )

  console.log(dashboardData)

  return (
    <section aria-labelledby='daily-heading' className='lg:col-span-2'>
      <div className='bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 shadow-xl'>
        <h2 id='daily-heading' className='text-2xl font-bold text-white flex items-center gap-2'>
          <BarChart3 size={24} />
          Thống Kê Theo Ngày
        </h2>
        <p className='text-blue-100 text-sm mt-1'>Xem dữ liệu theo ngày</p>
      </div>

      <div className='space-y-6'>
        {/* Date Picker */}
        <div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border-t-4 border-[#f97316] relative z-[100]'>
          <div className='flex items-center gap-2 mb-2'>
            <Calendar size={20} className='text-[#f97316]' />
            <h3 className='text-sm font-semibold text-gray-900 mb-0'>Chọn Ngày</h3>
          </div>
          <div className='flex items-center gap-4'>
            <div className='w-[200px]'>
              <AppReactDatepicker
                selected={date}
                id='callback-open'
                dateFormat='dd/MM/yyyy'
                onChange={(date: Date | null) => setDate(date)}
                customInput={<CustomTextField fullWidth />}
              />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border-t-4 border-[#f97316] shadow-lg z-0'>
          <h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4'>Chỉ Số Chính</h3>
          <div className='grid sm:grid-cols-2 gap-4'>
            <KPICard
              label='Doanh Thu'
              value={dashboardData?.total_revenue ?? 0}
              icon={<DollarSign size={24} />}
              color='blue'
            />
            <KPICard
              label='Lợi Nhuận'
              value={dashboardData?.total_profit ?? 0}
              icon={<TrendingUp size={24} />}
              color='green'
            />
            <KPICard
              label='Tiền Nạp'
              value={dashboardData?.total_deposit ?? 0}
              icon={<Wallet size={24} />}
              color='green'
            />
            <KPICard
              label='Chi Phí'
              value={dashboardData?.total_cost ?? 0}
              icon={<TrendingDown size={24} />}
              color='red'
            />
            <KPICard
              label='Số Giao Dịch Nạp'
              value={dashboardData?.total_deposit_count ?? 0}
              icon={<Receipt size={24} />}
              format='number'
              color='blue'
            />
            <KPICard
              label='Số Tiền Hoàn'
              value={dashboardData?.total_refunts ?? 0}
              icon={<Users size={24} />}
              color='blue'
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border-t-4 border-blue-500 shadow-lg'>
          <h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4'>Tổng Hợp Đơn Hàng</h3>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <KPICard
              label='Tổng Đơn'
              value={dashboardData?.total_orders ?? 0}
              icon={<ShoppingCart size={24} />}
              format='number'
              color='gray'
            />
            <KPICard
              label='Thành Công'
              value={dashboardData?.total_successful_orders ?? 0}
              icon={<CheckCircle size={24} />}
              format='number'
              color='green'
            />
            <KPICard
              label='Thất Bại'
              value={dashboardData?.total_failed_orders ?? 0}
              icon={<XCircle size={24} />}
              format='number'
              color='red'
            />
            <KPICard
              label='Đã Hoàn'
              value={dashboardData?.total_refunds ?? 0}
              icon={<RefreshCw size={24} />}
              format='number'
              color='red'
            />
          </div>
        </div>

        {/* Refunds */}
        <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border-t-4 border-red-500 shadow-lg'>
          <h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4'>Hoàn Tiền</h3>
          <KPICard
            label='Số Tiền Hoàn'
            value={dashboardData?.total_refunds ?? 0}
            icon={<RefreshCw size={24} />}
            color='red'
          />
        </div>
      </div>
    </section>
  )
}
