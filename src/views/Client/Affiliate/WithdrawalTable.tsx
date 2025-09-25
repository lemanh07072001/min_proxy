import { useMemo, useState } from 'react'
import { FormControlLabel } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import { Clock, Clock3, Copy } from 'lucide-react'
import { formatDateTimeLocal } from '@/utils/formatDate'
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
import Image from 'next/image'
import Pagination from '@mui/material/Pagination'
import { useQuery } from '@tanstack/react-query'
import useAxiosAuth from '@/hocs/useAxiosAuth'


export default function WithdrawalTable(){
  const [columnFilters, setColumnFilters] = useState([])
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn
  const [sorting, setSorting] = useState([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  const axiosAuth = useAxiosAuth()


  const { data: dataWithdrawal, isLoading } = useQuery({
    queryKey: ['withdrawal'],
    queryFn: async () => {
      const response = await axiosAuth.get('/withdrawal-history');
      return response.data;
    }
  });

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
                <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original.created_at)}</div>
              </div>
            </>
          )
        },
        size: 10
      },
      {
        accessorKey: 'amount',
        header: 'Số tiền',
        cell: ({ row }) => {

          return <span className='text-red'>{new Intl.NumberFormat('vi-VN').format(row.original.amount) + ' đ'}</span>
        },
        size: 10
      },

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
    <div className='table-container'>
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