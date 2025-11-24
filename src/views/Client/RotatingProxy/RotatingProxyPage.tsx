'use client'

import React, { useState, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { useTranslation } from 'react-i18next'

import { useForm, Controller, useWatch } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { CheckCircle, ShoppingCart, User, Loader, Search, Shield, Clock } from 'lucide-react'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useSession } from 'next-auth/react'

import axios from 'axios'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { useDispatch, useSelector } from 'react-redux'

import ConfirmDialog from '@components/confirm-modal/ConfirmDialog'

import { useModalContext } from '@/app/contexts/ModalContext'

import { Box, Grid2, Typography, CircularProgress, TextField, InputAdornment } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import { subtractBalance } from '@/store/userSlice'
import type { AppDispatch } from '@/store'
import { useCountries } from '@/hooks/apis/useCountries'
import './styles.css'

// Định nghĩa schema validation chung cho các gói proxy.
const proxyPlanSchema = yup.object({
  quantity: yup
    .number()
    .typeError('Vui lòng nhập số')
    .required('Vui lòng nhập số lượng')
    .integer('Số lượng phải là số nguyên')
    .min(1, 'Tối thiểu là 1')
    .max(100, 'Tối đa là 100'),
  time: yup.string().required('Vui lòng chọn thời gian'),
  protocol: yup.string().optional().oneOf(['http', 'socks5', undefined], 'Giao thức không hợp lệ')
})

