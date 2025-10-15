import { XCircle, AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function ErrorPage() {
  return (
    <div className='h-100 bg-gradient-to-br flex items-center justify-center p-4'>
      <div className='max-w-md w-full'>
        <div className='bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 border border-gray-100'>
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='absolute inset-0 bg-red-400 rounded-full blur-2xl opacity-30 animate-pulse'></div>
              <div className='relative bg-red-100 rounded-full p-6'>
                <XCircle className='w-16 h-16 text-red-600' strokeWidth={2} />
              </div>
            </div>
          </div>

          <div className='space-y-3'>
            <h1 className='text-3xl font-bold text-gray-900'>Verification Failed</h1>
            <p className='text-gray-600 text-lg leading-relaxed'>
              Chúng tôi không thể xác minh địa chỉ email của bạn. Liên kết xác minh có thể đã hết hạn hoặc không hợp lệ.
            </p>
          </div>
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
