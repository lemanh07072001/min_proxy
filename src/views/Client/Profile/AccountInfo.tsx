import { use, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Mail, Phone, MapPin, Calendar, CreditCard as Edit2, Save, X } from 'lucide-react'

import InputAdornment from '@mui/material/InputAdornment'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { formatDateTimeLocal } from '@/utils/formatDate'
import CustomTextField from '@/@core/components/mui/TextField'
import useAxiosAuth from '@/hooks/useAxiosAuth'

interface Profile {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  avatar?: string
  role: string
  created_at: string
}

interface ProfileProps {
  dataProfile: Profile
}

const profileSchema = yup
  .object({
    fullName: yup.string().required('Họ và tên không được để trống.').min(3, 'Tối thiểu 3 ký tự.'),
    email: yup.string().email('Email không hợp lệ.').required('Email không được để trống.'),
    phone: yup
      .string()
      .matches(/^[0-9+ ]+$/, 'Số điện thoại không hợp lệ.')
      .nullable()
      .optional(),
    address: yup
      .string()
      .nullable() // Cho phép giá trị null/undefined
      .optional()
  })
  .required()

type ProfileFormData = yup.InferType<typeof profileSchema>

const AccountInfo = ({ dataUser }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const axiosAuth = useAxiosAuth()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    reset, // Dùng để reset form khi Hủy
    formState: { errors }
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullName: dataUser?.name || '',
      email: dataUser?.email || '',
      phone: dataUser?.phone || '',
      address: dataUser?.address || ''
    },
    mode: 'onChange'
  })

  useEffect(() => {
    reset({
      fullName: dataUser?.name || '',
      email: dataUser?.email || '',
      phone: dataUser?.phone || '',
      address: dataUser?.address || ''
    })
  }, [dataUser, reset])

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProfileFormData) => {
      const payload = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address
      }

      const res = axiosAuth.post('/profile', payload)
    },
    onSuccess: () => {
      toast.success('Cập nhật thông tin thành công!')
      setIsEditing(false)

      router.refresh()
    },
    onError: err => {
      toast.error('Lỗi khi lưu: Vui lòng thử lại.')
    }
  })

  const handleFormSubmit = (data: ProfileFormData) => {
    mutate(data)
  }

  const handleCancel = () => {
    reset() // Reset form về dữ liệu ban đầu
    setIsEditing(false)
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 h-100'>
      <div className='p-6 border-b border-gray-100'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>Thông tin tài khoản</h2>
            <p className='text-sm text-gray-600 mt-1'>Cập nhật thông tin cá nhân của bạn</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className='flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors'
            >
              <Edit2 className='w-4 h-4' />
              <span>Chỉnh sửa</span>
            </button>
          ) : (
            <div className='flex space-x-2'>
              <button
                onClick={handleCancel}
                className='flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors'
              >
                <X className='w-4 h-4' />
                <span>Hủy</span>
              </button>
              <button
                type='submit'
                form='profile-form'
                disabled={isPending}
                className='flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors'
              >
                <Save className='w-4 h-4' />
                <span>Lưu</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <form id='profile-form' onSubmit={handleSubmit(handleFormSubmit)}>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
            {/* 1. Họ và tên */}
            <Controller
              name='fullName'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Họ và tên'
                  placeholder='Nhập họ tên...'
                  disabled={!isEditing || isPending}
                  size='medium'
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-user-circle' />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              )}
            />

            {/* 2. Email - Read Only */}
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Email'
                  placeholder='Email không thể chỉnh sửa'
                  disabled={true}
                  size='medium'
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  slotProps={{
                    input: {
                      style: { backgroundColor: '#f5f5f5' },
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Mail size={16} />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              )}
            />

            {/* 3. Số điện thoại */}
            <Controller
              name='phone'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Số điện thoại'
                  placeholder='Nhập số điện thoại...'
                  disabled={!isEditing || isPending}
                  size='medium'
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Phone size={16} />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              )}
            />

            {/* 4. Địa chỉ */}
            <Controller
              name='address'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Địa chỉ'
                  placeholder='Nhập địa chỉ...'
                  disabled={!isEditing || isPending}
                  size='medium'
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <MapPin size={16} />
                        </InputAdornment>
                      )
                    }
                  }}
                />
              )}
            />
          </div>

          <div className='mt-8 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200'>
            <h3 className='font-semibold text-gray-900 mb-2'>Thông tin tài khoản</h3>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm'>
              <div>
                <span className='text-gray-600'>Ngày tạo:</span>
                <p className='font-medium text-gray-900'>{formatDateTimeLocal(dataUser?.created_at)}</p>
              </div>
              <div>
                <span className='text-gray-600'>Phân quyền:</span>
                <p className='font-medium text-gray-900'>{dataUser?.role === 'admin' ? 'Admin' : 'User'}</p>
              </div>
              <div>
                <span className='text-gray-600'>Trạng thái:</span>
                <p className='font-medium text-green-600'>Đang hoạt động</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AccountInfo
