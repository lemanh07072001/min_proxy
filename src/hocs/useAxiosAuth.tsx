import { useEffect } from 'react'

import { useSession, signOut } from 'next-auth/react'
import type { Session } from 'next-auth'

import axiosInstance from '@/libs/axios'

let isRefreshing = false
let failedQueue: {
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}[] = []

const processQueue = (error: Error | null, token: string | null = null) => {
  console.log('📦 [processQueue] Processing queue, token:', token, 'error:', error)
  failedQueue.forEach(prom => {
    if (error || !token) {
      prom.reject(error || new Error('No token'))
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const useAxiosAuth = () => {
  const { data: session, update: updateSession } = useSession()

  useEffect(() => {
    console.log('🔗 [useAxiosAuth] Setting up interceptors', new Date().toISOString())

    const requestInterceptor = axiosInstance.interceptors.request.use(
      config => {
        if (session?.access_token && !config.headers?.Authorization) {
          config.headers.Authorization = `Bearer ${session.access_token}`
          console.log('➡️ [request] Added Authorization header')
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
          console.warn('⚠️ [response] 401 detected for', originalRequest.url)

          if (isRefreshing) {
            console.log('🔄 [response] Already refreshing, queuing request')

            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            }).then(token => {
              console.log('✅ [response] Queue retry with new token')
              if (!token) throw new Error('No token from queue')
              originalRequest.headers.Authorization = `Bearer ${token}`

              return axiosInstance(originalRequest)
            })
          }

          originalRequest._retry = true
          isRefreshing = true
          console.log('🔄 [response] Starting token refresh…')

          try {
            const refreshedSession = await updateSession()

            console.log('✅ [response] updateSession result:', refreshedSession)

            if (!refreshedSession?.access_token) {
              throw new Error('Failed to refresh token: no access_token')
            }

            const newToken = refreshedSession.access_token

            axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`

            processQueue(null, newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            console.log('✅ [response] Retrying original request with new token')

            return axiosInstance(originalRequest)
          } catch (refreshError: any) {
            console.error('❌ [response] Critical error during token refresh:', refreshError)
            processQueue(refreshError, null)
            await signOut()

            return Promise.reject(refreshError)
          } finally {
            isRefreshing = false
            console.log('🔓 [response] Refresh flow completed')
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
