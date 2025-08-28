'use client'

import React, { useState } from 'react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useMutation } from '@tanstack/react-query'

import { Eye, EyeOff } from 'lucide-react'

import { toast } from 'react-toastify'

import axiosInstance from '@/libs/axios'

type RegisterFormInputs = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

interface RegisterFormProps {
  onClose: () => void
}

const schema = yup
  .object({
    name: yup.string().required('Vui lòng nhập tên'),
    email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
    password: yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
      .required('Vui lòng xác nhận mật khẩu')
  })
  .required()

const registerUser = async (data: RegisterFormInputs) => {
  const response = await axiosInstance.post('/register', data)

  return response.data
}

export default function RegisterForm({ onClose }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setPasswordConfirmation] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const { mutation, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: data => {
      console.log('Đăng ký thành công:', data)

      toast.success(data.message)

      reset()

      onClose()
    },
    onError: error => {
      console.error('Lỗi đăng ký:', error)

      toast.error('Đăng ký thất bại. Vui lòng thử lại.')
    }
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: RegisterFormInputs) => {
    console.log('Dữ liệu form:', data)
    mutation.mutate(data)
  }

  return (
    <form className='login-modal-form' onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
      <div className='login-form-group'>
        <label className={`login-form-label ${errors.email && 'text-red-500'}`}>Email</label>
        <input
          type='text'
          name='email'
          className={`login-form-input ${errors.email && 'border-red-500'}`}
          placeholder='Nhập email'
          {...register('email')}
        />
        {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
      </div>

      {/* Username */}
      <div className='login-form-group'>
        <label className={`login-form-label ${errors.name && 'text-red-500'}`}>Username</label>
        <input
          type='text'
          name='name'
          className={`login-form-input ${errors.name && 'border-red-500'}`}
          placeholder='Nhập họ tên'
          {...register('name')}
        />
        {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
      </div>

      {/* Password */}
      <div className='login-form-group'>
        <label className={`login-form-label ${errors.password && 'text-red-500'}`}>Mật khẩu</label>
        <div className='login-password-wrapper'>
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            className={`login-form-input ${errors.password && 'border-red-500'}`}
            placeholder='********'
            {...register('password')}
          />
          <button type='button' className='login-password-toggle' onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} color='#999' /> : <Eye size={20} color='#999' />}
          </button>
        </div>
        {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
      </div>

      {/* password_confirmation */}
      <div className='login-form-group'>
        <label className={`login-form-label ${errors.password_confirmation && 'text-red-500'}`}>
          Nhập lại mật khẩu
        </label>
        <div className='login-password-wrapper'>
          <input
            type={showPasswordConfirmation ? 'text' : 'password'}
            name='password_confirmation'
            className={`login-form-input ${errors.password_confirmation && 'border-red-500'}`}
            placeholder='********'
            {...register('password_confirmation')}
          />
          <button
            type='button'
            className='login-password-toggle'
            onClick={() => setPasswordConfirmation(!showPasswordConfirmation)}
          >
            {showPasswordConfirmation ? <EyeOff size={20} color='#999' /> : <Eye size={20} color='#999' />}
          </button>
        </div>
        {errors.password_confirmation && (
          <p className='text-red-500 text-sm mt-1'>{errors.password_confirmation.message}</p>
        )}
      </div>

      <button
        type='submit'
        className='login-submit-btn'
        disabled={isPending} // Vô hiệu hóa nút khi đang loading
      >
        {isPending ? 'Đang xử lý...' : 'Đăng ký'}
      </button>
    </form>
  )
}
