'use client'

import { useCallback, useMemo, useState } from 'react'

import Image from 'next/image'

import {
  CircleQuestionMark,
  BadgeCheck,
  BadgeMinus,
  List,
  Clock3,
  Search,
  X,
  Loader,
  Loader2,
  Trash2,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide
} from 'lucide-react'

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Pagination from '@mui/material/Pagination'
import Checkbox from '@mui/material/Checkbox'

import CustomTextField from '@/@core/components/mui/TextField'
import useMediaQuery from '@/@menu/hooks/useMediaQuery'
import { formatDateTimeLocal } from '@/utils/formatDate'
import { useDepositHistory, useDeleteDeposit } from '@/hooks/apis/useDeponsitHistory'
import { TRANSACTION_TYPE_LABELS } from '@/constants'

// Shared select style
const selectSx = {
  minWidth: '140px',
  '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', minHeight: '38px' },
  '& .MuiSelect-select': { paddingBlock: '8.5px' }
}

export default function TableDepositHistory() {
  const isMobile = useMediaQuery('768px')

  // Staged filter values
  const [statusInput, setStatusInput] = useState<string>('')
  const [limitInput, setLimitInput] = useState<string>('100')
  const [sortInput, setSortInput] = useState<'desc' | 'asc'>('desc')

  // Applied filter values
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [limit, setLimit] = useState<number>(100)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')

  // Selection
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

  // Delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteIds, setDeleteIds] = useState<number[]>([])

  // Apply filters
  const handleApplyFilters = useCallback(() => {
    const parsedLimit = Math.min(Math.max(parseInt(limitInput) || 100, 100), 10000)

    setStatusFilter(statusInput)
    setLimit(parsedLimit)
    setSortOrder(sortInput)
    setLimitInput(String(parsedLimit))
  }, [statusInput, limitInput, sortInput])

  const handleClearAll = useCallback(() => {
    setStatusInput('')
    setLimitInput('100')
    setSortInput('desc')
    setStatusFilter('')
    setLimit(100)
    setSortOrder('desc')
  }, [])

  // Data
  const { data: apiResponse, isLoading, isFetching } = useDepositHistory({
    ...(statusFilter ? { status: statusFilter } : {}),
    limit,
    order: sortOrder
  })

  const deleteMutation = useDeleteDeposit()

  const dataList = useMemo(() => apiResponse?.data ?? [], [apiResponse])

  // Badge helpers — contrast-safe, label đủ rõ ràng, không bị cắt
  const chipSx = { '& .MuiChip-label': { whiteSpace: 'nowrap' as const } }
  const chipWarning = { '& .MuiChip-label': { color: '#fff', whiteSpace: 'nowrap' as const }, '& .MuiChip-icon': { color: '#fff' } }

  const getTypeBadge = (type: string) => {
    const label = TRANSACTION_TYPE_LABELS[type] || 'Không xác định'

    switch (type) {
      case 'PLUS':
        return <Chip label={label} size='small' icon={<BadgeCheck />} color='success' sx={chipSx} />
      case 'MINUS':
        return <Chip label={label} size='small' icon={<BadgeMinus />} color='error' sx={chipSx} />
      default:
        return <Chip label={label} size='small' icon={<CircleQuestionMark />} color='default' sx={chipSx} />
    }
  }

  const getStatusBadge = (status: string, note?: string) => {
    switch (status) {
      case 'pending':
        return (
          <Chip
            label='Chờ xử lý'
            size='small'
            icon={<Loader style={{ animation: 'spin 1s linear infinite' }} />}
            color='warning'
            sx={chipWarning}
          />
        )
      case 'success':
        return <Chip label='Thành công' size='small' icon={<BadgeCheck />} color='success' sx={chipSx} />
      case 'failed':
        return (
          <Tooltip title={note} placement='top'>
            <Chip label='Thất bại' size='small' icon={<BadgeMinus />} color='error' sx={chipSx} />
          </Tooltip>
        )
      case 'cancelled':
        return <Chip label='Đã hủy' size='small' icon={<X />} color='default' sx={chipSx} />
      case 'expired':
        return <Chip label='Hết hạn' size='small' icon={<Clock3 />} color='default' sx={chipSx} />
      default:
        return <Chip label='Thành công' size='small' icon={<BadgeCheck />} color='success' sx={chipSx} />
    }
  }

  // Columns
  const columns: ColumnDef<any, any>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: any }) => (
          <Checkbox
            size='small'
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }: { row: any }) => (
          <Checkbox
            size='small'
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 40
      },
      {
        accessorKey: 'id',
        header: 'ID',
        size: isMobile ? 60 : 50
      },
      {
        id: 'actions',
        header: 'Thao tác',
        size: 50,
        cell: ({ row }: { row: any }) => (
          <Tooltip title='Xóa' placement='top'>
            <IconButton
              size='small'
              color='error'
              onClick={() => {
                setDeleteIds([row.original.id])
                setDeleteDialogOpen(true)
              }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        )
      },
      {
        header: 'User',
        size: isMobile ? 200 : 150,
        cell: ({ row }: { row: any }) => {
          const user = row.original?.user
          return user ? (
            <div className='d-flex flex-col gap-0.5'>
              <span className='font-medium'>{user.name}</span>
              <span className='text-xs' style={{ color: 'var(--mui-palette-text-secondary, #64748b)' }}>
                {user.email}
              </span>
            </div>
          ) : (
            <span style={{ color: 'var(--mui-palette-text-disabled, #94a3b8)' }}>—</span>
          )
        }
      },
      {
        accessorKey: 'transaction_type',
        header: 'Loại',
        cell: ({ row }: { row: any }) => getTypeBadge(row.original.transaction_type),
        size: 130
      },
      {
        header: 'Số tiền',
        cell: ({ row }: { row: any }) => (
          <span style={{ fontWeight: 600, color: 'var(--mui-palette-text-primary, #1e293b)' }}>
            {new Intl.NumberFormat('vi-VN').format(row.original.amount)} đ
          </span>
        ),
        size: 120
      },
      {
        header: 'Nội dung',
        size: isMobile ? 400 : 300,
        cell: ({ row }: { row: any }) => (
          <div className='d-flex flex-col gap-0.5' style={{ fontSize: '13px' }}>
            {row.original.tid && (
              <div style={{ color: 'var(--mui-palette-text-primary, #334155)' }}>Mã GD: {row.original.tid}</div>
            )}
            {row.original.description && (
              <div style={{ color: 'var(--mui-palette-text-primary, #334155)' }}>Nội dung: {row.original.description}</div>
            )}
            {row.original.deposit_type && (
              <div style={{ color: 'var(--mui-palette-text-disabled, #94a3b8)' }}>Nguồn: {row.original.deposit_type}</div>
            )}
          </div>
        )
      },
      {
        header: 'Trạng thái',
        size: 150,
        cell: ({ row }: { row: any }) => getStatusBadge(row.original.status, row.original.note)
      },
      {
        accessorKey: 'created_at',
        header: 'Thời gian',
        size: isMobile ? 200 : 150,
        cell: ({ row }: { row: any }) => (
          <div className='d-flex align-items-center gap-1' style={{ color: 'var(--mui-palette-text-secondary, #64748b)' }}>
            <Clock3 size={14} />
            <span style={{ fontSize: '13px' }}>{formatDateTimeLocal(row.original.created_at)}</span>
          </div>
        )
      }
    ],
    [isMobile]
  )

  const table = useReactTable({
    data: dataList,
    columns,
    state: {
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 20 }
    },
    getRowId: (row: any) => String(row.id)
  })

  // Selected IDs
  const selectedIds = useMemo(() => {
    return Object.keys(rowSelection)
      .filter(key => rowSelection[key])
      .map(key => {
        const row = dataList.find((item: any) => String(item.id) === key)
        return row?.id
      })
      .filter(Boolean) as number[]
  }, [rowSelection, dataList])

  // Delete handlers
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return
    setDeleteIds(selectedIds)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    deleteMutation.mutate(deleteIds, {
      onSuccess: () => {
        setDeleteDialogOpen(false)
        setDeleteIds([])
        setRowSelection({})
      }
    })
  }

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
              <h5 className='mb-0 font-semibold'>Lịch sử nạp tiền</h5>
            </div>
            <div className='header-right'>
              <div className='flex align-middle gap-2'>
                {/* Bulk delete button */}
                {selectedIds.length > 0 && (
                  <Button
                    variant='contained'
                    color='error'
                    size='small'
                    startIcon={<Trash2 size={16} />}
                    onClick={handleDeleteSelected}
                    sx={{ color: '#fff' }}
                  >
                    Xóa ({selectedIds.length})
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Filter bar — click "Tìm kiếm" mới apply */}
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
            {/* Status filter */}
            <CustomTextField
              select
              size='small'
              value={statusInput}
              onChange={e => setStatusInput(e.target.value)}
              sx={selectSx}
              slotProps={{ select: { displayEmpty: true } }}
            >
              <MenuItem value=''>
                <em>Tất cả trạng thái</em>
              </MenuItem>
              <MenuItem value='pending'>Chờ xử lý</MenuItem>
              <MenuItem value='success'>Thành công</MenuItem>
              <MenuItem value='failed'>Thất bại</MenuItem>
              <MenuItem value='cancelled'>Đã hủy</MenuItem>
              <MenuItem value='expired'>Hết hạn</MenuItem>
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
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleApplyFilters() }}
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

            {/* Nút tìm kiếm — ở cuối, loading + disable khi đang fetch */}
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
            {!!(statusFilter || limit !== 100 || sortOrder !== 'desc') && (
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
            <table className='data-table' style={{ minWidth: '1000px', ...(isLoading || dataList.length === 0 ? { height: '100%' } : {}) }}>
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
                          Không có dữ liệu
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
          {!isLoading && dataList.length > 0 && (
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
                <span>/ {new Intl.NumberFormat('vi-VN').format(dataList.length)} bản ghi {sortOrder === 'desc' ? 'mới nhất' : 'cũ nhất'}</span>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle sx={{ color: '#d32f2f' }}>Xác nhận xóa vĩnh viễn</DialogTitle>
        <DialogContent>
          Bạn có chắc muốn xóa <strong>{deleteIds.length}</strong> bản ghi nạp tiền?
          <br />
          <span style={{ fontSize: '13px', color: '#d32f2f', fontWeight: 500 }}>
            Hành động này sẽ xóa vĩnh viễn và không thể hoàn tác.
          </span>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteMutation.isPending}>
            Hủy
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={confirmDelete}
            disabled={deleteMutation.isPending}
            sx={{ color: '#fff' }}
          >
            {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
