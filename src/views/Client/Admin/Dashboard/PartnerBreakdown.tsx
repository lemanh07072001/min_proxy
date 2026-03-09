'use client'

import { formatCurrency, formatNumber } from '@/utils/formatters'
import { Building2 } from 'lucide-react'
import type { PartnerBreakdownItem } from '@/hooks/apis/useFinancialReport'

interface PartnerBreakdownProps {
  data: PartnerBreakdownItem[]
}

export default function PartnerBreakdown({ data }: PartnerBreakdownProps) {
  if (!data || data.length === 0) return null

  return (
    <div className='bg-white rounded-xl p-4 shadow-md border border-gray-100'>
      <h3 className='text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2'>
        <Building2 size={16} className='text-indigo-500' />
        Hiệu Suất Theo Partner
      </h3>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='text-left py-2 px-2 text-xs font-semibold text-gray-500 uppercase'>Partner</th>
              <th className='text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase'>Đơn hàng</th>
              <th className='text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase'>Doanh thu</th>
              <th className='text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase'>Chi phí</th>
              <th className='text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase'>Lợi nhuận</th>
              <th className='text-right py-2 px-2 text-xs font-semibold text-gray-500 uppercase'>Margin</th>
            </tr>
          </thead>
          <tbody>
            {data.map((partner) => (
              <tr key={partner.partner_id} className='border-b border-gray-50 hover:bg-gray-50'>
                <td className='py-2 px-2 font-medium text-gray-800'>{partner.partner_name}</td>
                <td className='py-2 px-2 text-right text-gray-600'>{formatNumber(partner.order_count)}</td>
                <td className='py-2 px-2 text-right text-blue-600 font-medium'>{formatCurrency(partner.total_amount)}</td>
                <td className='py-2 px-2 text-right text-red-600'>{formatCurrency(partner.cost_actual)}</td>
                <td className={`py-2 px-2 text-right font-semibold ${partner.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(partner.profit)}
                </td>
                <td className='py-2 px-2 text-right'>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                    partner.margin_percent >= 40 ? 'bg-green-100 text-green-700'
                    : partner.margin_percent >= 20 ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                    {partner.margin_percent}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
