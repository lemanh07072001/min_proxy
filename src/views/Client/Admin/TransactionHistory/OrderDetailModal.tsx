import { useMemo, useState, useEffect } from 'react'

import {
  X,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  Loader2,
  CircleX,
  RotateCcw,
  BadgeCheck,
  BadgeMinus,
  AlertCircle,
  Copy,
  Clock3,
  Download,
  FileText,
  ArrowRight,
  Zap,
  Globe,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from '@tanstack/react-table'
import Dialog from '@mui/material/Dialog'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { Chip, Checkbox, CircularProgress } from '@mui/material'

import { formatDateTimeLocal } from '@/utils/formatDate'
import { ORDER_STATUS_LABELS_ADMIN, ORDER_STATUS, ORDER_STATUS_COLORS } from '@/constants'
import { useApiKeys } from '@/hooks/apis/useOrders'
import { useOrderLogs, type OrderLog } from '@/hooks/apis/useOrderLogs'

interface OrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  orderData: any
  isLoading?: boolean
}

const formatVND = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ'

// Log action → icon + color + label
const LOG_ACTION_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  created: { icon: Zap, color: '#3b82f6', label: 'Tạo đơn' },
  processing: { icon: Loader2, color: '#f59e0b', label: 'Bắt đầu xử lý' },
  in_use: { icon: BadgeCheck, color: '#22c55e', label: 'Hoàn thành' },
  completed: { icon: BadgeCheck, color: '#22c55e', label: 'Hoàn thành' },
  in_use_partial: { icon: AlertCircle, color: '#f97316', label: 'Thiếu proxy' },
  failed: { icon: CircleX, color: '#ef4444', label: 'Thất bại' },
  expired: { icon: Clock, color: '#94a3b8', label: 'Hết hạn' },
  retry: { icon: RefreshCw, color: '#a855f7', label: 'Retry' },
  api_call_start: { icon: Globe, color: '#6366f1', label: 'Gọi API nhà cung cấp' },
  api_call_success: { icon: CheckCircle, color: '#22c55e', label: 'API thành công' },
  api_call_error: { icon: AlertTriangle, color: '#ef4444', label: 'API lỗi' },
  admin_retry_partial: { icon: RefreshCw, color: '#a855f7', label: 'Admin mua bù' },
  admin_refund_partial: { icon: RotateCcw, color: '#ec4899', label: 'Admin hoàn tiền' },
  auto_recovered: { icon: Zap, color: '#14b8a6', label: 'Tự động phục hồi' }
}

