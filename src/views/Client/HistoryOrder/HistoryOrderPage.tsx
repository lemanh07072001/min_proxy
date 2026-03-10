'use client'

import { useEffect, useMemo, useState } from 'react'

import Image from 'next/image'

import { Button } from '@mui/material'

import {
  List,
  Clock3,
  Clock,
  Eye,
  Search,
  Filter
} from 'lucide-react'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues // Thêm để lọc hàng đã chọn
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

import Pagination from '@mui/material/Pagination'

import { useQueryClient } from '@tanstack/react-query'

import { io } from 'socket.io-client'

import CustomIconButton from '@core/components/mui/IconButton'

import { useCopy } from '@/app/hooks/useCopy'
import { formatDateTimeLocal } from '@/utils/formatDate'
import { useHistoryOrders } from '@/hooks/apis/useHistoryOrders'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/constants/orderStatus'
import OrderDetail from './OrderDetail'

export default function HistoryOrderPage() {
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn
  const [sorting, setSorting] = useState<any[]>([])

  const [open, setOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  }) // State để lưu các hàng được chọn

  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const queryClient = useQueryClient()
  const [, copy] = useCopy()

  const {
    data: dataOrders = [],
    isLoading,
    refetch
  } = useHistoryOrders()

  // Filter data client-side
  const filteredOrders = useMemo(() => {
    let result = dataOrders

    if (searchText.trim()) {
      const search = searchText.trim().toLowerCase()

      result = result.filter((order: any) =>
        order.order_code?.toLowerCase().includes(search) ||
        order.type_servi?.name?.toLowerCase().includes(search)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((order: any) => String(order.status) === statusFilter)
    }

    return result
  }, [dataOrders, searchText, statusFilter])

  const getStatusBadge = (status: string) => {
    const label = ORDER_STATUS_LABELS[status] || 'Không xác định'
    const color = (ORDER_STATUS_COLORS[status] || 'default') as any

    return <Chip label={label} size='small' color={color} />
  }

  // Tính thời gian còn lại (text tĩnh)
  const getTimeRemaining = (expiredAt: string, status: string) => {
    if (String(status) !== '2' && String(status) !== '3') return null

    const now = new Date()
    const expired = new Date(expiredAt)
    const diff = expired.getTime() - now.getTime()

    if (diff <= 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `còn ${days}d ${hours}h`

    return `còn ${hours}h`
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'order_code',
        header: 'Mã đơn',
        size: 170
      },
      {
        header: 'Dịch vụ',
        cell: ({ row }: { row: any }) => (
          <div>
            <div className='font-semibold text-sm'>{row.original.type_servi?.name || '-'}</div>
            {row.original.proxy_type && (
              <span className='text-xs text-gray-500'>{row.original.proxy_type}</span>
            )}
          </div>
        ),
        size: 180
      },
      {
        header: 'Số tiền',
        cell: ({ row }: { row: any }) => (
          <div>
            <div className='font-bold'>{new Intl.NumberFormat('vi-VN').format(row.original.total_amount) + ' đ'}</div>
            <span className='text-xs text-gray-500'>
              {new Intl.NumberFormat('vi-VN').format(row.original.price_per_unit) + ' đ/key'}
            </span>
          </div>
        ),
        size: 150
      },
      {
        accessorKey: 'quantity',
        header: 'Số lượng',
        cell: ({ row }: { row: any }) => {
          const qty = row.original.quantity
          const delivered = row.original.delivered_quantity

          if (delivered != null && delivered !== qty) {
            return <span>{delivered}/{qty}</span>
          }

          return <span>{qty}</span>
        },
        size: 80
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }: { row: any }) => getStatusBadge(String(row.original.status)),
        size: 150
      },
      {
        accessorKey: 'buy_at',
        header: 'Ngày mua',
        size: 180,
        cell: ({ row }: { row: any }) => (
          <div className='d-flex align-items-center gap-1'>
            <Clock3 size={14} />
            <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original.buy_at)}</div>
          </div>
        )
      },
      {
        accessorKey: 'expired_at',
        header: 'Hết hạn',
        size: 200,
        cell: ({ row }: { row: any }) => {
          const remaining = getTimeRemaining(row.original.expired_at, row.original.status)

          return (
            <div>
              <div className='d-flex align-items-center gap-1'>
                <Clock size={14} />
                <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original.expired_at)}</div>
              </div>
              {remaining && (
                <span className='text-xs text-green-600 font-medium'>{remaining}</span>
              )}
            </div>
          )
        }
      },
      {
        header: '',
        id: 'actions',
        cell: ({ row }: { row: any }) => (
          <CustomIconButton
            aria-label='Xem chi tiết'
            color='info'
            variant='tonal'
            onClick={() => {
              setSelectedOrder(row.original)
              setOpen(true)
            }}
          >
            <Eye size={16} />
          </CustomIconButton>
        ),
        size: 60
      }
    ],
    []
  )

  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: {
      rowSelection,
      pagination,
      columnFilters,
      sorting
    },
    enableRowSelection: true, // Bật tính năng chọn hàng
    onRowSelectionChange: setRowSelection, // Cập nhật state khi có thay đổi
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Tùy chọn: cần thiết nếu có bộ lọc
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min(startRow + pageSize - 1, totalRows)

  // Socket: lắng nghe sự kiện để refetch bảng
  useEffect(() => {
    // Bảo đảm lần đầu vào trang sẽ làm tươi dữ liệu
    queryClient.invalidateQueries({ queryKey: ['userOrders'] })

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://socket.mktproxy.com'

    const socket = io(socketUrl, {
      transports: ['websocket'],
      secure: true
    })

    socket.on('connect', () => console.log('✅ Connected to socket:', socket.id))
    socket.on('order_completed', data => {
      queryClient.invalidateQueries({ queryKey: ['userOrders'] })
      setTimeout(() => {
        void refetch()
      }, 600)
    })

    return () => {
      socket.disconnect()
    }
  }, [refetch, queryClient])

  return (
    <>
      <div className='orders-content'>
        {/* Toolbar */}

        {/* Proxy Table */}
        <div className='table-container'>
          <div className='table-toolbar'>
            <div className='header-left'>
              <div className='page-icon'>
                <List size={17} />
              </div>
              <div>
                <h5 className='mb-0 font-semibold'>Lịch sử mua hàng</h5>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <TextField
                size='small'
                placeholder='Tìm mã đơn, dịch vụ...'
                value={searchText}
                onChange={e => {
                  setSearchText(e.target.value)
                  setPagination(prev => ({ ...prev, pageIndex: 0 }))
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search size={16} />
                    </InputAdornment>
                  )
                }}
                sx={{ minWidth: 200 }}
              />
              <Select
                size='small'
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value)
                  setPagination(prev => ({ ...prev, pageIndex: 0 }))
                }}
                sx={{ minWidth: 160 }}
                displayEmpty
              >
                <MenuItem value='all'>Tất cả trạng thái</MenuItem>
                {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </div>
          </div>
          {/* Table */}
          <div className='table-wrapper'>
            <table className='data-table' style={isLoading || dataOrders.length === 0 ? { height: '100%' } : {}}>
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
                          <span></span>
                          <span></span>
                          <span></span>
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
                        <p className='mt-4 text-gray-500'>Không có dữ liệu</p>
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
          <div className='pagination-container'>
            <div className='pagination-wrapper'>
              <div className='pagination-info'>
                <div className='page-size-select'>
                  <span className='text-sm text-gray'>Hiển thị mỗi trang</span>
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
                {/* --- Hiển thị số hàng trên trang hiện tại --- */}
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
        </div>
      </div>

      {open && (
        <OrderDetail
          open={open}
          onClose={() => {
            setOpen(false)
            setSelectedOrder(null)
          }}
          order={selectedOrder}
        />
      )}
    </>
  )
}
