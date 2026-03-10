'use client'

import { useMemo, useState, useCallback, useEffect, useRef } from 'react'

import Image from 'next/image'

import {
  List,
  Clock3,
  Eye,
  CheckCircle,
  CircleQuestionMark,
  Loader2,
  Clock,
  AlertCircle,
  Search,
  X,
  UserCheck
} from 'lucide-react'

import { toast } from 'react-toastify'

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table'

import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Pagination from '@mui/material/Pagination'
import InputAdornment from '@mui/material/InputAdornment'

import { formatDateTimeLocal } from '@/utils/formatDate'
import {
  TICKET_STATUS,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_COLORS,
  TICKET_TYPE_LABELS
} from '@/constants'
import { useAdminTickets, useUpdateTicketStatus, useMarkTicketViewed } from '@/hooks/apis/useTickets'
import CustomTextField from '@/@core/components/mui/TextField'
import ResolveTicketDialog from './ResolveTicketDialog'
import TicketDetailDialog from '../../SupportTickets/TicketDetailDialog'

const selectSx = {
  minWidth: '140px',
  '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', minHeight: '38px' },
  '& .MuiSelect-select': { paddingBlock: '8.5px' }
}

export default function AdminTicketsPage() {
  const [statusInput, setStatusInput] = useState<string>('')
  const [typeInput, setTypeInput] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [isResolveOpen, setIsResolveOpen] = useState(false)

  const { data: tickets = [], isLoading, isFetching } = useAdminTickets({
    status: statusFilter || undefined,
    type: typeFilter || undefined
  })

  const updateStatus = useUpdateTicketStatus()
  const markViewed = useMarkTicketViewed()
  const viewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto mark viewed sau 3 giây khi admin mở detail dialog
  useEffect(() => {
    if (selectedTicket && !isResolveOpen) {
      viewTimerRef.current = setTimeout(() => {
        markViewed.mutate(selectedTicket.id)
      }, 3000)
    }

    return () => {
      if (viewTimerRef.current) {
        clearTimeout(viewTimerRef.current)
        viewTimerRef.current = null
      }
    }
  }, [selectedTicket, isResolveOpen])

  const handleApplyFilters = useCallback(() => {
    setStatusFilter(statusInput)
    setTypeFilter(typeInput)
  }, [statusInput, typeInput])

  const handleClearAll = useCallback(() => {
    setStatusInput('')
    setTypeInput('')
    setStatusFilter('')
    setTypeFilter('')
  }, [])

  const getStatusIcon = (status: number) => {
    switch (status) {
      case TICKET_STATUS.OPEN:
        return <AlertCircle size={14} />
      case TICKET_STATUS.PROCESSING:
        return <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
      case TICKET_STATUS.RESOLVED:
        return <CheckCircle size={14} />
      case TICKET_STATUS.CLOSED:
        return <Clock size={14} />
      default:
        return <CircleQuestionMark size={14} />
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60
      },
      {
        id: 'actions',
        header: 'Thao tác',
        size: 140,
        cell: ({ row }: { row: any }) => (
          <div className='flex gap-1'>
            <Tooltip title='Xem chi tiết'>
              <IconButton size='small' color='primary' onClick={() => setSelectedTicket(row.original)}>
                <Eye size={16} />
              </IconButton>
            </Tooltip>
            {row.original.status === TICKET_STATUS.OPEN && (
              <Tooltip title='Nhận xử lý'>
                <IconButton
                  size='small'
                  color='info'
                  disabled={updateStatus.isPending}
                  onClick={() => {
                    updateStatus.mutate(
                      { id: row.original.id, status: TICKET_STATUS.PROCESSING },
                      {
                        onSuccess: () => toast.success('Đã nhận xử lý ticket!'),
                        onError: (err: any) => toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
                      }
                    )
                  }}
                >
                  <UserCheck size={16} />
                </IconButton>
              </Tooltip>
            )}
            {(row.original.status === TICKET_STATUS.OPEN || row.original.status === TICKET_STATUS.PROCESSING) && (
              <Tooltip title='Xử lý ticket'>
                <IconButton
                  size='small'
                  color='success'
                  onClick={() => {
                    setSelectedTicket(row.original)
                    setIsResolveOpen(true)
                  }}
                >
                  <CheckCircle size={16} />
                </IconButton>
              </Tooltip>
            )}
          </div>
        )
      },
      {
        accessorKey: 'ticket_code',
        header: 'Mã ticket',
        size: 150,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontWeight: 600, fontSize: '13px' }}>{row.original.ticket_code}</span>
        )
      },
      {
        header: 'User',
        size: 180,
        cell: ({ row }: { row: any }) => (
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px' }}>{row.original.user?.name}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{row.original.user?.email}</div>
          </div>
        )
      },
      {
        accessorKey: 'type',
        header: 'Loại',
        size: 140,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontSize: '13px' }}>{TICKET_TYPE_LABELS[row.original.type] || row.original.type}</span>
        )
      },
      {
        header: 'Đơn hàng',
        size: 130,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontSize: '13px', color: row.original.order ? undefined : '#94a3b8' }}>
            {row.original.order?.order_code || '—'}
          </span>
        )
      },
      {
        accessorKey: 'message',
        header: 'Nội dung',
        size: 200,
        cell: ({ row }: { row: any }) => (
          <div style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
            {row.original.message}
          </div>
        )
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        size: 140,
        cell: ({ row }: { row: any }) => {
          const status = row.original.status

          
return (
            <Chip
              label={TICKET_STATUS_LABELS[status] || '?'}
              size='small'
              icon={getStatusIcon(status)}
              color={(TICKET_STATUS_COLORS[status] || 'default') as any}
            />
          )
        }
      },
      {
        header: 'Phụ trách',
        size: 120,
        cell: ({ row }: { row: any }) => {
          const assigned = row.original.assigned_to_user
          const processing = row.original.processing_by_user

          
return (
            <div style={{ fontSize: '13px' }}>
              {assigned ? (
                <span style={{ fontWeight: 600 }}>{assigned.name}</span>
              ) : processing ? (
                <span style={{ color: '#3b82f6' }}>{processing.name}</span>
              ) : (
                <span style={{ color: '#94a3b8' }}>—</span>
              )}
            </div>
          )
        }
      },
      {
        header: 'Đã xem',
        size: 110,
        cell: ({ row }: { row: any }) => {
          const viewed = row.original.viewed_by_user

          
return viewed ? (
            <span style={{ fontSize: '12px', color: '#64748b' }}>{viewed.name}</span>
          ) : (
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>—</span>
          )
        }
      },
      {
        accessorKey: 'created_at',
        header: 'Ngày tạo',
        size: 160,
        cell: ({ row }: { row: any }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '13px' }}>
            <Clock3 size={14} />
            {formatDateTimeLocal(row.original.created_at)}
          </div>
        )
      }
    ],
    []
  )

  const table = useReactTable({
    data: tickets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
    getRowId: (row: any) => String(row.id)
  })

  const hasActiveFilters = !!(statusFilter || typeFilter)

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
              <h5 className='mb-0 font-semibold'>Quản lý ticket hỗ trợ</h5>
            </div>
            <div className='header-right'>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                {!isLoading && tickets.length > 0 && `${tickets.length} ticket`}
              </span>
            </div>
          </div>

          {/* Filters */}
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
              <MenuItem value='0'>Chờ xử lý</MenuItem>
              <MenuItem value='1'>Đang xử lý</MenuItem>
              <MenuItem value='2'>Đã giải quyết</MenuItem>
              <MenuItem value='3'>Đã đóng</MenuItem>
            </CustomTextField>

            <CustomTextField
              select
              size='small'
              value={typeInput}
              onChange={e => setTypeInput(e.target.value)}
              sx={selectSx}
              slotProps={{ select: { displayEmpty: true } }}
            >
              <MenuItem value=''>
                <em>Tất cả loại</em>
              </MenuItem>
              <MenuItem value='partial_proxy'>Thiếu proxy</MenuItem>
              <MenuItem value='proxy_issue'>Lỗi proxy</MenuItem>
              <MenuItem value='refund_request'>Yêu cầu hoàn tiền</MenuItem>
              <MenuItem value='other'>Khác</MenuItem>
            </CustomTextField>

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
                minWidth: '110px'
              }}
            >
              {isFetching ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={15} />}
              {isFetching ? 'Đang tìm...' : 'Tìm kiếm'}
            </Button>

            {hasActiveFilters && (
              <Tooltip title='Đặt lại'>
                <IconButton
                  size='small'
                  onClick={handleClearAll}
                  sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)' } }}
                >
                  <X size={16} />
                </IconButton>
              </Tooltip>
            )}
          </div>

          {/* Table */}
          <div className='table-wrapper' style={{ overflowX: 'auto' }}>
            <table className='data-table' style={{ minWidth: '1200px', ...(isLoading || !tickets.length ? { height: '100%' } : {}) }}>
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
                          <span></span><span></span><span></span>
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
                        <p className='mt-4' style={{ color: '#94a3b8' }}>
                          {hasActiveFilters ? 'Không tìm thấy ticket phù hợp' : 'Không có ticket nào'}
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

          {/* Pagination */}
          {!isLoading && tickets.length > 0 && table.getPageCount() > 1 && (
            <div style={{ padding: '10px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <Pagination
                count={table.getPageCount()}
                page={table.getState().pagination.pageIndex + 1}
                onChange={(_, page) => table.setPageIndex(page - 1)}
                size='small'
                color='primary'
              />
            </div>
          )}
        </div>
      </div>

      {/* Detail dialog (read-only) */}
      <TicketDetailDialog
        open={!!selectedTicket && !isResolveOpen}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
      />

      {/* Resolve dialog */}
      <ResolveTicketDialog
        open={isResolveOpen}
        onClose={() => {
          setIsResolveOpen(false)
          setSelectedTicket(null)
        }}
        ticket={selectedTicket}
      />
    </>
  )
}
