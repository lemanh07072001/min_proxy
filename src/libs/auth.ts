// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

import axiosInstance from '@/libs/axios'

// Extend types for custom properties
declare module 'next-auth' {
  interface Session {
    access_token?: string
    error?: string
    user: {
      id: string
      email: string
      name: string
    }
  }

  interface User {
    access_token?: string
    accessTokenExpires?: number
    refreshToken?: string
    userData?: any
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token?: string
    accessTokenExpires?: number
    refreshToken?: string
    userData?: any
    error?: string
  }
}

// Laravel JWT có endpoint /refresh để lấy token mới
// Function này sẽ gọi Laravel /refresh endpoint khi token hết hạn
async function refreshAccessToken(token: JWT) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/refresh`

    // Laravel refresh endpoint cần refresh_token để lấy token mới
    const response = await axiosInstance.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`, // Gửi refresh_token thay vì access_token
          Accept: 'application/json'
        }
      }
    )

    const refreshedTokens = response.data

    const newToken = {
      ...token,
      access_token: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + (refreshedTokens.expires_in || 3600) * 1000,
      refreshToken: refreshedTokens.refresh_token, // Lưu refresh token mới từ Laravel
      error: undefined // Clear any previous errors
    }

    return newToken
  } catch (error: any) {
    // Log chi tiết lỗi từ axios
    if (error.response) {
      // Kiểm tra content-type để debug
      const contentType = error.response.headers['content-type']

      if (contentType && !contentType.includes('application/json')) {
        console.error('❌ Non-JSON response from refresh endpoint:', contentType)
        console.error('📄 Response data (first 200 chars):', JSON.stringify(error.response.data).substring(0, 200))
      }
    } else if (error.request) {
      console.error('❌ No response received:', error.request)
    } else {
      console.error('❌ Request setup error:', error.message)
    }

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }

        try {
          // Sử dụng NEXT_PUBLIC_API_URL từ axios config
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

          const res = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          })

          const data = await res.json()

          if (res.status === 401) {
            console.error('Login failed: 401 Unauthorized')

            return null
          }

          if (res.status === 200 && data.user) {
            const userData = {
              id: data.user.id || data.user.email,
              email: data.user.email,
              name: data.user.name,
              access_token: data.access_token,
              accessTokenExpires: Date.now() + (data.expires_in || 3600) * 1000,
              refreshToken: data.refresh_token, // Laravel bây giờ trả về refresh_token
              userData: data.user
            }

            return userData
          }

          return null
        } catch (e: any) {
          console.error('Login error:', e)

          return null
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],

  session: {
    strategy: 'jwt'
  },

  pages: {
    signIn: '/login'
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          access_token: user.access_token,
          accessTokenExpires: user.accessTokenExpires,
          refreshToken: user.refreshToken, // Lưu refresh token từ Laravel
          userData: user.userData
        }
      }

      // Kiểm tra xem token có bị lỗi không
      if (token.error) {
        return token
      }

      // Nếu access token chưa hết hạn, trả về token hiện tại
      if (
        token.accessTokenExpires &&
        typeof token.accessTokenExpires === 'number' &&
        Date.now() < token.accessTokenExpires
      ) {
        return token
      }

      // Nếu access token đã hết hạn
      if (
        token.accessTokenExpires &&
        typeof token.accessTokenExpires === 'number' &&
        Date.now() >= token.accessTokenExpires
      ) {
        const refreshedToken = await refreshAccessToken(token)

        if (refreshedToken.access_token) {
          return {
            ...refreshedToken,
            userData: token.userData // Giữ nguyên userData cũ
          }
        } else {
          console.log('❌ Token refresh failed, marking error:', refreshedToken.error)

          return {
            ...token,
            error: 'RefreshAccessTokenError'
          }
        }
      }

      // Token vẫn còn hiệu lực
      return token
    },

    async session({ session, token }) {
      if (token.userData) {
        session.user = token.userData as any
        session.access_token = token.access_token as string
        session.error = token.error as string

        // Nếu token hết hạn, log cảnh báo
        if (token.error === 'TokenExpired') {
          console.warn('⚠️ WARNING: Token has expired, user needs to login again')
        }
      } else {
        console.log('⚠️ No token data available for session')
      }

      return session
    }
  }
}
