
export function middleware(request: NextRequest) {

  return NextResponse.next();
}

// (Tùy chọn) Chỉ áp dụng cho các route nhất định
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};