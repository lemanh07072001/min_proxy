'use client'

import { useCallback, useMemo, useState } from 'react'

import {
  Search, X, Clock3, CheckCircle2, XCircle, AlertTriangle,
  Ban, Eye, CalendarDays
} from 'lucide-react'
import {
  useReactTable, getCoreRowModel, flexRender, type ColumnDef
} from '@tanstack/react-table'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Pagination from '@mui/material/Pagination'

import CustomTextField from '@/@core/components/mui/TextField'
import useMediaQuery from '@/@menu/hooks/useMediaQuery'
import { formatDateTimeLocal } from '@/utils/formatDate'
import { useAdminDeposits } from '@/hooks/apis/useDepositManagement'
import InvestigationDrawer from './InvestigationDrawer'

/* ── Helpers ── */
const fmtDate = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()

  return `${dd}-${mm}-${yyyy}`
}

const fmtMoney = (n: number) => new Intl.NumberFormat('vi-VN').format(n)

const getDatePreset = (key: string): { start?: string; end?: string } => {
  const now = new Date()
  const end = fmtDate(now)

  switch (key) {
    case 'today': return { start: end, end }

    case '7d': {
      const d = new Date();

 d.setDate(d.getDate() - 6)

      return { start: fmtDate(d), end }
    }

    case '30d': {
      const d = new Date();

 d.setDate(d.getDate() - 29)

      return { start: fmtDate(d), end }
    }

    default: return {}
  }
}

const statusConfig: Record<string, { label: string; color: 'warning' | 'success' | 'error' | 'default'; icon: React.ReactNode }> = {
  pending: { label: 'Đang chờ', color: 'warning', icon: <Clock3 size={12} /> },
  success: { label: 'Thành công', color: 'success', icon: <CheckCircle2 size={12} /> },
  failed: { label: 'Thất bại', color: 'error', icon: <XCircle size={12} /> },
  expired: { label: 'Hết hạn', color: 'default', icon: <AlertTriangle size={12} /> },
  cancelled: { label: 'Đã hủy', color: 'default', icon: <Ban size={12} /> }
}

const depositTypeLabels: Record<string, string> = {
  auto: 'Tự động',
  pay2s: 'Pay2s',
  manual: 'Thủ công'
}

/* ── Styles ── */
const selectSx = {
  minWidth: '140px',
  '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', minHeight: '38px' },
  '& .MuiSelect-select': { paddingBlock: '8.5px' }
}

const presetBtnSx = (active: boolean) => ({
  height: '32px', fontSize: '12px', fontWeight: active ? 700 : 500,
  textTransform: 'none' as const, borderRadius: '16px', px: 1.5,
  minWidth: 'auto', boxShadow: 'none',
  ...(active
    ? { backgroundColor: 'var(--mui-palette-primary-main)', color: '#fff', '&:hover': { backgroundColor: 'var(--mui-palette-primary-dark)' } }
    : { backgroundColor: 'var(--mui-palette-action-hover, #f1f5f9)', color: 'var(--mui-palette-text-secondary)', '&:hover': { backgroundColor: '#e2e8f0' } }
  )
})

