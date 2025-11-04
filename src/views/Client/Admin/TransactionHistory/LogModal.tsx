import { X, Loader2, FileText, Clock, AlertCircle, CircleQuestionMark, BadgeMinus } from 'lucide-react'
import Dialog from '@mui/material/Dialog'
import { formatDateTimeLocal } from '@/utils/formatDate'
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS
} from '@/constants'
import { Chip } from '@mui/material'
export default function LogModal({
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

  const getStatusBadge = (status: string) => {
    const label = ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS]
    const color = ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS]

    if (!label) {
      return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }

    return <Chip label={label} size='small' icon={<BadgeMinus />} color={color as any} />
  }
  console.log(data)

  // Demo log data nếu không có log thật
  const demoLogs = [
    {
      message: 'Đơn hàng được tạo thành công',
      timestamp: new Date().toISOString(),
      details: 'Order ID: ' + (data?.order?.order_code || 'N/A')
    },
    {
      message: 'Bắt đầu xử lý đơn hàng',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      details: { status: 'processing', user_id: data?.user?.id }
    },
    {
      message: 'Gọi API partner để lấy thông tin proxy',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      details: 'Endpoint: /api/proxy/get'
    },
    {
      message: 'Đang chờ phản hồi từ partner',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      details: 'Timeout: 30s'
    },
    {
      message: 'Nhận được phản hồi từ partner',
      timestamp: new Date(Date.now() - 200000).toISOString(),
      details: { response_code: 200, message: 'Success' }
    }
  ]

  const displayLogs = data?.order?.logs && data.order.logs.length > 0 ? data.order.logs : demoLogs

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='log-dialog-title'
      open={isOpen}
      closeAfterTransition={false}
      maxWidth='md'
      fullWidth={true}
      PaperProps={{ sx: { overflow: 'visible' } }}
    >
      <div className='relative bg-white rounded-lg shadow-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp mx-auto'>
        <div className='relative bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-4 py-4 sm:py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2 sm:gap-3'>
            <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/20 flex items-center justify-center'>
              <FileText className='text-white' size={20} />
            </div>
            <div>
              <h2 className='text-lg sm:text-xl font-bold text-white'>Log đơn hàng</h2>
              <p className='text-orange-100 text-xs sm:text-sm hidden sm:block'>Chi tiết quá trình xử lý đơn hàng</p>
            </div>
          </div>
          <button onClick={onClose} className='p-2 rounded-lg hover:bg-white/20 text-white transition-colors'>
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className='p-4 sm:p-6 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]'>
            <Loader2 className='w-10 h-10 sm:w-12 sm:h-12 text-orange-500 animate-spin mb-4' />
            <p className='text-gray-600 font-medium text-sm sm:text-base text-center'>Đang tải log...</p>
            <p className='text-xs sm:text-sm text-gray-400 mt-2 text-center'>Vui lòng đợi trong giây lát</p>
          </div>
        ) : (
          <div className='p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]'>
            {/* Order Info */}
            <div className='mb-4 sm:mb-6 p-4 bg-gray-50 rounded-lg'>
              <h3 className='text-lg font-bold text-gray-900 mb-3'>Thông tin đơn hàng</h3>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <p className='text-sm text-gray-600'>Order ID</p>
                  <p className='font-semibold text-gray-900'>#{data?.order?.order_code ?? '—'}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Trạng thái</p>
                  <p className='font-semibold text-gray-900'>{getStatusBadge(data?.order?.status)}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Người dùng</p>
                  <p className='font-semibold text-gray-900'>{data?.user?.name ?? '—'}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Thời gian tạo</p>
                  <p className='font-semibold text-gray-900'>
                    {data?.created_at ? formatDateTimeLocal(data.created_at) : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Log Timeline */}
            <div className='mb-4'>
              <h3 className='text-lg font-bold text-gray-900 mb-3'>Log xử lý</h3>
              <div className='space-y-3'>
                {displayLogs && displayLogs.length > 0 ? (
                  displayLogs.map((log: any, index: number) => (
                    <div key={index} className='flex gap-3 p-3 bg-white border border-gray-200 rounded-lg'>
                      <div className='flex-shrink-0'>
                        <div className='w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center'>
                          <Clock size={16} className='text-orange-600' />
                        </div>
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm font-medium text-gray-900'>{log.message ?? 'No message'}</p>
                        <p className='text-xs text-gray-500 mt-1'>
                          {log.timestamp ? formatDateTimeLocal(log.timestamp) : '—'}
                        </p>
                        {log.details && (
                          <div className='mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 font-mono'>
                            {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='flex flex-col items-center justify-center py-8 text-gray-400'>
                    <AlertCircle size={48} className='mb-3' />
                    <p className='text-sm'>Không có log nào được ghi nhận</p>
                  </div>
                )}
              </div>
            </div>

            {/* Raw Log Data (Optional) */}
            {data?.raw_log && (
              <div className='mb-4'>
                <h3 className='text-lg font-bold text-gray-900 mb-3'>Raw Log</h3>
                <div className='p-3 bg-gray-900 rounded-lg overflow-x-auto'>
                  <pre className='text-xs text-green-400 font-mono whitespace-pre-wrap'>
                    {typeof data.raw_log === 'string' ? data.raw_log : JSON.stringify(data.raw_log, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Dialog>
  )
}
