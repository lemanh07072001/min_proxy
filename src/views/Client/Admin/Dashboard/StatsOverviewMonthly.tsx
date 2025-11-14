'use client'

import { Grid2 } from '@mui/material'
import { User, DollarSign, AlertCircle, Info, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
interface StatsOverviewMonthlyProps {
  data?: {
    active_proxies?: number
    completed_orders?: number
    total_deposit?: number
    total_orders?: number
    total_proxies?: number
    total_revenue?: number
    total_sales?: number
    total_users?: number
    refunded_orders?: number
    total_price_cost?: number
  }
}

export default function StatsOverviewMonthly({ data }: StatsOverviewMonthlyProps) {
  return (
    <div className='mb-8'>
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
                    {data?.total_revenue?.toLocaleString('vi-VN') || '0'} ₫
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
                    {data?.total_revenue?.toLocaleString('vi-VN') || '0'} ₫
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

        {/* Tổng tiền user đã nạp */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
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
        </Grid2>
      </Grid2>
    </div>
  )
}
