'use client'

import { useMemo, useState } from 'react'

import { TriangleAlert, CircleQuestionMark, BadgeCheck, BadgeMinus, List, Clock3 } from 'lucide-react'

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

import MenuItem from '@mui/material/MenuItem'

import { useQuery } from '@tanstack/react-query'

import { formatDateTimeLocal } from '@/utils/formatDate'

import CustomTextField from '@core/components/mui/TextField'
import useAxiosAuth from '@/hocs/useAxiosAuth'

export default function TransactionHistoryPage({ data }: any) {
  const [columnFilters, setColumnFilters] = useState([])
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn
  const [sorting, setSorting] = useState([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const axiosAuth = useAxiosAuth()

  const { data: dataOrders = [], isLoading } = useQuery({
    queryKey: ['getTransactionHistory'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-transaction-history')

      return res.data ?? []
    }
  })

  console.log(dataOrders)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip label='Hoàn thành' size='small' icon={<BadgeCheck />} color='success' />
      case 'expired':
        return <Chip label='Hết hạn' size='small' icon={<TriangleAlert />} color='error' />
      case 'suspended':
        return <Chip label='Chờ giao dịch' size='small' icon={<BadgeMinus />} color='warning' />
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }

  const columns = useMemo(
    () => [
      {
        header: 'ID',
        cell: ({ row }) => {
          console.log(row.original)

          return <span className='font-sm ms-2'>{row.original.bank_auto.tid}</span>
        },
        size: 60
      },
      {
        header: 'Lịch sử giao dịch',
        cell: ({ row }) => {
          if (row.original.bank_auto.transaction_type === 'PLUS') {
            return (
              <div>
                <Chip label='Nạp' size='small' color='success' />
                <span className='font-sm ms-2'>Nạp tiền thành công!</span>
              </div>
            )
          } else if (row.original.type === 'wallet') {
            return (
              <div>
                <Chip label='Tiêu' size='small' color='primary' style={{ color: '#fff' }} />
                <span className='font-sm ms-2'>Trừ tiền thành công!</span>
              </div>
            )
          }
        },
        size: 400
      },
      {
        accessorKey: 'amount',
        size: 100,
        header: 'Số tiền',
        cell: ({ row }) => {
          // Tạo một formatter cho tiền tệ Việt Nam
          const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          })

          const amount = row.original.bank_auto.amount
          const sotiengoc = row.original.sotientruoc

          return (
            <div>
              <div className='font-bold'>{formatter.format(amount)}</div>

              <span className='text-sm text-gray-500'>Số tiền gốc: {formatter.format(sotiengoc)}</span>
            </div>
          )
        }
      },
      {
        header: 'Thời gian',
        size: 100,
        cell: ({ row }) => {
          return (
            <>
              <div className='d-flex align-items-center  gap-1 '>
                <Clock3 size={14} />
                <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original.created_at)}</div>
              </div>
            </>
          )
        }
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
      <div className='table-container'>
        <div className='orders-content'>
          <div className='table-toolbar'>
            <div className='header-left'>
              <div className='page-icon'>
                <List size={17} />
              </div>
              <div>
                <h5 className='mb-0 font-semibold'>Lịch sử giao dịch</h5>
              </div>
            </div>
          </div>
          <div className='table-container'>
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
      </div>
    </>
  )
}
