// Third-party Imports
import CredentialsProvider from 'next-auth/providers/credentials'

// import type { NextAuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

async function refreshToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(`${process.env.API_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.refresh_token}` // 🧠 dùng refresh token
      }
    })

    const refreshedTokens = await res.json()

    if (!res.ok) throw refreshedTokens

    console.log('✅ [Server Refresh] Refresh thành công.')

    const newToken = {
      ...token,
      access_token: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + (refreshedTokens.expires_in || 3600) * 1000,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      error: undefined
    }

    return newToken
  } catch (error) {
    console.error('❌ [Server Refresh] Lỗi khi làm mới token:', error)

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as { email: string; password: string }
        const apiUrl = process.env.API_URL
        const userAgent = req.headers?.['user-agent'] || ''

        try {
          const res = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': userAgent },
            body: JSON.stringify({ email, password })
          })

          const data = await res.json()

          // Nếu login thất bại hoặc không có data user -> trả về null
          if (!res.ok) {
            // Laravel gửi về message + type
            const msg = data?.message || 'Đăng nhập thất bại'
            const type = data?.type || 'unknown_error'

            // Gắn message + type trong Error
            const err = new Error(msg)

            // @ts-ignore
            err.type = type
            throw err
          }

          // Dữ liệu trả về từ authorize sẽ được truyền vào callback `jwt` thông qua tham số `user`
          return {
            id: data.user.id || data.user.email,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            accessTokenExpires: Date.now() + (data.expires_in || 3600) * 1000,
            role: data.user.role,
            userData: data.user
          } as any
        } catch (error) {
          throw new Error(JSON.stringify({ message: error.message, type: error.type || 'unknown_error' }))
        }
      }
    })
  ],

  session: {
    strategy: 'jwt'
  },

  pages: {
    signIn: '/login'
  },

  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user && account) {
        return {
          ...token,
          access_token: (user as any).access_token,
          accessTokenExpires: (user as any).accessTokenExpires,
          refresh_token: user.refresh_token,
          role: (user as any).role,
          userData: (user as any).userData
        }
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }

      console.log('⚠️ Token hết hạn, đang gọi refresh...')

      return await refreshToken(token)
    },

    async session({ session, token }: any) {
      if (!token) return (null(session as any).user = token.userData || (session as any).user)
      ;(session as any).access_token = token.access_token
      ;(session as any).refresh_token = token.refresh_token
      ;(session as any).role = token.role
      ;(session as any).error = token.error

      return session
    }
  }
}
