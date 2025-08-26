'use client'

import React from 'react'

import { useForm, Controller, useWatch } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { CheckCircle, ShoppingCart } from 'lucide-react'
import Switch from '@mui/material/Switch'

import CustomTextField from '@core/components/mui/TextField'

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
  username: yup.string().required('Vui lòng nhập username'),
  password: yup.string().required('Vui lòng nhập password'),
  autoRotate: yup.boolean(),
  rotationTime: yup
    .number()
    .typeError('Vui lòng nhập số')
    .min(1, 'Tối thiểu 1 phút')
    .when('autoRotate', {
      is: true,
      then: schema => schema.required('Vui lòng nhập thời gian xoay'),
      otherwise: schema => schema.notRequired()
    })
})

// Component này render một dòng feature tĩnh (chỉ hiển thị thông tin)
const StaticFeatureRow = ({ feature }) => (
  <div className='feature-row'>
    <div className='feature-icons'>
      <CheckCircle size={16} className='text-green-500' />
    </div>
    <div className='feature-content'>
      <span className='feature-label'>{feature.label}:</span>
      {feature.value && <span className='feature-value'>{feature.value}</span>}
    </div>
  </div>
)

// Component này render một dòng feature có input
const InputFeatureRow = ({ feature, control, errors, planId, isDisabled = false}) => (
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
              {...(feature.inputType === 'number' && { min: 1, max: 100 })}
              className={`${errors[feature.field] ? 'border-red-500' : ''}`}
              {...field}
              disabled={isDisabled}
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
            checked={field.value}
            onChange={e => field.onChange(e.target.checked)}
          />
        </div>
      </div>
    )}
  />
)

// Component chính cho mỗi thẻ plan, giờ đây gọn gàng hơn.
const PlanCard = ({ plan }) => {
  const dynamicSchema = proxyPlanSchema.shape({
    [plan.timeUnit.field]: yup
      .number()
      .typeError('Vui lòng nhập số')
      .required(`Vui lòng nhập số ${plan.timeUnit.label}`)
      .integer()
      .min(1, `Tối thiểu là 1`)
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(dynamicSchema),
    defaultValues: {
      [plan.timeUnit.field]: 1,
      quantity: 1,
      username: 'random',
      password: 'random',
      autoRotate: false,
      rotationTime: 1
    },
    mode: 'onChange'
  })

  const watchedFields = useWatch({ control })

  const calculateTotal = () => {
    const basePrice = parseInt(plan.price.replace(/,/g, ''), 10) || 0
    const timeValue = parseInt(watchedFields[plan.timeUnit.field], 10) || 1
    const quantityValue = parseInt(watchedFields.quantity, 10) || 1

    return (basePrice * timeValue * quantityValue).toLocaleString('vi-VN')
  }

  const onSubmit = (data: any) => {
    const total = calculateTotal()

    const orderData = {
      planId: plan.id,
      planTitle: plan.title,
      ...data,
      total
    }

    console.log('Submitting Order:', orderData)

    alert(`Đã thêm "${plan.title}" vào giỏ hàng với tổng tiền ${total}đ`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`proxy-plan-card ${plan.color}`}>
      <div className='plan-header'>
        <h3 className='plan-title'>{plan.title}</h3>
      </div>
      <div className='plan-features'>
        {plan.features.map((feature, index) => {
          // Dựa vào `feature.status` để render component con phù hợp
          switch (feature.status) {
            case 'success':
              return <StaticFeatureRow key={index} feature={feature} />
            case 'input':
              const isRotationTimeInput = feature.field === 'rotationTime';
              return (
                <InputFeatureRow key={index} feature={feature} control={control} errors={errors} planId={plan.id} isDisabled={isRotationTimeInput && !watchedFields.autoRotate}/>
              )
            case 'checkbox':
              return <SwitchFeatureRow key={index} feature={feature} control={control} planId={plan.id} />
            default:
              return null
          }
        })}
      </div>
      <div className='plan-footer'>
        <div className='plan-price'>
          <span className='price-label'>Thành tiền:</span>
          <span className='price-amount'>{calculateTotal()}đ</span>
        </div>
        <button type='submit' className='buy-button'>
          <ShoppingCart size={18} className='mr-2' /> Mua hàng
        </button>
      </div>
    </form>
  )
}

interface RotatingProxyPageProps {
  data: any
}

export default function RotatingProxyPage({ data }: RotatingProxyPageProps) {
  return (
    <>
      {data.map((plan: any) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </>
  )
}
