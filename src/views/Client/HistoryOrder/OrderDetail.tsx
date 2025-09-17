'use client'

import React, { useMemo, useState } from 'react'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip } from '@mui/material'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import { Copy, Clock, Clock3, BadgeCheck, TriangleAlert, BadgeMinus, CircleQuestionMark } from 'lucide-react'

import { formatDateTimeLocal } from '@/utils/formatDate'
import { useCopy } from '@/app/hooks/useCopy'

// Badge trạng thái
const getStatusBadge = (status: string) => {
  switch (status) {
    case '0':
      return <Chip label='Chờ xử lý' size='small' icon={<BadgeCheck />} color='warning' />
    case '2':
      return <Chip label='Hoàn thành' size='small' icon={<TriangleAlert />} color='success' />
    case '5':
      return <Chip label='Hết hạn' size='small' icon={<BadgeMinus />} color='error' />
    default:
      return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
  }
}

interface ProxyItem {
  id: string
  proxys: {
    loaiproxy?: string
    [key: string]: any
  }
  buy_at: string
  expired_at: string
  status: string
}

interface OrderDetailProps {
  open: boolean
  onClose: () => void
  order: {
    order_code: string
    total_amount: number
    quantity: number
    status: string
    buy_at: string
    expired_at: string
    proxys?: ProxyItem[]
    api_keys?: any[]
    type_servi?: {
      type: string
      name: string
      price: number
    }
  } | null
}

