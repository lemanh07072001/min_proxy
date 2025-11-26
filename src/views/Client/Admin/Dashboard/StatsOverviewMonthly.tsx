'use client'

import { Grid2, IconButton, MenuItem } from '@mui/material'
import { User, DollarSign, AlertCircle, Info, TrendingUp, Calendar, X, Shield, CheckCircle } from 'lucide-react'
import { useState, forwardRef, useEffect } from 'react'
import Tooltip from '@mui/material/Tooltip'
import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/components/AppReactDatepicker'
import InputAdornment from '@mui/material/InputAdornment'
import type { TextFieldProps } from '@mui/material/TextField'
import { useDashboardMonthly } from '@/hooks/apis/useDashboard'

// Third-party Imports
import { format } from 'date-fns'

type CustomInputProps = TextFieldProps & {
  label: string
  end: Date | number
  start: Date | number
  onClear?: (e: React.MouseEvent) => void
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
  const { label, start, end, onClear, ...rest } = props

  // Handle case when start or end is undefined
  const startDate = start ? format(start, 'dd/MM/yyyy') : ''
  const endDate = end && end !== null ? ` - ${format(end, 'dd/MM/yyyy')}` : ''

  const value = startDate || endDate ? `${startDate}${endDate}` : ''

  return (
    <CustomTextField
      fullWidth
      inputRef={ref}
      {...rest}
      label={label}
      value={value}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position='start'>
              <Calendar size={16} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position='end'>
              {start || end ? (
                <IconButton aria-label='clear' size='small' onClick={onClear}>
                  <X size={16} />
                </IconButton>
              ) : null}
            </InputAdornment>
          )
        }
      }}
    />
  )
})

