'use client'
import React, { useState } from 'react'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { toast } from 'react-toastify'
import { Loader } from 'lucide-react'

import { useTranslation } from 'react-i18next'

import axiosInstance from '@/libs/axios'
import { useModalContext } from '@/app/contexts/ModalContext'

interface ForgotForm {
  email: string
}

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { openAuthModal } = useModalContext()
  const { t } = useTranslation()

  const forgotSchema = yup.object({
    email: yup.string().required(t('auth.validation.emailRequired')).email(t('auth.validation.emailInvalid'))
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ForgotForm>({ resolver: yupResolver(forgotSchema) })

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true)

    try {
      const res = await axiosInstance.post('/forgot-password', { email: data.email })

      if (!res.data.success) throw new Error()
      toast.success(t('auth.forgotPasswordSuccess'))
      reset()
      setIsLoading(false)
      openAuthModal('login')
    } catch {
      toast.error(t('auth.forgotPasswordError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='login-form-group'>
        <label className={`login-form-label ${errors.email && 'text-red-500'}`}>{t('auth.email')}</label>
        <input
          type='text'
          className={`login-form-input ${errors.email && 'border-red-500'}`}
          placeholder={t('auth.placeholders.enterEmail')}
          {...register('email')}
        />
        {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
      </div>
      <div className='mb-3'>
        {isLoading ? (
          <button type='button' disabled={isLoading} className='login-submit-btn'>
            <Loader className='rotate' /> {t('auth.buttons.loading')}
          </button>
        ) : (
          <button type='submit' className='login-submit-btn'>
            {t('auth.buttons.sendResetLink')}
          </button>
        )}
      </div>
    </form>
  )
}
