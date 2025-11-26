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
  const { data: session } = useSession() as any
  const [date, setDate] = useState<Date | null>(new Date())
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DailyData | null>(null)

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const fetchDataByDate = async (selectedDate: Date) => {
    if (!session?.access_token) return

    setLoading(true)
    try {
      const dateStr = formatDate(selectedDate)

      const res = await fetch(`/api/admin/dashboard/by-date?date=${dateStr}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })
      const result = await res.json()
      setData(result?.data ?? null)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data khi component mount và khi date thay đổi
  useEffect(() => {
    if (date && session?.access_token) {
      fetchDataByDate(date)
    }
  }, [date, session?.access_token])

  const daily = data ?? {
    total_revenue: 0,
    total_profit: 0,
    total_cost: 0,
    total_deposit: 0,
    total_deposit_count: 0,
    balance_remaining: 0,
    total_orders: 0,
    orders_success: 0,
    orders_failed: 0,
    orders_processing: 0,
    total_refunds: 0
  }

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
        <div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 border-t-4 border-[#f97316]'>
          <div className='flex items-center gap-2 mb-4'>
            <Calendar size={20} className='text-[#f97316]' />
            <h3 className='text-sm font-semibold text-gray-900'>Chọn Ngày</h3>
          </div>
          <div className='flex items-center gap-4'>
            <div className='w-[200px]'>
              <AppReactDatepicker
                selected={date}
                onChange={(newDate: Date | null) => setDate(newDate)}
                placeholderText='Chọn ngày'
                customInput={<CustomTextField label='Ngày' fullWidth />}
                dateFormat='dd/MM/yyyy'
              />
            </div>
            {loading && <Loader2 size={20} className='animate-spin text-[#f97316]' />}
          </div>
        </div>

        {/* Key Metrics */}
        <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border-t-4 border-[#f97316] shadow-lg'>
          <h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4'>Chỉ Số Chính</h3>
          <div className='grid sm:grid-cols-2 gap-4'>
            <KPICard label='Doanh Thu' value={daily.total_revenue ?? 0} icon={<DollarSign size={24} />} color='blue' />
            <KPICard label='Lợi Nhuận' value={daily.total_profit ?? 0} icon={<TrendingUp size={24} />} color='green' />
            <KPICard label='Tiền Nạp' value={daily.total_deposit ?? 0} icon={<Wallet size={24} />} color='green' />
            <KPICard label='Chi Phí' value={daily.total_cost ?? 0} icon={<TrendingDown size={24} />} color='red' />
            <KPICard
              label='Số Giao Dịch Nạp'
              value={daily.total_deposit_count ?? 0}
              icon={<Receipt size={24} />}
              format='number'
              color='blue'
            />
            <KPICard
              label='Số Dư Người Dùng'
              value={daily.balance_remaining ?? 0}
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
              value={daily.total_orders ?? 0}
              icon={<ShoppingCart size={24} />}
              format='number'
              color='gray'
            />
            <KPICard
              label='Thành Công'
              value={daily.orders_success ?? 0}
              icon={<CheckCircle size={24} />}
              format='number'
              color='green'
            />
            <KPICard
              label='Thất Bại'
              value={daily.orders_failed ?? 0}
              icon={<XCircle size={24} />}
              format='number'
              color='red'
            />
            <KPICard
              label='Đang Xử Lý'
              value={daily.orders_processing ?? 0}
              icon={<Clock size={24} />}
              format='number'
              color='gray'
            />
          </div>
        </div>

        {/* Refunds */}
        <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border-t-4 border-red-500 shadow-lg'>
          <h3 className='text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4'>Hoàn Tiền</h3>
          <KPICard label='Số Tiền Hoàn' value={daily.total_refunds ?? 0} icon={<RefreshCw size={24} />} color='red' />
        </div>
      </div>
    </section>
  )
}
