'use client'

import {
  ShoppingCart,
  XCircle,
  RefreshCw,
  CreditCard,
  Repeat,
  Banknote,
  UserPlus,
  ArrowDownCircle,
  TrendingUp,
  DollarSign,
  Receipt
} from 'lucide-react'

import { formatCurrency, formatNumber } from '@/utils/formatters'
import type { FinancialReportData, OrderStatusItem } from '@/hooks/apis/useFinancialReport'

interface OrdersDepositsRowProps {
  orders: FinancialReportData['orders']
  deposits: FinancialReportData['deposits']
  revenue: FinancialReportData['revenue']
  periodDays: number
}

function StatRow({
  icon,
  label,
  value,
  sub,
  color = 'text-gray-700'
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  color?: string
}) {
  return (
    <div className='flex items-center justify-between py-2 border-b border-gray-50 last:border-0'>
      <div className='flex items-center gap-2 text-sm text-gray-600'>
        {icon}
        {label}
      </div>
      <div className='text-right'>
        <div className={`text-sm font-semibold ${color}`}>{value}</div>
        {sub && <div className='text-xs text-gray-400'>{sub}</div>}
      </div>
    </div>
  )
}

const STATUS_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: 'Chờ xử lý', color: 'text-gray-600' },
  1: { label: 'Đang xử lý', color: 'text-blue-600' },
  2: { label: 'Đang dùng', color: 'text-green-600' },
  3: { label: 'Dùng (thiếu)', color: 'text-yellow-600' },
  4: { label: 'Hết hạn', color: 'text-gray-600' },
  5: { label: 'Thất bại', color: 'text-red-600' },
  6: { label: 'Hoàn 1 phần', color: 'text-orange-600' },
  7: { label: 'Chờ hoàn', color: 'text-yellow-600' },
  8: { label: 'Hoàn toàn bộ', color: 'text-red-600' },
  9: { label: 'Đang mua bù', color: 'text-blue-600' }
}

