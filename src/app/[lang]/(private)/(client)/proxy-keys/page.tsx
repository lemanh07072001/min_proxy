'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Box, Typography, MenuItem, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { Key, RefreshCw, Shield, Search, Copy, Check, ExternalLink, Settings } from 'lucide-react'
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

  // Filters — state riêng cho form, chỉ apply khi click Tìm
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(100)

  // Applied filters — dùng để query
  const [appliedFilters, setAppliedFilters] = useState<any>({ limit: 100 })

  const [copied, setCopied] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<OrderItemRecord | null>(null)
  const [editIps, setEditIps] = useState('')

  const { data, isLoading, isFetching, refetch } = useOrderItems(appliedFilters, false)
  const updateIps = useUpdateAllowIps()
  const items = data?.data ?? []
  const meta = data?.meta

  const handleSearch = useCallback(() => {
    setAppliedFilters({
      limit,
      type: type || undefined,
      status: status || undefined,
      search: search || undefined,
    })
    setTimeout(() => refetch(), 50)
  }, [type, status, search, limit, refetch])

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  const handleSaveIps = () => {
    if (!editItem) return
    const ips = editIps.split(',').map(s => s.trim()).filter(Boolean)
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
    const invalid = ips.find(ip => !ipRegex.test(ip))
    if (invalid) { toast.error(`IP không hợp lệ: ${invalid}`); return }

    updateIps.mutate({ key: editItem.key, allow_ips: ips }, {
      onSuccess: () => { setEditItem(null); refetch() },
      onError: () => toast.error('Lỗi cập nhật IP'),
    })
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant='h5' sx={{ fontWeight: 700, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1, color: '#1e293b' }}>
        <Key size={22} /> Danh sách proxy
      </Typography>

      {/* Filter bar */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <CustomTextField select label='Loại' value={type} onChange={e => setType(e.target.value)} size='small' sx={{ width: 130 }}>
          <MenuItem value=''>Tất cả</MenuItem>
          <MenuItem value='ROTATING'>Xoay</MenuItem>
          <MenuItem value='STATIC'>Tĩnh</MenuItem>
        </CustomTextField>
        <CustomTextField select label='Trạng thái' value={status} onChange={e => setStatus(e.target.value)} size='small' sx={{ width: 140 }}>
          <MenuItem value=''>Tất cả</MenuItem>
          <MenuItem value='0'>Hoạt động</MenuItem>
          <MenuItem value='2'>Hết hạn</MenuItem>
        </CustomTextField>
        <CustomTextField
          size='small' label='Tìm key' placeholder='Nhập key...'
          value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          sx={{ width: 220 }}
        />
        <CustomTextField select label='Hiển thị' value={limit} onChange={e => setLimit(Number(e.target.value))} size='small' sx={{ width: 100 }}>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={500}>500</MenuItem>
          <MenuItem value={1000}>1.000</MenuItem>
          <MenuItem value={5000}>5.000</MenuItem>
          <MenuItem value={10000}>10.000</MenuItem>
        </CustomTextField>
        <Button
          variant='contained'
          size='small'
          onClick={handleSearch}
          disabled={isFetching}
          startIcon={<Search size={14} style={isFetching ? { animation: 'spin 1s linear infinite' } : {}} />}
          sx={{ height: 40, textTransform: 'none', fontWeight: 600, px: 2.5 }}
        >
          {isFetching ? 'Đang tìm...' : 'Tìm kiếm'}
        </Button>
      </Box>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      {/* Results info */}
      {meta && (
        <Typography sx={{ fontSize: 12, color: '#94a3b8', mb: 1 }}>
          {meta.total} proxy
        </Typography>
      )}

      {/* Table */}
      <Box sx={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#fff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={thStyle}>Key</th>
              <th style={thStyle}>Loại</th>
              <th style={thStyle}>Proxy</th>
              <th style={thStyle}>IP Whitelist</th>
              <th style={thStyle}>Trạng thái</th>
              <th style={thStyle}>Hết hạn</th>
              <th style={thStyle}>Đơn</th>
              <th style={{ ...thStyle, textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isFetching ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} />
                <div>Đang tải...</div>
              </td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                {meta ? 'Không tìm thấy proxy nào' : 'Nhấn "Tìm kiếm" để xem danh sách proxy'}
              </td></tr>
            ) : items.map((item: OrderItemRecord) => {
              const st = STATUS_MAP[item.status] ?? STATUS_MAP[2]
              const proxyText = formatProxy(item)
              return (
                <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9' }} onMouseEnter={e => (e.currentTarget.style.background = '#fafbfc')} onMouseLeave={e => (e.currentTarget.style.background = '')}>
                  <td style={tdStyle}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6366f1', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }} title={item.key}>{item.key}</span>
                      <CopyBtn copied={copied === item.key} onClick={() => copyText(item.key, item.key)} />
                    </Box>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '11px', padding: '2px 6px', borderRadius: 4, background: item.type === 'ROTATING' ? '#fffbeb' : '#eff6ff', color: item.type === 'ROTATING' ? '#d97706' : '#2563eb' }}>
                      {item.type === 'ROTATING' ? <RefreshCw size={11} /> : <Shield size={11} />}
                      {item.type === 'ROTATING' ? 'Xoay' : 'Tĩnh'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>{proxyText}</span>
                      {proxyText !== '—' && <CopyBtn copied={copied === `p-${item._id}`} onClick={() => copyText(proxyText, `p-${item._id}`)} />}
                    </Box>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>{(item.protocol || 'http').toUpperCase()}</div>
                  </td>
                  <td style={tdStyle}>
                    {item.allow_ips?.length ? (
                      <span style={{ fontSize: '11px', color: '#2563eb', fontFamily: 'monospace' }}>{item.allow_ips.join(', ')}</span>
                    ) : <span style={{ color: '#cbd5e1', fontSize: '11px' }}>—</span>}
                  </td>
                  <td style={tdStyle}>
                    <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: '11px', fontWeight: 600, color: st.color, background: st.bg }}>
                      {st.label}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {item.expired_at ? new Date(item.expired_at).toLocaleDateString('vi-VN') : '—'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {item.order_code ? (
                      <a href={`/${locale}/history-order?search=${item.order_code}`} style={{ fontSize: '11px', color: '#6366f1', display: 'inline-flex', alignItems: 'center', gap: 2, textDecoration: 'none' }}>
                        {item.order_code} <ExternalLink size={10} />
                      </a>
                    ) : '—'}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <Tooltip title='Cập nhật IP Whitelist'>
                      <IconButton size='small' onClick={() => { setEditItem(item); setEditIps((item.allow_ips || []).join(', ')) }} sx={{ p: 0.5 }}>
                        <Settings size={14} color='#64748b' />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Box>

      {/* Edit IP Whitelist Dialog */}
      <Dialog open={!!editItem} onClose={() => setEditItem(null)} maxWidth='xs' fullWidth>
        <DialogTitle sx={{ fontSize: 15, fontWeight: 700 }}>Cập nhật IP Whitelist</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 12, color: '#64748b', mb: 1.5 }}>
            Key: <span style={{ fontFamily: 'monospace', color: '#6366f1' }}>{editItem?.key}</span>
          </Typography>
          <CustomTextField
            fullWidth multiline rows={3}
            label='Danh sách IP (cách nhau bởi dấu phẩy)'
            placeholder='VD: 123.45.67.89, 98.76.54.32'
            value={editIps}
            onChange={e => setEditIps(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditItem(null)} color='inherit'>Hủy</Button>
          <Button onClick={handleSaveIps} variant='contained' disabled={updateIps.isPending}>
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
      <IconButton size='small' onClick={onClick} sx={{ p: 0.25 }}>
        {copied ? <Check size={11} color='#16a34a' /> : <Copy size={11} color='#94a3b8' />}
      </IconButton>
    </Tooltip>
  )
}

const thStyle: React.CSSProperties = { padding: '8px 10px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }
const tdStyle: React.CSSProperties = { padding: '8px 10px', verticalAlign: 'middle' }
