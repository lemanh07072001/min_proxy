// Third-party Imports
import CredentialsProvider from 'next-auth/providers/credentials'

// Đã loại bỏ logic refresh token - khi token hết hạn sẽ logout luôn

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
          } as any
        } catch (error) {
          return null
        }
      }
    })
  ],

  session: {
    strategy: 'jwt'
  },

  pages: {
    signIn: '/login',
  },

  callbacks: {
    // /**
    //  * Callback để xử lý redirect sau khi login
    //  */
    // async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
    //   // Nếu URL là relative, thêm baseUrl
    //   if (url.startsWith('/')) {
    //     return `${baseUrl}${url}`
    //   }
    //   // Nếu URL là absolute và cùng domain, cho phép
    //   if (url.startsWith(baseUrl)) {
    //     return url
    //   }
    //   // Mặc định redirect về overview
    //   return `${baseUrl}/overview`
    // },

    /**
     * Callback này được gọi mỗi khi JWT được tạo hoặc cập nhật.
     * Dữ liệu trong `token` sẽ được truyền đến callback `session`.
     */
    async jwt({ token, user, account, trigger, session }: any) {
      // 1. Khi user đăng nhập lần đầu
      if (user && account) {

        return {
          ...token,
          access_token: (user as any).access_token,
          accessTokenExpires: (user as any).accessTokenExpires,
          role: (user as any).role,
          userData: (user as any).userData
        }
      }

      // 2. Khi client gọi `updateSession` để đồng bộ token mới
      if (trigger === 'update' && session?.access_token) {

        return {
          ...token,
          access_token: session.access_token,
          accessTokenExpires: session.accessTokenExpires,
          error: undefined // Xóa lỗi khi client cung cấp token mới
        }
      }

      // 3. Khi các request sau đó diễn ra, kiểm tra xem token có còn hạn không
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token // Token còn hạn
      }

      // 4. Nếu token đã hết hạn, đánh dấu lỗi để client logout
      return {
        ...token,
        error: 'TokenExpiredError' // Đánh dấu lỗi để client xử lý logout
      }
    },

    /**
     * Callback này được gọi mỗi khi session được truy cập từ client.
     * Nó nhận dữ liệu từ callback `jwt` để xây dựng object session cho client.
     */
    async session({ session, token }: any) {
      // Gửi các thông tin cần thiết về cho client
      if (token) {
        (session as any).user = token.userData || (session as any).user;
        (session as any).access_token = token.access_token;
        (session as any).role = (token as any).role;
        (session as any).error = token.error;
      }

      return session
    }
  }
}
