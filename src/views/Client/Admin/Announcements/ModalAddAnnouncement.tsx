'use client'

import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material'
import Grid2 from '@mui/material/Grid2'

import { useCreateAnnouncement, useUpdateAnnouncement } from '@/hooks/apis/useAnnouncements'
import type { Announcement } from '@/hooks/apis/useAnnouncements'
import { toast } from 'react-toastify'
import RichTextEditor from '@/components/editor/RichTextEditor'

const TYPE_OPTIONS = [
  { value: 'discount', label: 'Giảm giá' },
  { value: 'new_product', label: 'Sản phẩm mới' },
  { value: 'price_change', label: 'Thay đổi giá' },
  { value: 'maintenance', label: 'Bảo trì' },
  { value: 'general', label: 'Chung' }
]

const COLOR_OPTIONS = [
  { value: 'bg-green-500', label: 'Xanh lá', hex: '#22c55e' },
  { value: 'bg-blue-500', label: 'Xanh dương', hex: '#3b82f6' },
  { value: 'bg-yellow-500', label: 'Vàng', hex: '#eab308' },
  { value: 'bg-red-500', label: 'Đỏ', hex: '#ef4444' },
  { value: 'bg-teal-500', label: 'Xanh ngọc', hex: '#14b8a6' },
  { value: 'bg-purple-500', label: 'Tím', hex: '#a855f7' },
  { value: 'bg-pink-500', label: 'Hồng', hex: '#ec4899' }
]

const DISPLAY_TYPE_OPTIONS = [
  { value: 'home', label: 'Trang chủ (feed)' },
  { value: 'modal', label: 'Popup (hiện khi vào trang)' }
]

interface Props {
  open: boolean
  onClose: () => void
  type: 'create' | 'edit'
  data?: Announcement | null
}

const defaultForm = {
  title: '',
  content: '',
  type: 'general' as string,
  color: 'bg-blue-500',
  display_type: 'home' as string,
  display_order: 0,
  is_active: true,
  published_at: ''
}

export default function ModalAddAnnouncement({ open, onClose, type, data }: Props) {
  const createMutation = useCreateAnnouncement()
  const updateMutation = useUpdateAnnouncement()
  const [formData, setFormData] = useState(defaultForm)

  useEffect(() => {
    if (open && type === 'edit' && data) {
      setFormData({
        title: data.title,
        content: data.content,
        type: data.type,
        color: data.color,
        display_type: data.display_type || 'home',
        display_order: data.display_order ?? 0,
        is_active: data.is_active,
        published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : ''
      })
    } else if (open && type === 'create') {
      setFormData({ ...defaultForm, published_at: new Date().toISOString().slice(0, 16) })
    }
  }, [open, type, data])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    const contentText = formData.content.replace(/<[^>]*>/g, '').trim()

    if (!formData.title.trim() || !contentText) {
      toast.error('Vui lòng điền đầy đủ tiêu đề và nội dung')

      return
    }

    try {
      if (type === 'edit' && data) {
        await updateMutation.mutateAsync({ id: data.id, ...formData })
        toast.success('Cập nhật thông báo thành công')
      } else {
        await createMutation.mutateAsync(formData)
        toast.success('Tạo thông báo thành công')
      }

      onClose()
    } catch {
      toast.error('Có lỗi xảy ra')
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md' closeAfterTransition={false}>
      <DialogTitle>
        <Typography variant='h6'>
          {type === 'create' ? 'Tạo thông báo mới' : 'Chỉnh sửa thông báo'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={3} sx={{ mt: 1 }}>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              fullWidth
              label='Tiêu đề'
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              size='small'
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Typography variant='body2' sx={{ mb: 1, color: '#64748b' }}>Nội dung</Typography>
            <RichTextEditor
              value={formData.content}
              onChange={(html) => handleChange('content', html)}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              fullWidth
              select
              label='Loại thông báo'
              value={formData.type}
              onChange={e => handleChange('type', e.target.value)}
              size='small'
            >
              {TYPE_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              fullWidth
              select
              label='Màu sắc'
              value={formData.color}
              onChange={e => handleChange('color', e.target.value)}
              size='small'
            >
              {COLOR_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: opt.hex }} />
                    {opt.label}
                  </span>
                </MenuItem>
              ))}
            </TextField>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              fullWidth
              select
              label='Vị trí hiển thị'
              value={formData.display_type}
              onChange={e => handleChange('display_type', e.target.value)}
              size='small'
            >
              {DISPLAY_TYPE_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              fullWidth
              label='Thứ tự hiển thị'
              type='number'
              value={formData.display_order}
              onChange={e => handleChange('display_order', parseInt(e.target.value) || 0)}
              size='small'
              helperText='Số nhỏ hơn hiển thị trước (popup)'
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              fullWidth
              label='Ngày đăng'
              type='datetime-local'
              value={formData.published_at}
              onChange={e => handleChange('published_at', e.target.value)}
              size='small'
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={e => handleChange('is_active', e.target.checked)}
                />
              }
              label='Hiển thị'
              sx={{ mt: 1 }}
            />
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined' disabled={isPending} sx={{ color: '#64748b', borderColor: '#cbd5e1' }}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant='contained' disabled={isPending} sx={{ color: '#fff' }}>
          {isPending ? 'Đang xử lý...' : type === 'create' ? 'Tạo mới' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
