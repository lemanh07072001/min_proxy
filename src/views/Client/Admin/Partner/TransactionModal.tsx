'use client'

import { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import { Clock3, List, X, Loader2, CheckCircle, XCircle, RotateCcw } from 'lucide-react'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'
import Pagination from '@mui/material/Pagination'
import Dialog from '@mui/material/Dialog'
import { Button, IconButton, Tooltip } from '@mui/material'

import { usePartnerTransactions, useUpdateTransactionStatus } from '@/hooks/apis/usePartners'
import { formatDateTimeLocal } from '@/utils/formatDate'
import { toast } from 'react-toastify'

interface TransactionModalProps {
  open: boolean
  onClose: () => void
  partnerId?: number | string
  partnerName?: string
}

export default function TransactionModal({ open, onClose, partnerId, partnerName }: TransactionModalProps) {
  // Early return nếu modal không mở - tránh render không cần thiết
  if (!open) return null

  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<any[]>([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  // Gọi API get-topup-history - chỉ gọi khi modal mở và có partnerId
  const shouldFetch = useMemo(() => open && !!partnerId, [open, partnerId])
  const { data: transactions = [], isLoading, isError, error } = usePartnerTransactions(partnerId, shouldFetch)
  const updateStatusMutation = useUpdateTransactionStatus()
  
  const columns = useMemo(
    () => [
      {
        header: 'ID Giao dịch',
        cell: ({ row }: { row: any }) => {
          return (
            <div className='text-sm font-medium'>
              {row.original?.system_transaction_id || '-'}
            </div>
          )
        },
        size: 200
      },
      {
        header: 'Số tiền',
        cell: ({ row }: { row: any }) => {
          const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          })
          const amount = row.original?.amount || 0
          const isPositive = amount >= 0
          return (
            <div>
              <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{formatter.format(amount)}
              </span>
            </div>
          )
        },
        size: 150
      },
      {
        header: 'Trạng thái',
        cell: ({ row }: { row: any }) => {
          const status = row.original?.status
          if (status === 'completed' || status === 'success' || status === 'SUCCESS') {
            return <Chip label='Thành công' size='small' color='success' />
          } else if (status === 'pending' || status === 'PENDING') {
            return <Chip label='Đang xử lý' size='small' color='warning' />
          } else if (status === 'failed' || status === 'FAILED' || status === 'error') {
            return <Chip label='Thất bại' size='small' color='error' />
          }
          return <Chip label={status || 'Không xác định'} size='small' color='default' />
        },
        size: 150
      },
      {
        header: 'Thời gian',
        cell: ({ row }: { row: any }) => {
          const dateStr = row.original?.created_at
          return (
            <div className='d-flex align-items-center gap-1'>
              <Clock3 size={14} />
              <div style={{ marginTop: '2px' }}>{dateStr ? formatDateTimeLocal(dateStr) : '-'}</div>
            </div>
          )
        },
        size: 180
      },
      {
        header: 'Action',
        cell: ({ row }: { row: any }) => {
          const status = row.original?.status
          const transactionId = row.original?.id || row.original?.system_transaction_id
          const isPending = status === 'pending';
          const isSuccess = status === 'success'

          
          const handleUpdateToSuccess = () => {
            if (transactionId && partnerId) {
              updateStatusMutation.mutate(
                { transactionId, partnerId, status: 'success' },
                {
                  onSuccess: () => {
                    toast.success('Cập nhật trạng thái thành công!')
                  },
                  onError: (error: any) => {
                    toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái')
                  }
                }
              )
            }
          }

          const handleUpdateToError = () => {
            if (transactionId && partnerId) {
              updateStatusMutation.mutate(
                { transactionId, partnerId, status: 'failed' },
                {
                  onSuccess: () => {
                    toast.success('Cập nhật trạng thái thành công!')
                  },
                  onError: (error: any) => {
                    toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái')
                  }
                }
              )
            }
          }

          const handleUpdateToPending = () => {
            if (transactionId && partnerId) {
              updateStatusMutation.mutate(
                { transactionId, partnerId, status: 'pending' },
                {
                  onSuccess: () => {
                    toast.success('Cập nhật trạng thái thành công!')
                  },
                  onError: (error: any) => {
                    toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái')
                  }
                }
              )
            }
          }

          return (
            <div className='flex gap-1'>
              {isPending && (
                <>
                  <Tooltip title='Cập nhật trạng thái thành công'>
                    <span>
                      <IconButton
                        size='small'
                        color='success'
                        onClick={handleUpdateToSuccess}
                        disabled={updateStatusMutation.isPending}
                      >
                        <CheckCircle size={18} />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title='Uncheck - Hủy xác nhận'>
                    <span>
                      <IconButton
                        size='small'
                        color='error'
                        onClick={handleUpdateToError}
                        disabled={updateStatusMutation.isPending}
                      >
                        < XCircle size={18} />
                      </IconButton>
                    </span>
                  </Tooltip>
                </>
              )}
              {isSuccess && (
                <Tooltip title='Cập nhật trạng thái về đang xử lý'>
                  <span>
                    <IconButton
                      size='small'
                      color='warning'
                      onClick={handleUpdateToPending}
                      disabled={updateStatusMutation.isPending}
                    >
                      <RotateCcw size={18} />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              {!isPending && !isSuccess && (
                <span className='text-sm text-gray-400'>-</span>
              )}
            </div>
          )
        },
        size: 120
      }
    ],
    [partnerId, updateStatusMutation]
  )

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      rowSelection,
      pagination,
      columnFilters,
      sorting
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min(startRow + pageSize - 1, totalRows)

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='transaction-modal-title'
      open={open}
      closeAfterTransition={false}
      maxWidth='lg'
      fullWidth={true}
      PaperProps={{ sx: { overflow: 'visible' } }}
    >
      <div className='relative bg-white rounded-lg shadow-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp mx-auto'>
        <div className='relative bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-4 py-4 sm:py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2 sm:gap-3'>
            <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/20 flex items-center justify-center'>
              <List className='text-white' size={20} />
            </div>
            <div>
              <h2 className='text-lg sm:text-xl font-bold text-white'>Lịch sử giao dịch</h2>
              <p className='text-orange-100 text-xs sm:text-sm hidden sm:block'>
                {partnerName || 'Đối tác'} - Chi tiết giao dịch nạp tiền
              </p>
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
              Đang tải dữ liệu giao dịch...
            </p>
            <p className='text-xs sm:text-sm text-gray-400 mt-2 text-center'>Vui lòng đợi trong giây lát</p>
          </div>
        ) : isError ? (
          <div className='p-4 sm:p-6 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]'>
            <div className='text-center text-red-500 font-medium text-sm sm:text-base mb-2'>
              Có lỗi xảy ra khi tải dữ liệu
            </div>
            <div className='text-center text-sm text-gray-500'>
              {error instanceof Error ? error.message : 'Vui lòng thử lại sau'}
            </div>
          </div>
        ) : (
          <div className='p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]'>
            <div className='table-container'>
              <div className='table-wrapper'>
                <table className='data-table' style={transactions.length === 0 ? { height: '100%' } : {}}>
                  <thead className='table-header'>
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th style={{ width: header.getSize() }} className='table-header th' key={header.id}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className='py-10 text-center'>
                          <div className='flex flex-col items-center justify-center'>
                            <Image src='/images/no-data.png' alt='No data' width={160} height={160} />
                            <p className='mt-4 text-gray-500'>Không có dữ liệu giao dịch</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map(row => (
                        <tr className='table-row' key={row.id}>
                          {row.getVisibleCells().map(cell => (
                            <td className='table-cell' key={cell.id}>
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
              {totalRows > 0 && (
                <div className='pagination-container'>
                  <div className='pagination-wrapper'>
                    <div className='pagination-info'>
                      <div className='page-size-select'>
                        <span className='text-sm text-gray'>Kích cỡ trang</span>
                        <div className='page-size-select-wrapper'>
                          <select
                            value={table.getState().pagination.pageSize}
                            onChange={e => {
                              table.setPageSize(Number(e.target.value))
                            }}
                            className='page-size-select'
                          >
                            <option value='10'>10</option>
                            <option value='50'>50</option>
                            <option value='100'>100</option>
                          </select>
                          <div className='select-arrow'>
                            <svg className='h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                              <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        {totalRows > 0 ? (
                          <span>
                            {startRow} - {endRow} của {totalRows} hàng
                          </span>
                        ) : (
                          <span>Không có dữ liệu</span>
                        )}
                      </div>
                    </div>

                    <div className='pagination-buttons'>
                      <Pagination
                        count={table.getPageCount()}
                        shape='rounded'
                        variant='outlined'
                        color='primary'
                        page={table.getState().pagination.pageIndex + 1}
                        onChange={(event, page) => {
                          table.setPageIndex(page - 1)
                        }}
                      />
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

