'use client'

import { useState, useEffect } from 'react'

import { useRouter, useParams } from 'next/navigation'
import Divider from '@mui/material/Divider'
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  FormControlLabel,
  Switch,
  Grid2,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress
} from '@mui/material'

import { toast } from 'react-toastify'

import { ArrowLeft, Plus, X } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import CustomTextField from '@/@core/components/mui/TextField'
import { usePartners } from '@/hooks/apis/usePartners'
import { useServiceType, useUpdateServiceType } from '@/hooks/apis/useServiceType'
import MultiInputModal from '@/views/Client/Admin/ServiceType/MultiInputModal'
import PriceByDurationModal from '@/views/Client/Admin/ServiceType/PriceByDurationModal'

// Yup validation schema (same as CreateServicePage)
const schema = yup.object({
  name: yup
    .string()
    .nullable()
    .transform(value => (value ? value.trim() : value))
    .required('Tên dịch vụ là bắt buộc')
    .min(1, 'Tên dịch vụ là bắt buộc'),
  api_partner: yup
    .string()
    .nullable()
    .transform(value => (value ? value.trim() : value))
    .required('Api Partner là bắt buộc')
    .min(1, 'Api Partner là bắt buộc'),
  cost_price: yup
    .number()
    .nullable()
    .typeError('Giá vốn phải là số')
    .required('Giá vốn là bắt buộc')
    .positive('Giá vốn phải lớn hơn 0'),
  price: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value
    })
    .typeError('Giá bán phải là số')
    .required('Giá bán là bắt buộc')
    .positive('Giá bán phải lớn hơn 0')
    .min(0.01, 'Giá bán phải lớn hơn 0')
    .test('min-price', 'Giá bán phải lớn hơn hoặc bằng giá vốn', function (value) {
      const { cost_price } = this.parent
      if (!cost_price) return true
      return value >= cost_price
    }),
  discount_price: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value
    })
    .typeError('Giá giảm phải là số')
    .positive('Giá giảm phải lớn hơn 0')
    .test('max-discount', 'Giá giảm phải nhỏ hơn giá bán', function (value) {
      if (!value) return true
      const { price } = this.parent
      if (!price) return true
      return value < price
    }),
  code: yup
    .string()
    .nullable()
    .transform(value => (value ? value.trim() : value)),
  status: yup.string().nullable().required('Trạng thái là bắt buộc'),
  partner_id: yup.string().nullable().required('Đối tác là bắt buộc'),
  type: yup.string().nullable().required('Loại dịch vụ là bắt buộc'),
  ip_version: yup.string().nullable().required('IP Version là bắt buộc'),
  protocols: yup
    .array()
    .nullable()
    .of(yup.string())
    .min(1, 'Vui lòng chọn ít nhất một giao thức')
    .required('Proxy type là bắt buộc')
    .default([]),
  body_api: yup
    .string()
    .nullable()
    .transform(value => (value ? value.trim() : value))
    .required('Body Api là bắt buộc')
    .min(1, 'Body Api là bắt buộc')
    .test('is-valid-json', 'Body Api phải là JSON hợp lệ', function (value) {
      if (!value) return true
      try {
        JSON.parse(value)
        return true
      } catch (error) {
        return false
      }
    }),
  display_time: yup.string().nullable().required('Thời gian hiển thị là bắt buộc'),
  proxy_type: yup.string().nullable().required('Proxy type là bắt buộc'),
  country: yup.string().nullable().required('Quốc gia là bắt buộc')
})

interface EditServicePageProps {
  serviceId: string
}

