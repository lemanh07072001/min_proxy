'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'

import Image from 'next/image'

import {
  CircleQuestionMark,
  BadgeCheck,
  BadgeMinus,
  List,
  Clock3,
  Search,
  X,
  RefreshCw,
  Loader2,
  CircleX,
  RotateCcw,
  User,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide
} from 'lucide-react'

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Pagination from '@mui/material/Pagination'

import { formatDateTimeLocal } from '@/utils/formatDate'
import DetailUserModal from '@/views/Client/Admin/TransactionHistory/DetailUserModal'
import { useUserOrders } from '@/hooks/apis/useUserOrders'
import { useAdminTransactionHistory } from '@/hooks/apis/useAdminTransactionHistory'
import CustomTextField from '@/@core/components/mui/TextField'
import useMediaQuery from '@/@menu/hooks/useMediaQuery'
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS
} from '@/constants'

// Shared select style — nhỏ gọn, bo tròn, font 13px
const selectSx = {
  minWidth: '140px',
  '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', minHeight: '38px' },
  '& .MuiSelect-select': { paddingBlock: '8.5px' }
}

export default function TableDepositHistory() {
  const isMobile = useMediaQuery('768px')

  // Staged filter values (chưa apply, chỉ apply khi click "Tìm")
  const [searchInput, setSearchInput] = useState('')
  const [typeInput, setTypeInput] = useState<string>('')
  const [limitInput, setLimitInput] = useState<string>('100')
  const [sortInput, setSortInput] = useState<'desc' | 'asc'>('desc')

  // Applied filter values (gửi lên API)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [limit, setLimit] = useState<number>(100)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')

  // Modals
  const [isModalDetailUserOpen, setIsModalDetailUserOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>()

  // Apply tất cả filter cùng lúc khi click "Tìm kiếm"
  const handleApplyFilters = useCallback(() => {
    const parsedLimit = Math.min(Math.max(parseInt(limitInput) || 100, 100), 10000)

    setSearchQuery(searchInput.trim())
    setTypeFilter(typeInput)
    setLimit(parsedLimit)
    setSortOrder(sortInput)
    setLimitInput(String(parsedLimit))
  }, [searchInput, typeInput, limitInput, sortInput])

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleApplyFilters()
    },
    [handleApplyFilters]
  )

  const handleClearAll = useCallback(() => {
    setSearchInput('')
    setTypeInput('')
    setLimitInput('100')
    setSortInput('desc')
    setSearchQuery('')
    setTypeFilter('')
    setLimit(100)
    setSortOrder('desc')
  }, [])

  // Data
  const { data: apiResponse, isLoading, isFetching } = useAdminTransactionHistory({
    search: searchQuery || undefined,
    type: typeFilter || undefined,
    limit,
    order: sortOrder
  })

  const dataOrders = useMemo(() => apiResponse?.data ?? [], [apiResponse])

  const { data: sampleUser = [], isLoading: loadingModal, refetch } = useUserOrders(selectedUserId)

  // Badge helpers — đảm bảo contrast tốt, label đủ rõ ràng, không bị cắt
  const chipSx = { '& .MuiChip-label': { whiteSpace: 'nowrap' as const } }
  const chipWarning = { '& .MuiChip-label': { color: '#fff', whiteSpace: 'nowrap' as const }, '& .MuiChip-icon': { color: '#fff' } }

  const getTypeBadge = (type: string) => {
    const label = TRANSACTION_TYPE_LABELS[type] || 'Không xác định'

    switch (type) {
      case TRANSACTION_TYPES.BUY:
      case TRANSACTION_TYPES.THANHTOAN:
      case TRANSACTION_TYPES.THANHTOAN_V4:
        return <Chip label={label} size='small' icon={<BadgeCheck />} color='success' sx={chipSx} />
      case TRANSACTION_TYPES.REFUND:
      case TRANSACTION_TYPES.REFUND_PARTIAL:
        return <Chip label={label} size='small' icon={<BadgeMinus />} color='warning' sx={chipWarning} />
      case TRANSACTION_TYPES.REFUND_FULL:
        return <Chip label={label} size='small' icon={<BadgeMinus />} color='error' sx={chipSx} />
      case TRANSACTION_TYPES.FAILED:
        return <Chip label={label} size='small' icon={<CircleX />} color='error' sx={chipSx} />
      case TRANSACTION_TYPES.GIAHAN:
      case TRANSACTION_TYPES.GIAHAN_V4:
      case TRANSACTION_TYPES.RENEWAL:
        return <Chip label={label} size='small' icon={<RefreshCw />} color='info' sx={chipSx} />
      case TRANSACTION_TYPES.REFUND_RENEWAL:
        return <Chip label={label} size='small' icon={<RotateCcw />} color='warning' sx={chipWarning} />
      case TRANSACTION_TYPES.NAPTIEN:
      case TRANSACTION_TYPES.NAPTIEN_AUTO:
      case TRANSACTION_TYPES.NAPTIEN_PAY2S:
      case TRANSACTION_TYPES.NAPTIEN_MANUAL:
        return <Chip label={label} size='small' icon={<BadgeCheck />} color='primary' sx={chipSx} />
      case TRANSACTION_TYPES.RUT_HOA_HONG_AFFILIATE:
        return <Chip label={label} size='small' icon={<BadgeMinus />} color='secondary' sx={chipSx} />
      default:
        return <Chip label={label} size='small' icon={<CircleQuestionMark />} color='secondary' sx={chipSx} />
    }
  }

  // Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: isMobile ? 60 : 50
      },
      {
        header: '',
        id: 'actions',
        size: 50,
        cell: ({ row }: { row: any }) => (
          <Tooltip title='Thông tin user'>
            <IconButton size='small' color='info' onClick={() => handleOpenModalUserDetail(row.original?.user?.id)}>
              <User size={16} />
            </IconButton>
          </Tooltip>
        )
      },
      {
        header: 'User',
        cell: ({ row }: { row: any }) => (
          <div onClick={() => handleOpenModalUserDetail(row.original?.user?.id)} className='cursor-pointer'>
            <div className='font-bold'>{row.original?.user?.name}</div>
            <div className='text-xs' style={{ color: 'var(--mui-palette-text-secondary, #64748b)' }}>
              {row.original?.user?.email}
            </div>
          </div>
        ),
        size: isMobile ? 220 : 200
      },
      {
        accessorKey: 'type',
        header: 'Loại GD',
        cell: ({ row }: { row: any }) => getTypeBadge(row.original.type),
        size: 190
      },
      {
        header: 'Số trước',
        cell: ({ row }: { row: any }) => (
          <span style={{ color: 'var(--mui-palette-text-secondary, #64748b)', fontSize: '13px' }}>
            {new Intl.NumberFormat('vi-VN').format(row.original.sotientruoc ?? 0)} đ
          </span>
        ),
        size: 110
      },
      {
        header: 'Số tiền',
        cell: ({ row }: { row: any }) => (
          <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--mui-palette-text-primary, #1e293b)' }}>
            {new Intl.NumberFormat('vi-VN').format(row.original.sotienthaydoi)} đ
          </span>
        ),
        size: 110
      },
      {
        header: 'Số sau',
        cell: ({ row }: { row: any }) => (
          <span style={{ color: 'var(--mui-palette-text-secondary, #64748b)', fontSize: '13px' }}>
            {new Intl.NumberFormat('vi-VN').format(row.original.sotiensau ?? 0)} đ
          </span>
        ),
        size: 110
      },
      {
        header: 'Nội dung',
        size: 280,
        cell: ({ row }: { row: any }) => (
          <div style={{ fontSize: '13px', color: 'var(--mui-palette-text-primary, #334155)' }}>
            {row.original.noidung}
          </div>
        )
      },
      {
        accessorKey: 'created_at',
        header: 'Thời gian',
        size: 160,
        cell: ({ row }: { row: any }) => (
          <div className='d-flex align-items-center gap-1' style={{ color: 'var(--mui-palette-text-secondary, #64748b)' }}>
            <Clock3 size={14} />
            <span style={{ fontSize: '13px' }}>{formatDateTimeLocal(row.original.created_at)}</span>
          </div>
        )
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMobile]
  )

  const table = useReactTable({
    data: dataOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 20 }
    },
    getRowId: (row: any) => String(row.id)
  })

  // Modal handlers
  useEffect(() => {
    if (selectedUserId) refetch()
  }, [selectedUserId, refetch])

  const handleOpenModalUserDetail = (userId: number) => {
    setSelectedUserId(userId)
    setIsModalDetailUserOpen(true)
  }

  const hasActiveFilters = !!(searchQuery || typeFilter || limit !== 100 || sortOrder !== 'desc')

  return (
    <>
      <div className='orders-content'>
        <div className='table-container'>
          {/* Header */}
          <div className='table-toolbar w-full'>
            <div className='header-left'>
              <div className='page-icon'>
                <List size={17} />
              </div>
              <h5 className='mb-0 font-semibold'>Lịch sử giao dịch</h5>
            </div>
            <div className='header-right'>
              <span style={{ fontSize: '13px', color: 'var(--mui-palette-text-disabled, #94a3b8)' }}>
                {!isLoading && dataOrders.length > 0 && `${new Intl.NumberFormat('vi-VN').format(dataOrders.length)} giao dịch`}
              </span>
            </div>
          </div>

          {/* Filter bar — tất cả chỉ apply khi click "Tìm kiếm" */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-color, #e2e8f0)',
              background: 'var(--mui-palette-background-default, #f8fafc)'
            }}
          >
            {/* Search input */}
            <CustomTextField
              size='small'
              placeholder='Tên, email, nội dung...'
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search size={15} style={{ color: 'var(--mui-palette-text-disabled, #94a3b8)' }} />
                  </InputAdornment>
                ),
                endAdornment: searchInput ? (
                  <InputAdornment position='end'>
                    <IconButton size='small' onClick={() => setSearchInput('')} sx={{ padding: '2px' }}>
                      <X size={14} />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
              sx={{
                width: '200px',
                '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', minHeight: '38px' }
              }}
            />

            {/* Transaction type filter */}
            <CustomTextField
              select
              size='small'
              value={typeInput}
              onChange={e => setTypeInput(e.target.value)}
              sx={selectSx}
              slotProps={{ select: { displayEmpty: true } }}
            >
              <MenuItem value=''>
                <em>Tất cả loại GD</em>
              </MenuItem>
              <MenuItem value={TRANSACTION_TYPES.NAPTIEN_AUTO}>Nạp tiền tự động</MenuItem>
              <MenuItem value={TRANSACTION_TYPES.NAPTIEN_MANUAL}>Nạp tiền thủ công</MenuItem>
              <MenuItem value={TRANSACTION_TYPES.THANHTOAN}>Mua proxy</MenuItem>
              <MenuItem value={TRANSACTION_TYPES.GIAHAN}>Gia hạn</MenuItem>
              <MenuItem value={TRANSACTION_TYPES.THANHTOAN_V4}>Mua proxy V4</MenuItem>
              <MenuItem value={TRANSACTION_TYPES.GIAHAN_V4}>Gia hạn V4</MenuItem>
              <MenuItem value={TRANSACTION_TYPES.RENEWAL}>Gia hạn proxy</MenuItem>
              <MenuItem value={TRANSACTION_TYPES.REFUND_PARTIAL}>Hoàn tiền 1 phần</MenuItem>
              <MenuItem value={TRANSACTION_TYPES.REFUND_FULL}>Hoàn tiền toàn bộ</MenuItem>
              <MenuItem value={TRANSACTION_TYPES.REFUND_RENEWAL}>Hoàn tiền gia hạn</MenuItem>
              <MenuItem value={TRANSACTION_TYPES.RUT_HOA_HONG_AFFILIATE}>Rút hoa hồng</MenuItem>
            </CustomTextField>

            {/* Sort order */}
            <CustomTextField
              select
              size='small'
              value={sortInput}
              onChange={e => setSortInput(e.target.value as 'desc' | 'asc')}
              sx={{ ...selectSx, minWidth: '120px' }}
              slotProps={{ select: { displayEmpty: true } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    {sortInput === 'desc' ? (
                      <ArrowDownWideNarrow size={15} style={{ color: 'var(--mui-palette-text-disabled, #94a3b8)' }} />
                    ) : (
                      <ArrowUpNarrowWide size={15} style={{ color: 'var(--mui-palette-text-disabled, #94a3b8)' }} />
                    )}
                  </InputAdornment>
                )
              }}
            >
              <MenuItem value='desc'>Mới nhất</MenuItem>
              <MenuItem value='asc'>Cũ nhất</MenuItem>
            </CustomTextField>

            {/* Limit bản ghi — label cố định + giá trị */}
            <CustomTextField
              size='small'
              type='number'
              value={limitInput}
              onChange={e => setLimitInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <span style={{ fontSize: '12px', color: 'var(--mui-palette-text-secondary, #64748b)', whiteSpace: 'nowrap' }}>Số bản ghi</span>
                  </InputAdornment>
                )
              }}
              slotProps={{ htmlInput: { min: 100, max: 10000 } }}
              sx={{
                width: '180px',
                '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', minHeight: '38px' },
                '& input': { MozAppearance: 'textfield' },
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': { WebkitAppearance: 'none' }
              }}
            />

            {/* Nút tìm kiếm — ở cuối, click mới gọi API */}
            <Button
              variant='contained'
              size='small'
              onClick={handleApplyFilters}
              disabled={isFetching}
              sx={{
                height: '38px',
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                boxShadow: 'none',
                gap: '4px',
                color: '#fff',
                px: 2,
                minWidth: '110px',
                '&.Mui-disabled': {
                  backgroundColor: 'var(--mui-palette-primary-main)',
                  opacity: 0.65,
                  color: '#fff'
                }
              }}
            >
              {isFetching ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={15} />}
              {isFetching ? 'Đang tìm...' : 'Tìm kiếm'}
            </Button>

            {/* Clear all */}
            {hasActiveFilters && (
              <Tooltip title='Đặt lại tất cả'>
                <IconButton
                  size='small'
                  onClick={handleClearAll}
                  sx={{
                    color: 'var(--mui-palette-text-disabled, #94a3b8)',
                    '&:hover': { color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)' }
                  }}
                >
                  <X size={16} />
                </IconButton>
              </Tooltip>
            )}
          </div>

          {/* Table */}
          <div className='table-wrapper' style={{ overflowX: 'auto' }}>
            <table className='data-table' style={{ minWidth: '1400px', ...(isLoading || !dataOrders.length ? { height: '100%' } : {}) }}>
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
                        <p className='mt-4' style={{ color: 'var(--mui-palette-text-disabled, #94a3b8)' }}>
                          {hasActiveFilters ? 'Không tìm thấy giao dịch phù hợp' : 'Không có dữ liệu'}
                        </p>
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

          {/* Footer — phân trang client */}
          {!isLoading && dataOrders.length > 0 && (
            <div
              style={{
                padding: '10px 16px',
                borderTop: '1px solid var(--border-color, #e2e8f0)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--mui-palette-text-secondary, #64748b)' }}>
                <span>Hiển thị</span>
                <CustomTextField
                  select
                  size='small'
                  value={table.getState().pagination.pageSize}
                  onChange={e => table.setPageSize(Number(e.target.value))}
                  sx={{ width: '70px', '& .MuiOutlinedInput-root': { fontSize: '13px' }, '& .MuiSelect-select': { py: '4px' } }}
                >
                  {[20, 50, 100].map(size => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </CustomTextField>
                <span>/ {new Intl.NumberFormat('vi-VN').format(dataOrders.length)} giao dịch {sortOrder === 'desc' ? 'mới nhất' : 'cũ nhất'}</span>
              </div>
              {table.getPageCount() > 1 && (
                <Pagination
                  count={table.getPageCount()}
                  page={table.getState().pagination.pageIndex + 1}
                  onChange={(_, page) => table.setPageIndex(page - 1)}
                  size='small'
                  color='primary'
                />
              )}
            </div>
          )}
        </div>
      </div>

      <DetailUserModal
        isOpen={isModalDetailUserOpen}
        onClose={() => setIsModalDetailUserOpen(false)}
        data={sampleUser}
        isLoading={loadingModal}
      />
    </>
  )
}