const OrderDetail: React.FC<OrderDetailProps> = ({ open, onClose, order }) => {
  // ----------------- Hooks -----------------
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<any[]>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [, copy] = useCopy()

  // ----------------- Data -----------------
  // Lấy danh sách proxy từ order, nếu không có thì tạo array rỗng
  const dataOrder = order?.api_keys || []

  console.log(order)

  // ----------------- Columns -----------------
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60
      },
      {
        accessorKey: 'proxy',
        header: order?.type_servi?.type === '0' ? 'Proxy' : 'Proxy API',
        cell: ({ row }: { row: any }) => {
          if (order?.type_servi?.type === '0') {
            // ----- Dữ liệu Proxy thông thường -----
            const proxys = row.original.proxys || {}

            const proxyValues = Object.entries(proxys)
              .filter(([key]) => key !== 'loaiproxy')
              .map(([_, value]) => value)

            const firstProxy = proxyValues[0] || '-'

            return (
              <div className='flex items-center gap-2'>
                <span className='flex-1 truncate'>{String(firstProxy)}</span>
                {firstProxy !== '-' && (
                  <button
                    className='flex items-center justify-center w-6 h-6 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200'
                    onClick={() => copy(String(firstProxy), 'Đã copy proxy!')}
                    title='Copy proxy'
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>
            )
          } else {
            const apiProxy = row.original?.api_key || '-'

            return (
              <div className='flex items-center gap-2'>
                <span className='flex-1 truncate text-red-600'>{apiProxy}</span>
                {apiProxy !== '-' && (
                  <button
                    className='flex items-center justify-center w-6 h-6 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors duration-200'
                    onClick={() => copy(apiProxy, 'Đã copy API key!')}
                    title='Copy API key'
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>
            )
          }
        },
        size: 350
      },
      {
        header: 'Tên',
        cell: ({ row }: { row: any }) => {
          console.log(order)

          return <span className='text-red'>{order?.type_servi?.name}</span>
        },
        size: 150
      },
      {
        accessorKey: 'protocol',
        header: 'Loại',
        cell: ({ row }: { row: any }) => {
          const proxys = row.original.proxys || {}
          const keys = Object.keys(proxys).filter(k => k !== 'loaiproxy')

          return <b>{keys[0]?.toUpperCase() || '-'}</b>
        },
        size: 80
      },
      {
        header: 'Giá tiền',
        cell: ({ row }: { row: any }) => (
          <div>{new Intl.NumberFormat('vi-VN').format(order?.type_servi?.price || 0) + ' đ'}</div>
        ),
        size: 200
      },
      {
        header: 'Ip Version',
        cell: ({ row }: { row: any }) => order?.type_servi?.ip_version,
        size: 200
      },
      {
        accessorKey: 'buy_at',
        header: 'Ngày mua',
        cell: ({ row }: { row: any }) => (
          <div className='flex items-center gap-1'>
            <Clock3 size={14} />
            <span>{formatDateTimeLocal(row.original.buy_at)}</span>
          </div>
        ),
        size: 200
      },
      {
        accessorKey: 'expired_at',
        header: 'Ngày hết hạn',
        cell: ({ row }: { row: any }) => (
          <div className='flex items-center gap-1'>
            <Clock size={14} />
            <span>{formatDateTimeLocal(row.original.expired_at)}</span>
          </div>
        ),
        size: 200
      }
    ],
    [order, copy]
  )

  // ----------------- Table -----------------
  const table = useReactTable({
    data: dataOrder,
    columns,
    state: { rowSelection, pagination, columnFilters, sorting },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const startRow = totalRows ? pageIndex * pageSize + 1 : 0
  const endRow = Math.min(startRow + pageSize - 1, totalRows)

  // ----------------- Render -----------------
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xl' aria-labelledby='order-detail-dialog'>
      <DialogTitle id='order-detail-dialog'>
        {order ? `Chi tiết đơn hàng #${order.order_code}` : 'Không có dữ liệu'}
      </DialogTitle>

      <DialogContent dividers>
        {order ? (
          <>
            {/* Order Information */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Thông tin đơn hàng
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Mã đơn hàng:
                  </Typography>
                  <Typography variant='body1' fontWeight='bold'>
                    {order.order_code}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: '120px' }}>
                  <Typography variant='body2' color='text.secondary'>
                    Tổng tiền:
                  </Typography>
                  <Typography variant='body1' fontWeight='bold' color='primary'>
                    {new Intl.NumberFormat('vi-VN').format(order.total_amount)} đ
                  </Typography>
                </Box>
                <Box sx={{ minWidth: '80px' }}>
                  <Typography variant='body2' color='text.secondary'>
                    Số lượng:
                  </Typography>
                  <Typography variant='body1' fontWeight='bold'>
                    {order.quantity}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Trạng thái:
                  </Typography>
                  {getStatusBadge(order.status)}
                </Box>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Ngày mua:
                  </Typography>
                  <Typography variant='body1'>{formatDateTimeLocal(order.buy_at)}</Typography>
                </Box>
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Ngày hết hạn:
                  </Typography>
                  <Typography variant='body1'>{formatDateTimeLocal(order.expired_at)}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Proxy List */}
            <Typography variant='h6' sx={{ mb: 2 }}>
              Danh sách proxy ({totalRows} proxy)
            </Typography>

            {dataOrder.length > 0 ? (
              <>
                <div className='table-wrapper' style={{ maxHeight: '400px', overflow: 'auto' }}>
                  <table className='table-auto w-full border-collapse border border-gray-200 text-sm'>
                    <thead className='sticky top-0 bg-white'>
                      {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map(header => (
                            <th
                              key={header.id}
                              className='border border-gray-200 px-3 py-2 text-left bg-gray-50 font-semibold'
                              style={{ width: header.column.columnDef.size }}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className='hover:bg-gray-50'>
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className='border border-gray-200 px-3 py-2'>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Typography variant='caption' display='block' sx={{ mt: 1, textAlign: 'center' }}>
                  Hiển thị {startRow}-{endRow} / {totalRows} proxy
                </Typography>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant='body1' color='text.secondary'>
                  Đơn hàng này chưa có proxy nào
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant='body1' color='text.secondary'>
              Không có dữ liệu đơn hàng
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant='contained' color='primary'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OrderDetail
