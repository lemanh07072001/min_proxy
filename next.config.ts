import type { NextConfig } from 'next'


const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,

  // Đảm bảo không có redirect nào
  async redirects() {
    return []
  },

  // Thêm logging để debug
  logging: {
    fetches: {
      fullUrl: true
    }
  }
}


export default nextConfig
