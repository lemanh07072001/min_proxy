// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

// Types are now defined in declarations.d.ts

// Token refresh được xử lý bởi useAxiosAuth

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
    async jwt({ token, user, account, trigger, session }) {
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

      return token
    },

    async session({ session, token }) {
      session.user = token.userData || session.user
      session.access_token = token.access_token as string
      session.error = token.error

      return session
    }
  },

  events: {
    async signOut() {
      // User signed out
    }
  }
}
