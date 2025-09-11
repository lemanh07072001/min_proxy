// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import axiosInstance from '@/libs/axios'
import axios from 'axios'

// Extend types for custom properties
declare module 'next-auth' {
  interface Session {
    access_token?: string
    error?: string
    user: { id: string; email: string; name: string }
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

// Laravel JWT refresh (dùng access token cũ)
async function refreshAccessToken(token: JWT) {
  // --- BẮT ĐẦU DEBUG ---
  console.log("===================================");
  console.log("ATTEMPTING TO REFRESH TOKEN AT:", new Date().toISOString());
  console.log("API Endpoint:", `${process.env.NEXT_PUBLIC_API_URL}/refresh`);
  console.log("Token received by refresh function:", token);
  console.log("Access Token String being sent:", token.access_token);
  console.log("Token expires at (timestamp):", token.accessTokenExpires);
  console.log("Current time (timestamp):", Date.now());
  console.log("===================================");
  // --- KẾT THÚC DEBUG ---

  try {
    const res = await axios.post(
      `${process.env.API_URL}/refresh`,
      {},
      { headers: { Authorization: `Bearer ${token.access_token}` } }
    );
    const data = res.data

    console.log(data)
    
    return {
      ...token,
      access_token: data.access_token,
      accessTokenExpires: Date.now() + (data.expires_in || 3600) * 1000,
      error: undefined
    }
  } catch (err: any) {
    console.error('❌ Refresh token failed:', err.message || err)
    return { ...token, access_token: undefined, error: 'RefreshAccessTokenError' }
  }
}

// Reset token helper
function resetToken(token: JWT) {
  return { ...token, access_token: undefined, accessTokenExpires: undefined, error: 'TokenReset' }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }
        const apiUrl = process.env.API_URL || 'http://localhost:8000'

        try {
          const res = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
          console.error('Login error:', err)
          return null
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],

  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },

  callbacks: {
    async jwt({ token, user, account }) {
      // ---- Lần đăng nhập đầu tiên ----
      if ( account) {
        return {
          access_token: user.access_token,
          accessTokenExpires: user.accessTokenExpires,
          userData: user.userData,
          
          // Lấy các giá trị cần thiết mà NextAuth cần từ user
          name: user.userData?.name,
          email: user.userData?.email,
          // `sub` (subject) thường là user id, rất quan trọng cho NextAuth
          sub: user.userData?.id, 
        };
      }
  
      if (!token.access_token) {
          return token;
      }
  
      // Thời gian đệm an toàn
      const safetyBuffer = 20 * 1000;
  
      // Kiểm tra và refresh token
      if (token.accessTokenExpires && Date.now() >= (token.accessTokenExpires - safetyBuffer)) {
        console.log("Token is expiring, attempting to refresh...");
        return refreshAccessToken(token); // Gọi hàm refresh của bạn
      }
  
      // Token còn hiệu lực, trả về như cũ
      return token;
    },
  
    async session({ session, token }) {
      // Gán dữ liệu từ token "sạch" của chúng ta vào session để client sử dụng
      session.user = token.userData || session.user;
      session.access_token = token.access_token;
      session.error = token.error;
      
      return session;
    }
  },
  

  events: {
    async signOut({ token }) {
      console.log('🧹 Reset token on sign out')

    }
  }
}
