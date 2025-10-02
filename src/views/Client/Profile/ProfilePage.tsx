'use client'

import { useState, useRef } from 'react'

import { User, Lock, Settings, Camera } from 'lucide-react'

import AccountInfo from './AccountInfo'
import ChangePassword from './ChangePassword'
import SettingsPanel from './SettingsPanel'

type TabType = 'account' | 'password' | 'settings'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('account')
  const [avatar, setAvatar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }

      reader.readAsDataURL(file)
    }
  }

  const tabs = [
    { id: 'account' as TabType, label: 'Thông tin tài khoản', icon: User },
    { id: 'password' as TabType, label: 'Đổi mật khẩu', icon: Lock },
    { id: 'settings' as TabType, label: 'Cài đặt', icon: Settings }
  ]

  return (
    <div className=''>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Hồ sơ cá nhân</h1>
          <p className='text-gray-600 mt-2'>Quản lý thông tin tài khoản và cài đặt của bạn</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
              <div className='p-6 bg-gradient-to-br from-orange-500 to-orange-600'>
                <div className='flex flex-col items-center'>
                  <div className='relative group'>
                    <div className='w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden'>
                      {avatar ? (
                        <img src={avatar} alt='Avatar' className='w-full h-full object-cover' />
                      ) : (
                        <span className='text-4xl font-bold text-orange-600'>A</span>
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
                  <h3 className='mt-4 text-lg font-bold text-white'>Admin</h3>
                  <p className='text-orange-100 text-sm'>admin@mktproxy.com</p>
                </div>
              </div>

              <nav className='p-4'>
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-2 ${
                      activeTab === tab.id ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-gray-700 hover:bg-gray-50'
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
            {activeTab === 'account' && <AccountInfo />}
            {activeTab === 'password' && <ChangePassword />}
            {activeTab === 'settings' && <SettingsPanel />}
          </div>
        </div>
      </div>
    </div>
  )
}