export default function StatsOverviewMonthly() {
  const [startDate, setStartDate] = useState<Date | null | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | null | undefined>(undefined)
  const [selectedProtocol, setSelectedProtocol] = useState<string>('http')

  // Convert date to timestamp (seconds)
  const dateTimestamp = startDate ? format(startDate, 'dd/MM/yyyy') : undefined

  console.log(dateTimestamp);
  
  // Use custom hook to fetch dashboard data
  const { data } = useDashboardMonthly(
    {
      date: dateTimestamp 
    },
    !!startDate
  )

  const handleOnChange = (dates: any) => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)
  }

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation()
    setStartDate(undefined)
    setEndDate(undefined)
  }

  console.log(data)

  return (
    <div className='mb-8'>
      <div className='mb-4'>
        <Grid2 container spacing={6}>
          <Grid2 size={{ xs: 12, md: 8 }}>
            <AppReactDatepicker
              selectsRange
              endDate={endDate as Date}
              selected={startDate}
              startDate={startDate as Date}
              id='date-range-picker'
              onChange={handleOnChange}
              shouldCloseOnSelect={false}
              customInput={
                <CustomInput
                  label='Chọn thời gian'
                  start={startDate as Date | number}
                  end={endDate as Date | number}
                  onClear={handleClearDate}
                />
              }
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#64748b',
                  fontWeight: '600',
                  fontSize: '11px',
                  marginBottom: '8px'
                }}
              >
                <Shield size={16} />
                GIAO THỨC
              </label>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                {(data?.protocols || ['http', 'socks5']).map((protocol: string, index: number) => (
                  <label
                    key={protocol}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      border:
                        selectedProtocol === protocol
                          ? '2px solid var(--mui-palette-primary-main)'
                          : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor:
                        selectedProtocol === protocol ? 'var(--mui-palette-primary-lightOpacity)' : 'white',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type='radio'
                      value={protocol}
                      checked={selectedProtocol === protocol}
                      onChange={(e) => setSelectedProtocol(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{protocol.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
          </Grid2>
        </Grid2>
      </div>
      <Grid2 container spacing={2}>
        {/* Tổng doanh thu */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Tooltip title='Tổng doanh thu' arrow>
            <div className='relative bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-300 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h3 className='text-sm mb-0 font-medium text-slate-600'>Doanh thu</h3>
                    <div className='relative'>
                      <Info className='w-4 h-4 text-slate-400' />
                    </div>
                  </div>
                  <p className='text-2xl font-bold text-slate-900 mb-0'>
                    {data?.total_revenue?.toLocaleString('vi-VN') || '0'} ₫
                  </p>
                </div>
                <div className='p-3 rounded-lg bg-emerald-100'>
                  <DollarSign className='w-6 h-6 text-emerald-600' />
                </div>
              </div>
            </div>
          </Tooltip>
        </Grid2>

        {/* Tổng tiền nạp */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Tooltip title='Tổng tiền nạp khác hàng đã nạp vào hệ thống' arrow>
            <div className='relative bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-300 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h3 className='text-sm mb-0 font-medium text-slate-600'>Tổng tiền nạp</h3>
                    <div className='relative'>
                      <Info className='w-4 h-4 text-slate-400' />
                    </div>
                  </div>
                  <p className='text-2xl font-bold text-slate-900 mb-0'>
                    {data?.total_deposit?.toLocaleString('vi-VN') || '0'} ₫
                  </p>
                </div>
                <div className='p-3 rounded-lg bg-emerald-100'>
                  <DollarSign className='w-6 h-6 text-emerald-600' />
                </div>
              </div>
            </div>
          </Tooltip>
        </Grid2>

        {/* Tổng giao dịch nạp tiền */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Tooltip title='Tổng giao dịch nạp tiền thành công!' arrow>
            <div className='relative bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-300 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h3 className='text-sm mb-0 font-medium text-slate-600'>Tổng giao dịch nạp tiền</h3>
                    <div className='relative'>
                      <Info className='w-4 h-4 text-slate-400' />
                    </div>
                  </div>
                  <p className='text-2xl font-bold text-slate-900 mb-0'>
                    {data?.total_deposit_count?.toLocaleString('vi-VN') || '0'} ₫
                  </p>
                </div>
                <div className='p-3 rounded-lg bg-emerald-100'>
                  <DollarSign className='w-6 h-6 text-emerald-600' />
                </div>
              </div>
            </div>
          </Tooltip>
        </Grid2>

        {/* Tổng chi phí */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Tooltip title='Tổng chi phí vận hành và hoạt động' arrow>
            <div className='relative bg-gradient-to-br from-red-50 to-rose-50 border-red-200 border rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h3 className='text-sm mb-0 font-medium text-slate-600'>Tổng chi phí</h3>
                    <div className='relative'>
                      <Info className='w-4 h-4 text-slate-400' />
                    </div>
                  </div>
                  <p className='text-2xl font-bold text-slate-900 mb-0'>
                    {data?.total_cost?.toLocaleString('vi-VN') || '0'} ₫
                  </p>
                </div>
                <div className='p-3 rounded-lg bg-red-100'>
                  <DollarSign className='w-6 h-6 text-red-600' />
                </div>
              </div>
            </div>
          </Tooltip>
        </Grid2>

        {/* Tổng tiền hoàn */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Tooltip title='Tổng tiền đã hoàn trả cho khách' arrow>
            <div className='relative bg-gradient-to-br from-red-50 to-rose-50 border-red-200 border rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h3 className='text-sm mb-0 font-medium text-slate-600'>Tổng tiền hoàn</h3>
                    <div className='relative'>
                      <Info className='w-4 h-4 text-slate-400' />
                    </div>
                  </div>
                  <p className='text-2xl font-bold text-slate-900 mb-0'>
                    {data?.total_failed?.toLocaleString('vi-VN') || '0'} ₫
                  </p>
                </div>
                <div className='p-3 rounded-lg bg-red-100'>
                  <DollarSign className='w-6 h-6 text-red-600' />
                </div>
              </div>
            </div>
          </Tooltip>
        </Grid2>

        {/* Tổng lợi nhuận */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Tooltip title='Lợi nhuận ròng sau khi trừ chi phí' arrow>
            <div className='relative bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-300 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h3 className='text-sm mb-0 font-medium text-slate-600'>Tổng lợi nhuận</h3>
                    <div className='relative'>
                      <Info className='w-4 h-4 text-slate-400' />
                    </div>
                  </div>
                  <p className='text-2xl font-bold text-slate-900 mb-0'>
                    {data?.total_profit?.toLocaleString('vi-VN') || '0'} ₫
                  </p>
                </div>
                <div className='p-3 rounded-lg bg-emerald-100'>
                  <DollarSign className='w-6 h-6 text-emerald-600' />
                </div>
              </div>
            </div>
          </Tooltip>
        </Grid2>

        {/* Tổng tiền user đã nạp */}
        {/* <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Tooltip title='Tổng số dữ tích luỹ trong tài khoản người dùng' arrow>
            <div className='relative bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-300 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h3 className='text-sm mb-0 font-medium text-slate-600'>Tổng tiền user đã nạp</h3>
                    <div className='relative'>
                      <Info className='w-4 h-4 text-slate-400' />
                    </div>
                  </div>
                  <p className='text-2xl font-bold text-slate-900 mb-0'>
                    {data?.total_revenue?.toLocaleString('vi-VN') || '0'} ₫
                  </p>
                </div>
                <div className='p-3 rounded-lg bg-emerald-100'>
                  <DollarSign className='w-6 h-6 text-emerald-600' />
                </div>
              </div>
            </div>
          </Tooltip>
        </Grid2> */}
      </Grid2>
    </div>
  )
}
