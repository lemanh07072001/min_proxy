'use client'

import React, { useMemo, useState } from 'react'

import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Chip,
  Pagination,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel
} from '@tanstack/react-table'

import Checkbox from '@mui/material/Checkbox'

import {
  Copy,
  Clock,
  FileDown,
  X,
  ShoppingCart,
  Package,
  DollarSign,
  Clock3,
  Loader2,
  CheckCircle
} from 'lucide-react'

import { RefreshCw } from 'lucide-react'

import { formatDateTimeLocal } from '@/utils/formatDate'
import { useCopy } from '@/app/hooks/useCopy'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/constants/orderStatus'
import { useApiKeys } from '@/hooks/apis/useOrders'
import RenewalDialog from '@/components/renewal-dialog/RenewalDialog'

const formatVND = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ'

interface OrderDetailProps {
  open: boolean
  onClose: () => void
  order: {
    id: number
    order_code: string
    total_amount: number
    price_per_unit: number
    quantity: number
    delivered_quantity?: number
    status: string
    order_type?: number
    buy_at: string
    expired_at: string
    proxy_type?: string
    service_name?: string
    service_type?: string
    ip_version?: string
    proxies?: any[]
  } | null
}

const OrderDetail: React.FC<OrderDetailProps> = ({ open, onClose, order }) => {
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [, copy] = useCopy()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [renewOpen, setRenewOpen] = useState(false)

  const { data: apiKeysData = [], isLoading: isLoadingKeys } = useApiKeys(order?.id, open)

  const copyWithFeedback = (text: string, field: string, msg?: string) => {
    copy(text, msg)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Tính thời gian còn lại
  const getTimeRemaining = () => {
    if (!order?.expired_at) return null
    const s = String(order.status)

    if (s !== '2' && s !== '3') return null

    const diff = new Date(order.expired_at).getTime() - Date.now()

    if (diff <= 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    
return days > 0 ? `${days}d ${hours}h` : `${hours}h`
  }

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: any }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
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
        header: order?.service_type === '0' ? 'Proxy' : 'API Key',
        cell: ({ row }: { row: any }) => {
          if (order?.service_type === '0') {
            const proxys = row.original.proxy || row.original.proxys || {}

            const proxyValues = Object.entries(proxys)
              .filter(([key]) => key !== 'loaiproxy')
              .map(([_, value]) => value)

            const firstProxy = String(proxyValues[0] || '-')

            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: '12px' }}>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{firstProxy}</span>
                {firstProxy !== '-' && (
                  <button
                    onClick={() => copyWithFeedback(firstProxy, `proxy-${row.id}`, 'Đã copy proxy!')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: copiedField === `proxy-${row.id}` ? '#16a34a' : '#94a3b8' }}
                  >
                    {copiedField === `proxy-${row.id}` ? <CheckCircle size={14} /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            )
          }

          const apiKey = row.original?.key || row.original?.api_key || '-'

          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: '12px', color: '#dc2626' }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apiKey}</span>
              {apiKey !== '-' && (
                <button
                  onClick={() => copyWithFeedback(apiKey, `key-${row.id}`, 'Đã copy API key!')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: copiedField === `key-${row.id}` ? '#16a34a' : '#94a3b8' }}
                >
                  {copiedField === `key-${row.id}` ? <CheckCircle size={14} /> : <Copy size={14} />}
                </button>
              )}
            </div>
          )
        },
        size: 280
      },
      {
        header: 'Protocol',
        cell: ({ row }: { row: any }) => (
          <span style={{ fontSize: '12px', textTransform: 'uppercase' as const, fontWeight: 500 }}>
            {row.original.protocol || '-'}
          </span>
        ),
        size: 80
      },
      {
        header: 'Hết hạn',
        cell: ({ row }: { row: any }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: '12px' }}>
            <Clock size={12} />
            {formatDateTimeLocal(row.original.expired_at)}
          </div>
        ),
        size: 160
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [order, copiedField, copy]
  )

  const table = useReactTable({
    data: apiKeysData,
    columns,
    state: { rowSelection, pagination },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const totalRows = apiKeysData.length

  const handleCopySelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    if (selectedRows.length === 0) return

    const texts = selectedRows.map((row: any) => {
      if (order?.service_type === '0') {
        const proxys = row.original.proxy || row.original.proxys || {}
        const vals = Object.entries(proxys).filter(([k]) => k !== 'loaiproxy').map(([_, v]) => v)


return String(vals[0] || '')
      }


return row.original?.key || row.original?.api_key || ''
    }).filter(Boolean)

    copy(texts.join('\n'), `Đã copy ${texts.length} ${order?.service_type === '0' ? 'proxy' : 'API key'}!`)
  }

  const handleDownloadSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    if (selectedRows.length === 0) return

    const texts = selectedRows.map((row: any) => {
      if (order?.service_type === '0') {
        const proxys = row.original.proxy || row.original.proxys || {}
        const vals = Object.entries(proxys).filter(([k]) => k !== 'loaiproxy').map(([_, v]) => v)


return String(vals[0] || '')
      }


return row.original?.key || row.original?.api_key || ''
    }).filter(Boolean)

    const blob = new Blob([texts.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `${order?.order_code || 'order'}_proxies_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const timeRemaining = getTimeRemaining()
  const statusLabel = ORDER_STATUS_LABELS[String(order?.status)] || 'Không xác định'
  const statusColor = (ORDER_STATUS_COLORS[String(order?.status)] || 'default') as any

  if (!open) return null

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth='md'
        PaperProps={{
          sx: {
            borderRadius: '12px',
            maxHeight: '85vh',
            mt: '5vh',
            mb: 'auto'
          }
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', borderBottom: '1px solid #f1f5f9'
        }}>
          <div>
            <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
              Chi tiết đơn hàng
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#64748b', mt: 0.3 }}>
              #{order?.order_code}
            </Typography>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#94a3b8', borderRadius: 8 }}
          >
            <X size={20} />
          </button>
        </div>

        <DialogContent sx={{ p: 0 }}>
          {order ? (
            <>
              {/* Order info cards */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', p: '16px 20px' }}>
                <InfoCard icon={<ShoppingCart size={16} />} label='Dịch vụ' value={order.service_name || '-'} />
                <InfoCard icon={<Package size={16} />} label='Số lượng' value={
                  order.delivered_quantity != null && order.delivered_quantity !== order.quantity
                    ? `${order.delivered_quantity}/${order.quantity}`
                    : String(order.quantity)
                } />
                <InfoCard icon={<DollarSign size={16} />} label='Tổng tiền' value={formatVND(order.total_amount)} highlight />
                <InfoCard icon={<Clock3 size={16} />} label='Ngày mua' value={formatDateTimeLocal(order.buy_at)} />
                <Box sx={{
                  p: '10px 12px', borderRadius: '10px',
                  background: '#f8fafc', border: '1px solid #f1f5f9'
                }}>
                  <Typography sx={{ fontSize: '11px', color: '#94a3b8', mb: 0.5 }}>Trạng thái</Typography>
                  <Chip label={statusLabel} size='small' color={statusColor} />
                  {timeRemaining && (
                    <Typography sx={{ fontSize: '11px', color: '#16a34a', fontWeight: 500, mt: 0.5 }}>
                      Còn {timeRemaining}
                    </Typography>
                  )}
                </Box>
                <InfoCard icon={<Clock size={16} />} label='Loại' value={order.order_type === 1 ? 'Gia hạn' : 'Mua mới'} />
              </Box>

              {/* Nút gia hạn — chỉ hiện khi in_use/in_use_partial/expired */}
              {order.order_type !== 1 && ['2', '3', '4'].includes(String(order.status)) && (
                <Box sx={{ px: '20px', pb: '8px', display: 'flex', gap: 1 }}>
                  <button
                    onClick={() => setRenewOpen(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', fontSize: '13px', fontWeight: 600,
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff',
                      border: 'none', borderRadius: 8, cursor: 'pointer'
                    }}
                  >
                    <RefreshCw size={15} />
                    {selectedCount > 0 ? `Gia hạn ${selectedCount} proxy đã chọn` : 'Gia hạn tất cả'}
                  </button>
                </Box>
              )}

              {/* Status 11: đang gia hạn */}
              {String(order.status) === '11' && (
                <Box sx={{ px: '20px', pb: '8px' }}>
                  <div style={{ padding: '10px 14px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe', fontSize: '13px', color: '#1d4ed8' }}>
                    <RefreshCw size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                    Proxy vẫn hoạt động bình thường. Đang chờ gia hạn từ nhà cung cấp...
                  </div>
                </Box>
              )}

              {/* Status 12: gia hạn thất bại */}
              {String(order.status) === '12' && (
                <Box sx={{ px: '20px', pb: '8px' }}>
                  <div style={{ padding: '10px 14px', background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca', fontSize: '13px', color: '#dc2626' }}>
                    Gia hạn thất bại. Tiền đã được hoàn lại. Vui lòng liên hệ admin để được hỗ trợ.
                  </div>
                </Box>
              )}

              {/* Divider */}
              <Box sx={{ borderTop: '1px solid #f1f5f9' }} />

              {/* Proxy list section */}
              <Box sx={{ p: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                    Danh sách proxy ({totalRows})
                  </Typography>
                  {selectedCount > 0 && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Đã chọn: {selectedCount}</span>
                      <button
                        onClick={handleCopySelected}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '5px 10px', fontSize: '12px', fontWeight: 500,
                          background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
                          borderRadius: 6, cursor: 'pointer'
                        }}
                      >
                        <Copy size={13} /> Copy
                      </button>
                      <button
                        onClick={handleDownloadSelected}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '5px 10px', fontSize: '12px', fontWeight: 500,
                          background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe',
                          borderRadius: 6, cursor: 'pointer'
                        }}
                      >
                        <FileDown size={13} /> Tải
                      </button>
                    </div>
                  )}
                </div>

                {isLoadingKeys ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={28} />
                    <Typography sx={{ fontSize: '13px', color: '#64748b', mt: 1 }}>Đang tải proxy...</Typography>
                  </Box>
                ) : totalRows > 0 ? (
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
                    {table.getPageCount() > 1 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>
                          Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()} ({totalRows} proxy)
                        </Typography>
                        <Pagination
                          count={table.getPageCount()}
                          page={table.getState().pagination.pageIndex + 1}
                          onChange={(_, p) => table.setPageIndex(p - 1)}
                          size='small'
                          shape='rounded'
                          variant='outlined'
                          color='primary'
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <Box sx={{
                    textAlign: 'center', py: 4, background: '#f8fafc',
                    borderRadius: '8px', border: '1px solid #f1f5f9'
                  }}>
                    <Loader2 size={20} color='#94a3b8' />
                    <Typography sx={{ fontSize: '13px', color: '#94a3b8', mt: 1 }}>
                      Chưa có proxy — đang chờ xử lý
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ color: '#94a3b8' }}>Không có dữ liệu đơn hàng</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Renewal Dialog */}
      {order && (
        <RenewalDialog
          open={renewOpen}
          onClose={() => setRenewOpen(false)}
          orderId={order.id}
          orderCode={order.order_code}
          productName={order.service_name || 'Proxy'}
          itemCount={order.quantity}
          selectedItemKeys={
            selectedCount > 0
              ? table.getSelectedRowModel().rows.map((r: any) => r.original.key)
              : undefined
          }
          currentExpiry={order.expired_at ? formatDateTimeLocal(order.expired_at) : undefined}
          priceOptions={[
            { key: '1', label: '1 ngày', price: order.price_per_unit || 0 },
            { key: '7', label: '7 ngày', price: (order.price_per_unit || 0) * 7 },
            { key: '30', label: '30 ngày', price: (order.price_per_unit || 0) * 30 },
          ]}
        />
      )}
    </>
  )
}

function InfoCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <Box sx={{
      p: '10px 12px', borderRadius: '10px',
      background: '#f8fafc', border: '1px solid #f1f5f9'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
        <span style={{ color: '#94a3b8' }}>{icon}</span>
        <Typography sx={{ fontSize: '11px', color: '#94a3b8' }}>{label}</Typography>
      </div>
      <Typography sx={{ fontSize: '13px', fontWeight: highlight ? 700 : 600, color: highlight ? 'var(--primary-color)' : '#1e293b' }}>
        {value}
      </Typography>
    </Box>
  )
}

export default OrderDetail