// Component này render một dòng feature có select (dropdown)
const SelectFeatureRow = ({ feature, control, planId }) => (
  <>
    <Controller
      name={feature.field}
      control={control}
      render={({ field }) => (
        <div className='feature-row'>
          <div className='feature-icons'>
            <CheckCircle size={16} className='text-green-500' />
          </div>

          <div className='feature-content '>
            <label className={`feature-label `} htmlFor={`${planId}-${feature.label}`}>
              {feature.label}:
            </label>
            <CustomTextField
              select
              size='small'
              id={`${planId}-${field.name}`}
              value={field.value || ''}
              onChange={e => field.onChange(e.target.value)}
            >
              {feature.options?.map((opt: any) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </CustomTextField>
          </div>
        </div>
      )}
    />
  </>
)

// Component này render một dòng feature tĩnh (chỉ hiển thị thông tin)
const StaticFeatureRow = ({ feature }) => {
  // Nếu có icon custom từ data thì dùng, không thì dùng CheckCircle mặc định
  const IconComponent = feature.icon || CheckCircle

  return (
    <div className='feature-row'>
      <div className='feature-icons'>
        {typeof IconComponent === 'string' ? (
          <span dangerouslySetInnerHTML={{ __html: IconComponent }} />
        ) : (
          <IconComponent size={16} className='text-green-500' />
        )}
      </div>
      <div className='feature-content'>
        <span className='feature-label'>{feature.label}:</span>
        {feature.value && <span className='feature-value'>{feature.value}</span>}
      </div>
    </div>
  )
}

// Component này render một dòng feature có input
const InputFeatureRow = ({ feature, control, errors, planId, isDisabled = false, min = 1, max = 100 }) => (
  <Controller
    name={feature.field}
    control={control}
    render={({ field }) => (
      <div>
        <div className='feature-row'>
          <div className='feature-icons'>
            <CheckCircle size={16} className={`text-green-500 ${errors[feature.field] ? 'text-red-500' : ''}`} />
          </div>
          <div className='feature-content'>
            <label
              className={`feature-label ${errors[feature.field] ? 'text-red-500' : ''}`}
              htmlFor={`${planId}-${field.name}`}
            >
              {feature.label}:
            </label>
            <CustomTextField
              size='small'
              id={`${planId}-${field.name}`}
              type={feature.inputType || 'text'}
              inputProps={feature.inputType === 'number' ? { min: feature.min ?? 1, max: feature.max ?? 100 } : {}}
              {...field}
              disabled={isDisabled}
              error={!!errors[feature.field]}
              helperText={errors[feature.field]?.message}
            />
          </div>
        </div>
        {errors[feature.field] && <span className='text-red-500 text-sm'>{errors[feature.field].message}</span>}
      </div>
    )}
  />
)

// Component này render một dòng feature có switch (checkbox)
const SwitchFeatureRow = ({ feature, control, planId }) => (
  <Controller
    name={feature.field}
    control={control}
    render={({ field }) => (
      <div className='feature-row'>
        <div className='feature-icons'>
          <CheckCircle size={16} className='text-green-500' />
        </div>
        <div className='feature-content'>
          <label className='feature-label' htmlFor={`${planId}-${field.name}`}>
            {feature.label}:
          </label>
          <Switch
            id={`${planId}-${field.name}`}
            color='error'
            checked={field.value || false}
            onChange={e => field.onChange(e.target.checked)}
          />
        </div>
      </div>
    )}
  />
)

// Component này render radio buttons cho thời gian sử dụng và giao thức
const RadioFeatureRow = ({ feature, control, planId }) => {
  const getDurationLabel = (key: string) => {
    const days = parseInt(key)
    if (days === 1) return 'Ngày'
    if (days === 7) return 'Tuần'
    if (days === 30) return 'Tháng'
    return `${days} ngày`
  }

  return (
    <Controller
      name={feature.field}
      control={control}
      render={({ field }) => (
        <div>
          <div className='feature-row'>
            <div className='feature-content' style={{ display: 'block', width: '100%' }}>
              <div className='flex align-start' style={{ alignItems: 'center', marginBottom: '8px', gap: '12px' }}>
                <div className='feature-icons'>
                  <CheckCircle size={16} className='text-green-500' />
                </div>
                <label className='feature-label'>{feature.label}:</label>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                {feature.options?.map((item: any, index: number) => {
                  const discount = item.discount ? parseInt(item.discount) : 0
                  // Hiển thị label: nếu là time thì dùng getDurationLabel, nếu là protocol thì dùng item.label
                  const displayLabel = feature.field === 'time' ? getDurationLabel(item.key) : item.label

                  return (
                    <label
                      key={item.key}
                      htmlFor={`${planId}-${feature.field}-${item.key}`}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        border:
                          field.value === item.key ? '2px solid var(--mui-palette-primary-main)' : '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: field.value === item.key ? 'var(--mui-palette-primary-lightOpacity)' : 'white',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type='radio'
                        id={`${planId}-${feature.field}-${item.key}`}
                        value={item.key}
                        checked={field.value === item.key}
                        onChange={field.onChange}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>{displayLabel}</span>
                      {discount > 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                          }}
                        >
                          -{discount}%
                        </span>
                      )}
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    />
  )
}

// --- CUSTOM HOOK FOR API CALL ---
const useBuyProxy = () => {
  const queryClient = useQueryClient()
  const session = useSession()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: orderData => {
      const token = session.data.access_token

      const api = axios.create({
        baseURL: '/api',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      return api.post('/buy-proxy', orderData)
    },
    onSuccess: async (data, variables) => {
      // Xử lý khi request thành công
      if (data.data.success == false) {
        toast.error('Lỗi hệ thông xin vui lòng liên hệ Admin.  ')
      } else {
        const total = variables.total

        dispatch(subtractBalance(total))
        toast.success(data.data.message)

        router.push('/history-order')

        // Invalidate và refetch query sau khi đã chuyển tab (không cần await)
        queryClient.invalidateQueries({ queryKey: ['proxyData'] })
        queryClient.refetchQueries({ queryKey: ['proxyData'] })
      }
    },
    onError: error => {
      toast.error(error.response?.data.message || 'Lỗi không xác định')

      console.error('Lỗi khi mua proxy:', error.response?.data.messqge || error.message)
    }
  })

  return mutation
}

// Component chính cho mỗi thẻ plan, giờ đây gọn gàng hơn.
const PlanCard = ({ plan }) => {
  const { mutate, isPending, isError, isSuccess, error } = useBuyProxy()
  const [openConfirm, setOpenConfirm] = useState(false)
  const [formData, setFormData] = useState()
  const { openAuthModal } = useModalContext()
  const session = useSession()

  // Tìm feature time để lấy defaultValue
  const timeFeature = plan.features.find((f: any) => f.field === 'time')
  const defaultTime = timeFeature?.options?.length > 0 ? timeFeature.options[0].key : '1'

  // Xử lý protocols từ mảng ['http', 'socks5'] sang options format
  const hasProtocol = !!plan.protocols && plan.protocols.length > 0
  const defaultProtocol = hasProtocol ? plan.protocols[0] : 'http'

  // Tạo protocol options từ mảng protocols
  const protocolOptions = hasProtocol
    ? plan.protocols.map((protocol: string) => ({
        key: protocol,
        label: protocol.toUpperCase()
      }))
    : []

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      quantity: 1,
      time: defaultTime,
      ...(hasProtocol && { protocol: defaultProtocol })
    },
    mode: 'onChange',
    resolver: yupResolver(proxyPlanSchema)
  })

  const watchedFields = useWatch({ control })

  const calculateTotalFormat = () => {
    const quantityValue = parseInt(watchedFields.quantity, 10) || 1
    const selectedTime = watchedFields.time

    if (quantityValue < 1) return 0

    // Tìm giá từ price_by_duration dựa theo time được chọn
    const timeFeature = plan.features.find((f: any) => f.field === 'time')
    const selectedOption = timeFeature?.options?.find((opt: any) => opt.key === selectedTime)
    const priceForTime = selectedOption?.value ? parseInt(selectedOption.value, 10) : 0

    return (priceForTime * quantityValue).toLocaleString('vi-VN')
  }

  const calculateTotal = () => {
    const quantityValue = parseInt(watchedFields.quantity, 10) || 1
    const selectedTime = watchedFields.time

    if (quantityValue < 1) return 0

    // Tìm giá từ price_by_duration dựa theo time được chọn
    const timeFeature = plan.features.find((f: any) => f.field === 'time')
    const selectedOption = timeFeature?.options?.find((opt: any) => opt.key === selectedTime)
    const priceForTime = selectedOption?.value ? parseInt(selectedOption.value, 10) : 0

    return priceForTime * quantityValue
  }

  const onSubmit = async (data: any) => {
    const total = calculateTotal()

    const orderData = {
      serviceTypeId: plan.id,
      ...data,
      total
    }

    setFormData(orderData)
    setOpenConfirm(true)
  }

  const handleConfirmBuy = () => {
    try {
      if (formData) {
        mutate(formData) // Gọi API với dữ liệu đã lưu
        setOpenConfirm(false) // Đóng dialog
        setFormData(null) // Xóa dữ liệu đã lưu
      }
    } catch (error) {
      if (error.response) {
        console.error('Lỗi từ server:', error.response.data)
      } else {
        console.error('Lỗi khác:', error.message)
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={`proxy-plan-card ${plan.color}`}>
        <div className='plan-header'>
          <h3 className='plan-title'>{plan.title}</h3>
        </div>
        <div className='plan-features'>
          {plan.features
            .filter((feature: any) => feature.field !== 'protocol') // Loại bỏ protocol từ features để tránh trùng lặp
            .map((feature, index) => {
              // Dựa vào `feature.status` để render component con phù hợp
              switch (feature.status) {
                case 'success':
                  return <StaticFeatureRow key={index} feature={feature} />
                case 'input':
                  const isRotationTimeInput = feature.field === 'rotationTime'

                  return (
                    <InputFeatureRow
                      key={index}
                      feature={feature}
                      control={control}
                      errors={errors}
                      planId={plan.id}
                      min={plan.min}
                      max={plan.max}
                      isDisabled={isRotationTimeInput && !watchedFields.autoRotate}
                    />
                  )
                case 'checkbox':
                  return <SwitchFeatureRow key={index} feature={feature} control={control} planId={plan.id} />
                case 'select':
                  return <SelectFeatureRow key={index} feature={feature} control={control} planId={plan.id} />
                case 'radio':
                  return <RadioFeatureRow key={index} feature={feature} control={control} planId={plan.id} />
                default:
                  return null
              }
            })}

          {/* Render protocol options nếu có protocols từ server */}
          {hasProtocol && protocolOptions.length > 0 && (
            <RadioFeatureRow
              feature={{
                field: 'protocol',
                label: 'Giao thức',
                options: protocolOptions
              }}
              control={control}
              planId={plan.id}
            />
          )}
        </div>

        <div className='plan-footer'>
          <div className='plan-price'>
            <span className='price-label'>Thành tiền:</span>
            <span className='price-amount'>{calculateTotalFormat()}đ</span>
          </div>
          {session.status === 'authenticated' ? (
            <button type='submit' className='buy-button' disabled={isPending}>
              {isPending ? (
                <>
                  <Loader size={18} className='mr-2 animate-pulse' /> Đang xử lý...
                </>
              ) : (
                <>
                  <ShoppingCart size={18} className='mr-2' /> Mua Proxy
                </>
              )}
            </button>
          ) : (
            <button type='button' className='buy-button' onClick={() => openAuthModal('login')}>
              <User size={18} className='mr-2' /> Đăng nhập
            </button>
          )}
        </div>
      </form>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmBuy}
        title='Xác nhận mua Proxy'
        confirmText='Xác nhận'
        cancelText='Hủy'
      >
        Bạn có chắc chắn muốn mua gói proxy này không?
      </ConfirmDialog>
    </>
  )
}

interface RotatingProxyPageProps {
  data: any
}

export default function RotatingProxyPage({ data }: RotatingProxyPageProps) {
  const [searchCountry, setSearchCountry] = useState('')
  const [selectedVersion, setSelectedVersion] = useState('')
  const [selectedProxyType, setSelectedProxyType] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')

  const { data: countries, isLoading: isLoadingCountries } = useCountries()

  // Lọc danh sách quốc gia theo search (tìm theo code - case sensitive)
  const filteredCountries = useMemo(
    () => countries?.filter((country: any) => (country.code || '').includes(searchCountry)),
    [countries, searchCountry]
  )

  // Lọc danh sách plan theo các filter
  const filteredProviders = useMemo(
    () =>
      data?.filter((plan: any) => {
        // Filter theo version (case insensitive)
        if (selectedVersion && plan.ip_version?.toLowerCase() !== selectedVersion.toLowerCase()) {
          return false
        }

        // Filter theo proxy type (case sensitive)
        if (selectedProxyType && plan.proxy_type !== selectedProxyType) {
          return false
        }

        // Filter theo country (case sensitive)
        if (selectedCountry && plan.country_code !== selectedCountry && plan.country !== selectedCountry) {
          return false
        }

        return true
      }),
    [data, selectedVersion, selectedProxyType, selectedCountry]
  )

  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 4, lg: 2 }}>
          <div style={{ position: 'sticky', top: '80px' }} className='proxy-card-column '>
            <Box className='flex gap-3 flex-col'>
              <Box>
                <Typography variant='subtitle1' fontWeight='medium' mb={1}>
                  Version
                </Typography>
                <RadioGroup
                  key='version-radio-group'
                  aria-label='version'
                  name='version'
                  value={selectedVersion}
                  onChange={e => setSelectedVersion(e.target.value)}
                >
                  <FormControlLabel value='' control={<Radio />} label='Tất cả' />
                  <FormControlLabel value='ipv4' control={<Radio />} label='V4' />
                  <FormControlLabel value='ipv6' control={<Radio />} label='V6' />
                </RadioGroup>
              </Box>

              <Box>
                <Typography variant='subtitle1' fontWeight='medium' mb={1}>
                  Loại proxy
                </Typography>
                <RadioGroup
                  key='proxy-type-radio-group'
                  aria-label='proxy-type'
                  name='proxy-type'
                  value={selectedProxyType}
                  onChange={e => setSelectedProxyType(e.target.value)}
                >
                  <FormControlLabel value='' control={<Radio />} label='Tất cả' />
                  <FormControlLabel value='datacenter' control={<Radio />} label='Datacenter' />
                  <FormControlLabel value='residential' control={<Radio />} label='Residential' />
                </RadioGroup>
              </Box>

              <Box>
                <Typography variant='subtitle1' fontWeight='medium' mb={1}>
                  Quốc gia
                </Typography>

                {/* Search input */}
                <TextField
                  fullWidth
                  size='small'
                  placeholder='Tìm kiếm quốc gia...'
                  value={searchCountry}
                  onChange={e => setSearchCountry(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Search size={18} />
                      </InputAdornment>
                    )
                  }}
                />

                <Box sx={{ maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
                  {isLoadingCountries ? (
                    <Box display='flex' justifyContent='center' p={2}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <RadioGroup
                      key='countries-radio-group'
                      aria-label='countries'
                      name='countries'
                      value={selectedCountry}
                      onChange={e => setSelectedCountry(e.target.value)}
                    >
                      <FormControlLabel value='' control={<Radio />} label='Tất cả' />
                      {filteredCountries?.length > 0 ? (
                        filteredCountries.map((country: any) => (
                          <FormControlLabel
                            key={country.code || country.id}
                            value={country.code || country.id}
                            control={<Radio />}
                            label={country.name || country.label}
                          />
                        ))
                      ) : (
                        <Typography variant='body2' color='text.secondary' sx={{ p: 2, textAlign: 'center' }}>
                          Không tìm thấy quốc gia nào
                        </Typography>
                      )}
                    </RadioGroup>
                  )}
                </Box>
              </Box>
            </Box>
          </div>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 8, lg: 10 }}>
          <Grid2 container spacing={2}>
            {filteredProviders?.length > 0 ? (
              filteredProviders.map((plan: any, index: any) => (
                <Grid2 key={plan.id || index} size={{ xs: 12, md: 12, lg: 4 }}>
                  <PlanCard plan={plan} />
                </Grid2>
              ))
            ) : (
              <Grid2 size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '300px',
                    p: 4
                  }}
                >
                  <Typography variant='h6' color='text.secondary' gutterBottom>
                    Không tìm thấy gói proxy phù hợp
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Vui lòng thử thay đổi bộ lọc để xem thêm các gói khác
                  </Typography>
                </Box>
              </Grid2>
            )}
          </Grid2>
        </Grid2>
      </Grid2>
    </>
  )
}
