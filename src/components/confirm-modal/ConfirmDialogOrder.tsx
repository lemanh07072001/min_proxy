import { log } from 'console'

import React from 'react'

import { CheckCircle, X } from 'lucide-react'

import { DURATION_MAP } from '@/utils/empty'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  quantity: number
  protocol: 'HTTP' | 'SOCKS5'
  price: number
  packageName: string
  ip_version: string
  total: number
  daysInNumber: any
}

export const ConfirmDialogOrder: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  quantity = 0,
  protocol,
  price = 0,
  packageName = 'test',
  ip_version,
  total,
  daysInNumber
}) => {
  if (!isOpen) return null

  console.log(daysInNumber)

  return (
    <div className='fixed inset-0 z-[5000] flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />

      <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden'>
        {/* Header */}
        <div className='p-6 pb-4'>
          <div className='flex items-center space-x-3 mb-4'>
            <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
              <CheckCircle className='w-6 h-6 text-red-500' />
            </div>
            <h2 className='text-xl font-bold text-gray-900'>Xác nhận đơn hàng</h2>
          </div>

          <p className='text-gray-600 leading-relaxed'>
            Bạn có chắc chắn muốn mua gói proxy này không? Vui lòng kiểm tra lại thông tin trước khi xác nhận.
          </p>
        </div>

        {/* Order Details */}
        <div className='px-6 pb-6'>
          <div className='bg-gray-50 rounded-lg p-4 space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-700'>Gói proxy:</span>
              <span className='text-sm text-gray-900'>{packageName}</span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-700'>Số lượng:</span>
              <span className='text-sm text-gray-900'>{quantity}</span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-700'>Thời gian:</span>
              <span className='text-sm text-gray-900'>{daysInNumber}</span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-700'>Ip Version:</span>
              <span className='text-sm text-gray-900'>{ip_version}</span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-700'>Giao thức:</span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  protocol === 'HTTP' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}
              >
                {protocol}
              </span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-sm font-medium text-gray-700'>Đơn giá:</span>
              <span className='text-sm text-gray-900'>{price.toLocaleString('vi-VN')}</span>
            </div>

            <div className='border-t border-gray-200 pt-3 mt-3 '>
              <div className='flex justify-between items-center'>
                <span className='text-base font-semibold text-gray-900'>Tổng cộng:</span>
                <span className='text-lg font-bold text-red-500'>{total}đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='px-6 py-4 bg-gray-50 flex space-x-3'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium'
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className='flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium'
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  )
}
