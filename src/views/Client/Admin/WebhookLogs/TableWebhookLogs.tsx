'use client'

import { useCallback, useMemo, useState } from 'react'

import Image from 'next/image'

import {
  Search, X, Loader2, Clock3, Webhook, Eye,
  CheckCircle2, XCircle, AlertTriangle, Info
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
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

import CustomTextField from '@/@core/components/mui/TextField'
import useMediaQuery from '@/@menu/hooks/useMediaQuery'
import { formatDateTimeLocal } from '@/utils/formatDate'
import { useWebhookLogs } from '@/hooks/apis/useTransactionBank'

const selectSx = {
  minWidth: '140px',
  '& .MuiOutlinedInput-root': { fontSize: '13px', borderRadius: '8px', minHeight: '38px' },
  '& .MuiSelect-select': { paddingBlock: '8.5px' }
}

const chipSx = { '& .MuiChip-label': { whiteSpace: 'nowrap' as const } }

function getStatusInfo(code: number): { label: string; color: 'success' | 'error' | 'warning' | 'default'; icon: React.ReactNode } {
  if (code >= 200 && code < 300) return { label: 'Thành công', color: 'success', icon: <CheckCircle2 size={14} /> }
  if (code === 401) return { label: 'Từ chối', color: 'warning', icon: <AlertTriangle size={14} /> }
  if (code >= 500) return { label: 'Lỗi hệ thống', color: 'error', icon: <XCircle size={14} /> }
  
return { label: `Mã ${code}`, color: 'default', icon: <Info size={14} /> }
}

export default function TableWebhookLogs() {
  const isMobile = useMediaQuery('768px')

  // Staged filters
  const [responseCodeInput, setResponseCodeInput] = useState('')

  // Applied filters
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, per_page: 50 })

  // Detail modal
  const [detailRow, setDetailRow] = useState<any>(null)

  const handleApplyFilters = useCallback(() => {
    setFilters({
      ...(responseCodeInput ? { response_code: responseCodeInput } : {}),
      page: 1,
      per_page: 50
    })
  }, [responseCodeInput])

  const handleClearAll = useCallback(() => {
    setResponseCodeInput('')
    setFilters({ page: 1, per_page: 50 })
  }, [])

  const hasFilters = !!responseCodeInput

  // Data
  const { data: apiResponse, isLoading, isFetching } = useWebhookLogs(filters)

  const dataList = useMemo(() => apiResponse?.data ?? [], [apiResponse])
  const meta = apiResponse?.meta

  // Columns — đơn giản, dễ hiểu
  const columns: ColumnDef<any, any>[] = useMemo(
    () => [
      {
        accessorKey: 'created_at',
        header: 'Thời gian',
        size: 160,
        cell: ({ row }: { row: any }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--mui-palette-text-secondary, #64748b)' }}>
            <Clock3 size={13} />
            <span style={{ fontSize: '12px' }}>{formatDateTimeLocal(row.original.created_at)}</span>
          </div>
        )
      },
      {
        accessorKey: 'partner',
        header: 'Nguồn',
        size: 100,
        cell: ({ row }: { row: any }) => (
          <Chip label={row.original.partner || '—'} size='small' variant='outlined' sx={chipSx} />
        )
      },
      {
        accessorKey: 'transactions_count',
        header: 'Số giao dịch',
        size: 100,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontWeight: 600, fontSize: '13px' }}>
            {row.original.transactions_count ?? 0} giao dịch
          </span>
        )
      },
      {
        accessorKey: 'response_code',
        header: 'Kết quả',
        size: 130,
        cell: ({ row }: { row: any }) => {
          const info = getStatusInfo(row.original.response_code)

          
return <Chip label={info.label} size='small' color={info.color} icon={info.icon} sx={chipSx} />
        }
      },
      {
        accessorKey: 'ip_address',
        header: 'Địa chỉ IP',
        size: 130,
        cell: ({ row }: { row: any }) => (
          <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--mui-palette-text-disabled)' }}>
            {row.original.ip_address || '—'}
          </span>
        )
      },
      {
        id: 'actions',
        header: '',
        size: 50,
        cell: ({ row }: { row: any }) => (
          <Tooltip title='Xem dữ liệu gốc'>
            <IconButton size='small' onClick={() => setDetailRow(row.original)}
              sx={{ color: 'var(--mui-palette-text-disabled)', '&:hover': { color: 'var(--mui-palette-primary-main)' } }}>
              <Eye size={15} />
            </IconButton>
          </Tooltip>
        )
      }
    ],
    [isMobile]
  )

  const table = useReactTable({
    data: dataList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row: any) => String(row.id),
    manualPagination: true,
    pageCount: meta?.last_page ?? 1
  })

  return (
    <div className='orders-content'>
      <div className='table-container'>
        {/* Header */}
        <div className='table-toolbar w-full'>
          <div className='header-left'>
            <div className='page-icon'><Webhook size={17} /></div>
            <div>
              <h5 className='mb-0 font-semibold'>Nhật ký nhận dữ liệu</h5>
              <p style={{ fontSize: '12px', color: 'var(--mui-palette-text-disabled, #94a3b8)', margin: 0 }}>
                Mỗi lần ngân hàng gửi thông báo giao dịch về hệ thống sẽ được ghi lại ở đây
              </p>
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 16px',
          background: '#eff6ff', borderBottom: '1px solid #bfdbfe', fontSize: '12px', color: '#1e40af'
        }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>
            Trang này dành cho kiểm tra kỹ thuật. Để xem giao dịch nạp tiền, vui lòng dùng trang <strong>Giao dịch ngân hàng</strong>.
          </span>
        </div>

        {/* Filter bar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px',
          padding: '10px 16px', borderBottom: '1px solid var(--border-color, #e2e8f0)',
          background: 'var(--mui-palette-background-default, #f8fafc)'
        }}>
          <CustomTextField select size='small' value={responseCodeInput} onChange={e => setResponseCodeInput(e.target.value)}
            sx={{ ...selectSx, minWidth: '160px' }} slotProps={{ select: { displayEmpty: true } }}>
            <MenuItem value=''><em>Tất cả kết quả</em></MenuItem>
            <MenuItem value='200'>Thành công (200)</MenuItem>
            <MenuItem value='401'>Từ chối (401)</MenuItem>
            <MenuItem value='500'>Lỗi hệ thống (500)</MenuItem>
          </CustomTextField>

          <Button variant='contained' size='small' onClick={handleApplyFilters} disabled={isFetching}
            sx={{ height: '38px', fontSize: '13px', fontWeight: 600, textTransform: 'none', borderRadius: '8px', boxShadow: 'none', gap: '4px', color: '#fff', px: 2, minWidth: '100px',
              '&.Mui-disabled': { backgroundColor: 'var(--mui-palette-primary-main)', opacity: 0.65, color: '#fff' }
            }}>
            {isFetching ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={15} />}
            {isFetching ? 'Đang tìm...' : 'Lọc'}
          </Button>

          {hasFilters && (
            <Tooltip title='Đặt lại'>
              <IconButton size='small' onClick={handleClearAll}
                sx={{ color: 'var(--mui-palette-text-disabled, #94a3b8)', '&:hover': { color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)' } }}>
                <X size={16} />
              </IconButton>
            </Tooltip>
          )}
        </div>

        {/* Table */}
        <div className='table-wrapper' style={{ overflowX: 'auto' }}>
          <table className='data-table' style={{ minWidth: '700px', ...(isLoading || dataList.length === 0 ? { height: '100%' } : {}) }}>
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
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className='py-10 text-center'>
                    <div className='flex flex-col items-center justify-center'>
                      <Image src='/images/no-data.png' alt='No data' width={160} height={160} />
                      <p className='mt-4' style={{ color: 'var(--mui-palette-text-disabled, #94a3b8)' }}>Không có dữ liệu</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => {
                  const isFailed = row.original.response_code >= 400

                  
return (
                    <tr className='table-row' key={row.id}
                      style={{
                        cursor: 'pointer',
                        ...(isFailed ? { backgroundColor: 'rgba(239, 68, 68, 0.03)' } : {})
                      }}
                      onClick={() => setDetailRow(row.original)}
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
        {!isLoading && meta && meta.last_page > 1 && (
          <div style={{
            padding: '10px 16px', borderTop: '1px solid var(--border-color, #e2e8f0)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px'
          }}>
            <span style={{ fontSize: '13px', color: 'var(--mui-palette-text-secondary, #64748b)' }}>
              Tổng {new Intl.NumberFormat('vi-VN').format(meta.total)} bản ghi
            </span>
            <Pagination
              count={meta.last_page}
              page={meta.current_page}
              onChange={(_, page) => setFilters(prev => ({ ...prev, page }))}
              size='small'
              color='primary'
            />
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!detailRow} onClose={() => setDetailRow(null)} maxWidth='md' fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <span style={{ fontSize: '16px', fontWeight: 600 }}>
            Dữ liệu gốc #{detailRow?.id}
          </span>
          <IconButton size='small' onClick={() => setDetailRow(null)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {detailRow && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Summary */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', padding: '8px 0' }}>
                <div><strong>Nguồn:</strong> {detailRow.partner}</div>
                <div><strong>Kết quả:</strong> {getStatusInfo(detailRow.response_code).label}</div>
                <div><strong>Số giao dịch:</strong> {detailRow.transactions_count}</div>
                <div><strong>Thời gian:</strong> {formatDateTimeLocal(detailRow.created_at)}</div>
                <div><strong>IP:</strong> {detailRow.ip_address}</div>
              </div>

              {/* Payload */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--mui-palette-text-secondary)' }}>
                  Nội dung gửi đến (payload)
                </div>
                <pre style={{
                  background: 'var(--mui-palette-background-default, #f1f5f9)', padding: '12px',
                  borderRadius: '8px', fontSize: '12px', overflow: 'auto', maxHeight: '300px',
                  border: '1px solid var(--border-color, #e2e8f0)'
                }}>
                  {JSON.stringify(detailRow.payload, null, 2)}
                </pre>
              </div>

              {/* Headers */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--mui-palette-text-secondary)' }}>
                  Thông tin kỹ thuật (headers)
                </div>
                <pre style={{
                  background: 'var(--mui-palette-background-default, #f1f5f9)', padding: '12px',
                  borderRadius: '8px', fontSize: '12px', overflow: 'auto', maxHeight: '200px',
                  border: '1px solid var(--border-color, #e2e8f0)'
                }}>
                  {JSON.stringify(detailRow.headers, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
