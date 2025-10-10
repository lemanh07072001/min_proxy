'use client'

import { useEffect, useState, useRef } from 'react'

import { Box } from '@mui/material'

interface CountdownSimpleProps {
  time: number // số giây ban đầu (VD: 1152)
}

export default function CountdownSimple({ time }: CountdownSimpleProps) {
  const [seconds, setSeconds] = useState(time)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Khi prop time thay đổi → reset lại
  useEffect(() => {
    setSeconds(time)
  }, [time])

  // Đếm ngược
  useEffect(() => {
    if (seconds <= 0) return

    timerRef.current = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [seconds])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <div className='group w-full'>
        <label className='flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3'>
          Thời gian còn lại (giây)
        </label>
        <div className='relative'>
          <input
            type='text'
            value={seconds > 0 ? `${seconds}s` : 'Hết hạn'}
            readOnly
            className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-slate-700 font-mono text-sm focus:outline-none transition-all
              ${
                seconds <= 10
                  ? 'border-red-400 bg-red-50 text-red-700'
                  : 'border-slate-200 bg-slate-50 focus:border-emerald-500 focus:bg-white'
              }`}
          />
        </div>
      </div>
    </Box>
  )
}
