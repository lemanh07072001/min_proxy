declare module 'tailwindcss-logical'

declare module 'next-auth' {
  interface Session {
    access_token?: string
    error?: string
    role?: string
  }

  interface User {
    access_token?: string
    accessTokenExpires?: number
    userData?: any
    role?: string
  }
}

declare module 'next-auth/core/types' {
  interface Session {
    access_token?: string
    error?: string
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token?: string
    accessTokenExpires?: number
    userData?: any
    error?: string
    lastRefreshTime?: number
    role?: string
  }
}
