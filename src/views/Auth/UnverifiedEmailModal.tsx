'use client'

import { useState } from 'react'

import { Mail, X, AlertCircle, Send } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

import axiosInstance from '@/libs/axios'

interface UnverifiedEmailModalProps {
  isOpen: boolean
  onClose: () => void
  email?: string
}

export default function UnverifiedEmailModal({
  isOpen,
  onClose,
  email = 'user@example.com'
}: UnverifiedEmailModalProps) {
  const [isResending, setIsResending] = useState(false)

  const handleResendEmail = async () => {
    try {
      setIsResending(true)
      const res = await axiosInstance.post('/email/resend', { email })

      setIsResending(false)

      if (res.data.type === 'resend_success') {
        toast.success(res.data.message)
      }
    } catch (error) {
      setIsResending(false)

      if (axios.isAxiosError(error)) {
        const status = error.response?.status

        if (status === 429) {
          toast.warning('Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.')

          return
        }

        const msg = error.response?.data?.message || 'Có lỗi xảy ra khi gửi email.'

        toast.error(msg)
      } else {
        toast.error('Lỗi không xác định.')
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose}></div>

      <div className='relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6 animate-in fade-in zoom-in duration-300'>
        <button onClick={onClose} className='absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors'>
          <X className='w-5 h-5 text-gray-500' />
        </button>

        <div className='flex justify-center'>
          <div className='relative'>
            <div className='absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-30'></div>
            <div className='relative bg-amber-100 rounded-full p-5'>
              <Mail className='w-12 h-12 text-amber-600' strokeWidth={2} />
            </div>
          </div>
        </div>

        <div className='space-y-3 text-center'>
          <h2 className='text-2xl font-bold text-gray-900'>Xác minh email của bạn</h2>
          <p className='text-gray-600 leading-relaxed'>Chúng tôi đã gửi email xác minh tới</p>
          <p className='text-gray-900 font-semibold text-lg'>{email}</p>
        </div>

        <div className='space-y-3 pt-2'>
          <button
            onClick={handleResendEmail}
            style={{
              background: 'var(--primary-gradient)'
            }}
            disabled={isResending}
            className='w-full  disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed'
          >
            {isResending ? (
              <>
                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                Đang gửi...
              </>
            ) : (
              <>
                <Send className='w-5 h-5' />
                Gửi lại email xác minh
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200'
          >
            Tôi sẽ xác minh sau
          </button>
        </div>

        <div className='text-center'>
          <p className='text-xs text-gray-500'>
            Bạn không nhận được email? Hãy kiểm tra thư mục thư rác hoặc{' '}
            <a href='#' className='text-blue-600 hover:text-blue-700 font-medium hover:underline'>
              liên hệ hỗ trợ
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
