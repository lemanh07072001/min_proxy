'use client'

import { useMemo, useState } from 'react'

import { headers } from 'next/headers'

import { TriangleAlert, Copy, CircleQuestionMark, BadgeCheck, BadgeMinus, Download, Clock3, Clock } from 'lucide-react'

import Button from '@mui/material/Button'

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

import './styles.css'
import Pagination from '@mui/material/Pagination'

import CustomIconButton from '@core/components/mui/IconButton'
import { useCopy } from '@/app/hooks/useCopy'
import { formatDateTimeLocal } from '@/utils/formatDate'

export default function OrderRotatingProxyPage({ data }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn
  const [sorting, setSorting] = useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const dataOrder = useMemo(() => data, [data])

  const [, copy] = useCopy();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip label='Đang hoạt động' size='small' icon={<BadgeCheck />} color='success' />
      case 'INACTIVE':
        return <Chip label='Hết hạn' size='small' icon={<TriangleAlert />} color='error' />
      case 'suspended':
        return <Chip label='Tạm dừng' size='small' icon={<BadgeMinus />} color='warning' />
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }


  const columns = useMemo(
    () => [
      {
        id: 'select', // ID của cột checkbox
        header: ({ table }) => (
          <input
            type='checkbox'
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type='checkbox'
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        )
      },
      {
        accessorKey: 'id',
        header: 'ID'
      },
      {
        accessorKey: 'provider',
        header: 'Nhà mạng',
        cell: ({ row }) => {
          const location = row.original.proxys.location;
          return <span className='text-red'>{location}</span>
        }
      },
      {
        accessorKey: 'proxy',
        header: 'Proxy',
        cell: ({ row }) => {
          const http = row.original.proxys.http;
          return (
            <div className='proxy-cell'>
              <span className='proxy-label'>{http}</span>
              <button className='icon-button' onClick={()=>copy(http)}>
                <Copy size={14} />
              </button>
            </div>
          )
        }
      },
      {
        accessorKey: 'protocol',
        header: 'Loại',
        cell: ({ row }) => {
          const keys = Object.keys(row.original.proxys);

          return (
            <div className="font-bold">
              {keys[0].toUpperCase()}
            </div>
          )
        }
      },
      {
        accessorKey: 'buyDate',
        header: 'Ngày mua',
        cell: ({ row }) => {
          return (
            <>
              <div className="d-flex align-items-center  gap-1 ">
                <Clock3  size={14} />
                <div style={{marginTop:'2px'}}>{formatDateTimeLocal(row.original.buy_at)}</div>
              </div>
            </>
          )
        }
      },
      {
        accessorKey: 'expiryDate',
        header: 'Ngày hết hạn',
        cell: ({ row }) => {
          return (
            <>
              <div className="d-flex align-items-center  gap-1 ">
                <Clock size={14} />
                <div style={{marginTop:'2px'}}>{formatDateTimeLocal(row.original.expired_at)}</div>
              </div>
            </>
          )
        }
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
          return getStatusBadge(row.original.status)
        }
      }
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      pagination,
      columnFilters,
      sorting,
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
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min(startRow + pageSize - 1, totalRows);

  return (
    <>
      <div className='orders-content'>
        {/* Toolbar */}

        {/* Proxy Table */}
        <div className='table-container'>
          <div className='table-toolbar'>
            {/* Download */}
            <Button variant='outlined' startIcon={<Download size={16} />}>
              Download
            </Button>

            {/* Copy all */}
            <CustomIconButton aria-label='capture screenshot' variant='outlined'>
              <Copy size={16} />
            </CustomIconButton>
          </div>

          <div className='table-container'>
            {/* Table */}
            <div className='table-wrapper'>
              <table className='data-table'>
                <thead className='table-header'>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th className='table-header th' key={header.id}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr className='table-row' key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td className='table-cell' key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
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
                          table.setPageSize(Number(e.target.value));
                        }}
                        className='page-size-select'>
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
                  <Pagination count={table.getPageCount()}
                              shape='rounded'
                              variant='outlined'
                              color='primary'
                              page={table.getState().pagination.pageIndex + 1}
                              onChange={(event, page) => {
                                table.setPageIndex(page - 1);
                              }}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
