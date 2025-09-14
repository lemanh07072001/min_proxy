'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Eye, EyeOff, Loader } from 'lucide-react'
import { useModalContext } from '@/app/contexts/ModalContext'
import axiosInstance from '@/libs/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

interface ResetForm {
  newPassword: string
  confirmPassword: string
}

const resetSchema = yup.object({
  newPassword: yup.string().required('Vui lòng nhập mật khẩu mới').min(8, 'Ít nhất 8 ký tự'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu')
})

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { resetToken, resetEmail, closeAuthModal } = useModalContext()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<ResetForm>({ resolver: yupResolver(resetSchema) })

  const onSubmit = async (data: ResetForm) => {
    setIsLoading(true)

    const res = await axiosInstance.post('/reset-password', {
      email: resetEmail,
      token: resetToken,
      password: data.newPassword,
      password_confirmation: data.confirmPassword
    })

    if (!res.data.success) throw new Error()

    reset()

    toast.success('Đổi mật khẩu thành công!')


    setTimeout(()=>{
      setIsLoading(false)
      router.push('/overview')
      closeAuthModal()
    },2500)

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* New password */}
      <div className="login-form-group">
        <label className={`login-form-label ${errors.newPassword && 'text-red-500'}`}>Mật khẩu mới</label>
        <div className="login-password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            className={`login-form-input ${errors.newPassword && 'border-red-500'}`}
            {...register('newPassword')}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="login-password-toggle">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
      </div>

      {/* Confirm password */}
      <div className="login-form-group">
        <label className={`login-form-label ${errors.confirmPassword && 'text-red-500'}`}>Xác nhận mật khẩu</label>
        <div className="login-password-wrapper">
          <input
            type={showConfirm ? 'text' : 'password'}
            className={`login-form-input ${errors.confirmPassword && 'border-red-500'}`}
            {...register('confirmPassword')}
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="login-password-toggle">
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
      </div>

      <div className='mb-3'>
        {isLoading ? (
          <button type='button' disabled={isLoading} className='login-submit-btn'>
            <Loader className='rotate' /> Loading...
          </button>
        ) : (
          <button type='submit' className='login-submit-btn'>
            Cập nhật mật khẩu
          </button>
        )}
      </div>
    </form>
  )
}
