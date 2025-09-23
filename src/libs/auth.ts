// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth/next'
import type { JWT } from 'next-auth/jwt'

// Types are now defined in declarations.d.ts

// Token refresh được xử lý bởi useAxiosAuth
async function refreshToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(`${process.env.API_URL}/refresh`, {
      // Dùng API_URL cho server-side
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.access_token}`
      }
    })

    const refreshedTokens = await res.json()

    console.log('token', refreshedTokens)

    if (!res.ok) {
      throw refreshedTokens
    }

    console.log('✅ [Server Refresh] Token refreshed successfully on server-side.')

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + (refreshedTokens.expires_in || 3600) * 1000,
      error: undefined // Xóa lỗi nếu refresh thành công
    }
  } catch (error) {
    console.error('❌ [Server Refresh] Failed to refresh token on server-side:', error)

    return {
      ...token,
      error: 'RefreshAccessTokenError' // Gắn lỗi để client biết và xử lý
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
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

          if (res.status !== 200 || !data.user) return null

          return {
            id: data.user.id || data.user.email,
            email: data.user.email,
            name: data.user.name,
            access_token: data.access_token,
            accessTokenExpires: Date.now() + (data.expires_in || 3600) * 1000,
            userData: data.user
          }
        } catch (err) {
          return null
        }
      }
    })
  ],

  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },

  callbacks: {
    async jwt({ token, user, account, trigger, session }: any) {
      if (user && account) {
        return {
          ...token,
          access_token: user.access_token,
          accessTokenExpires: user.accessTokenExpires,
          userData: user.userData,
          name: user.userData?.name,
          email: user.userData?.email,
          sub: user.userData?.id
        }
      }

      if (trigger === 'update' && session) {
        console.log('🔄 [JWT Callback] Updating token from client...')

        return {
          ...token,
          access_token: session.access_token,
          accessTokenExpires: session.accessTokenExpires
        }
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        // Chỉ validate token nếu đã gần hết hạn (trong vòng 1 phút)
        const timeUntilExpiry = token.accessTokenExpires - Date.now()
        const oneMinute = 1 * 60 * 1000
        
        if (timeUntilExpiry > oneMinute) {
          return token // Token còn hạn lâu, không cần validate
        }
        
        // Token gần hết hạn, kiểm tra thực tế
        try {
          const response = await fetch(`${process.env.API_URL}/me`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token.access_token}`
            },
            cache: 'no-store'
          })
          
          if (response.ok) {
            return token // Token còn valid
          } else {
            console.log('🔄 [Server] Token expired in reality, refreshing...')
            // Token không còn valid, thử refresh
          }
        } catch (error) {
          console.log('🔄 [Server] Token validation failed, refreshing...')
          // Có lỗi khi validate, thử refresh
        }
      }

      // Token đã hết hạn, thử refresh trên server trước
      // Nếu thất bại, đánh dấu lỗi để client xử lý
      try {
        return await refreshToken(token)
      } catch (error) {
        console.error('❌ [Server] Token refresh failed, marking for client-side refresh')
        return {
          ...token,
          error: 'RefreshAccessTokenError'
        }
      }
    },

    async session({ session, token }: any) {
      session.user = token.userData || session.user
      session.access_token = token.access_token as string
      session.error = token.error as string

      return session
    }
  },

  events: {
    async signOut() {
      // User signed out
    }
  }
}
