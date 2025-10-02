import { useState } from 'react'

import { Mail, Phone, MapPin, Calendar, CreditCard as Edit2, Save, X } from 'lucide-react'

const AccountInfo = () => {
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    fullName: 'Nguyễn Văn Admin',
    email: 'admin@mktproxy.com',
    phone: '+84 987 654 321',
    address: 'Hà Nội, Việt Nam',
    dateOfBirth: '1990-01-01',
    company: 'MKT Proxy Solutions'
  })

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
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
                onClick={handleSave}
                className='flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors'
              >
                <Save className='w-4 h-4' />
                <span>Lưu</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Họ và tên</label>
            <input
              type='text'
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              disabled={!isEditing}
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='email'
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className='w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Số điện thoại</label>
            <div className='relative'>
              <Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='tel'
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className='w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Ngày sinh</label>
            <div className='relative'>
              <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='date'
                value={formData.dateOfBirth}
                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                disabled={!isEditing}
                className='w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Công ty</label>
            <input
              type='text'
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              disabled={!isEditing}
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Địa chỉ</label>
            <div className='relative'>
              <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='text'
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                className='w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600'
              />
            </div>
          </div>
        </div>

        <div className='mt-8 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200'>
          <h3 className='font-semibold text-gray-900 mb-2'>Thông tin tài khoản</h3>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm'>
            <div>
              <span className='text-gray-600'>Ngày tạo:</span>
              <p className='font-medium text-gray-900'>01/01/2024</p>
            </div>
            <div>
              <span className='text-gray-600'>Loại tài khoản:</span>
              <p className='font-medium text-gray-900'>Premium</p>
            </div>
            <div>
              <span className='text-gray-600'>Trạng thái:</span>
              <p className='font-medium text-green-600'>Đang hoạt động</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountInfo
