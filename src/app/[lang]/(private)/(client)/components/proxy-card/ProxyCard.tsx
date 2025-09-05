'use client'

import React from 'react'

import Image from 'next/image'

import { useParams } from 'next/navigation'

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
import Link from '@/components/Link'

interface ProxyCardProps {
  provider: string
  logo: string
  color: string
  price: string
  features: string[]
}

const proxySchema = yup
  .object({
    location: yup.string().required(),
    days: yup
      .number()
      .typeError('Vui lòng nhập số') // Thông báo lỗi khi nhập không phải số
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
  const params = useParams()
  const { lang: locale } = params

  // Định nghĩa danh sách protocols
  const protocols = [
    { id: 'HTTP', name: 'HTTP', description: 'HTTP Protocol' },
    { id: 'SOCKS5', name: 'SOCKS5', description: 'SOCKS5 Protocol' }
  ]

  const {
    register,
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

  const calculateTotal = () => {
    const basePrice = parseInt(price.replace(/[^\d]/g, ''), 10) || 0
    const quantity = parseInt(watchedQuantity, 10) || 1

    const days = parseInt(watchedDays, 10) || 1

    return basePrice * quantity * days
  }

  const calculateTotalFormat = () => {
    const basePrice = parseInt(price.replace(/[^\d]/g, ''), 10) || 0
    const quantity = parseInt(watchedQuantity, 10) || 1

    const days = parseInt(watchedDays, 10) || 1

    return (basePrice * quantity * days).toLocaleString('vi-VN')
  }

  const dataLocation = [
    {
      value: 'random',
      label: 'random'
    },
    {
      value: 'hanoi',
      label: 'Hà Nội'
    },
    {
      value: 'da-nang',
      label: 'Đà Nẵng'
    },
    {
      value: 'hcm',
      label: 'TP.HCM'
    }
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
          <div className='price-amount'>{calculateTotalFormat()}đ</div>
          <div className='price-unit'>/ngày</div>
        </div>
      </div>

      {/* Form controls trong layout cột */}
      <div className='form-grid'>
        {/* Location */}
        <CustomTextField
          select='true'
          name='location'
          fullWidth
          id='locale'
          label={
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={16} />
              LOCATION
            </span>
          }
          sx={{
            // Nhắm đến thẻ label của component này
            '& .MuiInputLabel-root': {
              color: '#64748b', // Đổi màu label thành màu cam
              fontWeight: '600', // In đậm chữ
              fontSize: '11px', // Thay đổi kích thước font
              paddingBottom: '5px'
            }
          }}
        >
          {dataLocation.map((item, index) => {
            return (
              <MenuItem key={index} value={item.value}>
                {item.label}
              </MenuItem>
            )
          })}
        </CustomTextField>

        {/* Thời gian */}
        <Controller
          name='days'
          control={control}
          render={({ field }) => (
            <CustomTextField
              type='number'
              min='1'
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} />
                  THỜI GIAN
                </span>
              }
              {...field}
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
        </div>
      </div>

      {/* Footer với tổng tiền và nút mua */}
      <div className='row'>
        <div className='col-4 col-lg-3'>
          <div className='flex flex-col'>
            <span className='total-label'>Tổng cộng:</span>
            <span className='total-price'>{calculateTotalFormat()}đ</span>
          </div>
        </div>
        <div className='col-8 col-lg-9'>
          <button type='submit' className='buy-button'>
            <ShoppingCart size={18} /> Mua ngay
          </button>
        </div>
      </div>
    </form>
  )
}

export default ProxyCard
