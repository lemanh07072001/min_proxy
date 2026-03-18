'use client'

import { useMemo, useState, useCallback } from 'react'

import Image from 'next/image'

import { useQueryClient } from '@tanstack/react-query'


import {
  List,
  Clock3,
  Search,
  Eye,
  XCircle,
  RefreshCw,
  Loader2,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  X,
  PlusCircle,
  RotateCcw
} from 'lucide-react'

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Pagination from '@mui/material/Pagination'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid2 from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'

import { formatDateTimeLocal } from '@/utils/formatDate'

import { useAdminOrders } from '@/hooks/apis/useOrderReport'
import { useCancelOrder, useResendOrder } from '@/hooks/apis/useOrders'
import { useProviders } from '@/hooks/apis/useProviders'
import { useRetryPartial, useRefundPartial, useRetryOrder } from '@/hooks/apis/useTickets'
import OrderDetailModal from '@/views/Client/Admin/TransactionHistory/OrderDetailModal'
import FillProxiesDialog from '@/views/Client/Admin/Orders/FillProxiesDialog'

const formatVND = (value: any) => new Intl.NumberFormat('vi-VN').format(Number(value) || 0) + 'đ'

const STATUS_CONFIG: Record<number, { label: string; color: string }> = {
  0: { label: 'Chờ xử lý', color: '#94A3B8' },
  1: { label: 'Đang xử lý', color: '#3B82F6' },
  2: { label: 'Đang dùng', color: '#22C55E' },
  3: { label: 'Thiếu proxy', color: '#F59E0B' },
  4: { label: 'Hết hạn', color: '#6366F1' },
  5: { label: 'Thất bại', color: '#EF4444' },
  6: { label: 'Hoàn 1 phần', color: '#F97316' },
  7: { label: 'Chờ hoàn tiền', color: '#A855F7' },
  8: { label: 'Đã hoàn toàn bộ', color: '#EC4899' },
  9: { label: 'Đang mua bù', color: '#14B8A6' },
  10: { label: 'Chờ nhà cung cấp', color: '#0EA5E9' }
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
        <div
          style={{
            width: 48, height: 48, borderRadius: 12,
            backgroundColor: color + '20',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}
        >
          <Icon size={24} color={color} />
        </div>
        <div>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>{title}</Typography>
          <Typography variant='h6' fontWeight={600}>{value}</Typography>
        </div>
      </CardContent>
    </Card>
  )
}

function toInputDate(ddmmyyyy: string) {
  const [d, m, y] = ddmmyyyy.split('-')


return `${y}-${m}-${d}`
}

function fromInputDate(yyyymmdd: string) {
  const [y, m, d] = yyyymmdd.split('-')


return `${d}-${m}-${y}`
}

