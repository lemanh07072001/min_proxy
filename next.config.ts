import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,

  async redirects() {
    return [
      {
        source: '/((?!(?:en|vi)\\b)):path',
        destination: '/vi/:path',
        permanent: false
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },

  // Thêm logging để debug
  logging: {
    fetches: {
      fullUrl: true
    }
  }
}

export default nextConfig
