'use client'

import { useState } from 'react'
import { Button, Grid2, Box, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material'
import { Plus, X } from 'lucide-react'
import { toast } from 'react-toastify'
import CustomTextField from '@/@core/components/mui/TextField'

interface PriceField {
  key: string
  value: string
  cost?: string
}

interface PriceByDurationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (fields: PriceField[]) => void
  fields: PriceField[]
  setFields: (fields: PriceField[]) => void
}

const durationOptions = [
  { value: '1', label: '1 ngày' },
  { value: '7', label: '1 tuần' },
  { value: '30', label: '1 tháng' }
]

export default function PriceByDurationModal({
  isOpen,
  onClose,
  onSave,
  fields,
  setFields
}: PriceByDurationModalProps) {
  const handleAddField = () => {
    setFields([...fields, { key: '', value: '', cost: '' }])
  }

  const handleRemoveField = (index: number) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index))
    }
  }

  const handleFieldChange = (index: number, field: 'key' | 'value' | 'cost', value: string) => {
    const updatedFields = [...fields]
    updatedFields[index][field] = value
    setFields(updatedFields)
  }

  const handleSave = () => {
    // Validate: check if all fields are filled
    const hasEmptyFields = fields.some(field => !field.key || !field.value)
    if (hasEmptyFields) {
      toast.error('Vui lòng điền đầy đủ tất cả các trường')
      return
    }

    // Validate: check for duplicate durations
    const keys = fields.map(f => f.key)
    const hasDuplicates = keys.some((key, index) => keys.indexOf(key) !== index)
    if (hasDuplicates) {
      toast.error('Không được chọn trùng thời gian')
      return
    }

    // Đảm bảo cost luôn có trong mỗi field (ít nhất là empty string)
    const formattedFields = fields.map(field => ({
      key: field.key,
      value: field.value,
      cost: field.cost || ''
    }))

    console.log('Saving price fields with cost:', formattedFields)
    onSave(formattedFields)
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  // Get available options for each select (excluding already selected ones)
  const getAvailableOptions = (currentIndex: number) => {
    const selectedKeys = fields.map((f, idx) => (idx !== currentIndex ? f.key : null)).filter(Boolean)
    return durationOptions.filter(opt => !selectedKeys.includes(opt.value))
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle className='bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-between'>
        <div className='text-xl text-white font-semibold'>Set giá theo thời gian</div>
        <button
          onClick={handleClose}
          className='text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg p-1 transition-all'
        >
          <X size={20} />
        </button>
      </DialogTitle>
      <DialogContent className='mt-4'>
        <div className='space-y-4'>
          {fields.map((field, index) => (
            <Box key={index}>
              <Grid2 container spacing={3} className='flex align-bottom items-end'>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <CustomTextField
                    required
                    size='medium'
                    fullWidth
                    select
                    label='Thời gian'
                    value={field.key}
                    onChange={e => handleFieldChange(index, 'key', e.target.value)}
                    slotProps={{
                      select: { displayEmpty: true }
                    }}
                  >
                    <MenuItem value=''>
                      <em>Chọn thời gian</em>
                    </MenuItem>
                    {getAvailableOptions(index).map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 3 }}>
                  <CustomTextField
                    required
                    size='medium'
                    fullWidth
                    type='number'
                    label='Giá tiền'
                    placeholder='Nhập giá tiền'
                    value={field.value}
                    onChange={e => handleFieldChange(index, 'value', e.target.value)}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 3 }}>
                  <CustomTextField
                    size='medium'
                    fullWidth
                    type='number'
                    label='Giá cost'
                    placeholder='Nhập giá cost'
                    value={field.cost || ''}
                    onChange={e => handleFieldChange(index, 'cost', e.target.value)}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 2 }}>
                  <Button
                    variant='tonal'
                    color='error'
                    size='large'
                    startIcon={<X size={16} />}
                    fullWidth
                    onClick={() => handleRemoveField(index)}
                    disabled={fields.length === 1}
                  >
                    Xóa
                  </Button>
                </Grid2>
              </Grid2>
            </Box>
          ))}
        </div>
      </DialogContent>
      <DialogActions className='p-4 flex-col items-stretch gap-2'>
        <div className='flex gap-2'>
          <Button
            onClick={handleAddField}
            variant='outlined'
            color='primary'
            startIcon={<Plus size={16} />}
            fullWidth
            disabled={fields.length >= durationOptions.length}
          >
            Thêm thời gian
          </Button>
          <Button onClick={handleSave} variant='contained' className='text-white' color='success' fullWidth>
            Lưu tất cả
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
