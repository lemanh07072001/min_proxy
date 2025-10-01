import { Metadata } from 'next'
import type { Locale } from '@/configs/configi18n'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

export function generateMetadata(
  config: SEOConfig,
  locale: Locale = 'vi'
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mktproxy.com'
  const siteName = 'MKT Proxy'
  
  const title = config.title.includes(siteName) 
    ? config.title 
    : `${config.title} | ${siteName}`
  
  const description = config.description
  const keywords = config.keywords || ['proxy', 'vpn', 'mạng', 'bảo mật']
  const image = config.image || '/images/logo/MKT_PROXY_2.png'
  const url = config.url || baseUrl
  
  const metadata: Metadata = {
    title,
    description,
    keywords,
    authors: [{ name: config.author || 'MKT Proxy' }],
    creator: 'MKT Proxy',
    publisher: 'MKT Proxy',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
      languages: {
        'vi': url.replace(/\/[a-z]{2}\//, '/vi/'),
        'en': url.replace(/\/[a-z]{2}\//, '/en/'),
        'cn': url.replace(/\/[a-z]{2}\//, '/cn/'),
        'ja': url.replace(/\/[a-z]{2}\//, '/ja/'),
        'ko': url.replace(/\/[a-z]{2}\//, '/ko/'),
      },
    },
    openGraph: {
      type: config.type || 'website',
      locale: locale === 'vi' ? 'vi_VN' : locale === 'en' ? 'en_US' : 'vi_VN',
      url,
      title,
      description,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(config.publishedTime && { publishedTime: config.publishedTime }),
      ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
  
  return metadata
}

// Utility function để tạo structured data cho các trang cụ thể
export function generateStructuredData(
  type: 'Organization' | 'WebSite' | 'WebPage' | 'Article' | 'Product',
  data: any
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mktproxy.com'
  
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  }
  
  // Thêm URL nếu chưa có
  if (!baseStructuredData.url) {
    baseStructuredData.url = baseUrl
  }
  
  return baseStructuredData
}

// Predefined SEO configs cho các trang phổ biến
export const seoConfigs = {
  home: {
    title: 'MKT Proxy - Dịch vụ Proxy Chất Lượng Cao',
    description: 'Dịch vụ proxy bảo mật, tốc độ cao với hỗ trợ đa quốc gia. Giải pháp mạng riêng ảo tin cậy cho doanh nghiệp và cá nhân.',
    keywords: ['proxy', 'vpn', 'mạng', 'bảo mật', 'proxy Việt Nam', 'proxy quốc tế'],
  },
  pricing: {
    title: 'Bảng Giá Proxy - MKT Proxy',
    description: 'Xem bảng giá proxy cạnh tranh với nhiều gói dịch vụ phù hợp. Hỗ trợ thanh toán linh hoạt, cam kết chất lượng.',
    keywords: ['giá proxy', 'bảng giá', 'proxy giá rẻ', 'gói proxy'],
  },
  about: {
    title: 'Về Chúng Tôi - MKT Proxy',
    description: 'Tìm hiểu về MKT Proxy - đơn vị cung cấp dịch vụ proxy uy tín với nhiều năm kinh nghiệm trong lĩnh vực bảo mật mạng.',
    keywords: ['về chúng tôi', 'giới thiệu', 'công ty proxy', 'uy tín'],
  },
  contact: {
    title: 'Liên Hệ - MKT Proxy',
    description: 'Liên hệ với MKT Proxy để được tư vấn và hỗ trợ. Hotline 24/7, email hỗ trợ nhanh chóng.',
    keywords: ['liên hệ', 'hỗ trợ', 'tư vấn', 'hotline'],
  },
}
