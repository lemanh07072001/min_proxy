import { useEffect } from 'react'

import { useRouter, usePathname } from 'next/navigation'

import { useSession, signOut } from 'next-auth/react'
import type { Session } from 'next-auth'

import axiosInstance from '@/libs/axios'

let isRefreshing = false
let failedQueue: {
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}[] = []

const processQueue = (error: Error | null, token: string | null = null) => {
  console.log(
    '📦 [processQueue] Processing queue, token:',
    token ? 'present' : 'null',
    'error:',
    error?.message || 'none'
  )

  failedQueue.forEach(prom => {
    if (error || !token) {
      const rejectError = error || new Error('Token refresh failed: no token available')

      console.log('❌ [processQueue] Rejecting request with error:', rejectError.message)
      prom.reject(rejectError)
    } else {
      console.log('✅ [processQueue] Resolving request with new token')
      prom.resolve(token)
    }
  })

  failedQueue = []
}

const useAxiosAuth = () => {
  const { data: session, update: updateSession } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      config => {
        if (session?.access_token && !config.headers?.Authorization) {
          config.headers.Authorization = `Bearer ${session.access_token}`
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
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
              .then(token => {
                if (!token) {
                  const error = new Error('No token from queue - refresh failed')

                  throw error
                }

                originalRequest.headers.Authorization = `Bearer ${token}`

                return axiosInstance(originalRequest)
              })
              .catch(error => {
                throw error
              })
          }

          originalRequest._retry = true
          isRefreshing = true

          console.log(session)

          try {
            // Gọi API refresh trực tiếp
            const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.access_token}`
              }
            })

            if (!refreshResponse.ok) {
              throw new Error('Failed to refresh token')
            }

            const refreshData = await refreshResponse.json()

            console.log(refreshData)
            console.log(refreshData.access_token)

            if (!refreshData.access_token) {
              throw new Error('No access token in refresh response')
            }

            // Update session với token mới
            await updateSession({
              access_token: refreshData.access_token,
              accessTokenExpires: Date.now() + (refreshData.expires_in || 3600) * 1000,
              error: undefined
            })

            const newToken = refreshData.access_token

            axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`

            processQueue(null, newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`

            return axiosInstance(originalRequest)
          } catch (refreshError: any) {
            const error = new Error(`Token refresh failed: ${refreshError.message || 'Unknown error'}`)

            processQueue(error, null)

            await signOut({ redirect: false })

            return Promise.reject(error)
          } finally {
            isRefreshing = false
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
  }, [session, updateSession, router, pathname])

  return axiosInstance
}

export default useAxiosAuth
