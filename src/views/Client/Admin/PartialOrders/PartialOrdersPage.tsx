'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'

import {
  List,
  Clock3,
  RefreshCw,
  DollarSign,
  Loader2
} from 'lucide-react'

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Pagination from '@mui/material/Pagination'

import { toast } from 'react-toastify'

import { formatDateTimeLocal } from '@/utils/formatDate'
import { usePartialOrders, useRetryPartial, useRefundPartial } from '@/hooks/apis/useTickets'

export default function PartialOrdersPage() {
  const [retryOrder, setRetryOrder] = useState<any>(null)
  const [refundOrder, setRefundOrder] = useState<any>(null)

  const { data: orders = [], isLoading } = usePartialOrders()
  const retryMutation = useRetryPartial()
  const refundMutation = useRefundPartial()

  const handleRetry = () => {
    if (!retryOrder) return
    retryMutation.mutate(retryOrder.id, {
      onSuccess: (data: any) => {
        toast.success(data.message || 'Đã đẩy đơn vào queue mua bù!')
        setRetryOrder(null)
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
      }
    })
  }

  const handleRefund = () => {
    if (!refundOrder) return
    refundMutation.mutate(refundOrder.id, {
      onSuccess: (data: any) => {
        toast.success(data.message || 'Hoàn tiền thành công!')
        setRefundOrder(null)
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
      }
    })
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60
      },
      {
        id: 'actions',
        header: 'Thao tác',
        size: 100,
        cell: ({ row }: { row: any }) => (
          <div className='flex gap-1'>
            <Tooltip title='Mua bù (retry)'>
              <IconButton size='small' color='success' onClick={() => setRetryOrder(row.original)}>
                <RefreshCw size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Hoàn tiền phần thiếu'>
              <IconButton size='small' color='warning' onClick={() => setRefundOrder(row.original)}>
                <DollarSign size={16} />
              </IconButton>
            </Tooltip>
          </div>
        )
      },
      {
        accessorKey: 'order_code',
        header: 'Mã đơn',
        size: 160,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontWeight: 600, fontSize: '13px' }}>{row.original.order_code}</span>
        )
      },
      {
        header: 'User',
        size: 180,
        cell: ({ row }: { row: any }) => (
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px' }}>{row.original.user?.name}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{row.original.user?.email}</div>
          </div>
        )
      },
      {
        header: 'Proxy',
        size: 140,
        cell: ({ row }: { row: any }) => {
          const delivered = row.original.delivered_quantity ?? 0
          const total = row.original.quantity
          const missing = row.original.missing_count ?? (total - delivered)

          return (
            <div>
              <span style={{ fontWeight: 600, fontSize: '13px' }}>
                {delivered}/{total}
              </span>
              <Chip
                label={`thiếu ${missing}`}
                size='small'
                color='error'
                sx={{ ml: 1, height: '20px', fontSize: '11px' }}
              />
            </div>
          )
        }
      },
      {
        header: 'Dịch vụ',
        size: 180,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontSize: '13px' }}>{row.original.type_servi?.name || '—'}</span>
        )
      },
      {
        accessorKey: 'created_at',
        header: 'Ngày tạo',
        size: 160,
        cell: ({ row }: { row: any }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '13px' }}>
            <Clock3 size={14} />
            {formatDateTimeLocal(row.original.created_at)}
          </div>
        )
      }
    ],
    []
  )

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
    getRowId: (row: any) => String(row.id)
  })

  return (
    <>
      <div className='orders-content'>
        <div className='table-container'>
          {/* Header */}
          <div className='table-toolbar w-full'>
            <div className='header-left'>
              <div className='page-icon'>
                <List size={17} />
              </div>
              <h5 className='mb-0 font-semibold'>Đơn hàng thiếu proxy</h5>
            </div>
            <div className='header-right'>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                {!isLoading && orders.length > 0 && `${orders.length} đơn`}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className='table-wrapper' style={{ overflowX: 'auto' }}>
            <table className='data-table' style={{ minWidth: '900px', ...(isLoading || !orders.length ? { height: '100%' } : {}) }}>
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
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className='py-10 text-center'>
                      <div className='loader-wrapper'>
                        <div className='loader'>
                          <span></span><span></span><span></span>
                        </div>
                        <p className='loading-text'>Đang tải dữ liệu...</p>
                      </div>
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className='py-10 text-center'>
                      <div className='flex flex-col items-center justify-center'>
                        <Image src='/images/no-data.png' alt='No data' width={160} height={160} />
                        <p className='mt-4' style={{ color: '#94a3b8' }}>Không có đơn hàng thiếu proxy</p>
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
          {!isLoading && orders.length > 0 && table.getPageCount() > 1 && (
            <div style={{ padding: '10px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <Pagination
                count={table.getPageCount()}
                page={table.getState().pagination.pageIndex + 1}
                onChange={(_, page) => table.setPageIndex(page - 1)}
                size='small'
                color='primary'
              />
            </div>
          )}
        </div>
      </div>

      {/* Retry Dialog */}
      <Dialog open={!!retryOrder} onClose={() => setRetryOrder(null)}>
        <DialogTitle>Mua bù proxy</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Đẩy đơn <strong>#{retryOrder?.order_code}</strong> vào queue để mua bù{' '}
            <strong>{retryOrder?.missing_count ?? (retryOrder?.quantity - (retryOrder?.delivered_quantity ?? 0))}</strong> proxy thiếu?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRetryOrder(null)} color='inherit'>Hủy</Button>
          <Button
            onClick={handleRetry}
            color='success'
            variant='contained'
            disabled={retryMutation.isPending}
            sx={{ color: '#fff' }}
          >
            {retryMutation.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Xác nhận mua bù'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={!!refundOrder} onClose={() => setRefundOrder(null)}>
        <DialogTitle>Hoàn tiền phần thiếu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hoàn tiền cho <strong>{refundOrder?.missing_count ?? (refundOrder?.quantity - (refundOrder?.delivered_quantity ?? 0))}</strong> proxy
            thiếu của đơn <strong>#{refundOrder?.order_code}</strong>?
            <br />
            <br />
            Đơn hàng vẫn active — proxy đã nhận vẫn hoạt động bình thường.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundOrder(null)} color='inherit'>Hủy</Button>
          <Button
            onClick={handleRefund}
            color='warning'
            variant='contained'
            disabled={refundMutation.isPending}
            sx={{ color: '#fff' }}
          >
            {refundMutation.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Xác nhận hoàn tiền'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
