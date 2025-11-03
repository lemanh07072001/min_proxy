'use client'

import { useState, useEffect } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid
} from '@mui/material'

interface ModalFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  mode?: string
  initialData?: any
}

export default function ModalForm({ open, onClose, mode, onSubmit, initialData }: ModalFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    cost_price: '',
    price: '',
    status: 'active',
    partner_id: '',
    type: '',
    ip_version: ''
  })

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        cost_price: initialData.cost_price || '',
        price: initialData.price || '',
        status: initialData.status || 'active',
        partner_id: initialData.partner_id || '',
        type: initialData.type || '',
        ip_version: initialData.ip_version || ''
      })
    } else {
      setFormData({
        name: '',
        cost_price: '',
        price: '',
        status: 'active',
        partner_id: '',
        type: '',
        ip_version: ''
      })
    }
  }, [mode, initialData, open])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>{mode === 'edit' ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Tên dịch vụ'
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Giá vốn'
              type='number'
              value={formData.cost_price}
              onChange={e => handleChange('cost_price', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Giá bán'
              type='number'
              value={formData.price}
              onChange={e => handleChange('price', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label='Trạng thái'
              value={formData.status}
              onChange={e => handleChange('status', e.target.value)}
            >
              <MenuItem value='active'>Active</MenuItem>
              <MenuItem value='inactive'>Inactive</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Partner ID'
              type='number'
              value={formData.partner_id}
              onChange={e => handleChange('partner_id', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Type'
              value={formData.type}
              onChange={e => handleChange('type', e.target.value)}
              placeholder='VD: ROTATING, STATIC'
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='IP Version'
              value={formData.ip_version}
              onChange={e => handleChange('ip_version', e.target.value)}
              placeholder='VD: IPv4, IPv6'
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant='contained' onClick={handleSubmit}>
          {mode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
