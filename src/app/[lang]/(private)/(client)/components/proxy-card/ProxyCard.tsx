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

import { useDispatch } from 'react-redux'

import CustomTextField from '@core/components/mui/TextField'

import QuantityControl from '@components/form/input-quantity/QuantityControl'
import ProtocolSelector from '@components/form/protocol-selector/ProtocolSelector'

import useRandomString from '@/hocs/useRandomString'

import { protocols } from '@/utils/protocolProxy'

import { useModalContext } from '@/app/contexts/ModalContext'

import { DURATION_MAP } from '@/utils/empty'
import { ConfirmDialogOrder } from '@/components/confirm-modal/ConfirmDialogOrder'
import { subtractBalance } from '@/store/userSlice'
import type { AppDispatch } from '@/store'

import { log } from 'console'
import { Grid2 } from '@mui/material'

interface ProxyCardProps {
  provider: string
  isFirstCard?: boolean
  onPurchaseSuccess: () => void
}

const createProxySchema = (isSelectMode, hasPriceByDuration) =>
  yup
    .object({
      days: hasPriceByDuration ? yup.string().required('Vui lòng chọn thời gian') : yup.string().notRequired(),
      quantity: yup
        .number()
        .typeError('Vui lòng nhập số')
        .required('Vui lòng nhập số lượng')
        .integer('Số lượng phải là số nguyên')
        .min(1, 'Tối thiểu 1 proxy'),
      protocol: yup.string().required('Vui lòng chọn giao thức')
    })
    .required()

// --- CUSTOM HOOK FOR API CALL ---
const useBuyProxy = () => {
  const queryClient = useQueryClient()
  const session = useSession()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

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
    onSuccess: (data, variables) => {
      if (data.data.success == false) {
        toast.error('Lỗi hệ thông xin vui lòng liên hệ Admin.')
        router.push('/order-proxy')
      } else {
        const total = variables.total

        dispatch(subtractBalance(total))
        toast.success('Mua proxy thành công.')

        router.push('/history-order')

        // Làm tươi dữ liệu ở hậu cảnh, không chặn UI
        queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
        queryClient.refetchQueries({ queryKey: ['orderProxyStatic'] })
      }
    },
    onError: error => {
      toast.error(error.response?.data.message || 'Lỗi không xác định')

      console.error('Lỗi khi mua proxy:', error.response?.data.messqge || error.message)
    }
  })

  return mutation
}

