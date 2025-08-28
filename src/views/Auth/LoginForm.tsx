'use client'

import React, { use, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { signIn } from 'next-auth/react'

import { Eye, EyeOff } from 'lucide-react'

import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

import { toast } from 'react-toastify'

import * as yup from 'yup'

type LoginFormInputs = {
  email: string
  password: string
}

const schema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu')
})

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const router = useRouter()
  const params = useParams()

  const { lang: locale } = params

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: LoginFormInputs) => {
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    })

    if (res.status == 200 && res.ok == true) {
      toast.success('Đăng nhập thành công.')
      router.push(`/${locale}/overview`)
    }

    toast.error('Tài khoản hoặc mật khẩu không chính xác.')
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

      <div className='login-form-options'>
        <label className='login-checkbox-wrapper'>
          <input
            type='checkbox'
            checked={rememberMe}
            onChange={e => setRememberMe(e.target.checked)}
            className='login-checkbox-input'
          />
          <span className='login-checkbox-custom'></span>
          <span className='login-checkbox-label'>Ghi nhớ đăng nhập</span>
        </label>
        <a href='#' className='login-forgot-link'>
          Quên mật khẩu
        </a>
      </div>

      <button type='submit' className='login-submit-btn'>
        Đăng nhập
      </button>
    </form>
  )
}
