import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

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

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
