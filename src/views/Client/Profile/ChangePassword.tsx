import { useState } from 'react'

import { Lock, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'

const ChangePassword = () => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const [passwordStrength, setPasswordStrength] = useState(0)

  const checkPasswordStrength = (password: string) => {
    let strength = 0

    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    setPasswordStrength(strength)
  }

  const handleNewPasswordChange = (value: string) => {
    setPasswords({ ...passwords, new: value })
    checkPasswordStrength(value)
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500'
    if (passwordStrength === 2) return 'bg-yellow-500'
    if (passwordStrength === 3) return 'bg-blue-500'

    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Yếu'
    if (passwordStrength === 2) return 'Trung bình'
    if (passwordStrength === 3) return 'Khá'

    return 'Mạnh'
  }

  const requirements = [
    { text: 'Ít nhất 8 ký tự', met: passwords.new.length >= 8 },
    { text: 'Chữ hoa và chữ thường', met: /[a-z]/.test(passwords.new) && /[A-Z]/.test(passwords.new) },
    { text: 'Ít nhất một số', met: /\d/.test(passwords.new) },
    { text: 'Ký tự đặc biệt', met: /[^a-zA-Z\d]/.test(passwords.new) }
  ]

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
      <div className='p-6 border-b border-gray-100'>
        <h2 className='text-xl font-bold text-gray-900'>Đổi mật khẩu</h2>
        <p className='text-sm text-gray-600 mt-1'>Cập nhật mật khẩu để bảo mật tài khoản</p>
      </div>

      <div className='p-6'>
        <div className='max-w-2xl space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Mật khẩu hiện tại</label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwords.current}
                onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                className='w-full pl-11 pr-11 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                placeholder='Nhập mật khẩu hiện tại'
              />
              <button
                type='button'
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showPasswords.current ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Mật khẩu mới</label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwords.new}
                onChange={e => handleNewPasswordChange(e.target.value)}
                className='w-full pl-11 pr-11 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                placeholder='Nhập mật khẩu mới'
              />
              <button
                type='button'
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showPasswords.new ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>

            {passwords.new && (
              <div className='mt-3'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm text-gray-600'>Độ mạnh mật khẩu:</span>
                  <span
                    className={`text-sm font-medium ${
                      passwordStrength <= 1
                        ? 'text-red-600'
                        : passwordStrength === 2
                          ? 'text-yellow-600'
                          : passwordStrength === 3
                            ? 'text-blue-600'
                            : 'text-green-600'
                    }`}
                  >
                    {getStrengthText()}
                  </span>
                </div>
                <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                  <div
                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Xác nhận mật khẩu mới</label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                className='w-full pl-11 pr-11 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                placeholder='Nhập lại mật khẩu mới'
              />
              <button
                type='button'
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showPasswords.confirm ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>
            {passwords.confirm && passwords.new !== passwords.confirm && (
              <p className='mt-2 text-sm text-red-600 flex items-center'>
                <XCircle className='w-4 h-4 mr-1' />
                Mật khẩu không khớp
              </p>
            )}
            {passwords.confirm && passwords.new === passwords.confirm && (
              <p className='mt-2 text-sm text-green-600 flex items-center'>
                <CheckCircle2 className='w-4 h-4 mr-1' />
                Mật khẩu khớp
              </p>
            )}
          </div>

          <div className='p-4 bg-gray-50 rounded-xl'>
            <h4 className='text-sm font-medium text-gray-900 mb-3'>Yêu cầu mật khẩu:</h4>
            <div className='space-y-2'>
              {requirements.map((req, index) => (
                <div key={index} className='flex items-center space-x-2'>
                  {req.met ? (
                    <CheckCircle2 className='w-4 h-4 text-green-500 flex-shrink-0' />
                  ) : (
                    <XCircle className='w-4 h-4 text-gray-300 flex-shrink-0' />
                  )}
                  <span className={`text-sm ${req.met ? 'text-green-700' : 'text-gray-600'}`}>{req.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <button
              type='button'
              className='px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium'
            >
              Hủy
            </button>
            <button
              type='submit'
              className='px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md font-medium'
            >
              Cập nhật mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
