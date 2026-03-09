// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Style Imports - CSS Variables phải được import đầu tiên
import '@/app/css-variables.css'
import '@/app/globals.css'
import '@/app/shared-layout.css' // CSS chung cho cả private và public
import '@/app/root.css'
// import '@/app/figtree.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

import { Figtree } from 'next/font/google'

import { headers } from 'next/headers'

// Utils
import type { Metadata } from 'next'

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

import { getServerUserData } from '@/utils/serverSessionValidation'

// import { getServerSession } from 'next-auth/next' // Removed unused import

import { i18n } from '@/configs/configi18n'

import '@/app/[lang]/(landing-page)/main.css'

import type { Locale } from '@/configs/configi18n'

import type { ChildrenType } from '@core/types'

import TanstackProvider from '@/components/TanstackProvider'

import { getSystemMode } from '@core/utils/serverHelpers'
import TranslationWrapper from '@/hocs/TranslationWrapper'

import { ModalContextProvider } from '@/app/contexts/ModalContext'
import { BrandingProvider } from '@/app/contexts/BrandingContext'

import { authOptions } from '@/libs/auth'

import I18nextProvider from '@/app/i18n-provider'

import StoreProvider from '@/components/StoreProvider'
import ReferralHandler from '@/components/ReferralHandler'
import { NextAuthProvider } from '@/app/contexts/nextAuthProvider'
import NavigationProgress from '@/components/NavigationProgress'

import { getServerSession } from 'next-auth/next'

import { siteConfig } from '@/configs/siteConfig'

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap'
})

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mktproxy.com'

  return {
    title: `${siteConfig.name} - ${siteConfig.description}`,
    description:
      'Dịch vụ proxy bảo mật, tốc độ cao với hỗ trợ đa quốc gia. Giải pháp mạng riêng ảo tin cậy cho doanh nghiệp và cá nhân.',
    keywords: [
      'proxy',
      'vpn',
      'mạng',
      'bảo mật',
      'proxy Việt Nam',
      'proxy quốc tế',
      'mạng riêng ảo',
      'bảo mật internet'
    ],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mktproxy.com'),
    alternates: {
      canonical: `/${resolvedParams.lang}`,
      languages: {
        vi: '/vi',
        en: '/en',
        ja: '/ja',
        ko: '/ko'
      }
    },

    openGraph: {
      type: 'website',
      locale: resolvedParams.lang === 'vi' ? 'vi_VN' : resolvedParams.lang === 'en' ? 'en_US' : 'vi_VN',
      url: `${baseUrl}/${resolvedParams.lang}`,
      title: `${siteConfig.name} - ${siteConfig.description}`,
      description:
        'Dịch vụ proxy bảo mật, tốc độ cao với hỗ trợ đa quốc gia. Giải pháp mạng riêng ảo tin cậy cho doanh nghiệp và cá nhân.',
      siteName: siteConfig.name,
      images: [
        {
          url: '/images/logo/image.png',
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} Logo`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteConfig.name} - ${siteConfig.description}`,
      description: 'Dịch vụ proxy bảo mật, tốc độ cao với hỗ trợ đa quốc gia.',
      images: ['/images/logo/image.png']
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    icons: {
      icon: siteConfig.favicon,
      shortcut: siteConfig.favicon,
      apple: siteConfig.favicon
    },
    manifest: '/manifest.json'
  }
}

const RootLayout = async (props: ChildrenType & { params: Promise<{ lang: string }> }) => {
  const { children } = props

  const params = await props.params

  const direction = i18n.langDirection[params.lang as Locale]

  // Fetch TẤT CẢ song song — tránh waterfall tuần tự
  const [headersList, systemMode, user, session] = await Promise.all([
    headers(),
    getSystemMode(),
    getServerUserData(),
    getServerSession(authOptions as any) as any
  ])

  return (
    <TranslationWrapper headersList={headersList} lang={params.lang as Locale}>
      <html id='__next' lang={params.lang} dir={direction} className={figtree.variable} suppressHydrationWarning>
        <head>
          <style
            dangerouslySetInnerHTML={{
              __html: `html:root {
  --primary-hover: ${siteConfig.primaryHover} !important;
  --primary-gradient: ${siteConfig.primaryGradient} !important;
}`
            }}
          />
        </head>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          <NavigationProgress />
          <I18nextProvider locale={params.lang as Locale}>
            <NextAuthProvider
              refetchInterval={4 * 60}
              refetchOnWindowFocus={false}
              session={session as any}
              basePath={process.env.NEXTAUTH_BASEPATH}
            >
              <TanstackProvider>
                <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
                <BrandingProvider>
                  <StoreProvider initialUser={user}>
                    <ModalContextProvider>
                      <ReferralHandler />
                      <div className='relative z-10 main'>{children}</div>
                    </ModalContextProvider>
                  </StoreProvider>
                </BrandingProvider>
              </TanstackProvider>
            </NextAuthProvider>
          </I18nextProvider>
        </body>
      </html>
    </TranslationWrapper>
  )
}

export default RootLayout
