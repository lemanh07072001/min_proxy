// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Style Imports - CSS Variables phải được import đầu tiên
import '@/app/css-variables.css'
import '@/app/globals.css'
import '@/app/shared-layout.css' // CSS chung cho cả private và public
import '@/app/root.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

import { Figtree } from 'next/font/google'

import { headers } from 'next/headers'

import { usePathname } from 'next/navigation'

// Utils
import { getServerUserData } from '@/utils/serverSessionValidation'

import type { Metadata } from 'next'

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// import { getServerSession } from 'next-auth' // Removed unused import

import { i18n } from '@/configs/configi18n'

import '@/app/[lang]/(landing-page)/main.css'

import type { Locale } from '@/configs/configi18n'

import type { ChildrenType } from '@core/types'

import TanstackProvider from '@/components/TanstackProvider'

import { getSystemMode } from '@core/utils/serverHelpers'
import TranslationWrapper from '@/hocs/TranslationWrapper'

import { ModalContextProvider } from '@/app/contexts/ModalContext'

import { authOptions } from '@/libs/auth'

import I18nextProvider from '@/app/i18n-provider'

import StoreProvider from '@/components/StoreProvider'
import { setUser, addBalance } from '@/store/userSlice'
import ReferralHandler from '@/components/ReferralHandler'
import { NextAuthProvider } from '@/app/contexts/nextAuthProvider'
import { getServerSession } from 'next-auth/next'

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: 'MKT Proxy - Dịch vụ Proxy Chất Lượng Cao',
    template: '%s | MKT Proxy'
  },
  description: 'Dịch vụ proxy bảo mật, tốc độ cao với hỗ trợ đa quốc gia. Giải pháp mạng riêng ảo tin cậy cho doanh nghiệp và cá nhân.',
  keywords: ['proxy', 'vpn', 'mạng', 'bảo mật', 'proxy Việt Nam', 'proxy quốc tế', 'mạng riêng ảo', 'bảo mật internet'],
  authors: [{ name: 'MKT Proxy' }],
  creator: 'MKT Proxy',
  publisher: 'MKT Proxy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mktproxy.com'),
  alternates: {
    canonical: '/',
    languages: {
      'vi': '/vi',
      'en': '/en',
      'ja': '/ja',
      'ko': '/ko',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://mktproxy.com',
    title: 'MKT Proxy - Dịch vụ Proxy Chất Lượng Cao',
    description: 'Dịch vụ proxy bảo mật, tốc độ cao với hỗ trợ đa quốc gia. Giải pháp mạng riêng ảo tin cậy cho doanh nghiệp và cá nhân.',
    siteName: 'MKT Proxy',
    images: [
      {
        url: '/images/logo/MKT_PROXY_2.png',
        width: 1200,
        height: 630,
        alt: 'MKT Proxy Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MKT Proxy - Dịch vụ Proxy Chất Lượng Cao',
    description: 'Dịch vụ proxy bảo mật, tốc độ cao với hỗ trợ đa quốc gia.',
    images: ['/images/logo/MKT_PROXY_2.png'],
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

export const revalidate = 0 //

const RootLayout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const { children } = props

  const params = await props.params

  const headersList = await headers()
  const systemMode = await getSystemMode()

  const direction = i18n.langDirection[params.lang]

  // ✅ Sử dụng server-side utility để lấy user data
  const user = await getServerUserData()
  
  // ✅ Lấy session cho NextAuth
  const session = await getServerSession(authOptions as any) as any

  return (
    <TranslationWrapper headersList={headersList} lang={params.lang}>
      <html id='__next' lang={params.lang} dir={direction} className={figtree.variable} suppressHydrationWarning>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="MKT Proxy - Dịch vụ proxy chất lượng cao, bảo mật tuyệt đối. Hỗ trợ đa quốc gia, tốc độ nhanh, giá cả hợp lý." />
          <meta name="keywords" content="proxy, vpn, mạng, bảo mật, proxy Việt Nam, proxy quốc tế, mạng riêng ảo, bảo mật internet" />
          <meta name="author" content="MKT Proxy" />
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
          <meta name="theme-color" content="#1976d2" />
          
          {/* Open Graph Meta Tags */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="MKT Proxy - Dịch vụ Proxy Chất Lượng Cao" />
          <meta property="og:description" content="Dịch vụ proxy bảo mật, tốc độ cao với hỗ trợ đa quốc gia. Giải pháp mạng riêng ảo tin cậy cho doanh nghiệp và cá nhân." />
          <meta property="og:image" content="/images/logo/MKT_PROXY_2.png" />
          <meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL || 'https://mktproxy.com'} />
          <meta property="og:site_name" content="MKT Proxy" />
          <meta property="og:locale" content={params.lang === 'vi' ? 'vi_VN' : params.lang === 'en' ? 'en_US' : 'vi_VN'} />
          
          {/* Twitter Card Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="MKT Proxy - Dịch vụ Proxy Chất Lượng Cao" />
          <meta name="twitter:description" content="Dịch vụ proxy bảo mật, tốc độ cao với hỗ trợ đa quốc gia." />
          <meta name="twitter:image" content="/images/logo/MKT_PROXY_2.png" />
          
          {/* Additional SEO Meta Tags */}
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="MKT Proxy" />
          
          {/* Favicon and Icons */}
          <link rel="icon" href="/images/logo/MKT_PROXY_2.png" />
          <link rel="apple-touch-icon" href="/images/logo/MKT_PROXY_2.png" />
          <link rel="manifest" href="/manifest.json" />
          
          {/* Preconnect to external domains for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          {/* Structured Data - JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "MKT Proxy",
                "description": "Dịch vụ proxy chất lượng cao, bảo mật tuyệt đối",
                "url": process.env.NEXT_PUBLIC_APP_URL || "https://mktproxy.com",
                "logo": "/images/logo/MKT_PROXY_2.png",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer service",
                  "availableLanguage": ["Vietnamese", "English"]
                },
                "sameAs": [
                  "https://facebook.com/mktproxy",
                  "https://twitter.com/mktproxy"
                ]
              })
            }}
          />
        </head>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          <I18nextProvider locale={params.lang}>
            <NextAuthProvider session={session as any} basePath={process.env.NEXTAUTH_BASEPATH}>
              <TanstackProvider>
                <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
                <StoreProvider initialUser={user}>
                  <ModalContextProvider>
                    <ReferralHandler />
                    {children}
                  </ModalContextProvider>
                </StoreProvider>
              </TanstackProvider>
            </NextAuthProvider>
          </I18nextProvider>
        </body>
      </html>
    </TranslationWrapper>
  )
}

export default RootLayout
