'use client'

import React from 'react'

import Image from 'next/image'

import '@/app/[lang]/(private)/(client)/components/proxy-card/styles.css'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { MapPin, Clock, Users, Globe, ShoppingCart } from 'lucide-react'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import { Controller, useForm } from 'react-hook-form'

import CustomTextField from '@core/components/mui/TextField'
import QuantityControl from '@components/form/input-quantity/QuantityControl'
import ProtocolSelector from '@components/form/protocol-selector/ProtocolSelector'

interface ProxyCardProps {
  provider: string
  logo: string
  color: string
  price: string
  features: { title: string; class: 'success' | 'warning' | 'info' | 'primary' }[]
}

const proxySchema = yup
  .object({
    location: yup.string().required(),
    days: yup
      .number()
      .typeError('Vui lòng nhập số')
      .required('Vui lòng nhập số ngày')
      .integer('Số ngày phải là số nguyên')
      .min(1, 'Tối thiểu 1 ngày'),
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

const ProxyCard: React.FC<ProxyCardProps> = ({ provider, logo, color, price, features }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(proxySchema),
    defaultValues: {
      location: 'random',
      days: 1,
      quantity: 1,
      protocol: 'HTTP',
      username: 'random',
      password: 'random'
    },
    mode: 'onChange'
  })

  const watchedQuantity = watch('quantity')
  const watchedDays = watch('days')

  // Gộp hàm tính tiền để tránh lặp code
  const calculateTotal = () => {
    const basePrice = parseInt(price.replace(/[^\d]/g, ''), 10) || 0
    const quantity = Number(watchedQuantity) || 1
    const days = Number(watchedDays) || 1

    return basePrice * quantity * days
  }

  const dataLocation = [
    { value: 'random', label: 'Random' },
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'da-nang', label: 'Đà Nẵng' },
    { value: 'hcm', label: 'TP.HCM' }
  ]

  const onSubmit = data => {
    const total = calculateTotal()

    const itemData = {
      ...data,
      provider,
      pricePerDay: price,
      total
    }

    console.log('Adding to cart:', itemData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`proxy-card-column ${color}`}>
      {/* Header với logo và giá */}
      <div className='card-header-column'>
        <div className='provider-section'>
          <div className='provider-logo-column'>
            <Image src={logo} width={80} height={20} alt='Picture of the author' />
          </div>
          <div className='provider-info-column'>
            <h3 className='provider-title-column'>{provider}</h3>
            <div className='feature-tags'>
              {features.map((feature, index) => (
                <Chip key={index} label={feature.title} color={feature.class} variant='tonal' size='small' />
              ))}
            </div>
          </div>
        </div>
        <div className='price-section'>
          {/* SỬA LỖI 4: Hiển thị giá gốc, không phải tổng tiền */}
          <div className='price-amount'>{price}</div>
          <div className='price-unit'>/ngày</div>
        </div>
      </div>

      {/* Form controls trong layout cột */}
      <div className='form-grid'>
        {/* SỬA LỖI 1: Bọc Location trong Controller */}
        <Controller
          name='location'
          control={control}
          render={({ field }) => (
            <CustomTextField
              select
              fullWidth
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={16} /> LOCATION
                </span>
              }
              {...field}
            >
              {dataLocation.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </CustomTextField>
          )}
        />

        {/* Thời gian */}
        <Controller
          name='days'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              type='number'
              // SỬA LỖI 3: Xóa `defaultValue`
              inputProps={{ min: 1 }}
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} /> THỜI GIAN
                </span>
              }
              error={!!errors.days}
              helperText={errors.days?.message}
            />
          )}
        />

        {/* Số lượng */}
        <Controller
          name='quantity'
          control={control}
          render={({ field }) => (
            <QuantityControl
              min={1}
              max={100}
              label='SỐ LƯỢNG'
              icon={<Users size={14} />}
              {...field}
              // SỬA LỖI 2: Xóa `value={1}`
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
            />
          )}
        />

        {/* Giao thức */}
        <Controller name='protocol' control={control} render={({ field }) => <ProtocolSelector {...field} />} />
      </div>

      {/* Auth section */}
      <div className='auth-section-column'>
        <div className='auth-row'>
          <Controller
            name='username'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                type='text'
                label='Username'
                error={!!errors.username}
                helperText={errors.username?.message}
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
                label='Password'
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Footer với tổng tiền và nút mua */}
      <div className='row'>
        <div className='col-5 col-sm-5 col-md-5 col-lg-4'>
          <div className='flex flex-col'>
            <span className='total-label'>Tổng cộng:</span>
            <span className='total-price'>{calculateTotal().toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
        <div className='col-7 col-sm-7 col-md-7  col-lg-8'>
          <button type='submit' className='buy-button'>
            <ShoppingCart size={18} /> Mua ngay
          </button>
        </div>
      </div>
    </form>
  )
}

export default ProxyCard