export default function EditServicePage({ serviceId }: EditServicePageProps) {
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params

  // Fetch partners data
  const { data: partners = [], isLoading: loadingPartners } = usePartners()

  // React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    register,
    reset
  } = useForm({
    resolver: async (data, context, options) => {
      try {
        const values = await schema.validate(data, { abortEarly: false })
        return { values, errors: {} }
      } catch (err: any) {
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
      api_partner: '',
      cost_price: undefined,
      price: undefined,
      discount_price: undefined,
      code: '',
      status: 'active',
      partner_id: '',
      type: '0',
      ip_version: 'ipv4',
      protocols: [],
      body_api: '',
      display_time: '',
      proxy_type: '',
      country: ''
    }
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [descriptionForm, setDescriptionForm] = useState({
    key: '',
    value: ''
  })

  const [isMultiInputModalOpen, setIsMultiInputModalOpen] = useState(false)
  const [multiInputFields, setMultiInputFields] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' }
  ])
  const [dateMappingOptions, setDateMappingOptions] = useState<Array<{ key: string; label: string }>>([])

  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [priceFields, setPriceFields] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' }
  ])

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

  const countries = ['Việt Nam']
  const protocols = [
    { value: 'http', label: 'HTTP' },
    { value: 'socks5', label: 'SOCKS5' }
  ]

  // Fallback time options nếu không có date_mapping
  const defaultTimeOptions = [
    { key: '1', label: 'Ngày', value: 1 },
    { key: '7', label: 'Tuần', value: 7 },
    { key: '30', label: 'Tháng', value: 30 },
    { key: '90', label: '3 Tháng', value: 90 },
    { key: '180', label: '6 Tháng', value: 180 },
    { key: '360', label: '1 Năm', value: 360 }
  ]

  // Fetch service data
  const { data: serviceData, isLoading } = useServiceType(serviceId)

  // Load data vào form khi fetch xong
  useEffect(() => {
    if (serviceData) {
      // Convert api_body từ object sang string JSON để hiển thị trong textarea
      let bodyApiString = ''
      if (serviceData.api_body) {
        try {
          bodyApiString =
            typeof serviceData.api_body === 'string'
              ? serviceData.api_body
              : JSON.stringify(serviceData.api_body, null, 2)
        } catch (error) {
          console.error('Error parsing api_body:', error)
          bodyApiString = ''
        }
      }

      // Load multi_inputs từ API
      if (serviceData.multi_inputs && Array.isArray(serviceData.multi_inputs)) {
        setMultiInputFields(serviceData.multi_inputs.length > 0 ? serviceData.multi_inputs : [{ key: '', value: '' }])
      }

      // Load price_by_duration từ API
      if (serviceData.price_by_duration && Array.isArray(serviceData.price_by_duration)) {
        setPriceFields(serviceData.price_by_duration.length > 0 ? serviceData.price_by_duration : [{ key: '', value: '' }])
      }

      reset({
        name: serviceData.name || '',
        api_partner: serviceData.api_partner || '',
        cost_price: serviceData.cost_price || undefined,
        price: serviceData.price || undefined,
        discount_price: serviceData.discount_price || undefined,
        code: serviceData.code || '',
        status: serviceData.status || 'active',
        partner_id: serviceData.partner_id || '',
        type: serviceData.type || '0',
        ip_version: serviceData.ip_version || 'ipv4',
        protocols: serviceData.protocols || [],
        body_api: bodyApiString,
        display_time: serviceData.time_type || '',
        proxy_type: serviceData.proxy_type || '',
        country: serviceData.country || ''
      })
    }
  }, [serviceData, reset])

  const updateMutation = useUpdateServiceType(serviceId)

  // Custom handlers cho mutation
  const handleUpdateSuccess = () => {
    toast.success('Cập nhật dịch vụ thành công!')
    router.push(`/${locale}/admin/service-type`)
  }

  const handleUpdateError = (error: any) => {
    toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
  }

  const onSubmit = (data: any) => {
    const submitData = {
      ...data,
      api_type: 'buy_api',
      multi_inputs: multiInputFields,
      price_by_duration: priceFields
    }

    updateMutation.mutate(submitData, {
      onSuccess: handleUpdateSuccess,
      onError: handleUpdateError
    })
  }

  const onError = (errors: any) => {
    const errorMessages = Object.values(errors)
      .map((error: any) => error?.message)
      .filter(Boolean)

    if (errorMessages.length > 0) {
      toast.error(errorMessages[0] as string)
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setDescriptionForm({ key: '', value: '' })
  }

  const handleAddDescription = () => {
    if (!descriptionForm.key || !descriptionForm.value) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    handleCloseModal()
    toast.success('Thêm mô tả thành công!')
  }

  const handleRemoveDescription = (index: number) => {
    toast.success('Xóa mô tả thành công!')
  }

  // Multi Input Modal handlers
  const handleOpenMultiInputModal = () => {
    setIsMultiInputModalOpen(true)
  }

  const handleCloseMultiInputModal = () => {
    setIsMultiInputModalOpen(false)
  }

  const handleSaveMultiInputs = (fields: Array<{ key: string; value: string }>) => {
    console.log('Multi Input Fields:', fields)
    toast.success(`Đã lưu ${fields.length} trường thành công!`)
    handleCloseMultiInputModal()
  }

  // Price Modal handlers
  const handleOpenPriceModal = () => {
    setIsPriceModalOpen(true)
  }

  const handleClosePriceModal = () => {
    setIsPriceModalOpen(false)
  }

  const handleSavePrices = (fields: Array<{ key: string; value: string }>) => {
    setPriceFields(fields)
    console.log('Price Fields:', fields)
    toast.success('Đã lưu giá thành công!')
    handleClosePriceModal()
  }

  return (
    <Card className='orders-content'>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Box>
            <h2 className='text-xl font-semibold text-slate-900 mb-4'>Thông tin cơ bản</h2>
            <Grid2 container spacing={3} className='pb-6 border-b border-slate-200'>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      required
                      size='medium'
                      fullWidth
                      label='Tên dịch vụ'
                      placeholder='Nhập tên dịch vụ'
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='api_partner'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      size='medium'
                      required
                      {...field}
                      fullWidth
                      label='Api Partner'
                      placeholder='Placeholder'
                      error={!!errors.api_partner}
                      helperText={errors.api_partner?.message}
                    />
                  )}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='cost_price'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      value={field.value}
                      onChange={e => {
                        const value = e.target.value === '' ? null : Number(e.target.value)
                        field.onChange(value)
                      }}
                      size='medium'
                      fullWidth
                      type='number'
                      label='Giá nhập'
                      placeholder='Nhập giá nhập'
                      required
                      error={!!errors.cost_price}
                      helperText={errors.cost_price?.message}
                    />
                  )}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='price'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      value={field.value}
                      onChange={e => {
                        const value = e.target.value === '' ? undefined : Number(e.target.value)
                        field.onChange(value)
                      }}
                      size='medium'
                      fullWidth
                      type='number'
                      label='Giá bán'
                      placeholder='Nhập giá bán'
                      required
                      error={!!errors.price}
                      helperText={errors.price?.message}
                    />
                  )}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='discount_price'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      value={field.value}
                      onChange={e => {
                        const value = e.target.value === '' ? null : Number(e.target.value)
                        field.onChange(value)
                      }}
                      size='medium'
                      fullWidth
                      type='number'
                      label='Giá giảm'
                      placeholder='Nhập giá giảm'
                      error={!!errors.discount_price}
                      helperText={errors.discount_price?.message}
                    />
                  )}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='code'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      size='medium'
                      fullWidth
                      label='Code'
                      placeholder='Nhập code'
                      error={!!errors.code}
                      helperText={errors.code?.message}
                    />
                  )}
                />
              </Grid2>
            </Grid2>
          </Box>

          <Box>
            <h2 className='text-xl font-semibold text-slate-900 mb-4 mt-4'>Cấu hình dịch vụ</h2>

            <Grid2 container spacing={5} className='pb-6 border-b border-slate-200'>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Controller
                  name='display_time'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      size='medium'
                      fullWidth
                      select
                      id='select-time'
                      label='Thời gian hiện thị'
                      value={field.value || ''}
                      error={!!errors.display_time}
                      helperText={errors.display_time?.message}
                      slotProps={{
                        select: { displayEmpty: true },
                        htmlInput: { 'aria-label': 'Without label' }
                      }}
                    >
                      <MenuItem value=''>
                        <em>Chọn thời gian</em>
                      </MenuItem>
                      {(dateMappingOptions.length > 0 ? dateMappingOptions : defaultTimeOptions).map(option => (
                        <MenuItem key={option.key} value={option.key}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Controller
                  name='type'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      size='medium'
                      fullWidth
                      select
                      id='select-type'
                      label='Type'
                      error={!!errors.type}
                      helperText={errors.type?.message}
                      slotProps={{
                        select: { displayEmpty: true },
                        htmlInput: { 'aria-label': 'Without label' }
                      }}
                    >
                      <MenuItem value='0'>STATIC</MenuItem>
                      <MenuItem value='1'>ROTATING</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Controller
                  name='status'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      size='medium'
                      fullWidth
                      select
                      id='select-status'
                      label='Trạng thái'
                      error={!!errors.status}
                      helperText={errors.status?.message}
                      slotProps={{
                        select: { displayEmpty: true },
                        htmlInput: { 'aria-label': 'Without label' }
                      }}
                    >
                      <MenuItem value='active'>ACTIVE</MenuItem>
                      <MenuItem value='inactive'>INACTIVE</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Controller
                  name='proxy_type'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      size='medium'
                      fullWidth
                      select
                      id='select-proxy_type'
                      label='Proxy Type'
                      value={field.value || ''}
                      error={!!errors.proxy_type}
                      helperText={errors.proxy_type?.message}
                      slotProps={{
                        select: { displayEmpty: true },
                        htmlInput: { 'aria-label': 'Without label' }
                      }}
                    >
                      <MenuItem value=''>
                        <em>Chọn proxy type</em>
                      </MenuItem>
                      <MenuItem value='residential'>Dân cư</MenuItem>
                      <MenuItem value='datacenter'>Datacenter</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Controller
                  name='ip_version'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      size='medium'
                      fullWidth
                      select
                      id='select-ip-version'
                      label='Ip Version'
                      error={!!errors.ip_version}
                      helperText={errors.ip_version?.message}
                      slotProps={{
                        select: { displayEmpty: true },
                        htmlInput: { 'aria-label': 'Without label' }
                      }}
                    >
                      <MenuItem value='ipv4'>V4</MenuItem>
                      <MenuItem value='ipv6'>V6</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid2>
            </Grid2>
          </Box>

          <Box>
            <h2 className='text-xl font-semibold text-slate-900 mb-4 mt-4'>Vị trí</h2>
            <Grid2 container spacing={5} className='pb-6 border-b border-slate-200'>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='partner_id'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      size='medium'
                      fullWidth
                      select
                      id='select-partner'
                      label='Đối tác'
                      disabled={loadingPartners}
                      error={!!errors.partner_id}
                      helperText={errors.partner_id?.message}
                      slotProps={{
                        select: { displayEmpty: true },
                        htmlInput: { 'aria-label': 'Without label' }
                      }}
                    >
                      <MenuItem value=''>
                        <em>{loadingPartners ? 'Đang tải...' : 'Chọn đối tác'}</em>
                      </MenuItem>
                      {partners?.map((partner: any) => (
                        <MenuItem key={partner.id} value={partner.id}>
                          {partner.title || partner.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='country'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      size='medium'
                      fullWidth
                      select
                      id='select-country'
                      label='Quốc gia'
                      value={field.value || ''}
                      error={!!errors.country}
                      helperText={errors.country?.message}
                      slotProps={{
                        select: { displayEmpty: true },
                        htmlInput: { 'aria-label': 'Without label' }
                      }}
                    >
                      <MenuItem value=''>
                        <em>Chọn quốc gia</em>
                      </MenuItem>
                      <MenuItem value='vi'>Việt Nam</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid2>
            </Grid2>
          </Box>

          <Box>
            <h2 className='text-xl font-semibold text-slate-900 mb-4 mt-4'>Cấu hình body</h2>
            <Grid2 container spacing={5} className='pb-6 border-b border-slate-200'>
              <Grid2 size={{ xs: 12, sm: 12 }}>
                <Controller
                  name='body_api'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      rows={6}
                      fullWidth
                      multiline
                      label='Body Api'
                      id='textarea-outlined-static'
                      error={!!errors.body_api}
                      helperText={errors.body_api?.message}
                    />
                  )}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 12 }}>
                <div className='flex gap-2'>
                  <Button
                    onClick={handleOpenModal}
                    className='text-white'
                    variant='contained'
                    startIcon={<Plus size={16} />}
                  >
                    Thêm mô tả
                  </Button>

                  <Button
                    onClick={handleOpenMultiInputModal}
                    className='text-white'
                    variant='contained'
                    color='secondary'
                    startIcon={<Plus size={16} />}
                  >
                    Thêm nhiều trường
                  </Button>

                  <Button
                    onClick={handleOpenPriceModal}
                    className='text-white'
                    variant='contained'
                    color='info'
                    startIcon={<Plus size={16} />}
                  >
                    Set giá theo thời gian
                  </Button>
                </div>
              </Grid2>
            </Grid2>
          </Box>

          <Box>
            <h2 className='text-xl font-semibold text-slate-900 mb-4 mt-4'>Tùy chọn</h2>
            <Grid2 container spacing={5} className='pb-6 border-b border-slate-200'>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Controller
                  name='protocols'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      select
                      fullWidth
                      size='medium'
                      label='Giao thức'
                      value={field.value || []}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      error={!!errors.protocols}
                      helperText={errors.protocols?.message}
                      id='select-multiple-protocols'
                      slotProps={{
                        select: {
                          multiple: true,
                          MenuProps,
                          renderValue: selected => {
                            const values = selected as unknown as string[]
                            if (!values || values.length === 0) {
                              return <em>Chọn giao thức</em>
                            }
                            return (
                              <div className='flex flex-wrap gap-1'>
                                {values.map(val => {
                                  const protocol = protocols.find(p => p.value === val)
                                  return <Chip key={val} label={protocol?.label || val} size='small' />
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

              <FormControlLabel control={<Switch />} label='Hiện thị user/pass' />
            </Grid2>
          </Box>

          <Box className='mt-6 pb-6'>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12 }}>
                <div className='flex gap-3 justify-end'>
                  <Button variant='outlined' onClick={() => router.push(`/${locale}/admin/service-type`)}>
                    Hủy
                  </Button>
                  <Button
                    variant='contained'
                    type='button'
                    className='text-white'
                    disabled={updateMutation.isPending}
                    startIcon={updateMutation.isPending ? <CircularProgress size={20} color='inherit' /> : null}
                    onClick={async () => {
                      await handleSubmit(onSubmit, onError)()
                    }}
                  >
                    {updateMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật dịch vụ'}
                  </Button>
                </div>
              </Grid2>
            </Grid2>
          </Box>
        </form>
      </CardContent>

      {/* Modal thêm nhiều input */}
      <MultiInputModal
        isOpen={isMultiInputModalOpen}
        onClose={handleCloseMultiInputModal}
        onSave={handleSaveMultiInputs}
        title='Thêm nhiều trường'
        keyLabel='Key'
        valueLabel='Value'
        fields={multiInputFields}
        setFields={setMultiInputFields}
      />

      {/* Modal set giá theo thời gian */}
      <PriceByDurationModal
        isOpen={isPriceModalOpen}
        onClose={handleClosePriceModal}
        onSave={handleSavePrices}
        fields={priceFields}
        setFields={setPriceFields}
      />
    </Card>
  )
}
