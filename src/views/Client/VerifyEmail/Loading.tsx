import { Mail, Loader2 } from 'lucide-react'

export default function LoadingPage() {
  return (
    <div className='bg-gradient-to-br h-100 flex items-center justify-center p-4'>
      <div className='max-w-md w-full'>
        <div className='bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 border border-gray-100'>
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-30 animate-pulse'></div>
              <div className='relative bg-blue-100 rounded-full p-6'>
                <Mail className='w-16 h-16 text-blue-600' strokeWidth={2} />
              </div>
            </div>
          </div>

          <div className='space-y-3'>
            <h1 className='text-3xl font-bold text-gray-900'>Verifying Your Email</h1>
            <p className='text-gray-600 text-lg leading-relaxed'>
              Vui lòng chờ chúng tôi xác minh địa chỉ email của bạn. Việc này chỉ mất một chút thời gian.
            </p>
          </div>

          <div className='flex justify-center py-4'>
            <Loader2 className='w-12 h-12 text-blue-600 animate-spin' strokeWidth={2.5} />
          </div>

          <div className='pt-2'>
            <p className='text-xs text-gray-500'>Quá trình này diễn ra tự động. Vui lòng không đóng cửa sổ này.</p>
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
