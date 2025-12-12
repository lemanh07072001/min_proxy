import { NextResponse } from 'next/server'

import { withAuth } from 'next-auth/middleware'
import type { NextRequestWithAuth } from 'next-auth/middleware'

const privateRoutes = [
  '/overview',
  '/order-proxy',
  '/history-order',
  '/affiliate',
  '/transaction-history',
  '/dashboard',
  '/admin'
]

// Routes chỉ dành cho admin (role = 0)
const adminRoutes = ['/admin']

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Lấy mã ngôn ngữ từ URL (ví dụ: /vi/login -> 'vi')
    const lang = pathname.split('/')[1] || 'vi'

    // ⭐ LOGIC MỚI BẮT ĐẦU TỪ ĐÂY ⭐
    // Định nghĩa các trang xác thực (login, register, ...)
    const authRoutes = [`/${lang}/login`, `/${lang}/register`]

    // Kiểm tra xem trang hiện tại có phải là trang xác thực không
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // Nếu người dùng ĐÃ ĐĂNG NHẬP (có token) và đang cố vào trang login/register
    if (token && isAuthRoute) {
      // Chuyển hướng họ về trang overview
      return NextResponse.redirect(new URL(`/${lang}/overview`, req.url))
    }

    // Kiểm tra quyền truy cập admin (chỉ role = 0 mới được vào)
    const isAdminRoute = adminRoutes.some(route => pathname.includes(route))

    if (isAdminRoute && token?.role !== 0) {
      // Nếu không phải admin, chuyển hướng về trang overview
      return NextResponse.redirect(new URL(`/${lang}/overview`, req.url))
    }

    // ⭐ KẾT THÚC LOGIC MỚI ⭐

    // Nếu không thuộc trường hợp trên, cho phép request tiếp tục
    return NextResponse.next()
  },
  {
    callbacks: {
      // Logic gác cổng ở đây không thay đổi
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        const isPrivateRoute = privateRoutes.some(route => pathname.includes(route))

        // Nếu không phải trang private, luôn cho phép
        if (!isPrivateRoute) {
          return true
        }

        // Nếu là trang private, yêu cầu phải có token hợp lệ
        if (token && token.access_token && !token.error) {
          return true
        }

        // Nếu là trang private mà không có token, trả về false để chuyển hướng
        return false
      }
    },
    pages: {
      signIn: '/empty'
    }
  }
)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|manifest.json).*)']
}
