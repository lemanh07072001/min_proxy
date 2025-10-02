import { useEffect } from 'react'

import { useSession, signOut } from 'next-auth/react'

import axiosInstance from '@/libs/axios' // Import instance axios singleton

/**
 * Hook tùy chỉnh để tích hợp Axios với NextAuth.
 * Tự động đính kèm token vào request và logout khi token hết hạn.
 */
const useAxiosAuth = () => {
  const { data: session, update: updateSession } = useSession()

  useEffect(() => {
    // === 1. Request Interceptor ===
    // Mục đích: Gắn token vào header của mọi request gửi đi.
    const requestInterceptor = axiosInstance.interceptors.request.use(
      config => {
        // Không ghi đè header Authorization nếu nó đã tồn tại.
        if ((session as any)?.access_token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${(session as any).access_token}`
        }

        return config
      },
      error => Promise.reject(error)
    )

    // === 2. Response Interceptor ===
    // Mục đích: Xử lý các response trả về, logout ngay khi gặp lỗi 401.
    const responseInterceptor = axiosInstance.interceptors.response.use(
      // Trường hợp response thành công (status 2xx)
      response => {
        // Không cần làm gì thêm, chỉ cần trả về response
        return response
      },

      // Trường hợp response bị lỗi
      async error => {
        // Xử lý lỗi 401 (Unauthorized) - logout ngay lập tức
        if (error.response?.status === 401) {
          console.log('[AXIOS HOOK] ❌ Token hết hạn hoặc không hợp lệ, đang logout...')
          await signOut() // Đăng xuất người dùng ngay lập tức
        }

        return Promise.reject(error)
      }
    )

    // === 3. Cleanup Function ===
    // Hàm này sẽ được gọi khi component unmount.
    // Rất quan trọng để tránh memory leak và việc đăng ký interceptor nhiều lần.
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor)
      axiosInstance.interceptors.response.eject(responseInterceptor)
    }
  }, [session, updateSession]) // Effect sẽ chạy lại nếu session thay đổi

  return axiosInstance // Trả về instance của axios đã được "tăng cường"
}

export default useAxiosAuth
