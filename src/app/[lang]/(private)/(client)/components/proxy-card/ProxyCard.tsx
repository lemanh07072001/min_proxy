'use client'

import React, { useState } from 'react'

import Image from 'next/image'

import { useParams, useRouter } from 'next/navigation'

import '@/app/[lang]/(private)/(client)/components/proxy-card/styles.css'

import * as yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'

import { MapPin, Clock, Users, CheckCircle, ShoppingCart, Loader, User } from 'lucide-react'
import Chip from '@mui/material/Chip'

import MenuItem from '@mui/material/MenuItem'

import { Controller, useForm } from 'react-hook-form'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useSession } from 'next-auth/react'

import axios from 'axios'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'

import QuantityControl from '@components/form/input-quantity/QuantityControl'
import ProtocolSelector from '@components/form/protocol-selector/ProtocolSelector'

import useRandomString from '@/hocs/useRandomString'

import { protocols } from '@/utils/protocolProxy'

import { useModalContext } from '@/app/contexts/ModalContext'

import { DURATION_MAP } from '@/utils/empty'
import { ConfirmDialogOrder } from '@/components/confirm-modal/ConfirmDialogOrder'

interface ProxyCardProps {
  provider: string
  logo: string
  color: string
  price: string
  features: string[]
  timeOptions?: Array<{ value: number; label: string }>
}

const createProxySchema = isSelectMode =>
  yup
    .object({
      days: yup.mixed().when([], {
        is: () => isSelectMode,

        // ✅ SỬA Ở ĐÂY: Bọc schema trong một hàm () => ...
        then: () => yup.string().required('Vui lòng chọn thời gian'),

        // ✅ VÀ Ở ĐÂY
        otherwise: () =>
          yup.number().typeError('Vui lòng nhập số ngày').required('Vui lòng nhập số ngày').min(1, 'Tối thiểu 1 ngày')
      }),
      quantity: yup
        .number()
        .typeError('Vui lòng nhập số')
        .required('Vui lòng nhập số lượng')
        .integer('Số lượng phải là số nguyên')
        .min(1, 'Tối thiểu 1 proxy'),
      protocol: yup.string().required(),
      username: yup.string().min(4, 'Tối thiểu 4 ký tự'),
      password: yup.string().min(4, 'Tối thiểu 4 ký tự')
    })
    .required()

// --- CUSTOM HOOK FOR API CALL ---
const useBuyProxy = () => {
  const queryClient = useQueryClient()
  const session = useSession()
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

      return api.post('/proxy-static', orderData)
    },
    onSuccess: data => {
      if (data.data.success == false) {
        toast.error('Lỗi hệ thông xin vui lòng liên hệ Admin.')
        router.push('/order-proxy')
      } else {
        toast.success('Mua proxy thành công.')
      }

      // Bạn có thể vô hiệu hóa cache hoặc cập nhật dữ liệu khác ở đây
      queryClient.invalidateQueries({ queryKey: ['proxyData'] })
    },
    onError: error => {
      toast.error(error.response?.data.message || 'Lỗi không xác định')

      console.error('Lỗi khi mua proxy:', error.response?.data.messqge || error.message)
    }
  })

  return mutation
}

