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

const VALUE_HINTS: Record<string, string> = {
  provider_order_code: 'Order ID do NCC gán khi mua. Lưu tại order_items. Các items cùng đơn → cùng mã. Dùng khi NCC gia hạn cả đơn 1 lệnh.',
  provider_item_id: 'Item ID do NCC gán cho từng item khi mua. Lưu tại order_items. Mỗi item có ID riêng. Dùng khi NCC gia hạn từng item.',
  duration: 'Số ngày khách chọn gia hạn (VD: 7, 30). Hệ thống tự truyền.',
  custom: 'Giá trị cố định — luôn gửi giống nhau mỗi lần gia hạn.',
}

function RenewParamRow({ index, control, onRemove }: { index: number; control: SectionProps['control']; onRemove: () => void }) {
  const valueType = useWatch({ control, name: `renew.params_rows.${index}.value_type` as any })
  const isFirst = index === 0

  return (
    <Box sx={{ mb: 1.5, p: 1.5, background: '#fafbfc', border: '1px solid #e2e8f0', borderRadius: 1.5, position: 'relative' }}>
      <IconButton size='small' onClick={onRemove} color='error' sx={{ position: 'absolute', top: 6, right: 6 }}><Trash2 size={14} /></IconButton>
      <Grid2 container spacing={1.5}>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Controller name={`renew.params_rows.${index}.param_name` as any} control={control} render={({ field }) => (
            <CustomTextField {...field} size='small' fullWidth label='Tên param gửi đi' placeholder='VD: loaiproxy, order_id' helperText='Tên biến khi call API sang NCC' />
          )} />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: valueType === 'custom' ? 4 : 8 }}>
          <Controller name={`renew.params_rows.${index}.value_type` as any} control={control} render={({ field }) => (
            <CustomTextField {...field} size='small' select fullWidth label='Giá trị lấy từ đâu?'>
              <MenuItem value='provider_order_code'>Order ID NCC — chung cả đơn</MenuItem>
              <MenuItem value='provider_item_id'>Item ID NCC — riêng từng item</MenuItem>
              <MenuItem value='duration'>Số ngày gia hạn — khách chọn</MenuItem>
              <MenuItem value='custom'>Giá trị cố định — nhập tay</MenuItem>
            </CustomTextField>
          )} />
        </Grid2>
        {valueType === 'custom' && (
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Controller name={`renew.params_rows.${index}.custom_value` as any} control={control} render={({ field }) => (
              <CustomTextField {...field} size='small' fullWidth label='Giá trị cố định' placeholder='VD: 4Gvinaphone' />
            )} />
          </Grid2>
        )}
      </Grid2>
      {valueType && (
        <Typography sx={{ fontSize: 11, color: '#94a3b8', mt: 0.75 }}>
          → {VALUE_HINTS[valueType] || ''}
        </Typography>
      )}
    </Box>
  )
}

