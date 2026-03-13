'use client'

import { useMemo, useState, useCallback, useDeferredValue, useEffect } from 'react'

import Image from 'next/image'

import {
  List,
  SquarePen,
  Wallet,
  KeyRound,
  Search,
  Loader2,
  UserCog,
  UserPlus,
  Power,
  PowerOff,
  ShieldCheck,
  ShieldX
} from 'lucide-react'

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'
import Pagination from '@mui/material/Pagination'

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'

import Grid2 from '@mui/material/Grid2'

import { toast } from 'react-toastify'

import {
  useAdminResellers,
  useAdminResellerStats,
  useToggleResellerStatus,
  useAdjustResellerBalance
} from '@/hooks/apis/useAdminResellers'
import type { AdminReseller, ResellerStats } from '@/hooks/apis/useAdminResellers'

interface TableResellerProps {
  onOpenModal?: (type: 'create' | 'edit', data?: any) => void
  onViewCredentials?: (reseller: any) => void
}

const formatVND = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)

  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: color + '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Icon size={24} color={color} />
        </div>
        <div>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant='h6' fontWeight={600}>
            {value}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TableReseller({ onOpenModal, onViewCredentials }: TableResellerProps) {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })

  // Toggle status dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [resellerToToggle, setResellerToToggle] = useState<any>(null)

  // Balance dialog
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false)
  const [resellerToAdjust, setResellerToAdjust] = useState<any>(null)
  const [balanceType, setBalanceType] = useState<'add' | 'subtract'>('add')
  const [balanceAmount, setBalanceAmount] = useState('')
  const [balanceDescription, setBalanceDescription] = useState('')

  const { data: response, isLoading, isFetching } = useAdminResellers({ page: 1, per_page: 200, search })
  const { data: stats } = useAdminResellerStats()
  const toggleStatusMutation = useToggleResellerStatus()
  const adjustBalanceMutation = useAdjustResellerBalance()

  const rawResellers: AdminReseller[] = response?.data ?? []
  const resellers = useDeferredValue(rawResellers)
  const resellerStats: ResellerStats = stats ?? { total: 0, active: 0, suspended: 0, total_balance: 0 }

  const handleSearch = useCallback(() => {
    setSearch(searchInput)
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }, [searchInput])

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSearch()
    },
    [handleSearch]
  )

  // Toggle status
  const handleOpenStatusDialog = useCallback((reseller: any) => {
    setResellerToToggle(reseller)
    setStatusDialogOpen(true)
  }, [])

  const handleCloseStatusDialog = useCallback(() => {
    setStatusDialogOpen(false)
    setResellerToToggle(null)
  }, [])

  const handleConfirmToggleStatus = useCallback(() => {
    if (!resellerToToggle) return
    const currentStatus = resellerToToggle.reseller_profile?.status ?? 1
    const newStatus = currentStatus === 1 ? 0 : 1

    toggleStatusMutation.mutate(
      { userId: resellerToToggle.id, status: newStatus },
      {
        onSuccess: (data) => {
          toast.success(data?.message || 'Thành công')
          handleCloseStatusDialog()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
        }
      }
    )
  }, [resellerToToggle, toggleStatusMutation, handleCloseStatusDialog])

  // Balance
  const handleOpenBalanceDialog = useCallback((reseller: any) => {
    setResellerToAdjust(reseller)
    setBalanceType('add')
    setBalanceAmount('')
    setBalanceDescription('')
    setBalanceDialogOpen(true)
  }, [])

  const handleCloseBalanceDialog = useCallback(() => {
    setBalanceDialogOpen(false)
    setResellerToAdjust(null)
  }, [])

  const handleConfirmAdjustBalance = useCallback(() => {
    if (!resellerToAdjust) return
    const numAmount = Number(balanceAmount)

    if (!numAmount || numAmount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ')

      return
    }

    if (!balanceDescription.trim()) {
      toast.error('Vui lòng nhập lý do')

      return
    }

    const finalAmount = balanceType === 'subtract' ? -numAmount : numAmount

    adjustBalanceMutation.mutate(
      { userId: resellerToAdjust.id, amount: finalAmount, description: balanceDescription.trim() },
      {
        onSuccess: (data) => {
          toast.success(data?.message || 'Thành công')
          handleCloseBalanceDialog()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
        }
      }
    )
  }, [resellerToAdjust, balanceAmount, balanceDescription, balanceType, adjustBalanceMutation, handleCloseBalanceDialog])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60
      },
      {
        header: 'Reseller',
        cell: ({ row }: { row: any }) => (
          <div>
            <div className='font-bold'>{row.original?.name || '-'}</div>
            <div className='text-xs text-gray-500'>{row.original?.email || '-'}</div>
          </div>
        ),
        size: 200
      },
      {
        header: 'Công ty',
        cell: ({ row }: { row: any }) => row.original?.reseller_profile?.company_name || '-',
        size: 150
      },
      {
        header: 'Domain',
        cell: ({ row }: { row: any }) => row.original?.reseller_profile?.domain || '-',
        size: 150
      },
      {
        header: 'Số dư',
        cell: ({ row }: { row: any }) => (
          <span className='font-semibold'>{formatVND(row.original?.sodu ?? 0)}</span>
        ),
        size: 130
      },
      {
        header: 'Markup',
        cell: ({ row }: { row: any }) => {
          const markup = row.original?.reseller_profile?.default_markup_percent

          return markup != null ? `${markup}%` : '-'
        },
        size: 80
      },
      {
        header: 'Đơn hàng',
        cell: ({ row }: { row: any }) => row.original?.orders_count ?? 0,
        size: 80
      },
      {
        header: 'Trạng thái',
        cell: ({ row }: { row: any }) => {
          const status = row.original?.reseller_profile?.status

          return status === 1 ? (
            <Chip label='Active' size='small' icon={<ShieldCheck size={14} />} color='success' />
          ) : (
            <Chip label='Suspended' size='small' icon={<ShieldX size={14} />} color='error' />
          )
        },
        size: 120
      },
      {
        header: 'Ngày tạo',
        cell: ({ row }: { row: any }) => formatDate(row.original?.created_at),
        size: 100
      },
      {
        header: 'Thao tác',
        cell: ({ row }: { row: any }) => {
          const reseller = row.original
          const isActive = reseller?.reseller_profile?.status === 1

          return (
            <div className='flex gap-1'>
              <Tooltip title='Sửa thông tin'>
                <IconButton size='small' color='info' onClick={() => onOpenModal?.('edit', reseller)}>
                  <SquarePen size={17} />
                </IconButton>
              </Tooltip>

              <Tooltip title='API Credentials'>
                <IconButton size='small' color='primary' onClick={() => onViewCredentials?.(reseller)}>
                  <KeyRound size={17} />
                </IconButton>
              </Tooltip>

              <Tooltip title='Cộng/trừ tiền'>
                <IconButton size='small' color='success' onClick={() => handleOpenBalanceDialog(reseller)}>
                  <Wallet size={17} />
                </IconButton>
              </Tooltip>

              <Tooltip title={isActive ? 'Tạm ngưng' : 'Kích hoạt'}>
                <IconButton
                  size='small'
                  color={isActive ? 'error' : 'warning'}
                  onClick={() => handleOpenStatusDialog(reseller)}
                >
                  {isActive ? <PowerOff size={17} /> : <Power size={17} />}
                </IconButton>
              </Tooltip>
            </div>
          )
        },
        size: 200
      }
    ],
    [onOpenModal, onViewCredentials, handleOpenBalanceDialog, handleOpenStatusDialog]
  )

  const table = useReactTable({
    data: resellers,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const totalRows = resellers.length
  const { pageIndex, pageSize: displaySize } = pagination
  const startRow = totalRows > 0 ? pageIndex * displaySize + 1 : 0
  const endRow = Math.min(startRow + displaySize - 1, totalRows)

  return (
    <>
      {/* Stats Cards */}
      <Grid2 container spacing={2} sx={{ mb: 3 }}>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title='Tổng resellers' value={resellerStats.total} icon={UserCog} color='#7C3AED' />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title='Đang hoạt động' value={resellerStats.active} icon={ShieldCheck} color='#059669' />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title='Tạm ngưng' value={resellerStats.suspended} icon={ShieldX} color='#dc2626' />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title='Tổng số dư' value={formatVND(resellerStats.total_balance)} icon={Wallet} color='#D97706' />
        </Grid2>
      </Grid2>

      {/* Table */}
      <div className='orders-content'>
        <div className='table-container'>
          <div className='table-toolbar'>
            <div className='header-left'>
              <div className='page-icon'>
                <List size={17} />
              </div>
              <h5 className='mb-0 font-semibold'>Quản lý Reseller</h5>
            </div>

            <div className='header-right' style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <TextField
                size='small'
                placeholder='Tìm theo tên, email, công ty, domain...'
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                sx={{ width: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search size={16} />
                    </InputAdornment>
                  )
                }}
              />
              <Button
                variant='contained'
                size='small'
                onClick={handleSearch}
                disabled={isFetching}
                sx={{ color: '#fff', minWidth: 100 }}
                startIcon={
                  isFetching ? (
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Search size={16} />
                  )
                }
              >
                {isFetching ? 'Đang tải...' : 'Tìm kiếm'}
              </Button>
              <Button
                variant='contained'
                color='success'
                size='small'
                onClick={() => onOpenModal?.('create')}
                sx={{ color: '#fff', minWidth: 130 }}
                startIcon={<UserPlus size={16} />}
              >
                Thêm Reseller
              </Button>
            </div>
          </div>

          <div className='table-wrapper'>
            <table
              className='data-table'
              style={isLoading || resellers.length === 0 ? { height: '100%' } : {}}
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
                        <p className='loading-text'>Đang tải dữ liệu...</p>
                      </div>
                    </td>
                  </tr>
                ) : resellers.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className='py-10 text-center'>
                      <div className='flex flex-col items-center justify-center'>
                        <Image src='/images/no-data.png' alt='No data' width={160} height={160} />
                        <p className='mt-4 text-gray-500'>Chưa có reseller nào</p>
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
                      value={pagination.pageSize}
                      onChange={e => {
                        setPagination({ pageIndex: 0, pageSize: Number(e.target.value) })
                      }}
                      className='page-size-select'
                    >
                      <option value='20'>20</option>
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
                    <span>
                      {startRow} - {endRow} của {totalRows} reseller
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
                  page={pagination.pageIndex + 1}
                  onChange={(_, newPage) => {
                    setPagination(prev => ({ ...prev, pageIndex: newPage - 1 }))
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Status Confirmation Dialog */}
      <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog}>
        <DialogTitle>
          {resellerToToggle?.reseller_profile?.status === 1 ? 'Tạm ngưng Reseller' : 'Kích hoạt Reseller'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn{' '}
            {resellerToToggle?.reseller_profile?.status === 1 ? 'tạm ngưng' : 'kích hoạt lại'} reseller{' '}
            <strong>{resellerToToggle?.name}</strong> ({resellerToToggle?.email})?
            {resellerToToggle?.reseller_profile?.status === 1 && (
              <> API credentials sẽ ngừng hoạt động cho đến khi được kích hoạt lại.</>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog} variant='outlined' disabled={toggleStatusMutation.isPending}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirmToggleStatus}
            variant='contained'
            color={resellerToToggle?.reseller_profile?.status === 1 ? 'error' : 'success'}
            disabled={toggleStatusMutation.isPending}
            sx={{ color: '#fff' }}
          >
            {toggleStatusMutation.isPending
              ? 'Đang xử lý...'
              : resellerToToggle?.reseller_profile?.status === 1
                ? 'Tạm ngưng'
                : 'Kích hoạt'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Adjust Balance Dialog */}
      <Dialog open={balanceDialogOpen} onClose={handleCloseBalanceDialog} maxWidth='sm' fullWidth>
        <DialogTitle>Điều chỉnh số dư Reseller</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
            <Typography variant='body2' color='text.secondary'>
              Reseller: <strong>{resellerToAdjust?.name}</strong> ({resellerToAdjust?.email})
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Số dư hiện tại: <strong style={{ color: '#059669' }}>{formatVND(resellerToAdjust?.sodu ?? 0)}</strong>
            </Typography>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Typography variant='body2' sx={{ mb: 1 }}>
              Loại thao tác
            </Typography>
            <ToggleButtonGroup
              value={balanceType}
              exclusive
              onChange={(_, val) => val && setBalanceType(val)}
              size='small'
              fullWidth
            >
              <ToggleButton value='add' color='success'>
                Cộng tiền
              </ToggleButton>
              <ToggleButton value='subtract' color='error'>
                Trừ tiền
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          <TextField
            fullWidth
            label='Số tiền'
            type='text'
            value={balanceAmount}
            onChange={e => {
              const value = e.target.value.replace(/[^0-9]/g, '')

              setBalanceAmount(value)
            }}
            InputProps={{
              endAdornment: <span style={{ marginLeft: 8 }}>đ</span>
            }}
            helperText={balanceAmount ? `Số tiền: ${new Intl.NumberFormat('vi-VN').format(Number(balanceAmount))} đ` : ''}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label='Lý do'
            value={balanceDescription}
            onChange={e => setBalanceDescription(e.target.value)}
            placeholder='Nhập lý do cộng/trừ tiền...'
            required
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBalanceDialog} variant='tonal' color='secondary' disabled={adjustBalanceMutation.isPending}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirmAdjustBalance}
            variant='contained'
            color={balanceType === 'add' ? 'success' : 'error'}
            disabled={adjustBalanceMutation.isPending || !balanceAmount || !balanceDescription.trim()}
            sx={{ color: '#fff' }}
          >
            {adjustBalanceMutation.isPending
              ? 'Đang xử lý...'
              : balanceType === 'add'
                ? 'Cộng tiền'
                : 'Trừ tiền'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
