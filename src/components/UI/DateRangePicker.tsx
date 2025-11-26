import { Calendar } from 'lucide-react'
import { useState } from 'react'
import AppReactDatepicker from '../AppReactDatepicker'
import CustomTextField from '@/@core/components/mui/TextField'

interface DateRangePickerProps {
  onDateChange: (range: string) => void
}

export default function DateRangePicker({ onDateChange }: DateRangePickerProps) {
  const [date, setDate] = useState<Date | null | undefined>(new Date())

  return (
    <div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 border-t-4 border-[#f97316]'>
      <div className='flex items-center gap-2 mb-4'>
        <Calendar size={20} className='text-[#f97316]' />
        <h3 className='text-sm font-semibold text-gray-900'>Date Range</h3>
      </div>
      <div className='flex flex-wrap gap-2'>
        <AppReactDatepicker
          selected={date}
          id='basic-input'
          onChange={(date: Date | null) => setDate(date)}
          placeholderText='Click to select a date'
          customInput={<CustomTextField label='Basic' fullWidth />}
        />
      </div>
    </div>
  )
}
