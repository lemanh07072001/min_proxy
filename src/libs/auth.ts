// Third-party Imports
import type { NextAuthOptions, User, Account, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

// Biến này lưu trữ promise của lần refresh token đang diễn ra để tránh race condition.
let refreshTokenPromise: Promise<JWT> | null = null

/**
 * Gửi yêu cầu làm mới access token đến API server.
 * @param token JWT token hiện tại chứa access_token.
 * @returns JWT token mới với access_token đã được làm mới, hoặc token cũ với lỗi.
 */
async function refreshToken(token: JWT): Promise<JWT> {
  // Sử dụng cơ chế debounce: nếu đã có một yêu cầu refresh đang chạy,
  // các lệnh gọi khác sẽ chờ và sử dụng kết quả của yêu cầu đó.
  if (refreshTokenPromise) {
    console.log('[AUTH] Một lần refresh khác đang chạy, đang chờ kết quả...')

    return refreshTokenPromise
  }

  refreshTokenPromise = (async () => {
    try {
      console.log('[AUTH] Bắt đầu quá trình làm mới access token...')

      const res = await fetch(`${process.env.API_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`
        }
      })

      const refreshedTokens = await res.json()

      if (!res.ok) {
        throw refreshedTokens
      }

      console.log('[AUTH] ✅ Làm mới token thành công.')

      return {
        // Chỉ giữ lại những thông tin quan trọng từ token cũ
        userData: token.userData,
        role: token.role,

        // Cập nhật các giá trị mới từ API
        access_token: refreshedTokens.access_token,
        accessTokenExpires: Date.now() + (refreshedTokens.expires_in || 3600) * 1000,

        // Xóa lỗi nếu có
        error: undefined
      }
    } catch (error) {
      console.error('[AUTH] ❌ Thất bại khi làm mới token:', error)

      return {
        ...token,
        error: 'RefreshAccessTokenError' // Đánh dấu lỗi để client xử lý
      }
    }
  })()

  try {
    return await refreshTokenPromise
  } finally {
    // Dọn dẹp promise sau khi hoàn thành để các lần gọi sau có thể tạo request mới.
    refreshTokenPromise = null
  }
}

export const authOptions: NextAuthOptions = {
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
          if (!res.ok || !data.user) {
            return null
          }

          // Dữ liệu trả về từ authorize sẽ được truyền vào callback `jwt` thông qua tham số `user`
          return {
            id: data.user.id || data.user.email,
            access_token: data.access_token,
            accessTokenExpires: Date.now() + (data.expires_in || 3600) * 1000,
            role: data.user.role,
            userData: data.user
          } as User
        } catch (error) {
          console.error('[AUTH] Lỗi trong authorize callback:', error)

          return null
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
    /**
     * Callback này được gọi mỗi khi JWT được tạo hoặc cập nhật.
     * Dữ liệu trong `token` sẽ được truyền đến callback `session`.
     */
    async jwt({ token, user, account, trigger, session }) {
      // 1. Khi user đăng nhập lần đầu
      if (user && account) {
        console.log('[AUTH] JWT - Đăng nhập lần đầu')

        console.log('[AUTH] Token nhận được trong callback jwt:', {
          hasToken: !!token.access_token,
          expires: new Date(token.accessTokenExpires)
        })

        return {
          ...token,
          access_token: user.access_token,
          accessTokenExpires: user.accessTokenExpires,
          role: user.role,
          userData: user.userData
        }
      }

      // 2. Khi client gọi `updateSession` để đồng bộ token mới
      if (trigger === 'update' && session?.access_token) {
        console.log('[AUTH] JWT - Client trigger update', trigger)

        return {
          ...token,
          access_token: session.access_token,
          accessTokenExpires: session.accessTokenExpires,
          error: undefined // Xóa lỗi khi client cung cấp token mới
        }
      }

      // 3. Khi các request sau đó diễn ra, kiểm tra xem token có còn hạn không
      // Buffer 1 phút để refresh trước khi hết hạn thực sự
      if (Date.now() < token.accessTokenExpires - 60 * 1000) {
        return token // Token còn hạn
      }

      // 4. Nếu token đã hoặc sắp hết hạn, tiến hành làm mới
      console.log('[AUTH] JWT - Token đã hoặc sắp hết hạn, đang làm mới...')
      const newRefreshedTokenObject = await refreshToken(token)

      return {
        ...token,
        ...newRefreshedTokenObject
      }
    },

    /**
     * Callback này được gọi mỗi khi session được truy cập từ client.
     * Nó nhận dữ liệu từ callback `jwt` để xây dựng object session cho client.
     */
    async session({ session, token }: { session: Session; token: JWT }) {
      // Gửi các thông tin cần thiết về cho client
      if (token) {
        session.user = token.userData || session.user
        session.access_token = token.access_token
        session.role = token.role
        session.error = token.error
      }

      return session
    }
  }
}
