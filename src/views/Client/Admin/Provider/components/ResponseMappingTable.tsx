import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import { Plus, Trash2 } from 'lucide-react'

import CustomTextField from '@core/components/mui/TextField'
import FieldHint from './FieldHint'
import type { BuySectionProps, FormValues } from '../ProviderFormTypes'

function ResponseMappingRow({ prefix, index, control, onRemove }: BuySectionProps & { index: number; onRemove: () => void }) {
  const store = useWatch({ control, name: `${prefix}.response.response_mapping.${index}.store` as any })
  const presets = ['root', 'proxy', 'metadata']
  const isCustom = !!store && !presets.includes(store)

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'center' }}>
      <Controller name={`${prefix}.response.response_mapping.${index}.from` as any} control={control} render={({ field }) => (
        <CustomTextField {...field} size='small' placeholder='Trường NCC (VD: data.region)' sx={{ flex: 1, minWidth: 150 }} />
      )} />
      <Controller name={`${prefix}.response.response_mapping.${index}.to` as any} control={control} render={({ field }) => (
        <CustomTextField {...field} size='small' placeholder='Tên field lưu (VD: region)' sx={{ flex: 1, minWidth: 120 }} />
      )} />
      <Controller name={`${prefix}.response.response_mapping.${index}.store` as any} control={control} render={({ field }) => (
        <>
          <CustomTextField
            size='small' select
            value={isCustom ? '_custom' : (store || 'metadata')}
            onChange={e => { const v = e.target.value; field.onChange(v === '_custom' ? '' : v) }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value='root'>Cấp 1 (flat)</MenuItem>
            <MenuItem value='proxy'>Trong proxy</MenuItem>
            <MenuItem value='metadata'>Trong metadata</MenuItem>
            <MenuItem value='_custom'>Object tự đặt tên...</MenuItem>
          </CustomTextField>
          {(isCustom || store === '') && (
            <CustomTextField
              size='small'
              value={isCustom ? store : ''}
              onChange={e => field.onChange(e.target.value || '')}
              placeholder='Tên object (VD: extra_info)'
              sx={{ minWidth: 140 }}
            />
          )}
        </>
      )} />
      <IconButton size='small' onClick={onRemove} color='error'><Trash2 size={14} /></IconButton>
    </Box>
  )
}

export default function ResponseMappingTable({ prefix, control }: BuySectionProps) {
  const { fields, append, remove } = useFieldArray({ control, name: `${prefix}.response.response_mapping` as any })

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, mt: 1 }}>
        <Typography variant='body2' fontWeight={600}>
          Lưu thêm dữ liệu từ nhà cung cấp (mặc định)
          <FieldHint text='Cấu hình mặc định cho tất cả sản phẩm của nhà cung cấp này. Từng sản phẩm có thể ghi đè riêng trong form sản phẩm.' />
        </Typography>
        <Button size='small' startIcon={<Plus size={14} />} onClick={() => append({ from: '', to: '', store: 'metadata' })}>
          Thêm
        </Button>
      </Box>
      {fields.length === 0 && (
        <Typography variant='caption' color='text.secondary' sx={{ fontStyle: 'italic' }}>
          Chưa có. Bấm "Thêm" nếu muốn lưu thêm dữ liệu từ kết quả nhà cung cấp trả về.
        </Typography>
      )}
      {fields.map((f, i) => (
        <ResponseMappingRow key={f.id} prefix={prefix} index={i} control={control} onRemove={() => remove(i)} />
      ))}
    </>
  )
}
