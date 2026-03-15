/**
 * Centralized site configuration — reads from env vars.
 *
 * Site con: .env để trống → tất cả rỗng → admin setup qua UI.
 * Fallback KHÔNG hardcode "MKT Proxy" — để site con không bị lộ thông tin site mẹ.
 */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || '',
  url: process.env.NEXT_PUBLIC_APP_URL || '',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8002/api',
  apiDocsUrl: process.env.NEXT_PUBLIC_API_DOCS_URL || process.env.NEXT_PUBLIC_API_URL || '',
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || '',
  logo: process.env.NEXT_PUBLIC_LOGO_PATH || '',
  favicon: process.env.NEXT_PUBLIC_FAVICON_PATH || '',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '',
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#FC4336',
  primaryHover: process.env.NEXT_PUBLIC_PRIMARY_HOVER || '#e63946',
  primaryGradient: process.env.NEXT_PUBLIC_PRIMARY_GRADIENT || 'linear-gradient(45deg, #FC4336, #F88A4B)',
}
