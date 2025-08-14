import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}

// (Tùy chọn) Chỉ áp dụng cho các route nhất định
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