function RenewParamsTable({ control }: SectionProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'renew.params_rows' as any })

  return (
    <Grid2 size={{ xs: 12 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant='body2' fontWeight={600}>Tham số gửi NCC khi gia hạn</Typography>
        <Button size='small' startIcon={<Plus size={14} />}
          onClick={() => append({ param_name: '', value_type: 'custom', custom_value: '' })}>
          Thêm
        </Button>
      </Box>
      <Box sx={{ mb: 1.5, p: 1.5, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1.5, fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
        Khi gia hạn, hệ thống gọi API NCC kèm các tham số bên dưới. Mỗi dòng = <strong>1 param</strong> gửi trong request.
        <br />
        <strong>Cột trái:</strong> tên param (NCC gọi là gì — xem trong URL hoặc tài liệu API)
        <br />
        <strong>Cột phải:</strong> giá trị lấy từ đâu — hệ thống tự thay thế khi gửi
        <Box sx={{ mt: 1, p: 1, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 1 }}>
          <Typography sx={{ fontSize: 11.5, color: '#0c4a6e', fontWeight: 600, mb: 0.5 }}>Ví dụ:</Typography>
          <Typography sx={{ fontSize: 11.5, color: '#334155', fontFamily: 'monospace', lineHeight: 2 }}>
            <span style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: 3 }}>loaiproxy</span> = <span style={{ color: '#16a34a' }}>Cố định</span> → <code>loaiproxy=4Gvinaphone</code> (luôn gửi giá trị này)
            <br />
            <span style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: 3 }}>idproxy</span> = <span style={{ color: '#3b82f6' }}>ID proxy NCC</span> → <code>idproxy=566171</code> (lưu trong mỗi proxy khi mua)
            <br />
            <span style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: 3 }}>order_id</span> = <span style={{ color: '#f59e0b' }}>Mã đơn NCC</span> → <code>order_id=46de87...</code> (chung cho cả đơn, lưu trong proxy)
            <br />
            <span style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: 3 }}>ngay</span> = <span style={{ color: '#8b5cf6' }}>Số ngày</span> → <code>ngay=30</code> (khách chọn khi gia hạn)
          </Typography>
        </Box>
      </Box>
      {fields.length === 0 && (
        <Typography variant='caption' color='text.secondary' sx={{ fontStyle: 'italic' }}>
          Chưa có tham số. Bấm "Thêm" nếu NCC cần gửi kèm dữ liệu khi gia hạn.
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
          <MenuItem value='order'>Đơn hàng (orders)</MenuItem>
          <MenuItem value='order_item'>Chi tiết đơn (order_items)</MenuItem>
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Giải thích tổng quan */}
      <Box sx={{ p: 1.5, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 1.5 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#92400e', mb: 0.5 }}>
          Gia hạn proxy — kéo dài thời hạn sử dụng
        </Typography>
        <Typography sx={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
          Khi proxy sắp hết hạn, khách bấm <strong>"Gia hạn"</strong> → hệ thống gọi API NCC → NCC gia hạn → hệ thống cập nhật ngày hết hạn mới.
          <br />
          <strong>2 chế độ:</strong> Gọi 1 lệnh cho cả đơn (by_order) hoặc gọi riêng từng proxy (by_item).
        </Typography>
      </Box>

      <Controller
        name='renew.enabled'
        control={control}
        render={({ field: { value, onChange, ...field } }) => (
          <CustomTextField
            {...field}
            value={value ? 'true' : 'false'}
            onChange={(e) => onChange(e.target.value === 'true')}
            fullWidth select label='NCC hỗ trợ gia hạn?'
          >
            <MenuItem value='false'>Không — bỏ qua</MenuItem>
            <MenuItem value='true'>Có — cấu hình bên dưới</MenuItem>
          </CustomTextField>
        )}
      />

      {enabled && (
        <>
          {/* ═══ Nhóm 1: Gọi API gia hạn ═══ */}
          <Box sx={{ border: '1px solid #fcd34d', borderTop: '3px solid #f59e0b', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ background: '#fffbeb', borderBottom: '1px solid #fde68a', px: 2, py: 1.25 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#d97706' }}>
                Gọi API gia hạn
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#475569', mt: 0.25 }}>
                Hệ thống BUILD request từ URL + params bên dưới → gửi NCC. Biến trong URL (như {'{provider_order_code}'}) sẽ tự thay bằng giá trị thật.
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Controller name='renew.mode' control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth select label='Cách gia hạn' helperText='by_order: 1 request cho toàn bộ. by_item: loop từng proxy.'>
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
                      <MenuItem value='inherit'>Giống lúc mua (dùng cùng token)</MenuItem>
                      <MenuItem value='query'>Key trong URL (?key=xxx)</MenuItem>
                      <MenuItem value='header'>Key trong header</MenuItem>
                      <MenuItem value='bearer'>Bearer token</MenuItem>
                    </CustomTextField>
                  )} />
                </Grid2>

                {renewAuthType && renewAuthType !== 'inherit' && renewAuthType !== 'bearer' && (
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Controller name='renew.auth_param' control={control} render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Tên param token' placeholder={renewAuthType === 'header' ? 'apikey' : 'key'} />
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
                          ? '↳ Preview: ' + field.value
                              .replace(/\{provider_order_code\}/g, 'TXN-12345')
                              .replace(/\{provider_item_id\}/g, 'PROXY-001')
                              .replace(/\{duration\}/g, '30')
                          : 'Dùng {provider_order_code} = mã đơn NCC, {provider_item_id} = mã proxy, {duration} = số ngày'
                      }
                    />
                  )} />
                </Grid2>
              </Grid2>
            </Box>
          </Box>

          {/* ═══ Nhóm 2: Tham số gửi kèm ═══ */}
          <Box sx={{ border: '1px solid #c4b5fd', borderTop: '3px solid #8b5cf6', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ background: '#f5f3ff', borderBottom: '1px solid #c4b5fd', px: 2, py: 1.25 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#7c3aed' }}>
                Tham số gửi kèm request
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#475569', mt: 0.25 }}>
                Ngoài URL, NCC có thể cần thêm params (loại proxy, số ngày, mã proxy...). Cấu hình ở đây.
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Grid2 container spacing={2}>
                <RenewParamsTable control={control} />

                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Controller name='renew.duration_param' control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='NCC gọi "số ngày" là gì?' placeholder='days' helperText='Tên param gửi số ngày. VD: days, duration, ngay' />
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
              </Grid2>
            </Box>
          </Box>

          {/* ═══ Nhóm 3: Kiểm tra kết quả ═══ */}
          <Box sx={{ border: '1px solid #6ee7b7', borderTop: '3px solid #10b981', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ background: '#ecfdf5', borderBottom: '1px solid #6ee7b7', px: 2, py: 1.25 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>
                Kiểm tra kết quả gia hạn
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#475569', mt: 0.25 }}>
                Sau khi gọi API → hệ thống đọc response NCC để biết gia hạn OK hay lỗi → cập nhật ngày hết hạn mới.
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller name='renew.success_field' control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Field báo thành công' placeholder='status' helperText='VD: NCC trả {"status":"success"}' />
                  )} />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller name='renew.success_value' control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Giá trị = thành công' placeholder='success' helperText='Giá trị cần khớp để biết OK' />
                  )} />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller name='renew.new_expiry_field' control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth label='Field ngày hết hạn mới' placeholder='data.expired_at' helperText='Bỏ trống = hệ thống tự tính: hạn cũ + số ngày gia hạn' />
                  )} />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Controller name='renew.response_mode' control={control} render={({ field }) => (
                    <CustomTextField {...field} fullWidth select label='NCC xác nhận thế nào?'>
                      <MenuItem value='immediate'>Trả kết quả ngay trong response</MenuItem>
                      <MenuItem value='deferred'>Cần gọi lại API khác để kiểm tra</MenuItem>
                    </CustomTextField>
                  )} />
                </Grid2>
              </Grid2>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}
