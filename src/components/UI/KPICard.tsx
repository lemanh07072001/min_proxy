import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/utils/formatters'
import { KPICardProps } from '@/types/dashboard'

export default function KPICard({ label, value, icon, delta, format = 'currency', color = 'blue' }: KPICardProps) {
  const colorClasses = {
    blue: 'text-[#0B6FFF] bg-blue-50',
    green: 'text-[#16A34A] bg-green-50',
    red: 'text-[#DC2626] bg-red-50',
    gray: 'text-[#94A3B8] bg-gray-50'
  }

  const formattedValue = format === 'currency' ? formatCurrency(value) : formatNumber(value)

  return (
    <div className='bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-4 cursor-pointer border border-gray-100 hover:border-[#f97316]/30 group'>
      <div className='flex items-start justify-between mb-3'>
        <div
          className={`p-2.5 rounded-lg ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        {delta !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${delta >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {delta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(delta).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div className='space-y-1'>
        <h3 className='text-xl font-bold text-gray-900 group-hover:text-[#f97316] transition-colors'>
          {formattedValue}
        </h3>
        <p className='text-xs text-gray-600 font-semibold uppercase tracking-wide'>{label}</p>
      </div>
    </div>
  )
}
