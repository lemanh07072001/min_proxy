'use client'

import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { useForm, Controller, useWatch } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { CheckCircle, ShoppingCart, User, Loader } from 'lucide-react'
import Switch from '@mui/material/Switch'

import { useSession } from 'next-auth/react'

import axios from 'axios'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import ConfirmDialog from '@components/confirm-modal/ConfirmDialog'

import { useModalContext } from '@/app/contexts/ModalContext'

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
  time: yup
    .number()
    .typeError('Vui lòng nhập thời gian')
    .required('Vui lòng nhập thời gian')
    .integer('Thời gian phải là số nguyên')
    .min(1, 'Tối thiểu là 1 ngày')
    .max(365, 'Tối đa là 365 ngày')
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

// --- CUSTOM HOOK FOR API CALL ---
const useBuyProxy = () => {
  const queryClient = useQueryClient()
  const session = useSession()

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
    onSuccess: data => {
      // Xử lý khi request thành công
      if (data.data.success == false) {
        toast.error('Lỗi hệ thông xin vui lòng liên hệ Admin.  ')
      } else {
        toast.success(data.data.message)
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

// Component chính cho mỗi thẻ plan, giờ đây gọn gàng hơn.
const PlanCard = ({ plan }) => {
  const { mutate, isPending, isError, isSuccess, error } = useBuyProxy()
  const [openConfirm, setOpenConfirm] = useState(false)
  const [formData, setFormData] = useState()
  const { openAuthModal } = useModalContext()
  const session = useSession()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      quantity: 1,
      time: 1
    },
    mode: 'onChange',
    resolver: yupResolver(proxyPlanSchema)
  })

  const watchedFields = useWatch({ control })

  const calculateTotalFormat = () => {
    const basePrice = parseInt(plan.price, 10) || 0
    const timeValue = parseInt(watchedFields.time, 10) || 1
    const quantityValue = parseInt(watchedFields.quantity, 10) || 1

    if (quantityValue < 1 || timeValue < 1) return 0

    return (basePrice * timeValue * quantityValue).toLocaleString('vi-VN')
  }

  const calculateTotal = () => {
    const basePrice = parseInt(plan.price, 10) || 0
    const timeValue = parseInt(watchedFields.time, 10) || 1
    const quantityValue = parseInt(watchedFields.quantity, 10) || 1

    if (quantityValue < 1 || timeValue < 1) return 0

    return basePrice * timeValue * quantityValue
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
          {plan.features.map((feature, index) => {
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
              default:
                return null
            }
          })}
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
  return (
    <>
      {data.map((plan: any) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </>
  )
}
