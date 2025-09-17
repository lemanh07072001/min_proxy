'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'

import { Button } from '@mui/material'

import { TriangleAlert, CircleQuestionMark, BadgeCheck, BadgeMinus, List, Clock3, Clock, Eye } from 'lucide-react'

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

import Pagination from '@mui/material/Pagination'
import { useQuery } from '@tanstack/react-query'

import CustomIconButton from '@core/components/mui/IconButton'

import useAxiosAuth from '@/hocs/useAxiosAuth'
import { useCopy } from '@/app/hooks/useCopy'
import { formatDateTimeLocal } from '@/utils/formatDate'
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

  const axiosAuth = useAxiosAuth()
  const [, copy] = useCopy()

  const { data: dataOrders = [], isLoading } = useQuery({
    queryKey: ['orderProxyStatic'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-order')

      return res.data.data
    }
  })

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'viettel':
        return 'text-red-600 bg-red-50'
      case 'fpt':
        return 'text-orange-600 bg-orange-50'
      case 'vnpt':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

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

  const columns = useMemo(
    () => [
      {
        accessorKey: 'order_code',
        header: 'ID',
        size: 170
      },
      {
        header: 'Số tiền',
        cell: ({ row }: { row: any }) => (
          <div>
            <div className='font-bold'>{new Intl.NumberFormat('vi-VN').format(row.original.total_amount) + ' đ'}</div>
            <span className='font-sm'>
              Giá tiền: {new Intl.NumberFormat('vi-VN').format(row.original.price_per_unit) + ' đ'}
            </span>
          </div>
        ),
        size: 150
      },
      {
        accessorKey: 'quantity',
        header: 'Số lượng',
        size: 100
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }: { row: any }) => {
          return getStatusBadge(row.original.status)
        },
        size: 150
      },
      {
        accessorKey: 'buy_at',
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
        accessorKey: 'expired_at',
        header: 'Ngày hết hạn',
        size: 200,
        cell: ({ row }: { row: any }) => {
          return (
            <>
              <div className='d-flex align-items-center  gap-1 '>
                <Clock size={14} />
                <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original.expired_at)}</div>
              </div>
            </>
          )
        }
      },
      {
        header: 'Action',
        cell: ({ row }: { row: any }) => {
          return (
            <>
              <CustomIconButton
                aria-label='capture screenshot'
                color='info'
                variant='tonal'
                onClick={() => {
                  setSelectedOrder(row.original) // lưu dữ liệu dòng hiện tại
                  setOpen(true) // mở modal
                }}
              >
                <Eye size={16} />
              </CustomIconButton>
            </>
          )
        },
        size: 100
      }
    ],
    []
  )

  const table = useReactTable({
    data: dataOrders,
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
                  <span className='text-sm text-gray'>Kích cỡ trang linh</span>
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
            console.log('Closing modal')
            setOpen(false)
            setSelectedOrder(null)
          }}
          order={selectedOrder}
        />
      )}
    </>
  )
}
