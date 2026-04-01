'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Box, Typography, MenuItem, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Card } from '@mui/material'
import { Key, RefreshCw, Shield, Search, Copy, Check, ExternalLink, Settings2 } from 'lucide-react'
import { toast } from 'react-toastify'
import CustomTextField from '@core/components/mui/TextField'
import { useOrderItems, useUpdateAllowIps, type OrderItemRecord } from '@/hooks/apis/useOrderItems'

const STATUS_MAP: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: 'Hoạt động', color: '#16a34a', bg: '#dcfce7' },
  1: { label: 'Tắt', color: '#94a3b8', bg: '#f1f5f9' },
  2: { label: 'Hết hạn', color: '#dc2626', bg: '#fee2e2' },
}

const formatProxy = (item: OrderItemRecord) => {
  const p = item.proxy
  if (!p) return '—'
  const raw = p.http || p.HTTP || p.socks5 || p.SOCKS5 || ''
  return raw.replace(/:+$/, '') || '—'
}

export default function ProxyKeysPage() {
  const params = useParams()
  const locale = params.lang || 'vi'
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(100)
  const [appliedFilters, setAppliedFilters] = useState<any>({ limit: 100 })
  const [copied, setCopied] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<OrderItemRecord | null>(null)
  const [editIp, setEditIp] = useState('')

  const { data, isLoading, isFetching, refetch } = useOrderItems(appliedFilters, false)
  const updateIps = useUpdateAllowIps()
  const items = data?.data ?? []
  const meta = data?.meta

  const handleSearch = useCallback(() => {
    setAppliedFilters({ limit, type: type || undefined, status: status || undefined, search: search || undefined })
    setTimeout(() => refetch(), 50)
  }, [type, status, search, limit, refetch])

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  const handleSaveIp = () => {
    if (!editItem) return
    const ip = editIp.trim()
    if (ip && !/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) { toast.error('IP không hợp lệ'); return }
    updateIps.mutate({ key: editItem.key, allow_ips: ip ? [ip] : [] }, {
      onSuccess: () => { setEditItem(null); refetch() },
      onError: () => toast.error('Lỗi cập nhật IP'),
    })
  }

  const searching = isLoading || isFetching

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header + Filter */}
      <Card variant='outlined' sx={{ mb: 2, borderColor: '#e2e8f0', overflow: 'hidden' }}>
        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, pt: 1.5, pb: 0.5 }}>
          <Key size={17} color='#6366f1' />
          <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>Danh sách proxy</Typography>
        </Box>
        {/* Row 1: Loại + Trạng thái */}
        <Box sx={{ display: 'flex', gap: 1, px: 2, pb: 1 }}>
          <CustomTextField select value={type} onChange={e => setType(e.target.value)} size='small' label='Loại' sx={{ flex: 1, minWidth: 0 }}>
            <MenuItem value=''>Tất cả</MenuItem>
            <MenuItem value='ROTATING'>Xoay</MenuItem>
            <MenuItem value='STATIC'>Tĩnh</MenuItem>
          </CustomTextField>
          <CustomTextField select value={status} onChange={e => setStatus(e.target.value)} size='small' label='Trạng thái' sx={{ flex: 1, minWidth: 0 }}>
            <MenuItem value=''>Tất cả</MenuItem>
            <MenuItem value='0'>Hoạt động</MenuItem>
            <MenuItem value='2'>Hết hạn</MenuItem>
          </CustomTextField>
          <CustomTextField select value={limit} onChange={e => setLimit(Number(e.target.value))} size='small' label='Hiển thị' sx={{ flex: '0 0 80px' }}>
            {[100, 500, 1000, 5000, 10000].map(n => <MenuItem key={n} value={n}>{n.toLocaleString()}</MenuItem>)}
          </CustomTextField>
        </Box>
        {/* Row 2: Search + Button */}
        <Box sx={{ display: 'flex', gap: 1, px: 2, pb: 1.5 }}>
          <CustomTextField
            size='small' placeholder='Tìm theo key...'
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            sx={{ flex: 1, minWidth: 0 }}
          />
          <Button
            variant='contained' size='small' onClick={handleSearch} disabled={searching}
            sx={{ height: 40, textTransform: 'none', fontWeight: 600, px: 2, flexShrink: 0, background: 'var(--primary-gradient, var(--primary-hover))', '&:hover': { opacity: 0.9 } }}
          >
            <Search size={14} style={{ marginRight: 4, ...(searching ? { animation: 'spin 0.8s linear infinite' } : {}) }} />
            Tìm
          </Button>
        </Box>
      </Card>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      {/* Table card */}
      <Card variant='outlined' sx={{ borderColor: '#e2e8f0', overflow: 'hidden' }}>
        {meta && (
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
            <Typography sx={{ fontSize: 12, color: '#64748b' }}>{meta.total.toLocaleString()} proxy</Typography>
          </Box>
        )}
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                <th style={thStyle}>Key</th>
                <th style={thStyle}>Loại</th>
                <th style={thStyle}>Proxy</th>
                <th style={thStyle}>IP Whitelist</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Hết hạn</th>
                <th style={thStyle}>Đơn hàng</th>
                <th style={{ ...thStyle, width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {searching ? (
                <tr><td colSpan={8} style={emptyStyle}>
                  <RefreshCw size={18} style={{ animation: 'spin 0.8s linear infinite', color: '#94a3b8' }} />
                  <div style={{ marginTop: 6 }}>Đang tải...</div>
                </td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={8} style={emptyStyle}>
                  {meta ? 'Không tìm thấy proxy nào' : 'Nhấn "Tìm kiếm" để bắt đầu'}
                </td></tr>
              ) : items.map((item: OrderItemRecord) => {
                const st = STATUS_MAP[item.status] ?? STATUS_MAP[2]
                const proxyText = formatProxy(item)
                return (
                  <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <td style={tdStyle}>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6366f1' }}>{item.key.slice(0, 12)}...</span>
                        <CopyBtn copied={copied === item.key} onClick={() => copyText(item.key, item.key)} />
                      </Box>
                    </td>
                    <td style={tdStyle}>
                      <TypeBadge type={item.type} />
                    </td>
                    <td style={tdStyle}>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>{proxyText}</span>
                        {proxyText !== '—' && <CopyBtn copied={copied === `p-${item._id}`} onClick={() => copyText(proxyText, `p-${item._id}`)} />}
                      </Box>
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: 1 }}>{(item.protocol || 'http').toUpperCase()}</div>
                    </td>
                    <td style={tdStyle}>
                      {item.allow_ips?.length ? (
                        <span style={{ fontSize: '11px', color: '#2563eb', fontFamily: 'monospace' }}>{item.allow_ips[0]}</span>
                      ) : <span style={{ color: '#cbd5e1', fontSize: '11px' }}>—</span>}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ padding: '2px 10px', borderRadius: 99, fontSize: '11px', fontWeight: 600, color: st.color, background: st.bg }}>{st.label}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {item.expired_at ? new Date(item.expired_at).toLocaleDateString('vi-VN') : '—'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {item.order_code ? (
                        <a href={`/${locale}/history-order?search=${item.order_code}`} style={{ fontSize: '11px', color: '#6366f1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          {item.order_code.slice(-8)} <ExternalLink size={10} />
                        </a>
                      ) : '—'}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      {item.status === 0 && (
                        <Tooltip title='Cập nhật IP'>
                          <IconButton size='small' onClick={() => { setEditItem(item); setEditIp((item.allow_ips || [])[0] || '') }}>
                            <Settings2 size={14} color='#64748b' />
                          </IconButton>
                        </Tooltip>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Box>
      </Card>

      {/* Edit IP Dialog */}
      <Dialog open={!!editItem} onClose={() => setEditItem(null)} maxWidth='xs' fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontSize: 15, fontWeight: 700, pb: 1 }}>Cập nhật IP Whitelist</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 12, color: '#64748b', mb: 2 }}>
            Chỉ thiết bị có IP này mới kết nối được proxy.
          </Typography>
          <CustomTextField
            fullWidth label='Địa chỉ IP' placeholder='VD: 123.45.67.89'
            value={editIp} onChange={e => setEditIp(e.target.value.replace(/[^0-9.]/g, ''))}
            inputProps={{ maxLength: 15 }}
            helperText='Để trống để xóa IP whitelist'
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditItem(null)} color='inherit'>Hủy</Button>
          <Button onClick={handleSaveIp} variant='contained' disabled={updateIps.isPending}>
            {updateIps.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function CopyBtn({ copied, onClick }: { copied: boolean; onClick: () => void }) {
  return (
    <Tooltip title={copied ? 'Đã copy!' : 'Copy'}>
      <IconButton size='small' onClick={onClick} sx={{ p: 0.25, opacity: 0.5, '&:hover': { opacity: 1 } }}>
        {copied ? <Check size={11} color='#16a34a' /> : <Copy size={11} color='#94a3b8' />}
      </IconButton>
    </Tooltip>
  )
}

function TypeBadge({ type }: { type: string }) {
  const isRotating = type === 'ROTATING'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '11px', padding: '2px 8px', borderRadius: 99, fontWeight: 600, background: isRotating ? '#fef3c7' : '#dbeafe', color: isRotating ? '#b45309' : '#1d4ed8' }}>
      {isRotating ? <RefreshCw size={10} /> : <Shield size={10} />}
      {isRotating ? 'Xoay' : 'Tĩnh'}
    </span>
  )
}

const thStyle: React.CSSProperties = { padding: '10px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#475569', borderBottom: '2px solid #e2e8f0', background: '#f8fafc', whiteSpace: 'nowrap' }
const tdStyle: React.CSSProperties = { padding: '10px 12px', verticalAlign: 'middle' }
const emptyStyle: React.CSSProperties = { textAlign: 'center', padding: 50, color: '#94a3b8', fontSize: '13px' }
