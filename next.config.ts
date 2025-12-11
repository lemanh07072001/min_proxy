import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  typescript: {
    ignoreBuildErrors: true
  },
  turbopack: {
    root: process.cwd()
  },
  images: {
    unoptimized: false,
    remotePatterns: [],
  },

  async redirects() {
    return [
      {
        source: '/', // khi truy cập đúng root domain
        destination: '/vi', // tự động chuyển sang /vi
        permanent: false // 307 tạm thời, đổi thành true nếu muốn 308 vĩnh viễn
      },
      {
        source: '/:path((?!vi|en|cn|ko|ja|robots\\.txt|sitemap\\.xml|manifest\\.json|favicon\\.ico|_next|api).*)',
        destination: '/vi/:path',
        permanent: false
      }
    ]
  },

  // Thêm logging để debug
  logging: {
    fetches: {
      fullUrl: true
    }
  }
}

export default nextConfig
