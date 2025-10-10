'use client'

import { useEffect, useState } from 'react'

import { Box } from '@mui/material'

// 🔹 Hàm format số giây còn lại thành ngày - giờ - phút - giây
function formatTimeLeft(totalSeconds: number) {
  if (totalSeconds <= 0) return 'Hết hạn'

  const days = Math.floor(totalSeconds / (24 * 3600))
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  // Nếu còn hơn 1 ngày → hiện cả ngày, còn lại chỉ hiện giờ/phút/giây
  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

interface CountdownProps {
  expiresAt: number // timestamp hết hạn (giây)
}

export default function ProxyDie({ expiresAt }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(expiresAt - Math.floor(Date.now() / 1000))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <div className='group w-full'>
        <label className='flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3'>
          ⏳ Thời gian còn lại
        </label>
        <div className='relative'>
          <input
            type='text'
            value={formatTimeLeft(timeLeft)}
            readOnly
            className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-slate-700 font-mono text-sm focus:outline-none transition-all
              ${timeLeft < 60 ? 'border-red-400 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50'}
            `}
          />
        </div>
      </div>
    </Box>
  )
}
