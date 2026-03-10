'use client'

import { useMemo, useState, useCallback } from 'react'

import Image from 'next/image'

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
  X
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

import { useAdminOrders, useOrderReportSummary } from '@/hooks/apis/useOrderReport'
import { useCancelOrder, useResendOrder } from '@/hooks/apis/useOrders'
import { usePartners } from '@/hooks/apis/usePartners'
import OrderDetailModal from '@/views/Client/Admin/TransactionHistory/OrderDetailModal'

const formatVND = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + 'đ'

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
  9: { label: 'Đang mua bù', color: '#14B8A6' }
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
  const defaults = useMemo(() => getDefaults(), [])

  // Staged filter inputs
  const [searchInput, setSearchInput] = useState('')
  const [startInput, setStartInput] = useState(toInputDate(defaults.start))
  const [endInput, setEndInput] = useState(toInputDate(defaults.end))
  const [statusInput, setStatusInput] = useState<string>('')
  const [partnerInput, setPartnerInput] = useState<string>('')
  const [orderTypeInput, setOrderTypeInput] = useState<string>('')

  // Applied filters
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState(defaults.start)
  const [endDate, setEndDate] = useState(defaults.end)
  const [statusFilter, setStatusFilter] = useState<number | null>(null)
  const [partnerFilter, setPartnerFilter] = useState<number | null>(null)
  const [orderTypeFilter, setOrderTypeFilter] = useState<number | null>(null)
  const [displayPerPage, setDisplayPerPage] = useState(20)
  const [apiLimit, setApiLimit] = useState(100)
  const [apiLimitInput, setApiLimitInput] = useState('100')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<string>('desc')

  // Modals
  const [orderDetailOpen, setOrderDetailOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<any>(null)
  const [resendDialogOpen, setResendDialogOpen] = useState(false)
  const [orderToResend, setOrderToResend] = useState<any>(null)

  // Data
  const { data: ordersData, isLoading, isFetching } = useAdminOrders(
    {
      start: startDate,
      end: endDate,
      page: 1,
      per_page: apiLimit,
      status: statusFilter,
      partner_id: partnerFilter,
      order_type: orderTypeFilter,
      sort_by: sortBy,
      sort_order: sortOrder
    },
    true
  )

  const { data: summaryData } = useOrderReportSummary(
    { start: startDate, end: endDate, partner_id: partnerFilter },
    true
  )

  const { data: partners = [] } = usePartners()
  const cancelMutation = useCancelOrder()
  const resendMutation = useResendOrder()

  const allOrders = ordersData?.orders ?? []

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
  const summary = summaryData ?? { total_orders: 0, total_amount: 0, total_cost: 0, profit: 0 }

  // Handlers
  const handleApplyFilters = useCallback(() => {
    setStartDate(fromInputDate(startInput))
    setEndDate(fromInputDate(endInput))
    setStatusFilter(statusInput !== '' ? Number(statusInput) : null)
    setPartnerFilter(partnerInput !== '' ? Number(partnerInput) : null)
    setOrderTypeFilter(orderTypeInput !== '' ? Number(orderTypeInput) : null)
    setSearchQuery(searchInput.trim())
  }, [startInput, endInput, statusInput, partnerInput, orderTypeInput, searchInput])

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
        size: 170,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontWeight: 600, fontSize: '13px' }}>{row.original.order_code}</span>
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
        header: 'Đối tác',
        size: 110,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontSize: '13px' }}>{row.original.partner_name || '-'}</span>
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
        header: 'Tổng tiền',
        size: 110,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{formatVND(row.original.total_amount ?? 0)}</span>
        )
      },
      {
        header: 'Vốn',
        size: 100,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontSize: '13px', color: '#64748b' }}>{formatVND(row.original.total_cost ?? 0)}</span>
        )
      },
      {
        header: 'Trạng thái',
        size: 125,
        cell: ({ row }: { row: any }) => {
          const status = row.original.status
          const config = STATUS_CONFIG[status] || { label: `Status ${status}`, color: '#94A3B8' }

          
return (
            <Chip
              label={config.label}
              size='small'
              sx={{ backgroundColor: config.color + '18', color: config.color, fontWeight: 600, fontSize: '11px' }}
            />
          )
        }
      },
      {
        header: 'Loại',
        size: 75,
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
            Ngày tạo
            {sortBy === 'created_at' && (
              <span style={{ fontSize: '11px' }}>{sortOrder === 'desc' ? '▼' : '▲'}</span>
            )}
          </span>
        ),
        size: 150,
        cell: ({ row }: { row: any }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: '13px' }}>
            <Clock3 size={13} />
            {row.original.created_at ? formatDateTimeLocal(row.original.created_at) : '-'}
          </div>
        )
      },
      {
        header: 'Thao tác',
        id: 'actions',
        size: 110,
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
          {/* Toolbar: Title + Search + Filters + Button */}
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
                value={partnerInput}
                onChange={e => setPartnerInput(e.target.value)}
                sx={{ minWidth: 130, ...inputSx }}
                slotProps={{ select: { displayEmpty: true } }}
              >
                <MenuItem value=''>
                  <em>Tất cả đối tác</em>
                </MenuItem>
                {partners.map((p: any) => (
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
              style={{ minWidth: '1350px', ...(isLoading || orders.length === 0 ? { height: '100%' } : {}) }}
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
                {/* Per page display */}
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
    </>
  )
}
