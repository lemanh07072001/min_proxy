'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'

import { Clock3, Package } from 'lucide-react'

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

import useAxiosAuth from '@/hooks/useAxiosAuth'
import { formatDateTimeLocal } from '@/utils/formatDate'

interface OrderHistoryTableProps {
  filterEmail?: string | null
  dictionary: any
}

export default function OrderHistoryTable({ filterEmail, dictionary }: OrderHistoryTableProps) {
  const t = dictionary.affiliatePage
  const [columnFilters, setColumnFilters] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  const axiosAuth = useAxiosAuth()

  const { data: orderData, isLoading } = useQuery({
    queryKey: ['order-history-affiliate', filterEmail],
    queryFn: async () => {
      // Backend uses user_id instead of email
      const response = await axiosAuth.get('/order-history-affiliate')

      return response.data
    }
  })

  // Filter data by email if filterEmail is provided
  const filteredData = useMemo(() => {
    if (!orderData) return []
    if (!filterEmail) return orderData

    return orderData.filter((order: any) => order.customer_email === filterEmail)
  }, [orderData, filterEmail])

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip label={t.orderHistory.status.completed} size='small' color='success' />
      case 'partial_complete':
        return <Chip label={t.orderHistory.status.partialComplete} size='small' color='success' variant='outlined' />
      case 'full_complete':
        return <Chip label={t.orderHistory.status.fullComplete} size='small' color='success' />
      case 'in_use':
        return <Chip label={t.orderHistory.status.inUse} size='small' color='info' />
      case 'pending':
        return <Chip label={t.orderHistory.status.pending} size='small' color='warning' />
      case 'cancelled':
        return <Chip label={t.orderHistory.status.cancelled} size='small' color='error' />
      case 'expired':
        return <Chip label={t.orderHistory.status.expired} size='small' color='default' />
      default:
        return <Chip label={t.orderHistory.status.unknown} size='small' color='default' />
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'created_at',
        header: t.orderHistory.columns.orderDate,
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
        accessorKey: 'order_id',
        header: t.orderHistory.columns.orderId,
        cell: ({ row }) => {
          return <span className='font-mono text-sm'>#{row.original.order_id}</span>
        },
        size: 150
      },
      {
        header: t.orderHistory.columns.orderValue,
        cell: ({ row }) => {
          return (
            <span className='text-blue-600 font-semibold'>
              {new Intl.NumberFormat('vi-VN').format(row.original.order_value) + ' đ'}
            </span>
          )
        },
        size: 150
      },
      {
        header: t.orderHistory.columns.commission,
        cell: ({ row }) => {
          const commission = (row.original.order_value * 10) / 100

          return (
            <span className='text-green-600 font-semibold'>
              {new Intl.NumberFormat('vi-VN').format(commission) + ' đ'}
            </span>
          )
        },
        size: 150
      },
      {
        header: t.orderHistory.columns.status,
        cell: ({ row }) => {
          return getStatusChip(row.original?.status)
        },
        size: 150
      },
      {
        header: t.orderHistory.columns.paymentStatus,
        cell: ({ row }) => {
          const isPaid = row.original?.is_payment_affiliate === 1

          return (
            <Chip
              label={isPaid ? t.orderHistory.paymentStatus.paid : t.orderHistory.paymentStatus.unpaid}
              size='small'
              color={isPaid ? 'success' : 'warning'}
              variant={isPaid ? 'filled' : 'outlined'}
            />
          )
        },
        size: 150
      }
    ],
    [t]
  )

  const table = useReactTable({
    data: filteredData ?? [],
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
      {/* Table */}
      <div className='table-wrapper'>
        <table className='data-table' style={isLoading || filteredData?.length === 0 ? { height: '100%' } : {}}>
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
                    <p className='loading-text'>{t.loading}</p>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='py-10 text-center'>
                  <div className='flex flex-col items-center justify-center'>
                    <Image src='/images/no-data.png' alt='No data' width={160} height={160} />
                    <p className='mt-4 text-gray-500'>{t.noData}</p>
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
