/**
 * Centralized site configuration — reads from env vars.
 * To create a sub-site, deploy the same source with a different .env file.
 */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'MKT Proxy',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://mktproxy.com',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8002/api',
  apiDocsUrl: process.env.NEXT_PUBLIC_API_DOCS_URL || process.env.NEXT_PUBLIC_API_URL || '',
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'https://socket.mktproxy.com',
  logo: process.env.NEXT_PUBLIC_LOGO_PATH || '/images/logo/Logo_MKT_Proxy.png',
  favicon: process.env.NEXT_PUBLIC_FAVICON_PATH || '/images/logo/MKT_PROXY_2.png',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Dịch vụ Proxy Chất Lượng Cao',
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#FC4336',
  primaryHover: process.env.NEXT_PUBLIC_PRIMARY_HOVER || '#e63946',
  primaryGradient: process.env.NEXT_PUBLIC_PRIMARY_GRADIENT || 'linear-gradient(45deg, #FC4336, #F88A4B)',
}
