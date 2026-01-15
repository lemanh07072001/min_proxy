import type { Metadata } from 'next'

import type { Locale } from '@/configs/configi18n'

interface PageMetadataConfig {
  title: string
  description: string
  keywords?: string[]
  path?: string
  image?: string
  type?: 'website' | 'article' | 'product'
}

export function generatePageMetadata(
  config: PageMetadataConfig,
  lang: Locale,
  basePath?: string
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mktproxy.com'
  const fullPath = basePath ? `/${lang}${basePath}` : `/${lang}`
  const fullUrl = `${baseUrl}${fullPath}`
  
  const title = config.title.includes('MKT Proxy') 
    ? config.title 
    : `${config.title} | MKT Proxy`
  
  return {
    title,
    description: config.description,
    keywords: config.keywords || ['proxy', 'vpn', 'mạng', 'bảo mật'],
    authors: [{ name: 'MKT Proxy' }],
    creator: 'MKT Proxy',
    publisher: 'MKT Proxy',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullPath,
      languages: {
        'vi': basePath ? `/vi${basePath}` : '/vi',
        'en': basePath ? `/en${basePath}` : '/en',
        'ja': basePath ? `/ja${basePath}` : '/ja',
        'ko': basePath ? `/ko${basePath}` : '/ko',
      },
    },
    openGraph: {
      type: config.type || 'website',
      locale: lang === 'vi' ? 'vi_VN' : lang === 'en' ? 'en_US' : 'vi_VN',
      url: fullUrl,
      title,
      description: config.description,
      siteName: 'MKT Proxy',
      images: [
        {
          url: config.image || '/images/logo/MKT_PROXY_2.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: config.description,
      images: [config.image || '/images/logo/MKT_PROXY_2.png'],
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
    icons: {
      icon: '/images/logo/MKT_PROXY_2.png',
      shortcut: '/images/logo/MKT_PROXY_2.png',
      apple: '/images/logo/MKT_PROXY_2.png',
    },
    manifest: '/manifest.json',
  }
}

// Predefined metadata configs cho các trang phổ biến
export const pageMetadataConfigs = {
  home: {
    title: 'MKT Proxy - Dịch vụ Proxy Chất Lượng Cao',
    description: 'Dịch vụ proxy bảo mật, tốc độ cao với hỗ trợ đa quốc gia. Giải pháp mạng riêng ảo tin cậy cho doanh nghiệp và cá nhân.',
    keywords: ['proxy', 'vpn', 'mạng', 'bảo mật', 'proxy Việt Nam', 'proxy quốc tế'],
  },
  pricing: {
    title: 'Bảng Giá Proxy - MKT Proxy',
    description: 'Xem bảng giá proxy cạnh tranh với nhiều gói dịch vụ phù hợp. Hỗ trợ thanh toán linh hoạt, cam kết chất lượng.',
    keywords: ['giá proxy', 'bảng giá', 'proxy giá rẻ', 'gói proxy'],
    path: '/pricing',
  },
  about: {
    title: 'Về Chúng Tôi - MKT Proxy',
    description: 'Tìm hiểu về MKT Proxy - đơn vị cung cấp dịch vụ proxy uy tín với nhiều năm kinh nghiệm trong lĩnh vực bảo mật mạng.',
    keywords: ['về chúng tôi', 'giới thiệu', 'công ty proxy', 'uy tín'],
    path: '/about',
  },
  contact: {
    title: 'Liên Hệ - MKT Proxy',
    description: 'Liên hệ với MKT Proxy để được tư vấn và hỗ trợ. Hotline 24/7, email hỗ trợ nhanh chóng.',
    keywords: ['liên hệ', 'hỗ trợ', 'tư vấn', 'hotline'],
    path: '/contact',
  },
  features: {
    title: 'Tính Năng - MKT Proxy',
    description: 'Khám phá các tính năng nổi bật của dịch vụ proxy MKT: tốc độ cao, bảo mật tuyệt đối, hỗ trợ đa giao thức.',
    keywords: ['tính năng', 'proxy features', 'bảo mật', 'tốc độ'],
    path: '/features',
  },
}