const ProxyCard: React.FC<ProxyCardProps> = ({ provider, isFirstCard = false }) => {
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
  const hasPriceByDuration = provider?.price_by_duration && provider.price_by_duration.length > 0

  // Lấy giá trị days mặc định từ price_by_duration đầu tiên
  const defaultDays = hasPriceByDuration ? provider.price_by_duration[0].key : '1'

  // Tạo schema dựa trên chế độ
  const proxySchema = createProxySchema(isSelectMode, hasPriceByDuration)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(proxySchema),
    defaultValues: {
      days: defaultDays,
      quantity: 1,
      protocol: 'http'
    },
    mode: 'onChange'
  })

  const watchedQuantity = watch('quantity')
  const watchedDays = watch('days')
  const watchedProrocol = watch('protocol')

  let daysInNumber = 0

  const calculateTotal = () => {
    const quantity = parseInt(watchedQuantity, 10) || 1

    if (isSelectMode) {
      daysInNumber = parseInt(watchedDays, 10) || 1
    } else {
      daysInNumber = parseInt(watchedDays, 10) || 0
    }

    if (quantity < 1) return 0

    // Chỉ tính giá dựa trên price_by_duration
    if (provider?.price_by_duration && provider.price_by_duration.length > 0) {
      const selectedDuration = provider.price_by_duration.find(item => item.key === watchedDays)

      if (selectedDuration) {
        // Giá trong value đã bao gồm cả thời gian (7 ngày, 30 ngày, v.v.)
        // Chỉ cần nhân với số lượng proxy
        const totalPrice = parseInt(selectedDuration.value, 10) || 0
        return totalPrice * quantity
      }
    }

    // Nếu không tìm thấy giá trong price_by_duration thì trả về 0
    return 0
  }

  const calculateTotalFormat = () => {
    return calculateTotal().toLocaleString('vi-VN')
  }

  const total = calculateTotal()

  const onSubmit = data => {
    // Tính lại total để đảm bảo lấy giá trị mới nhất
    const currentTotal = calculateTotal()

    // Lấy giá từ price_by_duration thay vì provider.price
    const selectedDuration = provider?.price_by_duration?.find(item => item.key === data.days)
    const priceForDuration = selectedDuration ? parseInt(selectedDuration.value, 10) : 0

    console.log('DEBUG - Price calculation:', {
      days: data.days,
      provider_price_by_duration: provider?.price_by_duration,
      selectedDuration,
      priceForDuration,
      currentTotal,
      quantity: data.quantity
    })

    const itemData = {
      ...data,
      serviceTypeId: provider.id,
      price: priceForDuration, // Gửi giá từ price_by_duration thay vì provider.price
      ip_version: provider.ip_version,
      proxy_type: provider.proxy_type,
      country: provider.country || provider.country_name || provider.country_code,
      total: currentTotal,
      isPrivate: 'true'
    }

    console.log('Data gửi lên server:', itemData)
    setFormData(itemData) // Lưu dữ liệu vào state
    setOpenConfirm(true) // Mở dialog xác nhận
  }

  const handleConfirmPurchase = () => {
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

  function convertProxyType(type: string) {
    switch (type?.toLowerCase()) {
      case 'residential':
        return 'Dân cư'
      case 'datacenter':
        return 'Datacenter'
      default:
        return type || ''
    }
  }

  function convertIpVersion(version: string) {
    switch (version?.toLowerCase()) {
      case 'ipv4':
        return 'V4'
      case 'ipv6':
        return 'V6'
      default:
        return version || ''
    }
  }

  function getDurationLabel(duration: string) {
    switch (duration) {
      case '1':
        return 'Ngày'
      case '7':
        return 'Tuần'
      case '30':
        return 'Tháng'
      case '365':
        return 'Năm'
      default:
        return `${duration} ngày`
    }
  }

  function calculateDiscount(duration: string, discountedPrice: string) {
    const originalPricePerProduct = provider?.price || 0 // Giá gốc 1 sản phẩm
    const discountPricePerProduct = parseInt(discountedPrice, 10) || 0 // Giá khuyến mãi 1 sản phẩm

    // Nếu không có giá khuyến mãi hoặc giá khuyến mãi = 0 thì không hiển thị
    if (!discountPricePerProduct || discountPricePerProduct === 0) {
      return null
    }

    // Nếu không có giá gốc thì không hiển thị
    if (!originalPricePerProduct || originalPricePerProduct === 0) {
      return null
    }

    // Nếu giá khuyến mãi >= giá gốc thì không hiển thị (không có giảm giá)
    if (discountPricePerProduct >= originalPricePerProduct) {
      return null
    }

    // Tính % giảm giá: (giá gốc - giá khuyến mãi) / giá gốc * 100
    const discountPercent = ((originalPricePerProduct - discountPricePerProduct) / originalPricePerProduct) * 100

    return `-${Math.round(discountPercent)}%`
  }

  // Hàm lấy giá hiển thị ở header
  function getHeaderPrice() {
    // Nếu có price_by_duration thì lấy giá từ watchedDays
    if (provider?.price_by_duration && provider.price_by_duration.length > 0) {
      const selectedDuration = provider.price_by_duration.find(item => item.key === watchedDays)
      return selectedDuration ? parseInt(selectedDuration.value, 10) : parseInt(provider?.price, 10) || 0
    }
    // Nếu không có price_by_duration thì hiển thị giá gốc
    return parseInt(provider?.price, 10) || 0
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`proxy-card-column `}
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
                <h3 className='provider-title-column'>{provider?.code ?? provider?.name}</h3>
                <div className='feature-tags'>
                  {/* {features?.map((feature, index) => (
                    <Chip key={index} label={feature.title} color={feature.class} variant='tonal' size='small' />
                  ))} */}
                </div>
              </div>
            </div>
            <div className='price-section'>
              <div className='price-amount'>{getHeaderPrice()?.toLocaleString('vi-VN')}đ</div>
            </div>
          </div>

          {/* Form controls trong layout cột */}
          <Grid2 container spacing={4}>
            {/* Version - full width */}
            <Grid2 size={{ xs: 12 }}>
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
                value={convertIpVersion(provider.ip_version)}
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
            </Grid2>

            {/* Proxy Type - 50% */}
            <Grid2 size={{ xs: 12, md: 6 }}>
              {/* Loại Proxy */}
              <CustomTextField
                fullWidth
                InputProps={{ readOnly: true }}
                id='proxy_type'
                label={
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={16} />
                    Loại Proxy
                  </span>
                }
                value={convertProxyType(provider?.proxy_type)}
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
            </Grid2>

            {/* Quốc gia - 50% */}
            <Grid2 size={{ xs: 12, md: 6 }}>
              {/* Quốc gia */}
              <CustomTextField
                fullWidth
                InputProps={{ readOnly: true }}
                id='country'
                label={
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={16} />
                    Quốc gia
                  </span>
                }
                value={provider?.country_name || provider?.country || 'N/A'}
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
            </Grid2>

            {/* Chỉ hiển thị thời gian nếu có price_by_duration */}
            {provider?.price_by_duration && provider.price_by_duration.length > 0 && (
              <Grid2 size={{ xs: 12 }}>
                {/* Thời gian */}
                <Controller
                  name='days'
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#64748b',
                          fontWeight: '600',
                          fontSize: '11px',
                          marginBottom: '8px'
                        }}
                      >
                        <Clock size={16} />
                        THỜI GIAN
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          flexWrap: 'wrap'
                        }}
                      >
                        {provider.price_by_duration.map((item, index) => {
                          const discount = calculateDiscount(item.key, item.value)
                          return (
                            <label
                              key={index}
                              style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                border:
                                  field.value === item.key
                                    ? '2px solid var(--mui-palette-primary-main)'
                                    : '1px solid #e5e7eb',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor:
                                  field.value === item.key ? 'var(--mui-palette-primary-lightOpacity)' : 'white',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <input
                                type='radio'
                                value={item.key}
                                checked={field.value === item.key}
                                onChange={field.onChange}
                                autoFocus={isFirstCard && index === 0}
                                style={{ cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '14px', fontWeight: '500' }}>{getDurationLabel(item.key)}</span>
                              {/* Badge giảm giá */}
                              {discount && (
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
                                  {discount}
                                </span>
                              )}
                            </label>
                          )
                        })}
                      </div>
                      {errors.days && (
                        <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.days.message}</p>
                      )}
                    </div>
                  )}
                />
              </Grid2>
            )}

            {/* Số lượng và Proxy Type - 2 cột */}
            <Grid2 size={{ xs: 12, md: 6 }}>
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
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
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
            </Grid2>
          </Grid2>
          <div className='form-grid'></div>
        </div>

        {/* Footer với tổng tiền và nút mua */}
        <div className='row'>
          <div className='col-12 col-lg-12'>
            <div className='flex flex-row justify-between flex-lg-col gap-2 mb-2'>
              <span className='total-label'>Tổng cộng:</span>
              <div className='flex items-baseline gap-1'>
                <span className='total-price'>{calculateTotalFormat()}đ</span>
              </div>
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
        // price={price}
        packageName={provider.title}
        ip_version={provider.ip_version}
        total={calculateTotalFormat()}
        daysInNumber={daysInNumber}
      ></ConfirmDialogOrder>
    </>
  )
}

export default ProxyCard
