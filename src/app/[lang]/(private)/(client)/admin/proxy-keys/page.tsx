'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Box, Typography, MenuItem, Grid2, Pagination, IconButton, Tooltip } from '@mui/material'
import { Key, RefreshCw, Shield, Search, Copy, Check, ExternalLink, Clock, User } from 'lucide-react'
import CustomTextField from '@core/components/mui/TextField'
import { useOrderItems, type OrderItemRecord } from '@/hooks/apis/useOrderItems'

const STATUS_MAP: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: 'Hoạt động', color: '#16a34a', bg: '#f0fdf4' },
  1: { label: 'Tắt', color: '#94a3b8', bg: '#f8fafc' },
  2: { label: 'Hết hạn', color: '#dc2626', bg: '#fef2f2' },
}

const formatProxy = (item: OrderItemRecord) => {
  const p = item.proxy
  if (!p) return '—'
  const raw = p.http || p.HTTP || p.socks5 || p.SOCKS5 || ''
  return raw.replace(/:+$/, '') || '—'
}

export default function AdminProxyKeysPage() {
  const params = useParams()
  const locale = params.lang || 'vi'
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [userId, setUserId] = useState('')
  const [limit, setLimit] = useState(100)
  const [page, setPage] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)

  const { data, isLoading } = useOrderItems({
    page, limit,
    type: type || undefined,
    status: status || undefined,
    search: search || undefined,
    user_id: userId ? Number(userId) : undefined,
  }, true)
  const items = data?.data ?? []
  const meta = data?.meta ?? { total: 0, page: 1, limit: 100, last_page: 1 }

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant='h5' sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Key size={22} /> Quản lý Proxy Keys
      </Typography>

      {/* Filters */}
      <Grid2 container spacing={1.5} sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 6, sm: 2 }}>
          <CustomTextField fullWidth select label='Loại' value={type} onChange={e => { setType(e.target.value); setPage(1) }} size='small'>
            <MenuItem value=''>Tất cả</MenuItem>
            <MenuItem value='ROTATING'>Xoay</MenuItem>
            <MenuItem value='STATIC'>Tĩnh</MenuItem>
          </CustomTextField>
        </Grid2>
        <Grid2 size={{ xs: 6, sm: 2 }}>
          <CustomTextField fullWidth select label='Trạng thái' value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} size='small'>
            <MenuItem value=''>Tất cả</MenuItem>
            <MenuItem value='0'>Hoạt động</MenuItem>
            <MenuItem value='1'>Tắt</MenuItem>
            <MenuItem value='2'>Hết hạn</MenuItem>
          </CustomTextField>
        </Grid2>
        <Grid2 size={{ xs: 6, sm: 2 }}>
          <CustomTextField
            fullWidth size='small' label='User ID' type='number'
            placeholder='Tất cả'
            value={userId}
            onChange={e => { setUserId(e.target.value); setPage(1) }}
            InputProps={{ startAdornment: <User size={14} style={{ marginRight: 4, color: '#94a3b8' }} /> }}
          />
        </Grid2>
        <Grid2 size={{ xs: 6, sm: 2 }}>
          <CustomTextField fullWidth select label='Hiển thị' value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1) }} size='small'>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={500}>500</MenuItem>
            <MenuItem value={1000}>1.000</MenuItem>
            <MenuItem value={5000}>5.000</MenuItem>
          </CustomTextField>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            fullWidth size='small' label='Tìm key'
            placeholder='Nhập key...'
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            InputProps={{ startAdornment: <Search size={14} style={{ marginRight: 6, color: '#94a3b8' }} /> }}
          />
        </Grid2>
      </Grid2>

      {/* Table */}
      <Box sx={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={thStyle}>Key</th>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Loại</th>
              <th style={thStyle}>Proxy</th>
              <th style={thStyle}>IP Whitelist</th>
              <th style={thStyle}>Key NCC</th>
              <th style={thStyle}>Trạng thái</th>
              <th style={thStyle}>Hết hạn</th>
              <th style={thStyle}>Xoay tiếp</th>
              <th style={thStyle}>Đơn</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>Đang tải...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>Không tìm thấy</td></tr>
            ) : items.map((item: OrderItemRecord) => {
              const st = STATUS_MAP[item.status] ?? STATUS_MAP[2]
              const proxyText = formatProxy(item)
              return (
                <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6366f1', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }} title={item.key}>{item.key}</span>
                      <Tooltip title={copied === item.key ? 'Đã copy!' : 'Copy'}>
                        <IconButton size='small' onClick={() => copyText(item.key, item.key)} sx={{ p: 0.25 }}>
                          {copied === item.key ? <Check size={11} color='#16a34a' /> : <Copy size={11} color='#94a3b8' />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: '11px', color: '#475569' }}>#{item.user_id}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '11px', color: item.type === 'ROTATING' ? '#f59e0b' : '#3b82f6' }}>
                      {item.type === 'ROTATING' ? <RefreshCw size={11} /> : <Shield size={11} />}
                      {item.type === 'ROTATING' ? 'Xoay' : 'Tĩnh'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }} title={proxyText}>{proxyText}</span>
                      {proxyText !== '—' && (
                        <Tooltip title='Copy proxy'>
                          <IconButton size='small' onClick={() => copyText(proxyText, `p-${item._id}`)} sx={{ p: 0.25 }}>
                            {copied === `p-${item._id}` ? <Check size={11} color='#16a34a' /> : <Copy size={11} color='#94a3b8' />}
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>{(item.protocol || 'http').toUpperCase()}</div>
                  </td>
                  <td style={tdStyle}>
                    {item.allow_ips?.length ? (
                      <span style={{ fontSize: '11px', color: '#2563eb' }}>{item.allow_ips.join(', ')}</span>
                    ) : <span style={{ color: '#cbd5e1', fontSize: '11px' }}>—</span>}
                  </td>
                  <td style={tdStyle}>
                    {item.provider_key ? (
                      <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#8b5cf6', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }} title={item.provider_key}>{item.provider_key}</span>
                    ) : <span style={{ color: '#cbd5e1', fontSize: '11px' }}>—</span>}
                  </td>
                  <td style={tdStyle}>
                    <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: '10px', fontWeight: 600, color: st.color, background: st.bg }}>
                      {st.label}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {item.expired_at ? new Date(item.expired_at).toLocaleDateString('vi-VN') : '—'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {item.type === 'ROTATING' && item.next_rotate_seconds != null ? (
                      <span style={{ fontSize: '11px', color: item.next_rotate_seconds > 0 ? '#f59e0b' : '#16a34a', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        <Clock size={11} />
                        {item.next_rotate_seconds > 0 ? `${item.next_rotate_seconds}s` : 'OK'}
                      </span>
                    ) : <span style={{ color: '#cbd5e1', fontSize: '11px' }}>—</span>}
                  </td>
                  <td style={tdStyle}>
                    {item.order_id ? (
                      <a href={`/${locale}/admin/orders`} style={{ fontSize: '11px', color: '#6366f1', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        #{item.order_id} <ExternalLink size={10} />
                      </a>
                    ) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: '#94a3b8' }}>
          {meta.total} proxy — Trang {meta.page}/{meta.last_page}
        </Typography>
        {meta.last_page > 1 && (
          <Pagination count={meta.last_page} page={page} onChange={(_, v) => setPage(v)} size='small' />
        )}
      </Box>
    </Box>
  )
}

const thStyle: React.CSSProperties = { padding: '6px 8px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }
const tdStyle: React.CSSProperties = { padding: '6px 8px', verticalAlign: 'top' }
