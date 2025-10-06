import { useMemo, useState } from 'react'

import Image from 'next/image'

import { FormControlLabel } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import { BadgeCheck, BadgeMinus, CircleQuestionMark, Clock, Clock3, Copy, TriangleAlert } from 'lucide-react'

import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import Pagination from '@mui/material/Pagination'
import { useQuery } from '@tanstack/react-query'

import Chip from '@mui/material/Chip'
import { useSession } from 'next-auth/react'

import useAxiosAuth from '@/hocs/useAxiosAuth'
import { formatDateTimeLocal } from '@/utils/formatDate'

export default function UserWithdrawalTable() {
  const [columnFilters, setColumnFilters] = useState([])
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn
  const [sorting, setSorting] = useState([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  const axiosAuth = useAxiosAuth()
  const { data: session, status } = useSession()

  const { data: dataWithdrawal, isLoading } = useQuery({
    queryKey: ['withdrawal-user'],
    queryFn: async () => {
      const response = await axiosAuth.get('/withdrawal-user')

      return response.data
    }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 1:
        return <Chip label='Đã thanh toán' size='small' icon={<BadgeCheck />} color='success' />
      case 0:
        return <Chip label='Chưa thành toán' size='small' icon={<TriangleAlert />} color='error' />
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'created_at',
        header: 'Ngày',
        cell: ({ row }) => {
          return (
            <>
              <div className='d-flex align-items-center  gap-1 '>
                <Clock3 size={14} />
                <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original?.created_at)}</div>
              </div>
            </>
          )
        },
        size: 10
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => {
          return row.original.user?.email
        },
        size: 60
      },
      {
        header: 'Số tiền nạp',
        cell: ({ row }) => {
          return (
            <span className='text-red'>
              {new Intl.NumberFormat('vi-VN').format(row.original.user?.sotiennap) + ' đ'}
            </span>
          )
        },
        size: 10
      },
      {
        header: 'Thu nhập',
        cell: ({ row }) => {
          // 1. Tính toán giá trị cần hiển thị (phần trăm hoa hồng)
          const incomeValue = (row.original?.sotienthaydoi * session.user.affiliate_percent) / 100

          // 2. Định dạng số theo chuẩn Việt Nam (ví dụ: 100.000)
          const formattedValue = new Intl.NumberFormat('vi-VN').format(incomeValue)

          // 3. Hiển thị kết quả bằng cách nối chuỗi đơn vị tiền tệ
          return <span className='text-red'>{formattedValue} đ</span>
        },
        size: 10
      },

      {
        header: 'Trạng thái',
        cell: ({ row }) => {
          return getStatusBadge(row.original?.is_payment_affiliate)
        },
        size: 10
      }
    ],
    []
  )

  const table = useReactTable({
    data: dataWithdrawal ?? [],
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
    <div className='table-container' style={{ boxShadow: 'none' }}>
      {/* Table */}
      <div className='table-wrapper'>
        <table className='data-table' style={isLoading || dataWithdrawal.length === 0 ? { height: '100%' } : {}}>
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
        <div className='pagination-wrapper flex justify-content-end'>
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
  )
}
