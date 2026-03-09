import axios from 'axios'

import { PUBLIC_API_URL } from '@/config/api'

const axiosInstance = axios.create({
  baseURL: PUBLIC_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// --- Singleton interceptor pattern ---
// Token và auth error handler được quản lý ở module level
// để tránh stacking interceptors khi nhiều component gọi useAxiosAuth()

let _accessToken: string | null = null
let _onAuthError: (() => void) | null = null
let _onRefresh: (() => Promise<void>) | null = null

export function setAccessToken(token: string | null) {
  _accessToken = token
}

export function setOnAuthError(fn: () => void) {
  _onAuthError = fn
}

export function setOnRefresh(fn: () => Promise<void>) {
  _onRefresh = fn
}

// Request interceptor - đăng ký 1 LẦN DUY NHẤT
axiosInstance.interceptors.request.use(
  config => {
    if (_accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${_accessToken}`
    }

    return config
  },
  error => Promise.reject(error)
)

// Response interceptor - đăng ký 1 LẦN DUY NHẤT
// Gặp 401 → thử refresh session 1 lần → retry request → nếu vẫn fail mới signOut
let _isRefreshing = false
let _refreshPromise: Promise<void> | null = null

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    const errMsg = error?.response?.data?.error || error?.message

    const isAuthError =
      error.response?.status === 401 ||
      errMsg?.includes('JWT') ||
      errMsg?.includes('JWE') ||
      errMsg?.includes('decryption')

    // Nếu là lỗi auth và chưa retry lần nào
    if (isAuthError && !originalRequest._retried) {
      originalRequest._retried = true

      if (_onRefresh) {
        try {
          // Dedup: nhiều request cùng gặp 401 → chỉ refresh 1 lần
          if (!_isRefreshing) {
            _isRefreshing = true
            _refreshPromise = _onRefresh().finally(() => {
              _isRefreshing = false
              _refreshPromise = null
            })
          }

          await _refreshPromise

          // Retry với token mới (request interceptor tự gắn)
          delete originalRequest.headers.Authorization

          return axiosInstance(originalRequest)
        } catch {
          console.warn('🔴 Refresh thất bại → logout...')
          _onAuthError?.()

          return Promise.reject(error)
        }
      }

      // Không có _onRefresh → logout luôn
      console.warn('🔴 Token lỗi hoặc session hỏng → logout...')
      _onAuthError?.()
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
