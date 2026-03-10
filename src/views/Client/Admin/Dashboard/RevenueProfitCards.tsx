'use client'

import { DollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react'

import KPICard from '@/components/UI/KPICard'
import { formatCurrency, formatNumber } from '@/utils/formatters'
import type { FinancialReportData } from '@/hooks/apis/useFinancialReport'

interface RevenueProfitCardsProps {
  revenue: FinancialReportData['revenue']
  deposits: FinancialReportData['deposits']
  periodDays: number
}

export default function RevenueProfitCards({ revenue, deposits, periodDays }: RevenueProfitCardsProps) {
  const fmt = (v: number) => new Intl.NumberFormat('vi-VN').format(Math.round(v))
  const totalDeposit = deposits.deposit_auto + deposits.deposit_manual
  const totalDepositCount = deposits.deposit_auto_count + deposits.deposit_manual_count
  const dailyDeposit = Math.round(totalDeposit / periodDays)
  const dailyDepositCount = Math.round(totalDepositCount / periodDays)

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
      <div>
        <KPICard
          label='Doanh Thu Xác Nhận'
          value={revenue.confirmed}
          icon={<DollarSign size={24} />}
          color='blue'
        />
        <div className='mt-1 px-2 text-xs text-gray-500'>
          Pipeline: <span className='font-semibold text-blue-600'>{fmt(revenue.expected)} đ</span>
          {revenue.refunded > 0 && (
            <span className='text-red-500 ml-1'>(hoàn: {fmt(revenue.refunded)} đ)</span>
          )}
        </div>
      </div>

      <div>
        <KPICard
          label='Chi Phí Thực Tế'
          value={revenue.cost_actual}
          icon={<TrendingDown size={24} />}
          color='red'
        />
        <div className='mt-1 px-2 text-xs text-gray-500'>
          Hoa hồng AF: <span className='font-semibold text-purple-600'>{fmt(revenue.affiliate_cost)} đ</span>
        </div>
      </div>

      <div>
        <KPICard
          label='Lợi Nhuận'
          value={revenue.profit}
          icon={<TrendingUp size={24} />}
          color='green'
        />
        <div className='mt-1 px-2 text-xs text-gray-500'>
          Margin: <span className='font-semibold text-green-600'>{revenue.margin_percent}%</span>
          {' · '}TB: {formatCurrency(Math.round(revenue.profit / periodDays))}/ngày
        </div>
      </div>

      <div>
        <KPICard
          label='Tổng Nạp'
          value={totalDeposit}
          icon={<Wallet size={24} />}
          color='blue'
        />
        <div className='mt-1 px-2 text-xs text-gray-500'>
          {formatNumber(totalDepositCount)} GD · TB: {formatCurrency(dailyDeposit)}/ngày ({dailyDepositCount} bill/ngày)
        </div>
      </div>
    </div>
  )
}
