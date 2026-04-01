'use client'

import { TrendingUp, TrendingDown, DollarSign, Receipt, RefreshCw, Users, Clock } from 'lucide-react'

import { formatCurrency } from '@/utils/formatters'
import type { FinancialReportData } from '@/hooks/apis/useFinancialReport'

interface ProfitHeroProps {
  revenue: FinancialReportData['revenue']
  periodDays: number
}

export default function ProfitHero({ revenue, periodDays }: ProfitHeroProps) {
  const isProfitable = revenue.profit > 0

  const bgClass = isProfitable
    ? 'from-emerald-500 to-emerald-700'
    : 'from-red-500 to-red-700'

  const dailyProfit = Math.round(revenue.profit / periodDays)
  const dailyRevenue = Math.round(revenue.confirmed / periodDays)

  // Lợi nhuận dự kiến từ đơn đang hoạt động
  const expectedCost = revenue.expected_cost ?? 0
  const expectedAffiliate = revenue.expected_affiliate ?? 0
  const expectedProfit = revenue.expected > 0
    ? Math.round(revenue.expected - expectedCost - expectedAffiliate)
    : 0

  return (
    <div className={`bg-gradient-to-br ${bgClass} rounded-2xl p-6 shadow-xl text-white`}>
      {/* Status + Profit */}
      <div className='flex items-start justify-between mb-4'>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            {isProfitable ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            <span className='text-sm font-medium uppercase tracking-wider opacity-80'>
              {isProfitable ? 'Đang có lãi' : 'Đang lỗ'}
            </span>
          </div>
          <div className='text-3xl font-bold'>
            {formatCurrency(Math.abs(revenue.profit))}
          </div>
          <div className='text-sm opacity-70 mt-1'>
            Trung bình: {formatCurrency(Math.abs(dailyProfit))}/ngày · Biên lợi nhuận: {revenue.margin_percent}%
          </div>
          {revenue.expected > 0 && (
            <div className='text-xs opacity-60 mt-1'>
              Đang hoạt động: {formatCurrency(revenue.expected)} → lãi dự kiến +{formatCurrency(expectedProfit)}
            </div>
          )}
          {(revenue.confirmed > 0 || revenue.expected > 0) && (
            <div className='text-xs opacity-60 mt-0.5'>
              Tổng dự kiến: Doanh thu {formatCurrency(revenue.confirmed + revenue.expected)} · Chi phí {formatCurrency(revenue.cost_actual + expectedCost)} · Lãi {formatCurrency(revenue.profit + expectedProfit)}
            </div>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <div className='bg-white/15 rounded-xl px-4 py-3 text-right'>
            <div className='text-xs opacity-70'>Doanh thu hoàn thành</div>
            <div className='text-xl font-bold'>{formatCurrency(revenue.confirmed)}</div>
            <div className='text-xs opacity-70'>Trung bình: {formatCurrency(dailyRevenue)}/ngày</div>
          </div>
          {expectedProfit > 0 && (
            <div className='bg-white/10 rounded-xl px-4 py-2 text-right'>
              <div className='text-xs opacity-70 flex items-center justify-end gap-1'>
                <Clock size={10} />
                Lợi nhuận dự kiến
              </div>
              <div className='text-lg font-bold text-yellow-200'>+{formatCurrency(expectedProfit)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown */}
      <div className='grid grid-cols-5 gap-3'>
        <div className='bg-white/10 rounded-lg px-3 py-2'>
          <div className='flex items-center gap-1.5 text-xs opacity-70 mb-1'>
            <DollarSign size={12} />
            Doanh thu
          </div>
          <div className='font-semibold'>{formatCurrency(revenue.confirmed)}</div>
        </div>
        <div className='bg-white/10 rounded-lg px-3 py-2'>
          <div className='flex items-center gap-1.5 text-xs opacity-70 mb-1'>
            <Receipt size={12} />
            Chi phí
          </div>
          <div className='font-semibold'>{formatCurrency(revenue.cost_actual)}</div>
        </div>
        <div className='bg-white/10 rounded-lg px-3 py-2'>
          <div className='flex items-center gap-1.5 text-xs opacity-70 mb-1'>
            <RefreshCw size={12} />
            Đã hoàn tiền
          </div>
          <div className='font-semibold'>{formatCurrency(revenue.refunded)}</div>
        </div>
        <div className='bg-white/10 rounded-lg px-3 py-2'>
          <div className='flex items-center gap-1.5 text-xs opacity-70 mb-1'>
            <Users size={12} />
            Hoa hồng giới thiệu
          </div>
          <div className='font-semibold'>{formatCurrency(revenue.affiliate_cost)}</div>
        </div>
        <div className='bg-white/10 rounded-lg px-3 py-2'>
          <div className='flex items-center gap-1.5 text-xs opacity-70 mb-1'>
            <Clock size={12} />
            Đang hoạt động
          </div>
          <div className='font-semibold text-yellow-200'>{formatCurrency(revenue.expected)}</div>
        </div>
      </div>
    </div>
  )
}
