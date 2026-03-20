'use client'

import { useMemo, useState } from 'react'

import Image from 'next/image'

import {
  List,
  Clock3,
  Eye,
  Plus,
  CircleQuestionMark,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle
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
import Pagination from '@mui/material/Pagination'

import { formatDateTimeLocal } from '@/utils/formatDate'
import { TICKET_STATUS, TICKET_STATUS_LABELS, TICKET_STATUS_COLORS, TICKET_TYPE_LABELS } from '@/constants'
import { useMyTickets } from '@/hooks/apis/useTickets'
import CreateTicketDialog from './CreateTicketDialog'
import TicketDetailDialog from './TicketDetailDialog'

export default function TicketsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [previewImage, setPreviewImage] = useState('')

  const resolveUrl = (path: string) => {
    if (!path || path.startsWith('http')) return path
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '')

    return apiBase ? `${apiBase}${path}` : path
  }

  const { data: tickets = [], isLoading } = useMyTickets()

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
        accessorKey: 'ticket_code',
        header: 'Mã ticket',
        size: 160,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontWeight: 600, fontSize: '13px' }}>{row.original.ticket_code}</span>
        )
      },
      {
        accessorKey: 'type',
        header: 'Loại',
        size: 150,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontSize: '13px' }}>{TICKET_TYPE_LABELS[row.original.type] || row.original.type}</span>
        )
      },
      {
        header: 'Tham chiếu',
        size: 160,
        cell: ({ row }: { row: any }) => {
          const t = row.original

          if (t.deposit) return (
            <div style={{ fontSize: '12px' }}>
              <div style={{ fontWeight: 600 }}>Nạp tiền #{t.deposit.id}</div>
              <div style={{ color: '#64748b' }}>{Number(t.deposit.amount).toLocaleString('vi-VN')}đ</div>
            </div>
          )

          if (t.order) return (
            <span style={{ fontSize: '12px', fontWeight: 600 }}>{t.order.order_code}</span>
          )

          return <span style={{ fontSize: '12px', color: '#94a3b8' }}>—</span>
        }
      },
      {
        accessorKey: 'message',
        header: 'Nội dung',
        size: 250,
        cell: ({ row }: { row: any }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px', flex: 1 }}>
              {row.original.message}
            </div>
            {row.original.image_url && (
              <div style={{ width: 28, height: 28, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                <img
                  src={resolveUrl(row.original.image_url)}
                  alt=''
                  style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); setPreviewImage(resolveUrl(row.original.image_url)) }}
                />
              </div>
            )}
          </div>
        )
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        size: 150,
        cell: ({ row }: { row: any }) => {
          const status = row.original.status
          const label = TICKET_STATUS_LABELS[status] || 'Không xác định'
          const color = TICKET_STATUS_COLORS[status] || 'default'

          return <Chip label={label} size='small' icon={getStatusIcon(status)} color={color as any} />
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
      },
      {
        id: 'actions',
        header: 'Chi tiết',
        size: 80,
        cell: ({ row }: { row: any }) => (
          <Tooltip title='Xem chi tiết'>
            <IconButton size='small' color='primary' onClick={() => setSelectedTicket(row.original)}>
              <Eye size={16} />
            </IconButton>
          </Tooltip>
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
              <h5 className='mb-0 font-semibold'>Hỗ trợ</h5>
            </div>
            <div className='header-right' style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {!isLoading && tickets.length > 0 && (
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>{tickets.length} ticket</span>
              )}
              <Button
                variant='contained'
                size='small'
                startIcon={<Plus size={16} />}
                onClick={() => setIsCreateOpen(true)}
                sx={{ textTransform: 'none', fontSize: '13px', fontWeight: 600, borderRadius: '8px', color: '#fff', boxShadow: 'none' }}
              >
                Tạo ticket
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className='table-wrapper' style={{ overflowX: 'auto' }}>
            <table className='data-table' style={{ minWidth: '900px', ...(isLoading || !tickets.length ? { height: '100%' } : {}) }}>
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
                        <p className='mt-4' style={{ color: '#94a3b8' }}>
                          Chưa có ticket nào
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

      <CreateTicketDialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <TicketDetailDialog open={!!selectedTicket} onClose={() => setSelectedTicket(null)} ticket={selectedTicket} />

      {/* Image preview */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage('')}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <img src={previewImage} alt='' style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8 }} />
        </div>
      )}
    </>
  )
}
