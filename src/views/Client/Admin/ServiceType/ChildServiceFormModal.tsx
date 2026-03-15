'use client'

/**
 * Form thêm/sửa sản phẩm cho SITE CON.
 * Đơn giản hơn form site mẹ:
 * - Chọn SP từ site mẹ (dropdown)
 * - Bảng giá: giá nhập (read-only) | giá bán (editable)
 * - Tên, mô tả, tag, trạng thái
 * - KHÔNG có: provider, api_partner, body_api, code
 */

import { useState, useEffect, useMemo } from 'react'

import {
  Dialog, DialogContent, Button, TextField, MenuItem, Grid2,
  Alert, IconButton, Chip, Switch, FormControlLabel, Tooltip
} from '@mui/material'
import { X, Save, Loader2, Package, Info } from 'lucide-react'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'
import { useServiceType, useCreateServiceType, useUpdateServiceType } from '@/hooks/apis/useServiceType'
import { useSupplierProducts, type SupplierProduct } from '@/hooks/apis/useSupplierProducts'

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
      protocols: [] as string[],
      country: '',
      note: '',
      tag: '',
      is_purchasable: true,
    }
  })

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
        protocols: parsedProtocols || [],
        country: serviceData.country?.toLowerCase() || '',
        note: serviceData.note || '',
        tag: serviceData.tag || '',
        is_purchasable: serviceData.is_purchasable !== false,
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
        protocols: [], country: '', note: '', tag: '', is_purchasable: true,
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
      api_type: 'buy_api',
      api_partner: '', // Site con không cần — SupplierService tự xử lý
      body_api: null,
      code: null,
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth closeAfterTransition={false}>
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
                            value={field.value}
                            onChange={e => {
                              const val = e.target.value.replace(/[^0-9]/g, '')

                              setPriceFields(prev => prev.map((p, i) => i === idx ? { ...p, value: val } : p))
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
                    name='country'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Quốc gia' placeholder='VD: vn, us, jp' />
                    )}
                  />
                </Grid2>
              </Grid2>

              {/* Tag + mô tả */}
              <Grid2 container spacing={1.5}>
                <Grid2 size={{ xs: 6 }}>
                  <Controller
                    name='tag'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} fullWidth label='Tag' placeholder='VD: Hot, New, Cheap' helperText='Phân cách bằng dấu phẩy' />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                  <Controller
                    name='is_purchasable'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch checked={field.value} onChange={e => field.onChange(e.target.checked)} color='success' />}
                        label='Cho phép mua'
                        sx={{ mt: 1 }}
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
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
