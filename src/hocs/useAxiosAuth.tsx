import { useEffect } from 'react'

import { useSession, signOut } from 'next-auth/react'
import type { Session } from 'next-auth'

import axiosInstance from '@/libs/axios'

// Đã xóa logic client-side refresh, chỉ dùng server-side

const useAxiosAuth = () => {
  const { data: session, update: updateSession } = useSession()

  useEffect(() => {
    // Kiểm tra và cập nhật token khi component mount (sau F5)
    if ((session as any)?.access_token) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${(session as any).access_token}`
    }

    const requestInterceptor = axiosInstance.interceptors.request.use(
      config => {
        if ((session as any)?.access_token && !config.headers?.Authorization) {
          config.headers.Authorization = `Bearer ${(session as any).access_token}`
        }

        return config
      },
      error => Promise.reject(error)
    )

    const responseInterceptor = axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config


        if (error.response?.status === 401 && !originalRequest._retry) {
          // Kiểm tra nếu session có error (server refresh đã thất bại)
          if ((session as any)?.error === 'RefreshAccessTokenError') {
            console.log('❌ [Client] Server refresh failed previously, signing out...')
            await signOut({ redirect: false })

            return Promise.reject(new Error('Server refresh failed'))
          }

          console.log('🔄 [Client] Received 401, attempting token refresh...')

          // Đánh dấu request đã retry để tránh loop
          originalRequest._retry = true

          try {
            // Gọi updateSession để trigger JWT callback refresh
            const newSession = await updateSession()

            if (newSession?.access_token) {
              console.log('✅ [Client] Token refreshed successfully, retrying request...')

              // Cập nhật token cho request hiện tại và axios defaults
              originalRequest.headers.Authorization = `Bearer ${newSession.access_token}`
              axiosInstance.defaults.headers.common.Authorization = `Bearer ${newSession.access_token}`

              // Thử lại request ban đầu với token mới
              return axiosInstance(originalRequest)
            } else {
              console.log('❌ [Client] No new token received, signing out...')
              await signOut({ redirect: false })

              return Promise.reject(new Error('Token refresh failed'))
            }
          } catch (refreshError) {
            console.error('❌ [Client] Token refresh failed, signing out...', refreshError)
            await signOut({ redirect: false })

            return Promise.reject(new Error('Token refresh failed'))
          }
        }

        return Promise.reject(error)
      }
    )

    return () => {
      console.log('🧹 [useAxiosAuth] Ejecting interceptors')
      axiosInstance.interceptors.request.eject(requestInterceptor)
      axiosInstance.interceptors.response.eject(responseInterceptor)
    }
  }, [session, updateSession])

  return axiosInstance
}

export default useAxiosAuth
