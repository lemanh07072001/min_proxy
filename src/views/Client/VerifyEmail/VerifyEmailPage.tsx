import { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { CheckCircle, Mail, ArrowRight } from 'lucide-react'

import axios from 'axios'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const verifyUrl = searchParams.get('verify_url')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  console.log(verifyUrl)

  return (
    <div className='bg-gradient-to-br flex items-center h-100 justify-center p-4'>
      <div className='max-w-md w-full'>
        <div className='bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 border border-gray-100'>
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-30 animate-pulse'></div>
              <div className='relative bg-emerald-100 rounded-full p-6'>
                <CheckCircle className='w-16 h-16 text-emerald-600' strokeWidth={2} />
              </div>
            </div>
          </div>

          <div className='space-y-3'>
            <h1 className='text-3xl font-bold text-gray-900'>Email Verified!</h1>
            <p className='text-gray-600 text-lg leading-relaxed'>
              Địa chỉ email của bạn đã được xác minh thành công. Bạn đã sẵn sàng để bắt đầu!
            </p>
          </div>

          <div className='bg-emerald-50 rounded-xl p-4 border border-emerald-100'>
            <div className='flex items-center justify-center gap-3 text-emerald-800'>
              <p className='text-sm font-medium'>Chào mừng bạn đến với {process.env.NEXT_PUBLIC_APP_NAME}</p>
            </div>
          </div>

          {/* <div className='pt-4 space-y-3'>
            <button className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 hover:scale-105'>
              Đăng nhập
              <ArrowRight className='w-5 h-5' />
            </button>
          </div> */}
        </div>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-500'>
            Cần trợ giúp?{' '}
            <a
              href='#'
              className='text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors'
            >
              Liên hệ bộ phận hỗ trợ
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