export default function OrdersDepositsRow({ orders, deposits, revenue, periodDays }: OrdersDepositsRowProps) {
  const dailyOrders = Math.round(orders.total / periodDays)
  const totalDeposit = deposits.deposit_auto + deposits.deposit_manual
  const totalDepositCount = deposits.deposit_auto_count + deposits.deposit_manual_count
  const dailyDepositAmount = Math.round(totalDeposit / periodDays)
  const dailyDepositCount = Math.round(totalDepositCount / periodDays)

  // Dòng tiền ròng = Nạp - Thanh toán - Rút AF
  const netCashFlow = totalDeposit - Math.abs(deposits.payment_total) - deposits.affiliate_withdrawn
  const isPositiveCashFlow = netCashFlow >= 0

  // Chỉ số chiến lược — dùng confirmed thay gross
  const totalConfirmed = revenue.confirmed
  const aov = orders.total > 0 ? Math.round(totalConfirmed / orders.total) : 0
  const renewalRate = orders.total > 0 ? ((orders.renewal / orders.total) * 100).toFixed(1) : '0'
  const failedCount = orders.by_status.find(s => s.status === 5)?.count ?? 0
  const failRate = orders.total > 0 ? ((failedCount / orders.total) * 100).toFixed(1) : '0'
  const refundRate = totalConfirmed > 0 ? ((revenue.refunded / totalConfirmed) * 100).toFixed(1) : '0'

  // Chỉ hiện statuses có count > 0
  const activeStatuses = orders.by_status.filter(s => s.count > 0)

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      {/* Đơn Hàng */}
      <div className='bg-white rounded-xl p-4 shadow-md border border-gray-100'>
        <h3 className='text-sm font-bold text-gray-800 uppercase tracking-wide mb-1 flex items-center gap-2'>
          <ShoppingCart size={16} className='text-blue-500' />
          Đơn Hàng
        </h3>
        <div className='text-xs text-gray-400 mb-3'>
          TB: {formatNumber(dailyOrders)} đơn/ngày · Tổng: {formatNumber(orders.total)}
        </div>
        {activeStatuses.map((s: OrderStatusItem) => {
          const meta = STATUS_LABELS[s.status] ?? { label: s.label, color: 'text-gray-600' }
          const pct = orders.total > 0 ? ((s.count / orders.total) * 100).toFixed(1) : '0'

          
return (
            <StatRow
              key={s.status}
              icon={<span className={`w-2 h-2 rounded-full inline-block ${meta.color.replace('text-', 'bg-')}`} />}
              label={meta.label}
              value={formatNumber(s.count)}
              sub={`${pct}% · ${formatCurrency(s.total_amount)}`}
              color={meta.color}
            />
          )
        })}
        <div className='mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500'>
          <span className='flex items-center gap-1'>
            <CreditCard size={12} />
            Mua mới: {formatNumber(orders.buy)}
          </span>
          <span className='flex items-center gap-1'>
            <Repeat size={12} />
            Gia hạn: {formatNumber(orders.renewal)}
          </span>
        </div>
      </div>

      {/* Dòng Tiền Chi Tiết */}
      <div className='bg-white rounded-xl p-4 shadow-md border border-gray-100'>
        <h3 className='text-sm font-bold text-gray-800 uppercase tracking-wide mb-1 flex items-center gap-2'>
          <Banknote size={16} className='text-green-500' />
          Dòng Tiền
        </h3>
        <div className='text-xs text-gray-400 mb-3'>
          TB: {formatCurrency(dailyDepositAmount)}/ngày · {formatNumber(dailyDepositCount)} bill/ngày
        </div>
        <StatRow
          icon={<ArrowDownCircle size={14} className='text-green-500' />}
          label='Nạp tự động'
          value={formatCurrency(deposits.deposit_auto)}
          sub={`${formatNumber(deposits.deposit_auto_count)} GD`}
          color='text-green-600'
        />
        <StatRow
          icon={<UserPlus size={14} className='text-blue-500' />}
          label='Nạp thủ công'
          value={formatCurrency(deposits.deposit_manual)}
          sub={`${formatNumber(deposits.deposit_manual_count)} GD`}
          color='text-blue-600'
        />
        <div className='mt-3 pt-3 border-t border-gray-100'>
          <StatRow
            icon={<Receipt size={14} className='text-indigo-500' />}
            label='Thanh toán'
            value={formatCurrency(Math.abs(deposits.payment_total))}
            sub={`${formatNumber(deposits.payment_count)} GD`}
            color='text-indigo-600'
          />
          <StatRow
            icon={<RefreshCw size={14} className='text-red-500' />}
            label='Hoàn tiền'
            value={formatCurrency(deposits.refund_total)}
            sub={`${formatNumber(deposits.refund_count)} GD`}
            color='text-red-600'
          />
          <StatRow
            icon={<UserPlus size={14} className='text-purple-500' />}
            label='Rút hoa hồng AF'
            value={formatCurrency(deposits.affiliate_withdrawn)}
            color='text-purple-600'
          />
        </div>
        <div className={`mt-3 pt-3 border-t-2 ${isPositiveCashFlow ? 'border-green-200' : 'border-red-200'}`}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-sm font-bold text-gray-700'>
              <Banknote size={14} className={isPositiveCashFlow ? 'text-green-600' : 'text-red-600'} />
              Dòng tiền ròng
            </div>
            <div className={`text-sm font-bold ${isPositiveCashFlow ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveCashFlow ? '+' : ''}{formatCurrency(netCashFlow)}
            </div>
          </div>
          <div className='text-xs text-gray-400 mt-0.5 text-right'>
            Nạp - Thanh toán - Rút AF
          </div>
        </div>
      </div>

      {/* Chỉ Số Chiến Lược */}
      <div className='bg-white rounded-xl p-4 shadow-md border border-gray-100'>
        <h3 className='text-sm font-bold text-gray-800 uppercase tracking-wide mb-1 flex items-center gap-2'>
          <TrendingUp size={16} className='text-indigo-500' />
          Chỉ Số Chiến Lược
        </h3>
        <div className='text-xs text-gray-400 mb-3'>
          Đánh giá sức khỏe kinh doanh
        </div>
        <StatRow
          icon={<DollarSign size={14} className='text-blue-500' />}
          label='Giá trị đơn TB'
          value={formatCurrency(aov)}
          sub='AOV — trung bình mỗi đơn'
          color='text-blue-600'
        />
        <StatRow
          icon={<Repeat size={14} className='text-green-500' />}
          label='Tỉ lệ gia hạn'
          value={`${renewalRate}%`}
          sub={`${formatNumber(orders.renewal)} / ${formatNumber(orders.total)} đơn`}
          color={Number(renewalRate) >= 15 ? 'text-green-600' : 'text-orange-600'}
        />
        <StatRow
          icon={<XCircle size={14} className='text-red-500' />}
          label='Tỉ lệ thất bại'
          value={`${failRate}%`}
          sub={`${formatNumber(failedCount)} đơn lỗi`}
          color={Number(failRate) <= 5 ? 'text-green-600' : 'text-red-600'}
        />
        <StatRow
          icon={<RefreshCw size={14} style={{ color: 'var(--primary-hover, #f97316)' }} />}
          label='Tỉ lệ hoàn tiền'
          value={`${refundRate}%`}
          sub={`${formatCurrency(revenue.refunded)} / ${formatCurrency(totalConfirmed)}`}
          color={Number(refundRate) <= 5 ? 'text-green-600' : 'text-red-600'}
        />
        <div className='mt-3 pt-3 border-t border-gray-100'>
          <StatRow
            icon={<CreditCard size={14} className='text-gray-500' />}
            label='Tỉ lệ chi tiêu'
            value={`${totalDeposit > 0 ? ((Math.abs(deposits.payment_total) / totalDeposit) * 100).toFixed(0) : 0}%`}
            sub='Tiền mua / Tiền nạp'
            color='text-gray-700'
          />
        </div>
      </div>
    </div>
  )
}
