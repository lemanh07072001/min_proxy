import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import Grid2 from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Plus, Trash2 } from 'lucide-react'

import CustomTextField from '@core/components/mui/TextField'
import FieldHint from '../components/FieldHint'
import type { SectionProps, FormValues } from '../ProviderFormTypes'
import { VALUE_LABELS, ORDER_FIELDS, ITEM_FIELDS } from '../ProviderFormTypes'

// ─── Sub-components ─────────────────────────────────

function RenewParamRow({ index, control, onRemove }: { index: number; control: SectionProps['control']; onRemove: () => void }) {
  const valueType = useWatch({ control, name: `renew.params_rows.${index}.value_type` as any })

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'center' }}>
      <Controller name={`renew.params_rows.${index}.param_name` as any} control={control} render={({ field }) => (
        <CustomTextField {...field} size='small' placeholder='Tên param (VD: order_id)' sx={{ flex: 1 }} />
      )} />
      <Controller name={`renew.params_rows.${index}.value_type` as any} control={control} render={({ field }) => (
        <CustomTextField {...field} size='small' select sx={{ minWidth: 170 }}>
          {Object.entries(VALUE_LABELS).map(([k, v]) => (
            <MenuItem key={k} value={k}>{v}</MenuItem>
          ))}
        </CustomTextField>
      )} />
      {valueType === 'custom' && (
        <Controller name={`renew.params_rows.${index}.custom_value` as any} control={control} render={({ field }) => (
          <CustomTextField {...field} size='small' placeholder='Giá trị' sx={{ flex: 1 }} />
        )} />
      )}
      <IconButton size='small' onClick={onRemove} color='error'><Trash2 size={14} /></IconButton>
    </Box>
  )
}

