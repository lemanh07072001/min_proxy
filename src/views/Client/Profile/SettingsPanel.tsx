import { useState } from 'react'

import { Bell, Shield, Globe, Moon, Mail, Smartphone, CreditCard, Download } from 'lucide-react'

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    promotionalEmails: false,
    twoFactorAuth: true,
    sessionTimeout: true,
    darkMode: false,
    language: 'vi',
    currency: 'VND',
    autoRenew: true
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  return (
    <div className='space-y-6'>
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
        <div className='p-6 border-b border-gray-100'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-orange-100 rounded-lg'>
              <Bell className='w-5 h-5 text-orange-600' />
            </div>
            <div>
              <h2 className='text-lg font-bold text-gray-900'>Thông báo</h2>
              <p className='text-sm text-gray-600'>Quản lý cách bạn nhận thông báo</p>
            </div>
          </div>
        </div>

        <div className='p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Mail className='w-5 h-5 text-gray-400' />
              <div>
                <p className='font-medium text-gray-900'>Email thông báo</p>
                <p className='text-sm text-gray-600'>Nhận thông báo qua email</p>
              </div>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={settings.emailNotifications}
                onChange={() => toggleSetting('emailNotifications')}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Bell className='w-5 h-5 text-gray-400' />
              <div>
                <p className='font-medium text-gray-900'>Thông báo đẩy</p>
                <p className='text-sm text-gray-600'>Nhận thông báo trên trình duyệt</p>
              </div>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={settings.pushNotifications}
                onChange={() => toggleSetting('pushNotifications')}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Smartphone className='w-5 h-5 text-gray-400' />
              <div>
                <p className='font-medium text-gray-900'>SMS thông báo</p>
                <p className='text-sm text-gray-600'>Nhận thông báo qua tin nhắn</p>
              </div>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={settings.smsNotifications}
                onChange={() => toggleSetting('smsNotifications')}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Mail className='w-5 h-5 text-gray-400' />
              <div>
                <p className='font-medium text-gray-900'>Email khuyến mãi</p>
                <p className='text-sm text-gray-600'>Nhận thông tin về chương trình ưu đãi</p>
              </div>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={settings.promotionalEmails}
                onChange={() => toggleSetting('promotionalEmails')}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
        <div className='p-6 border-b border-gray-100'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <Shield className='w-5 h-5 text-green-600' />
            </div>
            <div>
              <h2 className='text-lg font-bold text-gray-900'>Bảo mật</h2>
              <p className='text-sm text-gray-600'>Cài đặt bảo mật tài khoản</p>
            </div>
          </div>
        </div>

        <div className='p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Shield className='w-5 h-5 text-gray-400' />
              <div>
                <p className='font-medium text-gray-900'>Xác thực hai yếu tố</p>
                <p className='text-sm text-gray-600'>Bảo mật tài khoản với mã OTP</p>
              </div>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={settings.twoFactorAuth}
                onChange={() => toggleSetting('twoFactorAuth')}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Shield className='w-5 h-5 text-gray-400' />
              <div>
                <p className='font-medium text-gray-900'>Tự động đăng xuất</p>
                <p className='text-sm text-gray-600'>Đăng xuất sau 30 phút không hoạt động</p>
              </div>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={settings.sessionTimeout}
                onChange={() => toggleSetting('sessionTimeout')}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
        <div className='p-6 border-b border-gray-100'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Globe className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <h2 className='text-lg font-bold text-gray-900'>Giao diện & Ngôn ngữ</h2>
              <p className='text-sm text-gray-600'>Tùy chỉnh hiển thị</p>
            </div>
          </div>
        </div>

        <div className='p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Moon className='w-5 h-5 text-gray-400' />
              <div>
                <p className='font-medium text-gray-900'>Chế độ tối</p>
                <p className='text-sm text-gray-600'>Sử dụng giao diện tối</p>
              </div>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={settings.darkMode}
                onChange={() => toggleSetting('darkMode')}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Ngôn ngữ</label>
            <select
              value={settings.language}
              onChange={e => setSettings({ ...settings, language: e.target.value })}
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='vi'>Tiếng Việt</option>
              <option value='en'>English</option>
              <option value='zh'>中文</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Đơn vị tiền tệ</label>
            <select
              value={settings.currency}
              onChange={e => setSettings({ ...settings, currency: e.target.value })}
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            >
              <option value='VND'>VND (₫)</option>
              <option value='USD'>USD ($)</option>
              <option value='EUR'>EUR (€)</option>
            </select>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
        <div className='p-6 border-b border-gray-100'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-purple-100 rounded-lg'>
              <CreditCard className='w-5 h-5 text-purple-600' />
            </div>
            <div>
              <h2 className='text-lg font-bold text-gray-900'>Thanh toán</h2>
              <p className='text-sm text-gray-600'>Cài đặt thanh toán và hóa đơn</p>
            </div>
          </div>
        </div>

        <div className='p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <CreditCard className='w-5 h-5 text-gray-400' />
              <div>
                <p className='font-medium text-gray-900'>Tự động gia hạn</p>
                <p className='text-sm text-gray-600'>Gia hạn dịch vụ tự động khi hết hạn</p>
              </div>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={settings.autoRenew}
                onChange={() => toggleSetting('autoRenew')}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <button className='w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'>
            <Download className='w-5 h-5' />
            <span>Tải xuống hóa đơn</span>
          </button>
        </div>
      </div>

      <div className='flex justify-end'>
        <button className='px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md font-medium'>
          Lưu tất cả cài đặt
        </button>
      </div>
    </div>
  )
}

export default SettingsPanel
