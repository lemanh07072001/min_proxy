import {
  X, Loader2, FileText, Clock, AlertCircle, CheckCircle2, XCircle,
  Play, Globe, ArrowRight, RotateCcw, RefreshCw, DollarSign, Zap
} from 'lucide-react'
import Dialog from '@mui/material/Dialog'
import { formatDateTimeLocal } from '@/utils/formatDate'
import { ORDER_STATUS_LABELS_ADMIN } from '@/constants'
import { useOrderLogs } from '@/hooks/apis/useTickets'

const ACTION_LABELS: Record<string, string> = {
  created: 'Tạo đơn hàng',
  processing: 'Bắt đầu xử lý',
  in_use: 'Hoàn thành',
  in_use_partial: 'Mua thiếu proxy',
  failed: 'Thất bại',
  expired: 'Hết hạn',
  retry: 'Retry xử lý',
  api_call_start: 'Gọi API partner',
  api_call_success: 'API thành công',
  api_call_error: 'API thất bại',
  admin_retry_partial: 'Admin mua bù',
  admin_refund_partial: 'Admin hoàn tiền',
  auto_recovered: 'Tự phục hồi (stuck)',
}

const ACTION_STYLES: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  created:              { icon: <Play size={14} />,          bg: 'bg-blue-100',   text: 'text-blue-600' },
  processing:           { icon: <RefreshCw size={14} />,     bg: 'bg-yellow-100', text: 'text-yellow-600' },
  in_use:               { icon: <CheckCircle2 size={14} />,  bg: 'bg-green-100',  text: 'text-green-600' },
  in_use_partial:       { icon: <AlertCircle size={14} />,   bg: 'bg-orange-100', text: 'text-orange-600' },
  failed:               { icon: <XCircle size={14} />,       bg: 'bg-red-100',    text: 'text-red-600' },
  expired:              { icon: <Clock size={14} />,         bg: 'bg-gray-100',   text: 'text-gray-600' },
  retry:                { icon: <RotateCcw size={14} />,     bg: 'bg-yellow-100', text: 'text-yellow-600' },
  api_call_start:       { icon: <Globe size={14} />,         bg: 'bg-indigo-100', text: 'text-indigo-600' },
  api_call_success:     { icon: <CheckCircle2 size={14} />,  bg: 'bg-green-100',  text: 'text-green-600' },
  api_call_error:       { icon: <XCircle size={14} />,       bg: 'bg-red-100',    text: 'text-red-600' },
  admin_retry_partial:  { icon: <Zap size={14} />,           bg: 'bg-purple-100', text: 'text-purple-600' },
  admin_refund_partial: { icon: <DollarSign size={14} />,    bg: 'bg-purple-100', text: 'text-purple-600' },
  auto_recovered:       { icon: <RefreshCw size={14} />,     bg: 'bg-amber-100',  text: 'text-amber-600' },
}

const DEFAULT_STYLE = { icon: <Clock size={14} />, bg: 'bg-gray-100', text: 'text-gray-600' }

export default function LogModal({
  isOpen,
  onClose,
  orderId,
}: {
  isOpen: boolean
  onClose: () => void
  orderId: number | null
}) {
  const { data: logs, isLoading } = useOrderLogs(isOpen ? orderId : null)

  if (!isOpen) return null

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
        <div className='relative bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-4 flex items-center justify-between'>
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
          <div className='p-4 sm:p-6 flex flex-col items-center justify-center min-h-[300px]'>
            <Loader2 className='w-10 h-10 text-orange-500 animate-spin mb-4' />
            <p className='text-gray-600 font-medium text-sm'>Đang tải log...</p>
          </div>
        ) : (
          <div className='p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]'>
            {logs && logs.length > 0 ? (
              <div className='space-y-2'>
                {logs.map((log: any, index: number) => {
                  const style = ACTION_STYLES[log.action] ?? DEFAULT_STYLE
                  const label = ACTION_LABELS[log.action] ?? log.action

                  return (
                    <div key={log._id ?? index} className='flex gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors'>
                      <div className='flex-shrink-0 pt-0.5'>
                        <div className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center ${style.text}`}>
                          {style.icon}
                        </div>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                            {label}
                          </span>
                          {log.from_status != null && log.to_status != null && (
                            <span className='text-xs text-gray-400 flex items-center gap-1'>
                              {ORDER_STATUS_LABELS_ADMIN[String(log.from_status)] ?? `status ${log.from_status}`}
                              <ArrowRight size={10} />
                              {ORDER_STATUS_LABELS_ADMIN[String(log.to_status)] ?? `status ${log.to_status}`}
                            </span>
                          )}
                          {log.duration_ms != null && (
                            <span className='text-xs text-gray-400'>{log.duration_ms}ms</span>
                          )}
                          {log.http_status != null && (
                            <span className={`text-xs ${log.http_status >= 200 && log.http_status < 300 ? 'text-green-500' : 'text-red-500'}`}>
                              HTTP {log.http_status}
                            </span>
                          )}
                        </div>

                        {log.message && (
                          <p className='text-sm text-gray-700 mt-1'>{log.message}</p>
                        )}

                        <p className='text-xs text-gray-400 mt-1'>
                          {log.created_at ? formatDateTimeLocal(log.created_at) : '—'}
                          {log.partner_code && <span className='ml-2'>Partner: {log.partner_code}</span>}
                          {log.retry_count != null && <span className='ml-2'>Retry: {log.retry_count}</span>}
                        </p>

                        {log.context && Object.keys(log.context).length > 0 && (
                          <div className='mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 font-mono'>
                            {JSON.stringify(log.context, null, 2)}
                          </div>
                        )}

                        {log.response_body && (
                          <details className='mt-2'>
                            <summary className='text-xs text-gray-400 cursor-pointer hover:text-gray-600'>Response body</summary>
                            <div className='mt-1 p-2 bg-gray-900 rounded text-xs text-green-400 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto'>
                              {log.response_body}
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
                <AlertCircle size={48} className='mb-3' />
                <p className='text-sm'>Không có log nào được ghi nhận</p>
                <p className='text-xs mt-1'>Order có thể chưa được xử lý hoặc log chưa được ghi</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Dialog>
  )
}
