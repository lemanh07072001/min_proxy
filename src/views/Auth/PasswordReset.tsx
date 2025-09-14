'use client'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Mail, Lock, Eye, EyeOff, X, CheckCircle, KeyRound } from 'lucide-react'
import axiosInstance from '@/libs/axios'
import { toast } from 'react-toastify'

type PageType = 'forgot' | 'reset' | 'success'

interface ForgotForm {
  email: string
}

interface ResetForm {
  newPassword: string
  confirmPassword: string
}

// ✅ Schema cho từng form
const forgotSchema = yup.object({
  email: yup.string().required('Vui lòng nhập email').email('Email không hợp lệ')
})

const resetSchema = yup.object({
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    // .matches(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
    // .matches(/[0-9]/, 'Phải có ít nhất 1 số'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu')
})

export default function PasswordReset() {
  const [currentPage, setCurrentPage] = useState<PageType>('forgot')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Form cho Forgot
  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    reset: resetForgot
  } = useForm<ForgotForm>({ resolver: yupResolver(forgotSchema) })

  // Form cho Reset
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
    watch,
    reset: resetReset
  } = useForm<ResetForm>({ resolver: yupResolver(resetSchema) })

  const onForgot = async (data: ForgotForm) => {
    setIsLoading(true)

    console.log(data.email)

    const res =  await axiosInstance.post(`/forgot-password`, { email: data.email })

    if(res.data.success) {
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }else{
      toast.error('Lỗi không thể gửi email vào lúc này.')
    }
  }

  const onReset = (data: ResetForm) => {
    setIsLoading(true)

    console.log(data)
    setTimeout(() => {
      setIsLoading(false)
      setCurrentPage('success')
    }, 1500)
  }

  const handleClose = () => {
    resetForgot()
    resetReset()
    setCurrentPage('forgot')
  }

  // -------------------------------------------------------------------

  const renderForgot = () => (
    <form onSubmit={handleForgotSubmit(onForgot)} className="space-y-6">
      <div>
        {/* Email */}
        <div className='login-form-group'>
          <label className={`login-form-label ${forgotErrors.email && 'text-red-500'}`}>Email</label>
          <input
            type='text'
            name='email'
            className={`login-form-input ${forgotErrors.email && 'border-red-500'}`}
            placeholder='Nhập email'
            {...registerForgot('email')}
          />
          {forgotErrors.email && <p className='text-red-500 text-sm mt-1'>{forgotErrors.email.message}</p>}
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 m-0 mb-3 rounded-xl"
      >
        {isLoading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
      </button>
    </form>
  )

  const renderReset = () => {
    const password = watch('newPassword') || ''
    return (
      <form onSubmit={handleResetSubmit(onReset)} className="space-y-6">
        {/* New password */}
        <div className="login-form-group">
          <label className={`login-form-label ${resetErrors.newPassword && 'text-red-500'}`}>Mật khẩu mới</label>
          <div className="login-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`login-form-input ${resetErrors.newPassword && 'border-red-500'}`}
              placeholder="********"
              {...registerReset('newPassword')}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="login-password-toggle">
              {showPassword ? <EyeOff size={20} color="#999" /> : <Eye size={20} color="#999" />}
            </button>
          </div>
          {resetErrors.newPassword && <p className="text-red-500 text-sm mt-1">{resetErrors.newPassword.message}</p>}
        </div>

        {/* Confirm password */}
        <div className="login-form-group">
          <label className={`login-form-label ${resetErrors.confirmPassword && 'text-red-500'}`}>Xác nhận mật khẩu</label>
          <div className="login-password-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className={`login-form-input ${resetErrors.confirmPassword && 'border-red-500'}`}
              placeholder="********"
              {...registerReset('confirmPassword')}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="login-password-toggle">
              {showConfirmPassword ? <EyeOff size={20} color="#999" /> : <Eye size={20} color="#999" />}
            </button>
          </div>
          {resetErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{resetErrors.confirmPassword.message}</p>
          )}
        </div>


        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl"
        >
          {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
        </button>
      </form>
    )
  }

  const renderSuccess = () => (
    <div className="text-center space-y-4">
      <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
      <p>Mật khẩu đã được cập nhật thành công</p>
      <button
        onClick={() => {
          resetForgot()
          resetReset()
          setCurrentPage('forgot')
        }}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Về đăng nhập
      </button>
    </div>
  )

  return (
    <>
      {currentPage === 'forgot' && renderForgot()}
      {currentPage === 'reset' && renderReset()}
      {/*{currentPage === 'success' && renderSuccess()}*/}
    </>
  )
}
