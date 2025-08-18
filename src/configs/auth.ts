export const authConfig = {
  // NextAuth Configuration
  nextAuth: {
    secret: process.env.NEXTAUTH_SECRET || 'your-super-secret-key-here-change-in-production',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  
  // Laravel API Configuration
  laravel: {
    baseUrl: process.env.LARAVEL_API_URL || 'http://localhost:8000',
    endpoints: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
      refresh: '/api/auth/refresh',
      user: '/api/auth/user',
      forgotPassword: '/api/auth/forgot-password',
      resetPassword: '/api/auth/reset-password',
    }
  },
  
  // Session Configuration
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    strategy: 'jwt' as const,
  },
  
  // Pages Configuration
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  }
};
