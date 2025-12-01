import { ChevronRight, CreditCard, Mail, Phone, Shield, X, Loader2, User, Calendar } from 'lucide-react'
import Dialog from '@mui/material/Dialog'
import { formatDateTimeLocal } from '@/utils/formatDate'

export default function DetailUserModal({
  isOpen,
  onClose,
  data,
  isLoading
}: {
  isOpen: boolean
  onClose: () => void
  data: any
  isLoading: boolean
}) {
  if (!isOpen) return null

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='customized-dialog-title'
      open={isOpen}
      closeAfterTransition={false}
      maxWidth='md'
      fullWidth={true}
      PaperProps={{ sx: { overflow: 'visible' } }}
    >
      <div className='relative bg-white rounded-lg shadow-2xl  w-full max-h-[90vh] overflow-hidden animate-slideUp mx-auto'>
        <div className='relative bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-4 py-4 sm:py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2 sm:gap-3'>
            <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/20 flex items-center justify-center'>
              <User className='text-white' size={20} />
            </div>
            <div>
              <h2 className='text-lg sm:text-xl font-bold text-white'>Thông tin người dùng</h2>
              <p className='text-orange-100 text-xs sm:text-sm hidden sm:block'>Chi tiết tài khoản và hoạt động</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className='p-4 sm:p-6 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]'>
            <Loader2 className='w-10 h-10 sm:w-12 sm:h-12 text-orange-500 animate-spin mb-4' />
            <p className='text-gray-600 font-medium text-sm sm:text-base text-center'>
              Đang tải thông tin người dùng...
            </p>
            <p className='text-xs sm:text-sm text-gray-400 mt-2 text-center'>Vui lòng đợi trong giây lát</p>
          </div>
        ) : (
          <div className='p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]'>
            <div className='grid md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6'>
              <div className='md:col-span-2 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 p-4 bg-gray-50 rounded-lg'>
                <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg'>
                  {(data?.user?.name ?? '').substring(0, 2).toUpperCase()}
                </div>
                <div className='flex-1 text-center sm:text-left'>
                  <div className='flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 mb-1'>
                    <h3 className='text-xl sm:text-2xl font-bold text-gray-900'>{data?.user?.name ?? '—'}</h3>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700`}>
                      Đang hoạt động
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 flex items-center justify-center sm:justify-start gap-2'>
                    {data?.user?.email ?? '—'}
                  </p>
                </div>
              </div>

              <div className='bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 sm:p-4 border border-orange-200'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-xs sm:text-sm text-orange-700 font-medium'>Tổng đơn hàng</span>
                  <CreditCard size={18} className='text-orange-500' />
                </div>
                <div className='text-2xl sm:text-3xl font-bold text-orange-900'>{data.order_count ?? 0}</div>
                <div className='text-xs text-orange-600 mt-1'>Đơn hàng đã mua</div>
              </div>

              <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 border border-green-200'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-xs sm:text-sm text-green-700 font-medium'>Tổng chi tiêu</span>
                  <CreditCard size={18} className='text-green-500' />
                </div>
                <div className='text-2xl sm:text-3xl font-bold text-green-900'>
                  {new Intl.NumberFormat('vi-VN').format(data?.user?.chitieu) + ' đ'}
                </div>
                <div className='text-xs text-green-600 mt-1'>Giá trị mua hàng</div>
              </div>

              <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 border border-green-200'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-xs sm:text-sm text-green-700 font-medium'>Tổng nạp</span>
                  <CreditCard size={18} className='text-green-500' />
                </div>
                <div className='text-2xl sm:text-3xl font-bold text-green-900'>
                  {new Intl.NumberFormat('vi-VN').format(data?.user?.sotiennap) + ' đ'}
                </div>
                <div className='text-xs text-green-600 mt-1'>Tổng tiền đã nạp</div>
              </div>

              <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 border border-green-200'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-xs sm:text-sm text-green-700 font-medium'>Số dư</span>
                  <CreditCard size={18} className='text-green-500' />
                </div>
                <div className='text-2xl sm:text-3xl font-bold text-green-900'>
                  {new Intl.NumberFormat('vi-VN').format(data?.user?.sodu) + ' đ'}
                </div>
                <div className='text-xs text-green-600 mt-1'>Tổng tiền chưa tiêu</div>
              </div>
            </div>

            {/*<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">*/}
            {/*  <button className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base font-medium rounded-lg transition-colors shadow-sm hover:shadow">*/}
            {/*    Chỉnh sửa thông tin*/}
            {/*  </button>*/}
            {/*  <button className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm sm:text-base font-medium rounded-lg transition-colors">*/}
            {/*    Xem lịch sử giao dịch*/}
            {/*  </button>*/}
            {/*</div>*/}
          </div>
        )}
      </div>
    </Dialog>
  )
}
