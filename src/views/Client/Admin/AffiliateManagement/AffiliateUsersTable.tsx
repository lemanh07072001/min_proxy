'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'

import { Tooltip } from '@mui/material'
import { Eye, Clock3, User, Mail, DollarSign, Users, ShoppingCart } from 'lucide-react'

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

import useAxiosAuth from '@/hooks/useAxiosAuth'
import { formatDateTimeLocal } from '@/utils/formatDate'

interface AffiliateUsersTableProps {
  dictionary: any
}

export default function AffiliateUsersTable({ dictionary }: AffiliateUsersTableProps) {
  const t = dictionary.adminAffiliatePage?.usersTable || {}
  const [columnFilters, setColumnFilters] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const axiosAuth = useAxiosAuth()

  const { data: affiliateUsers, isLoading } = useQuery({
    queryKey: ['admin-affiliate-users'],
    queryFn: async () => {
      const response = await axiosAuth.get('/admin/affiliate-users')
      return response.data
    }
  })

  const columns = useMemo(
    () => [
      {
        accessorKey: 'created_at',
        header: t.columnJoinDate || 'Ngày tham gia',
        cell: ({ row }) => {
          return (
            <div className='d-flex align-items-center gap-1'>
              <Clock3 size={14} />
              <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original?.created_at)}</div>
            </div>
          )
        },
        size: 180
      },
      {
        accessorKey: 'user',
        header: t.columnUser || 'Người dùng',
        cell: ({ row }) => {
          return (
            <div className='flex flex-col'>
              <div className='flex items-center gap-1'>
                <User size={14} />
                <span className='font-medium'>{row.original?.name || 'N/A'}</span>
              </div>
              <div className='flex items-center gap-1 text-xs text-gray-500'>
                <Mail size={12} />
                <span>{row.original?.email}</span>
              </div>
            </div>
          )
        },
        size: 250
      },
      {
        header: t.columnReferrals || 'Người giới thiệu',
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-1'>
              <Users size={14} className='text-blue-600' />
              <span className='font-semibold'>{row.original.total_referrals || 0}</span>
            </div>
          )
        },
        size: 150
      },
      {
        header: t.columnOrders || 'Tổng đơn hàng',
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-1'>
              <ShoppingCart size={14} className='text-purple-600' />
              <span className='font-semibold'>{row.original.total_orders || 0}</span>
            </div>
          )
        },
        size: 150
      },
      {
        header: t.columnRevenue || 'Doanh thu tạo ra',
        cell: ({ row }) => {
          return (
            <span className='text-purple-600 font-semibold'>
              {new Intl.NumberFormat('vi-VN').format(row.original.total_revenue || 0) + ' đ'}
            </span>
          )
        },
        size: 180
      },
      {
        header: t.columnCommission || 'Hoa hồng đã nhận',
        cell: ({ row }) => {
          return (
            <span className='text-green-600 font-semibold flex items-center gap-1'>
              <DollarSign size={14} />
              {new Intl.NumberFormat('vi-VN').format(row.original.total_commission || 0) + ' đ'}
            </span>
          )
        },
        size: 180
      },
      {
        header: t.columnPending || 'Hoa hồng chờ',
        cell: ({ row }) => {
          return (
            <span className='text-orange-600 font-semibold'>
              {new Intl.NumberFormat('vi-VN').format(row.original.pending_commission || 0) + ' đ'}
            </span>
          )
        },
        size: 150
      },
      {
        header: t.columnActions || 'Thao tác',
        cell: ({ row }) => {
          return (
            <div className='flex gap-2 items-center justify-center'>
              <Tooltip title={t.tooltipViewDetails || 'Xem chi tiết'} arrow placement='top'>
                <button className='p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-all duration-200 hover:scale-110 active:scale-95'>
                  <Eye size={16} />
                </button>
              </Tooltip>
            </div>
          )
        },
        size: 100
      }
    ],
    [t]
  )

  const table = useReactTable({
    data: affiliateUsers ?? [],
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

  return (
    <div className='table-container' style={{ boxShadow: 'none' }}>
      {/* Table */}
      <div className='table-wrapper'>
        <table
          className='data-table'
          style={isLoading || affiliateUsers?.length === 0 ? { height: '100%' } : {}}
        >
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
                    <p className='loading-text'>{t.loading || 'Đang tải dữ liệu...'}</p>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='py-10 text-center'>
                  <div className='flex flex-col items-center justify-center'>
                    <Image src='/images/no-data.png' alt='No data' width={160} height={160} />
                    <p className='mt-4 text-gray-500'>{t.noData || 'Không có dữ liệu'}</p>
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
