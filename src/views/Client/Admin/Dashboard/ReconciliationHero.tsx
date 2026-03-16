'use client'

import { CheckCircle, AlertTriangle } from 'lucide-react'

import { formatCurrency } from '@/utils/formatters'
import { useReconciliation } from '@/hooks/apis/useFinancialReport'

interface ReconciliationCardProps {
  filterStart?: string
  filterEnd?: string
}

export default function ReconciliationCard({ filterStart, filterEnd }: ReconciliationCardProps) {
  const { data, isLoading } = useReconciliation({ start: filterStart, end: filterEnd })

  if (isLoading) return <div className='rounded-xl p-4 shadow-md border bg-gray-50 text-center text-gray-400 text-sm'>Đang tải đối soát...</div>
  if (!data) return null
  const isBalanced = data.is_balanced

  return (
    <div
      className={`rounded-xl p-4 shadow-md border ${
        isBalanced ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
      }`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {isBalanced ? (
            <CheckCircle size={20} className='text-emerald-600' />
          ) : (
            <AlertTriangle size={20} className='text-red-600' />
          )}
          <div>
            <div className={`text-sm font-bold ${isBalanced ? 'text-emerald-700' : 'text-red-700'}`}>
              {isBalanced ? 'Đối Soát: KHỚP' : `Đối Soát: CHÊNH LỆCH ${formatCurrency(Math.abs(data.diff))}`}
            </div>
            <div className='text-xs text-gray-500 mt-0.5'>
              Kỳ vọng: {formatCurrency(data.balance_expected)} · Thực tế: {formatCurrency(data.balance_actual)}
              {!data.is_all_time && ' · Chỉ chính xác khi xem "Toàn thời gian"'}
            </div>
          </div>
        </div>
        <div className='text-right text-xs text-gray-500'>
          <div>Tiền vào: {formatCurrency(data.deposits_total)}</div>
          <div>Tiền ra: {formatCurrency(data.purchases_total)}</div>
        </div>
      </div>
    </div>
  )
}