const ProxyCard: React.FC<ProxyCardProps> = ({ provider, logo, color, price, features, timeOptions = [] }) => {
  const params = useParams()
  const { mutate, isPending } = useBuyProxy()
  const session = useSession()
  const { openAuthModal } = useModalContext()
  const { lang: locale } = params
  const randomString = useRandomString(6)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [formData, setFormData] = useState(null)

  // Xác định chế độ select
  const isSelectMode = provider.show_time == 1

  // Tạo schema dựa trên chế độ
  const proxySchema = createProxySchema(isSelectMode)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(proxySchema),
    defaultValues: {
      days: isSelectMode ? (provider.date_mapping?.[0]?.key ?? '') : 1,
      quantity: 1,
      protocol: 'HTTP',
      username: 'random',
      password: 'random'
    },
    mode: 'onChange'
  })

  const watchedQuantity = watch('quantity')
  const watchedDays = watch('days')
  const watchedProrocol = watch('protocol')

  let daysInNumber = 0

  const calculateTotal = () => {
    const basePrice = parseInt(price, 10) || 0
    const quantity = parseInt(watchedQuantity, 10) || 1

    if (isSelectMode) {
      // Nếu là select, tra cứu trong DURATION_MAP
      daysInNumber = DURATION_MAP[watchedDays] || 0
    } else {
      // Nếu là input, chuyển đổi trực tiếp
      daysInNumber = parseInt(watchedDays, 10) || 0
    }

    if (quantity < 1 || daysInNumber < 1) return 0

    return basePrice * quantity

    // return basePrice * quantity * daysInNumber
  }

  const calculateTotalFormat = () => {
    return calculateTotal().toLocaleString('vi-VN')
  }

  const total = calculateTotal()

  const onSubmit = data => {
    const itemData = {
      ...data,
      serviceTypeId: provider.id,
      price: price,
      username: data.username === 'random' ? randomString() : data.username,
      password: data.password === 'random' ? randomString() : data.password,
      total
    }

    setFormData(itemData) // Lưu dữ liệu vào state
    setOpenConfirm(true) // Mở dialog xác nhận
  }

  const handleConfirmPurchase = () => {}

  function convertDuration(days: number) {
    switch (days) {
      case '1':
        return 'ngày'
      case '7':
        return 'tuần'
      case '30':
        return 'tháng'
      case '365':
        return 'năm'
      default:
        return `${days} ngày`
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`proxy-card-column ${color}`}
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header với logo và giá */}
          <div className='card-header-column'>
            <div className='provider-section'>
              {/* <div className='provider-logo-column'>
              {logo ? <Image src={logo} width={80} height={20} alt='Logo' /> : null}
            </div> */}
              <div className='provider-info-column'>
                <h3 className='provider-title-column'>{provider.title}</h3>
                <div className='feature-tags'>
                  {features?.map((feature, index) => (
                    <Chip key={index} label={feature.title} color={feature.class} variant='tonal' size='small' />
                  ))}
                </div>
              </div>
            </div>
            <div className='price-section'>
              <div className='price-amount'>{provider.price.toLocaleString('vi-VN')}đ</div>
              <div className='price-unit'>/{convertDuration(provider.time_type)}</div>
            </div>
          </div>

          {/* Form controls trong layout cột */}
          <div className='form-grid'>
            {/* version */}
            <CustomTextField
              fullWidth
              InputProps={{ readOnly: true }}
              id='version'
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={16} />
                  Version
                </span>
              }
              value={provider.ip_version}
              sx={{
                // Nhắm đến thẻ label của component này
                '& .MuiInputLabel-root': {
                  color: '#64748b', // Đổi màu label thành màu cam
                  fontWeight: '600', // In đậm chữ
                  fontSize: '11px', // Thay đổi kích thước font
                  paddingBottom: '5px'
                }
              }}
            />

            {/* Thời gian */}
            <Controller
              name='days'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  type={isSelectMode ? 'select' : 'number'}
                  inputProps={!isSelectMode ? { min: 1 } : undefined}
                  select={isSelectMode}
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} />
                      THỜI GIAN
                    </span>
                  }
                  error={!!errors.days}
                  helperText={errors.days?.message}
                  {...field}
                  sx={{
                    '& .MuiInputLabel-root': {
                      color: '#64748b', // Đổi màu label thành màu cam
                      fontWeight: '600', // In đậm chữ
                      fontSize: '11px', // Thay đổi kích thước font
                      paddingBottom: '5px'
                    }
                  }}
                >
                  {isSelectMode &&
                    Array.isArray(provider.date_mapping) &&
                    provider.date_mapping.map(option => (
                      <MenuItem key={option.key} value={option.key}>
                        {option.label}
                      </MenuItem>
                    ))}
                </CustomTextField>
              )}
            />

            {/*Số lượng*/}
            <Controller
              name='quantity'
              control={control}
              render={({ field }) => (
                <QuantityControl
                  min={1}
                  max={100}
                  label='SỐ LƯỢNG'
                  icon={<Users size={14} />}
                  value={field.value || 1}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Giao thức */}
            <Controller
              name='protocol'
              control={control}
              render={({ field }) => (
                <ProtocolSelector
                  protocols={protocols}
                  selectedProtocol={field.value}
                  onProtocolChange={field.onChange}
                  label='GIAO THỨC'
                  required={true}
                  error={errors.protocol?.message}
                />
              )}
            />
          </div>

          {/* Auth section */}
          {provider.allow_user == 0 ? (
            <div className='auth-section-column'>
              <div className='auth-row'>
                <Controller
                  name='username'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      type='text'
                      {...field}
                      label={<span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Username</span>}
                      sx={{
                        // Nhắm đến thẻ label của component này
                        '& .MuiInputLabel-root': {
                          color: '#64748b', // Đổi màu label thành màu cam
                          fontWeight: '600', // In đậm chữ
                          fontSize: '11px', // Thay đổi kích thước font
                          paddingBottom: '5px'
                        },
                        '&.MuiFilledInput-input': {
                          background: '#ffffff !important'
                        }
                      }}
                    />
                  )}
                />

                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      type='text'
                      label={<span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Password</span>}
                      sx={{
                        '& .MuiInputLabel-root': {
                          color: '#64748b', // Đổi màu label thành màu cam
                          fontWeight: '600', // In đậm chữ
                          fontSize: '11px', // Thay đổi kích thước font
                          paddingBottom: '5px'
                        },
                        '&.MuiFilledInput-input': {
                          background: '#ffffff !important'
                        }
                      }}
                    />
                  )}
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer với tổng tiền và nút mua */}
        <div className='row'>
          <div className='col-12 col-lg-12'>
            <div className='flex flex-row justify-between flex-lg-col gap-2 mb-2'>
              <span className='total-label'>Tổng cộng:</span>
              <span className='total-price'>{calculateTotalFormat()}đ</span>
            </div>
          </div>
          <div className='col-12 col-lg-12'>
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
        </div>
      </form>

      <ConfirmDialogOrder
        isOpen={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmPurchase}
        quantity={watchedQuantity}
        protocol={watchedProrocol}
        price={price}
        packageName={provider.title}
        ip_version={provider.ip_version}
        total={calculateTotalFormat()}
        daysInNumber={daysInNumber}
      ></ConfirmDialogOrder>
    </>
  )
}

export default ProxyCard