function RenewParamsTable({ control }: SectionProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'renew.params_rows' as any })

  return (
    <Grid2 size={{ xs: 12 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant='body2' fontWeight={600}>Tham số gửi NCC</Typography>
        <Button size='small' startIcon={<Plus size={14} />}
          onClick={() => append({ param_name: '', value_type: 'custom', custom_value: '' })}>
          Thêm
        </Button>
      </Box>
      {fields.length === 0 && (
        <Typography variant='caption' color='text.secondary' sx={{ fontStyle: 'italic' }}>
          Chưa có tham số. Bấm "Thêm" nếu NCC cần gửi kèm dữ liệu.
        </Typography>
      )}
      {fields.map((f, i) => (
        <RenewParamRow key={f.id} index={i} control={control} onRemove={() => remove(i)} />
      ))}
    </Grid2>
  )
}

function DurationMapSection({ control }: SectionProps) {
  const enabled = useWatch({ control, name: 'renew.duration_map_enabled' as any })
  const { fields, append, remove } = useFieldArray({ control, name: 'renew.duration_map_rows' as any })

  return (
    <Grid2 size={{ xs: 12 }}>
      <Controller name='renew.duration_map_enabled' control={control} render={({ field }) => (
        <FormControlLabel
          control={<Checkbox {...field} checked={!!field.value} size='small' />}
          label={<Typography variant='body2'>NCC dùng tên thay số ngày (VD: weekly, monthly)</Typography>}
        />
      )} />
      {enabled && (
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant='caption' color='text.secondary'>Quy đổi: số ngày → giá trị gửi NCC</Typography>
            <Button size='small' startIcon={<Plus size={14} />}
              onClick={() => append({ days: '', send_value: '' })}>
              Thêm
            </Button>
          </Box>
          {fields.map((f, i) => (
            <Box key={f.id} sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'center' }}>
              <Controller name={`renew.duration_map_rows.${i}.days` as any} control={control} render={({ field }) => (
                <CustomTextField {...field} size='small' placeholder='Số ngày (VD: 7)' sx={{ width: 120 }} />
              )} />
              <Typography variant='body2' color='text.secondary'>→</Typography>
              <Controller name={`renew.duration_map_rows.${i}.send_value` as any} control={control} render={({ field }) => (
                <CustomTextField {...field} size='small' placeholder='Gửi NCC (VD: weekly)' sx={{ flex: 1 }} />
              )} />
              <IconButton size='small' onClick={() => remove(i)} color='error'><Trash2 size={14} /></IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Grid2>
  )
}

function InheritParamRow({ control, index, onRemove }: { control: SectionProps['control']; index: number; onRemove: () => void }) {
  const source = useWatch({ control, name: `renew.inherit_params.${index}.source` as any })
  const fieldOptions = source === 'order_item' ? ITEM_FIELDS : ORDER_FIELDS

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
      <Controller name={`renew.inherit_params.${index}.source` as any} control={control} render={({ field }) => (
        <CustomTextField {...field} select size='small' sx={{ minWidth: 130 }} label='Lấy từ'>
          <MenuItem value='order'>Đơn hàng</MenuItem>
          <MenuItem value='order_item'>Proxy</MenuItem>
        </CustomTextField>
      )} />
      <Controller name={`renew.inherit_params.${index}.field` as any} control={control} render={({ field }) => (
        <CustomTextField {...field} select size='small' sx={{ minWidth: 160 }} label='Thông tin cần lấy'>
          {fieldOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          <MenuItem value='__custom'>Tự nhập...</MenuItem>
        </CustomTextField>
      )} />
      {useWatch({ control, name: `renew.inherit_params.${index}.field` as any }) === '__custom' && (
        <Controller name={`renew.inherit_params.${index}.field` as any} control={control} render={({ field }) => (
          <CustomTextField {...field} size='small' sx={{ minWidth: 120 }} label='Field' placeholder='metadata.xxx' />
        )} />
      )}
      <Controller name={`renew.inherit_params.${index}.param` as any} control={control} render={({ field }) => (
        <CustomTextField {...field} size='small' sx={{ minWidth: 130 }} label='NCC gọi là gì?' placeholder='country_code' />
      )} />
      <IconButton size='small' onClick={onRemove} color='error'><i className='tabler-trash' /></IconButton>
    </Box>
  )
}

function InheritParamsTable({ control }: SectionProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'renew.inherit_params' as any })

  return (
    <Grid2 size={{ xs: 12 }}>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant='body2' fontWeight={600}>
          Lấy thông tin từ đơn hàng gốc
        </Typography>
        <Button size='small' onClick={() => append({ source: 'order', field: '', param: '' })}>
          + Thêm
        </Button>
      </Box>
      {fields.map((f, i) => (
        <InheritParamRow key={f.id} control={control} index={i} onRemove={() => remove(i)} />
      ))}
      {fields.length === 0 && (
        <Typography variant='body2' color='text.secondary' sx={{ mb: 1, fontStyle: 'italic' }}>
          NCC chỉ cần mã đơn/mã proxy/số ngày — không cần thêm thông tin khác.
        </Typography>
      )}
    </Grid2>
  )
}

// ─── Main Section ───────────────────────────────────

export default function RenewSection({ control }: SectionProps) {
  const enabled = useWatch({ control, name: 'renew.enabled' })
  const mode = useWatch({ control, name: 'renew.mode' })
  const renewAuthType = useWatch({ control, name: 'renew.auth_type' })

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Controller
          name='renew.enabled'
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <CustomTextField
              {...field}
              value={value ? 'true' : 'false'}
              onChange={(e) => onChange(e.target.value === 'true')}
              fullWidth select label='Hỗ trợ gia hạn'
            >
              <MenuItem value='false'>Tắt</MenuItem>
              <MenuItem value='true'>Bật</MenuItem>
            </CustomTextField>
          )}
        />
      </Grid2>

      {enabled && (
        <>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller name='renew.mode' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth select label='Cách gia hạn'>
                <MenuItem value='by_order'>1 lệnh cho cả đơn</MenuItem>
                <MenuItem value='by_item'>Gọi riêng từng proxy</MenuItem>
              </CustomTextField>
            )} />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller name='renew.method' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth select label='Method'>
                <MenuItem value='GET'>GET</MenuItem>
                <MenuItem value='POST'>POST</MenuItem>
              </CustomTextField>
            )} />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller name='renew.auth_type' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth select label='Xác thực NCC'>
                <MenuItem value='inherit'>Giống lúc mua</MenuItem>
                <MenuItem value='query'>Key trong URL (?key=xxx)</MenuItem>
                <MenuItem value='header'>Key trong header</MenuItem>
                <MenuItem value='bearer'>Bearer token</MenuItem>
              </CustomTextField>
            )} />
          </Grid2>

          {renewAuthType && renewAuthType !== 'inherit' && renewAuthType !== 'bearer' && (
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Controller name='renew.auth_param' control={control} render={({ field }) => (
                <CustomTextField {...field} fullWidth
                  label='NCC gọi tên key là gì?'
                  placeholder={renewAuthType === 'header' ? 'apikey' : 'key'}
                />
              )} />
            </Grid2>
          )}

          <Grid2 size={{ xs: 12 }}>
            <Controller name='renew.url' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth
                label='URL gia hạn'
                placeholder='https://api.ncc.com/renew/{provider_order_code}'
                helperText={
                  field.value?.includes('{')
                    ? '↳ ' + field.value
                        .replace(/\{provider_order_code\}/g, 'TXN-12345')
                        .replace(/\{provider_item_id\}/g, 'PROXY-001')
                        .replace(/\{duration\}/g, '30')
                    : 'Dùng {provider_order_code} = mã đơn NCC, {provider_item_id} = mã proxy, {duration} = số ngày'
                }
              />
            )} />
          </Grid2>

          <RenewParamsTable control={control} />

          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller name='renew.duration_param' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label='NCC gọi "số ngày" là gì?' placeholder='days' helperText='Tên tham số gửi số ngày. VD: days, duration, period' />
            )} />
          </Grid2>

          <DurationMapSection control={control} />

          {mode === 'by_item' && (
            <Grid2 size={{ xs: 6, sm: 4 }}>
              <Controller name='renew.batch_delay_ms' control={control} render={({ field }) => (
                <CustomTextField {...field} fullWidth type='number' label='Nghỉ giữa mỗi proxy (ms)' placeholder='0' helperText='Nếu NCC giới hạn tốc độ gọi. 0 = không nghỉ' />
              )} />
            </Grid2>
          )}

          <InheritParamsTable control={control} />

          <Grid2 size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }}>
              NCC trả về thế nào khi thành công?
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller name='renew.success_field' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label='Field báo OK' placeholder='status' />
            )} />
          </Grid2>
          <Grid2 size={{ xs: 6, sm: 3 }}>
            <Controller name='renew.success_value' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label='Giá trị OK' placeholder='success' />
            )} />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Controller name='renew.new_expiry_field' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth label='Field ngày hết hạn mới' placeholder='data.expired_at' helperText='Bỏ trống = tự tính từ hạn cũ + số ngày' />
            )} />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller name='renew.response_mode' control={control} render={({ field }) => (
              <CustomTextField {...field} fullWidth select label='NCC xác nhận thế nào?'>
                <MenuItem value='immediate'>Trả kết quả ngay</MenuItem>
                <MenuItem value='deferred'>Cần gọi lại sau để kiểm tra</MenuItem>
              </CustomTextField>
            )} />
          </Grid2>
        </>
      )}
    </Grid2>
  )
}