export default function OrderDetailModal({ isOpen, onClose, orderData, isLoading = false }: OrderDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [rowSelection, setRowSelection] = useState({})
  const [tabIndex, setTabIndex] = useState(0)

  const orderId = orderData?.order?.id
  const { data: dataApiKeys, isLoading: loadingApiKeys } = useApiKeys(orderId, isOpen)
  const { data: orderLogs = [], isLoading: loadingLogs } = useOrderLogs(orderId, isOpen)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const downloadApiKeys = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const keys = selectedRows.length > 0
      ? selectedRows.map((r: any) => r.original.api_key || getProxyText(r.original)).join('\n')
      : (dataApiKeys || []).map((item: any) => item.api_key || getProxyText(item)).join('\n')

    const blob = new Blob([keys], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `keys-${orderData?.order?.order_code || 'export'}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getProxyText = (item: any) => {
    const p = item.proxys

    if (p && typeof p === 'object') return p.HTTP || p.SOCK5 || '-'
    
return p || '-'
  }

  const getStatusBadge = (status: string) => {
    const label = ORDER_STATUS_LABELS_ADMIN[status]
    const color = ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS]

    if (!label) return <Chip label='?' size='small' color='default' />

    const isPending = [ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING, ORDER_STATUS.RETRY_PROCESSING_PARTIAL].includes(status as any)

    return (
      <Chip
        label={label}
        size='small'
        color={color as any}
        icon={isPending ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : undefined}
      />
    )
  }

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: any }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            size='small'
          />
        ),
        cell: ({ row }: { row: any }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            size='small'
          />
        ),
        size: 40
      },
      {
        header: 'ApiKey / Proxy',
        size: 220,
        cell: ({ row }: { row: any }) => {
          const text = row.original.api_key || getProxyText(row.original)

          
return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: '12px' }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
              {text !== '-' && (
                <button
                  onClick={() => copyToClipboard(text, `key-${row.id}`)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: copiedField === `key-${row.id}` ? '#16a34a' : '#94a3b8' }}
                >
                  {copiedField === `key-${row.id}` ? <CheckCircle size={13} /> : <Copy size={13} />}
                </button>
              )}
            </div>
          )
        }
      },
      {
        header: 'Loại', size: 80,
        cell: ({ row }: { row: any }) => <span style={{ fontSize: '12px' }}>{row.original.plan_type ?? '-'}</span>
      },
      {
        header: 'Trạng thái', size: 100,
        cell: ({ row }: { row: any }) => {
          const s = row.original?.status

          if (s === 'ACTIVE') return <Chip label='Hoạt động' size='small' icon={<BadgeCheck size={14} />} color='success' />
          if (s === 'INACTIVE') return <Chip label='Đã tắt' size='small' icon={<BadgeMinus size={14} />} color='warning' />
          
return <Chip label='Hết hạn' size='small' icon={<CircleX size={14} />} color='error' />
        }
      },
      {
        header: 'Hết hạn', size: 150,
        cell: ({ row }: { row: any }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: '12px' }}>
            <Clock3 size={12} />
            {formatDateTimeLocal(row.original.expired_at)}
          </div>
        )
      }
    ],
    [copiedField]
  )

  const table = useReactTable({
    data: dataApiKeys || [],
    columns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } }
  })

  useEffect(() => {
    if (!isOpen) { setRowSelection({}); setTabIndex(0) }
  }, [isOpen])

  if (!isOpen) return null

  const order = orderData?.order
  const selectedCount = Object.keys(rowSelection).length

  return (
    <Dialog
      onClose={onClose}
      open={isOpen}
      closeAfterTransition={false}
      maxWidth='md'
      fullWidth
      PaperProps={{ sx: { borderRadius: '12px', maxHeight: '85vh', mt: '5vh', mb: 'auto' } }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 20px', borderBottom: '1px solid #f1f5f9'
      }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>Chi tiết đơn hàng</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: 2 }}>#{order?.order_code || '—'}</div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#94a3b8' }}
        >
          <X size={20} />
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#64748b' }} />
          <p style={{ color: '#64748b', marginTop: 12 }}>Đang tải...</p>
        </div>
      ) : (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(85vh - 65px)' }}>
          {/* Order info grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 10, padding: '16px 20px'
          }}>
            <InfoCell label='Khách hàng' value={orderData?.order?.user_name || orderData?.user?.name || '—'} icon={<User size={14} />} />
            <InfoCell label='Dịch vụ' value={order?.service_name || '—'} icon={<Globe size={14} />} />
            <InfoCell label='Số lượng' value={
              order?.delivered_quantity != null && order?.delivered_quantity !== order?.quantity
                ? `${order.delivered_quantity}/${order.quantity}`
                : String(order?.quantity || 0)
            } icon={<FileText size={14} />} />
            <InfoCell label='Doanh thu' value={formatVND(order?.total_amount || 0)} highlight icon={<DollarSign size={14} />} />
            <InfoCell label='Vốn' value={formatVND(order?.total_cost || 0)} icon={<DollarSign size={14} />} />
            <div style={{ padding: '8px 10px', borderRadius: 8, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: 4 }}>Trạng thái</div>
              {getStatusBadge(String(order?.status))}
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={tabIndex}
            onChange={(_, v) => setTabIndex(v)}
            sx={{
              borderBottom: '1px solid #f1f5f9', px: '20px',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '13px', minHeight: 42 }
            }}
          >
            <Tab label={`Proxy (${dataApiKeys?.length || 0})`} />
            <Tab label={`Logs (${orderLogs.length})`} />
          </Tabs>

          {/* Tab content */}
          <div style={{ padding: '16px 20px' }}>
            {tabIndex === 0 && (
              <>
                {/* Copy/Download buttons */}
                {selectedCount > 0 && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Đã chọn: {selectedCount}</span>
                    <button
                      onClick={() => {
                        const rows = table.getFilteredSelectedRowModel().rows
                        const keys = rows.map((r: any) => r.original.api_key || getProxyText(r.original)).join('\n')

                        copyToClipboard(keys, 'bulk')
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '4px 10px', fontSize: '12px', fontWeight: 500,
                        background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
                        borderRadius: 6, cursor: 'pointer'
                      }}
                    >
                      <Copy size={13} /> {copiedField === 'bulk' ? 'Đã copy!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadApiKeys}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '4px 10px', fontSize: '12px', fontWeight: 500,
                        background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe',
                        borderRadius: 6, cursor: 'pointer'
                      }}
                    >
                      <Download size={13} /> Tải
                    </button>
                  </div>
                )}

                {loadingApiKeys ? (
                  <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <CircularProgress size={24} />
                    <p style={{ color: '#64748b', fontSize: '13px', marginTop: 8 }}>Đang tải proxy...</p>
                  </div>
                ) : dataApiKeys && dataApiKeys.length > 0 ? (
                  <>
                    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          {table.getHeaderGroups().map(hg => (
                            <tr key={hg.id}>
                              {hg.headers.map(h => (
                                <th key={h.id} style={{
                                  width: h.getSize(), padding: '8px 10px', textAlign: 'left',
                                  background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
                                  fontSize: '12px', fontWeight: 600, color: '#64748b'
                                }}>
                                  {flexRender(h.column.columnDef.header, h.getContext())}
                                </th>
                              ))}
                            </tr>
                          ))}
                        </thead>
                        <tbody>
                          {table.getRowModel().rows.map(row => (
                            <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              {row.getVisibleCells().map(cell => (
                                <td key={cell.id} style={{ padding: '8px 10px' }}>
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()} ({dataApiKeys.length} keys)
                      </span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => table.previousPage()}
                          disabled={!table.getCanPreviousPage()}
                          style={navBtnStyle(!table.getCanPreviousPage())}
                        >
                          Trước
                        </button>
                        <button
                          onClick={() => table.nextPage()}
                          disabled={!table.getCanNextPage()}
                          style={navBtnStyle(!table.getCanNextPage())}
                        >
                          Sau
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 0', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                    <p style={{ color: '#94a3b8', fontSize: '13px' }}>Chưa có proxy</p>
                  </div>
                )}
              </>
            )}

            {tabIndex === 1 && (
              <OrderLogsTimeline logs={orderLogs} isLoading={loadingLogs} />
            )}
          </div>
        </div>
      )}
    </Dialog>
  )
}

// ====== Sub-components ======

function InfoCell({ label, value, icon, highlight }: { label: string; value: string; icon?: React.ReactNode; highlight?: boolean }) {
  return (
    <div style={{ padding: '8px 10px', borderRadius: 8, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
        <span style={{ color: '#94a3b8' }}>{icon}</span>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{label}</span>
      </div>
      <div style={{ fontSize: '13px', fontWeight: highlight ? 700 : 600, color: highlight ? 'var(--primary-color)' : '#1e293b' }}>
        {value}
      </div>
    </div>
  )
}

function OrderLogsTimeline({ logs, isLoading }: { logs: OrderLog[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '30px 0' }}>
        <CircularProgress size={24} />
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: 8 }}>Đang tải logs...</p>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '30px 0', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
        <FileText size={20} color='#94a3b8' />
        <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: 8 }}>Chưa có log nào</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {logs.map((log, i) => {
        const config = LOG_ACTION_CONFIG[log.action] || { icon: FileText, color: '#94a3b8', label: log.action }
        const Icon = config.icon
        const isLast = i === logs.length - 1
        const isError = log.action.includes('error') || log.action === 'failed'
        const isSuccess = log.action.includes('success') || log.action === 'in_use' || log.action === 'completed'

        return (
          <div key={log._id || i} style={{ display: 'flex', gap: 12, minHeight: 50 }}>
            {/* Timeline line + dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: config.color + '18', border: `2px solid ${config.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Icon size={13} color={config.color} style={log.action.includes('processing') || log.action === 'retry' ? { animation: 'spin 1s linear infinite' } : undefined} />
              </div>
              {!isLast && (
                <div style={{ width: 2, flex: 1, background: '#e2e8f0', margin: '4px 0' }} />
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, paddingBottom: isLast ? 0 : 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: config.color }}>
                    {config.label}
                  </span>
                  {log.from_status !== null && log.to_status !== null && (
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 3 }}>
                      {log.from_status} <ArrowRight size={10} /> {log.to_status}
                    </span>
                  )}
                  {log.duration_ms != null && (
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {log.duration_ms}ms
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8', flexShrink: 0 }}>
                  {log.created_at ? formatDateTimeLocal(log.created_at) : '-'}
                </span>
              </div>

              {log.message && (
                <div style={{
                  fontSize: '12px', color: isError ? '#dc2626' : '#64748b',
                  marginTop: 3, lineHeight: 1.4,
                  ...(isError ? { background: '#fef2f2', padding: '4px 8px', borderRadius: 4, border: '1px solid #fecaca' } : {})
                }}>
                  {log.message}
                </div>
              )}

              {log.provider_code && (
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: 2 }}>
                  NCC: <span style={{ fontWeight: 500, color: '#64748b' }}>{log.provider_code}</span>
                  {log.http_status && ` • HTTP ${log.http_status}`}
                  {log.retry_count != null && log.retry_count > 0 && ` • Retry #${log.retry_count}`}
                </div>
              )}

              {log.response_body && isError && (
                <details style={{ marginTop: 4 }}>
                  <summary style={{ fontSize: '11px', color: '#94a3b8', cursor: 'pointer' }}>Response body</summary>
                  <pre style={{
                    fontSize: '11px', color: '#64748b', background: '#f8fafc',
                    padding: '6px 8px', borderRadius: 4, marginTop: 4,
                    overflow: 'auto', maxHeight: 120, whiteSpace: 'pre-wrap', wordBreak: 'break-all'
                  }}>
                    {log.response_body}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const navBtnStyle = (disabled: boolean): React.CSSProperties => ({
  padding: '4px 12px', fontSize: '12px',
  background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6,
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1, color: '#374151'
})
