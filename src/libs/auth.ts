// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
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

// Laravel JWT refresh
async function refreshAccessToken(token: JWT) {
  console.log('🔄 [refreshAccessToken] START', new Date().toISOString())
  console.log('🔄 Current token before refresh:', token)

  try {
    const res = await axios.post(
      `${process.env.API_URL}/refresh`,
      {},
      { headers: { Authorization: `Bearer ${token.access_token}` } }
    )

    const data = res.data

    console.log('✅ [refreshAccessToken] API response:', data)

    const updatedToken: JWT = {
      ...token,
      access_token: data.access_token,
      accessTokenExpires: Date.now() + (data.expires_in || 3600) * 1000,
      error: undefined
    }

    console.log('✅ [refreshAccessToken] Updated token:', updatedToken)

    return updatedToken
  } catch (err: any) {
    console.error('❌ [refreshAccessToken] Error:', err.message || err)

    return { ...token, access_token: undefined, error: 'RefreshAccessTokenError' }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials,req) {
        console.log('🔑 [authorize] Attempting login', new Date().toISOString())
        const { email, password } = credentials as { email: string; password: string }
        const apiUrl = process.env.API_URL || 'http://localhost:8000'
        const userAgent = req.headers['user-agent'] || ''

        try {
          const res = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','User-Agent': userAgent, },

            body: JSON.stringify({ email, password })
          })

          const data = await res.json()

          console.log('🔑 [authorize] Response:', data)
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
          console.error('❌ [authorize] Login error:', err)

          return null
        }
      }
    })
  ],

  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },

  callbacks: {
    async jwt({ token, user, account }) {
      console.log('⚡ [jwt] callback START', new Date().toISOString())

      if (user && account) {
        console.log('✅ [jwt] First login, attaching token info')

        return {
          ...token,
          access_token: user.access_token,
          accessTokenExpires: user.accessTokenExpires,
          refreshToken: user.refreshToken,
          userData: user.userData,
          name: user.userData?.name,
          email: user.userData?.email,
          sub: user.userData?.id
        }
      }

      if (!token.access_token) {
        console.log('⚠️ [jwt] No access_token present, returning current token')

        return token
      }

      const safetyBuffer = 60 * 1000

      if (token.accessTokenExpires && Date.now() >= token.accessTokenExpires - safetyBuffer) {
        console.log('🔄 [jwt] Token expiring, refreshing now...')

        return await refreshAccessToken(token)
      }

      console.log('✅ [jwt] Token still valid, returning current token')

      return token
    },

    async session({ session, token }) {
      console.log('⚡ [session] callback START', new Date().toISOString())
      session.user = token.userData || session.user
      session.access_token = token.access_token as string
      session.error = token.error
      console.log('✅ [session] Returning session:', session)

      return session
    }
  },

  events: {
    async signOut() {
      console.log('👋 [events.signOut] User signed out', new Date().toISOString())
    }
  }
}
