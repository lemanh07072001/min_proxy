'use client'

import { useState, useEffect, useMemo, memo, useCallback, useRef } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid2,
  Button,
  MenuItem,
  Chip,
  CircularProgress,

  Switch,
  FormControlLabel,
  Typography,
  Box,
  Alert,
  Collapse,
  IconButton
} from '@mui/material'

import { toast } from 'react-toastify'
import { X, Plus, ChevronDown, AlertCircle, Eye, Shield, Wifi, Zap, Users, MapPin, RefreshCw, Clock, Info, ShoppingCart, CheckCircle, Globe, Tag, DollarSign } from 'lucide-react'
import { useForm, useWatch, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import CustomTextField from '@/@core/components/mui/TextField'

// RichTextEditor removed — using plain textarea for note
import { TAG_CONFIG, PREDEFINED_TAGS, getTagStyle, fixCountryCode } from '@/configs/tagConfig'
import { useProviders } from '@/hooks/apis/useProviders'
import { useCountries } from '@/hooks/apis/useCountries'
import { useServiceType, useCreateServiceType, useUpdateServiceType } from '@/hooks/apis/useServiceType'
import MultiInputModal from '@/views/Client/Admin/ServiceType/MultiInputModal'
import PriceByDurationModal from '@/views/Client/Admin/ServiceType/PriceByDurationModal'

import '@/views/Client/RotatingProxy/styles.css'

const schema = yup.object({
  name: yup
    .string()
    .nullable()
    .transform(value => (value ? value.trim() : value))
    .required('Tên dịch vụ là bắt buộc')
    .min(1, 'Tên dịch vụ là bắt buộc'),
  api_provider: yup
    .string()
    .nullable()
    .transform(value => (value ? value.trim() : value)),
  cost_price: yup
    .number()
    .nullable()
    .transform((value, original) => (original === '' || original === null ? null : value))
    .typeError('Giá nhập phải là số')
    .positive('Giá nhập phải lớn hơn 0'),
  code: yup
    .string()
    .nullable()
    .transform(value => (value ? value.trim() : value)),
  status: yup.string().nullable().required('Trạng thái là bắt buộc'),
  provider_id: yup.string().nullable(),
  type: yup.string().nullable().required('Loại dịch vụ là bắt buộc'),
  ip_version: yup.string().nullable().required('IP Version là bắt buộc'),
  protocols: yup
    .array()
    .nullable()
    .of(yup.string())
    .min(1, 'Vui lòng chọn ít nhất một giao thức')
    .required('Giao thức là bắt buộc')
    .default([]),
  body_api: yup
    .string()
    .nullable()
    .transform(value => (value ? value.trim() : value))
    .test('is-valid-json', 'Body Api phải là JSON hợp lệ', function (value) {
      if (!value) return true

      try {
        JSON.parse(value)
        
return true
      } catch (error) {
        return false
      }
    }),
  proxy_type: yup.string().nullable().required('Proxy type là bắt buộc'),
  country: yup.string().nullable().required('Quốc gia là bắt buộc'),
  note: yup
    .string()
    .nullable()
    .transform(value => (value ? value.trim() : value)),
  tag: yup
    .string()
    .nullable()
    .transform(value => (value ? value.trim() : value)),
  is_purchasable: yup.boolean().default(true),
  min_quantity: yup.number().nullable().min(1).default(1),
  max_quantity: yup.number().nullable().min(1).default(100),
  auth_type: yup.string().nullable(),
  bandwidth: yup.string().nullable(),
  rotation_type: yup.string().nullable(),
  rotation_interval: yup.string().nullable(),
  request_limit: yup.string().nullable(),
  concurrent_connections: yup
    .number()
    .nullable()
    .transform((value, original) => (original === '' || original === null ? null : value))
    .integer('Phải là số nguyên')
    .min(0, 'Phải >= 0'),
  pool_size: yup.string().nullable(),
  metadata_json: yup.string().nullable(),
})

// ─── Helpers: format số theo chuẩn VN (1.000,50) ───
// Parse: "1.000,50" → 1000.5 | "1000.5" → 1000.5
const parseVN = (str: string): number => {
  if (!str) return 0
  const cleaned = str.replace(/\./g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}
// Format: 1000.5 → "1.000,5" | 1000 → "1.000" (chỉ hiện thập phân khi cần)
const formatVN = (num: number): string => {
  if (!num && num !== 0) return ''
  const rounded = Math.round(num * 100) / 100
  return rounded % 1 === 0
    ? rounded.toLocaleString('vi-VN')
    : rounded.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
}
// Chỉ cho nhập: số, dấu chấm (ngăn nghìn), dấu phẩy (thập phân)
const sanitizeVN = (str: string): string => str.replace(/[^0-9.,]/g, '')

// ─── Discount Tier Row (local state cho ô giá — tránh computed value ghi đè input) ───
const DiscountTierRow = memo(function DiscountTierRow({ tier, idx, basePrice, unitLabel, color, onUpdate, onRemove }: {
  tier: { min: string; max: string; discount: string }
  idx: number; basePrice: number; unitLabel: string; color: string
  onUpdate: (idx: number, patch: Partial<{ min: string; max: string; discount: string }>) => void
  onRemove: (idx: number) => void
}) {
  const disc = parseFloat(tier.discount) || 0
  const computedPrice = basePrice > 0 && disc > 0
    ? Math.round(basePrice * (1 - disc / 100) * 100) / 100
    : null
  const [localPrice, setLocalPrice] = useState(computedPrice ? formatVN(computedPrice) : '')
  // "priceTouched" = user đã nhập giá trực tiếp → không cho useEffect ghi đè
  const [priceTouched, setPriceTouched] = useState(false)
  const [editingPrice, setEditingPrice] = useState(false)

  // Chỉ sync computed → local khi % thay đổi từ ô % (không phải từ ô giá)
  useEffect(() => {
    if (!editingPrice && !priceTouched) {
      setLocalPrice(computedPrice ? formatVN(computedPrice) : '')
    }
  }, [computedPrice, editingPrice, priceTouched])

  // Reset priceTouched khi discount thay đổi từ ô % (user gõ vào ô %)
  const prevDisc = useRef(tier.discount)
  useEffect(() => {
    // Nếu discount thay đổi mà không phải do ô giá gây ra → reset touch
    if (tier.discount !== prevDisc.current && !editingPrice) {
      setPriceTouched(false)
    }
    prevDisc.current = tier.discount
  }, [tier.discount, editingPrice])

  const inputSx = { '& input': { fontSize: '12px', padding: '5px 8px' } }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 40px', gap: '6px', alignItems: 'center', padding: '6px 10px', borderTop: '1px solid #f1f5f9' }}>
      <CustomTextField size='small' type='number' placeholder='VD: 5' value={tier.min}
        onChange={(e: any) => onUpdate(idx, { min: e.target.value })} sx={inputSx} />
      <CustomTextField size='small' type='number' placeholder='Không giới hạn' value={tier.max}
        onChange={(e: any) => onUpdate(idx, { max: e.target.value })} sx={inputSx} />
      <CustomTextField size='small' placeholder='VD: 10,5' value={tier.discount}
        onChange={(e: any) => { setPriceTouched(false); onUpdate(idx, { discount: sanitizeVN(e.target.value) }) }}
        sx={inputSx} />
      <CustomTextField size='small' placeholder='VD: 4.500'
        value={localPrice}
        onFocus={() => setEditingPrice(true)}
        onChange={(e: any) => setLocalPrice(sanitizeVN(e.target.value))}
        onBlur={() => {
          setEditingPrice(false)
          const price = parseVN(localPrice)
          if (basePrice > 0 && price > 0) {
            const pct = Math.round((1 - price / basePrice) * 10000) / 100
            onUpdate(idx, { discount: String(Math.max(0.01, Math.min(99.99, pct))) })
            // Giữ giá user nhập — format lại cho đẹp, không tính ngược từ %
            setLocalPrice(formatVN(price))
            setPriceTouched(true)
          }
        }}
        sx={{ '& input': { fontSize: '12px', padding: '5px 8px', color: disc > 0 ? color : undefined, fontWeight: disc > 0 ? 600 : undefined } }} />
      <button type='button' onClick={() => onRemove(idx)}
        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14 }}>✕</button>
    </div>
  )
})

// ─── Preview component (cô lập re-render khỏi form chính) ───
const PREVIEW_FIELDS = ['name', 'type', 'tag', 'status', 'rotation_type', 'protocols', 'auth_type', 'bandwidth',
  'rotation_interval', 'pool_size', 'request_limit', 'concurrent_connections', 'note', 'code',
  'country', 'ip_version', 'proxy_type', 'is_purchasable'] as const

