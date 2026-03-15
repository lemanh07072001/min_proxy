'use client'

/**
 * Form thêm/sửa sản phẩm cho SITE CON.
 * Đơn giản hơn form site mẹ:
 * - Chọn SP từ site mẹ (dropdown)
 * - Bảng giá: giá nhập (read-only) | giá bán (editable)
 * - Tên, mô tả, tag, trạng thái
 * - KHÔNG có: provider, api_provider, body_api, code
 */

import { useState, useEffect, useMemo } from 'react'

import {
  Dialog, DialogContent, Button, TextField, MenuItem, Grid2,
  Alert, IconButton, Chip, Switch, FormControlLabel, Tooltip
} from '@mui/material'
import {
  X, Save, Loader2, Package, Info,
  MapPin, Shield, Wifi, Zap, Users, RefreshCw, Clock, Globe, ShoppingCart
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'
import { useServiceType, useCreateServiceType, useUpdateServiceType } from '@/hooks/apis/useServiceType'
import { useSupplierProducts, type SupplierProduct } from '@/hooks/apis/useSupplierProducts'
import { useCountries } from '@/hooks/apis/useCountries'

import { PREDEFINED_TAGS, getTagStyle } from '@/configs/tagConfig'

interface Props {
  open: boolean
  onClose: () => void
  serviceId?: number | null
  initialData?: any
}

export default function ChildServiceFormModal({ open, onClose, serviceId, initialData }: Props) {
  const isEditMode = !!serviceId

  // Data
  const { data: fetchedData, isLoading: loadingService } = useServiceType(serviceId, isEditMode && open)
  const serviceData = fetchedData || initialData
  const { data: supplierData, isLoading: loadingSupplier } = useSupplierProducts(open)
  const { data: countries } = useCountries()

  // Mutations
  const createMutation = useCreateServiceType()
  const updateMutation = useUpdateServiceType(serviceId)

  // State
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null)
  const [priceFields, setPriceFields] = useState<Array<{ key: string; value: string; cost: string }>>([])

  // All supplier products (imported + available)
  const allSupplierProducts = useMemo(() => {
    if (!supplierData) return []

    return [...(supplierData.imported || []), ...(supplierData.available || [])]
  }, [supplierData])

  // Selected supplier product details
  const selectedProduct = useMemo(() => {
    if (!selectedSupplierId) return null

    return allSupplierProducts.find(p => p.supplier_id === selectedSupplierId) || null
  }, [selectedSupplierId, allSupplierProducts])

  // Form
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      status: 'active',
      type: '0',
      ip_version: 'ipv4',
      proxy_type: 'residential',
      protocols: [] as string[],
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
      pool_size: '',
      request_limit: '',
      concurrent_connections: '',
    }
  })

  const watchTag = watch('tag')

  // Watch all fields for preview
  const watchAll = watch()

  // Load service data when editing
  useEffect(() => {
    if (serviceData && isEditMode) {
      const meta = typeof serviceData.metadata === 'string'
        ? JSON.parse(serviceData.metadata || '{}')
        : (serviceData.metadata || {})

      setSelectedSupplierId(meta.supplier_product_id || null)

      // Parse price_by_duration
      let prices = serviceData.price_by_duration

      if (typeof prices === 'string') try { prices = JSON.parse(prices) } catch { prices = [] }

      if (prices && Array.isArray(prices)) {
        const supplierPrices = meta.supplier_prices || {}

        setPriceFields(prices.map((p: any) => ({
          key: p.key || '',
          value: String(p.value || ''),
          cost: String(supplierPrices[p.key] || p.cost || ''),
        })))
      }

      let parsedProtocols = serviceData.protocols

      if (typeof parsedProtocols === 'string') try { parsedProtocols = JSON.parse(parsedProtocols) } catch { parsedProtocols = [] }

      reset({
        name: serviceData.name || '',
        status: serviceData.status || 'active',
        type: serviceData.type?.toString() || '0',
        ip_version: serviceData.ip_version?.toLowerCase() || 'ipv4',
        proxy_type: serviceData.proxy_type || 'residential',
        protocols: parsedProtocols || [],
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
        pool_size: serviceData.pool_size || '',
        request_limit: serviceData.request_limit || '',
        concurrent_connections: serviceData.concurrent_connections?.toString() || '',
      })
    }
  }, [serviceData, isEditMode, reset])

  // When selecting a supplier product (new import)
  useEffect(() => {
    if (!selectedProduct || isEditMode) return

    // Auto fill from supplier product
    setValue('name', selectedProduct.name)
    setValue('type', selectedProduct.type === 'ROTATING' ? '1' : '0')
    setValue('country', selectedProduct.country?.toLowerCase() || '')

    if (selectedProduct.protocols) {
      setValue('protocols', selectedProduct.protocols)
    }

    // Set price fields from supplier prices
    const prices = selectedProduct.supplier_prices || {}

    setPriceFields(
      Object.entries(prices).map(([key, cost]) => ({
        key,
        value: '', // Admin sẽ nhập giá bán
        cost: String(cost),
      }))
    )
  }, [selectedProduct, isEditMode, setValue])

  // Reset when open for create
  useEffect(() => {
    if (open && !isEditMode) {
      reset({
        name: '', status: 'active', type: '0', ip_version: 'ipv4',
        proxy_type: 'residential',
        protocols: [], country: '', note: '', tag: '', is_purchasable: true,
        auth_type: '', bandwidth: '', rotation_type: '', rotation_interval: '',
        pool_size: '', request_limit: '', concurrent_connections: '',
      })
      setSelectedSupplierId(null)
      setPriceFields([])
    }
  }, [open, isEditMode, reset])

  const getDurationLabel = (key: string) => {
    const days = parseInt(key)

    if (days === 1) return '1 ngày'
    if (days === 7) return '7 ngày (tuần)'
    if (days === 30) return '30 ngày (tháng)'
    if (days === 90) return '90 ngày (quý)'
    if (days === 365) return '365 ngày (năm)'

    return `${key} ngày`
  }

  const toggleTag = (preset: string) => {
    const current = watchTag ? watchTag.split(',').map((t: string) => t.trim()).filter(Boolean) : []
    const exists = current.includes(preset)
    const updated = exists ? current.filter((t: string) => t !== preset) : [...current, preset]

    setValue('tag', updated.join(', '))
  }

  const getCountryNameFromCode = (code: string) => {
    if (!code || !countries) return ''
    const found = (countries as any[]).find((c: any) => c.code.toLowerCase() === code.toLowerCase())

    return found ? found.name : code.toUpperCase()
  }

  const getAuthTypeLabel = (val: string) => {
    switch (val) {
      case 'userpass': return 'User:Pass'
      case 'ip_whitelist': return 'IP Whitelist'
      case 'both': return 'User:Pass + IP'
      default: return val
    }
  }

  const getRotationTypeLabel = (val: string) => {
    switch (val) {
      case 'per_request': return 'Per request'
      case 'sticky': return 'Sticky'
      case 'time_based': return 'Time-based'
      default: return val
    }
  }

  const onSubmit = (data: any) => {
    // Validate giá bán
    const emptyPrices = priceFields.filter(p => !p.value || parseInt(p.value) <= 0)

    if (priceFields.length > 0 && emptyPrices.length > 0) {
      toast.error('Vui lòng nhập giá bán cho tất cả thời gian')

      return
    }

    // Check giá bán > giá nhập
    const underPriced = priceFields.filter(p => parseInt(p.value) <= parseInt(p.cost))

    if (underPriced.length > 0) {
      const label = getDurationLabel(underPriced[0].key)

      toast.error(`Giá bán ${label} phải cao hơn giá nhập (${parseInt(underPriced[0].cost).toLocaleString('vi-VN')}đ)`)

      return
    }

    const submitData: any = {
      ...data,
      price: parseInt(priceFields[0]?.value || '0'),
      price_by_duration: priceFields.map(p => ({
        key: p.key,
        value: parseInt(p.value),
        cost: parseInt(p.cost),
      })),
      cost_price: Math.min(...priceFields.map(p => parseInt(p.cost) || 0)),
      proxy_type: data.proxy_type || 'residential',
      country: data.country || '',
      api_type: 'buy_api',
      api_provider: '', // Site con không cần — SupplierService tự xử lý
      body_api: null,
      code: null,
      auth_type: data.auth_type || '',
      bandwidth: data.bandwidth || '',
      rotation_type: data.rotation_type || '',
      rotation_interval: data.rotation_interval || '',
      pool_size: data.pool_size || '',
      request_limit: data.request_limit || '',
      concurrent_connections: data.concurrent_connections ? parseInt(data.concurrent_connections) : null,
      min_quantity: data.min_quantity || 1,
      max_quantity: data.max_quantity || 100,
    }

    // Nếu tạo mới — thêm metadata với supplier_product_id
    if (!isEditMode && selectedSupplierId) {
      submitData.metadata = JSON.stringify({
        supplier_product_id: selectedSupplierId,
        supplier_prices: Object.fromEntries(priceFields.map(p => [p.key, parseInt(p.cost)])),
      })
    }

    const mutation = isEditMode ? updateMutation : createMutation

    mutation.mutate(submitData, {
      onSuccess: () => {
        toast.success(isEditMode ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!')
        if (!isEditMode) onClose()
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
      }
    })
  }

  const isPending = createMutation.isPending || updateMutation.isPending
  const isLoading = loadingService || loadingSupplier

  // Preview helpers
  const previewName = watchAll.name || 'Tên sản phẩm'
  const previewTags = watchAll.tag ? watchAll.tag.split(',').map((t: string) => t.trim()).filter(Boolean) : []
  const previewType = watchAll.type === '1' ? 'Rotating' : 'Static'
  const previewIpVersion = watchAll.ip_version === 'ipv6' ? 'V6' : 'V4'
  const previewCountryCode = watchAll.country || ''
  const previewCountryName = getCountryNameFromCode(previewCountryCode)

  const previewProtocols = Array.isArray(watchAll.protocols) && watchAll.protocols.length > 0
    ? watchAll.protocols.map((p: string) => p.toUpperCase()).join('/')
    : '—'

  const previewPrice = priceFields.length > 0 && priceFields[0].value
    ? `${parseInt(priceFields[0].value).toLocaleString('vi-VN')}đ`
    : '—'

  const FeatureRow = ({ icon: Icon, iconColor, label, value }: { icon: any; iconColor: string; label: string; value: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px', borderBottom: '1px solid #f8fafc' }}>
      <Icon size={16} color={iconColor} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', color: '#4a5568', fontWeight: 500 }}>{label}:</span>
        <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: 700 }}>{value}</span>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth='lg' fullWidth closeAfterTransition={false}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'color-mix(in srgb, var(--primary-hover, #6366f1) 12%, white)' }}>
            <Package size={16} style={{ color: 'var(--primary-hover, #6366f1)' }} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
            {isEditMode ? 'Sửa sản phẩm' : 'Thêm sản phẩm từ nhà cung cấp'}
          </span>
        </div>
        <IconButton onClick={onClose} size='small' sx={{ color: '#9ca3af' }}>
          <X size={18} />
        </IconButton>
      </div>

      <DialogContent sx={{ pt: 2.5 }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Đang tải...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'flex', gap: 24 }}>
              {/* Left: Form */}
              <div style={{ flex: 3 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Chọn SP site mẹ (chỉ khi tạo mới) */}
              {!isEditMode && (
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>
                    Chọn sản phẩm từ nhà cung cấp
                  </div>
                  <CustomTextField
                    select
                    fullWidth
                    value={selectedSupplierId || ''}
                    onChange={e => setSelectedSupplierId(Number(e.target.value))}
                    label='Sản phẩm site mẹ'
                    helperText={
                      allSupplierProducts.length === 0
                        ? 'Không có sản phẩm — kiểm tra kết nối nhà cung cấp trong Cài đặt chung'
                        : 'Chọn sản phẩm muốn bán trên site của bạn'
                    }
                  >
                    <MenuItem value=''><em>— Chọn sản phẩm —</em></MenuItem>
                    {(supplierData?.available || []).length > 0 && (
                      <MenuItem disabled sx={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>Chưa import:</MenuItem>
                    )}
                    {(supplierData?.available || []).map(p => (
                      <MenuItem key={p.supplier_id} value={p.supplier_id}>
                        {p.name} ({p.type}) — {Object.values(p.supplier_prices).map(pr => `${pr.toLocaleString('vi-VN')}đ`).join(' / ')}
                      </MenuItem>
                    ))}
                    {(supplierData?.imported || []).length > 0 && (
                      <MenuItem disabled sx={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Đã import:</MenuItem>
                    )}
                    {(supplierData?.imported || []).map(p => (
                      <MenuItem key={p.supplier_id} value={p.supplier_id} disabled>
                        {p.name} ({p.type}) — đã có
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </div>
              )}

              {/* Tên + trạng thái */}
              <Grid2 container spacing={1.5}>
                <Grid2 size={{ xs: 8 }}>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Tên sản phẩm' placeholder='VD: Proxy IPv4 Việt Nam' />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <Controller
                    name='status'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth select label='Trạng thái'>
                        <MenuItem value='active'>Đang bán</MenuItem>
                        <MenuItem value='inactive'>Tạm ẩn</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid2>
              </Grid2>

              {/* Bảng giá — giá nhập (read-only) | giá bán (editable) */}
              {priceFields.length > 0 && (
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>
                    Bảng giá
                  </div>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', background: '#f8fafc', padding: '8px 12px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                      <span>Thời gian</span>
                      <span>Giá nhập (site mẹ)</span>
                      <span>Giá bán (của bạn)</span>
                      <span>Lợi nhuận</span>
                    </div>
                    {/* Rows */}
                    {priceFields.map((field, idx) => {
                      const cost = parseInt(field.cost) || 0
                      const sell = parseInt(field.value) || 0
                      const profit = sell - cost
                      const profitPct = cost > 0 ? Math.round((profit / cost) * 100) : 0

                      return (
                        <div key={field.key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', alignItems: 'center', padding: '8px 12px', borderBottom: idx < priceFields.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{getDurationLabel(field.key)}</span>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>{cost.toLocaleString('vi-VN')}đ</span>
                          <TextField
                            size='small'
                            type='text'
                            value={field.value ? parseInt(field.value).toLocaleString('vi-VN') : ''}
                            onChange={e => {
                              const raw = e.target.value.replace(/[^0-9]/g, '')

                              setPriceFields(prev => prev.map((p, i) => i === idx ? { ...p, value: raw } : p))
                            }}
                            placeholder='Nhập giá bán'
                            sx={{ '& input': { fontSize: '13px', padding: '6px 10px' } }}
                            error={!!field.value && parseInt(field.value) <= cost}
                          />
                          <span style={{
                            fontSize: '13px', fontWeight: 600,
                            color: profit > 0 ? '#22c55e' : profit < 0 ? '#ef4444' : '#94a3b8'
                          }}>
                            {sell > 0 ? `+${profit.toLocaleString('vi-VN')}đ (${profitPct}%)` : '—'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: 6 }}>
                    Giá nhập lấy tự động từ site mẹ, cập nhật mỗi giờ. Phần chênh lệch là lợi nhuận của bạn.
                  </div>
                </div>
              )}

              {/* Thông tin SP */}
              <Grid2 container spacing={1.5}>
                <Grid2 size={{ xs: 4 }}>
                  <Controller
                    name='type'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth select label='Loại'>
                        <MenuItem value='0'>Static</MenuItem>
                        <MenuItem value='1'>Rotating</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <Controller
                    name='ip_version'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth select label='IP Version'>
                        <MenuItem value='ipv4'>IPv4</MenuItem>
                        <MenuItem value='ipv6'>IPv6</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <Controller
                    name='proxy_type'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth select label='Loại proxy'>
                        <MenuItem value='residential'>Residential</MenuItem>
                        <MenuItem value='datacenter'>Datacenter</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid2>
              </Grid2>

              {/* Country */}
              <Controller
                name='country'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth select label='Quốc gia'>
                    <MenuItem value=''><em>— Chọn —</em></MenuItem>
                    {(countries || []).map((c: any) => (
                      <MenuItem key={c.code} value={c.code.toLowerCase()}>
                        <img src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} style={{ width: 20, height: 15, marginRight: 8, verticalAlign: 'middle' }} />
                        {c.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />

              {/* Proxy attribute fields */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>
                  Thuộc tính proxy
                </div>
                <Grid2 container spacing={1.5}>
                  <Grid2 size={{ xs: 6 }}>
                    <Controller
                      name='auth_type'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField {...field} fullWidth select label='Xác thực'>
                          <MenuItem value=''><em>— Không chọn —</em></MenuItem>
                          <MenuItem value='userpass'>User:Pass</MenuItem>
                          <MenuItem value='ip_whitelist'>IP Whitelist</MenuItem>
                          <MenuItem value='both'>Cả hai</MenuItem>
                        </CustomTextField>
                      )}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <Controller
                      name='bandwidth'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField {...field} fullWidth label='Băng thông' placeholder='VD: unlimited, 1GB' />
                      )}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <Controller
                      name='request_limit'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField {...field} fullWidth label='Giới hạn request' placeholder='VD: unlimited' />
                      )}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6 }}>
                    <Controller
                      name='concurrent_connections'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField {...field} fullWidth type='number' label='Kết nối đồng thời' placeholder='VD: 100' />
                      )}
                    />
                  </Grid2>
                  {/* Rotating-only fields */}
                  {watchAll.type === '1' && (
                    <>
                      <Grid2 size={{ xs: 4 }}>
                        <Controller
                          name='rotation_type'
                          control={control}
                          render={({ field }) => (
                            <CustomTextField {...field} fullWidth select label='Kiểu xoay'>
                              <MenuItem value=''><em>— Không chọn —</em></MenuItem>
                              <MenuItem value='per_request'>Per request</MenuItem>
                              <MenuItem value='sticky'>Sticky</MenuItem>
                              <MenuItem value='time_based'>Time-based</MenuItem>
                            </CustomTextField>
                          )}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 4 }}>
                        <Controller
                          name='rotation_interval'
                          control={control}
                          render={({ field }) => (
                            <CustomTextField {...field} fullWidth label='Thời gian xoay' placeholder='VD: 5 phút' />
                          )}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 4 }}>
                        <Controller
                          name='pool_size'
                          control={control}
                          render={({ field }) => (
                            <CustomTextField {...field} fullWidth label='Pool size' placeholder='VD: 10,000+' />
                          )}
                        />
                      </Grid2>
                    </>
                  )}
                </Grid2>
              </div>

              {/* Tag — chọn từ preset có màu */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: 6 }}>Tag sản phẩm</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {PREDEFINED_TAGS.map(preset => {
                    const tags = watchTag ? watchTag.split(',').map((t: string) => t.trim()) : []
                    const isActive = tags.includes(preset)
                    const style = getTagStyle(preset)

                    return (
                      <div
                        key={preset}
                        onClick={() => toggleTag(preset)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '4px 12px', borderRadius: 6, cursor: 'pointer',
                          fontSize: '12px', fontWeight: 600,
                          transition: 'all 0.15s ease',
                          background: isActive ? (style.gradient || style.bgColor) : '#f8fafc',
                          color: isActive ? style.textColor : '#64748b',
                          border: isActive ? `1px solid ${style.borderColor}` : '1px solid #e2e8f0',
                          transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        }}
                      >
                        {style.icon && <span style={{ fontSize: '11px' }}>{style.icon}</span>}
                        {preset}
                      </div>
                    )
                  })}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: 4 }}>Nhấn để chọn/bỏ chọn. Có thể chọn nhiều tag.</div>
              </div>

              {/* Cho phép mua + Min/Max */}
              <Grid2 container spacing={1.5} alignItems='center'>
                <Grid2 size={{ xs: 4 }}>
                  <Controller
                    name='is_purchasable'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} color='success' />}
                        label='Cho phép mua'
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <Controller
                    name='min_quantity'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        value={field.value ?? 1}
                        onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                        fullWidth type='number' label='SL tối thiểu'
                        slotProps={{ input: { inputProps: { min: 1 } } }}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <Controller
                    name='max_quantity'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        value={field.value ?? 100}
                        onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                        fullWidth type='number' label='SL tối đa'
                        slotProps={{ input: { inputProps: { min: 1 } } }}
                      />
                    )}
                  />
                </Grid2>
              </Grid2>

              <Controller
                name='note'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Mô tả sản phẩm'
                    placeholder='Mô tả ngắn hiển thị trên card sản phẩm...'
                    multiline
                    minRows={2}
                    maxRows={4}
                  />
                )}
              />

              {/* Submit */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                <Button onClick={onClose} variant='outlined' color='secondary' disabled={isPending}>
                  Hủy
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={isPending || (!isEditMode && !selectedSupplierId)}
                  startIcon={isPending ? <Loader2 size={16} className='animate-spin' /> : <Save size={16} />}
                  sx={{
                    background: 'var(--primary-gradient, linear-gradient(45deg, #FC4336, #F88A4B))',
                    color: 'var(--primary-contrast, #fff)',
                    '&:hover': { opacity: 0.9 },
                  }}
                >
                  {isPending ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Thêm sản phẩm'}
                </Button>
              </div>
                </div>
              </div>

              {/* Right: Preview */}
              <div style={{ flex: 2, position: 'sticky', top: 0, alignSelf: 'flex-start' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: 8 }}>Xem trước sản phẩm</div>
                <div style={{
                  background: 'white', borderRadius: 12, padding: 16,
                  border: '1px solid #e2e8f0', position: 'relative',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  {/* top gradient bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: 'var(--primary-gradient, linear-gradient(90deg, #e53e3e, #ff6b6b))',
                    borderRadius: '12px 12px 0 0'
                  }} />

                  {/* Header: name + tags */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8, paddingTop: 4 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', lineHeight: 1.3 }}>
                      {previewName}
                      {serviceId && <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 400, marginLeft: 4 }}>#{serviceId}</span>}
                    </div>
                    {previewTags.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', flexShrink: 0 }}>
                        {previewTags.map((tag: string) => {
                          const style = getTagStyle(tag)

                          return (
                            <span key={tag} style={{
                              display: 'inline-flex', alignItems: 'center', gap: 2,
                              padding: '2px 8px', borderRadius: 4, fontSize: '10px', fontWeight: 600,
                              background: style.gradient || style.bgColor, color: style.textColor,
                              border: `1px solid ${style.borderColor}`,
                              lineHeight: 1.4,
                            }}>
                              {style.icon && <span style={{ fontSize: '9px' }}>{style.icon}</span>}
                              {tag}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {watchAll.note && (
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: 12, lineHeight: 1.4,
                      overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any
                    }}>
                      {watchAll.note}
                    </div>
                  )}

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />

                  {/* Feature rows */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <FeatureRow
                      icon={MapPin} iconColor='#e53e3e'
                      label='Loại IP'
                      value={`${previewType} ${previewIpVersion}${previewCountryName ? ` — ${previewCountryCode ? `\u{1F1E6}` : ''}` : ''}${previewCountryName ? ` ${previewCountryName}` : ''}`}
                    />
                    {previewCountryCode && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px', borderBottom: '1px solid #f8fafc' }}>
                        <MapPin size={16} color='#e53e3e' style={{ visibility: 'hidden' }} />
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                          <img src={`https://flagcdn.com/w20/${previewCountryCode.toLowerCase()}.png`} style={{ width: 20, height: 15, marginRight: 4, verticalAlign: 'middle' }} />
                          <span style={{ fontSize: '13px', color: '#64748b' }}>{previewCountryName}</span>
                        </div>
                      </div>
                    )}
                    <FeatureRow icon={Shield} iconColor='#6366f1' label='Hỗ trợ' value={previewProtocols} />
                    {watchAll.auth_type && (
                      <FeatureRow icon={Shield} iconColor='#8b5cf6' label='Xác thực' value={getAuthTypeLabel(watchAll.auth_type)} />
                    )}
                    {watchAll.bandwidth && (
                      <FeatureRow icon={Wifi} iconColor='#0ea5e9' label='Băng thông' value={watchAll.bandwidth} />
                    )}
                    {watchAll.request_limit && (
                      <FeatureRow icon={Zap} iconColor='#f59e0b' label='Giới hạn request' value={watchAll.request_limit} />
                    )}
                    {watchAll.concurrent_connections && (
                      <FeatureRow icon={Users} iconColor='#10b981' label='Kết nối đồng thời' value={watchAll.concurrent_connections} />
                    )}
                    {watchAll.type === '1' && watchAll.rotation_type && (
                      <FeatureRow icon={RefreshCw} iconColor='#e53e3e' label='Kiểu xoay' value={getRotationTypeLabel(watchAll.rotation_type)} />
                    )}
                    {watchAll.type === '1' && watchAll.rotation_interval && (
                      <FeatureRow icon={Clock} iconColor='#64748b' label='Thời gian xoay' value={watchAll.rotation_interval} />
                    )}
                    {watchAll.type === '1' && watchAll.pool_size && (
                      <FeatureRow icon={Globe} iconColor='#0ea5e9' label='Pool size' value={watchAll.pool_size} />
                    )}
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid #e2e8f0', margin: '10px 0 8px' }} />

                  {/* Footer: price + buy button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>từ </span>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>{previewPrice}</span>
                    </div>
                    <span style={{
                      padding: '5px 12px', borderRadius: 7, fontSize: '11px', fontWeight: 600,
                      background: watchAll.is_purchasable
                        ? 'color-mix(in srgb, var(--primary-hover) 12%, white)'
                        : '#f1f5f9',
                      color: watchAll.is_purchasable
                        ? 'var(--primary-hover)'
                        : '#94a3b8',
                      border: watchAll.is_purchasable
                        ? '1px solid color-mix(in srgb, var(--primary-hover) 30%, transparent)'
                        : '1px solid #e2e8f0',
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      <ShoppingCart size={12} />
                      {watchAll.is_purchasable ? 'Mua ngay' : 'Tạm ngừng'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
