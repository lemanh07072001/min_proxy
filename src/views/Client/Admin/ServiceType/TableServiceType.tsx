'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'

import { CircleQuestionMark, BadgeCheck, BadgeMinus, List, Copy, SquarePen, Trash2 } from 'lucide-react'

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

import { Button } from '@mui/material'

import useAxiosAuth from '@/hocs/useAxiosAuth'
import CustomIconButton from '@core/components/mui/IconButton'
import ModalForm from './ModalForm'

export default function TableServiceType() {
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn
  const [sorting, setSorting] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  }) // State để lưu các hàng được chọn

  const axiosAuth = useAxiosAuth()

  const handleOpenCreate = () => {
    setMode('create')
    setOpen(true)
  }

  const handleSubmit = async (data: any) => {}

  const { data: dataServices = [], isLoading } = useQuery({
    queryKey: ['orderProxyStatic'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-service-types')

      return res.data.data
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 0
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      // case '':
      //   return <Chip label='Chờ xử lý' size='small' icon={<BadgeAlert />} color='warning' />
      case 'active':
        return <Chip label='ACTIVE' size='small' icon={<BadgeCheck />} color='success' />
      case 'inactive':
        return <Chip label='INACTIVE' size='small' icon={<BadgeMinus />} color='error' />
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 20
      },
      {
        header: 'Name',
        cell: ({ row }: { row: any }) => (
          <div>
            <div className='font-bold'>{row.original?.name}</div>
          </div>
        ),
        size: 200
      },
      {
        header: 'Giá vốn',
        cell: ({ row }: { row: any }) => {
          return new Intl.NumberFormat('vi-VN').format(row.original.cost_price) + ' đ'
        },
        size: 100
      },
      {
        header: 'Giá bán',
        cell: ({ row }: { row: any }) => {
          return new Intl.NumberFormat('vi-VN').format(row.original.price) + ' đ'
        },
        size: 100
      },
      {
        header: 'Trạng thái',
        cell: ({ row }: { row: any }) => {
          return getStatusBadge(row.original.status)
        },
        size: 100
      },
      {
        header: 'Đối tác',
        cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div className='font-bold'>{row.original?.partner?.title}</div>
            </div>
          )
        },
        size: 100
      },
      {
        header: 'Type',
        cell: ({ row }: { row: any }) => {
          return (
            <div>
              <div className='font-bold'>{row.original?.type}</div>
            </div>
          )
        },
        size: 100
      },
      {
        header: 'Action',
        cell: ({ row }: { row: any }) => {
          return (
            <div className='flex gap-2'>
              <CustomIconButton aria-label='capture screenshot' color='info' variant='tonal'>
                <SquarePen size={16} />
              </CustomIconButton>

              <CustomIconButton aria-label='capture screenshot' color='info' variant='tonal'>
                <Copy size={16} />
              </CustomIconButton>

              <CustomIconButton aria-label='capture screenshot' color='error' variant='tonal'>
                <Trash2 size={16} />
              </CustomIconButton>
            </div>
          )
        },
        size: 100
      }
    ],
    []
  )

  const table = useReactTable({
    data: dataServices,
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
              <div className='flex justify-between align-middle w-full'>
                <h5 className='mb-0 font-semibold'>Danh sách dịch vụ</h5>
              </div>
            </div>

            <div className='header-right'>
              <Button
                onClick={handleOpenCreate}
                variant='contained'
                color='primary'
                className='text-white'
                size='sm'
                startIcon={<i className='tabler-trash' />}
              >
                Thêm dịch vụ
              </Button>
            </div>
          </div>
          {/* Table */}
          <div className='table-wrapper'>
            <table className='data-table' style={isLoading || dataServices.length === 0 ? { height: '100%' } : {}}>
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

      <ModalForm open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} mode={mode} />
    </>
  )
}