function getDefaults() {
  const now = new Date()
  const start = new Date(now)

  start.setDate(start.getDate() - 30)

  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`


return { start: fmt(start), end: fmt(now) }
}

const inputSx = {
  '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', minHeight: '36px' },
  '& .MuiSelect-select': { paddingBlock: '7px' }
}

export default function AdminOrdersPage() {
  const queryClient = useQueryClient()
  const defaults = useMemo(() => getDefaults(), [])

  // Staged filter inputs
  const [searchInput, setSearchInput] = useState('')
  const [startInput, setStartInput] = useState(toInputDate(defaults.start))
  const [endInput, setEndInput] = useState(toInputDate(defaults.end))
  const [statusInput, setStatusInput] = useState<string>('')
  const [providerInput, setProviderInput] = useState<string>('')
  const [orderTypeInput, setOrderTypeInput] = useState<string>('')

  // Applied filters
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState(defaults.start)
  const [endDate, setEndDate] = useState(defaults.end)
  const [statusFilter, setStatusFilter] = useState<number | null>(null)
  const [providerFilter, setProviderFilter] = useState<number | null>(null)
  const [orderTypeFilter, setOrderTypeFilter] = useState<number | null>(null)
  const [displayPerPage, setDisplayPerPage] = useState(20)
  const [apiLimit, setApiLimit] = useState(100)
  const [apiLimitInput, setApiLimitInput] = useState('100')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<string>('desc')

  // Modals - dùng chung cho cả 2 tab
  const [orderDetailOpen, setOrderDetailOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<any>(null)
  const [resendDialogOpen, setResendDialogOpen] = useState(false)
  const [orderToResend, setOrderToResend] = useState<any>(null)

  // Partial orders state
  const [retryOrder, setRetryOrder] = useState<any>(null)
  const [retryFailedOrder, setRetryFailedOrder] = useState<any>(null)
  const [refundOrder, setRefundOrder] = useState<any>(null)
  const [fillProxiesOrder, setFillProxiesOrder] = useState<any>(null)

  // Data - Tab 0
  const { data: ordersData, isLoading, isFetching } = useAdminOrders(
    {
      start: startDate,
      end: endDate,
      page: 1,
      per_page: apiLimit,
      status: statusFilter,
      provider_id: providerFilter,
      order_type: orderTypeFilter,
      sort_by: sortBy,
      sort_order: sortOrder
    },
    true
  )

  const retryMutation = useRetryPartial()
  const retryFailedMutation = useRetryOrder()
  const refundMutation = useRefundPartial()

  const { data: providers = [] } = useProviders()
  const cancelMutation = useCancelOrder()
  const resendMutation = useResendOrder()

  const allOrders = useMemo(() => ordersData?.orders ?? [], [ordersData?.orders])

  // Client-side search filter (mã đơn, user)
  const orders = useMemo(() => {
    if (!searchQuery) return allOrders
    const q = searchQuery.toLowerCase()


return allOrders.filter(
      (o: any) =>
        o.order_code?.toLowerCase().includes(q) ||
        o.user_name?.toLowerCase().includes(q)
    )
  }, [allOrders, searchQuery])

  const serverPagination = ordersData?.pagination ?? { current_page: 1, total: 0, per_page: 100, last_page: 1 }

  // Helper tính summary từ mảng orders (dùng Number() để tránh string concatenation)
  const calcFromOrders = useCallback((arr: any[]) => ({
    total_orders: arr.length,
    total_amount: arr.reduce((s, o) => s + (Number(o.total_amount) || 0), 0),
    total_cost: arr.reduce((s, o) => s + (Number(o.total_cost) || 0), 0),
    profit: arr.reduce((s, o) => s + ((Number(o.total_amount) || 0) - (Number(o.total_cost) || 0)), 0),
  }), [])

  // Summary: BE aggregate ưu tiên, fallback sang tính từ loaded orders nếu BE thiếu field
  const summary = useMemo(() => {
    if (searchQuery) return calcFromOrders(orders)

    const s = ordersData?.summary

    if (!s) return { ...calcFromOrders(allOrders), total_orders: serverPagination.total || allOrders.length }

    const localFallback = calcFromOrders(allOrders)

    
return {
      total_orders: Number(s.total_orders) || serverPagination.total || allOrders.length,
      total_amount: s.total_amount != null ? Number(s.total_amount) : localFallback.total_amount,
      total_cost:   s.total_cost   != null ? Number(s.total_cost)   : localFallback.total_cost,
      profit:       s.profit       != null ? Number(s.profit)       : localFallback.profit,
    }
  }, [searchQuery, orders, ordersData?.summary, allOrders, serverPagination.total, calcFromOrders])

  // Handlers
  const handleApplyFilters = useCallback(() => {
    setStartDate(fromInputDate(startInput))
    setEndDate(fromInputDate(endInput))
    setStatusFilter(statusInput !== '' ? Number(statusInput) : null)
    setProviderFilter(providerInput !== '' ? Number(providerInput) : null)
    setOrderTypeFilter(orderTypeInput !== '' ? Number(orderTypeInput) : null)
    setSearchQuery(searchInput.trim())

    // Invalidate cache để luôn fetch data mới nhất khi click Tìm kiếm
    queryClient.invalidateQueries({ queryKey: ['adminOrders'] })
  }, [startInput, endInput, statusInput, providerInput, orderTypeInput, searchInput, queryClient])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleApplyFilters() },
    [handleApplyFilters]
  )

  const handleOpenDetail = useCallback((order: any) => {
    setSelectedOrder({ order })
    setOrderDetailOpen(true)
  }, [])

  const handleOpenCancel = useCallback((order: any) => {
    setOrderToCancel(order)
    setCancelDialogOpen(true)
  }, [])

  const handleConfirmCancel = useCallback(() => {
    if (!orderToCancel) return
    cancelMutation.mutate(orderToCancel.id, {
      onSuccess: (data: any) => {
        toast.success(data?.message || 'Hủy đơn + hoàn tiền thành công')
        setCancelDialogOpen(false)
        setOrderToCancel(null)
      },
      onError: (error: any) => toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
    })
  }, [orderToCancel, cancelMutation])

  const handleOpenResend = useCallback((order: any) => {
    setOrderToResend(order)
    setResendDialogOpen(true)
  }, [])

  const handleConfirmResend = useCallback(() => {
    if (!orderToResend) return
    resendMutation.mutate(orderToResend.id, {
      onSuccess: (data: any) => {
        toast.success(data?.message || 'Gửi lại đơn thành công')
        setResendDialogOpen(false)
        setOrderToResend(null)
      },
      onError: (error: any) => toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
    })
  }, [orderToResend, resendMutation])

  const handleToggleSort = useCallback((column: string) => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }, [sortBy])

  // Partial orders handlers
  const handleRetry = useCallback(() => {
    if (!retryOrder) return
    retryMutation.mutate(retryOrder.id, {
      onSuccess: (data: any) => {
        toast.success(data?.message || 'Đã đẩy đơn vào queue mua bù!')
        setRetryOrder(null)
      },
      onError: (error: any) => toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
    })
  }, [retryOrder, retryMutation])

  const handleRefund = useCallback(() => {
    if (!refundOrder) return
    refundMutation.mutate(refundOrder.id, {
      onSuccess: (data: any) => {
        toast.success(data?.message || 'Hoàn tiền thành công!')
        setRefundOrder(null)
      },
      onError: (error: any) => toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
    })
  }, [refundOrder, refundMutation])

  // Tab 0: Tất cả đơn hàng columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: () => (
          <span
            onClick={() => handleToggleSort('id')}
            style={{ cursor: 'pointer', userSelect: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            ID
            {sortBy === 'id' && (
              <span style={{ fontSize: '11px' }}>{sortOrder === 'desc' ? '▼' : '▲'}</span>
            )}
          </span>
        ),
        size: 80,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontWeight: 600, fontSize: '13px', color: '#64748b' }}>#{row.original.id}</span>
        )
      },
      {
        accessorKey: 'order_code',
        header: 'Mã đơn',
        size: 200,
        cell: ({ row }: { row: any }) => (
          <div>
            <span style={{ fontWeight: 600, fontSize: '13px' }}>{row.original.order_code}</span>
            {(row.original.provider_order_code || row.original.supplier_order_code) && (
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#6366f1', marginTop: 2 }} title='Mã đơn site mẹ'>
                NCC: {row.original.provider_order_code || row.original.supplier_order_code}
              </div>
            )}
          </div>
        )
      },
      {
        header: 'User',
        size: 160,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontWeight: 600, fontSize: '13px' }}>{row.original.user_name || '-'}</span>
        )
      },
      {
        header: 'Dịch vụ',
        size: 170,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontSize: '13px' }}>{row.original.service_name || '-'}</span>
        )
      },
      {
        header: 'Nhà cung cấp',
        size: 110,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontSize: '13px' }}>{row.original.provider_name || '-'}</span>
        )
      },
      {
        header: 'SL',
        size: 70,
        cell: ({ row }: { row: any }) => {
          const delivered = row.original.delivered_quantity ?? 0
          const total = row.original.quantity ?? 0
          const isMissing = delivered < total


return (
            <span style={{ fontSize: '13px', color: isMissing ? '#EF4444' : undefined, fontWeight: isMissing ? 600 : undefined }}>
              {delivered}/{total}
            </span>
          )
        }
      },
      {
        header: 'Đơn giá',
        size: 130,
        cell: ({ row }: { row: any }) => {
          const o = row.original

          return (
            <div style={{ lineHeight: 1.6 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                {formatVND(o.price_per_unit ?? 0)}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                vốn: {formatVND(o.cost_price ?? 0)}
              </div>
            </div>
          )
        }
      },
      {
        header: 'Tổng tiền',
        size: 140,
        cell: ({ row }: { row: any }) => {
          const o = row.original
          const profit = (o.total_amount ?? 0) - (o.total_cost ?? 0)
          const profitColor = profit >= 0 ? '#16a34a' : '#dc2626'

          return (
            <div style={{ lineHeight: 1.6 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                {formatVND(o.total_amount ?? 0)}
              </div>
              <div style={{ fontSize: '11px', color: profitColor }}>
                lãi: {formatVND(profit)}
              </div>
            </div>
          )
        }
      },
      {
        header: 'Trạng thái',
        size: 160,
        cell: ({ row }: { row: any }) => {
          const o = row.original
          const status = o.status
          const config = STATUS_CONFIG[status] || { label: `Status ${status}`, color: '#94A3B8' }
          const retry = o.retry ?? 0
          const maxRetry = o.max_retry ?? 3
          const isLocked = o.is_locked

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Chip
                  label={config.label}
                  size='small'
                  sx={{ backgroundColor: config.color + '18', color: config.color, fontWeight: 600, fontSize: '11px' }}
                />
                {isLocked && (
                  <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }} title='Đang xử lý (locked)'>🔒</span>
                )}
              </div>
              {status === 1 && retry > 0 && (
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: retry >= maxRetry ? '#dc2626' : '#94a3b8' }}>
                  retry {retry}/{maxRetry} {retry >= maxRetry ? '⚠️' : ''}
                </span>
              )}
            </div>
          )
        }
      },
      {
        header: 'Loại',
        size: 95,
        cell: ({ row }: { row: any }) => (
          <Chip
            label={row.original.order_type === 1 ? 'Gia hạn' : 'Mua'}
            size='small'
            color={row.original.order_type === 1 ? 'info' : 'default'}
            variant='outlined'
            sx={{ fontSize: '11px' }}
          />
        )
      },
      {
        id: 'created_at',
        header: () => (
          <span
            onClick={() => handleToggleSort('created_at')}
            style={{ cursor: 'pointer', userSelect: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            Thời gian
            {sortBy === 'created_at' && (
              <span style={{ fontSize: '11px' }}>{sortOrder === 'desc' ? '▼' : '▲'}</span>
            )}
          </span>
        ),
        size: 180,
        cell: ({ row }: { row: any }) => {
          const r = row.original

          return (
            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock3 size={12} />
                <span>Tạo: {r.created_at ? formatDateTimeLocal(r.created_at) : '-'}</span>
              </div>
              {r.buy_at && (
                <div style={{ color: '#16a34a' }}>Mua: {formatDateTimeLocal(r.buy_at)}</div>
              )}
              {r.expired_at && (
                <div style={{ color: r.status >= 5 ? '#dc2626' : '#94a3b8' }}>
                  HH: {formatDateTimeLocal(r.expired_at)}
                </div>
              )}
              {r.time && (
                <div style={{ color: '#94a3b8' }}>{r.time} ngày</div>
              )}
            </div>
          )
        }
      },
      {
        header: 'Thao tác',
        id: 'actions',
        size: 140,
        cell: ({ row }: { row: any }) => {
          const order = row.original
          const status = order.status


return (
            <div className='flex gap-1'>
              <Tooltip title='Chi tiết'>
                <IconButton size='small' color='primary' onClick={() => handleOpenDetail(order)}>
                  <Eye size={16} />
                </IconButton>
              </Tooltip>
              {status === 5 && (
                <>
                  <Tooltip title='Hủy + hoàn tiền'>
                    <IconButton size='small' color='error' onClick={() => handleOpenCancel(order)}>
                      <XCircle size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Gửi lại'>
                    <IconButton size='small' color='success' onClick={() => handleOpenResend(order)}>
                      <RefreshCw size={16} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              {/* Retry cho order processing retry >= max hoặc failed */}
              {((status === 1 && order.retry >= (order.max_retry ?? 3)) || status === 5) && (
                <Tooltip title='Thử lại đơn hàng'>
                  <IconButton size='small' color='warning' onClick={() => setRetryFailedOrder(order)}>
                    <RotateCcw size={16} />
                  </IconButton>
                </Tooltip>
              )}
              {status === 3 && (
                <>
                  <Tooltip title='Mua bù (retry)'>
                    <IconButton size='small' color='success' onClick={() => setRetryOrder(order)}>
                      <RefreshCw size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Hoàn tiền phần thiếu'>
                    <IconButton size='small' color='warning' onClick={() => setRefundOrder(order)}>
                      <DollarSign size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Thêm proxy thủ công'>
                    <IconButton size='small' color='primary' onClick={() => setFillProxiesOrder(order)}>
                      <PlusCircle size={16} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </div>
          )
        }
      }
    ],
    [handleOpenDetail, handleOpenCancel, handleOpenResend, handleToggleSort, sortBy, sortOrder]
  )

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: displayPerPage } }
  })

  return (
    <>
          {/* Stats Cards */}
          <Grid2 container spacing={2} sx={{ mb: 3 }}>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard title='Tổng đơn hàng' value={summary.total_orders} icon={ShoppingCart} color='#7C3AED' />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard title='Tổng doanh thu' value={formatVND(summary.total_amount)} icon={DollarSign} color='#059669' />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard title='Tổng vốn' value={formatVND(summary.total_cost)} icon={Package} color='#D97706' />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard title='Lợi nhuận' value={formatVND(summary.profit)} icon={TrendingUp} color='#2563EB' />
            </Grid2>
          </Grid2>

          {/* Table */}
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
                    <h5 className='mb-0 font-semibold'>Quản lý đơn hàng</h5>
                  </div>
                  <TextField
                    size='small'
                    placeholder='Tìm mã đơn, user...'
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    sx={{ width: 220, '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px' } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Search size={15} color='#94a3b8' />
                        </InputAdornment>
                      ),
                      endAdornment: searchInput ? (
                        <InputAdornment position='end'>
                          <IconButton size='small' onClick={() => setSearchInput('')} sx={{ p: '2px' }}>
                            <X size={14} />
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }}
                  />
                </div>

                {/* Row 2: Filters */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', padding: '10px 16px' }}>
                  <CustomTextField
                    size='small'
                    type='date'
                    value={startInput}
                    onChange={e => setStartInput(e.target.value)}
                    sx={{ width: 145, ...inputSx }}
                  />
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>—</span>
                  <CustomTextField
                    size='small'
                    type='date'
                    value={endInput}
                    onChange={e => setEndInput(e.target.value)}
                    sx={{ width: 145, ...inputSx }}
                  />

                  <div style={{ width: 1, height: 24, backgroundColor: '#e2e8f0', margin: '0 4px' }} />

                  <CustomTextField
                    select
                    size='small'
                    value={statusInput}
                    onChange={e => setStatusInput(e.target.value)}
                    sx={{ minWidth: 135, ...inputSx }}
                    slotProps={{ select: { displayEmpty: true } }}
                  >
                    <MenuItem value=''>
                      <em>Tất cả trạng thái</em>
                    </MenuItem>
                    {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                      <MenuItem key={key} value={key}>
                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: val.color, marginRight: 8 }} />
                        {val.label}
                      </MenuItem>
                    ))}
                  </CustomTextField>

                  <CustomTextField
                    select
                    size='small'
                    value={providerInput}
                    onChange={e => setProviderInput(e.target.value)}
                    sx={{ minWidth: 130, ...inputSx }}
                    slotProps={{ select: { displayEmpty: true } }}
                  >
                    <MenuItem value=''>
                      <em>Tất cả nhà cung cấp</em>
                    </MenuItem>
                    {providers.map((p: any) => (
                      <MenuItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>

                  <CustomTextField
                    select
                    size='small'
                    value={orderTypeInput}
                    onChange={e => setOrderTypeInput(e.target.value)}
                    sx={{ minWidth: 105, ...inputSx }}
                    slotProps={{ select: { displayEmpty: true } }}
                  >
                    <MenuItem value=''>
                      <em>Tất cả loại</em>
                    </MenuItem>
                    <MenuItem value='0'>Mua mới</MenuItem>
                    <MenuItem value='1'>Gia hạn</MenuItem>
                  </CustomTextField>

                  <div style={{ width: 1, height: 24, backgroundColor: '#e2e8f0', margin: '0 4px' }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', color: '#64748b' }}>
                    <span>Lấy</span>
                    <input
                      type='number'
                      min={20}
                      max={10000}
                      value={apiLimitInput}
                      onChange={e => setApiLimitInput(e.target.value)}
                      onBlur={() => {
                        const val = Math.max(20, Math.min(10000, Number(apiLimitInput) || 100))

                        setApiLimitInput(String(val))
                        setApiLimit(val)
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          const val = Math.max(20, Math.min(10000, Number(apiLimitInput) || 100))

                          setApiLimitInput(String(val))
                          setApiLimit(val)
                        }
                      }}
                      style={{
                        width: 80, padding: '5px 6px', fontSize: '13px',
                        border: '1px solid #e2e8f0', borderRadius: 6,
                        textAlign: 'center', outline: 'none'
                      }}
                    />
                    <span>đơn</span>
                  </div>

                  <Button
                    variant='contained'
                    size='small'
                    onClick={handleApplyFilters}
                    disabled={isFetching}
                    sx={{ color: '#fff', minWidth: 100, height: 36, fontSize: '13px' }}
                    startIcon={
                      isFetching
                        ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                        : <Search size={15} />
                    }
                  >
                    {isFetching ? 'Đang tải...' : 'Tìm kiếm'}
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className='table-wrapper' style={{ overflowX: 'auto' }}>
                <table
                  className='data-table'
                  style={{ minWidth: '1540px', ...(isLoading || orders.length === 0 ? { height: '100%' } : {}) }}
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
                            <div className='loader'><span></span><span></span><span></span></div>
                            <p className='loading-text'>Đang tải dữ liệu...</p>
                          </div>
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className='py-10 text-center'>
                          <div className='flex flex-col items-center justify-center'>
                            <Image src='/images/no-data.png' alt='No data' width={160} height={160} />
                            <p className='mt-4' style={{ color: '#94a3b8' }}>Không có đơn hàng</p>
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
                      <span className='text-sm text-gray'>Hiển thị</span>
                      <div className='page-size-select-wrapper'>
                        <select
                          value={displayPerPage}
                          onChange={e => {
                            const val = Number(e.target.value)

                            setDisplayPerPage(val)
                            table.setPageSize(val)
                          }}
                          className='page-size-select'
                        >
                          <option value='20'>20</option>
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

                    <div>
                      {orders.length > 0 ? (
                        <span>
                          Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()} ({orders.length}{serverPagination.total > orders.length ? ` / ${serverPagination.total}` : ''} đơn)
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
                      onChange={(_, newPage) => table.setPageIndex(newPage - 1)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

      {/* ── Modals ── */}

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={orderDetailOpen}
        onClose={() => { setOrderDetailOpen(false); setSelectedOrder(null) }}
        orderData={selectedOrder}
      />

      {/* Cancel + Refund Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Hủy đơn + Hoàn tiền</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hủy đơn <strong>#{orderToCancel?.order_code}</strong> và hoàn tiền{' '}
            <strong>{formatVND(orderToCancel?.total_amount ?? 0)}</strong> cho user{' '}
            <strong>{orderToCancel?.user_name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} color='inherit'>Hủy</Button>
          <Button
            onClick={handleConfirmCancel}
            color='error'
            variant='contained'
            disabled={cancelMutation.isPending}
            sx={{ color: '#fff' }}
          >
            {cancelMutation.isPending
              ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              : 'Xác nhận hủy + hoàn tiền'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resend Dialog */}
      <Dialog open={resendDialogOpen} onClose={() => setResendDialogOpen(false)}>
        <DialogTitle>Gửi lại đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Gửi lại đơn <strong>#{orderToResend?.order_code}</strong> vào queue xử lý?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResendDialogOpen(false)} color='inherit'>Hủy</Button>
          <Button
            onClick={handleConfirmResend}
            color='success'
            variant='contained'
            disabled={resendMutation.isPending}
            sx={{ color: '#fff' }}
          >
            {resendMutation.isPending
              ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              : 'Xác nhận gửi lại'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Retry Dialog */}
      <Dialog open={!!retryOrder} onClose={() => setRetryOrder(null)}>
        <DialogTitle>Mua bù proxy</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Đẩy đơn <strong>#{retryOrder?.order_code}</strong> vào queue để mua bù{' '}
            <strong>{retryOrder?.missing_count ?? (retryOrder?.quantity - (retryOrder?.delivered_quantity ?? 0))}</strong> proxy thiếu?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRetryOrder(null)} color='inherit'>Hủy</Button>
          <Button
            onClick={handleRetry}
            color='success'
            variant='contained'
            disabled={retryMutation.isPending}
            sx={{ color: '#fff' }}
          >
            {retryMutation.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Xác nhận mua bù'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Retry Failed Order Dialog */}
      <Dialog open={!!retryFailedOrder} onClose={() => setRetryFailedOrder(null)}>
        <DialogTitle>Thử lại đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Reset đơn <strong>#{retryFailedOrder?.order_code}</strong> về pending và đẩy lại vào queue xử lý?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRetryFailedOrder(null)} color='inherit'>Hủy</Button>
          <Button
            onClick={() => {
              if (!retryFailedOrder) return

              retryFailedMutation.mutate(retryFailedOrder.id, {
                onSuccess: (data: any) => {
                  toast.success(data?.message || 'Đã đẩy lại đơn hàng')
                  setRetryFailedOrder(null)
                },
                onError: (err: any) => {
                  toast.error(err?.response?.data?.message || 'Lỗi khi retry')
                }
              })
            }}
            color='warning'
            variant='contained'
            disabled={retryFailedMutation.isPending}
            sx={{ color: '#fff' }}
          >
            {retryFailedMutation.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Xác nhận thử lại'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fill Proxies Dialog */}
      {fillProxiesOrder && (
        <FillProxiesDialog
          order={fillProxiesOrder}
          onClose={() => setFillProxiesOrder(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['adminOrders'] })
            setFillProxiesOrder(null)
          }}
        />
      )}

      {/* Refund Dialog */}
      <Dialog open={!!refundOrder} onClose={() => setRefundOrder(null)}>
        <DialogTitle>Hoàn tiền phần thiếu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hoàn tiền cho <strong>{refundOrder?.missing_count ?? (refundOrder?.quantity - (refundOrder?.delivered_quantity ?? 0))}</strong> proxy
            thiếu của đơn <strong>#{refundOrder?.order_code}</strong>?
            <br />
            <br />
            Đơn hàng vẫn active — proxy đã nhận vẫn hoạt động bình thường.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundOrder(null)} color='inherit'>Hủy</Button>
          <Button
            onClick={handleRefund}
            color='warning'
            variant='contained'
            disabled={refundMutation.isPending}
            sx={{ color: '#fff' }}
          >
            {refundMutation.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Xác nhận hoàn tiền'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
