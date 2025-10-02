import React, { useState } from 'react'
import type { SyntheticEvent } from 'react'

import { X, User, Mail, Phone, MapPin, Calendar, Camera, Edit3, Save, Settings, Star, Award, Heart } from 'lucide-react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useSelector } from 'react-redux'

import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@/components/modals/DialogCloseButton'
import { useModalContext } from '@/app/contexts/ModalContext'

import type { RootState } from '@/store'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user?: {
    id: string
    name: string
    email: string
    phone: string
    location: string
    joinDate: string
    avatar: string
    bio: string
    role: string
    verified: boolean
    stats: {
      posts: number
      followers: number
      following: number
    }
  }
}

const changePasswordSchema = yup
  .object({
    password: yup.string().required('Mật khẩu mới là bắt buộc').min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    confirmPassword: yup
      .string()
      .required('Vui lòng xác nhận mật khẩu')
      .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
  })
  .required()

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('info')

  const { user } = useSelector((state: RootState) => state.user)
  const { openAuthModal } = useModalContext()


  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    // Sử dụng schema đã định nghĩa ở trên
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
    mode: 'onTouched'
  })

  const onSubmit = (data: { password: string; confirmPassword: string }) => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        console.log('Dữ liệu form hợp lệ:', data)
        alert('Đổi mật khẩu thành công!')
        
        // Đóng modal profile
        onClose()
        
        // Mở modal login
        openAuthModal('login')
        
        resolve()
      }, 1000)
    })
  }

  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby='customized-dialog-title'
        open={isOpen}
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle
          id='customized-dialog-title'
          sx={{
            padding: 0,
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <div className='relative bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 px-6 py-8'>
            {/* Profile Header */}
            <div className='flex items-center space-x-6'>
              <div className='relative'>
                <img
                  // src={editedUser.avatar}
                  // alt={editedUser.name}
                  className='w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover'
                />
                <button className='absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors'>
                  <Camera size={16} className='text-gray-600' />
                </button>
                <div className='absolute -top-1 -right-1 bg-blue-500 p-1 rounded-full'>
                  <Star size={12} className='text-white fill-current' />
                </div>
              </div>

              <div className='flex-1 text-white'>
                <h2 className='text-2xl font-bold'>dsada</h2>

                <div className='flex items-center space-x-2 mt-1'>
                  <Award size={16} className='text-yellow-300' />
                  {/* <span className='text-sm opacity-90'>{editedUser.role}</span> */}
                </div>

                <div className='flex items-center space-x-2 mt-2'>
                  <Calendar size={14} className='opacity-75' />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className='flex justify-center space-x-8 mt-6 pt-4 border-t border-white border-opacity-20'></div>
          </div>
          <DialogCloseButton onClick={onClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent
          sx={{
            padding: '16px',
            width: '100%',
            '&.MuiDialogContent-root': {
              paddingTop: '16px'
            }
          }}
        >
          <TabContext value={activeTab}>
            <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
              <Tab value='info' label='Thông tin' />
              <Tab value='change_pass' label='Đổi mật khẩu' />
              <Tab value='setting' label='Setting' />
            </TabList>
            <TabPanel value='info'>
              <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <CustomTextField fullWidth label='Email' placeholder='Placeholder' aria-readonly />
                  </div>
                  <div className='space-y-2'>
                    <CustomTextField fullWidth label='UserName' placeholder='Placeholder' aria-readonly />
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value='change_pass'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* --- Trường Mật khẩu mới --- */}
                    <div className='space-y-2'>
                      <Controller
                        name='password'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            type='password'
                            label='Mật khẩu mới'
                            placeholder='********'
                            error={!!errors.password}
                            helperText={errors.password?.message}
                          />
                        )}
                      />
                    </div>

                    {/* --- Trường Xác nhận mật khẩu --- */}
                    <div className='space-y-2'>
                      <Controller
                        name='confirmPassword'
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            type='password'
                            label='Xác nhận mật khẩu'
                            placeholder='********'
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className='flex justify-end mt-4'>
                  <Button type='submit' disabled={isSubmitting} variant='tonal' color='secondary'>
                    {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </form>
            </TabPanel>
            <TabPanel value='setting'>
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-gray-900'>Cài đặt tài khoản</h3>

                  <div className='space-y-3'>
                    <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                      <span className='text-gray-700'>Thông báo email</span>
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input type='checkbox' className='sr-only peer' defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                      <span className='text-gray-700'>Hiển thị trạng thái online</span>
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input type='checkbox' className='sr-only peer' defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                      <span className='text-gray-700'>Cho phép tin nhắn từ người lạ</span>
                      <label className='relative inline-flex items-center cursor-pointer'>
                        <input type='checkbox' className='sr-only peer' />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabContext>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserProfileModal
