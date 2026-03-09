/**
 * API URL tập trung - tất cả các file đều import từ đây.
 *
 * Client-side (browser): dùng NEXT_PUBLIC_API_URL
 * Server-side (SSR/RSC): dùng API_URL (private, không expose ra browser)
 */

// Dùng cho client components & axios
export const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL!

// Dùng cho server components & server-side fetch (API route, SSR)
export const SERVER_API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL!
