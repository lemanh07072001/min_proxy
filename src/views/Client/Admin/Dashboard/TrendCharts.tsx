'use client'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import type { DailyTrendItem } from '@/hooks/apis/useFinancialReport'

interface TrendChartsProps {
  data: DailyTrendItem[]
}

function formatCompact(value: number): string {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M'
  if (value >= 1000) return (value / 1000).toFixed(0) + 'K'
  return value.toString()
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null

  return (
    <div className='bg-white rounded-lg shadow-lg border border-gray-100 p-3 text-xs'>
      <div className='font-semibold text-gray-700 mb-2'>{formatDate(label)}</div>
      {payload.map((entry: any) => (
        <div key={entry.name} className='flex items-center justify-between gap-4 py-0.5'>
          <span className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full' style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
          <span className='font-medium'>
            {typeof entry.value === 'number' && entry.value > 1000
              ? formatCompact(entry.value) + ' đ'
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function TrendCharts({ data }: TrendChartsProps) {
  if (!data || data.length < 2) return null

  const chartData = data.map(d => ({
    ...d,
    dateLabel: formatDate(d.date)
  }))

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
      {/* Chart 1: Doanh Thu & Lợi Nhuận */}
      <div className='bg-white rounded-xl p-4 shadow-md border border-gray-100'>
        <h3 className='text-sm font-bold text-gray-800 uppercase tracking-wide mb-3'>
          Doanh Thu & Lợi Nhuận
        </h3>
        <ResponsiveContainer width='100%' height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
            <XAxis dataKey='dateLabel' tick={{ fontSize: 11 }} interval='preserveStartEnd' />
            <YAxis tickFormatter={formatCompact} tick={{ fontSize: 11 }} width={45} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type='monotone'
              dataKey='revenue'
              name='Doanh thu'
              stroke='#3B82F6'
              fill='#3B82F6'
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area
              type='monotone'
              dataKey='profit'
              name='Lợi nhuận'
              stroke='#22C55E'
              fill='#22C55E'
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2: Nạp Tiền Hàng Ngày */}
      <div className='bg-white rounded-xl p-4 shadow-md border border-gray-100'>
        <h3 className='text-sm font-bold text-gray-800 uppercase tracking-wide mb-3'>
          Nạp Tiền Hàng Ngày
        </h3>
        <ResponsiveContainer width='100%' height={220}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
            <XAxis dataKey='dateLabel' tick={{ fontSize: 11 }} interval='preserveStartEnd' />
            <YAxis yAxisId='amount' tickFormatter={formatCompact} tick={{ fontSize: 11 }} width={45} />
            <YAxis yAxisId='count' orientation='right' tick={{ fontSize: 11 }} width={30} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId='amount'
              dataKey='deposits'
              name='Số tiền nạp'
              fill='#06B6D4'
              fillOpacity={0.7}
              radius={[2, 2, 0, 0]}
            />
            <Line
              yAxisId='count'
              type='monotone'
              dataKey='deposit_count'
              name='Số bill'
              stroke='#F97316'
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
