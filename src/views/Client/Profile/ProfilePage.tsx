'use client'

import { useState, useRef } from 'react'

import { User, Lock, Settings, Camera } from 'lucide-react'

import { useSession } from 'next-auth/react'
import Alert from '@mui/material/Alert'

import AccountInfo from './AccountInfo'
import ChangePassword from './ChangePassword'
import SettingsPanel from './SettingsPanel'
import useAxiosAuth from '@/hooks/useAxiosAuth'

type TabType = 'account' | 'password' | 'settings'

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

export default function ProfilePage({ dataProfile }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>('account')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const axiosAuth = useAxiosAuth()
  const { data: session, status } = useSession()

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    // Hiển thị preview
    const reader = new FileReader()

    reader.onloadend = () => setAvatar(reader.result as string)
    reader.readAsDataURL(file)

    // 🔹 Gửi API upload
    const formData = new FormData()

    formData.append('avatar', file)

    try {
      const res = await axiosAuth.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setMessage('Đổi ảnh thành công! Vui lòng đăng xuất để cập nhật.')
      console.log('Avatar uploaded:', res.data)
    } catch (error: any) {
      console.error('❌ Upload failed:', error.response?.data || error.message)
    }
  }

  const tabs = [
    { id: 'account' as TabType, label: 'Thông tin tài khoản', icon: User },
    { id: 'password' as TabType, label: 'Đổi mật khẩu', icon: Lock },
    { id: 'settings' as TabType, label: 'Cài đặt', icon: Settings }
  ]

  return (
    <div className=''>
      {message && (
        <Alert severity='success' sx={{ textAlign: 'center' }}>
          {message}
        </Alert>
      )}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-100'>
              <div className='p-6 bg-gradient-to-br from-orange-500 to-orange-600'>
                <div className='flex flex-col items-center'>
                  <div className='relative group'>
                    <div className='w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden'>
                      {avatar ? (

                        // 👉 Ảnh xem trước (base64 hoặc URL blob)
                        <img src={avatar} alt='Preview Avatar' className='w-full h-full object-cover' />
                      ) : session?.user?.avatar ? (

                        // 👉 Ảnh avatar hiện tại từ session
                        <img src={session.user.avatar} alt='Avatar' className='w-full h-full object-cover' />
                      ) : (

                        // 👉 Chưa có ảnh => hiển thị ký tự đầu tên
                        <span className='text-4xl font-bold text-orange-600'>
                          {session?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleAvatarClick}
                      className='absolute inset-0 w-24 h-24 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'
                    >
                      <Camera className='w-6 h-6 text-white' />
                    </button>
                    <input
                      ref={fileInputRef}
                      type='file'
                      accept='image/*'
                      onChange={handleFileChange}
                      className='hidden'
                    />
                  </div>
                  <h3 className='mt-4 text-lg font-bold text-white'>{dataProfile?.name}</h3>
                  <p className='text-orange-100 text-sm'>{dataProfile?.email}</p>
                </div>
              </div>

              <nav className='p-4'>
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-2 ${
                      activeTab === tab.id
                        ? 'bg-orange-50 text-orange-600 shadow-sm'
                        : 'text-gray-700  bg-white  hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className='w-5 h-5' />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className='lg:col-span-3'>
            {activeTab === 'account' && <AccountInfo dataUser={dataProfile} />}
            {activeTab === 'password' && <ChangePassword />}
            {activeTab === 'settings' && <SettingsPanel />}
          </div>
        </div>
      </div>
    </div>
  )
}
