import React from 'react'

import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { Eye, EyeOff } from 'lucide-react'

import { useMutation } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import useAxiosAuth from '@/hocs/useAxiosAuth'

interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required('Mật khẩu hiện tại là bắt buộc.'),
  newPassword: yup.string().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự.').required('Mật khẩu mới là bắt buộc.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp.')
    .required('Vui lòng xác nhận mật khẩu mới.')
})

const ChangePassword = () => {
  const [showPassword, setShowPassword] = React.useState({
    current: false,
    new: false,
    confirm: false
  })

  const axiosAuth = useAxiosAuth()

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    mode: 'onChange'
  })

  const onSubmit = (data: ChangePasswordFormData) => {
    mutate(data)
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ChangePasswordFormData) => {
      const payload = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      }

      return axiosAuth.post('/change-password', payload)
    },
    onSuccess: () => {
      toast.success('Cập nhật mật khẩu thành công!')
      reset() // Reset form về trạng thái ban đầu
    },
    onError: error => {
      if (error.response && error.response.status === 422 && error.response.data && error.response.data.errors) {
        const serverErrors = error.response.data.errors

        // Lặp qua các lỗi từ server và set vào form
        Object.entries(serverErrors).forEach(([key, value]) => {
          setError(key, {
            type: 'server',
            message: Array.isArray(value) ? value[0] : value // Lấy message lỗi đầu tiên
          })
        })
      } else if (error.response && error.response.status === 422) {
        // Xử lý trường hợp lỗi 422 nhưng không có cấu trúc errors
        toast.error(error.response.data.message || 'Có lỗi xảy ra khi xử lý dữ liệu')
      } else {
        // Nếu có lỗi khác không phải validation
        toast.error('Lỗi khi lưu: Vui lòng thử lại.')
      }
    }
  })

  const handleClickShowPassword = field => () => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 h-100'>
      <div className='p-6 border-b border-gray-100'>
        <h2 className='text-xl font-bold text-gray-900'>Đổi mật khẩu</h2>
        <p className='text-sm text-gray-600 mt-1'>Cập nhật mật khẩu để bảo mật tài khoản</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 p-6 '>
        {/* Mật khẩu hiện tại */}
        <Controller
          name='currentPassword'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              size='medium'
              label='Mật khẩu hiện tại'
              id='current-password'
              type={showPassword.current ? 'text' : 'password'}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        // SỬA Ở ĐÂY
                        onClick={handleClickShowPassword('current')}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle current password visibility'
                      >
                        {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
          )}
        />

        {/* Mật khẩu mới - (Phần này đã đúng) */}
        <Controller
          name='newPassword'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Mật khẩu mới'
              size='medium'
              id='new-password'
              type={showPassword.new ? 'text' : 'password'}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword('new')}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle new password visibility'
                      >
                        {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
          )}
        />

        {/* Xác nhận mật khẩu mới */}
        <Controller
          name='confirmPassword'
          control={control}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Xác nhận mật khẩu mới'
              size='medium'
              id='confirm-password'
              type={showPassword.confirm ? 'text' : 'password'}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword('confirm')}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle confirm password visibility'
                      >
                        {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
          )}
        />

        <Button
          type='submit'
          variant='contained'
          color='primary'
          className='mt-2 text-white'
          disabled={isSubmitting || isPending}
        >
          {isSubmitting || isPending ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
        </Button>
      </form>
    </div>
  )
}

export default ChangePassword
