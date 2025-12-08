import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getToken } from 'next-auth/jwt'

// Pre-compiled Sets cho lookup nhanh O(1)
const privateRoutesSet = new Set([
  'overview',
  'order-proxy',
  'history-order',
  'affiliate',
  'transaction-history',
  'dashboard',
  'admin'
])

const adminRoutesSet = new Set(['admin'])
const authRoutesSet = new Set(['login', 'register'])
const validLangs = new Set(['vi', 'en', 'cn', 'ko', 'ja'])

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip static files và API routes sớm
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // files với extension
  ) {
    return NextResponse.next()
  }

  // Parse path một lần duy nhất
  const segments = pathname.split('/').filter(Boolean)
  const lang = validLangs.has(segments[0]) ? segments[0] : 'vi'
  const route = segments[1] || ''

  // Skip nếu không phải route cần check
  const isPrivateRoute = privateRoutesSet.has(route)
  const isAuthRoute = authRoutesSet.has(route)

  if (!isPrivateRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  // Chỉ lấy token khi thực sự cần
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  })

  // User đã login cố vào login/register -> redirect về overview
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL(`/${lang}/overview`, req.url))
  }

  // Chưa login cố vào private route -> redirect về login
  if (!token && isPrivateRoute) {
    return NextResponse.redirect(new URL(`/${lang}/login`, req.url))
  }

  // Kiểm tra token hợp lệ cho private routes
  if (isPrivateRoute) {
    const tokenAny = token as any

    if (!tokenAny?.access_token || tokenAny?.error) {
      return NextResponse.redirect(new URL(`/${lang}/login`, req.url))
    }

    // Admin route check
    if (adminRoutesSet.has(route)) {
      const role = tokenAny?.role
      const isAdmin = role === 0 || role === '0' || role === 'admin'

      if (!isAdmin) {
        return NextResponse.redirect(new URL(`/${lang}/overview`, req.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - images và public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|manifest.json).*)'
  ]
}
