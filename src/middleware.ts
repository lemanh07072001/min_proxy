import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequestWithAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Chỉ áp dụng cho private routes
    if (pathname.includes('/(private)')) {
      // Kiểm tra nếu session có error
      if (token?.error === 'RefreshAccessTokenError') {
        console.log('🛡️ [middleware] Session has refresh error, redirecting to login')
        return NextResponse.redirect(new URL('/login', req.url))
      }

      // Kiểm tra nếu không có access_token
      if (!token?.access_token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Nếu là public route, luôn cho phép
        if (pathname.includes('/(public)') || pathname.includes('/(landing-page)')) {
          return true
        }

        // Nếu là private route, kiểm tra token
        if (pathname.includes('/(private)')) {
          // Kiểm tra cơ bản: có token và không có error
          if (token && !token.error && token.access_token) {
            return true
          } else {
            console.log('🛡️ [middleware] Unauthorized access to private route')
            return false // Sẽ redirect về trang login được cấu hình trong NextAuth
          }
        }

        return true
      }
    },
    pages: {
      signIn: '/login' // Trang login mặc định
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
