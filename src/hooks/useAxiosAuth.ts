import { useEffect } from 'react'

import { useSession, signOut } from 'next-auth/react'

import axiosInstance from '@/libs/axios' // Import instance axios singleton

const useAxiosAuth = () => {
  const { data: session } = useSession()

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      config => {
        if ((session as any)?.access_token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${(session as any).access_token}`
        }

        return config
      },
      error => Promise.reject(error)
    )

    const responseInterceptor = axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        const errMsg = error?.response?.data?.error || error?.message

        // 🟥 Nếu backend báo JWT lỗi, tự logout
        if (
          error.response?.status === 401 ||
          errMsg?.includes('JWT') ||
          errMsg?.includes('JWE') ||
          errMsg?.includes('decryption')
        ) {
          console.warn('🔴 Token lỗi hoặc session hỏng → logout...')
          const currentPath = window.location.pathname
          const callbackUrl = currentPath.includes('/login') ? '/' : currentPath

          await signOut({ callbackUrl })
        }

        return Promise.reject(error)
      }
    )

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor)
      axiosInstance.interceptors.response.eject(responseInterceptor)
    }
  }, [session])

  return axiosInstance
}

export default useAxiosAuth
