// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

// import type { NextAuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

// Biến này sẽ lưu trữ promise của lần refresh đang diễn ra.
let refreshTokenPromise: Promise<JWT | null> | null = null

async function refreshToken(token: JWT): Promise<JWT> {
  if (refreshTokenPromise) {
    console.log('🔄 [Server Debounce] Một lần refresh khác đang chạy, đang chờ kết quả...')

    return await refreshTokenPromise
  }

  // Nếu không có promise nào, tạo một promise mới và gán vào biến toàn cục.
  refreshTokenPromise = (async () => {
    console.log('▶️ [Server Refresh] Bắt đầu quá trình làm mới token...')

    try {
      const res = await fetch(`${process.env.API_URL}/refresh`, {
        // Dùng API_URL cho server
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`
        }
      })

      const refreshedTokens = await res.json()

      console.log(refreshedTokens)

      if (!res.ok) {
        throw refreshedTokens
      }

      console.log('✅ [Server Refresh] Token refreshed successfully.')

      const newToken = {
        ...token,
        access_token: refreshedTokens.access_token,
        accessTokenExpires: Date.now() + (refreshedTokens.expires_in || 3600) * 1000,
        error: undefined
      }

      console.log('🔄 [Server Refresh] Token mới sẽ hết hạn vào:', new Date(newToken.accessTokenExpires))

      return newToken
    } catch (error) {
      console.error('❌ [Server Refresh] Thất bại khi làm mới token:', error)

      return {
        ...token,
        error: 'RefreshAccessTokenError'
      }
    }
  })()

  try {
    // Đợi promise hoàn thành và trả về kết quả
    return await refreshTokenPromise
  } finally {
    // Dọn dẹp promise sau khi nó đã hoàn thành (dù thành công hay thất bại)
    // để các lần refresh sau có thể được thực hiện.
    refreshTokenPromise = null
  }
}

export const authOptions = {
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
            role: data.user.role,
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
      // Khi user login lần đầu
      if (user && account) {
        return {
          ...token,
          access_token: user.access_token,
          accessTokenExpires: user.accessTokenExpires,
          userData: user.userData,
          name: user.userData?.name,
          email: user.userData?.email,
          sub: user.userData?.id,
          role: user.userData?.role
        }
      }

      // Khi client gọi updateSession
      if (trigger === 'update' && session) {
        console.log('🔄 [JWT Callback] Updating token from client...')

        return {
          ...token,
          access_token: session.access_token,
          accessTokenExpires: session.accessTokenExpires,
          error: undefined
        }
      }

      // // Kiểm tra token còn hạn không (refresh trước 5 phút)
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires - 60 * 1000) {
        return token // Token còn hạn lâu
      }

      return refreshToken(token)
    },

    async session({ session, token }: any) {
      session.user = token.userData || session.user
      session.access_token = token.access_token as string
      session.error = token.error as string
      session.role = token.role

      return session
    }
  },

  events: {
    async signOut() {
      // User signed out
    }
  }
}
