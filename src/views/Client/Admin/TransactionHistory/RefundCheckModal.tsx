'use client'

import { useState } from 'react'

import {
  X,
  ShieldCheck,
  ShieldX,
  Shield,
  Loader2,
  Clock3,
  Clock,
  User,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  BadgeCheck,
  CircleX,
  CircleQuestionMark
} from 'lucide-react'

import Dialog from '@mui/material/Dialog'
import { Chip } from '@mui/material'
import { toast } from 'react-toastify'

import { formatDateTimeLocal } from '@/utils/formatDate'
import { useApiKeys, useConfirmRefund } from '@/hooks/apis/useOrders'
import { ORDER_STATUS_LABELS, ORDER_STATUS, ORDER_STATUS_COLORS } from '@/constants'

interface RefundCheckModalProps {
  isOpen: boolean
  onClose: () => void
  orderData: any
}

type CheckStatus = 'idle' | 'loading' | 'live' | 'die' | 'error'

interface CheckResult {
  status: CheckStatus
  responseTime?: number
  errorMessage?: string
}

export default function RefundCheckModal({ isOpen, onClose, orderData }: RefundCheckModalProps) {
  const [checkResults, setCheckResults] = useState<Record<string, CheckResult>>({})
  const [dieItem, setDieItem] = useState<any>(null) // item proxy die đang xem

  const { data: dataApiKeys, isLoading: loadingApiKeys } = useApiKeys(orderData?.order?.id, isOpen)
  const confirmRefundMutation = useConfirmRefund()

  const getProxyFromItem = (item: any): string => {
    const proxys = item?.proxys

    if (proxys && typeof proxys === 'object') {
      return proxys.HTTP || proxys.SOCKS5 || proxys.SOCK5 || ''
    }

    if (typeof proxys === 'string') return proxys

    return ''
  }

  const handleCheckProxy = async (rowId: string, item: any) => {
    const proxyStr = getProxyFromItem(item)

    if (!proxyStr) {
      setCheckResults(prev => ({ ...prev, [rowId]: { status: 'error', errorMessage: 'Không tìm thấy proxy' } }))

      return
    }

    const parts = proxyStr.split(':')

    if (parts.length < 2) {
      setCheckResults(prev => ({ ...prev, [rowId]: { status: 'error', errorMessage: 'Định dạng proxy không hợp lệ' } }))

      return
    }

    setCheckResults(prev => ({ ...prev, [rowId]: { status: 'loading' } }))

    try {
      const res = await fetch('/api/check-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocol: 'http',
          format_proxy: 'host:port:username:password',
          list_proxy: proxyStr
        })
      })

      const data = await res.json()

      if (res.ok && data.status === 'success') {
        setCheckResults(prev => ({ ...prev, [rowId]: { status: 'live', responseTime: data.responseTime } }))
      } else {
        setCheckResults(prev => ({ ...prev, [rowId]: { status: 'die', errorMessage: data.message } }))
        setDieItem(item)
      }
    } catch {
      setCheckResults(prev => ({ ...prev, [rowId]: { status: 'die', errorMessage: 'Không thể kết nối tới proxy' } }))
      setDieItem(item)
    }
  }

  const handleConfirmRefund = () => {
    if (!dieItem?.id) return

    confirmRefundMutation.mutate(dieItem.id, {
      onSuccess: () => {
        toast.success(`Hoàn tiền proxy #${dieItem.id} đơn hàng #${orderData?.order?.order_code} thành công!`)
        setDieItem(null)
        onClose()
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi hoàn tiền')
      }
    })
  }

  const handleClose = () => {
    setCheckResults({})
    setDieItem(null)
    onClose()
  }

  const calcRefundInfo = (item: any) => {
    const createdAt = new Date(orderData?.created_at)
    const expiredAt = new Date(item?.expired_at)
    const now = new Date()
    const totalDays = orderData?.order?.time ?? 0
    const daysUsed = Math.max(0, Math.floor((now.getTime() - createdAt.getTime()) / 86400000))
    const daysRemaining = Math.max(0, Math.floor((expiredAt.getTime() - now.getTime()) / 86400000))

    return { totalDays, daysUsed, daysRemaining }
  }

  const getStatusBadge = (status: string) => {
    const label = ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS]
    const color = ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS]

    if (!label) return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark size={14} />} color='secondary' />

    let icon = <CircleQuestionMark size={14} />

    switch (status) {
      case ORDER_STATUS.IN_USE: icon = <BadgeCheck size={14} />; break
      case ORDER_STATUS.COMPLETED: icon = <BadgeCheck size={14} />; break
      case ORDER_STATUS.EXPIRED: icon = <CircleX size={14} />; break
      case ORDER_STATUS.FAILED: icon = <CircleX size={14} />; break
      default: break
    }

    return <Chip label={label} size='small' icon={icon} color={color as any} />
  }

  if (!isOpen) return null

  const refundInfo = dieItem ? calcRefundInfo(dieItem) : null

  return (
    <>
      {/* Modal chính: danh sách proxy */}
      <Dialog
        onClose={handleClose}
        open={isOpen}
        closeAfterTransition={false}
        maxWidth='lg'
        fullWidth
        PaperProps={{ sx: { overflow: 'visible', maxHeight: '90vh' } }}
      >
        <div className='bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden'>
          {/* Header */}
          <div className='bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-bold text-white'>Kiểm tra proxy & Hoàn tiền</h2>
              <p className='text-orange-100 text-sm mt-0.5'>Mã đơn hàng: #{orderData?.order?.order_code || '—'}</p>
            </div>
            <button
              onClick={handleClose}
              className='text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-all'
            >
              <X size={22} />
            </button>
          </div>

          <div className='overflow-y-auto max-h-[calc(90vh-80px)]'>
            <div className='p-5 space-y-5'>
              {/* 2 box thông tin */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Box 1: Thông tin khách hàng */}
                <div className='bg-slate-50 rounded-xl p-4 border border-slate-200'>
                  <div className='flex items-center align-middle gap-2 mb-3'>
                    <User className='text-slate-600' size={20} />
                    <h3 className='font-semibold text-slate-800 text-xl mb-0'>Thông tin khách hàng</h3>
                  </div>
                  <div className='space-y-3'>
                    <div>
                      <p className='text-xs text-slate-500 mb-1'>Người dùng</p>
                      <p className='font-semibold text-slate-800 mb-2'>{orderData?.user?.name || '—'}</p>
                      <p className='text-sm text-slate-600'>{orderData?.user?.email || '—'}</p>
                    </div>
                    <div>
                      <p className='text-xs text-slate-500 mb-1'>Loại giao dịch</p>
                      {orderData?.type === 'BUY' ? (
                        <Chip label='Mua' icon={<CheckCircle size={14} />} color='success' size='small' />
                      ) : (
                        <Chip label='Hoàn tiền' icon={<Clock size={14} />} color='warning' size='small' />
                      )}
                    </div>
                    <div>
                      <p className='text-xs text-slate-500 mb-1'>Ngày tạo</p>
                      <p className='font-medium text-slate-800'>
                        {orderData?.created_at ? formatDateTimeLocal(orderData.created_at) : '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Box 2: Thông tin đơn hàng */}
                <div className='bg-slate-50 rounded-xl p-4 border border-slate-200'>
                  <div className='flex items-center align-middle gap-2 mb-3'>
                    <DollarSign className='text-slate-600' size={20} />
                    <h3 className='font-semibold text-slate-800 text-xl mb-0'>Thông tin đơn hàng</h3>
                  </div>
                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <div>
                        <p className='text-xs text-slate-500 mb-1'>Số tiền</p>
                        <p className='text-2xl font-bold text-slate-800'>
                          {new Intl.NumberFormat('vi-VN').format(orderData?.order?.price_per_unit || 0)} đ
                        </p>
                      </div>
                      <div>
                        <p className='text-xs text-slate-500 mb-1'>Số lượng</p>
                        <p className='text-2xl font-bold text-slate-800'>{orderData?.order?.quantity}</p>
                      </div>
                      <div>
                        <p className='text-xs text-slate-500 mb-1'>Thời gian</p>
                        <p className='text-2xl font-bold text-slate-800'>{orderData?.order?.time}</p>
                      </div>
                      <div>
                        <p className='text-xs text-slate-500 mb-1'>Tổng tiền</p>
                        <p className='text-2xl font-bold text-slate-800'>
                          {new Intl.NumberFormat('vi-VN').format(orderData?.order?.total_amount || 0)} đ
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className='text-xs text-slate-500 mb-1'>Trạng thái</p>
                      {getStatusBadge(orderData?.order?.status)}
                    </div>
                    <div>
                      <p className='text-xs text-slate-500 mb-1'>Nội dung</p>
                      <p className='text-sm text-slate-600 leading-relaxed'>{orderData?.noidung || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bảng proxy */}
              <div className='bg-slate-50 rounded-xl border border-slate-200 overflow-hidden'>
                <div className='px-4 py-2.5 bg-slate-100 border-b border-slate-200'>
                  <p className='text-sm font-semibold text-slate-700'>
                    Danh sách proxy — click "Check" để kiểm tra từng proxy
                  </p>
                </div>

                <div className='overflow-x-auto'>
                  <table className='min-w-full'>
                    <thead className='bg-slate-100 border-b border-slate-200'>
                      <tr>
                        <th className='px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide'>Proxy</th>
                        <th className='px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide'>Loại</th>
                        <th className='px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide'>Ngày hết hạn</th>
                        <th className='px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide'>Kết quả</th>
                        <th className='px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide'>Hành động</th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-slate-100'>
                      {loadingApiKeys ? (
                        <tr>
                          <td colSpan={5} className='py-10 text-center'>
                            <Loader2 className='w-7 h-7 text-slate-400 animate-spin mx-auto mb-2' />
                            <p className='text-sm text-slate-500'>Đang tải danh sách proxy...</p>
                          </td>
                        </tr>
                      ) : !dataApiKeys || dataApiKeys.length === 0 ? (
                        <tr>
                          <td colSpan={5} className='py-10 text-center text-sm text-slate-500'>
                            Không có proxy nào trong đơn hàng này
                          </td>
                        </tr>
                      ) : (
                        dataApiKeys.map((item: any, index: number) => {
                          const rowId = item?.id?.toString() ?? index.toString()
                          const proxy = getProxyFromItem(item)
                          const result = checkResults[rowId]

                          return (
                            <tr key={rowId} className='hover:bg-slate-50 transition-colors'>
                              {/* Proxy */}
                              <td className='px-4 py-3 text-sm text-slate-700 font-mono max-w-[200px] truncate'>
                                {proxy || '—'}
                              </td>

                              {/* Loại */}
                              <td className='px-4 py-3 text-sm text-slate-600'>
                                {item?.plan_type ?? '—'}
                              </td>

                              {/* Ngày hết hạn */}
                              <td className='px-4 py-3 text-sm text-slate-600'>
                                <div className='flex items-center gap-1'>
                                  <Clock3 size={13} className='text-slate-400' />
                                  <span>{formatDateTimeLocal(item?.expired_at)}</span>
                                </div>
                              </td>

                              {/* Kết quả check */}
                              <td className='px-4 py-3'>
                                {!result || result.status === 'idle' ? (
                                  <span className='flex items-center gap-1 text-xs text-slate-400'>
                                    <Shield size={14} />
                                    Chưa kiểm tra
                                  </span>
                                ) : result.status === 'loading' ? (
                                  <span className='flex items-center gap-1 text-xs text-blue-500'>
                                    <Loader2 size={14} className='animate-spin' />
                                    Đang kiểm tra...
                                  </span>
                                ) : result.status === 'live' ? (
                                  <span className='flex items-center gap-1 text-xs font-medium text-emerald-600'>
                                    <ShieldCheck size={14} />
                                    Còn sống {result.responseTime ? `(${result.responseTime}ms)` : ''}
                                  </span>
                                ) : result.status === 'die' ? (
                                  <div className='flex flex-col gap-0.5'>
                                    <span className='flex items-center gap-1 text-xs font-medium text-red-500'>
                                      <ShieldX size={14} />
                                      Đã die
                                    </span>
                                    {result.errorMessage && (
                                      <span className='text-xs text-red-400 pl-5'>{result.errorMessage}</span>
                                    )}
                                  </div>
                                ) : (
                                  <div className='flex flex-col gap-0.5'>
                                    <span className='flex items-center gap-1 text-xs text-orange-500'>
                                      <AlertTriangle size={14} />
                                      Lỗi
                                    </span>
                                    {result.errorMessage && (
                                      <span className='text-xs text-orange-400 pl-5'>{result.errorMessage}</span>
                                    )}
                                  </div>
                                )}
                              </td>

                              {/* Button Check / Xem hoàn tiền */}
                              <td className='px-4 py-3'>
                                <div className='flex items-center gap-2'>
                                  <button
                                    onClick={() => handleCheckProxy(rowId, item)}
                                    disabled={result?.status === 'loading' || !proxy}
                                    className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all
                                      bg-orange-500 hover:bg-orange-600 text-white
                                      disabled:opacity-50 disabled:cursor-not-allowed'
                                  >
                                    {result?.status === 'loading' ? (
                                      <Loader2 size={13} className='animate-spin' />
                                    ) : (
                                      <Shield size={13} />
                                    )}
                                    {result?.status === 'loading' ? 'Đang check...' : 'Check'}
                                  </button>

                                  {result?.status === 'die' && (
                                    <button
                                      onClick={() => setDieItem(item)}
                                      className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
                                        border border-red-300 text-red-600 hover:bg-red-50 transition-all'
                                    >
                                      <ShieldX size={13} />
                                      Hoàn tiền
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Modal thông tin hoàn tiền — hiện khi proxy die */}
      <Dialog
        open={!!dieItem}
        onClose={() => setDieItem(null)}
        closeAfterTransition={false}
        maxWidth='md'
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        {dieItem && refundInfo && (
          <div className='bg-white rounded-2xl overflow-hidden'>
            {/* Header */}
            <div className='bg-gradient-to-r from-red-500 to-red-600 px-5 py-4 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <ShieldX size={22} className='text-white' />
                <div>
                  <h2 className='text-lg font-bold text-white mb-0'>Proxy đã die</h2>
                  <p className='text-red-100 text-xs mt-0.5'>Thông tin hoàn tiền đơn hàng #{orderData?.order?.order_code}</p>
                </div>
              </div>
              <button
                onClick={() => setDieItem(null)}
                className='text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-all'
              >
                <X size={20} />
              </button>
            </div>

            <div className='p-5 space-y-4'>
              {/* Thông tin chi tiết */}
              <div className='grid grid-cols-2 gap-3'>
                <div className='bg-slate-50 rounded-lg p-3 border border-slate-200'>
                  <p className='text-xs text-slate-500 mb-1'>Tên gói</p>
                  <p className='font-semibold text-slate-800 text-sm'>{orderData?.noidung || '—'}</p>
                </div>
                <div className='bg-slate-50 rounded-lg p-3 border border-slate-200'>
                  <p className='text-xs text-slate-500 mb-1'>User mua</p>
                  <p className='font-semibold text-slate-800 text-sm'>{orderData?.user?.name || '—'}</p>
                  <p className='text-xs text-slate-400'>{orderData?.user?.email || ''}</p>
                </div>
                <div className='bg-slate-50 rounded-lg p-3 border border-slate-200'>
                  <p className='text-xs text-slate-500 mb-1'>Thời gian mua</p>
                  <p className='font-semibold text-slate-800 text-sm'>
                    {orderData?.created_at ? formatDateTimeLocal(orderData.created_at) : '—'}
                  </p>
                </div>
                <div className='bg-slate-50 rounded-lg p-3 border border-slate-200'>
                  <p className='text-xs text-slate-500 mb-1'>Thời gian hết hạn</p>
                  <p className='font-semibold text-slate-800 text-sm'>
                    {dieItem?.expired_at ? formatDateTimeLocal(dieItem.expired_at) : '—'}
                  </p>
                </div>
              </div>

              {/* Thống kê ngày */}
              <div className='grid grid-cols-4 gap-3'>
                <div className='bg-blue-50 rounded-lg p-3 border border-blue-100 text-center'>
                  <p className='text-xs text-blue-500 mb-1'>Số ngày mua</p>
                  <p className='font-bold text-blue-700 text-2xl'>{refundInfo.totalDays}</p>
                  <p className='text-xs text-blue-400'>ngày</p>
                </div>
                <div className='bg-orange-50 rounded-lg p-3 border border-orange-100 text-center'>
                  <p className='text-xs text-orange-500 mb-1'>Đã sử dụng</p>
                  <p className='font-bold text-orange-700 text-2xl'>{refundInfo.daysUsed}</p>
                  <p className='text-xs text-orange-400'>ngày</p>
                </div>
                <div className='bg-emerald-50 rounded-lg p-3 border border-emerald-100 text-center'>
                  <p className='text-xs text-emerald-500 mb-1'>Chưa sử dụng</p>
                  <p className='font-bold text-emerald-700 text-2xl'>{refundInfo.daysRemaining}</p>
                  <p className='text-xs text-emerald-400'>ngày</p>
                </div>
                <div className='bg-red-50 rounded-lg p-3 border border-red-100 text-center'>
                  <p className='text-xs text-red-500 mb-1'>Tổng tiền</p>
                  <p className='font-bold text-red-700 text-lg leading-tight'>
                    {new Intl.NumberFormat('vi-VN').format(orderData?.order?.total_amount || 0)}
                  </p>
                  <p className='text-xs text-red-400'>đồng</p>
                </div>
              </div>

              {/* Cảnh báo */}
              <div className='flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3'>
                <AlertTriangle size={16} className='text-amber-500 mt-0.5 shrink-0' />
                <p className='text-xs text-amber-700'>
                  Xác nhận sẽ <strong>hủy toàn bộ đơn hàng #{orderData?.order?.order_code}</strong> và hoàn tiền về ví của user.
                </p>
              </div>

              {/* Actions */}
              <div className='flex justify-end gap-2 pt-1'>
                <button
                  onClick={() => setDieItem(null)}
                  className='px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors'
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmRefund}
                  disabled={confirmRefundMutation.isPending}
                  className='flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {confirmRefundMutation.isPending ? (
                    <Loader2 size={14} className='animate-spin' />
                  ) : (
                    <CheckCircle size={14} />
                  )}
                  {confirmRefundMutation.isPending ? 'Đang xử lý...' : 'Xác nhận hoàn tiền'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </>
  )
}
