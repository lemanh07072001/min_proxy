import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/libs/auth'
import axiosInstance from '@/libs/axios'
import KPICard from '@/components/UI/KPICard'
import DailyStats from '@/components/Dashboard/DailyStats'
import { Grid2 } from '@mui/material'
import {
  CheckCircle,
  Clock,
  DollarSign,
  Receipt,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  XCircle
} from 'lucide-react'

// Server-side data fetching
async function getDashboardData() {
  const session = (await getServerSession(authOptions as any)) as any

  if (!session?.access_token) {
    return null
  }

  try {
    const response = await axiosInstance.get('get-dashboard', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    console.log(response?.data?.data)

    return response?.data?.data ?? null
  } catch (error: any) {
    console.error('[Dashboard] Error fetching data:', error.message)
    return null
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  // Default values if no data
  const cumulative = data ?? {
    total_revenue: 0,
    total_profit: 0,
    total_costs: 0,
    total_topups: 0,
    topup_transactions: 0,
    user_balance: 0,
    total_orders: 0,
    orders_success: 0,
    orders_failed: 0,
    orders_processing: 0
  }

  return (
    <>
      <Grid2 container spacing={4}>
        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <section aria-labelledby='cumulative-heading' className='lg:col-span-1'>
            <div className='bg-gradient-to-br from-[#f97316] to-orange-600 rounded-2xl p-6 mb-6 shadow-xl'>
              <h2 id='cumulative-heading' className='text-2xl font-bold text-white flex items-center gap-2'>
                <TrendingUp size={24} />
                Tổng Quan Toàn Thời Gian
              </h2>
              <p className='text-orange-100 text-sm mt-1'>Số liệu hiệu suất tích lũy</p>
            </div>

            <div className='space-y-4'>
              <div className='bg-white/80 backdrop-blur-sm rounded-xl p-4 border-l-4 border-[#f97316] shadow-lg'>
                <h3 className='text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3'>
                  Doanh Thu & Tài Chính
                </h3>
                <div className='space-y-3'>
                  <KPICard
                    label='Tổng Doanh Thu'
                    value={data.total_revenue}
                    icon={<DollarSign size={24} />}
                    color='blue'
                  />
                  <KPICard
                    label='Tổng Lợi Nhuận'
                    value={data.total_profit}
                    icon={<TrendingUp size={24} />}
                    color='green'
                  />
                  <KPICard label='Tổng Chi Phí' value={data.total_cost} icon={<TrendingDown size={24} />} color='red' />
                </div>
              </div>

              <div className='bg-white/80 backdrop-blur-sm rounded-xl p-4 border-l-4 border-green-500 shadow-lg'>
                <h3 className='text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3'>Nạp Tiền</h3>
                <div className='space-y-3'>
                  <KPICard label='Tổng Tiền Nạp' value={data.total_deposit} icon={<Wallet size={24} />} color='green' />
                  <KPICard
                    label='Số Giao Dịch Nạp'
                    value={data.total_deposit_count}
                    icon={<Receipt size={24} />}
                    format='number'
                    color='blue'
                  />
                  <KPICard
                    label='Số Dư Người Dùng'
                    value={data.balance_remaining}
                    icon={<Users size={24} />}
                    color='blue'
                  />
                </div>
              </div>

              <div className='bg-white/80 backdrop-blur-sm rounded-xl p-4 border-l-4 border-blue-500 shadow-lg'>
                <h3 className='text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3'>Đơn Hàng</h3>
                <div className='space-y-3'>
                  <KPICard
                    label='Tổng Đơn Hàng'
                    value={cumulative.total_orders}
                    icon={<ShoppingCart size={24} />}
                    format='number'
                    color='gray'
                  />
                  <KPICard
                    label='Đơn Thành Công'
                    value={cumulative.orders_success}
                    icon={<CheckCircle size={24} />}
                    format='number'
                    color='green'
                  />
                  <KPICard
                    label='Đơn Thất Bại'
                    value={cumulative.orders_failed}
                    icon={<XCircle size={24} />}
                    format='number'
                    color='red'
                  />
                  <KPICard
                    label='Đơn Đang Xử Lý'
                    value={cumulative.orders_processing}
                    icon={<Clock size={24} />}
                    format='number'
                    color='gray'
                  />
                </div>
              </div>
            </div>
          </section>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, lg: 8 }}>
          <DailyStats />
        </Grid2>
      </Grid2>
    </>
  )
}
