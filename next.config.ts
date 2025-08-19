import type { NextConfig } from 'next'


const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,

  async redirects() {
    return [
      {
        source: '/',
        destination: '/en', // Đặt locale mặc định của bạn tại đây
        permanent: false, // Sử dụng false để tránh cache vĩnh viễn
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  optimizeFonts: false,

  // Thêm logging để debug
  logging: {
    fetches: {
      fullUrl: true
    }
  }
}


export default nextConfig
