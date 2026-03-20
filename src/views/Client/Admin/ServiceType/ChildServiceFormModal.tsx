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
import { useFormNotification } from '@/hooks/useFormNotification'
import FormAlert from '@/components/FormAlert'
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
  const [selectedSupplierCode, setSelectedSupplierCode] = useState<string | null>(null)
  const { notification, showSuccess, showError, clear: clearNotification } = useFormNotification()
  const [priceFields, setPriceFields] = useState<Array<{ key: string; value: string; cost: string }>>([])
  const [pricingMode, setPricingMode] = useState<'fixed' | 'per_unit'>('fixed')
  const [parentPricingMode, setParentPricingMode] = useState<'fixed' | 'per_unit'>('fixed')
  const [timeUnit, setTimeUnit] = useState<'day' | 'month'>('day')
  const [pricePerUnit, setPricePerUnit] = useState('')
  const [costPerUnit, setCostPerUnit] = useState('')

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
  const { control, handleSubmit, reset, setValue, watch, setError, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      code: '',
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

      const supplierId = meta.supplier_product_id || null
      let supplierCode = meta.supplier_product_code || null

      setSelectedSupplierId(supplierId)

      // Nếu chưa có code trong metadata, tìm từ danh sách supplier products
      if (!supplierCode && supplierId && allSupplierProducts.length > 0) {
        const found = allSupplierProducts.find(p => p.supplier_id === supplierId)

        supplierCode = found?.supplier_code || null
      }

      setSelectedSupplierCode(supplierCode)

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

      // Load pricing mode
      setPricingMode(serviceData.pricing_mode || 'fixed')
      setParentPricingMode(meta.parent_pricing_mode || serviceData.pricing_mode || 'fixed')
      setTimeUnit(serviceData.time_unit || 'day')
      setPricePerUnit(serviceData.price_per_unit?.toString() || '')
      setCostPerUnit(serviceData.cost_per_unit?.toString() || '')

      let parsedProtocols = serviceData.protocols

      if (typeof parsedProtocols === 'string') try { parsedProtocols = JSON.parse(parsedProtocols) } catch { parsedProtocols = [] }

      reset({
        name: serviceData.name || '',
        code: serviceData.code || '',
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
  }, [serviceData, isEditMode, reset, allSupplierProducts])

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

    // Set pricing mode theo site mẹ
    const parentMode = selectedProduct.pricing_mode || 'fixed'
    setParentPricingMode(parentMode)
    setPricingMode(parentMode)
    setTimeUnit(selectedProduct.time_unit || 'day')

    if (parentMode === 'per_unit') {
      // Per_unit: giá nhập = price_per_unit site mẹ
      setCostPerUnit(String(selectedProduct.price_per_unit || 0))
      setPricePerUnit('') // Admin nhập giá bán
      setPriceFields([])
    } else {
      // Fixed: set price fields từ supplier prices
      const prices = selectedProduct.supplier_prices || {}
      setPriceFields(
        Object.entries(prices).map(([key, cost]) => ({
          key,
          value: '', // Admin sẽ nhập giá bán
          cost: String(cost),
        }))
      )
    }
  }, [selectedProduct, isEditMode, setValue])

  // Reset when modal opens
  useEffect(() => {
    clearNotification()

    if (open && !isEditMode) {
      reset({
        name: '', code: '', status: 'active', type: '0', ip_version: 'ipv4',
        proxy_type: 'residential',
        protocols: [], country: '', note: '', tag: '', is_purchasable: true,
        auth_type: '', bandwidth: '', rotation_type: '', rotation_interval: '',
        pool_size: '', request_limit: '', concurrent_connections: '',
        min_quantity: 1, max_quantity: 100,
      })
      setSelectedSupplierId(null)
      setSelectedSupplierCode(null)
      setPriceFields([])
      setPricingMode('fixed')
      setTimeUnit('day')
      setPricePerUnit('')
      setCostPerUnit('')
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
    if (pricingMode === 'per_unit') {
      // Per_unit: validate giá bán/đơn vị
      const sell = parseInt(pricePerUnit)
      const cost = parseInt(costPerUnit)

      if (!sell || sell <= 0) {
        showError('Vui lòng nhập giá bán / đơn vị')
        return
      }

      if (cost > 0 && sell <= cost) {
        showError(`Giá bán phải cao hơn giá nhập (${cost.toLocaleString('vi-VN')}đ/${timeUnit === 'month' ? 'tháng' : 'ngày'})`)
        return
      }
    } else {
      // Fixed: validate giá bán
      const emptyPrices = priceFields.filter(p => !p.value || parseInt(p.value) <= 0)

      if (priceFields.length > 0 && emptyPrices.length > 0) {
        showError('Vui lòng nhập giá bán cho tất cả thời gian')
        document.getElementById('child-form-alert')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        return
      }

      const underPriced = priceFields.filter(p => parseInt(p.value) <= parseInt(p.cost))

      if (underPriced.length > 0) {
        const label = getDurationLabel(underPriced[0].key)
        showError(`Giá bán ${label} phải cao hơn giá nhập (${parseInt(underPriced[0].cost).toLocaleString('vi-VN')}đ)`)
        document.getElementById('child-form-alert')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        return
      }
    }

    const submitData: any = {
      ...data,
      pricing_mode: pricingMode,
      time_unit: timeUnit,
      price_per_unit: pricingMode === 'per_unit' ? (parseInt(pricePerUnit) || null) : null,
      cost_per_unit: pricingMode === 'per_unit' ? (parseInt(costPerUnit) || null) : null,
      price: pricingMode === 'per_unit' ? (parseInt(pricePerUnit) || 0) : parseInt(priceFields[0]?.value || '0'),
      price_by_duration: pricingMode === 'per_unit' ? [] : priceFields.map(p => {
        const parentPerUnit = parentPricingMode === 'per_unit'
        const computedCost = parentPerUnit ? (parseInt(costPerUnit) || 0) * (parseInt(p.key) || 0) : (parseInt(p.cost) || 0)

        return { key: p.key, value: parseInt(p.value), cost: computedCost }
      }),
      cost_price: pricingMode === 'per_unit'
        ? (parseInt(costPerUnit) || 0)
        : (() => {
            const parentPerUnit = parentPricingMode === 'per_unit'
            const costs = priceFields.map(p => parentPerUnit ? (parseInt(costPerUnit) || 0) * (parseInt(p.key) || 0) : (parseInt(p.cost) || 0)).filter(v => v > 0)

            return costs.length > 0 ? Math.min(...costs) : 0
          })(),
      proxy_type: data.proxy_type || 'residential',
      country: data.country || '',
      api_type: 'buy_api',
      api_provider: '', // Site con không cần — SupplierService tự xử lý
      body_api: null,
      code: data.code || null,
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

    // Luôn gửi metadata — cả tạo mới và cập nhật
    if (selectedSupplierId || selectedSupplierCode) {
      // Giữ metadata cũ + merge supplier info mới
      const existingMeta = isEditMode && serviceData?.metadata
        ? (typeof serviceData.metadata === 'string' ? JSON.parse(serviceData.metadata || '{}') : serviceData.metadata)
        : {}

      submitData.metadata = {
        ...existingMeta,
        ...(selectedSupplierCode ? { supplier_product_code: selectedSupplierCode } : {}),
        ...(selectedSupplierId ? { supplier_product_id: selectedSupplierId } : {}),
        parent_pricing_mode: parentPricingMode,
        supplier_prices: pricingMode === 'per_unit'
          ? { per_unit: parseInt(costPerUnit) || 0 }
          : Object.fromEntries(priceFields.map(p => {
              const parentPerUnit = parentPricingMode === 'per_unit'
              const cost = parentPerUnit ? (parseInt(costPerUnit) || 0) * (parseInt(p.key) || 0) : (parseInt(p.cost) || 0)

              return [p.key, cost]
            })),
      }
    }

    const mutation = isEditMode ? updateMutation : createMutation

    clearNotification()

    mutation.mutate(submitData, {
      onSuccess: () => {
        showSuccess(isEditMode ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!')
      },
      onError: (error: any) => {
        const res = error?.response?.data

        // Parse validation errors → set lỗi vào từng field
        if (res?.errors && typeof res.errors === 'object') {
          console.error('Validation errors:', res.errors)
          const errorMessages: string[] = []

          Object.entries(res.errors).forEach(([field, fieldErrors]: [string, any]) => {
            const msg = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors

            setError(field as any, { type: 'server', message: msg })
            errorMessages.push(`${field}: ${msg}`)
          })

          showError('Lỗi: ' + errorMessages.join(', '))
        } else {
          showError(res?.message || 'Có lỗi xảy ra')
        }

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

  const previewPrice = pricingMode === 'per_unit' && pricePerUnit
    ? `${parseInt(pricePerUnit).toLocaleString('vi-VN')}đ/${timeUnit === 'month' ? 'tháng' : 'ngày'}`
    : priceFields.length > 0 && priceFields[0].value
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

      <FormAlert notification={notification} onClose={clearNotification} />

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
                    onChange={e => {
                      const id = Number(e.target.value)
                      const product = allSupplierProducts.find(p => p.supplier_id === id)

                      setSelectedSupplierId(id)
                      setSelectedSupplierCode(product?.supplier_code || null)
                    }}
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
                        {p.supplier_code && <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8', marginRight: 6 }}>[{p.supplier_code}]</span>}
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

              {/* Phân biệt code site mẹ vs site con */}
              {(selectedSupplierCode || (isEditMode && selectedSupplierId)) && (
                <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                  <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: '#eff6ff', border: '1px solid #bfdbfe', fontSize: 13 }}>
                    <div style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, marginBottom: 2 }}>Code site mẹ (nhà cung cấp)</div>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8' }}>
                      {selectedSupplierId ? `${selectedSupplierId}#` : ''}{selectedSupplierCode || 'chưa có'}
                    </span>
                  </div>
                  {isEditMode && (
                    <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: 13 }}>
                      <div style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, marginBottom: 2 }}>Code site con (của bạn)</div>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#15803d' }}>
                        {serviceId ? `${serviceId}#` : ''}{watchAll.code || serviceData?.code || 'chưa có'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Tên + Code site con + trạng thái */}
              <Grid2 container spacing={1.5}>
                <Grid2 size={{ xs: 5 }}>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Tên sản phẩm' placeholder='VD: Proxy IPv4 Việt Nam'
                        error={!!errors.name} helperText={errors.name?.message as string}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 4 }}>
                  <Controller
                    name='code'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Code site con'
                        placeholder='Để trống sẽ tự tạo'
                        error={!!errors.code}
                        helperText={(errors.code?.message as string) || 'Mã riêng của bạn, khác với code site mẹ'}
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 3 }}>
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

              {/* Chế độ giá — site con được chọn riêng */}
              {(selectedProduct || isEditMode) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Chế độ giá bán:</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      type='button'
                      onClick={() => {
                        setPricingMode('fixed')
                        if (pricingMode !== 'fixed' && priceFields.length === 0) {
                          setPriceFields([{ key: '1', value: '', cost: '' }, { key: '7', value: '', cost: '' }, { key: '30', value: '', cost: '' }])
                        }
                      }}
                      style={{
                        padding: '4px 12px', fontSize: '12px', fontWeight: 600, borderRadius: 6, border: '1px solid',
                        cursor: 'pointer', transition: 'all 0.15s',
                        background: pricingMode === 'fixed' ? '#1e293b' : '#fff',
                        color: pricingMode === 'fixed' ? '#fff' : '#64748b',
                        borderColor: pricingMode === 'fixed' ? '#1e293b' : '#e2e8f0',
                      }}
                    >
                      Mốc cố định
                    </button>
                    <button
                      type='button'
                      onClick={() => setPricingMode('per_unit')}
                      style={{
                        padding: '4px 12px', fontSize: '12px', fontWeight: 600, borderRadius: 6, border: '1px solid',
                        cursor: 'pointer', transition: 'all 0.15s',
                        background: pricingMode === 'per_unit' ? '#1e293b' : '#fff',
                        color: pricingMode === 'per_unit' ? '#fff' : '#64748b',
                        borderColor: pricingMode === 'per_unit' ? '#1e293b' : '#e2e8f0',
                      }}
                    >
                      Nhập tự do ({timeUnit === 'month' ? 'tháng' : 'ngày'})
                    </button>
                  </div>
                  {pricingMode !== parentPricingMode && (
                    <span style={{ fontSize: '11px', color: '#f59e0b' }}>Khác site mẹ ({parentPricingMode === 'per_unit' ? 'tự do' : 'cố định'})</span>
                  )}
                </div>
              )}

              {/* Per_unit: giá nhập + giá bán / đơn vị */}
              {pricingMode === 'per_unit' && (selectedProduct || isEditMode) && (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>
                    Giá theo {timeUnit === 'month' ? 'tháng' : 'ngày'}
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <TextField
                      size='small'
                      label={`Giá nhập/${timeUnit === 'month' ? 'tháng' : 'ngày'}`}
                      value={costPerUnit ? parseInt(costPerUnit).toLocaleString('vi-VN') : ''}
                      disabled
                      sx={{ width: 160, '& input': { fontSize: '13px' } }}
                    />
                    <TextField
                      size='small'
                      label={`Giá bán/${timeUnit === 'month' ? 'tháng' : 'ngày'}`}
                      value={pricePerUnit ? parseInt(pricePerUnit).toLocaleString('vi-VN') : ''}
                      onChange={e => setPricePerUnit(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder='Nhập giá bán'
                      error={!!pricePerUnit && parseInt(costPerUnit) > 0 && parseInt(pricePerUnit) <= parseInt(costPerUnit)}
                      sx={{ width: 160, '& input': { fontSize: '13px' } }}
                    />
                    {parseInt(pricePerUnit) > 0 && parseInt(costPerUnit) > 0 && (
                      <div style={{ fontSize: '13px', paddingTop: 8 }}>
                        <span style={{
                          fontWeight: 600,
                          color: parseInt(pricePerUnit) > parseInt(costPerUnit) ? '#22c55e' : '#ef4444'
                        }}>
                          +{(parseInt(pricePerUnit) - parseInt(costPerUnit)).toLocaleString('vi-VN')}đ
                          ({Math.round(((parseInt(pricePerUnit) - parseInt(costPerUnit)) / parseInt(costPerUnit)) * 100)}%)
                        </span>
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: 6 }}>
                    Khách hàng sẽ nhập số {timeUnit === 'month' ? 'tháng' : 'ngày'}, tổng = giá bán × số lượng.
                  </div>
                </div>
              )}

              {/* Bảng giá fixed */}
              {pricingMode === 'fixed' && priceFields.length > 0 && (() => {
                // Mẹ per_unit → giá nhập = costPerUnit × số ngày (tính realtime)
                const parentIsPerUnit = parentPricingMode === 'per_unit'
                const parentCostPerDay = parseInt(costPerUnit) || 0
                const unitLabel = timeUnit === 'month' ? 'tháng' : 'ngày'

                return (
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>
                    Bảng giá mốc cố định
                  </div>
                  {parentIsPerUnit && parentCostPerDay > 0 && (
                    <div style={{ fontSize: '11.5px', color: '#3b82f6', background: '#eff6ff', padding: '6px 10px', borderRadius: 8, marginBottom: 8 }}>
                      Site mẹ tính giá tự do: <strong>{parentCostPerDay.toLocaleString('vi-VN')}đ/{unitLabel}</strong> → Giá nhập mỗi mốc = đơn giá × số {unitLabel}
                    </div>
                  )}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr 1fr', background: '#f8fafc', padding: '8px 12px', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                      <span>Số {unitLabel}</span>
                      <span>Giá nhập{parentIsPerUnit ? ' (tự tính)' : ' (site mẹ)'}</span>
                      <span>Giá bán (của bạn)</span>
                      <span>Lợi nhuận</span>
                    </div>
                    {/* Rows */}
                    {priceFields.map((field, idx) => {
                      // Nếu mẹ per_unit → cost tính realtime, không dùng field.cost
                      const days = parseInt(field.key) || 0
                      const cost = parentIsPerUnit ? (parentCostPerDay * days) : (parseInt(field.cost) || 0)
                      const sell = parseInt(field.value) || 0
                      const profit = sell - cost
                      const profitPct = cost > 0 ? Math.round((profit / cost) * 100) : 0

                      return (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr 1fr', alignItems: 'center', padding: '8px 12px', borderBottom: idx < priceFields.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                          {/* Số ngày — editable nếu mốc mới (cost trống) hoặc mẹ per_unit */}
                          {(!field.cost && !parentIsPerUnit) ? (
                            <TextField
                              size='small'
                              value={field.key}
                              onChange={e => {
                                const raw = e.target.value.replace(/[^0-9]/g, '')

                                setPriceFields(prev => prev.map((p, i) => i === idx ? { ...p, key: raw } : p))
                              }}
                              placeholder='Ngày'
                              sx={{ '& input': { fontSize: '13px', padding: '6px 10px' }, width: 70 }}
                            />
                          ) : parentIsPerUnit ? (
                            <TextField
                              size='small'
                              value={field.key}
                              onChange={e => {
                                const raw = e.target.value.replace(/[^0-9]/g, '')

                                setPriceFields(prev => prev.map((p, i) => i === idx ? { ...p, key: raw } : p))
                              }}
                              placeholder='Nhập'
                              sx={{ '& input': { fontSize: '13px', padding: '6px 10px', fontWeight: 600 }, width: 70 }}
                            />
                          ) : (
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{getDurationLabel(field.key)}</span>
                          )}
                          {/* Giá nhập */}
                          <span style={{ fontSize: '13px', color: cost > 0 ? '#64748b' : '#cbd5e1' }}>
                            {cost > 0 ? `${cost.toLocaleString('vi-VN')}đ` : (parentIsPerUnit && days === 0 ? 'Nhập số ngày' : '—')}
                          </span>
                          {/* Giá bán */}
                          <TextField
                            size='small'
                            value={field.value ? parseInt(field.value).toLocaleString('vi-VN') : ''}
                            onChange={e => {
                              const raw = e.target.value.replace(/[^0-9]/g, '')

                              setPriceFields(prev => prev.map((p, i) => i === idx ? { ...p, value: raw } : p))
                            }}
                            placeholder='Nhập giá bán'
                            sx={{ '& input': { fontSize: '13px', padding: '6px 10px' } }}
                            error={!!field.value && cost > 0 && sell <= cost}
                          />
                          {/* Lợi nhuận */}
                          <span style={{
                            fontSize: '13px', fontWeight: 600,
                            color: profit > 0 ? '#22c55e' : profit < 0 ? '#ef4444' : '#94a3b8'
                          }}>
                            {sell > 0 && cost > 0 ? `+${profit.toLocaleString('vi-VN')}đ (${profitPct}%)` : '—'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: 6 }}>
                    {parentIsPerUnit
                      ? `Giá nhập tự tính: ${parentCostPerDay.toLocaleString('vi-VN')}đ/${unitLabel} × số ${unitLabel}. Bạn tự đặt giá bán cho từng mốc.`
                      : 'Giá nhập lấy tự động từ site mẹ. Phần chênh lệch là lợi nhuận của bạn.'
                    }
                  </div>
                  {/* Thêm/xóa mốc */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button
                      type='button'
                      onClick={() => setPriceFields(prev => [...prev, { key: '', value: '', cost: '' }])}
                      style={{ fontSize: '12px', padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#475569' }}
                    >
                      + Thêm mốc
                    </button>
                    {priceFields.length > 1 && (
                      <button
                        type='button'
                        onClick={() => setPriceFields(prev => prev.slice(0, -1))}
                        style={{ fontSize: '12px', padding: '4px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', cursor: 'pointer', color: '#ef4444' }}
                      >
                        − Xóa mốc cuối
                      </button>
                    )}
                  </div>
                </div>
                )
              })()}

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
                  <CustomTextField {...field} fullWidth select label='Quốc gia' error={!!errors.country} helperText={errors.country?.message as string}>
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
                      {(serviceId || watchAll.code) && (
                        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8', fontWeight: 400, marginTop: 2 }}>
                          {serviceId ? `${serviceId}#` : ''}{watchAll.code || serviceData?.code || ''}
                        </div>
                      )}
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
