'use client'

import { useState, useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import { Trash2, Plus, Pencil, X } from 'lucide-react'
import { toast } from 'react-toastify'

import {
  useUserProviderPricing,
  useCreateUserProviderPricing,
  useUpdateUserProviderPricing,
  useDeleteUserProviderPricing
} from '@/hooks/apis/useUserProviderPricing'

interface ProviderPricingModalProps {
  open: boolean
  onClose: () => void
  userId?: number
  userName?: string
}

export default function ProviderPricingModal({ open, onClose, userId, userName }: ProviderPricingModalProps) {
  const { data, isLoading, refetch } = useUserProviderPricing(open ? userId : undefined)
  const createMutation = useCreateUserProviderPricing()
  const updateMutation = useUpdateUserProviderPricing()
  const deleteMutation = useDeleteUserProviderPricing()

  const [isAdding, setIsAdding] = useState(false)
  const [newProviderId, setNewProviderId] = useState<number | ''>('')
  const [newMarkup, setNewMarkup] = useState('')
  const [newNote, setNewNote] = useState('')

  // Editing inline
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editMarkup, setEditMarkup] = useState('')
  const [editNote, setEditNote] = useState('')

  useEffect(() => {
    if (open) {
      setIsAdding(false)
      setEditingId(null)
      setNewProviderId('')
      setNewMarkup('')
      setNewNote('')
    }
  }, [open])

  const items = data?.data || []
  const availableProviders = data?.available_providers || []

  const handleAdd = async () => {
    if (!newProviderId || !newMarkup) return
    try {
      await createMutation.mutateAsync({
        user_id: userId,
        provider_id: newProviderId,
        markup_percent: parseFloat(newMarkup),
        note: newNote || undefined
      })
      toast.success('Đã thêm provider pricing')
      setIsAdding(false)
      setNewProviderId('')
      setNewMarkup('')
      setNewNote('')
      refetch()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi thêm markup')
    }
  }

  const handleUpdate = async (id: number) => {
    try {
      await updateMutation.mutateAsync({
        id,
        markup_percent: parseFloat(editMarkup),
        note: editNote || undefined
      })
      toast.success('Đã cập nhật markup')
      setEditingId(null)
      refetch()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi cập nhật')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa provider pricing này?')) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Đã xóa provider pricing')
      refetch()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi xóa')
    }
  }

  const handleToggleEnabled = async (item: any) => {
    try {
      await updateMutation.mutateAsync({
        id: item.id,
        is_enabled: !item.is_enabled
      })
      toast.success(item.is_enabled ? 'Đã tắt' : 'Đã bật')
      refetch()
    } catch {
      toast.error('Lỗi cập nhật')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <div>
          <Typography variant='subtitle1' fontWeight={700}>Giá theo nhà cung cấp</Typography>
          <Typography variant='caption' color='text.secondary'>{userName}</Typography>
        </div>
        <IconButton size='small' onClick={onClose}><X size={18} /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        {isLoading && <Typography color='text.secondary' sx={{ textAlign: 'center', py: 3 }}>Đang tải...</Typography>}

        {!isLoading && items.length === 0 && !isAdding && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
            <Typography variant='body2'>Chưa thiết lập giá riêng cho user này.</Typography>
            <Typography variant='caption' sx={{ display: 'block', mb: 2 }}>Thêm nhà cung cấp để user mua với giá gốc + % chênh lệch bạn muốn lãi.</Typography>
            {availableProviders.length > 0 && (
              <Button startIcon={<Plus size={14} />} size='small' variant='contained'
                onClick={() => setIsAdding(true)} sx={{ fontSize: '12px', textTransform: 'none' }}>
                Thêm nhà cung cấp
              </Button>
            )}
          </div>
        )}

        {/* Nút thêm provider — hiện khi đã có items */}
        {!isAdding && items.length > 0 && availableProviders.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <Button startIcon={<Plus size={14} />} size='small' variant='outlined'
              onClick={() => setIsAdding(true)} sx={{ fontSize: '12px', textTransform: 'none' }}>
              Thêm nhà cung cấp
            </Button>
          </div>
        )}

        {/* Danh sách hiện có */}
        {items.map((item: any) => (
          <div key={item.id} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
            border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 8,
            background: item.is_enabled ? '#fff' : '#f8fafc'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Typography variant='body2' fontWeight={600}>{item.provider_name}</Typography>
                {!item.is_enabled && <Chip label='Tắt' size='small' color='default' sx={{ fontSize: '10px', height: 20 }} />}
              </div>
              {editingId === item.id ? (
                <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
                  <TextField size='small' type='number' label='% chênh lệch' value={editMarkup}
                    onChange={e => setEditMarkup(e.target.value)}
                    sx={{ width: 110, '& input': { fontSize: '13px', py: '6px' } }}
                  />
                  <TextField size='small' label='Ghi chú' value={editNote}
                    onChange={e => setEditNote(e.target.value)}
                    sx={{ flex: 1, '& input': { fontSize: '13px', py: '6px' } }}
                  />
                  <Button size='small' variant='contained' onClick={() => handleUpdate(item.id)}
                    disabled={updateMutation.isPending} sx={{ fontSize: '11px', textTransform: 'none' }}>
                    Lưu
                  </Button>
                  <Button size='small' onClick={() => setEditingId(null)} sx={{ fontSize: '11px', textTransform: 'none' }}>
                    Hủy
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                  <Typography variant='caption' color='text.secondary'>
                    Chênh lệch: <strong style={{ color: '#d97706' }}>+{item.markup_percent}%</strong> so với giá gốc
                  </Typography>
                  {item.note && (
                    <Typography variant='caption' color='text.secondary'>
                      · {item.note}
                    </Typography>
                  )}
                </div>
              )}
            </div>

            {editingId !== item.id && (
              <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Tooltip title={item.is_enabled ? 'Tắt' : 'Bật'}>
                  <Switch size='small' checked={item.is_enabled} onChange={() => handleToggleEnabled(item)} />
                </Tooltip>
                <Tooltip title='Sửa'>
                  <IconButton size='small' onClick={() => {
                    setEditingId(item.id)
                    setEditMarkup(item.markup_percent?.toString() || '')
                    setEditNote(item.note || '')
                  }}>
                    <Pencil size={15} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Xóa'>
                  <IconButton size='small' color='error' onClick={() => handleDelete(item.id)}>
                    <Trash2 size={15} />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </div>
        ))}

        {/* Form thêm mới */}
        {isAdding && (
          <div style={{ border: '1px solid #bfdbfe', borderRadius: 8, padding: 12, background: '#eff6ff', marginTop: 8 }}>
            <Typography variant='caption' fontWeight={600} sx={{ mb: 1, display: 'block' }}>Thêm nhà cung cấp</Typography>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <TextField select size='small' label='Nhà cung cấp' value={newProviderId}
                onChange={e => setNewProviderId(Number(e.target.value))}
                sx={{ minWidth: 180, '& .MuiInputBase-input': { fontSize: '13px' } }}
              >
                {availableProviders.map((p: any) => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </TextField>
              <TextField size='small' type='number' label='% chênh lệch' value={newMarkup}
                onChange={e => setNewMarkup(e.target.value)} placeholder='VD: 15'
                sx={{ width: 110, '& input': { fontSize: '13px', py: '6px' } }}
              />
              <TextField size='small' label='Ghi chú (tuỳ chọn)' value={newNote}
                onChange={e => setNewNote(e.target.value)}
                sx={{ flex: 1, minWidth: 120, '& input': { fontSize: '13px', py: '6px' } }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10, justifyContent: 'flex-end' }}>
              <Button size='small' onClick={() => setIsAdding(false)} sx={{ fontSize: '11px', textTransform: 'none' }}>Hủy</Button>
              <Button size='small' variant='contained' onClick={handleAdd}
                disabled={!newProviderId || !newMarkup || createMutation.isPending}
                sx={{ fontSize: '11px', textTransform: 'none' }}>
                Thêm
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button onClick={onClose} sx={{ fontSize: '12px', textTransform: 'none' }}>Đóng</Button>
      </DialogActions>
    </Dialog>
  )
}
