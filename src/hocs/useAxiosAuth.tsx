import { useEffect } from 'react'

import { useSession, signOut } from 'next-auth/react'

import axiosInstance from '@/libs/axios' // Import instance axios singleton

/**
 * Hook tùy chỉnh để tích hợp Axios với NextAuth.
 * Tự động đính kèm token vào request và xử lý refresh token khi cần.
 */
const useAxiosAuth = () => {
  const { data: session, update: updateSession } = useSession()

  useEffect(() => {
    // === 1. Request Interceptor ===
    // Mục đích: Gắn token vào header của mọi request gửi đi.
    const requestInterceptor = axiosInstance.interceptors.request.use(
      config => {
        // Không ghi đè header Authorization nếu nó đã tồn tại.
        if (session?.access_token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${session.access_token}`
        }

        return config
      },
      error => Promise.reject(error)
    )

    // === 2. Response Interceptor ===
    // Mục đích: Xử lý các response trả về, đặc biệt là lỗi 401.
    const responseInterceptor = axiosInstance.interceptors.response.use(
      // Trường hợp response thành công (status 2xx)
      response => {
        // Không cần làm gì thêm, chỉ cần trả về response
        return response
      },

      // Trường hợp response bị lỗi
      async error => {
        const originalRequest = error.config

        // Chỉ xử lý lỗi 401 (Unauthorized) và đảm bảo request chưa được thử lại
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true // Đánh dấu là đã thử lại để tránh lặp vô hạn

          try {
            console.log('[AXIOS HOOK] 🔄 Token hết hạn, đang yêu cầu session mới...')

            // Kích hoạt callback `jwt` ở server-side để làm mới token.
            // Đây là cách làm "chính thống" của NextAuth.
            const newSession = await updateSession()

            if (newSession?.access_token) {
              console.log('[AXIOS HOOK] ✅ Session đã được làm mới, đang thử lại request...')

              // Cập nhật token cho request hiện tại và các request sau này
              axiosInstance.defaults.headers.common.Authorization = `Bearer ${newSession.access_token}`
              originalRequest.headers.Authorization = `Bearer ${newSession.access_token}`

              // Thực hiện lại request ban đầu với token mới
              return axiosInstance(originalRequest)
            } else {
              // Nếu updateSession không trả về token mới, refresh đã thất bại.
              // Lúc này callback `jwt` có thể đã đánh dấu session.error
              console.error('[AXIOS HOOK] ❌ Không nhận được session mới. Đăng xuất...')
              await signOut() // Đăng xuất người dùng

              return Promise.reject(error)
            }
          } catch (refreshError) {
            console.error('[AXIOS HOOK] ❌ Refresh token thất bại hoàn toàn. Đăng xuất...', refreshError)
            await signOut() // Đăng xuất người dùng

            return Promise.reject(error)
          }
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
