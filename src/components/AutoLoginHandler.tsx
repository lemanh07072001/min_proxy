'use client'

import { useEffect } from 'react'

import { useSearchParams } from 'next/navigation'

import { toast } from 'react-toastify'

export default function AutoLoginHandler() {
  const searchParams = useSearchParams()
  const autoLogin = searchParams.get('auto_login')

  useEffect(() => {
    if (autoLogin === 'true') {
      const tempToken = localStorage.getItem('temp_access_token')
      
      if (tempToken) {
        // Xóa token tạm thời
        localStorage.removeItem('temp_access_token')
        
        // Hiển thị thông báo đăng nhập thành công
        toast.success('Đăng nhập tự động thành công!')
        
        // Có thể thêm logic để lưu token vào session ở đây
        // hoặc gọi API để lấy thông tin user và tạo session
        console.log('Auto login với token:', tempToken)
      }
    }
  }, [autoLogin])

  return null // Component này không render gì
}
