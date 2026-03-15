'use client'

import { useState } from 'react'

import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  FormControlLabel,
  Switch,
  Grid2,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material'
import { FileText, Plus, X } from 'lucide-react'
import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'

interface MultiInputField {
  key: string
  value: string
}

interface MultiInputModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (fields: MultiInputField[]) => void
  title?: string
  keyLabel?: string
  valueLabel?: string
  fields: MultiInputField[]
  setFields: (fields: MultiInputField[]) => void
}

export default function MultiInputModal({
  isOpen,
  onClose,
  onSave,
  title = 'Thêm nhiều trường',
  keyLabel = 'Key',
  valueLabel = 'Value',
  fields,
  setFields
}: MultiInputModalProps) {
  const multiInputFields = fields
  const setMultiInputFields = setFields

  const handleAddInputField = () => {
    setMultiInputFields([...multiInputFields, { key: '', value: '' }])
  }

  const handleRemoveInputField = (index: number) => {
    if (multiInputFields.length > 1) {
      setMultiInputFields(multiInputFields.filter((_, i) => i !== index))
    }
  }

  const handleInputFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedFields = [...multiInputFields]

    updatedFields[index][field] = value
    setMultiInputFields(updatedFields)
  }

  const handleSave = () => {
    // Validate: check if all fields are filled
    const hasEmptyFields = multiInputFields.some(field => !field.key || !field.value)

    if (hasEmptyFields) {
      toast.error('Vui lòng điền đầy đủ tất cả các trường')
      
return
    }

    onSave(multiInputFields)
    handleClose()
  }

  const handleClose = () => {
    // Không reset fields nữa, giữ nguyên dữ liệu
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, px: 2, borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'color-mix(in srgb, var(--primary-hover, #6366f1) 12%, white)' }}>
            <FileText size={16} style={{ color: 'var(--primary-hover, #6366f1)' }} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>Thông tin mô tả</span>
        </div>
        <IconButton onClick={handleClose} size='small' sx={{ color: '#9ca3af' }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent className='mt-4'>
        <div className='space-y-4'>
          {multiInputFields.map((field, index) => (
            <Box key={index}>
              <Grid2 container spacing={3} className='flex align-bottom items-end'>
                <Grid2 size={{ xs: 12, sm: 5 }}>
                  <CustomTextField
                    required
                    size='medium'
                    fullWidth
                    label='Tiêu đề'
                    placeholder='Nhập tiêu đề...'
                    value={field.key}
                    onChange={e => handleInputFieldChange(index, 'key', e.target.value)}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 5 }}>
                  <CustomTextField
                    required
                    size='medium'
                    fullWidth
                    label='Mô tả'
                    placeholder='Nhập mô tả'
                    value={field.value}
                    onChange={e => handleInputFieldChange(index, 'value', e.target.value)}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 2 }}>
                  <Button
                    variant='tonal'
                    color='error'
                    size='large'
                    startIcon={<X size={16} />}
                    fullWidth
                    onClick={() => handleRemoveInputField(index)}
                    disabled={multiInputFields.length === 1}
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
            onClick={handleAddInputField}
            variant='outlined'
            color='primary'
            startIcon={<Plus size={16} />}
            fullWidth
          >
            Thêm trường mới
          </Button>
          <Button onClick={handleSave} variant='contained' className='text-white' color='success' fullWidth>
            Lưu tất cả
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
