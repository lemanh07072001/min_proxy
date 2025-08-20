'use client'

import React, { useState } from 'react'

import Image from 'next/image'

import '@/app/[lang]/(client)/components/proxy-card/styles.css'

import * as yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'

import { MapPin, Clock, Users, Shield, Minus, Plus, ShoppingCart } from 'lucide-react'
import Chip from '@mui/material/Chip'

import InputCustom from '@components/form/input/InputCustom'
import SelectCustom from '@components/form/select/SelectCustom'
import QuantityControl from '@components/form/input-quantity/QuantityControl'
import ProtocolSelector from '@components/form/protocol-selector/ProtocolSelector'
import { watch } from 'node:fs'
import { Controller, useForm } from 'react-hook-form'

interface ProxyCardProps {
  provider: string
  logo: string
  color: string
  price: string
  features: string[]
}

const proxySchema = yup.object({
  location: yup.string().required(),
  days: yup.number()
    .typeError('Vui lòng nhập số') // Thông báo lỗi khi nhập không phải số
    .required('Vui lòng nhập số ngày')
    .integer('Số ngày phải là số nguyên')
    .min(1, 'Tối thiểu 1 ngày'),
  quantity: yup.number()
    .typeError('Vui lòng nhập số')
    .required('Vui lòng nhập số lượng')
    .integer('Số lượng phải là số nguyên')
    .min(1, 'Tối thiểu 1 proxy'),
  protocol: yup.string().required(),
  username: yup.string().min(4, 'Tối thiểu 4 ký tự'),
  password: yup.string().min(4, 'Tối thiểu 4 ký tự'),
}).required();

const ProxyCard: React.FC<ProxyCardProps> = ({ provider, logo, color, price, features }) => {
  const [quantity, setQuantity] = useState(1)
  const [days, setDays] = useState(1)
  const [protocol, setProtocol] = useState('HTTP')

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    // *** THAY ĐỔI 3: Sử dụng yupResolver để kết nối schema với form ***
    resolver: yupResolver(proxySchema),
    defaultValues: {
      location: 'random',
      days: 1,
      quantity: 1,
      protocol: 'HTTP',
      username: 'random',
      password: 'random',
    },
    mode: 'onChange'
  })

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const watchedQuantity = watch('quantity')
  const watchedDays = watch('days')

  const calculateTotal = () => {
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

  const onSubmit = (data) => {
    const total = calculateTotal()
    const itemData = {
      ...data,
      provider,
      pricePerDay: price,
      total,
    }
    console.log('Adding to cart:', itemData)

  }

  return (
    <form  onSubmit={handleSubmit(onSubmit)} className={`proxy-card-column ${color}`}>
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
          <div className='price-amount'>{calculateTotal()}đ</div>
          <div className='price-unit'>/ngày</div>
        </div>
      </div>

      {/* Form controls trong layout cột */}
      <div className='form-grid'>
        {/* Location */}
        <SelectCustom
          name="location"
          label='LOCATION'
          type='select'
          icon={<MapPin size={16} />}
          options={dataLocation}
          {...register('location')}
        />

        {/* Thời gian */}
        <Controller
          name="days"
          control={control}
          render={({ field }) => (
            <InputCustom
              label="THỜI GIAN"
              icon={<Clock size={16} />}
              type="number"
              min="1"
              {...field} // Dòng này đã bao gồm value, onChange, onBlur...
              error={errors.days}
            />
          )}
        />

        {/*Số lượng*/}
        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <QuantityControl
              min={1}
              max={10}
              value={1}
              label='SỐ LƯỢNG'
              icon={<Users size={14} />}
              {...field}
            />
          )}
        />

        {/* Giao thức */}
        <Controller
          name="protocol"
          control={control}
          render={({ field }) => (
            <ProtocolSelector protocol={protocol}  {...field}/>
          )}
        />

      </div>

      {/* Auth section */}
      <div className='auth-section-column'>
        <div className='auth-row'>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <InputCustom placeholder='random' label='Tài khoản' {...field}/>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <InputCustom placeholder='random' label='Tài khoản' {...field}/>
            )}
          />

          <InputCustom placeholder='random' name="password" label='Mật khẩu' {...register('password')} />
        </div>
      </div>

      {/* Footer với tổng tiền và nút mua */}
      <div className='row'>
        <div className='col-3'>
          <div className='flex flex-col'>
            <span className='total-label'>Tổng cộng:</span>
            <span className='total-price'>{calculateTotal()}đ</span>
          </div>
        </div>
        <div className='col-9'>
          <button className='buy-button'>
            <ShoppingCart size={18} />
            Mua ngay
          </button>
        </div>
      </div>
    </form>
  )
}

export default ProxyCard
