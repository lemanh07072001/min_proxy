/**
 * Centralized site configuration — chỉ giữ URL và default colors.
 * Branding (name, logo, favicon, description) lấy từ DB qua API /get-branding-settings.
 */
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_APP_URL || '',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8002/api',
  apiDocsUrl: process.env.NEXT_PUBLIC_API_DOCS_URL || process.env.NEXT_PUBLIC_API_URL || '',
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || '',

  // Default colors — dùng khi DB chưa cấu hình
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#FC4336',
  primaryHover: process.env.NEXT_PUBLIC_PRIMARY_HOVER || '#e63946',
  primaryGradient: process.env.NEXT_PUBLIC_PRIMARY_GRADIENT || 'linear-gradient(45deg, #FC4336, #F88A4B)',
}
