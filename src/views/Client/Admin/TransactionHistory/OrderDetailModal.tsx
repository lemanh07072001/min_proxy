import {
  X,
  CheckCircle,
  Clock,
  Calendar,
  DollarSign,
  User,
  Loader2,
  CircleX,
  XCircle,
  RotateCcw,
  CircleQuestionMark,
  BadgeCheck,
  Copy,
  Globe,
  Clock3,
  Download
} from 'lucide-react'

import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from '@tanstack/react-table'
import { useMemo, useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import { formatDateTimeLocal } from '@/utils/formatDate'
import { ORDER_STATUS_LABELS, ORDER_STATUS, ORDER_STATUS_COLORS } from '@/constants'
import { Chip, Checkbox } from '@mui/material'
import { useApiKeys } from '@/hooks/apis/useOrders'

interface OrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  orderData: any
  isLoading?: boolean
}

export default function OrderDetailModal({ isOpen, onClose, orderData, isLoading = false }: OrderDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [rowSelection, setRowSelection] = useState({})

  // API call - MUST be called FIRST before any other hooks
  const { data: dataApiKeys, isLoading: loadingApiKeys } = useApiKeys(orderData?.order?.id, isOpen)

  // Helper functions
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const downloadApiKeys = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const apiKeysToDownload =
      selectedRows.length > 0
        ? selectedRows.map((row: any) => row.original.api_key).join('\n')
        : dataApiKeys.map((item: any) => item.api_key).join('\n')

    const blob = new Blob([apiKeysToDownload], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `api-keys-${orderData?.order?.order_code || 'export'}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getTypeColor = (type: string) => {
    return type === 'BUY' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
  }

  const getTypeLabel = (type: string) => {
    return type === 'BUY' ? 'Mua' : type === 'REFUND' ? 'Hoàn tiền' : 'Không xác định'
  }

  const getStatusBadge = (status: string) => {
    const label = ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS]
    const color = ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS]

    if (!label) {
      return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }

    // Icon cho từng trạng thái
    let icon = <CircleQuestionMark size={16} />

    switch (status) {
      case ORDER_STATUS.PENDING:
        // Đang chờ xử lý - icon loading xoay
        icon = (
          <Loader2
            size={16}
            style={{
              animation: 'spin 1s linear infinite'
            }}
          />
        )
        break
      case ORDER_STATUS.PROCESSING:
        // Đang xử lý - icon loading xoay
        icon = (
          <Loader2
            size={16}
            style={{
              animation: 'spin 1s linear infinite'
            }}
          />
        )
        break
      case ORDER_STATUS.COMPLETED:
        // Hoàn thành - icon check
        icon = <BadgeCheck size={16} />
        break
      case ORDER_STATUS.FAILED:
        // Lỗi - icon X
        icon = <CircleX size={16} />
        break
      case ORDER_STATUS.CANCEL:
        // Đã hủy - icon XCircle
        icon = <XCircle size={16} />
        break
      case ORDER_STATUS.EXPIRED:
        // Hoàn tiền - icon rotate
        icon = <Clock size={16} />
        break
      default:
        icon = <CircleQuestionMark size={16} />
    }

    return <Chip label={label} size='small' icon={icon} color={color as any} />
  }

  // Columns configuration for proxy table
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: any }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            size='small'
          />
        ),
        cell: ({ row }: { row: any }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            size='small'
          />
        ),
        size: 50
      },
      {
        header: 'ApiKey / Proxy',
        size: 200,
        cell: ({ row }: { row: any }) => {
          // Nếu api_key rỗng hoặc null → hiển thị Proxy
          if (!row.original.api_key) {
            // Kiểm tra nếu proxys là object thì lấy http hoặc socks5
            const proxys = row.original.proxys
            if (proxys && typeof proxys === 'object') {
              return proxys.http || proxys.socks5 || '-'
            }
            return proxys || '-'
          }

          // Nếu có api_key → hiển thị api_key
          return row.original.api_key
        }
      },
      {
        header: 'Loại',
        size: 150,
        cell: ({ row }: { row: any }) => row.original.plan_type ?? '-'
      },
      {
        header: 'Trạng thái',
        size: 150,
        cell: ({ row }: { row: any }) => {
          if (row.original?.status === 'ACTIVE' || row.original?.status === 1) {
            return <Chip label='Hoạt động' size='small' icon={<BadgeCheck />} color='success' />
          } else if (row.original?.status === 5 || row.original?.status === 'EXPIRED') {
            return <Chip label='Hết hạn' size='small' icon={<CircleX />} color='error' />
          } else {
            return <Chip label='Hết hạn' size='small' icon={<CircleX />} color='error' />
          }
        }
      },
      {
        header: 'Ngày mua',
        size: 200,
        cell: ({ row }: { row: any }) => {
          return (
            <>
              <div className='d-flex align-items-center  gap-1 '>
                <Clock3 size={14} />
                <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original.buy_at)}</div>
              </div>
            </>
          )
        }
      },
      {
        header: 'Ngày hết hạn',
        size: 200,
        cell: ({ row }: { row: any }) => (
          <>
            <div className='d-flex align-items-center  gap-1 '>
              <Clock3 size={14} />
              <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original.created_at)}</div>
            </div>
          </>
        )
      }
    ],
    []
  )

  // Table instance
  const table = useReactTable({
    data: dataApiKeys || [],
    columns,
    state: {
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5
      }
    }
  })

  // Reset checkbox selection khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setRowSelection({})
    }
  }, [isOpen])

  // Early return AFTER all hooks
  if (!isOpen) return null
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='order-detail-dialog'
      open={isOpen}
      closeAfterTransition={false}
      maxWidth='lg'
      fullWidth={true}
      PaperProps={{ sx: { overflow: 'visible', maxHeight: '90vh' } }}
    >
      <div className='bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-3 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-white'>Chi tiết giao dịch</h2>
            <p className='text-orange-100 text-sm mt-1'>Mã giao dịch: #{orderData?.order?.order_code || '—'}</p>
          </div>
          <button
            onClick={onClose}
            className='text-white/80 hover:text-white bg-white/10 hover:bg-white/10 rounded-lg p-2 transition-all'
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className='p-6 flex flex-col items-center justify-center min-h-[400px]'>
            <Loader2 className='w-12 h-12 text-slate-600 animate-spin mb-4' />
            <p className='text-gray-600 font-medium'>Đang tải thông tin...</p>
          </div>
        ) : (
          <div className='overflow-y-auto max-h-[calc(90vh-160px)]'>
            <div className='p-6 space-y-6'>
              {/* Transaction Info */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                        <Chip
                          label={getTypeLabel(orderData?.type)}
                          icon={<CheckCircle size={14} />}
                          color='success'
                          size='small'
                        />
                      ) : (
                        <Chip
                          label={getTypeLabel(orderData?.type)}
                          icon={<Clock size={14} />}
                          color='warning'
                          size='small'
                        />
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
                        <p className='text-xs text-slate-500 mb-1'>Tổng tiền</p>
                        <p className='text-2xl font-bold text-slate-800'>
                          {new Intl.NumberFormat('vi-VN').format(orderData?.order?.total_amount || 0)} đ
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className='text-xs text-slate-500 mb-1'>Trạng thái</p>
                      {getStatusBadge(orderData?.order?.status)}

                      {console.log(orderData?.order?.status)}
                    </div>
                    <div>
                      <p className='text-xs text-slate-500 mb-1'>Nội dung</p>
                      <p className='text-sm text-slate-600 leading-relaxed'>{orderData?.noidung || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proxy List Table */}
              {dataApiKeys && dataApiKeys.length > 0 && (
                <div className='bg-slate-50 rounded-xl  border border-slate-200 overflow-hidden'>
                  {/* Header with Copy and Download Buttons */}
                  <div className='flex items-center justify-between px-4 py-3 bg-slate-100 border-b border-slate-200'>
                    <div className='flex items-center gap-3'></div>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => {
                          const selectedRows = table.getFilteredSelectedRowModel().rows
                          const apiKeysToCopy =
                            selectedRows.length > 0
                              ? selectedRows.map((row: any) => row.original.api_key).join('\n')
                              : dataApiKeys.map((item: any) => item.api_key).join('\n')
                          copyToClipboard(apiKeysToCopy, 'header')
                        }}
                        disabled={Object.keys(rowSelection).length === 0}
                        className='px-3 py-1.5 text-sm rounded-lg font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500'
                      >
                        {copiedField === 'header' ? (
                          <>
                            <CheckCircle size={14} />
                            Đã copy
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            {Object.keys(rowSelection).length > 0
                              ? `Copy ${Object.keys(rowSelection).length} keys`
                              : 'Copy keys'}
                          </>
                        )}
                      </button>
                      <button
                        onClick={downloadApiKeys}
                        disabled={Object.keys(rowSelection).length === 0}
                        className='px-3 py-1.5 text-sm rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500'
                      >
                        <Download size={14} />
                        {Object.keys(rowSelection).length > 0
                          ? `Tải ${Object.keys(rowSelection).length} keys`
                          : 'Tải keys'}
                      </button>
                    </div>
                  </div>

                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-slate-200'>
                      <thead className='bg-slate-100'>
                        {table.getHeaderGroups().map(headerGroup => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                              <th
                                key={header.id}
                                style={{ width: header.getSize() }}
                                className='px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider'
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody className='bg-white divide-y divide-slate-200'>
                        {loadingApiKeys ? (
                          <tr>
                            <td colSpan={columns.length} className='py-10 text-center'>
                              <div className='flex flex-col items-center justify-center'>
                                <Loader2 className='w-8 h-8 text-slate-600 animate-spin mb-2' />
                                <p className='text-slate-600'>Đang tải danh sách proxy...</p>
                              </div>
                            </td>
                          </tr>
                        ) : table.getRowModel().rows.length === 0 ? (
                          <tr>
                            <td colSpan={columns.length} className='py-10 text-center'>
                              <p className='text-slate-500'>Không có proxy nào</p>
                            </td>
                          </tr>
                        ) : (
                          table.getRowModel().rows.map(row => (
                            <tr key={row.id} className='hover:bg-slate-50 transition-colors'>
                              {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className='px-4 py-3 text-sm text-slate-700'>
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                              ))}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className='flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50'>
                    <div className='text-sm text-slate-600'>
                      Hiển thị {table.getRowModel().rows.length} / {dataApiKeys?.length || 0} api keys • Trang{' '}
                      {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className='px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                      >
                        Trước
                      </button>
                      <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className='px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}