/* ── Component ── */
export default function TabDepositRequests() {
  const isMobile = useMediaQuery('768px')

  // Filters
  const [datePreset, setDatePreset] = useState<string>('today')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // Investigation drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerBankAutoId, setDrawerBankAutoId] = useState<number | null>(null)
  const [drawerHeaderInfo, setDrawerHeaderInfo] = useState<any>(null)

  // Build params
  const dateRange = useMemo(() => getDatePreset(datePreset), [datePreset])

  const params = useMemo(() => ({
    ...dateRange,
    ...(statusFilter && { status: statusFilter }),
    ...(typeFilter && { deposit_type: typeFilter }),
    ...(search && { search }),
    page,
    per_page: 50
  }), [dateRange, statusFilter, typeFilter, search, page])

  const { data: result, isLoading } = useAdminDeposits(params)
  const deposits = result?.data || []
  const meta = result?.meta || { current_page: 1, last_page: 1, total: 0 }
  const summary = result?.summary || {}

  // Open investigation
  const openInvestigation = useCallback((row: any) => {
    setDrawerBankAutoId(row.id)
    setDrawerHeaderInfo({
      amount: row.amount,
      userName: row.user?.name,
      userEmail: row.user?.email,
      gateway: row.gateway
    })
    setDrawerOpen(true)
  }, [])

  // Columns
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      id: 'created_at',
      header: 'Thời gian',
      size: 140,
      cell: ({ row }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CalendarDays size={13} color='#94a3b8' />
          <span style={{ fontSize: 12 }}>{row.original.created_at ? formatDateTimeLocal(row.original.created_at) : '—'}</span>
        </div>
      )
    },
    {
      id: 'user',
      header: 'User',
      size: 180,
      cell: ({ row }) => {
        const u = row.original.user

        return u ? (
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{u.email}</div>
          </div>
        ) : <span style={{ fontSize: 12, color: '#94a3b8' }}>—</span>
      }
    },
    {
      id: 'amount',
      header: 'Số tiền',
      size: 120,
      cell: ({ row }) => (
        <span style={{ fontSize: 13, fontWeight: 600, color: '#16a34a' }}>
          +{fmtMoney(row.original.amount)}đ
        </span>
      )
    },
    {
      id: 'deposit_type',
      header: 'Nguồn',
      size: 90,
      cell: ({ row }) => (
        <Chip
          label={depositTypeLabels[row.original.deposit_type] || row.original.deposit_type || '—'}
          size='small'
          variant='outlined'
          sx={{ fontSize: 11 }}
        />
      )
    },
    {
      id: 'status',
      header: 'Trạng thái',
      size: 110,
      cell: ({ row }) => {
        const cfg = statusConfig[row.original.status] || statusConfig.pending

        return (
          <Chip
            icon={cfg.icon as any}
            label={cfg.label}
            size='small'
            color={cfg.color}
            variant={row.original.status === 'pending' ? 'filled' : 'outlined'}
            sx={{ fontSize: 11 }}
          />
        )
      }
    },
    {
      id: 'processed_by',
      header: 'Xử lý bởi',
      size: 120,
      cell: ({ row }) => {
        const pb = row.original.processed_by_user || row.original.processed_by_relation

        if (row.original.status !== 'success') return <span style={{ fontSize: 12, color: '#d1d5db' }}>—</span>

        return (
          <span style={{ fontSize: 12, color: '#64748b' }}>
            {row.original.deposit_type === 'manual'
              ? (pb?.name || `Admin #${row.original.processed_by}`)
              : 'Tự động'
            }
          </span>
        )
      }
    },
    {
      id: 'actions',
      header: '',
      size: 50,
      cell: ({ row }) => (
        <Tooltip title='Điều tra'>
          <IconButton size='small' onClick={() => openInvestigation(row.original)}>
            <Eye size={16} />
          </IconButton>
        </Tooltip>
      )
    }
  ], [openInvestigation])

  const table = useReactTable({
    data: deposits,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div style={{ padding: isMobile ? '12px' : '20px' }}>
      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        {[
          { label: 'Tổng lệnh', value: summary.total || 0, color: '#64748b' },
          { label: 'Đang chờ', value: summary.count_pending || 0, color: (summary.count_pending || 0) > 0 ? '#f59e0b' : '#16a34a' },
          { label: 'Thành công', value: summary.count_success || 0, color: '#16a34a' },
          { label: 'Tổng nạp', value: `${fmtMoney(summary.total_credited || 0)}đ`, color: '#2563eb' }
        ].map(c => (
          <div key={c.label} style={{
            flex: '1 1 140px', padding: '14px 16px', borderRadius: 10,
            border: '1px solid #e5e7eb', background: '#fff'
          }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
        marginBottom: 16, padding: '12px 16px', borderRadius: 10,
        border: '1px solid #e5e7eb', background: '#fafafa'
      }}>
        {/* Date presets */}
        {(['today', '7d', '30d', 'all'] as const).map(k => (
          <Button
            key={k}
            size='small'
            onClick={() => { setDatePreset(k); setPage(1) }}
            sx={presetBtnSx(datePreset === k)}
          >
            {{ today: 'Hôm nay', '7d': '7 ngày', '30d': '30 ngày', all: 'Tất cả' }[k]}
          </Button>
        ))}

        <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 4px' }} />

        {/* Status filter */}
        <CustomTextField select size='small' value={statusFilter} onChange={(e: any) => { setStatusFilter(e.target.value); setPage(1) }} sx={selectSx} label='Trạng thái'>
          <MenuItem value=''>Tất cả</MenuItem>
          <MenuItem value='pending'>Đang chờ</MenuItem>
          <MenuItem value='success'>Thành công</MenuItem>
          <MenuItem value='expired'>Hết hạn</MenuItem>
          <MenuItem value='failed'>Thất bại</MenuItem>
          <MenuItem value='cancelled'>Đã hủy</MenuItem>
        </CustomTextField>

        {/* Deposit type filter */}
        <CustomTextField select size='small' value={typeFilter} onChange={(e: any) => { setTypeFilter(e.target.value); setPage(1) }} sx={selectSx} label='Nguồn'>
          <MenuItem value=''>Tất cả</MenuItem>
          <MenuItem value='auto'>Tự động</MenuItem>
          <MenuItem value='pay2s'>Pay2s</MenuItem>
          <MenuItem value='manual'>Thủ công</MenuItem>
        </CustomTextField>

        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type='text'
            placeholder='Tìm user, mã GD...'
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            style={{
              width: '100%', padding: '8px 30px 8px 32px', fontSize: 13,
              border: '1px solid #e2e8f0', borderRadius: 8, outline: 'none',
              background: '#fff'
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 2
            }}>
              <X size={14} color='#94a3b8' />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} style={{ borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>
                {hg.headers.map(h => (
                  <th key={h.id} style={{
                    padding: '10px 14px', textAlign: 'left', fontSize: 12,
                    fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap'
                  }}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Đang tải...</td></tr>
            ) : deposits.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Không có dữ liệu</td></tr>
            ) : table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                onClick={() => openInvestigation(row.original)}
                style={{
                  borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                  background: row.original.status === 'pending' ? '#fffbeb' : undefined
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseLeave={e => (e.currentTarget.style.background = row.original.status === 'pending' ? '#fffbeb' : '')}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} style={{ padding: '10px 14px' }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <Pagination
            count={meta.last_page}
            page={meta.current_page}
            onChange={(_, p) => setPage(p)}
            size='small'
            color='primary'
          />
        </div>
      )}

      {/* Investigation Drawer */}
      <InvestigationDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setDrawerBankAutoId(null) }}
        source='bank_auto'
        sourceId={drawerBankAutoId}
        headerInfo={drawerHeaderInfo}
      />
    </div>
  )
}
