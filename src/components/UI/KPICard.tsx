'use client'

import { useState, useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/utils/formatters'
import { KPICardProps } from '@/types/dashboard'

export default function KPICard({ label, value, icon, delta, format = 'currency', color = 'blue' }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const prevValueRef = useRef(0)

  const colorClasses = {
    blue: 'text-[#0B6FFF] bg-blue-50',
    green: 'text-[#16A34A] bg-green-50',
    red: 'text-[#DC2626] bg-red-50',
    gray: 'text-[#94A3B8] bg-gray-50'
  }

  // Animation effect - đếm số tăng dần
  useEffect(() => {
    const startValue = prevValueRef.current
    const endValue = value
    const duration = 1000 // 1 giây
    const startTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Easing function - ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (endValue - startValue) * easeOut

      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        prevValueRef.current = endValue
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  const formattedValue = format === 'currency' ? formatCurrency(displayValue) : formatNumber(displayValue)

  return (
    <div className='bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-4 cursor-pointer border border-gray-200 hover:border-[#f97316]/30 group'>
      <div className='flex items-center justify-between mb-2'>
        <div>
          <p className='text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2' >{label}</p>
        
          <h3 className='text-xl font-bold text-gray-900 group-hover:text-[#f97316] transition-colors mb-0'>
            {formattedValue} đ
          </h3>
        </div>
        <div
          className={`p-2.5 rounded-lg ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
    
      {delta !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full mt-2 w-fit ${delta >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {delta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(delta).toFixed(1)}%</span>
        </div>
      )}
    </div>
  )
}
