'use client'

import { useMemo } from 'react'

import { Button, Grid2, Box, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, IconButton, Typography } from '@mui/material'
import { DollarSign, Plus, X, AlertTriangle } from 'lucide-react'
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
  provider?: any // Provider object với api_config
  proxyType?: string // '0' = STATIC, '1' = ROTATING
}

// Duration mặc định khi NCC không cấu hình url_by_duration
const DEFAULT_DURATION_OPTIONS = [
  { value: '1', label: '1 ngày' },
  { value: '3', label: '3 ngày' },
  { value: '7', label: '7 ngày (1 tuần)' },
  { value: '14', label: '14 ngày (2 tuần)' },
  { value: '21', label: '21 ngày (3 tuần)' },
  { value: '30', label: '30 ngày (1 tháng)' }
]

const DURATION_LABEL_MAP: Record<string, string> = {
  '1': '1 ngày',
  '3': '3 ngày',
  '7': '7 ngày (1 tuần)',
  '14': '14 ngày (2 tuần)',
  '21': '21 ngày (3 tuần)',
  '30': '30 ngày (1 tháng)',
  '60': '60 ngày (2 tháng)',
  '90': '90 ngày (3 tháng)',
  '180': '180 ngày (6 tháng)',
  '365': '365 ngày (1 năm)',
}

export default function PriceByDurationModal({
  isOpen,
  onClose,
  onSave,
  fields,
  setFields,
  provider,
  proxyType
}: PriceByDurationModalProps) {
  // Lấy duration options từ cấu hình NCC
  const { durationOptions, hasProviderUrls, providerUrlMap } = useMemo(() => {
    if (!provider?.api_config) {
      return { durationOptions: DEFAULT_DURATION_OPTIONS, hasProviderUrls: false, providerUrlMap: {} }
    }

    const config = typeof provider.api_config === 'string'
      ? JSON.parse(provider.api_config)
      : provider.api_config

    // Xác định buy config theo loại proxy
    const buyKey = proxyType === '0' ? 'buy_static' : 'buy_rotating'
    const buyConfig = config?.[buyKey] ?? config?.buy ?? null

    if (!buyConfig) {
      return { durationOptions: DEFAULT_DURATION_OPTIONS, hasProviderUrls: false, providerUrlMap: {} }
    }

    const urlByDuration = buyConfig.url_by_duration
    if (!urlByDuration || typeof urlByDuration !== 'object' || Object.keys(urlByDuration).length === 0) {
      // NCC dùng 1 URL chung → hiện tất cả duration
      return { durationOptions: DEFAULT_DURATION_OPTIONS, hasProviderUrls: false, providerUrlMap: {} }
    }

    // NCC có url_by_duration → chỉ hiện duration đã cấu hình
    const options = Object.keys(urlByDuration).map(key => ({
      value: key,
      label: DURATION_LABEL_MAP[key] || `${key} ngày`
    })).sort((a, b) => Number(a.value) - Number(b.value))

    return { durationOptions: options, hasProviderUrls: true, providerUrlMap: urlByDuration }
  }, [provider, proxyType])

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
    const hasEmptyFields = fields.some(field => !field.key || !field.value)

    if (hasEmptyFields) {
      toast.error('Vui lòng điền đầy đủ tất cả các trường')

      return
    }

    const keys = fields.map(f => f.key)
    const hasDuplicates = keys.some((key, index) => keys.indexOf(key) !== index)

    if (hasDuplicates) {
      toast.error('Không được chọn trùng thời gian')

      return
    }

    const formattedFields = fields.map(field => ({
      key: field.key,
      value: field.value,
      cost: field.cost || ''
    }))

    onSave(formattedFields)
    onClose()
  }

  // Get available options for each select (excluding already selected ones)
  const getAvailableOptions = (currentIndex: number) => {
    const selectedKeys = fields.map((f, idx) => (idx !== currentIndex ? f.key : null)).filter(Boolean)

    return durationOptions.filter(opt => !selectedKeys.includes(opt.value))
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, px: 2, borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'color-mix(in srgb, var(--primary-hover, #6366f1) 12%, white)' }}>
            <DollarSign size={16} style={{ color: 'var(--primary-hover, #6366f1)' }} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>Set giá theo thời gian</span>
        </div>
        <IconButton onClick={onClose} size='small' sx={{ color: '#9ca3af' }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent className='mt-4'>
        {/* Thông tin NCC */}
        {hasProviderUrls && (
          <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <Typography sx={{ fontSize: 12, color: '#166534', fontWeight: 600, mb: 0.5 }}>
              NCC đã cấu hình URL riêng theo thời hạn
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#15803d' }}>
              Chỉ hiện các thời hạn mà NCC có URL. Nếu cần thêm → cấu hình ở trang Nhà cung cấp.
            </Typography>
          </Box>
        )}

        {!provider && (
          <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, background: '#fffbeb', border: '1px solid #fde68a', display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <AlertTriangle size={14} color='#b45309' style={{ flexShrink: 0, marginTop: 2 }} />
            <Typography sx={{ fontSize: 12, color: '#92400e' }}>
              Chưa chọn nhà cung cấp — hiện tất cả thời hạn mặc định. Chọn NCC trước để hiện đúng thời hạn đã cấu hình.
            </Typography>
          </Box>
        )}

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
                  {/* Hiện URL NCC nếu có */}
                  {hasProviderUrls && field.key && providerUrlMap[field.key] && (
                    <Typography sx={{ fontSize: 10, color: '#6b7280', mt: 0.5, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      URL: {providerUrlMap[field.key]}
                    </Typography>
                  )}
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
