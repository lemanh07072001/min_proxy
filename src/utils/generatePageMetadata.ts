import type { Metadata } from 'next'

import type { Locale } from '@/configs/configi18n'
import { getServerBranding } from '@/utils/getServerBranding'

interface PageMetadataConfig {
  title: string
  description: string
  keywords?: string[]
  path?: string
  image?: string
  type?: 'website' | 'article' | 'product'
}

export async function generatePageMetadata(
  config: PageMetadataConfig,
  lang: Locale,
  basePath?: string
): Promise<Metadata> {
  const baseUrl = process.env.NEXTAUTH_URL || ''
  const fullPath = basePath ? `/${lang}${basePath}` : `/${lang}`
  const fullUrl = `${baseUrl}${fullPath}`

  const branding = await getServerBranding()
  const siteName = branding.site_name || ''

  const title = !siteName || config.title.includes(siteName)
    ? config.title
    : `${config.title} | ${siteName}`

  return {
    title,
    description: config.description,
    keywords: config.keywords || ['proxy'],
    ...(siteName ? { authors: [{ name: siteName }], creator: siteName, publisher: siteName } : {}),
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: baseUrl ? new URL(baseUrl) : undefined,
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
      type: (config.type || 'website') as 'website',
      locale: lang === 'vi' ? 'vi_VN' : lang === 'en' ? 'en_US' : lang === 'ja' ? 'ja_JP' : lang === 'ko' ? 'ko_KR' : 'vi_VN',
      url: fullUrl,
      title,
      description: config.description,
      siteName: siteName || undefined,
      ...(config.image || branding.og_image_url ? {
        images: [{ url: config.image || branding.og_image_url || '', width: 1200, height: 630, alt: title }]
      } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: config.description,
      ...(config.image || branding.og_image_url ? { images: [config.image || branding.og_image_url || ''] } : {}),
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
    ...(branding.favicon_url ? {
      icons: {
        icon: branding.favicon_url,
        shortcut: branding.favicon_url,
        apple: branding.favicon_url,
      },
    } : {}),
    manifest: '/manifest.json',
  }
}
