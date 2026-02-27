'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'

import { Dialog, DialogTitle, DialogContent, IconButton, Chip } from '@mui/material'
import { X, User, Mail, ShoppingCart, DollarSign, Clock3, Calendar } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState
} from '@tanstack/react-table'
import Pagination from '@mui/material/Pagination'

import useAxiosAuth from '@/hooks/useAxiosAuth'
import { formatDateTimeLocal } from '@/utils/formatDate'

interface AffiliateOrdersModalProps {
  open: boolean
  onClose: () => void
  affiliateId: number | null
  dictionary: any
}

export default function AffiliateOrdersModal({
  open,
  onClose,
  affiliateId,
  dictionary
}: AffiliateOrdersModalProps) {
  const t = dictionary.adminAffiliatePage?.ordersModal || {}
  const axiosAuth = useAxiosAuth()

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['admin-affiliate-orders', affiliateId],
    queryFn: async () => {
      if (!affiliateId) return null
      const response = await axiosAuth.get(`/admin/affiliate-orders/${affiliateId}`)

      return response.data
    },
    enabled: !!affiliateId && open,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 1,
    gcTime: 0 // Don't cache the data after modal is closed
  })

  const orders = ordersResponse?.data?.orders || []
  const affiliateUser = ordersResponse?.data?.affiliate_user || null
  const affiliatePercent = ordersResponse?.data?.affiliate_percent || 0

  const getStatusChip = (status: number) => {
    switch (Number(status)) {
      case 0:
        return <Chip label={t.statusPending || 'Đang chờ'} size='small' color='warning' />
      case 1:
        return <Chip label={t.statusProcessing || 'Đang xử lý'} size='small' color='info' />
      case 2:
        return <Chip label={t.statusCompleted || 'Hoàn thành'} size='small' color='success' />
      case 3:
        return <Chip label={t.statusPartialComplete || 'Hoàn thành 1 phần'} size='small' color='success' />
      case 4:
        return <Chip label={t.statusFullComplete || 'Hoàn thành toàn bộ'} size='small' color='success' />
      case 5:
        return <Chip label={t.statusExpired || 'Hết hạn'} size='small' color='error' />
      case 6:
        return <Chip label={t.statusCancelled || 'Đã hủy'} size='small' color='error' />
      default:
        return <Chip label={`${t.statusUnknown || 'Không xác định'} (${status})`} size='small' color='default' />
    }
  }

  const getPaymentChip = (isPayment: number) => {
    return isPayment === 1 ? (
      <Chip label={t.paid || 'Đã thanh toán'} size='small' color='success' />
    ) : (
      <Chip label={t.unpaid || 'Chưa thanh toán'} size='small' color='warning' />
    )
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'order_code',
        header: t.columnOrderCode || 'Mã đơn',
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-1'>
              <ShoppingCart size={14} />
              <span className='font-medium'>{row.original?.order_code}</span>
            </div>
          )
        },
        size: 150
      },
      {
        accessorKey: 'user',
        header: t.columnCustomer || 'Khách hàng',
        cell: ({ row }) => {
          return (
            <div className='flex flex-col'>
              <div className='flex items-center gap-1 text-xs'>
                <Mail size={12} />
                <span>{row.original?.user?.email}</span>
              </div>
            </div>
          )
        },
        size: 200
      },
      {
        header: t.columnAmount || 'Giá trị đơn',
        cell: ({ row }) => {
          return (
            <span className='text-blue-600 font-semibold'>
              {new Intl.NumberFormat('vi-VN').format(row.original.total_amount || 0) + ' đ'}
            </span>
          )
        },
        size: 150
      },
      {
        header: t.columnCommission || 'Hoa hồng',
        cell: ({ row }) => {
          const commission = (row.original.total_amount * affiliatePercent) / 100

          return (
            <span className='text-green-600 font-semibold flex items-center gap-1'>
              <DollarSign size={14} />
              {new Intl.NumberFormat('vi-VN').format(commission) + ' đ'}
            </span>
          )
        },
        size: 150
      },
      {
        header: t.columnExpiredAt || 'Hết hạn',
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-1 text-sm'>
              <Calendar size={14} />
              {formatDateTimeLocal(row.original?.expired_at)}
            </div>
          )
        },
        size: 180
      },
      {
        header: t.columnStatus || 'Trạng thái',
        cell: ({ row }) => {
          return getStatusChip(row.original?.status)
        },
        size: 120
      },
      {
        header: t.columnPaymentStatus || 'Thanh toán HH',
        cell: ({ row }) => {
          return getPaymentChip(row.original?.is_payment_affiliate)
        },
        size: 140
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [affiliatePercent]
  )

  const table = useReactTable({
    data: orders,
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

  const totalRevenue = orders.reduce((sum: number, order: any) => {
    return sum + (Number(order.total_amount) || 0)
  }, 0)

  const totalCommission = orders.reduce((sum: number, order: any) => {
    return sum + ((Number(order.total_amount) || 0) * affiliatePercent) / 100
  }, 0)

  if (!open) {
    return null
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xl' fullWidth>
      <DialogTitle>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-bold'>{t.title || 'Chi tiết đơn hàng Affiliate'}</h2>
            {affiliateUser && (
              <div className='flex items-center gap-4 mt-2 text-sm text-gray-600'>
                <div className='flex items-center gap-1'>
                  <User size={14} />
                  <span>{affiliateUser.name}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Mail size={14} />
                  <span>{affiliateUser.email}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <DollarSign size={14} />
                  <span>
                    {t.commissionRate || 'Hoa hồng'}: {affiliatePercent}%
                  </span>
                </div>
              </div>
            )}
          </div>
          <IconButton onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent>
        {/* Summary Stats */}
        <div className='grid grid-cols-3 gap-4 mb-6'>
          <div className='bg-blue-50 p-4 rounded-lg'>
            <p className='text-sm text-gray-600'>{t.totalOrders || 'Tổng đơn hàng'}</p>
            <p className='text-2xl font-bold text-blue-600'>{orders.length}</p>
          </div>
          <div className='bg-green-50 p-4 rounded-lg'>
            <p className='text-sm text-gray-600'>{t.totalRevenue || 'Tổng doanh thu'}</p>
            <p className='text-2xl font-bold text-green-600'>
              {new Intl.NumberFormat('vi-VN').format(totalRevenue) + ' đ'}
            </p>
          </div>
          <div className='bg-purple-50 p-4 rounded-lg'>
            <p className='text-sm text-gray-600'>{t.totalCommission || 'Tổng hoa hồng'}</p>
            <p className='text-2xl font-bold text-purple-600'>
              {new Intl.NumberFormat('vi-VN').format(totalCommission) + ' đ'}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className='table-container' style={{ boxShadow: 'none' }}>
          <div className='table-wrapper'>
            <table className='data-table' style={isLoading || orders.length === 0 ? { height: '400px' } : {}}>
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
          {orders.length > 0 && (
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
