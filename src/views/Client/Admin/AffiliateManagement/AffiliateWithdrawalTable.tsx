'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'

import { Tooltip } from '@mui/material'
import { Check, X, Eye, Clock3, User, Mail, DollarSign } from 'lucide-react'

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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Chip from '@mui/material/Chip'
import { toast } from 'react-toastify'

import useAxiosAuth from '@/hooks/useAxiosAuth'
import { formatDateTimeLocal } from '@/utils/formatDate'

interface AffiliateWithdrawalTableProps {
  dictionary: any
}

export default function AffiliateWithdrawalTable({ dictionary }: AffiliateWithdrawalTableProps) {
  const t = dictionary.adminAffiliatePage?.withdrawalTable || {}
  const [columnFilters, setColumnFilters] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  const { data: withdrawalResponse, isLoading } = useQuery({
    queryKey: ['admin-affiliate-withdrawals'],
    queryFn: async () => {
      const response = await axiosAuth.get('/admin/withdrawal-requests')

      return response.data
    }
  })

  const withdrawalRequests = withdrawalResponse?.data || []

  // Approve withdrawal mutation
  const approveMutation = useMutation({
    mutationFn: async (withdrawalId: number) => {
      const response = await axiosAuth.post(`/admin/affiliate-withdrawals/${withdrawalId}/approve`)

      return response.data
    },
    onSuccess: () => {
      toast.success(t.approveSuccess || 'Đã duyệt yêu cầu rút tiền')
      queryClient.invalidateQueries({ queryKey: ['admin-affiliate-withdrawals'] })
      queryClient.invalidateQueries({ queryKey: ['admin-affiliate-stats'] })
    },
    onError: () => {
      toast.error(t.approveError || 'Lỗi khi duyệt yêu cầu')
    }
  })

  // Reject withdrawal mutation
  const rejectMutation = useMutation({
    mutationFn: async (withdrawalId: number) => {
      const response = await axiosAuth.post(`/admin/affiliate-withdrawals/${withdrawalId}/reject`)

      return response.data
    },
    onSuccess: () => {
      toast.success(t.rejectSuccess || 'Đã từ chối yêu cầu rút tiền')
      queryClient.invalidateQueries({ queryKey: ['admin-affiliate-withdrawals'] })
      queryClient.invalidateQueries({ queryKey: ['admin-affiliate-stats'] })
    },
    onError: () => {
      toast.error(t.rejectError || 'Lỗi khi từ chối yêu cầu')
    }
  })

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label={t.statusPending || 'Chờ duyệt'} size='small' color='warning' />
      case 'approved':
        return <Chip label={t.statusApproved || 'Đã duyệt'} size='small' color='success' />
      case 'rejected':
        return <Chip label={t.statusRejected || 'Đã từ chối'} size='small' color='error' />
      case 'completed':
        return <Chip label={t.statusCompleted || 'Hoàn thành'} size='small' color='info' />
      default:
        return <Chip label={t.statusUnknown || 'Không xác định'} size='small' color='default' />
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'created_at',
        header: t.columnDate || 'Ngày yêu cầu',
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
                <span className='font-medium'>{row.original?.user_name || 'N/A'}</span>
              </div>
              <div className='flex items-center gap-1 text-xs text-gray-500'>
                <Mail size={12} />
                <span>{row.original?.user_email}</span>
              </div>
            </div>
          )
        },
        size: 250
      },
      {
        header: t.columnAmount || 'Số tiền',
        cell: ({ row }) => {
          return (
            <span className='text-blue-600 font-semibold flex items-center gap-1'>
              <DollarSign size={14} />
              {new Intl.NumberFormat('vi-VN').format(row.original.amount) + ' đ'}
            </span>
          )
        },
        size: 150
      },
      {
        header: t.columnPercent || 'Tỷ lệ HH',
        cell: ({ row }) => {
          return <span className='text-blue-600 font-semibold'>{row.original.affiliate_percent}%</span>
        },
        size: 100
      },
      {
        header: t.columnReferrals || 'Người giới thiệu',
        cell: ({ row }) => {
          return <span className='font-medium'>{row.original.referred_users_count || 0}</span>
        },
        size: 120
      },
      {
        header: t.columnPendingOrders || 'Đơn chờ',
        cell: ({ row }) => {
          return (
            <div className='text-sm'>
              <div>
                <span className='font-medium'>{row.original.pending_orders_count || 0}</span> {t.orders || 'đơn'}
              </div>
              <div className='text-gray-500 text-xs'>
                {new Intl.NumberFormat('vi-VN').format(row.original.total_pending_order_amount || 0) + ' đ'}
              </div>
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
        size: 130
      },
      {
        header: t.columnActions || 'Thao tác',
        cell: ({ row }) => {
          const isPending = row.original?.status === 'pending'

          return (
            <div className='flex gap-2 items-center justify-center'>
              {isPending && (
                <>
                  <Tooltip title={t.tooltipApprove || 'Duyệt yêu cầu'} arrow placement='top'>
                    <button
                      className='p-2 text-white bg-green-500 hover:bg-green-600 rounded-md transition-all duration-200 hover:scale-110 active:scale-95'
                      onClick={() => approveMutation.mutate(row.original.id)}
                      disabled={approveMutation.isPending}
                    >
                      <Check size={16} />
                    </button>
                  </Tooltip>
                  <Tooltip title={t.tooltipReject || 'Từ chối yêu cầu'} arrow placement='top'>
                    <button
                      className='p-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-all duration-200 hover:scale-110 active:scale-95'
                      onClick={() => rejectMutation.mutate(row.original.id)}
                      disabled={rejectMutation.isPending}
                    >
                      <X size={16} />
                    </button>
                  </Tooltip>
                </>
              )}
              <Tooltip title={t.tooltipViewDetails || 'Xem chi tiết'} arrow placement='top'>
                <button className='p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-all duration-200 hover:scale-110 active:scale-95'>
                  <Eye size={16} />
                </button>
              </Tooltip>
            </div>
          )
        },
        size: 150
      }
    ],
    [t, approveMutation, rejectMutation]
  )

  const table = useReactTable({
    data: withdrawalRequests ?? [],
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
          style={isLoading || withdrawalRequests?.length === 0 ? { height: '100%' } : {}}
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
