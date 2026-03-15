import { useMemo, useState } from 'react'

import Image from 'next/image'

import { BadgeCheck, CircleQuestionMark, Clock3, TriangleAlert } from 'lucide-react'

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

import useAxiosAuth from '@/hocs/useAxiosAuth'
import { formatDateTimeLocal } from '@/utils/formatDate'

export default function UserWithdrawalTable() {
  const [columnFilters, setColumnFilters] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  const axiosAuth = useAxiosAuth()

  const { data: dataWithdrawal, isLoading } = useQuery({
    queryKey: ['withdrawal-user'],
    queryFn: async () => {
      const response = await axiosAuth.get('/withdrawal-user')

      return response.data
    }
  })

  const getStatusBadge = (status: number | string) => {
    const s = Number(status)

    switch (s) {
      case 1:
        return <Chip label='Đã thanh toán' size='small' icon={<BadgeCheck />} color='success' />
      case 0:
        return <Chip label='Chưa thanh toán' size='small' icon={<TriangleAlert />} color='error' />
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'created_at',
        header: 'Ngày',
        cell: ({ row }: { row: any }) => (
          <div className='d-flex align-items-center gap-1'>
            <Clock3 size={14} />
            <span style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original?.created_at)}</span>
          </div>
        ),
        size: 160
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }: { row: any }) => row.original.email,
        size: 200
      },
      {
        header: 'Tổng số tiền nạp',
        cell: ({ row }: { row: any }) => (
          <span style={{ color: 'var(--primary-hover, #e53e3e)', fontWeight: 600 }}>
            {new Intl.NumberFormat('vi-VN').format(row.original.tong_don_hang ?? 0)} đ
          </span>
        ),
        size: 140
      },
      {
        header: 'Tổng số giao dịch',
        cell: ({ row }: { row: any }) => (
          <span style={{ fontWeight: 600 }}>{row.original.tong_don ?? 0}</span>
        ),
        size: 120
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className='table-container' style={{ boxShadow: 'none' }}>
      <div className='table-wrapper'>
        <table className='data-table' style={isLoading || !dataWithdrawal?.length ? { height: '100%' } : {}}>
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
