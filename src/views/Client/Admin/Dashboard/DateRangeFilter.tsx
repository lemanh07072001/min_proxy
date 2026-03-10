'use client'

import { useState } from 'react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Calendar } from 'lucide-react'

type PresetKey = 'today' | '7days' | '30days' | 'this_month' | 'all_time'

interface DateRangeFilterProps {
  onFilterChange: (params: { start?: string; end?: string }) => void
}

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: 'today', label: 'Hôm nay' },
  { key: '7days', label: '7 ngày' },
  { key: '30days', label: '30 ngày' },
  { key: 'this_month', label: 'Tháng này' },
  { key: 'all_time', label: 'Toàn thời gian' }
]

function formatDateParam(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()

  
return `${d}-${m}-${y}`
}

export default function DateRangeFilter({ onFilterChange }: DateRangeFilterProps) {
  const [activePreset, setActivePreset] = useState<PresetKey>('all_time')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const applyPreset = (key: PresetKey) => {
    setActivePreset(key)
    setStartDate(null)
    setEndDate(null)

    const now = new Date()

    if (key === 'all_time') {
      onFilterChange({})
      
return
    }

    let start: Date
    const end = now

    switch (key) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case '7days':
        start = new Date(now)
        start.setDate(start.getDate() - 6)
        break
      case '30days':
        start = new Date(now)
        start.setDate(start.getDate() - 29)
        break
      case 'this_month':
        start = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        start = now
    }

    onFilterChange({ start: formatDateParam(start), end: formatDateParam(end) })
  }

  const applyCustomRange = (start: Date | null, end: Date | null) => {
    if (start && end) {
      setActivePreset('today') // deselect presets visually — won't match any
      // Actually let's use a custom marker
      setActivePreset('' as PresetKey)
      onFilterChange({ start: formatDateParam(start), end: formatDateParam(end) })
    }
  }

  return (
    <div className='bg-white rounded-xl p-4 shadow-md border border-gray-100'>
      <div className='flex flex-wrap items-center gap-2'>
        {PRESETS.map(p => (
          <button
            key={p.key}
            onClick={() => applyPreset(p.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activePreset === p.key
                ? 'bg-[#0B6FFF] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}

        <div className='flex items-center gap-2 ml-auto'>
          <Calendar size={16} className='text-gray-400' />
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => {
              setStartDate(date)
              applyCustomRange(date, endDate)
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat='dd/MM/yyyy'
            placeholderText='Từ ngày'
            className='w-28 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0B6FFF]'
            maxDate={new Date()}
          />
          <span className='text-gray-400'>—</span>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => {
              setEndDate(date)
              applyCustomRange(startDate, date)
            }}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat='dd/MM/yyyy'
            placeholderText='Đến ngày'
            className='w-28 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0B6FFF]'
            maxDate={new Date()}
          />
        </div>
      </div>
    </div>
  )
}
