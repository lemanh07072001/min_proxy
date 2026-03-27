'use client'

import { useEffect, useMemo, useState } from 'react'

import Image from 'next/image'

import {
  List,
  Clock3,
  Clock,
  Eye,
  Search,
  Loader2,
  X
} from 'lucide-react'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel
} from '@tanstack/react-table'

import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Pagination from '@mui/material/Pagination'

import { useQueryClient } from '@tanstack/react-query'

import CustomTextField from '@core/components/mui/TextField'
import CustomIconButton from '@core/components/mui/IconButton'

import { formatDateTimeLocal } from '@/utils/formatDate'
import { useHistoryOrders, PENDING_STATUSES } from '@/hooks/apis/useHistoryOrders'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/constants/orderStatus'
import OrderDetail from './OrderDetail'

const inputSx = {
  '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', minHeight: '36px' },
  '& .MuiSelect-select': { paddingBlock: '7px' }
}

export default function HistoryOrderPage() {
  const [open, setOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [searchText, setSearchText] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const queryClient = useQueryClient()

  const {
    data: dataOrders = [],
    isLoading,
    isFetching,
    refetch,
    dataUpdatedAt
  } = useHistoryOrders()

  const handleSearch = () => {
    setAppliedSearch(searchText.trim())
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  // Client-side filtering
  const filteredOrders = useMemo(() => {
    let result = dataOrders

    if (appliedSearch.trim()) {
      const search = appliedSearch.trim().toLowerCase()

      result = result.filter((order: any) =>
        order.order_code?.toLowerCase().includes(search) ||
        order.service_name?.toLowerCase().includes(search)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((order: any) => String(order.status) === statusFilter)
    }

    return result
  }, [dataOrders, appliedSearch, statusFilter])

  // Đếm đơn đang chờ xử lý
  const pendingOrders = useMemo(() => {
    return dataOrders.filter((o: any) => PENDING_STATUSES.includes(Number(o.status)))
  }, [dataOrders])

  const hasPendingOrders = pendingOrders.length > 0

  // Tính thời gian còn lại
  const getTimeRemaining = (expiredAt: string, status: string) => {
    if (String(status) !== '2' && String(status) !== '3') return null

    const now = new Date()
    const expired = new Date(expiredAt)
    const diff = expired.getTime() - now.getTime()

    if (diff <= 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `còn ${days}d ${hours}h`

    return `còn ${hours}h`
  }

  const getStatusBadge = (status: string) => {
    const label = ORDER_STATUS_LABELS[status] || 'Không xác định'
    const color = (ORDER_STATUS_COLORS[status] || 'default') as any

    return <Chip label={label} size='small' color={color} />
  }

  const fmtVND = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ'

  const columns = useMemo(
    () => [
      {
        header: '',
        id: 'actions',
        size: 45,
        cell: ({ row }: { row: any }) => (
          <CustomIconButton
            aria-label='Xem chi tiết'
            color='info'
            variant='tonal'
            size='small'
            onClick={() => {
              setSelectedOrder(row.original)
              setOpen(true)
            }}
          >
            <Eye size={16} />
          </CustomIconButton>
        )
      },
      {
        accessorKey: 'order_code',
        header: 'Đơn hàng',
        minSize: 160,
        cell: ({ row }: { row: any }) => {
          const o = row.original
          const qty = o.quantity
          const delivered = o.delivered_quantity
          const isMissing = delivered != null && delivered !== qty

          return (
            <div style={{ lineHeight: 1.4 }}>
              <div style={{ fontWeight: 600, fontSize: '12px' }}>{o.order_code}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                {fmtVND(o.total_amount)} · {isMissing ? <span style={{ color: '#EF4444' }}>{delivered}/{qty}</span> : `${qty}`} sản phẩm
              </div>
            </div>
          )
        }
      },
      {
        header: 'Sản phẩm',
        minSize: 170,
        cell: ({ row }: { row: any }) => {
          const o = row.original

          return (
            <div style={{ lineHeight: 1.4 }}>
              <div style={{ fontWeight: 600, fontSize: '12px' }}>{o.service_name || '-'}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
                #{o.service_id} · {o.service_code || o.proxy_type || '-'}
              </div>
            </div>
          )
        }
      },
      {
        header: 'Trạng thái',
        size: 130,
        cell: ({ row }: { row: any }) => {
          const status = String(row.original.status)
          const isPending = PENDING_STATUSES.includes(Number(status))

          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {getStatusBadge(status)}
              {isPending && (
                <Loader2
                  size={14}
                  color='#3B82F6'
                  style={{ animation: 'spin 1s linear infinite' }}
                />
              )}
            </div>
          )
        }
      },
      {
        header: 'Thời hạn',
        size: 160,
        cell: ({ row }: { row: any }) => {
          const o = row.original
          const remaining = getTimeRemaining(o.expired_at, o.status)

          return (
            <div style={{ lineHeight: 1.5, fontSize: '12px', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock3 size={11} />
                {o.buy_at ? formatDateTimeLocal(o.buy_at) : '-'}
              </div>
              {o.expired_at && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} />
                  {formatDateTimeLocal(o.expired_at)}
                </div>
              )}
              {remaining && (
                <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 500 }}>{remaining}</div>
              )}
            </div>
          )
        }
      },
    ],
    []
  )

  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = filteredOrders.length
  const startRow = totalRows ? pageIndex * pageSize + 1 : 0
  const endRow = Math.min(startRow + pageSize - 1, totalRows)


  return (
    <>
      <div className='orders-content'>
        <div className='table-container'>
          {/* Toolbar */}
          <div className='table-toolbar' style={{ flexDirection: 'column', alignItems: 'stretch', gap: 0, padding: 0 }}>
            {/* Row 1: Title + Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
              <div className='header-left'>
                <div className='page-icon'>
                  <List size={17} />
                </div>
                <h5 className='mb-0 font-semibold'>Đơn hàng của tôi</h5>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <TextField
                  size='small'
                  placeholder='Tìm mã đơn, dịch vụ...'
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSearch() }}
                  sx={{ width: 220, '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Search size={15} color='#94a3b8' />
                      </InputAdornment>
                    ),
                    endAdornment: searchText ? (
                      <InputAdornment position='end'>
                        <IconButton size='small' onClick={() => { setSearchText(''); setAppliedSearch(''); setPagination(prev => ({ ...prev, pageIndex: 0 })) }} sx={{ p: '2px' }}>
                          <X size={14} />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }}
                />
                <CustomTextField
                  select
                  size='small'
                  value={statusFilter}
                  onChange={(e: any) => {
                    setStatusFilter(e.target.value)
                    setPagination(prev => ({ ...prev, pageIndex: 0 }))
                  }}
                  sx={{ minWidth: 155, ...inputSx }}
                  slotProps={{ select: { displayEmpty: true } }}
                >
                  <MenuItem value='all'>Tất cả trạng thái</MenuItem>
                  {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </CustomTextField>
                <Button
                  variant='contained'
                  size='small'
                  onClick={handleSearch}
                  sx={{ height: 36, borderRadius: '8px', fontSize: '13px', textTransform: 'none', whiteSpace: 'nowrap', px: 2 }}
                >
                  Tìm kiếm
                </Button>
              </div>
            </div>

            {/* Pending orders banner */}
            {hasPendingOrders && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderBottom: '1px solid #bfdbfe'
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: '#3B82F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Loader2 size={16} color='#fff' style={{ animation: 'spin 1s linear infinite' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af' }}>
                    {pendingOrders.length} đơn hàng đang chờ xử lý
                  </div>
                </div>
                {isFetching && (
                  <div style={{ width: '100%', maxWidth: 120 }}>
                    <LinearProgress
                      sx={{
                        height: 3, borderRadius: 2,
                        backgroundColor: '#bfdbfe',
                        '& .MuiLinearProgress-bar': { backgroundColor: '#3B82F6' }
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Table */}
          <div className='table-wrapper' style={{ overflowX: 'auto' }}>
            <table className='data-table' style={{ minWidth: '1225px', ...(isLoading || filteredOrders.length === 0 ? { height: '100%' } : {}) }}>
              <thead className='table-header'>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th style={{ minWidth: header.getSize(), width: header.getSize() }} className='table-header th' key={header.id}>
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
                          <span></span><span></span><span></span>
                        </div>
                        <p className='loading-text'>Đang tải dữ liệu...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className='py-10 text-center'>
                      <div className='flex flex-col items-center justify-center'>
                        <Image src='/images/no-data.png' alt='No data' width={160} height={160} />
                        <p className='mt-4' style={{ color: '#94a3b8' }}>Không có đơn hàng</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => {
                    const isPending = PENDING_STATUSES.includes(Number(row.original.status))

                    return (
                      <tr
                        className='table-row'
                        key={row.id}
                        style={isPending ? {
                          background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
                          borderLeft: '3px solid #f59e0b'
                        } : undefined}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td className='table-cell' key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='pagination-container'>
            <div className='pagination-wrapper'>
              <div className='pagination-info'>
                <div className='page-size-select'>
                  <span className='text-sm text-gray'>Hiển thị</span>
                  <div className='page-size-select-wrapper'>
                    <select
                      value={table.getState().pagination.pageSize}
                      onChange={e => table.setPageSize(Number(e.target.value))}
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
                <div>
                  {totalRows > 0 ? (
                    <span>{startRow} - {endRow} của {totalRows} đơn</span>
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
                  onChange={(_, page) => table.setPageIndex(page - 1)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <OrderDetail
          open={open}
          onClose={() => {
            setOpen(false)
            setSelectedOrder(null)
          }}
          order={selectedOrder}
        />
      )}
    </>
  )
}
