'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'

import { TriangleAlert, CircleQuestionMark, BadgeCheck, BadgeMinus, List } from 'lucide-react'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel // Thêm để lọc hàng đã chọn
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'

import Pagination from '@mui/material/Pagination'
import { useQuery } from '@tanstack/react-query'

import useAxiosAuth from '@/hocs/useAxiosAuth'
import { useCopy } from '@/app/hooks/useCopy'

export default function HistoryLoginPage() {
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn

  const axiosAuth = useAxiosAuth()
  const [, copy] = useCopy()

  const { data: dataOrders = [], isLoading } = useQuery({
    queryKey: ['getHistoryLogin'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-history-login')

      return res.data ?? []
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
      case 'pending':
        return <Chip label='Chờ xử lý' size='small' icon={<BadgeCheck />} color='warning' />
      case 'completed':
        return <Chip label='Hoàn thành' size='small' icon={<TriangleAlert />} color='success' />
      case 'expired':
        return <Chip label='Hết hạn' size='small' icon={<BadgeMinus />} color='error' />
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60
      },
      {
        accessorKey: 'content',
        header: 'Nội dung',
        size: 200
      },
      {
        header: 'device',
        accessorKey: 'device',
        
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
        cell: ({ row }) => {
          return getStatusBadge(row.original.status)
        },
        size: 150
      },
      {
        accessorKey: 'buy_at',
        header: 'Ngày mua',
        size: 200
      },
      {
        accessorKey: 'expired_at',
        header: 'Ngày hết hạn',
        size: 200
      },

    ],
    []
  )

  const table = useReactTable({
    data: dataOrders,
    columns,
    state: {
      rowSelection
    },
    enableRowSelection: true, // Bật tính năng chọn hàng
    onRowSelectionChange: setRowSelection, // Cập nhật state khi có thay đổi
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel() // Tùy chọn: cần thiết nếu có bộ lọc
  })

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
                    <select className='page-size-select'>
                      <option value='50'>50</option>
                      <option value='100'>100</option>
                      <option value='200'>200</option>
                    </select>
                    <div className='select-arrow'>
                      <svg className='h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                        <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                      </svg>
                    </div>
                  </div>
                </div>
                <span className='text-sm text-gray'>1 - 1 của 1 dòng hàng</span>
              </div>

              <div className='pagination-buttons'>
                <Pagination count={3} shape='rounded' variant='outlined' color='primary' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
