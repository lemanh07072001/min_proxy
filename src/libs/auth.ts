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

// Refresh token từ Laravel
async function refreshAccessToken(token: JWT) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/refresh`
    const res = await axiosInstance.post(
      url,
      { refresh_token: token.refreshToken },
      { headers: { Accept: 'application/json' } }
    )
    const data = res.data

    return {
      ...token,
      access_token: data.access_token,
      accessTokenExpires: Date.now() + (data.expires_in || 3600) * 1000,
      refreshToken: data.refresh_token,
      error: undefined
    }
  } catch (err: any) {
    console.error('❌ Refresh token failed:', err.message || err)
    return { ...token, access_token: undefined, error: 'RefreshAccessTokenError' }
  }
}

// Reset token helper
function resetToken(token: JWT) {
  return { ...token, access_token: undefined, accessTokenExpires: undefined, refreshToken: undefined, error: 'TokenReset' }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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
            refreshToken: data.refresh_token,
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
    async jwt({ token, user }) {
      // Login lần đầu
      if (user) return { ...token, ...user }

      // Token hết hạn → refresh
      if (token.accessTokenExpires && Date.now() >= token.accessTokenExpires) {
        const refreshed = await refreshAccessToken(token)
        if (refreshed.access_token) return refreshed
        return resetToken(token) // Refresh fail → reset token
      }

      // Token còn hiệu lực
      return token
    },

    async session({ session, token }) {
      session.user = token.userData || session.user
      session.access_token = token.access_token
      session.error = token.error
      return session
    }
  },

  events: {
    async signOut({ token }) {
      console.log('🧹 Reset token on sign out')
      resetToken(token)
    }
  }
}
