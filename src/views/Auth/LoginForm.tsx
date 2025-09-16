'use client'

import React, { useState } from 'react'

import { useParams, usePathname, useRouter } from 'next/navigation'

import { signIn } from 'next-auth/react'

import { Eye, EyeOff, Loader } from 'lucide-react'

import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

import { toast } from 'react-toastify'

import * as yup from 'yup'

import { useTranslation } from 'react-i18next'

import { useModalContext } from '@/app/contexts/ModalContext'

type LoginFormInputs = {
  email: string
  password: string
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const { closeAuthModal, setAuthModalMode } = useModalContext()

  const { lang: locale } = params

  const { t } = useTranslation()

  const schema = yup.object({
    email: yup.string().email(t('auth.validation.emailInvalid')).required(t('auth.validation.emailRequired')),
    password: yup
      .string()
      .min(6, t('auth.validation.passwordMinLength'))
      .required(t('auth.validation.passwordRequired'))
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true)

    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    })

    if (res?.ok) {
      setLoading(false)
      toast.success(t('auth.loginSuccess'))
      closeAuthModal()

      // Reload page để update session ở server-side
      router.replace('/overview')
      window.location.reload()
    } else {
      setLoading(false)
      toast.error(t('auth.loginError'))
    }
  }

  return (
    <form className='login-modal-form' onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
      <div className='login-form-group'>
        <label className={`login-form-label ${errors.email && 'text-red-500'}`}>{t('auth.email')}</label>
        <input
          type='text'
          name='email'
          className={`login-form-input ${errors.email && 'border-red-500'}`}
          placeholder={t('auth.placeholders.enterEmail')}
          {...register('email')}
        />
        {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className='login-form-group'>
        <label className={`login-form-label ${errors.password && 'text-red-500'}`}>{t('auth.password')}</label>
        <div className='login-password-wrapper'>
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            className={`login-form-input ${errors.password && 'border-red-500'}`}
            placeholder={t('auth.placeholders.enterPassword')}
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
          <span className='login-checkbox-label'>{t('auth.rememberMe')}</span>
        </label>
        <a href='#' className='login-forgot-link' onClick={() => setAuthModalMode('reset')}>
          {t('auth.buttons.forgotPassword')}
        </a>
      </div>

      {loading ? (
        <button type='button' disabled={loading} className='login-submit-btn'>
          <Loader className='rotate' /> {t('auth.buttons.loading')}
        </button>
      ) : (
        <button type='submit' className='login-submit-btn'>
          {t('auth.buttons.login')}
        </button>
      )}
    </form>
  )
}
