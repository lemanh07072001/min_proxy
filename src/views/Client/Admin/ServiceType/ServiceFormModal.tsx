'use client'

import { useState, useEffect, useMemo } from 'react'

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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Typography,
  Box,
  Alert,
  Collapse,
  IconButton
} from '@mui/material'

import { toast } from 'react-toastify'
import { X, Plus, ChevronDown, AlertCircle, Eye, Shield, Wifi, Zap, Users, MapPin, RefreshCw, Clock, Info, ShoppingCart, CheckCircle, Globe, Tag } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import CustomTextField from '@/@core/components/mui/TextField'

// RichTextEditor removed — using plain textarea for note
import { TAG_CONFIG, PREDEFINED_TAGS, getTagStyle, fixCountryCode } from '@/configs/tagConfig'
import { useProviders } from '@/hooks/apis/useProviders'
import { useCountries } from '@/hooks/apis/useCountries'
import { useServiceType, useCreateServiceType, useUpdateServiceType, useServiceTypes } from '@/hooks/apis/useServiceType'
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
})

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

  // Luôn fetch chi tiết khi edit để lấy đầy đủ field (api_provider bị hidden trong list)
  const { data: fetchedData, isLoading: loadingService } = useServiceType(serviceId, isEditMode && open)
  const serviceData = fetchedData || initialData
  const { data: serviceTypes = [] } = useServiceTypes()

  // Mutations
  const createMutation = useCreateServiceType()
  const updateMutation = useUpdateServiceType(serviceId)

  // Out-of-form state
  const [multiInputFields, setMultiInputFields] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }])
  const [priceFields, setPriceFields] = useState<Array<{ key: string; value: string; cost?: string }>>([{ key: '', value: '', cost: '' }])
  const [isMultiInputModalOpen, setIsMultiInputModalOpen] = useState(false)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [techExpanded, setTechExpanded] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])

  // Derive dynamic options from existing service types
  const protocols = useMemo(() => {
    const allProtocols = new Set<string>()

    allProtocols.add('http')
    allProtocols.add('socks5')

    serviceTypes.forEach((service: any) => {
      if (service.protocols && Array.isArray(service.protocols)) {
        service.protocols.forEach((protocol: string) => {
          allProtocols.add(protocol)
        })
      }
    })

    return Array.from(allProtocols).map(protocol => ({
      value: protocol,
      label: protocol.toUpperCase()
    }))
  }, [serviceTypes])

  const COUNTRY_NAMES: Record<string, string> = {
    vi: 'Việt Nam', kr: 'Hàn Quốc', us: 'Mỹ', jp: 'Nhật Bản', sg: 'Singapore',
    th: 'Thái Lan', id: 'Indonesia', my: 'Malaysia', ph: 'Philippines', in: 'Ấn Độ',
    cn: 'Trung Quốc', tw: 'Đài Loan', hk: 'Hồng Kông', de: 'Đức', gb: 'Anh',
    fr: 'Pháp', au: 'Úc', ca: 'Canada', br: 'Brazil', ru: 'Nga',
  }



  const ipVersionOptions = useMemo(() => {
    const versions = new Set<string>()

    versions.add('ipv4')
    versions.add('ipv6')

    serviceTypes.forEach((service: any) => {
      if (service.ip_version) versions.add(service.ip_version.toLowerCase())
    })

    return Array.from(versions).map(v => ({
      value: v,
      label: v.toUpperCase()
    }))
  }, [serviceTypes])

  // Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError
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
    }
  })

  const watchedStatus = watch('status')

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
      })
    }
  }, [serviceData, isEditMode, reset])

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
      })
      setMultiInputFields([{ key: '', value: '' }])
      setPriceFields([{ key: '', value: '', cost: '' }])
      setTechExpanded(false)
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

    const submitData = {
      ...data,
      note: cleanNote,
      api_type: 'buy_api',
      multi_inputs: multiInputFields,
      price_by_duration: formattedPriceFields,
      cost_price: autoCostPrice,
    }

    const mutation = isEditMode ? updateMutation : createMutation

    mutation.mutate(submitData, {
      onSuccess: () => {
        setFormErrors([])
        toast.success(isEditMode ? 'Cập nhật dịch vụ thành công!' : 'Thêm dịch vụ thành công!')
        if (!isEditMode) onClose()
      },
      onError: (error: any) => {
        console.error('API error:', error?.response?.status, error?.response?.data || error?.message)
        const res = error?.response?.data
        const errors: string[] = []

        // Fields nằm trong Accordion "Cấu hình kỹ thuật"
        const techFields = ['provider_id', 'api_provider', 'cost_price', 'code', 'body_api']

        // Parse validation errors object từ Laravel → set lỗi trực tiếp vào field
        if (res?.errors && typeof res.errors === 'object') {
          let hasTechError = false

          Object.entries(res.errors).forEach(([field, fieldErrors]: [string, any]) => {
            const msg = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors

            // Map BE field name → FE field name
            const feField = field === 'api_body' ? 'body_api' : field

            setError(feField as any, { type: 'server', message: msg })
            errors.push(msg)
            if (techFields.includes(feField)) hasTechError = true
          })

          // Auto mở accordion nếu lỗi nằm trong đó
          if (hasTechError) setTechExpanded(true)
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

    // Auto mở accordion nếu lỗi ở tech fields
    const techFields = ['provider_id', 'api_provider', 'cost_price', 'code', 'body_api']

    if (Object.keys(validationErrors).some(f => techFields.includes(f))) setTechExpanded(true)

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

  const watchedType = watch('type')
  const watchedRotationType = watch('rotation_type')
  const watchedTag = watch('tag')

  const { data: countries } = useCountries()

  const toggleTag = (preset: string) => {
    const current = watchedTag ? watchedTag.split(',').map((t: string) => t.trim()).filter(Boolean) : []
    const updated = current.includes(preset) ? current.filter((t: string) => t !== preset) : [...current, preset]

    setValue('tag', updated.join(', '))
  }

  // Preview data
  const previewData = watch()
  const notePlaceholder = watchedType === '1' ? rotatingPlaceholder : staticPlaceholder

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth='xl' fullWidth PaperProps={{ sx: { maxHeight: '92vh' } }} sx={{ '&.MuiModal-root': { zIndex: 1200 } }}>
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

              {/* ========== Section 1: Thông tin cơ bản ========== */}
              <div style={{ background: '#fafbfc', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Info size={13} color='#3b82f6' />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Thông tin cơ bản</span>
                </div>
              <Grid2 container spacing={1}>
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

                {/* Switches — compact row */}
                <Grid2 size={{ xs: 12, sm: 4 }}>
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
              </Grid2>
              </div>

              {/* ========== Section 3: Cấu hình kỹ thuật (collapsed) ========== */}
              <Accordion
                expanded={techExpanded}
                onChange={() => setTechExpanded(!techExpanded)}
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px !important',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  mb: 2
                }}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown size={18} />}
                  sx={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    minHeight: '44px !important',
                    '& .MuiAccordionSummary-content': { margin: '8px 0 !important' }
                  }}
                >
                  <Typography variant='subtitle1' fontWeight={700} color='#475569'>
                    Cấu hình kỹ thuật
                  </Typography>
                  <Typography variant='caption' sx={{ ml: 1, color: '#94a3b8', alignSelf: 'center' }}>
                    (dành cho developer)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 1.5 }}>
                  <Grid2 container spacing={1}>
                    <Grid2 size={{ xs: 6, sm: 4 }}>
                      <Controller
                        name='provider_id'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField {...field} fullWidth select label='Nhà cung cấp' disabled={loadingProviders}>
                            <MenuItem value=''><em>{loadingProviders ? '...' : '—'}</em></MenuItem>
                            {providers?.map((provider: any) => (
                              <MenuItem key={provider.id} value={provider.id}>{provider.title || provider.name}</MenuItem>
                            ))}
                          </CustomTextField>
                        )}
                      />
                    </Grid2>

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
                      <Controller
                        name='body_api'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            rows={3}
                            fullWidth
                            multiline
                            label='Body API (JSON)'
                            error={!!errors.body_api}
                            helperText={errors.body_api?.message}
                          />
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
                      </div>
                    </Grid2>
                  </Grid2>
                </AccordionDetails>
              </Accordion>
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

              {(() => { try {
                // Helpers giống ProxyCard/PlanCard
                const convertIpVersion = (v: string) => { switch (v?.toLowerCase()) { case 'ipv4': case 'v4': return 'V4'; case 'ipv6': case 'v6': return 'V6'; default: return v || '' } }
                const convertProxyType = (t: string) => { switch (t?.toLowerCase()) { case 'residential': return 'Dân cư'; case 'datacenter': return 'Datacenter'; default: return t || '' } }
                const convertAuthType = (t: string) => { switch (t) { case 'userpass': return 'User:Pass'; case 'ip_whitelist': return 'IP Whitelist'; case 'both': return 'User:Pass + IP'; default: return t || '' } }
                const validPrices = priceFields.filter((f: any) => f.key && f.value && parseInt(f.value, 10) > 0)
                const firstPrice = validPrices.length > 0 ? parseInt(validPrices[0].value, 10) : 0
                const isAvailable = previewData.is_purchasable !== false

                // Render spec feature rows (dùng chung cả 2 loại card)
                const specFeatureRows = [
                  previewData.auth_type && { label: 'Xác thực', value: convertAuthType(previewData.auth_type), icon: Shield, color: 'var(--primary-hover, #f97316)' },
                  previewData.bandwidth && { label: 'Băng thông', value: previewData.bandwidth === 'unlimited' ? 'Không giới hạn' : previewData.bandwidth, icon: Wifi, color: '#3b82f6' },
                  watchedType === '1' && previewData.rotation_type && { label: 'Kiểu xoay', value: previewData.rotation_type === 'per_request' ? 'Per request' : previewData.rotation_type === 'sticky' ? 'Sticky session' : previewData.rotation_type === 'time_based' ? 'Time-based' : previewData.rotation_type, icon: RefreshCw, color: '#8b5cf6' },
                  watchedType === '1' && previewData.rotation_interval && { label: 'Thời gian xoay IP', value: previewData.rotation_interval, icon: Clock, color: '#f59e0b' },
                  watchedType === '1' && previewData.pool_size && { label: 'Pool size', value: previewData.pool_size, icon: Globe, color: '#06b6d4' },
                  previewData.request_limit && { label: 'Giới hạn request', value: previewData.request_limit, icon: Zap, color: '#22c55e' },
                  previewData.concurrent_connections && { label: 'Kết nối đồng thời', value: previewData.concurrent_connections, icon: Users, color: '#ef4444' },
                ].filter(Boolean)

                const hasSpecs = specFeatureRows.length > 0

                // Render tags
                const tagElements = previewData.tag ? previewData.tag.split(',').map((t: string) => t.trim()).filter(Boolean) : []

                const visibleTagEls = tagElements.filter((tag: string) => { const cfg = getTagStyle(tag);

 

return !(cfg && 'hidden' in cfg && cfg.hidden) })

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

                // Note preview (đoạn text ngắn dưới title — giống ProxyCard/PlanCard)
                const renderNotePreview = () => {
                  if (!previewData.note || previewData.note === '<p></p>') return null
                  const text = previewData.note.replace(/<[^>]+>/g, '').trim()

                  if (!text) return null
                  const preview = text.length > 80 ? text.substring(0, 80) + '...' : text

                  
return <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px', lineHeight: 1.4 }}>{preview}</p>
                }

                // Render footer — price left + button right
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

                return (
                  <div style={{
                    background: 'white', borderRadius: '12px', padding: '16px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0',
                    position: 'relative', overflow: 'visible', display: 'flex', flexDirection: 'column',
                    ...((!isAvailable) ? { opacity: 0.7 } : {})
                  }}>
                    {/* Top color bar */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: watchedType === '1' ? 'linear-gradient(90deg, #3b82f6, #60a5fa)' : 'var(--primary-gradient, linear-gradient(90deg, #e53e3e, #ff6b6b))', borderRadius: '12px 12px 0 0' }} />

                    {watchedType === '1' ? (

                      /* ===== ROTATING — giống PlanCard ===== */
                      <>
                        {/* Header: title + tags */}
                        <div style={{ marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9', paddingTop: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: 0, textAlign: 'left', flex: 1 }}>{previewData.name || 'Tên sản phẩm'} <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>{serviceId ? `${serviceId}#` : ''}{previewData.code || ''}</span></h3>
                            {renderInlineTags()}
                          </div>
                        </div>

                        {/* Note preview */}
                        {renderNotePreview()}

                        {/* Feature rows — giống plan-features trong PlanCard */}
                        <div style={{ marginBottom: '4px', flex: 1 }}>
                          {/* IP info row */}
                          {(previewData.ip_version || previewData.country) && (
                            <div className='feature-row'>
                              <div className='feature-icons'><MapPin size={16} color='#6366f1' /></div>
                              <div className='feature-content'>
                                <span className='feature-label'>Loại IP:</span>
                                <span className='feature-value' style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Rotating {convertIpVersion(previewData.ip_version || '')} — {previewData.country && <img src={`https://flagcdn.com/w40/${fixCountryCode(previewData.country)}.png`} alt='' style={{ width: 18, height: 13, objectFit: 'cover', borderRadius: 2 }} />}{COUNTRY_NAMES[previewData.country] || previewData.country || 'N/A'}</span>
                              </div>
                            </div>
                          )}
                          {/* Protocol static row */}
                          {Array.isArray(previewData.protocols) && previewData.protocols.length > 0 && (
                            <div className='feature-row'>
                              <div className='feature-icons'><Shield size={16} color='var(--primary-hover, #f97316)' /></div>
                              <div className='feature-content'>
                                <span className='feature-label'>Hỗ trợ:</span>
                                <span className='feature-value'>{previewData.protocols.map((p: string) => p.toUpperCase()).join('/')}</span>
                              </div>
                            </div>
                          )}
                          {/* Spec feature rows — giống StaticFeatureRow */}
                          {specFeatureRows.map((spec: any, i: number) => (
                            <div key={`spec-${i}`} className='feature-row'>
                              <div className='feature-icons'>
                                <spec.icon size={16} color={spec.color} />
                              </div>
                              <div className='feature-content'>
                                <span className='feature-label'>{spec.label}:</span>
                                <span className='feature-value'>{spec.value}</span>
                              </div>
                            </div>
                          ))}
                          {/* Multi_inputs feature rows — giống StaticFeatureRow */}
                          {(() => {
                            const featureColors = ['var(--primary-hover, #f97316)', '#3b82f6', '#22c55e', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444']

                            
return multiInputFields.filter((f: any) => f.key && f.value).map((input: any, i: number) => (
                              <div key={i} className='feature-row'>
                                <div className='feature-icons'>
                                  <CheckCircle size={16} color={featureColors[i % featureColors.length]} />
                                </div>
                                <div className='feature-content'>
                                  <span className='feature-label'>{input.key}:</span>
                                  <span className='feature-value'>{input.value}</span>
                                </div>
                              </div>
                            ))
                          })()}
                        </div>

                        {renderFooter()}
                      </>
                    ) : (

                      /* ===== STATIC — giống ProxyCard ===== */
                      <>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '4px' }}>
                          {/* Header: title + tags */}
                          <div style={{ marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: 0, flex: 1 }}>{previewData.name || 'Tên sản phẩm'} <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>{serviceId ? `${serviceId}#` : ''}{previewData.code || ''}</span></h3>
                              {renderInlineTags()}
                            </div>
                          </div>

                          {/* Note preview */}
                          {renderNotePreview()}

                          {/* Product info as feature rows — giống ProxyCard */}
                          <div style={{ marginBottom: '8px' }}>
                            {(previewData.ip_version || previewData.country) && (
                              <div className='feature-row'>
                                <div className='feature-icons'><MapPin size={16} color='#6366f1' /></div>
                                <div className='feature-content'>
                                  <span className='feature-label'>Loại IP:</span>
                                  <span className='feature-value' style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Static {convertIpVersion(previewData.ip_version || '')} — {previewData.country && <img src={`https://flagcdn.com/w40/${fixCountryCode(previewData.country)}.png`} alt='' style={{ width: 18, height: 13, objectFit: 'cover', borderRadius: 2 }} />}{COUNTRY_NAMES[previewData.country] || previewData.country || 'N/A'}</span>
                                </div>
                              </div>
                            )}
                            {/* Protocol static row */}
                            {Array.isArray(previewData.protocols) && previewData.protocols.length > 0 && (
                              <div className='feature-row'>
                                <div className='feature-icons'><Shield size={16} color='var(--primary-hover, #f97316)' /></div>
                                <div className='feature-content'>
                                  <span className='feature-label'>Hỗ trợ:</span>
                                  <span className='feature-value'>{previewData.protocols.map((p: string) => p.toUpperCase()).join('/')}</span>
                                </div>
                              </div>
                            )}
                            {specFeatureRows.map((spec: any, i: number) => (
                              <div key={`spec-${i}`} className='feature-row'>
                                <div className='feature-icons'>
                                  <spec.icon size={16} color={spec.color} />
                                </div>
                                <div className='feature-content'>
                                  <span className='feature-label'>{spec.label}:</span>
                                  <span className='feature-value'>{spec.value}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {renderFooter()}
                      </>
                    )}
                  </div>
                )
              } catch (e) { return <div style={{ padding: '16px', color: '#ef4444', fontSize: '12px' }}>Preview error: {String(e)}</div> } })()}

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