const ServicePreview = memo(function ServicePreview({ control, serviceId, priceFields, multiInputFields, allowCustomAuth }: {
  control: any; serviceId?: number | null
  priceFields: Array<{ key: string; value: string; cost?: string }>
  multiInputFields: Array<{ key: string; value: string }>
  allowCustomAuth: boolean
}) {
  const previewData = useWatch({ control, name: PREVIEW_FIELDS as any })
  const previewObj = useMemo(() => {
    const obj: any = {}
    PREVIEW_FIELDS.forEach((f, i) => { obj[f] = (previewData as any)?.[i] })
    return obj
  }, [previewData])

  const watchedType = previewObj.type

  const convertIpVersion = (v: string) => { switch (v?.toLowerCase()) { case 'ipv4': case 'v4': return 'V4'; case 'ipv6': case 'v6': return 'V6'; default: return v || '' } }
  const convertAuthType = (t: string) => { switch (t) { case 'userpass': return 'User:Pass'; case 'ip_whitelist': return 'IP Whitelist'; case 'both': return 'User:Pass + IP'; default: return t || '' } }

  const validPrices = priceFields.filter((field: any) => field.key && field.value && parseInt(field.value, 10) > 0)
  const firstPrice = validPrices.length > 0 ? parseInt(validPrices[0].value, 10) : 0
  const isAvailable = previewObj.is_purchasable !== false

  const specFeatureRows = [
    previewObj.auth_type && { label: 'Xác thực', value: convertAuthType(previewObj.auth_type) + ((previewObj.auth_type === 'userpass' || previewObj.auth_type === 'both') ? (allowCustomAuth ? ' (Tự nhập)' : ' (Random)') : ''), icon: Shield, color: 'var(--primary-hover, #f97316)' },
    previewObj.bandwidth && { label: 'Băng thông', value: previewObj.bandwidth === 'unlimited' ? 'Không giới hạn' : previewObj.bandwidth, icon: Wifi, color: '#3b82f6' },
    watchedType === '1' && previewObj.rotation_type && { label: 'Kiểu xoay', value: previewObj.rotation_type === 'per_request' ? 'Per request' : previewObj.rotation_type === 'sticky' ? 'Sticky session' : previewObj.rotation_type === 'time_based' ? 'Time-based' : previewObj.rotation_type, icon: RefreshCw, color: '#8b5cf6' },
    watchedType === '1' && previewObj.rotation_interval && { label: 'Thời gian xoay IP', value: previewObj.rotation_interval, icon: Clock, color: '#f59e0b' },
    watchedType === '1' && previewObj.pool_size && { label: 'Pool size', value: previewObj.pool_size, icon: Globe, color: '#06b6d4' },
    previewObj.request_limit && { label: 'Giới hạn request', value: previewObj.request_limit, icon: Zap, color: '#22c55e' },
    previewObj.concurrent_connections && { label: 'Kết nối đồng thời', value: previewObj.concurrent_connections, icon: Users, color: '#ef4444' },
  ].filter(Boolean)

  const tagElements = previewObj.tag ? previewObj.tag.split(',').map((t: string) => t.trim()).filter(Boolean) : []
  const visibleTagEls = tagElements.filter((tag: string) => { const cfg = getTagStyle(tag); return !(cfg && 'hidden' in cfg && cfg.hidden) })

  const renderInlineTags = () => visibleTagEls.length > 0 ? (
    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
      {visibleTagEls.map((tag: string, i: number) => {
        const cfg = getTagStyle(tag)
        return <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 10px', fontSize: '10.5px', fontWeight: 700, borderRadius: '6px', background: `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%), ${cfg.gradient || cfg.bgColor}`, color: cfg.textColor, boxShadow: `0 2px 10px ${cfg.borderColor}55, inset 0 1px 0 rgba(255,255,255,0.2)`, border: '1px solid rgba(255,255,255,0.25)', letterSpacing: '0.3px', lineHeight: 1.2 }}>
          {cfg.icon && <span style={{ fontSize: '10px' }}>{cfg.icon}</span>}{tag}
        </span>
      })}
    </div>
  ) : null

  const renderNotePreview = () => {
    if (!previewObj.note || previewObj.note === '<p></p>') return null
    const text = previewObj.note.replace(/<[^>]+>/g, '').trim()
    if (!text) return null
    const preview = text.length > 80 ? text.substring(0, 80) + '...' : text
    return <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px', lineHeight: 1.4 }}>{preview}</p>
  }

  const renderFooter = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
      <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary-hover, #e53e3e)', whiteSpace: 'nowrap' }}>
        {validPrices.length > 1 && <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginRight: '2px' }}>từ </span>}
        {firstPrice > 0 ? `${firstPrice.toLocaleString('vi-VN')}đ` : '—'}
      </div>
      {isAvailable ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '8px 18px', fontSize: '13px', fontWeight: 600, color: 'var(--primary-hover, #d06830)', background: 'color-mix(in srgb, var(--primary-hover, #f97316) 8%, white)', borderRadius: '10px', border: '1px solid color-mix(in srgb, var(--primary-hover, #f97316) 25%, white)', whiteSpace: 'nowrap' }}>
          <ShoppingCart size={14} /> Mua ngay
        </div>
      ) : (
        <div style={{ padding: '8px 14px', borderRadius: '8px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
          Tạm ngừng
        </div>
      )}
    </div>
  )

  const renderSpecRows = () => specFeatureRows.map((spec: any, i: number) => (
    <div key={`spec-${i}`} className='feature-row'>
      <div className='feature-icons'><spec.icon size={16} color={spec.color} /></div>
      <div className='feature-content'>
        <span className='feature-label'>{spec.label}:</span>
        <span className='feature-value'>{spec.value}</span>
      </div>
    </div>
  ))

  const renderIpRow = (prefix: string) => (previewObj.ip_version || previewObj.country) ? (
    <div className='feature-row'>
      <div className='feature-icons'><MapPin size={16} color='#6366f1' /></div>
      <div className='feature-content'>
        <span className='feature-label'>Loại IP:</span>
        <span className='feature-value' style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{prefix} {convertIpVersion(previewObj.ip_version || '')} — {previewObj.country && <img src={`https://flagcdn.com/w40/${fixCountryCode(previewObj.country)}.png`} alt='' style={{ width: 18, height: 13, objectFit: 'cover', borderRadius: 2 }} />}{COUNTRY_NAMES[previewObj.country] || previewObj.country || 'N/A'}</span>
      </div>
    </div>
  ) : null

  const renderProtocolRow = () => Array.isArray(previewObj.protocols) && previewObj.protocols.length > 0 ? (
    <div className='feature-row'>
      <div className='feature-icons'><Shield size={16} color='var(--primary-hover, #f97316)' /></div>
      <div className='feature-content'>
        <span className='feature-label'>Hỗ trợ:</span>
        <span className='feature-value'>{previewObj.protocols.map((p: string) => p.toUpperCase()).join('/')}</span>
      </div>
    </div>
  ) : null

  try {
    return (
      <div style={{
        background: 'white', borderRadius: '12px', padding: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0',
        position: 'relative', overflow: 'visible', display: 'flex', flexDirection: 'column',
        ...((!isAvailable) ? { opacity: 0.7 } : {})
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: watchedType === '1' ? 'linear-gradient(90deg, #3b82f6, #60a5fa)' : 'var(--primary-gradient, linear-gradient(90deg, #e53e3e, #ff6b6b))', borderRadius: '12px 12px 0 0' }} />

        {watchedType === '1' ? (
          <>
            <div style={{ marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9', paddingTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: 0, textAlign: 'left', flex: 1 }}>{previewObj.name || 'Tên sản phẩm'} <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>#{serviceId || '?'}</span></h3>
                {renderInlineTags()}
              </div>
            </div>
            {renderNotePreview()}
            <div style={{ marginBottom: '4px', flex: 1 }}>
              {renderIpRow('Rotating')}
              {renderProtocolRow()}
              {renderSpecRows()}
              {multiInputFields.filter((field: any) => field.key && field.value).map((input: any, i: number) => {
                const featureColors = ['var(--primary-hover, #f97316)', '#3b82f6', '#22c55e', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444']
                return (
                  <div key={i} className='feature-row'>
                    <div className='feature-icons'><CheckCircle size={16} color={featureColors[i % featureColors.length]} /></div>
                    <div className='feature-content'>
                      <span className='feature-label'>{input.key}:</span>
                      <span className='feature-value'>{input.value}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            {renderFooter()}
          </>
        ) : (
          <>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '4px' }}>
              <div style={{ marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: 0, flex: 1 }}>{previewObj.name || 'Tên sản phẩm'} <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>#{serviceId || '?'}</span></h3>
                  {renderInlineTags()}
                </div>
              </div>
              {renderNotePreview()}
              <div style={{ marginBottom: '8px' }}>
                {renderIpRow('Static')}
                {renderProtocolRow()}
                {renderSpecRows()}
              </div>
            </div>
            {renderFooter()}
          </>
        )}
      </div>
    )
  } catch (e) { return <div style={{ padding: '16px', color: '#ef4444', fontSize: '12px' }}>Preview error: {String(e)}</div> }
})

// ─── Purchase Options Section (cô lập state khỏi form chính) ───
interface PurchaseOption {
  key: string; param_name: string; label: string
  type: 'select' | 'text' | 'number'; required: boolean; default: string
  options: Array<{ value: string; label: string }>
}

const PurchaseOptionsSection = memo(function PurchaseOptionsSection({
  options, onChange, control, errors
}: {
  options: PurchaseOption[]
  onChange: (options: PurchaseOption[]) => void
  control: any; errors: any
}) {
  const update = (idx: number, patch: Partial<PurchaseOption>) => {
    onChange(options.map((o, i) => i === idx ? { ...o, ...patch } : o))
  }

  return (
    <Grid2 size={{ xs: 12 }}>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <ShoppingCart size={16} color='#7c3aed' />
          <span style={{ fontWeight: 700, fontSize: 14, color: '#5b21b6' }}>Params gửi khi mua hàng</span>
        </div>
        <div style={{ fontSize: 11.5, color: '#64748b', marginBottom: 12, background: '#f8fafc', borderRadius: 6, padding: '6px 10px' }}>
          Ưu tiên ghi đè: Provider → Mặc định sản phẩm → Khách chọn. Trùng key thì giá trị lớp sau được gửi đi cho Provider.
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Mặc định sản phẩm — tự động gửi kèm, khách không thấy</div>
          <Controller name='body_api' control={control} render={({ field }) => (
            <CustomTextField {...field} rows={2} fullWidth multiline size='small'
              placeholder='VD: {"loaiproxy":"Viettel","type":"HTTP"}'
              error={!!errors.body_api} helperText={errors.body_api?.message} />
          )} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Khách chọn khi mua — hiện trên form thanh toán, ghi đè mặc định sản phẩm nếu trùng key</div>
          <Button size='small' variant='outlined'
            onClick={() => onChange([...options, { key: '', param_name: '', label: '', type: 'select', required: true, default: '', options: [{ value: '', label: '' }] }])}>
            + Thêm tuỳ chọn
          </Button>
        </div>

        {options.length === 0 && (
          <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
            Chưa có tuỳ chọn nào. User sẽ mua mà không cần chọn thêm.
          </p>
        )}

        {options.map((opt, optIdx) => (
          <div key={optIdx} style={{ background: '#f8fafc', borderRadius: 8, padding: 12, marginBottom: 12, position: 'relative' }}>
            <button type='button' onClick={() => onChange(options.filter((_, i) => i !== optIdx))}
              style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>✕</button>

            <Grid2 container spacing={1.5} sx={{ mb: 1 }}>
              <Grid2 size={{ xs: 3 }}>
                <CustomTextField fullWidth size='small' label='Key nội bộ' placeholder='nha_mang' value={opt.key}
                  onChange={(e: any) => update(optIdx, { key: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })} />
              </Grid2>
              <Grid2 size={{ xs: 3 }}>
                <CustomTextField fullWidth size='small' label='Param gốc (ẩn)' placeholder='loaiproxy' value={opt.param_name}
                  onChange={(e: any) => update(optIdx, { param_name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })} />
              </Grid2>
              <Grid2 size={{ xs: 3 }}>
                <CustomTextField fullWidth size='small' label='Label hiển thị' placeholder='Nhà mạng' value={opt.label}
                  onChange={(e: any) => update(optIdx, { label: e.target.value })} />
              </Grid2>
              <Grid2 size={{ xs: 1.5 }}>
                <CustomTextField fullWidth size='small' select label='Loại' value={opt.type || 'select'}
                  onChange={(e: any) => update(optIdx, { type: e.target.value })}>
                  <MenuItem value='select'>Select</MenuItem>
                  <MenuItem value='text'>Text</MenuItem>
                  <MenuItem value='number'>Number</MenuItem>
                </CustomTextField>
              </Grid2>
              <Grid2 size={{ xs: 1.5 }}>
                <CustomTextField fullWidth size='small' select label='Bắt buộc' value={opt.required ? 'true' : 'false'}
                  onChange={(e: any) => update(optIdx, { required: e.target.value === 'true' })}>
                  <MenuItem value='true'>Có</MenuItem>
                  <MenuItem value='false'>Không</MenuItem>
                </CustomTextField>
              </Grid2>
            </Grid2>

            {(opt.type || 'select') === 'select' && (
              <>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Giá trị:</div>
                {opt.options.map((option, valIdx) => (
                  <div key={valIdx} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center' }}>
                    <CustomTextField size='small' placeholder='Giá trị (value)' value={option.value} sx={{ flex: 1 }}
                      onChange={(e: any) => {
                        const newOpts = [...opt.options]; newOpts[valIdx] = { ...newOpts[valIdx], value: e.target.value }
                        if (!newOpts[valIdx].label) newOpts[valIdx].label = e.target.value
                        update(optIdx, { options: newOpts })
                      }} />
                    <CustomTextField size='small' placeholder='Hiển thị (label)' value={option.label} sx={{ flex: 1 }}
                      onChange={(e: any) => {
                        const newOpts = [...opt.options]; newOpts[valIdx] = { ...newOpts[valIdx], label: e.target.value }
                        update(optIdx, { options: newOpts })
                      }} />
                    <button type='button'
                      onClick={() => { if (opt.options.length <= 1) return; update(optIdx, { options: opt.options.filter((_, i) => i !== valIdx) }) }}
                      style={{ background: 'none', border: 'none', color: opt.options.length <= 1 ? '#cbd5e1' : '#ef4444', cursor: opt.options.length <= 1 ? 'default' : 'pointer', fontSize: 14, padding: '4px 6px' }}>✕</button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <Button size='small' variant='text' sx={{ fontSize: 12 }}
                    onClick={() => update(optIdx, { options: [...opt.options, { value: '', label: '' }] })}>+ Thêm giá trị</Button>
                  <CustomTextField size='small' select label='Mặc định' sx={{ minWidth: 120 }}
                    value={opt.default || opt.options[0]?.value || ''}
                    onChange={(e: any) => update(optIdx, { default: e.target.value })}>
                    {opt.options.filter(o => o.value).map(o => (
                      <MenuItem key={o.value} value={o.value}>{o.label || o.value}</MenuItem>
                    ))}
                  </CustomTextField>
                </div>
              </>
            )}

            {(opt.type === 'text' || opt.type === 'number') && (
              <CustomTextField size='small' fullWidth label='Giá trị mặc định'
                placeholder={opt.type === 'number' ? '300' : 'VD: giá trị mặc định'}
                type={opt.type} value={opt.default}
                onChange={(e: any) => update(optIdx, { default: e.target.value })}
                sx={{ mt: 1 }} />
            )}
          </div>
        ))}
      </div>
    </Grid2>
  )
})

const COUNTRY_NAMES: Record<string, string> = {
  vi: 'Việt Nam', kr: 'Hàn Quốc', us: 'Mỹ', jp: 'Nhật Bản', sg: 'Singapore',
  th: 'Thái Lan', id: 'Indonesia', my: 'Malaysia', ph: 'Philippines', in: 'Ấn Độ',
  cn: 'Trung Quốc', tw: 'Đài Loan', hk: 'Hồng Kông', de: 'Đức', gb: 'Anh',
  fr: 'Pháp', au: 'Úc', ca: 'Canada', br: 'Brazil', ru: 'Nga',
}

interface ServiceFormModalProps {
  open: boolean
  onClose: () => void
  serviceId?: number | null
  initialData?: any
}

export default function ServiceFormModal({ open, onClose, serviceId, initialData }: ServiceFormModalProps) {
  const isEditMode = !!serviceId

  // Data fetching
  const { data: providers = [], isLoading: loadingProviders } = useProviders()

  // Fetch chi tiết khi edit để lấy field hidden (api_provider) — dùng initialData làm placeholder
  const { data: fetchedData, isLoading: loadingService } = useServiceType(serviceId, isEditMode && open)
  const serviceData = fetchedData ?? initialData
  // Bỏ useServiceTypes() — chỉ dùng để derive protocols/ipVersions, đã hardcode sẵn

  // Mutations
  const createMutation = useCreateServiceType()
  const updateMutation = useUpdateServiceType(serviceId)

  // Out-of-form state
  const [multiInputFields, setMultiInputFields] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }])
  const [priceFields, setPriceFields] = useState<Array<{ key: string; value: string; cost?: string }>>([{ key: '', value: '', cost: '' }])
  const [isMultiInputModalOpen, setIsMultiInputModalOpen] = useState(false)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [pricingMode, setPricingMode] = useState<'fixed' | 'per_unit'>('fixed')
  const [timeUnit, setTimeUnit] = useState<'day' | 'month'>('day')
  const [pricePerUnit, setPricePerUnit] = useState('')
  const [costPerUnit, setCostPerUnit] = useState('')

  const [formErrors, setFormErrors] = useState<string[]>([])
  const [formSuccess, setFormSuccess] = useState('')

  const [purchaseOptions, setPurchaseOptions] = useState<PurchaseOption[]>([])
  const [allowCustomAuth, setAllowCustomAuth] = useState(false)
  const [discountTiers, setDiscountTiers] = useState<Array<{ min: string; max: string; discount: string }>>([])
  const [costDiscountTiers, setCostDiscountTiers] = useState<Array<{ min: string; max: string; discount: string }>>([])


  const protocols = [
    { value: 'http', label: 'HTTP' },
    { value: 'socks5', label: 'SOCKS5' },
  ]

  const ipVersionOptions = [
    { value: 'ipv4', label: 'IPV4' },
    { value: 'ipv6', label: 'IPV6' },
  ]

  // Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue
  } = useForm({
    resolver: async (data, context, options) => {
      try {
        const values = await schema.validate(data, { abortEarly: false })

        
return { values, errors: {} }
      } catch (err: any) {
        if (!err.inner || !Array.isArray(err.inner)) {
          console.error('Validation error:', err)
          
return { values: {}, errors: { name: { type: 'validation', message: err.message || 'Lỗi validation' } } }
        }

        const formattedErrors = err.inner.reduce(
          (allErrors: any, currentError: any) => ({
            ...allErrors,
            [currentError.path]: {
              type: currentError.type ?? 'validation',
              message: currentError.message
            }
          }),
          {}
        )

        
return { values: {}, errors: formattedErrors }
      }
    },
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      api_provider: '',
      cost_price: undefined,
      code: '',
      status: 'active',
      provider_id: '',
      type: '0',
      ip_version: 'ipv4',
      protocols: [],
      body_api: '',
      proxy_type: '',
      country: '',
      note: '',
      tag: '',
      is_purchasable: true,
      min_quantity: 1,
      max_quantity: 100,
      auth_type: '',
      bandwidth: '',
      rotation_type: '',
      rotation_interval: '',
      request_limit: '',
      concurrent_connections: undefined,
      pool_size: '',
      metadata_json: '',
    }
  })

  // Load service data when editing
  useEffect(() => {
    if (serviceData && isEditMode) {
      let bodyApiString = ''

      if (serviceData.api_body) {
        try {
          bodyApiString =
            typeof serviceData.api_body === 'string'
              ? serviceData.api_body
              : JSON.stringify(serviceData.api_body, null, 2)
        } catch (error) {
          bodyApiString = ''
        }
      }

      // Parse multi_inputs (có thể là JSON string hoặc array)
      let multiInputs = serviceData.multi_inputs

      if (typeof multiInputs === 'string') { try { multiInputs = JSON.parse(multiInputs) } catch { multiInputs = null } }

      if (multiInputs && Array.isArray(multiInputs)) {
        setMultiInputFields(multiInputs.length > 0 ? multiInputs : [{ key: '', value: '' }])
      }

      // Parse price_by_duration (có thể là JSON string hoặc array)
      let priceDurations = serviceData.price_by_duration

      if (typeof priceDurations === 'string') { try { priceDurations = JSON.parse(priceDurations) } catch { priceDurations = null } }

      if (priceDurations && Array.isArray(priceDurations)) {
        setPriceFields(
          priceDurations.length > 0
            ? priceDurations.map((item: any) => ({
                key: item.key || '',
                value: item.value || '',
                cost: item.cost || ''
              }))
            : [{ key: '', value: '', cost: '' }]
        )
      }

      // Load pricing mode fields
      setPricingMode(serviceData.pricing_mode || 'fixed')
      setTimeUnit(serviceData.time_unit || 'day')
      setPricePerUnit(serviceData.price_per_unit?.toString() || '')
      setCostPerUnit(serviceData.cost_per_unit?.toString() || '')

      // Parse protocols (có thể là JSON string hoặc array)
      let parsedProtocols = serviceData.protocols

      if (typeof parsedProtocols === 'string') { try { parsedProtocols = JSON.parse(parsedProtocols) } catch { parsedProtocols = [] } }

      reset({
        name: serviceData.name || '',
        api_provider: serviceData.api_provider || '',
        cost_price: serviceData.cost_price || undefined,
        code: serviceData.code || '',
        status: serviceData.status || 'active',
        provider_id: serviceData.provider_id || '',
        type: serviceData.type?.toString() || '0',
        ip_version: serviceData.ip_version?.toLowerCase() || 'ipv4',
        protocols: parsedProtocols || [],
        body_api: bodyApiString,
        proxy_type: serviceData.proxy_type?.toLowerCase() || '',
        country: serviceData.country?.toLowerCase() || '',
        note: serviceData.note || '',
        tag: serviceData.tag || '',
        is_purchasable: serviceData.is_purchasable !== false,
        min_quantity: serviceData.min_quantity ?? 1,
        max_quantity: serviceData.max_quantity ?? 100,
        auth_type: serviceData.auth_type || '',
        bandwidth: serviceData.bandwidth || '',
        rotation_type: serviceData.rotation_type || '',
        rotation_interval: serviceData.rotation_interval || '',
        request_limit: serviceData.request_limit || '',
        concurrent_connections: serviceData.concurrent_connections ?? undefined,
        pool_size: serviceData.pool_size || '',
        metadata_json: '',
      })

      // Load purchase options + allow_custom_auth từ metadata
      const meta = serviceData.metadata || {}
      setAllowCustomAuth(!!meta.allow_custom_auth)
      setDiscountTiers(meta.discount_tiers || [])
      setCostDiscountTiers(meta.cost_discount_tiers || [])
      if (meta.custom_fields && Array.isArray(meta.custom_fields)) {
        setPurchaseOptions(meta.custom_fields.map((f: any) => ({
          key: f.key || f.param || '',
          param_name: f.param_name || f.param || '',
          label: f.label || '',
          type: f.type || 'select',
          required: f.required || false,
          default: f.default || '',
          options: f.options || [{ value: '', label: '' }],
        })))
      } else {
        setPurchaseOptions([])
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceData, isEditMode, reset, open])

  // Reset form when modal opens for create
  useEffect(() => {
    if (open && !isEditMode) {
      reset({
        name: '',
        api_provider: '',
        cost_price: undefined,
        code: '',
        status: 'active',
        provider_id: '',
        type: '0',
        ip_version: 'ipv4',
        protocols: [],
        body_api: '',
        proxy_type: '',
        country: '',
        note: '',
        tag: '',
        is_purchasable: true,
      min_quantity: 1,
      max_quantity: 100,
        auth_type: '',
        bandwidth: '',
        rotation_type: '',
        rotation_interval: '',
        request_limit: '',
        concurrent_connections: undefined,
        pool_size: '',
        metadata_json: '',
      })
      setMultiInputFields([{ key: '', value: '' }])
      setPriceFields([{ key: '', value: '', cost: '' }])
      setPurchaseOptions([])
      setAllowCustomAuth(false)
      setDiscountTiers([])
      setPricingMode('fixed')
      setTimeUnit('day')
      setPricePerUnit('')
      setCostPerUnit('')

      setFormErrors([])
    }
  }, [open, isEditMode, reset])

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  }

  const onSubmit = (data: any) => {
    setFormErrors([])

    const formattedPriceFields = priceFields.map((field: any) => ({
      key: field.key,
      value: field.value,
      cost: field.cost ?? ''
    }))

    // Clean empty Tiptap content to null
    const cleanNote = data.note && data.note !== '<p></p>' ? data.note : null

    // Auto-tính cost_price từ min(price_by_duration[].cost)
    const costs = formattedPriceFields.map((p: any) => parseInt(p.cost) || 0).filter((c: number) => c > 0)
    const autoCostPrice = costs.length > 0 ? Math.min(...costs) : data.cost_price || 0

    // Build metadata từ purchase options
    const validOptions = purchaseOptions.filter(o => o.key && o.label && (o.type !== 'select' || o.options.some(opt => opt.value)))
    const metadata = validOptions.length > 0 ? {
      custom_fields: validOptions.map(o => ({
        key: o.key,
        param_name: o.param_name || o.key,
        label: o.label,
        type: o.type || 'select',
        required: o.required,
        default: o.default || (o.type === 'select' ? o.options[0]?.value || '' : ''),
        ...(o.type === 'select' ? { options: o.options.filter(opt => opt.value) } : {}),
      }))
    } : null

    // Merge allow_custom_auth vào metadata
    const metadataFinal = {
      ...(metadata || {}),
      allow_custom_auth: allowCustomAuth,
      discount_tiers: pricingMode === 'per_unit' ? discountTiers.filter(t => t.min && t.discount) : undefined,
      cost_discount_tiers: pricingMode === 'per_unit' ? costDiscountTiers.filter(t => t.min && t.discount) : undefined,
    }

    const submitData: any = {
      ...data,
      note: cleanNote,
      api_type: 'buy_api',
      multi_inputs: multiInputFields,
      // per_unit: giữ price_by_duration cũ nếu có (không xóa mốc)
      price_by_duration: pricingMode === 'per_unit' && formattedPriceFields.filter((f: any) => f.key).length === 0
        ? (serviceData?.price_by_duration || [])
        : formattedPriceFields,
      cost_price: autoCostPrice,
      metadata: metadataFinal,
      pricing_mode: pricingMode,
      time_unit: timeUnit,
      price_per_unit: pricingMode === 'per_unit' ? (parseInt(pricePerUnit) || null) : null,
      cost_per_unit: pricingMode === 'per_unit' ? (parseFloat(costPerUnit) || null) : null,
    }
    delete submitData.metadata_json

    const mutation = isEditMode ? updateMutation : createMutation

    mutation.mutate(submitData, {
      onSuccess: () => {
        setFormErrors([])
        setFormSuccess(isEditMode ? 'Cập nhật dịch vụ thành công!' : 'Thêm dịch vụ thành công!')
        document.getElementById('service-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      },
      onError: (error: any) => {
        console.error('API error:', error?.response?.status, error?.response?.data || error?.message)
        const res = error?.response?.data
        const errors: string[] = []

        // Parse validation errors object từ Laravel → set lỗi trực tiếp vào field
        if (res?.errors && typeof res.errors === 'object') {
          Object.entries(res.errors).forEach(([field, fieldErrors]: [string, any]) => {
            const msg = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors
            const feField = field === 'api_body' ? 'body_api' : field

            setError(feField as any, { type: 'server', message: msg })
            errors.push(msg)
          })

        } else if (res?.message) {
          errors.push(res.message)
        } else {
          errors.push('Có lỗi xảy ra, vui lòng thử lại')
        }

        setFormErrors(errors)

        // Scroll to top of dialog to show error
        document.getElementById('service-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }

  const onError = (validationErrors: any) => {
    console.error('Form validation errors:', validationErrors)

    const messages = Object.values(validationErrors)
      .map((error: any) => error?.message)
      .filter(Boolean) as string[]

    setFormErrors(messages)

    // Scroll to top of dialog to show error
    document.getElementById('service-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  const staticPlaceholder = 'Proxy IPv4 dân cư Việt Nam, tốc độ cao, uptime 99.5%. Hỗ trợ HTTP/SOCKS5. Phù hợp cho SEO, social media marketing, và scraping. Băng thông không giới hạn.'
  const rotatingPlaceholder = 'Proxy xoay tự động mỗi 5-30 phút, pool 10,000+ IP Việt Nam. Phù hợp cho crawl data, multi-account, và automation. Hỗ trợ sticky session theo thời gian.'

  // useWatch cô lập re-render — chỉ re-render khi các field này thay đổi
  // useWatch cô lập re-render — chỉ re-render khi các field này thay đổi
  const [watchedType, watchedRotationType, watchedTag, watchedStatus, watchedAuthType] = useWatch({
    control,
    name: ['type', 'rotation_type', 'tag', 'status', 'auth_type'],
  })

  const { data: countries } = useCountries()

  const toggleTag = (preset: string) => {
    const current = watchedTag ? watchedTag.split(',').map((t: string) => t.trim()).filter(Boolean) : []
    const updated = current.includes(preset) ? current.filter((t: string) => t !== preset) : [...current, preset]

    setValue('tag', updated.join(', '))
  }
  const notePlaceholder = watchedType === '1' ? rotatingPlaceholder : staticPlaceholder

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth='xl' fullWidth PaperProps={{ sx: { maxHeight: '92vh' } }}>
        <DialogTitle
          sx={{
            background: 'var(--primary-gradient, linear-gradient(135deg, #F88A4B 0%, #F6734B 100%))',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1.5
          }}
        >
          <span style={{ fontWeight: 700, fontSize: '16px' }}>
            {isEditMode ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '6px',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: 'white'
            }}
          >
            <X size={20} />
          </button>
        </DialogTitle>

        <DialogContent sx={{ mt: 1, pb: 1, position: 'relative', display: 'flex', gap: 2, overflow: 'hidden', px: 2 }}>
          {/* Loading overlay khi đang xử lý */}
          {isPending && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(2px)',
                borderRadius: '8px',
              }}
            >
              <CircularProgress size={48} sx={{ color: '#F6734B', mb: 2 }} />
              <Typography variant='body1' fontWeight={700} sx={{ color: '#1e293b' }}>
                {isEditMode ? 'Đang cập nhật dịch vụ...' : 'Đang tạo dịch vụ mới...'}
              </Typography>
              <Typography variant='caption' sx={{ color: '#64748b', mt: 0.5 }}>
                Vui lòng chờ trong giây lát
              </Typography>
            </Box>
          )}

          {/* Left: Form — compact inputs */}
          <Box sx={{
            flex: 1, minWidth: 0, overflowY: 'auto', pr: 1,
            '& .MuiInputLabel-root': { fontSize: '0.8rem', mb: '2px' },
            '& .MuiInputBase-sizeSmall': { fontSize: '0.85rem' },
            '& .MuiInputBase-inputSizeSmall:not(textarea)': { py: '5px !important', px: '10px !important' },
            '& .MuiFormHelperText-root': { fontSize: '0.7rem', mt: '2px' },
          }}>
          {loadingService && isEditMode && !initialData ? (
            <Box display='flex' justifyContent='center' alignItems='center' minHeight='300px'>
              <CircularProgress />
            </Box>
          ) : (
            <form id='service-form' onSubmit={handleSubmit(onSubmit, onError)}>
              {/* Inline error alert */}
              <Collapse in={formErrors.length > 0}>
                <Alert
                  severity='error'
                  icon={<AlertCircle size={20} />}
                  action={
                    <IconButton size='small' color='inherit' onClick={() => setFormErrors([])}>
                      <X size={16} />
                    </IconButton>
                  }
                  sx={{
                    mb: 2,
                    borderRadius: '8px',
                    border: '1px solid #fca5a5',
                    '& .MuiAlert-message': { width: '100%' }
                  }}
                >
                  <Typography variant='body2' fontWeight={700} sx={{ mb: formErrors.length > 1 ? 0.5 : 0 }}>
                    {isEditMode ? 'Cập nhật thất bại' : 'Tạo dịch vụ thất bại'}
                  </Typography>
                  {formErrors.length === 1 ? (
                    <Typography variant='body2'>{formErrors[0]}</Typography>
                  ) : (
                    <ul style={{ margin: '4px 0 0', paddingLeft: '18px' }}>
                      {formErrors.map((msg, i) => (
                        <li key={i}>
                          <Typography variant='body2'>{msg}</Typography>
                        </li>
                      ))}
                    </ul>
                  )}
                </Alert>
              </Collapse>

              {/* Inline success alert */}
              {formSuccess && (
                <div
                  data-form-alert
                  style={{
                    marginBottom: 16, padding: '12px 16px', borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                    fontSize: 14, fontWeight: 600, animation: 'fadeIn 0.3s ease',
                    background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d',
                  }}
                >
                  <span>✓ {formSuccess}</span>
                  <button onClick={() => setFormSuccess('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 18, padding: '0 4px', lineHeight: 1 }}>×</button>
                </div>
              )}

              {/* ========== Section 1: Thông tin cơ bản ========== */}
              <div style={{ background: '#fafbfc', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Info size={13} color='#3b82f6' />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Thông tin cơ bản</span>
                </div>
              <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller
                    name='provider_id'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth select label='Provider' disabled={loadingProviders}>
                        <MenuItem value=''><em>{loadingProviders ? '...' : '—'}</em></MenuItem>
                        {providers?.map((provider: any) => (
                          <MenuItem key={provider.id} value={provider.id}>
                            {provider.provider_code ? `[${provider.provider_code}] ` : ''}{provider.title || provider.name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 3 }}>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        required
                        fullWidth
                        label='Tên dịch vụ'
                        placeholder='Proxy Xoay VN SV1'
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid2>

                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller
                    name='code'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Mã sản phẩm (Code)'
                        placeholder='Để trống tự tạo'
                        helperText={serviceId ? `ID: ${serviceId}` : 'Site con dùng code này để mua hàng'}
                      />
                    )}
                  />
                </Grid2>

                <Grid2 size={{ xs: 6, sm: 2 }}>
                  <Controller
                    name='type'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth select label='Loại' error={!!errors.type} helperText={errors.type?.message}>
                        <MenuItem value='0'>Tĩnh</MenuItem>
                        <MenuItem value='1'>Xoay</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid2>

                <Grid2 size={{ xs: 6, sm: 2 }}>
                  <Controller
                    name='proxy_type'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth select label='Proxy Type' value={field.value || ''}>
                        <MenuItem value=''><em>—</em></MenuItem>
                        <MenuItem value='residential'>Dân cư</MenuItem>
                        <MenuItem value='datacenter'>Datacenter</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid2>

                <Grid2 size={{ xs: 6, sm: 2 }}>
                  <Controller
                    name='ip_version'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth select label='IP Version'>
                        {ipVersionOptions.map(opt => (
                          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid2>

                <Grid2 size={{ xs: 6, sm: 2 }}>
                  <Controller
                    name='country'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth select label='Quốc gia' value={field.value || ''}>
                        <MenuItem value=''><em>— Chọn —</em></MenuItem>
                        {(countries || []).map((c: any) => (
                          <MenuItem key={c.code} value={c.code.toLowerCase()}>
                            <img src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} alt='' style={{ width: 20, height: 15, marginRight: 8, verticalAlign: 'middle' }} />
                            {c.name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Controller
                    name='protocols'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        select
                        fullWidth
                        label='Giao thức'
                        value={field.value || []}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        error={!!errors.protocols}
                        helperText={errors.protocols?.message}
                        slotProps={{
                          select: {
                            multiple: true,
                            MenuProps,
                            renderValue: selected => {
                              const values = selected as unknown as string[]

                              if (!values || values.length === 0) return <em>Chọn giao thức</em>
                              
return (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                  {values.map(val => {
                                    const p = protocols.find(p => p.value === val)

                                    
return <Chip key={val} label={p?.label || val} size='small' />
                                  })}
                                </div>
                              )
                            }
                          }
                        }}
                      >
                        {protocols.map(protocol => (
                          <MenuItem key={protocol.value} value={protocol.value}>
                            {protocol.label}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid2>

                {/* Tags */}
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: 6 }}>Tag sản phẩm</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {PREDEFINED_TAGS.map(preset => {
                        const tags = watchedTag ? watchedTag.split(',').map((t: string) => t.trim()) : []
                        const isActive = tags.includes(preset)
                        const style = getTagStyle(preset)

                        return (
                          <div key={preset} onClick={() => toggleTag(preset)} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '4px 12px', borderRadius: 6, cursor: 'pointer',
                            fontSize: '12px', fontWeight: 600, transition: 'all 0.15s ease',
                            background: isActive ? (style.gradient || style.bgColor) : '#f8fafc',
                            color: isActive ? style.textColor : '#64748b',
                            border: isActive ? `1px solid ${style.borderColor}` : '1px solid #e2e8f0',
                            transform: isActive ? 'scale(1.05)' : 'scale(1)',
                          }}>
                            {style.icon && <span style={{ fontSize: '11px' }}>{style.icon}</span>}
                            {preset}
                          </div>
                        )
                      })}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: 4 }}>Nhấn để chọn/bỏ chọn</div>
                  </div>
                </Grid2>

                {/* Switches */}
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '8px 14px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <Controller
                      name='status'
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Switch size='small' checked={field.value === 'active'} onChange={e => field.onChange(e.target.checked ? 'active' : 'inactive')} color='success' />}
                          label={<Typography variant='body2' fontWeight={600} fontSize='12px'>{watchedStatus === 'active' ? 'Hiển thị' : 'Đang ẩn'}</Typography>}
                          sx={{ ml: 0, mr: 0 }}
                        />
                      )}
                    />
                    <Controller
                      name='is_purchasable'
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Switch size='small' checked={field.value !== false} onChange={e => field.onChange(e.target.checked)} color='primary' />}
                          label={<Typography variant='body2' fontWeight={600} fontSize='12px'>{field.value !== false ? 'Cho phép mua' : 'Tạm ngừng'}</Typography>}
                          sx={{ ml: 0, mr: 0 }}
                        />
                      )}
                    />
                  </div>
                </Grid2>

                {/* Min/Max số lượng proxy */}
                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller
                    name='min_quantity'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        value={field.value ?? 1}
                        onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                        fullWidth
                        type='number'
                        label='Tối thiểu'
                        helperText='Số proxy tối thiểu mỗi lần mua'
                        slotProps={{ input: { inputProps: { min: 1 } } }}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller
                    name='max_quantity'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        value={field.value ?? 100}
                        onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                        fullWidth
                        type='number'
                        label='Tối đa'
                        helperText='Số proxy tối đa mỗi lần mua'
                        slotProps={{ input: { inputProps: { min: 1 } } }}
                      />
                    )}
                  />
                </Grid2>

                {/* Mô tả ngắn */}
                <Grid2 size={{ xs: 12 }}>
                  <Controller
                    name='note'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        value={field.value || ''}
                        fullWidth
                        multiline
                        rows={2}
                        label='Mô tả ngắn'
                        placeholder='Mô tả ngắn về sản phẩm (hiển thị dưới tên sản phẩm trên card)'
                        inputProps={{ maxLength: 500 }}
                        helperText={`${(field.value || '').replace(/<[^>]+>/g, '').length}/500 ký tự`}
                      />
                    )}
                  />
                </Grid2>
              </Grid2>
              </div>

              {/* ========== Section: Thông số sản phẩm ========== */}
              <div style={{ background: '#fafbfc', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={13} color='#22c55e' />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Thông số sản phẩm</span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px 34px' }}>Hiển thị trên card sản phẩm cho khách hàng</p>
              <Grid2 container spacing={1}>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller
                    name='auth_type'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth select label='Xác thực' value={field.value || ''}>
                        <MenuItem value=''><em>—</em></MenuItem>
                        <MenuItem value='userpass'>User:Pass</MenuItem>
                        <MenuItem value='ip_whitelist'>IP Whitelist</MenuItem>
                        <MenuItem value='both'>User:Pass + IP</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid2>

                {/* User:Pass mode — cho admin chọn + preview */}
                {(watchedAuthType === 'userpass' || watchedAuthType === 'both') && (
                  <Grid2 size={{ xs: 12 }}>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', background: '#fafbfc' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>User:Pass cho khách hàng</div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <button
                        type='button'
                        onClick={() => setAllowCustomAuth(false)}
                        style={{
                          padding: '6px 14px', fontSize: '12px', fontWeight: 600, borderRadius: 8, border: '1.5px solid',
                          cursor: 'pointer', transition: 'all 0.15s',
                          background: !allowCustomAuth ? '#1e293b' : '#fff',
                          color: !allowCustomAuth ? '#fff' : '#64748b',
                          borderColor: !allowCustomAuth ? '#1e293b' : '#e2e8f0',
                        }}
                      >
                        Random tự động
                      </button>
                      <button
                        type='button'
                        onClick={() => setAllowCustomAuth(true)}
                        style={{
                          padding: '6px 14px', fontSize: '12px', fontWeight: 600, borderRadius: 8, border: '1.5px solid',
                          cursor: 'pointer', transition: 'all 0.15s',
                          background: allowCustomAuth ? '#1e293b' : '#fff',
                          color: allowCustomAuth ? '#fff' : '#64748b',
                          borderColor: allowCustomAuth ? '#1e293b' : '#e2e8f0',
                        }}
                      >
                        Khách tự nhập
                      </button>
                    </div>
                    {/* Preview — admin thấy user sẽ nhìn thấy gì */}
                    <div style={{ padding: '8px 12px', borderRadius: 8, fontSize: '12px', border: '1px solid', background: allowCustomAuth ? '#eff6ff' : '#f0fdf4', borderColor: allowCustomAuth ? '#bfdbfe' : '#bbf7d0' }}>
                      {allowCustomAuth ? (
                        <div>
                          <strong style={{ color: '#1e40af' }}>Khách sẽ thấy:</strong> 2 ô nhập Username + Password tùy chọn
                          <div style={{ color: '#64748b', marginTop: 2 }}>Khách có thể tự đặt user:pass hoặc để trống (hệ thống random)</div>
                        </div>
                      ) : (
                        <div>
                          <strong style={{ color: '#166534' }}>Khách sẽ thấy:</strong> 🔑 User:Pass được tạo tự động sau khi mua
                          <div style={{ color: '#64748b', marginTop: 2 }}>Không hiện input — hệ thống tự sinh user:pass random</div>
                        </div>
                      )}
                    </div>
                    </div>
                  </Grid2>
                )}

                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller
                    name='bandwidth'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth select label='Bandwidth' value={field.value || ''}>
                        <MenuItem value=''><em>—</em></MenuItem>
                        <MenuItem value='unlimited'>Unlimited</MenuItem>
                        <MenuItem value='1GB'>1 GB</MenuItem>
                        <MenuItem value='5GB'>5 GB</MenuItem>
                        <MenuItem value='10GB'>10 GB</MenuItem>
                        <MenuItem value='50GB'>50 GB</MenuItem>
                        <MenuItem value='100GB'>100 GB</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid2>

                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller
                    name='request_limit'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Request limit' placeholder='unlimited' />
                    )}
                  />
                </Grid2>

                <Grid2 size={{ xs: 6, sm: 3 }}>
                  <Controller
                    name='concurrent_connections'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        value={field.value ?? ''}
                        onChange={e => { field.onChange(e.target.value === '' ? null : Number(e.target.value)) }}
                        fullWidth
                        type='number'
                        label='Concurrent'
                        placeholder='100'
                      />
                    )}
                  />
                </Grid2>

                {/* Chỉ hiện khi type = Rotating */}
                {watchedType === '1' && (
                  <>
                    <Grid2 size={{ xs: 6, sm: 3 }}>
                      <Controller
                        name='rotation_type'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField {...field} fullWidth select label='Kiểu xoay' value={field.value || ''}>
                            <MenuItem value=''><em>—</em></MenuItem>
                            <MenuItem value='per_request'>Per request</MenuItem>
                            <MenuItem value='sticky'>Sticky</MenuItem>
                            <MenuItem value='time_based'>Time-based</MenuItem>
                          </CustomTextField>
                        )}
                      />
                    </Grid2>

                    {watchedRotationType && watchedRotationType !== 'per_request' && (
                      <Grid2 size={{ xs: 6, sm: 3 }}>
                        <Controller
                          name='rotation_interval'
                          control={control}
                          render={({ field }) => (
                            <CustomTextField {...field} fullWidth label={watchedRotationType === 'sticky' ? 'Giữ IP' : 'Xoay'} placeholder='10 phút' />
                          )}
                        />
                      </Grid2>
                    )}

                    <Grid2 size={{ xs: 6, sm: 3 }}>
                      <Controller
                        name='pool_size'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField {...field} fullWidth label='Pool size' placeholder='10K+' />
                        )}
                      />
                    </Grid2>
                  </>
                )}

                <PurchaseOptionsSection
                  options={purchaseOptions}
                  onChange={setPurchaseOptions}
                  control={control}
                  errors={errors}
                />
              </Grid2>
              </div>

              {/* ========== Section: Chế độ giá ========== */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <DollarSign size={16} color='#d97706' />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#92400e' }}>Chế độ giá</span>
                </div>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <CustomTextField
                      select
                      fullWidth
                      size='small'
                      label='Pricing mode'
                      value={pricingMode}
                      onChange={(e) => {
                        const mode = e.target.value as 'fixed' | 'per_unit'

                        setPricingMode(mode)

                        // Đổi về fixed mà chưa có mốc giá → tạo mặc định
                        if (mode === 'fixed' && priceFields.filter(f => f.key && f.value).length === 0) {
                          setPriceFields([
                            { key: '1', value: '', cost: '' },
                            { key: '7', value: '', cost: '' },
                            { key: '30', value: '', cost: '' },
                          ])
                        }
                      }}
                    >
                      <MenuItem value='fixed'>Mốc cố định</MenuItem>
                      <MenuItem value='per_unit'>Nhập tự do (per unit)</MenuItem>
                    </CustomTextField>
                  </Grid2>

                  {pricingMode === 'per_unit' && (
                    <>
                      <Grid2 size={{ xs: 12, sm: 2.5 }}>
                        <CustomTextField
                          select
                          fullWidth
                          size='small'
                          label='Đơn vị'
                          value={timeUnit}
                          onChange={(e) => setTimeUnit(e.target.value as 'day' | 'month')}
                        >
                          <MenuItem value='day'>Ngày</MenuItem>
                          <MenuItem value='month'>Tháng</MenuItem>
                        </CustomTextField>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 2.5 }}>
                        <CustomTextField
                          fullWidth
                          size='small'
                          type='number'
                          label={`Giá bán/${timeUnit === 'month' ? 'tháng' : 'ngày'}`}
                          value={pricePerUnit}
                          onChange={(e) => setPricePerUnit(e.target.value)}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 2.5 }}>
                        <CustomTextField
                          fullWidth
                          size='small'
                          type='number'
                          label={`Giá vốn/${timeUnit === 'month' ? 'tháng' : 'ngày'}`}
                          value={costPerUnit}
                          onChange={(e) => setCostPerUnit(e.target.value)}
                        />
                      </Grid2>
                    </>
                  )}

                  {/* Chiết khấu theo khoảng ngày */}
                  {pricingMode === 'per_unit' && (
                    <Grid2 size={{ xs: 12 }}>
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', background: '#fafbfc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Chiết khấu giá BÁN theo số {timeUnit === 'month' ? 'tháng' : 'ngày'}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>Giảm giá bán cho <strong>khách thường + site con</strong> khi mua nhiều {timeUnit === 'month' ? 'tháng' : 'ngày'}. Không áp cho đại lý.{parseInt(pricePerUnit) > 0 && <><br/>VD: Giá bán {parseInt(pricePerUnit).toLocaleString('vi-VN')}đ, giảm 10% → khách trả {Math.round(parseInt(pricePerUnit) * 0.9).toLocaleString('vi-VN')}đ/{timeUnit === 'month' ? 'tháng' : 'ngày'}.</>}</div>
                          </div>
                          <Button
                            size='small' variant='outlined'
                            onClick={() => setDiscountTiers(prev => [...prev, { min: '', max: '', discount: '' }])}
                            sx={{ fontSize: '11px', textTransform: 'none' }}
                          >
                            + Thêm mức
                          </Button>
                        </div>

                        {discountTiers.length === 0 && (
                          <div style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', padding: '8px 0' }}>
                            Chưa có chiết khấu — khách thường trả full đơn giá bán bất kể số {timeUnit === 'month' ? 'tháng' : 'ngày'}.
                          </div>
                        )}

                        {discountTiers.length > 0 && (
                          <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 40px', gap: '6px', background: '#f1f5f9', padding: '6px 10px', fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
                              <span>Từ ({timeUnit === 'month' ? 'tháng' : 'ngày'})</span>
                              <span>Đến ({timeUnit === 'month' ? 'tháng' : 'ngày'})</span>
                              <span>Giảm (%)</span>
                              <span>Giá bán (đ)</span>
                              <span></span>
                            </div>
                            {discountTiers.map((tier, idx) => (
                              <DiscountTierRow key={idx} tier={tier} idx={idx} basePrice={parseFloat(pricePerUnit) || 0}
                                unitLabel={timeUnit === 'month' ? 'tháng' : 'ngày'} color='#16a34a'
                                onUpdate={(i, patch) => setDiscountTiers(prev => prev.map((t, j) => j === i ? { ...t, ...patch } : t))}
                                onRemove={(i) => setDiscountTiers(prev => prev.filter((_, j) => j !== i))} />
                            ))}
                          </div>
                        )}

                        {/* Preview cho admin */}
                        {discountTiers.length > 0 && parseFloat(pricePerUnit) > 0 && (
                          <div style={{ marginTop: 8, padding: '8px 10px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe', fontSize: '11.5px', color: '#1e40af' }}>
                            <strong>Khách sẽ thấy khi nhập số {timeUnit === 'month' ? 'tháng' : 'ngày'}:</strong>
                            {discountTiers.filter(t => t.min && t.discount).map((t, i) => {
                              const base = parseFloat(pricePerUnit) || 0
                              const disc = parseFloat(t.discount) || 0
                              const price = Math.round(base * (1 - disc / 100) * 100) / 100

                              return (
                                <span key={i}>
                                  {' '}{i > 0 ? '· ' : ''}{t.min}{t.max ? `-${t.max}` : '+'} {timeUnit === 'month' ? 'tháng' : 'ngày'}: <strong>{formatVN(price)}đ (-{disc}%)</strong>
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </Grid2>
                  )}

                  {/* Chiết khấu giá GỐC Provider theo khoảng ngày */}
                  {pricingMode === 'per_unit' && parseFloat(costPerUnit) > 0 && (
                    <Grid2 size={{ xs: 12 }}>
                      <div style={{ border: '1px solid #fde68a', borderRadius: 10, padding: '12px 14px', background: '#fffbeb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400e' }}>Chiết khấu giá GỐC (Provider) theo số {timeUnit === 'month' ? 'tháng' : 'ngày'}</div>
                            <div style={{ fontSize: '11px', color: '#92400e', lineHeight: 1.5 }}>Chỉ áp cho <strong>đại lý (reseller)</strong>. Nhập chính sách giá từ Provider — giá vốn giảm khi mua nhiều {timeUnit === 'month' ? 'tháng' : 'ngày'}.{parseFloat(costPerUnit) > 0 && <><br/>VD: Gốc {parseFloat(costPerUnit).toLocaleString('vi-VN')}đ, giảm 20% → vốn {Math.round(parseFloat(costPerUnit) * 0.8).toLocaleString('vi-VN')}đ, đại lý +15% → trả {Math.round(parseFloat(costPerUnit) * 0.8 * 1.15).toLocaleString('vi-VN')}đ/{timeUnit === 'month' ? 'tháng' : 'ngày'}.</>}</div>
                          </div>
                          <Button
                            size='small' variant='outlined' color='warning'
                            onClick={() => setCostDiscountTiers(prev => [...prev, { min: '', max: '', discount: '' }])}
                            sx={{ fontSize: '11px', textTransform: 'none' }}
                          >
                            + Thêm mức
                          </Button>
                        </div>

                        {costDiscountTiers.length === 0 && (
                          <div style={{ fontSize: '12px', color: '#b45309', textAlign: 'center', padding: '8px 0' }}>
                            Chưa có chiết khấu Provider — đại lý mua với giá gốc cố định ({parseFloat(costPerUnit) > 0 ? `${parseFloat(costPerUnit).toLocaleString('vi-VN')}đ` : '...'} × markup%) bất kể số {timeUnit === 'month' ? 'tháng' : 'ngày'}.
                          </div>
                        )}

                        {costDiscountTiers.length > 0 && (
                          <div style={{ border: '1px solid #fde68a', borderRadius: 8, overflow: 'hidden' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 40px', gap: '6px', background: '#fef3c7', padding: '6px 10px', fontSize: '11px', fontWeight: 600, color: '#92400e' }}>
                              <span>Từ ({timeUnit === 'month' ? 'tháng' : 'ngày'})</span>
                              <span>Đến ({timeUnit === 'month' ? 'tháng' : 'ngày'})</span>
                              <span>Giảm (%)</span>
                              <span>Giá gốc (đ)</span>
                              <span></span>
                            </div>
                            {costDiscountTiers.map((tier, idx) => (
                              <DiscountTierRow key={idx} tier={tier} idx={idx} basePrice={parseFloat(costPerUnit) || 0}
                                unitLabel={timeUnit === 'month' ? 'tháng' : 'ngày'} color='#d97706'
                                onUpdate={(i, patch) => setCostDiscountTiers(prev => prev.map((t, j) => j === i ? { ...t, ...patch } : t))}
                                onRemove={(i) => setCostDiscountTiers(prev => prev.filter((_, j) => j !== i))} />
                            ))}
                          </div>
                        )}
                      </div>
                    </Grid2>
                  )}

                  {/* Khi per_unit: hiện mốc giá cũ đã lưu (read-only) */}
                  {pricingMode === 'per_unit' && priceFields.filter(f => f.key && f.value).length > 0 && (
                    <Grid2 size={{ xs: 12 }}>
                      <div style={{ fontSize: '11.5px', color: '#94a3b8', padding: '6px 10px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        Có {priceFields.filter(f => f.key && f.value).length} mốc giá cố định đã lưu trước đó — sẽ được giữ lại để dùng khi đổi về "Mốc cố định"
                      </div>
                    </Grid2>
                  )}

                  {pricingMode === 'fixed' && (
                    <Grid2 size={{ xs: 12, sm: 8 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', paddingBottom: 4 }}>
                        <Button
                          onClick={() => setIsPriceModalOpen(true)}
                          variant='contained'
                          color='info'
                          size='small'
                          className='text-white'
                          startIcon={<Plus size={14} />}
                        >
                          Set giá theo thời gian
                        </Button>
                        {priceFields.filter((f: any) => f.key && f.value).length > 0 && (
                          <Typography variant='caption' color='text.secondary'>
                            ({priceFields.filter((f: any) => f.key && f.value).length} mốc giá)
                          </Typography>
                        )}
                      </div>
                    </Grid2>
                  )}
                </Grid2>
              </div>

              {/* ========== Section 3: Cấu hình API ========== */}
              <div style={{ background: '#fafbfc', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe size={13} color='#16a34a' />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Cấu hình API</span>
                </div>
                <Grid2 container spacing={1}>
                  <Grid2 size={{ xs: 6, sm: 4 }}>
                    <Controller
                      name='api_provider'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField {...field} fullWidth label='API Endpoint' placeholder='URL đối tác' />
                      )}
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 12 }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button
                        onClick={() => setIsMultiInputModalOpen(true)}
                        variant='contained'
                        color='secondary'
                        size='small'
                        className='text-white'
                        startIcon={<Plus size={14} />}
                      >
                        Thêm nhiều trường
                      </Button>
                    </div>
                  </Grid2>
                </Grid2>
              </div>
            </form>
          )}
          </Box>

          {/* Right: Preview — 100% giống card khách hàng */}
          <Box sx={{ width: 380, flexShrink: 0, overflowY: 'auto', borderLeft: '1px solid #e2e8f0', pl: 2, display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Eye size={16} color='#16a34a' />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#15803d' }}>Xem trước</span>
              </div>

              <ServicePreview
                control={control}
                serviceId={serviceId}
                priceFields={priceFields}
                multiInputFields={multiInputFields}
                allowCustomAuth={allowCustomAuth}
              />

              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: '#94a3b8' }}>
                Cập nhật theo thời gian thực
              </div>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 1.5, pt: 1 }}>
          <Button onClick={onClose} variant='outlined' disabled={isPending}>
            Hủy
          </Button>
          <Button
            type='submit'
            form='service-form'
            variant='contained'
            className='text-white'
            disabled={isPending || (isEditMode && loadingService && !initialData)}
            startIcon={isPending ? <CircularProgress size={18} color='inherit' /> : null}
            sx={{
              background: 'var(--primary-gradient, linear-gradient(135deg, #F88A4B 0%, #F6734B 100%))',
              '&:hover': { opacity: 0.9 },
              fontWeight: 700,
              px: 3,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            {isPending
              ? (isEditMode ? 'Đang cập nhật...' : 'Đang thêm...')
              : (isEditMode ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sub-modals */}
      <MultiInputModal
        isOpen={isMultiInputModalOpen}
        onClose={() => setIsMultiInputModalOpen(false)}
        onSave={(fields) => {
          toast.success(`Đã lưu ${fields.length} trường thành công!`)
          setIsMultiInputModalOpen(false)
        }}
        title='Thêm nhiều trường'
        keyLabel='Key'
        valueLabel='Value'
        fields={multiInputFields}
        setFields={setMultiInputFields}
      />

      <PriceByDurationModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        onSave={(fields) => {
          setPriceFields(fields)
          toast.success('Đã lưu giá thành công!')
          setIsPriceModalOpen(false)
        }}
        fields={priceFields}
        setFields={setPriceFields}
      />
    </>
  )
}
